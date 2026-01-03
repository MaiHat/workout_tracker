import React from 'react'
import { useWorkouts } from "../contexts/workoutsContext";

export default function AddWorkoutButton({ onAddPopup}) {
  const { selectedDate, setAddPopup } = useWorkouts();

  function handleClick() {
    onAddPopup();
  } 
  return (
    <div>
    <button className='btn btn--primary' onClick={handleClick}>
      {selectedDate ? `Add Workout for ${selectedDate.toLocaleDateString()}` : 'Add Workout for Today'}
    </button>
    </div>
  )
}
