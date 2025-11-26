import React from 'react'

export default function CreateWorkoutNamePopup({
  createPopup,
  handleCreateWorkout,
  setCreatePopup,
}) {
 


  return (
    <div>
      <div className='events'>
            {createPopup &&  (
              <div className='event-popup'>
                <form onSubmit={handleCreateWorkout}>
                <h1>Create</h1>
                <label>Parts</label>
                <input type="text" 
                name="bodyPart"
                placeholder="Body Part"
                />
                <label>Workout Name</label>
                <input type="text" 
                name="workoutName"
                placeholder="Workout Name" 
                />
                <button>Save</button>
                <button 
                  className="close-event-popup"
                  type="button"
                  onClick={() => setCreatePopup(false)}
                >
                    <i className='bx bx-x'></i>
                </button>
                </form>
              </div>
            )}
          </div>
    </div>
  )
}
