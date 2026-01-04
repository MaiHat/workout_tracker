import React, { useEffect } from 'react'
import { useAuth } from "../contexts/authContext";

export default function WorkoutList({
  selectedDate,
  onEdit,
  onDelete,
  displayedWorkouts,
  fetchWorkoutData
}) {
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchWorkoutData();
  }, [selectedDate]);

  return (
    <div className="workoutlists">
      {displayedWorkouts.map((workout) => (
        <div className="workoutlist" key={workout.id}>
          <div className="workoutlist--header">
            <div className="workoutlist--date">
               <p>{workout.date?.toDate().toLocaleDateString()}</p> 
            </div>
            <div className="workoutlist--title">
            <h4>{workout.bodyPart}:</h4><h3>{workout.workoutName}</h3> 
            </div>
            <div className="workoutlist--buttons">
                <i className='bx bxs-edit-alt' onClick={() => onEdit(workout)}></i>
                <i className='bx bxs-message-alt-x' onClick={() => onDelete(workout.id)}></i>
            </div>
         </div>
         {workout.sets.map((set, i) => (
            <div key={i} className="workoutlist--set">
              <div className='space'>Set {i+1}: </div>
              <div className='set-data space'><h3>{set.weight}</h3> kg </div>
              <p className='space'> x </p>
              <div className='set-data space'><h3>{set.reps}</h3> Reps  </div>
              <div className='space'>  RM: {set.RM} </div>
              <div className='space'>Note: {set.note}</div>
            </div>
          ))}
        </div>
      ))}
  </div>
  )
}
