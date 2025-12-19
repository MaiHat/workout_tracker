import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/authContext";
import { useWorkouts } from "../contexts/workoutsContext";
import { Link, useNavigate } from "react-router-dom";
import Header from '../components/Header';
import Calendar from '../components/Calendar';
import AddWorkoutPopup from '../components/AddWorkoutPopup'
import WorkoutDetailsPopup from '../components/WorkoutDetailsPopup'
import CreateWorkoutNamePopup from '../components/CreateWorkoutNamePopup'
import WorkoutList2 from '../components/WorkoutList';
import { LineGraph } from '../components/Line';
{/*
  TO DO  
  wanna keep number in input box when you edit
  make clean design for profile page
  make update profile works 
    *changing email, needs to send email to the old address

  DONE
  made progress clean design /Dec 16
  */}

export default function Profile() {

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
    saveWorkout,
    deleteWorkout,
    addWorkoutName,
    today
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
  const [editingWorkout, setEditingWorkout] = useState({});
  
  function handleClickDate(clickedDate) {
    setSelectedDate(clickedDate);
    setIsEditing(false);
    setAddPopup(true);
    getMaxDataOfTheDay(clickedDate);
  }

  function handleClickTodays() {
    console.log(today);
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

  async function handleEditWorkout(workout) {
    setEditingWorkout(workout);
    setIsEditing(true);
    setDetailsPopup(true);
    console.log("editing workout:", workout);
 }

 async function handleSubmit (setsWithRM, isEditing, mw, mr) {
  const result = await saveWorkout({
    setsWithRM, 
    isEditing,
    editingWorkout,
    mw,
    mr,
    selectedWorkout, 
    selectedDate,
    editingWorkoutId,
    currentUser,
  });
  if (result.success) {
    fetchWorkoutData(selectedDate);
    getMonthlyWorkoutStats();
    getMaxDataOfTheDay(selectedDate);
    isEditing(false);
    console.log("done!");
  }
 }

 async function handleDelete(workoutId) {
  const result = deleteWorkout(workoutId);
  if (result.success) {
    setDetailsPopup(false);    
    console.log("done delete")
  }
 }
 
  async function handleCreateWorkoutName(rawBodyPart, rawWorkoutName, compareBodyPart, compareWorkoutName) {
    const result = await addWorkoutName(
      rawBodyPart, rawWorkoutName, compareBodyPart, compareWorkoutName, currentUser
    );
    if (!result.success) {
      alert(result.message);
      return;
    }
    setCreatePopup(false);
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
      <div className='main'>
        <Header />
        <Calendar
          onClickDate={handleClickDate}
          onHandleClickTodays={handleClickTodays}
          onChangeMonth={handleChangeMonth} />
        <WorkoutList2  
          selectedDate={selectedDate}
          setDetailsPopup={setDetailsPopup}
          isLoaing={isLoading}
          onEdit={handleEditWorkout} 
          onDelete={handleDelete}
          displayedWorkouts={displayedWorkouts}
          fetchWorkoutData={fetchWorkoutData} />
        <AddWorkoutPopup
          addPopup={addPopup}
          setDetailsPopup={setDetailsPopup}
          setCreatePopup={setCreatePopup}
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
        setIsEditing={setIsEditing}
        setIsLoading={setIsLoading}
        editingWorkout={editingWorkout}
        selectedDate={selectedDate}
        />
       

        <CreateWorkoutNamePopup 
          createPopup={createPopup}
          setCreatePopup={setCreatePopup}
          onSave={handleCreateWorkoutName}
          />
                  
        <LineGraph />
      </div>
    </div>
  )
}