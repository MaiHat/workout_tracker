import React from 'react'
import { useWorkouts } from "../contexts/workoutsContext";


export default function MonthlyArchivedDays({ onHandleClickTodays }) {
  const { monthlyArchivedDays } = useWorkouts();
  
  function handleClickTodays() {
    onHandleClickTodays();
  }

  return (
    <div>
       <div className='archived-days'>
          <h3>Monthy Archived</h3>
          <h2>{monthlyArchivedDays.length}</h2>
          <h3>days</h3> 
          <button className="btn btn--secondary" onClick={handleClickTodays}>Today's Training</button>
        </div>
      </div>
  )
}
