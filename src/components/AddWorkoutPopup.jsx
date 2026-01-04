import React, { useEffect } from 'react'
import { useWorkouts } from "../contexts/workoutsContext";

export default function AddWorkoutPopup({
  addPopup,
  setDetailsPopup,
  setAddPopup,
  setSelectedWorkout,
  setCreatePopup,
  }) {
  const { fetchBodyParts, selectedDate, bodyParts,} = useWorkouts();

  useEffect( () => {
     if (addPopup) fetchBodyParts();
  }, [addPopup, fetchBodyParts]);

  if(!addPopup) return null;

  return (
    <div className='popup'>
      <div className='popup--wrapper'>
      <div className='popup--card'>
        <div className='popup--header'>
          <p className='popup--header--date'>{selectedDate ? selectedDate.toLocaleDateString() : ''}</p>
          <h4 className='popup--header--title'>Add Workout</h4>
          <button className="close-btn" type="button" onClick={() => setAddPopup(false)}>
            <i className='bx bx-x'></i>
          </button>
        </div>
        <div className='popup--body'>
        {bodyParts.map((part) => (
            <div className='section' key={part.id}>
              <h3>{part.id}</h3>
              {part.workoutNames.map((wn, idx) => (
                <button className='wn-btn btn btn--secondary'
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
        </div>
        <button className='btn btn--primary' onClick={() => setCreatePopup(true)}>Create Work out</button>
      </div>
      </div>
    </div>
  )
}
