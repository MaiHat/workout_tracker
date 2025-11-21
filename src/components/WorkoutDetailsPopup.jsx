import React, { useState, useEffect } from 'react'

import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../contexts/authContext";

export default function WorkoutDetailsPopup({
  detailsPopup,
  selectedWorkout,
  handleChangeWorkouts,
  setDetailsPopup,
  onSubmit,
  isEditing,
  }) {  
  const [formData, setFormData] = useState([ { weight: "", reps:"", note: ""}]);
  const [latestData, setLatestData] = useState(null);
  const { currentUser, username } = useAuth();
  const [maxWeight, setMaxWeight] = useState(0);
  const [maxRm, setMaxRm] = useState(0);

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

  function handleChangeWorkouts(index, e) {
    const { name, value } = e.target;
    const updatedSets = [...formData];
    updatedSets[index][name] = value;
    setFormData(updatedSets);
  }

  function calculateRM(weight, reps) {
    const w = parseFloat(weight); //入力値をゆるく読める数値に変換
    const r = parseFloat(reps);
    if(!w || !r || r === 0 ) return null;
    return parseFloat((w * (1 + r / 30)).toFixed(1));
  };

  function addSet() {
    setFormData([...formData, { weight: "", reps: "", note: "", RM: "" }]);
  }

  // ★ セット配列から maxWeight / maxRm を算出して state に反映
  function calcMaxFromSets(sets = []) {
    let mw = 0;
    let mr = 0;

    for (const s of sets) {
      const w = parseFloat(s?.weight);
      const r = parseFloat(s?.reps);
      // setにRMが保存済みなら最優先で使用、なければその場計算
      const rm = Number.isFinite(parseFloat(s?.RM))
        ? parseFloat(s.RM)
        : calculateRM(w, r) ?? 0;

      if (w > mw) mw = w;
      if (rm > mr) mr = rm;
    }
    return { maxWeight: mw, maxRm: mr };
  }


  function handleSubmit(e) {
    e.preventDefault();
    const setsWithRM = formData.map(set => ({
      weight: parseFloat(set.weight),
      reps: parseFloat(set.reps),
      RM: calculateRM(set.weight, set.reps),
      note: set.note ?? "",
    }));
    const { maxWeight: mw, maxRm: mr } = calcMaxFromSets(setsWithRM);
    setMaxWeight(mw);
    setMaxRm(mr);

    onSubmit(setsWithRM, isEditing, mw, mr);
  }

  useEffect(() => {
    if(selectedWorkout) {
      fetchPrevWorkout(selectedWorkout);
    }
  }, [selectedWorkout]);

  useEffect(() => {
  const { maxWeight: mw, maxRm: mr } = calcMaxFromSets(formData);
  setMaxWeight(mw);
  setMaxRm(mr);
}, [formData]);

  return (
    <div>
      <div className='events'>
              {detailsPopup && selectedWorkout && (
                <div className='event-popup'>
                  {isEditing ? <p>Edit Workout</p> : <p>Add Workout</p>}
                  <h1>{selectedWorkout.workoutName} (from {selectedWorkout.id})</h1>
                  {latestData ? (
                  <>
                  <p>Last Record: {latestData.date.toLocaleDateString()}</p>
                    {latestData.sets.map((set, index) => (
                      <div key={index}>
                        Set {index + 1}: {set.weight}kg x {set.reps} reps
                      </div>
                    ))}
                  </>
                 ) : (
                  <p>No prev record</p>
                 )}
                  <form onSubmit={handleSubmit}
                  className='workoutDetail'
                  >
                    {formData.map((set, index) => (
                      <div className='set' key={index}>
                        <label>Set {index + 1}</label>
                        <input
                        type="number"
                        value={set.weight}
                        name="weight"
                        placeholder="Weight"
                        onChange={(e) => handleChangeWorkouts(index, e)}
                        />
                        <input
                        type="number"
                        value={set.reps}
                        name="reps"
                        placeholder="Reps"
                        onChange={(e) => handleChangeWorkouts(index, e)}
                        />
                        <textarea
                          value={set.note}
                          name="note"
                          onChange={(e) => handleChangeWorkouts(index, e)}
                          placeholder="Note"
                        />
                        <div>RM: {calculateRM(set.weight, set.reps)}</div>
                    </div>
                    ))}
                  <button type="button" onClick={addSet}>+ Add Set</button>
                  {isEditing?
                    <button type="submit" //onClick={()=> handleEdit()}
                    >Update</button>:
                    <button type="submit" //onClick={()=> handleSubmit()}
                    >Save</button>
                  } 
                  
                  </form>
                  <button className="close-event-popup" onClick={() => setDetailsPopup(false)}>
                    <i className='bx bx-x'></i>
                  </button>
                </div>
              )}
          </div>
    </div>
  )
}
