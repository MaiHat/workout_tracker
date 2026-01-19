import React from 'react'

export default function WeightInput({ index, weightUnit, formData,setFormData }) {
  const handleWeightChange = (e) => {
    const inputValue = Number(e.target.value);

    const weightKg = 
    weightUnit === "kg" ? inputValue : inputValue / 2.20462;
    
    const weightLbs =
    weightUnit === "lbs" ? inputValue : inputValue * 2.20462;

    const updatedFormData = [...formData];
    updatedFormData[index].weight = {
      kg: weightKg,
      lbs: weightLbs,
    };

    setFormData(updatedFormData);
  };

  return (
    <div className="weight-input">
      <input 
      type="number"
      value={
        weightUnit === "kg"
        ? formData[index].weight.kg
        : formData[index].weight.lbs
      }
      onChange={handleWeightChange}
      />
      <span>{weightUnit}</span>
      <span>{weightUnit === "kg" 
      ? `(${formData[index].weight.lbs} lbs)` 
      : `(${formData[index].weight.kg} kg)`}</span>
    </div>
  )
}
