import React, { useRef } from 'react'

export default function CreateWorkoutNamePopup({
  createPopup,
  handleCreateWorkoutName,
  setCreatePopup,
  onSave
  }) {

    const bodyPartRef = useRef();
    const workoutNameRef = useRef();
   
    function handleCreateWorkoutName(e) {
    e.preventDefault();

    //入力値の前後の空白を削除
   const rawBodyPart = bodyPartRef.current.value.trim();
   const rawWorkoutName = workoutNameRef.current.value.trim();
    //比較用に小文字に変換
    const compareBodyPart = rawBodyPart.toLowerCase();
    const compareWorkoutName = rawWorkoutName.toLowerCase();
    onSave(rawBodyPart, rawWorkoutName, compareBodyPart, compareWorkoutName);
  }
 


  return (
    <div>
      <div className='events'>
        {createPopup &&  (
          <div className='event-popup'>
            <form onSubmit={handleCreateWorkoutName}>
                <h1>Create</h1>
                <label>Parts</label>
                <input 
                type="text" 
                name="bodyPart"
                placeholder="Body Part"
                ref={bodyPartRef} 
                required
                />
                <label>Workout Name</label>
                <input 
                type="text" 
                name="workoutName"
                placeholder="Workout Name" 
                ref={workoutNameRef}
                required
                />
                <button>Save</button>
            </form>
            <button 
              className="close-event-popup"
              type="button"
              onClick={() => setCreatePopup(false)}
            >
              <i className='bx bx-x'></i>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
