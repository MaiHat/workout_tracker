import React, { useEffect } from 'react'
import { useWorkouts } from "../contexts/workoutsContext";

export default function AddWorkoutPopup({
  addPopup,
  setDetailsPopup,
  handleClickCreate,
  setAddPopup,
  setSelectedWorkout,
  selectedWorkout,
  isEditing,
  setCreatePopup,
}) {
  const { fetchBodyParts, currentMonth,
  currentYear, selectedDate, bodyParts, fetchPreWorkout} = useWorkouts();

  function handleCreate(){
    onCreate();
  }

  if(!addPopup) return null;

  useEffect( () => {
     if (addPopup) fetchBodyParts();
  }, [addPopup]);

  return (
    <div className='event-popup-container'>
      <div className='event'>
          <button className="close-btn" onClick={() => setAddPopup(false)}>
                  <i className='bx bx-x'></i>
                </button>
              <div>
               <p>Add Workout</p>
                <p>{selectedDate ? selectedDate.toLocaleDateString() : ''}</p>
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
                <button onClick={() => setCreatePopup(true)}>Create Work out</button>
              </div>
              
          </div>
            
    </div>
  )
}
