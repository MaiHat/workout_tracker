import React, { useEffect, useState } from 'react'
import { useAuth } from "../contexts/authContext";

export default function WorkoutList({selectedDate, onEdit, onDelete, displayedWorkouts, fetchWorkoutData }) {
  const { currentUser } = useAuth();

  useEffect(() => {
   fetchWorkoutData();
  }, [selectedDate]);

  async function handleDelete(workoutId) {
    onDelete(workoutId);
  }

  async function handleEdit(workout) {
    onEdit(workout);
    console.log("edit workout", workout);
  }

 
  return (
    <div className='events'>
      {displayedWorkouts.map((workout) => (
        <div className='event' key={workout.id}>
          
          <div className='event-date'>
            {workout.date?.toDate().toLocaleDateString()}
          </div>
          <div className='event-details'> 
            <div className='event-parts'>
                {workout.bodyPart}: {workout.workoutName}
            </div>
              {workout.sets.map((set, i) => (
                <div key={i}> 
                  Set {i+1}: {set.weight} kg x {set.reps}Reps RM:{set.RM}<br />
                  Note: {set.note} 
                </div>
              ))}
          </div> 
          <div className='event-buttons'>
            <i className='bx bxs-edit-alt' onClick={() => handleEdit(workout)}></i>
            <i className='bx bxs-message-alt-x' onClick={() => handleDelete(workout.id)}></i>
          </div>
        </div>
      ))}
    </div>
  )
}
