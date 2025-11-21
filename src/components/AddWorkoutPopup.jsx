import React, { useEffect } from 'react'
import { useWorkouts } from "../contexts/workoutsContext";

export default function AddWorkoutPopup({
  addPopup,
  setDetailsPopup,
  handleClickCreate,
  setAddPopup,
  setSelectedWorkout,
  isEditing,
}) {
  const { fetchBodyParts, currentMonth,
  currentYear, selectedDate, bodyParts,} = useWorkouts();

  useEffect( () => {
     if (addPopup) fetchBodyParts();
  }, [addPopup]);

  return (
    <div>
      <div className='events'>
              {addPopup &&  (
              <div className='event-popup'>
                {isEditing ? <p>Edit Workout</p> : <p>Add Workout</p>}
                <h2>{selectedDate ? selectedDate.toLocaleDateString() : ''}</h2>
                {bodyParts.map((part) => (
                <div key={part.id}>
                <h3>{part.id}</h3>
                  {part.workoutNames.map((wn, idx) => (
                  <button 
                  key={idx}
                  onClick={() => {setSelectedWorkout({
                    id: part.id,
                    index: idx,
                    workoutName: wn
                  });
                  setAddPopup(false);
                  setDetailsPopup(true);
                  }}>
                    {wn}
                  </button>
                  ))}
                </div>
              ))}
                <button onClick={handleClickCreate}>Create Work out</button>
                <button className="close-event-popup" onClick={() => setAddPopup(false)}>
                  <i className='bx bx-x'></i>
                </button>
              </div>
              )}
          </div>
            
    </div>
  )
}
