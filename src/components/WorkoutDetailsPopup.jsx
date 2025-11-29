import React, { useState, useEffect } from 'react'
import { useAuth } from "../contexts/authContext";
import { useWorkouts } from "../contexts/workoutsContext";


export default function WorkoutDetailsPopup({
  detailsPopup,
  selectedWorkout,
  handleChangeWorkouts,
  setDetailsPopup,
  onSubmit,
  isEditing,
  setIsEditing,
  selectedDate,  
  editingWorkout,
  }) {  
    
  const [formData, setFormData] = useState([ { weight: "", reps:"", note: ""}]);
  const { currentUser, username } = useAuth();
  const [maxWeight, setMaxWeight] = useState(0);
  const [maxRm, setMaxRm] = useState(0);
  const { fetchPrevWorkout, latestData } = useWorkouts();

  function handleChange(index, e) {
    const { name, value } = e.target;
    const updatedSets = [...formData];
    updatedSets[index][name] = value;
    setFormData(updatedSets);
  }

  function calculateRM(weight, reps) {
    const w = parseFloat(weight); //入力値をゆるく読める数値に変換
    const r = parseFloat(reps);
    if(!w || !r || r === 0 ) return null;
    return parseFloat((w * (1 + r / 30)).toFixed(1));
  };

  function addSet() {
    setFormData([...formData, { weight: "", reps: "", note: "", RM: "" }]);
  }

  // ★ セット配列から maxWeight / maxRm を算出して state に反映
  function calcMaxFromSets(sets = []) {
    let mw = 0;
    let mr = 0;

    for (const s of sets) {
      const w = parseFloat(s?.weight);
      const r = parseFloat(s?.reps);
      // setにRMが保存済みなら最優先で使用、なければその場計算
      const rm = Number.isFinite(parseFloat(s?.RM))
        ? parseFloat(s.RM)
        : calculateRM(w, r) ?? 0;

      if (w > mw) mw = w;
      if (rm > mr) mr = rm;
    }
    return { maxWeight: mw, maxRm: mr };
  }


  function handleSubmit(e) {
    e.preventDefault();
    const setsWithRM = formData.map(set => ({
      weight: parseFloat(set.weight),
      reps: parseFloat(set.reps),
      RM: calculateRM(set.weight, set.reps),
      note: set.note ?? "",
    }));
    const { maxWeight: mw, maxRm: mr } = calcMaxFromSets(setsWithRM);
    setMaxWeight(mw);
    setMaxRm(mr);
    onSubmit(setsWithRM, isEditing, mw, mr);
    console.log("submitted:", setsWithRM, isEditing, mw, mr)
    setDetailsPopup(false);
  }

  useEffect(() => {
    if(selectedWorkout) {
      fetchPrevWorkout(selectedWorkout);
    }
  }, [selectedWorkout]);

  useEffect(() => {
  const { maxWeight: mw, maxRm: mr } = calcMaxFromSets(formData);
  setMaxWeight(mw);
  setMaxRm(mr);
  }, [formData]);

  useEffect (() => {
    if (detailsPopup === false) return;

    if (isEditing && editingWorkout) {
   setFormData(
    editingWorkout.sets.map((set) => ({
      weight: set.weight || "",
      reps: set.reps || "",
      note: set.note || "",
      RM: set.RM || "",
    }))
    );
  } else {
    setFormData([ { weight: "", reps:"", note: ""}]);
    }
  }, [detailsPopup, editingWorkout, isEditing]
);


     return (
    <>
      {((detailsPopup && selectedWorkout) || (detailsPopup && isEditing)) ? (
        <div className="event-popup-container">
          <div className="event">

            {/* ヘッダー */}
            <div className="event-header">
              <p>{isEditing ? "Edit Workout" : "Add Workout"}</p>
              <button
                className="close-btn"
                onClick={() => {
                  setDetailsPopup(false);
                  setIsEditing(false);
                }}
              >
                ✕
              </button>
            </div>

            {/* 名前表示 */}
            <div className="event-body">
               {isEditing ? (
                  <div className="event-parts">
                    {editingWorkout.date?.toDate().toLocaleDateString()}
                    {editingWorkout.bodyPart}: {editingWorkout.workoutName} 
                  </div>
                    ) : (
                  <div className="event-parts">
                    {selectedDate.toLocaleDateString() }
                    {selectedWorkout.id}: {selectedWorkout.workoutName}
                  </div>
                )}

              {/* 過去データ */}
              {latestData ? (
                <>
                  <p>Last Record: {latestData.date.toLocaleDateString()}</p>
                  {latestData.sets.map((set, i) => (
                    <p key={i}>Set {i+1}: {set.weight}kg × {set.reps} reps</p>
                  ))}
                </>
              ) : (
                <p>No prev record</p>
              )}

              {/* 入力フォーム */}
              <form onSubmit={handleSubmit}>
                {formData.map((set, index) => (
                  <div className="set-input" key={index}>
                    <label>Set {index + 1}</label>

                    <input
                      type="number"
                      name="weight"
                      placeholder="Weight"
                      value={set.weight}
                      onChange={(e) => handleChange(index, e)}
                    /> kg 

                    <input
                      type="number"
                      name="reps"
                      placeholder="Reps"
                      value={set.reps}
                      onChange={(e) => handleChange(index, e)}
                    /> Reps

                    <div>RM: {calculateRM(set.weight, set.reps)}</div>

                    <textarea
                      name="note"
                      placeholder="Note"
                      value={set.note}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </div>
                ))}

                <button type="button" onClick={addSet}>+ Add Set</button>

                {isEditing
                  ? <button type="submit">Update</button>
                  : <button type="submit">Save</button>}
              </form>
            </div>

          </div>
        </div>) : null}
      
    </>
  )
}

  /*return (
    <div>
      <div className='events'>
        {detailsPopup && selectedWorkout && (
          <div className='event'>
            <div className='event-date'>
              <p>{selectedDate}selectedDate
              </p>
            </div>
            <div className='event-parts'>
              {selectedWorkout.id}: {selectedWorkout.workoutName}
            </div>
                  {latestData ? (
                  <>
                  <p>Last Record: {latestData.date.toLocaleDateString()}</p>
                    {latestData.sets.map((set, index) => (
                      <div key={index}>
                        Set {index + 1}: {set.weight}kg x {set.reps} reps
                      </div>
                    ))}
                  </>
                 ) : (
                  <p>No prev record</p>
                 )}
                  <form onSubmit={handleSubmit}
                  className='event-details'
                  >
                    {formData.map((set, index) => (
                      <div className='set' key={index}>
                        <label>Set {index + 1}</label>
                        <input
                        type="number"
                        value={set.weight}
                        name="weight"
                        placeholder="Weight"
                        onChange={(e) => handleChangeWorkouts(index, e)}
                        />
                        kg x 
                        <input
                        type="number"
                        value={set.reps}
                        name="reps"
                        placeholder="Reps"
                        onChange={(e) => handleChangeWorkouts(index, e)}
                        /> Reps 
                        <div>RM: {calculateRM(set.weight, set.reps)}</div><br />
                        <textarea
                          value={set.note}
                          name="note"
                          onChange={(e) => handleChangeWorkouts(index, e)}
                          placeholder="Note"
                        />
                    </div>
                    ))}
                  <button type="button" onClick={addSet}>+ Add Set</button>
                  {isEditing?
                    <button type="submit" //onClick={()=> handleEdit()}
                    >Update</button>:
                    <button type="submit" //onClick={()=> handleSubmit()}
                    >Save</button>
                  } 
                  
                  </form>
                  <button className="close-event-popup" onClick={() => setDetailsPopup(false)}>
                    <i className='bx bx-x'></i>
                  </button>
                </div>
              )}
          </div>
    </div>
  )
}*/
