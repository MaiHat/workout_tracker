import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/authContext";
import { useWorkouts } from "../contexts/workoutsContext";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { collection, getDocs, addDoc, doc, setDoc, Timestamp, query, where, updateDoc, getDoc, orderBy, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Header from './Header';
import Calendar from './Calendar';
import AddWorkoutPopup from './AddWorkoutPopup'
import WorkoutDetailsPopup from './WorkoutDetailsPopup'
import CreateWorkoutNamePopup from './CreateWorkoutNamePopup'
import WorkoutList from './WorkoutList';
import { LineGraph } from './Line';
{/*
  trying to use workoutlist UI to edit workoutdata and to input new workout
  その日毎のmaxRMを配列にしてconstしようとしている


  TO DO  
  graph機能workさせる
  graphで使うデータをデータベースから取り出し読める形に変換している。
  全部のworkoutsのmax rmとmax weightを取り出そうとしている


  wanna keep number in input box when you edit
  fetchWorkoutData をsaveしたときに発動しworkoutListをすぐに表示させる

  DONE
  月毎のグラフでx線の日付の表示はできた
  made workoutStats collection and function to save workoutStat.
  also made function of if !saved stat, update : make new one  
  greeting.jsx:175
  */}

export default function Greeting() {

  const { currentUser, username } = useAuth();
  const { currentYear, 
    currentMonth, 
    setCurrentYear, 
    setCurrentMonth, 
    monthlyWorkoutDates,
    setMonthlyWorkoutDates,
    getMonthlyWorkoutStats,
    monthlyArchivedDays,
    getMaxDataOfTheDay,
    fetchBodyParts,
    bodyParts,
    fetchWorkoutData,
    selectedDate,
    setSelectedDate,
    displayedWorkouts,
    setDisplayedWorkouts,
    today,
    saveWorkout,
    deleteWorkout,
  } = useWorkouts();

  const [addPopup, setAddPopup] = useState(false);
  const [createPopup, setCreatePopup] = useState(false);
  const [detailsPopup, setDetailsPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
 
  const [workouts, setWorkouts] = useState({});
  const [editingWorkoutId, setEditingWorkoutId] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [weeklyArchivedDyas, setWeeklyArchivedDays] = useState([]);
  
  
  function handleClickDate() {
    setIsEditing(false);
    setAddPopup(true);
    getMaxDataOfTheDay(selectedDate) ;
  }

  function handleClickTodays() {
    setIsEditing(false);
    setAddPopup(true);
  }
  
  function handleChangeMonth() {
    setAddPopup(false);
    getMonthlyWorkoutStats();
  }

  function handleClickCreate() {
    setCreatePopup(true);
  }

  async function handleEditWorkout(workoutId) {
    setEditingWorkoutId(workoutId);
    setAddPopup(true);
    setIsEditing(true);
 }

 async function handleSubmit (setsWithRM, isEditing, mw, mr) {
  const result = await saveWorkout({
    setsWithRM, 
    isEditing,
    mw,
    mr,
    selectedWorkout, 
    selectedDate,
    editingWorkoutId,
    currentUser,
  });
  if (result.succes) {
    setDetailsPopup(false);
    setAddPopup(false);
    setIsEditing(false);
    fetchWorkoutData();
  }
 }
 
  async function handleCreateWorkout(e) {
    e.preventDefault();
    const bodyPart = e.target.bodyPart.value.trim();
    const workoutName = e.target.workoutName.value.trim();
    
    if(!bodyPart || !workoutName) {
      alert("Please fill in both fields.");
      return;
    }
    try {
      const existingPart = bodyParts.find(part => part.id === bodyPart); //bodyPartが既に存在していればexistingPartとする
      if (existingPart) { //exisitingPartが存在すれば
        if (existingPart.workoutNames.includes(workoutName)) { //workoutNameも存在するとき
          alert("This workout already exists.");  //error msg
          return;
        }
        const updatedWorkoutNames = [...existingPart.workoutNames, workoutName]; 
        await setDoc(doc(db, "users", currentUser.uid, "bodyParts", bodyPart), {
          workoutNames: updatedWorkoutNames,
        });
        console.log(updatedWorkoutNames);
        fetchBodyParts();
        } else {
        //} if(!existingPart) {//bodypart存在しないとき //新規作成は　setDoc(doc(db, collection, docID))を使用
        await setDoc(doc(db, "users", currentUser.uid, "bodyParts", bodyPart), {  
          //databaseのbodyPartsにid: 新しいbodyPart, workoutNamesの配列にworkoutNameを追加したい
          workoutNames: [workoutName]
        });
        await fetchBodyParts();
      }
      setCreatePopup(false);
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    if (!currentUser) return;

      fetchWorkoutData();
      fetchBodyParts();
    }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    getMonthlyWorkoutStats();
  }, [currentUser, currentMonth]);

  return (
    <div>
      <div className='profile-container'>
        <Header />
        <Calendar
          onClickDate={handleClickDate}
          onHandleClickTodays={handleClickTodays}
          onChangeMonth={handleChangeMonth} />
        <AddWorkoutPopup
          addPopup={addPopup}
          setDetailsPopup={setDetailsPopup}
          handleClickCreate={handleClickCreate}
          setAddPopup={setAddPopup}
          setSelectedWorkout={setSelectedWorkout}
          isEditing={isEditing}
        />
        <WorkoutDetailsPopup 
        detailsPopup={detailsPopup}
        selectedWorkout={selectedWorkout}
        setDetailsPopup={setDetailsPopup}
        onSubmit={handleSubmit}
        isEditing={isEditing}
        setIsLoading={setIsLoading}
        />
        <WorkoutList  
          selectedDate={selectedDate}
          setDetailsPopup={setDetailsPopup}
          isLoaing={isLoading}
          onEdit={handleEditWorkout} 
          onDelete={deleteWorkout}
          displayedWorkouts={displayedWorkouts}
          fetchWorkoutData={fetchWorkoutData} />

        <CreateWorkoutNamePopup 
          createPopup={createPopup}
          handleCreateWorkout={handleCreateWorkout} />
                  
        <LineGraph />
      </div>
    </div>
  )
}