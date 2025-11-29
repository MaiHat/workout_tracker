import React, { useContext, useState, useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import { db } from "../firebase/firebase";
import { collection, getDocs, getDoc, addDoc, doc, setDoc, Timestamp, query, where, updateDoc, orderBy, limit, deleteDoc } from "firebase/firestore";
const WorkoutsContext = React.createContext();

function useWorkouts() {
  return useContext(WorkoutsContext);
}
//日付をYYYY/MM/DDに変えるためのコード
const pad = (n) => String(n).padStart(2, "0");  //1を01にする
const fmtYMD = (d) => `${d.getFullYear()}/${pad(d.getMonth()+1)}/${pad(d.getDate())}`;
  

function WorkoutsContextProvider({ children }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); //今の月 ex, 6月だと5
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); //今の年　ex, 2025
  const [monthlyWorkoutDates, setMonthlyWorkoutDates] = useState([]);  
  const [monthlyWorkoutDays, setMonthlyWorkoutDays] = useState([]);
  const [maxRmOfTheDay, setMaxRmOfTheDay] = useState();
  const [maxWeightOfTheDay, setMaxWeightOfTheDay] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [displayedWorkouts, setDisplayedWorkouts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [latestData, setLatestData] = useState(null);
  
 
  async function fetchBodyParts() {
    const snapshot = await getDocs(collection(db, "users", currentUser.uid, "bodyParts")); 
    //これはQuerySnapshotのオブジェクトでfirestore独自のデータ構造。中身にアクセスするには.docsを使う
    const fetched = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setBodyParts(fetched);
  }

  async function fetchWorkoutData() {
      //Timestamp is too acurate(by ミリseconds) need to tell where to devide.
      //JSのデータ型をfirestoreのtimestamp型に変換し、0時から11:59までに設定
      
      const start = Timestamp.fromDate(new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
         0, 0, 0, 0
      ));
      const end = Timestamp.fromDate(new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        23, 59, 59, 999
      ));
  
      const q = query(collection(db, "users", currentUser.uid, "workouts"), 
        where("date", ">=", start), 
        where("date", "<=", end),
        orderBy("date")
      );
        const snapshot = await getDocs(q);
        //Firesotoreから欲しいデータを取得しsnapshotに入れる
        const fetched = snapshot.docs.map(doc => ({
        ...doc.data(), 
          id: doc.id,
        }
      ));
        //取り出したデータはJSXで読めない状態なので読める形に変換してfetchedに入れている (snapshot.docs[0].id でDocument Id表示できる)
        //最初はworkoutをsaveしたときにuuid作られるように設定していたが、
        // firestoreのdocument idをidとしてローカルでも使いたいため、id: doc.idを最後に持ってきて
        // document idがidとして上書きされるようにしている
        setDisplayedWorkouts(fetched);
  }
  
  async function fetchPrevWorkout(selectedWorkout) {
      const q = query(collection(db, "users", currentUser.uid, "workouts"), 
        where("bodyPart", "==", selectedWorkout.id),
        where("workoutName", "==", selectedWorkout.workoutName),
        orderBy("date", "desc"),
        limit(1)
      );
      try {
        const snapshot = await getDocs(q);
        if(!snapshot.empty) {
          const doc = snapshot.docs[0];
          const data = doc.data();
  
          console.log("latest workout:", {
            date: data.date.toDate(),
            sets: data.sets
          });
          setLatestData({
            id: doc.id,
            date: data.date.toDate(),
            sets: data.sets
            });
        } else {
          console.log("no histry");
          return null;
        }
      } catch (error) {
          console.log(error);
          return null;
        }
  }

  //workoutStatsから選択月全部のデータを取得
  async function getMonthlyWorkoutStats() {
    if (!currentUser) return;

   const start = Timestamp.fromDate(new Date(
    currentYear, currentMonth, 1, 0, 0, 0, )  //　月の１日 0am)
    );
    const end = Timestamp.fromDate(new Date(
      currentYear, currentMonth + 1, //翌月
                0, 23, 59, 59, 999) //翌月の０日は今月の最終日を指す。//23:59:59で１日中含まれるようにしている
    );
    const q = query(
        collection(db, "users", currentUser.uid, "workoutStats"), 
        where("date", ">=", start), 
        where("date", "<=", end),
        orderBy("date", "asc")
       );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.log("No workout data for this month");
      setMonthlyWorkoutDates([]);
      setMonthlyWorkoutDays([]);
      setMonthlyStats([]);
      return;
    }
    const dateSet = new Set(); //new Setは同じ数字があっても一回しか保存しない
    const daysSet = new Set();
    const allStatsArray = []; //for graph
    const bodyPartStats = {};
    const workoutNameStats = {};
    snapshot.forEach(doc => {
      const data = doc.data();
      const workoutDates = doc.data().date?.toDate(); 
      //workoutsのdate(Timestamp型)があればJS dateに変換

      if(workoutDates) {
        const dateYMD = fmtYMD(workoutDates);  //YMD formatに変換
        const days = workoutDates.getDate(); // 日だけ抽出（1〜31)
        dateSet.add(dateYMD); //dateSetにYYYY-MM-DD形式の日付を重複させず追加　.add();は追加
        daysSet.add(days);  //daysSetに日付の数字だけを重複させずに追加
        //all
        allStatsArray.push({
          date: dateYMD,
          maxRM: data.all?.maxRM || 0,
          maxWeight: data.all?.maxWeight || 0,
        });
        //bodyPart別
        if (data.bodyParts) {
          Object.entries(data.bodyParts).forEach(([part, stats]) => {
            if (!bodyPartStats[part]) bodyPartStats[part] = [];
            bodyPartStats[part].push({
              date: dateYMD,
              maxRM: stats.maxRM || 0,
              maxWeight: stats.maxWeight || 0 
            });
          });
        }
        //workoutName別
        if (data.workoutNames) {
          Object.entries(data.workoutNames).forEach(([name, stats]) => {
            if (!workoutNameStats[name]) workoutNameStats[name] = [];
            workoutNameStats[name].push({
              date: dateYMD,
              maxRM: stats.maxRM || 0,
              maxWeight: stats.maxWeight || 0
            });
          });
        }
        }
      });
    //stateの更新
    const monthlyWorkoutDates = Array.from(dateSet);
    setMonthlyWorkoutDates(monthlyWorkoutDates);
    const archivedDays = Array.from(daysSet);  //daysは配列ではないので配列にするためのコード
    setMonthlyWorkoutDays(archivedDays);
    setMonthlyStats({
      all: allStatsArray,
      byBodyPart: bodyPartStats,
      byWorkoutName: workoutNameStats,
    });
    console.log(monthlyStats, archivedDays);
  }
  
  //workoutsからデータを取り出しmax値を計算、workoutStatsに保存
  async function getMaxDataOfTheDay(selectedDate) {
    if (!selectedDate || !(selectedDate instanceof Date)) {
    console.error("selectedDate must be a Date object:", selectedDate);
    return ;
    } //これはundefined や "2025-11-12"（文字列）が渡されたときdebugが楽になるためのコード。selectedDateがDateオブジェクトになっているか確認している
    
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const start = Timestamp.fromDate(startOfDay);
    const end = Timestamp.fromDate(endOfDay);

    const q = query(
      collection(db, "users", currentUser.uid, "workouts"), 
      where("date", ">=", start), 
      where("date", "<=", end),
      orderBy("date", "asc")
    );

    const snapshot = await getDocs(q);

    const dateKey = startOfDay.toISOString().split("T")[0]; //日付キー(statsドキュメント名)を作る

    //その日のworkoutが0 => statsを削除
    if (snapshot.empty) {
      setMaxRmOfTheDay(0);
      setMaxWeightOfTheDay(0);
      try {
        await deleteDoc(doc(db, "users", currentUser.uid, "workoutStats", dateKey));
        console.log("Deleted empty workoutStats:", dateKey);
      } catch (err) {
      console.log("err deleting stats:", err);
      }
      return;
    }

    let overallMaxRM = 0;
    let overallMaxWeight = 0;
    const bodyPartStats = {};   // 例{ arms: {maxRM:60, maxWeight:40}, legs: {...} }
    const workoutNameStats = {}; // 例{ bench_press: {maxRM:70, maxWeight:45}, squat: {...} }

    snapshot.docs.forEach((doc) => {
      const workout = doc.data();
      const { bodyPart, workoutName, sets} = workout;

      sets.forEach((set) => {
        const rm = set.RM;
        const weight = set.weight;
        // 全体最大
        if (rm >overallMaxRM) overallMaxRM = rm;
        if (weight > overallMaxWeight) overallMaxWeight = weight;
        //bodyPart別集計
        if (!bodyPartStats[bodyPart]) {
          bodyPartStats[bodyPart] = { maxRM: rm, maxWeight: weight };
        } else {
          bodyPartStats[bodyPart].maxRM = Math.max(bodyPartStats[bodyPart].maxRM, rm);
          bodyPartStats[bodyPart].maxWeight = Math.max(bodyPartStats[bodyPart].maxWeight, weight);
        }
        //workoutName別集計
        if (!workoutNameStats[workoutName]) {
          workoutNameStats[workoutName] = { maxRM: rm, maxWeight: weight };
        } else {
          workoutNameStats[workoutName].maxRM = Math.max(workoutNameStats[workoutName].maxRM, rm);
          workoutNameStats[workoutName].maxWeight = Math.max(workoutNameStats[workoutName].maxWeight, weight);
        }
      });
    });
    //stateの更新
    setMaxRmOfTheDay(overallMaxRM);
    setMaxWeightOfTheDay(overallMaxWeight);

    const newWorkoutStat = {
      date: Timestamp.fromDate(selectedDate),
      all: { maxRM: overallMaxRM, maxWeight: overallMaxWeight },
      bodyParts: bodyPartStats,
      workoutNames: workoutNameStats,
    };

    try{
      await setDoc(
        doc(db, "users", currentUser.uid, "workoutStats", dateKey),
        newWorkoutStat,
        { merge: true } //その日のデータがあれば上書き、なければ新規作成
      );
      console.log("workoutStats updated:", dateKey, newWorkoutStat);
    } catch (error) {
      console.log(error);
    }

    {/* 保存されるデータ例
     {  "date": "2025-11-12T08:00:00.000Z",
        "all": { "maxRM": 85, "maxWeight": 55 },
        "bodyParts": {
          "arms": { "maxRM": 60, "maxWeight": 45 },
          "legs": { "maxRM": 85, "maxWeight": 55 }
        },
        "workoutNames": {
          "bench_press": { "maxRM": 70, "maxWeight": 50 },
          "squat": { "maxRM": 85, "maxWeight": 55 }
        }
      } */}
  }

  {/*useEffect( () => {
     fetchBodyParts(),
     getMonthlyWorkoutDatesAndDays();
  }, [currentMonth, currentYear, currentUser]); */}
  
  //saveボタン押したときにworkoutの内容をDBに保存または上書きする＆グラフ用のデータを保存または上書きする
  async function saveWorkout({ 
    isEditing, 
    setsWithRM,
    mw, 
    mr, 
    selectedWorkout, 
    selectedDate, 
    editingWorkoutId
  }) {
    try {
      const workoutDate = selectedDate || new Date();
      const workoutName = selectedWorkout.workoutName;
      const bodyPart = selectedWorkout.id;

      const start =  new Date(workoutDate);
      start.setHours(0,0,0,0);
      const end =  new Date(workoutDate);
      end.setHours(23,59,59,999);

      const workoutRef = collection(db, "users", currentUser.uid, "workouts");
    

      //編集してる場合
      if (isEditing) {
        await updateDoc(
          doc(db, "users", currentUser.uid, "workouts", editingWorkoutId),
          {
            sets: setsWithRM,
            date: Timestamp.fromDate(workoutDate),
            bodyPart: bodyPart,
            workoutName: workoutName,
            maxWeight: mw,
            maxRm: mr,
          }
        );
        return { success: true };
      }
     
      //同じ日に同じ種目のデータがあるか確認
      const q = query(
      workoutRef,
      where("workoutName", "==", workoutName),
      where("bodyPart", "==", bodyPart),
      where("date", ">=", start),
      where("date", "<=", end)
      );

      const snapshot = await getDocs(q);

      //新規だけど同じ日、同じ種目が存在する => marge
      if (!snapshot.empty) {
        const existingDoc = snapshot.docs[0];
        const existingData = existingDoc.data();
        const mergedSets = [...existingData.sets, ...setsWithRM];

        const newMaxWeight = Math.max(existingData.maxWeight || 0, mw);
        const newMaxRm = Math.max(existingData.maxRm || 0, mr);

        await updateDoc(existingDoc.ref, {
          sets: mergedSets,
          maxWeight: newMaxWeight,
          maxRm: newMaxRm,
        });
        console.log("workout merged:", mergedSets);
        return { success: true, merged: true };
      }
    
      //save as new workout
      const newWorkout = {
        sets: setsWithRM,
        date: Timestamp.fromDate(workoutDate),
        bodyPart: bodyPart,
        workoutName: workoutName,
        maxWeight: mw,
        maxRm: mr,
      }
      await addDoc(workoutRef, newWorkout);
      console.log("Workout saved:", newWorkout);
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, error: e };
    }
  }
  
  async function addWorkoutName(rawBodyPart, rawWorkoutName, compareBodyPart, compareWorkoutName, currentUser) {
    console.log("called ", rawBodyPart, rawWorkoutName, compareBodyPart, compareWorkoutName);
    if(!rawBodyPart || !rawWorkoutName) return { success: false, messase: "fill in both fields." };
      try {
        const existingPart = bodyParts.find(part => part.id.toLowerCase() === compareBodyPart); //bodyPartが既に存在していればexistingPartとする

        if (existingPart) { //bodyPartがすでに存在して
          const workoutExists = existingPart.workoutNames.find(name => name.toLowerCase() === compareWorkoutName);
          if (workoutExists) { //workoutNameも存在するとき
            return { success: false, message: "This workout already exists." };
          }
          const updatedWorkoutNames = [...existingPart.workoutNames, rawWorkoutName]; 
          await setDoc(
            doc(db, "users", currentUser.uid, "bodyParts", existingPart.id), 
            { workoutNames: updatedWorkoutNames },
            { merge: true }
          );
          console.log(updatedWorkoutNames);
          fetchBodyParts();
          } else {
          //} if(!existingPart) {//bodypart存在しないとき //新規作成は　setDoc(doc(db, collection, docID))を使用
          await setDoc(doc(db, "users", currentUser.uid, "bodyParts", rawBodyPart), 
          //databaseのbodyPartsにid: 新しいbodyPart, workoutNamesの配列にworkoutNameを追加したい
            { workoutNames: [rawWorkoutName] }
          );
          }
          await fetchBodyParts();
        return { success: true };
      } catch (error) {
        console.log(error);
        return { success: false, message: "Failed to add workoutName"}
      }
    }

  async function deleteWorkout(workoutId) {
    try {
    // 削除する前にデータを読み取る
    const workoutRef = doc(db, "users", currentUser.uid, "workouts", workoutId);
    const snap = await getDoc(workoutRef);

    if (!snap.exists()) {
      console.log("Error: workout not found");
      return;
    }

    // 削除前の date を取得
    const workoutDate = snap.data().date.toDate(); 
    console.log("Deleting workout, date:", workoutDate);
    // 削除 
    await deleteDoc(workoutRef);
    console.log("Deleted:", workoutId);
    getMaxDataOfTheDay(workoutDate);
    getMonthlyWorkoutStats();
    fetchWorkoutData();
    return { success: true };
    
    } catch (e) {
    console.log(e);
    return { success: false, error: e };
    }
  }

  const workoutsValue = {
    fetchBodyParts,
    setBodyParts,
    bodyParts,
    monthlyWorkoutDates,
    setMonthlyWorkoutDates,
    getMonthlyWorkoutStats,
    monthlyWorkoutDays,
    setMonthlyWorkoutDays,
    currentMonth,
    setCurrentMonth,
    currentYear,
    setCurrentYear,
    getMaxDataOfTheDay,
    monthlyStats,
    setMonthlyStats,
    fetchWorkoutData,
    displayedWorkouts, 
    setSelectedDate,
    selectedDate,
    fetchPrevWorkout,
    saveWorkout,
    deleteWorkout,
    latestData,
    addWorkoutName,
  };
  return (
    <WorkoutsContext.Provider value={workoutsValue}>
      {!isLoading && children}
    </WorkoutsContext.Provider>
  )

}

export { WorkoutsContextProvider, useWorkouts };