import React, { useState, useEffect } from 'react'
import { useAuth } from "../contexts/authContext";
import { useWorkouts } from "../contexts/workoutsContext";
import { Alert } from "react-bootstrap";
import WeightUnitSwitch from './WeightUnitSwitch';
import WeightInput from "./WeightInput";

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
    
  const [formData, setFormData] = useState([ { weight: { kg: "", lbs: "" }, reps:"", note: ""}]);
  const { currentUser, username } = useAuth();
  const [maxWeight, setMaxWeight] = useState({kg: 0, lbs: 0});
  const [maxRm, setMaxRm] = useState(0);
  const [errors, setErrors] = useState([]);
  const { fetchPrevWorkout, latestData } = useWorkouts();
  const [weightUnit, setWeightUnit] = useState("kg");
  
  function handleChange(index, e) {
    const { name, value } = e.target;
    const updatedSets = [...formData];
    updatedSets[index][name] = value;
    setFormData(updatedSets);
  }

  function calculateRM(weightKg, reps) {
    const w = Number(weightKg);
    const r = Number(reps);
    if(!w || !r ) return null;
    return Number((w * (1 + r / 30)).toFixed(1));
  };

  function addSet() {
    setFormData([...formData, { weight: {kg: "", lbs: ""}, reps: "", note: "", RM: "" }]);
  }

  // ★ セット配列から maxWeight / maxRm を算出して state に反映
  function calcMaxFromSets(sets = []) {
    let maxKg = 0;
    let maxLbs = 0;
    let maxRm = 0;

    for (const s of sets) {
      const kg = Number(s.weight.kg).toFixed(1);
      const lbs = Number(s.weight.lbs).toFixed(1);
      const rm = calculateRM(kg, s.reps) ?? 0;

      if (kg > maxKg) maxKg = kg;
      if (lbs > maxLbs) maxLbs = lbs;
      if (rm > maxRm) maxRm = rm;
    }
    return { maxWeight: { kg: maxKg, lbs: maxLbs }, maxRM: maxRm };
  }

   function validateSets(sets) {
    const newErrors = sets.map((set) => {
      const errs = {};
      if (!set.weight.kg && !set.weight.lbs) errs.weight = "Weight is required";
      if(!set.reps) errs.reps = "Reps is required";
      return errs;
    });
    setErrors(newErrors);

    // 1つでもエラーがあればfalse 
    return newErrors.every(err => Object.keys(err).length === 0);
     //everyは配列のすべての要素が条件を満たしているか を調べるメソッド。
  }

   function removeSet(index) {
    setFormData(prev => prev.filter((_,i) => i !== index));
    setErrors(prev => prev.filter((_,i) => i !== index));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validateSets(formData)) {
      return;
    }

    const setsWithRM = formData.map(set => ({
      weight: { kg: Number(set.weight.kg).toFixed(1),
                lbs: Number(set.weight.lbs).toFixed(1),
      },
      reps: Number(set.reps),
      RM: calculateRM(set.weight.kg, set.reps),
      note: set.note ?? "",
    }));

    const { maxWeight: { kg: kg, lbs: lbs }, maxRM: mr } = calcMaxFromSets(setsWithRM);
    
    setMaxWeight(maxWeight);
    setMaxRm(mr);
    onSubmit(setsWithRM, isEditing, maxWeight, mr);
    console.log("submitted:", setsWithRM, isEditing, maxWeight, mr)
    setDetailsPopup(false);
  }

  useEffect(() => {
    if(selectedWorkout) {
      fetchPrevWorkout(selectedWorkout);
    }
  }, [selectedWorkout]);

  useEffect(() => {
  const { maxWeight, maxRM } = calcMaxFromSets(formData);
  setMaxWeight(maxWeight);
  setMaxRm(maxRM);
  }, [formData]);

  useEffect (() => {
    if (detailsPopup === false) return;

    if (isEditing && editingWorkout) {
   setFormData(
    editingWorkout.sets.map((set) => ({
      weight: {
        kg: set.weight?.kg ?? "",
        lbs: set.weight?.lbs ?? "",
      },
      reps: set.reps ?? "",
      note: set.note ?? "",
      RM: set.RM ?? "",
    }))
    );
  } else {
    setFormData([ { weight: { kg: "", lbs: ""}, 
      reps:"", note: "", RM: "",
      }]);
    }
  }, [detailsPopup, editingWorkout, isEditing]
);


  return (
    <>
      {((detailsPopup && selectedWorkout) || (detailsPopup && isEditing)) ? (
        <div className="popup">
          <div className="popup--wrapper">
            <div className="popup--card">
              <div className="popup--header">
                {isEditing ? (
                  <p className='popup--header--date'> {editingWorkout.date?.toDate().toLocaleDateString()}</p>
                  ) : (
                  <p className='popup--header--date'>{selectedDate.toLocaleDateString() }</p>
                )}
                <div className='popup--header--title'>{isEditing ? "Edit Workout" : "Add Workout"}</div>
                <button className="close-btn" type="button"
                  onClick={() => {
                    setDetailsPopup(false);
                    setIsEditing(false);
                  }}>
                  <i className='bx bx-x'></i>
               </button> 
              </div>

              <div className='popup--title'>
                {isEditing ? (
                  <div className='workoutname'>
                    <h4>{editingWorkout.bodyPart}:</h4> <h3>{editingWorkout.workoutName}</h3> 
                  </div>
                  ) : (
                  <div className='workoutname'> 
                    <h4>{selectedWorkout.id}: </h4><h3>{selectedWorkout.workoutName}</h3>
                  </div>
              
                )} 
              </div>
              {/* 過去データ */}
              {latestData ? (
              <div className='prev-record'>
                <div className='prev-record--title'><p>Prev Record: {latestData.date.toLocaleDateString()}</p></div>
                  <div className='sets'>
                    {latestData.sets.map((set, i) => (
                      <p className='set' key={i}>Set {i+1}:  {set.weight.kg} kg  ({set.weight.lbs} lbs) × {set.reps} reps</p>
                    ))}
                  </div>
                </div>
              ) : (
              <div>
                <p className='prev-record'>No prev record</p>
              </div>
            )}
             
           <div className="popup--body">
             {/* 入力フォーム */}
              <form onSubmit={handleSubmit}>
                <WeightUnitSwitch 
                unit={weightUnit}
                setUnit={setWeightUnit}
                />
                {formData.map((set, index) => (
                  <div className="set-input" key={index}>
                    <div className="set-input--top">
                      <h4>Set {index + 1}</h4>
                      <WeightInput
                      key={index}
                      index={index}
                      weightUnit={weightUnit}
                      setFormData={setFormData}
                      formData={formData}
                      />
                      <input
                        type="number"
                        name="reps"
                        placeholder="Reps"
                        value={set.reps}
                        onChange={(e) => handleChange(index, e)}
                      /> 
                      <h4>Reps</h4>
                      <h4>RM: {calculateRM(set.weight, set.reps)}</h4>
                    </div>
                     {errors[index]?.weight && (
                        <Alert className="err-msg" variant="danger">{errors[index].weight}</Alert>
                      )}
                      {errors[index]?.reps && (
                        <Alert className="err-msg" variant="danger">{errors[index].reps}</Alert>            
                      )}
                    <div className="set-input--bottom">
                      <textarea
                        name="note"
                        placeholder="Note"
                        value={set.note}
                        onChange={(e) => handleChange(index, e)}
                      />

                      {formData.length > 1 && (
                        <button type="button" className="btn--light btn" onClick={() => removeSet(index)}>-</button>
                      )}

                      <button className="btn--light btn" type="button" onClick={addSet}>+ Add Set</button>
                    </div>
                  </div>
                ))}
                  <div className="submit-btn">
                  {isEditing
                    ? <button className='btn btn--secondary' type="submit">Update</button>
                    : <button className='btn btn--secondary' type="submit">Save</button>}
                  </div>
              </form>
            </div>
          </div>
        </div>
      </div>) : null}
      
    </>
  )
}