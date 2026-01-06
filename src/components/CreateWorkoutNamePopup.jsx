import React, { useRef } from 'react'

export default function CreateWorkoutNamePopup({
  createPopup,
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
    setCreatePopup(false);
  }
 
  if(!createPopup) return null;


  return (
    <div className='popup'>
      <div className='popup--wrapper'>
        <div className='popup--card'>
          <div className='popup--header'>
            <div className='empty-for-spacebetween'></div>
            <h4 className='popup--header--title'>Create Workout</h4>
            <button className="close-btn" type="button"
              onClick={() => setCreatePopup(false)}>
              <i className='bx bx-x'></i>
            </button>
          </div>
          <div className='popup--body'>
            <form onSubmit={handleCreateWorkoutName}>
            <div>
              <label>Parts</label>
              <input 
                type="text" 
                name="bodyPart"
                placeholder="Body Part"
                ref={bodyPartRef} 
                required
              />
            </div>
            <div>
              <label>Workout Name</label>
              <input 
                type="text" 
                name="workoutName"
                placeholder="Workout Name" 
                ref={workoutNameRef}
                required
              />
            </div>
            <div className='submit-btn'>
            <button className='btn btn--secondary' type="submit">Save</button>
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
