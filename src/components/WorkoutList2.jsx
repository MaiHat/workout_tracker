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
    <div className="events-list">
      {displayedWorkouts.map((workout) => (
        <div className="event" key={workout.id}>
          
          {/* ヘッダー */}
          <div className="event-header">
            <div className="event-date">
              {workout.date?.toDate().toLocaleDateString()}
            </div>
            <div className="event-buttons">
              <i
                className='bx bxs-edit-alt'
                onClick={() => onEdit(workout)}
              ></i>
              <i
                className='bx bxs-message-alt-x'
                onClick={() => onDelete(workout.id)}
              ></i>
            </div>
          </div>

          {/* ボディ */}
          <div className='event-body'>
            <div className='event-parts'>
              {workout.bodyPart}: {workout.workoutName}
            </div>

            {workout.sets.map((set, i) => (
              <div key={i} className="event-set">
                Set {i+1}: {set.weight} kg x {set.reps} Reps  
                <br />
                RM: {set.RM}  
                <br />
                Note: {set.note}
              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  )
}
