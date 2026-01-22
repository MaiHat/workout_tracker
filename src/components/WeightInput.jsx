import React from 'react'

const KG_TO_LBS = 2.20462;

function floorTo1Decimal(num) {
  return Math.floor(num * 10) / 10;
}

export default function WeightInput({ index, weightUnit, formData, setFormData }) {
  const handleWeightChange = (e) => {
    const value = e.target.value;
    const num = value === "" ? "" :  Number(value);

    setFormData(prev => {
      const updated = [...prev];
      if (weightUnit === "kg") {
      updated[index].weight = {
        kg: num,
        lbs: num === "" ? "" : floorTo1Decimal(num * KG_TO_LBS),
      };
    } else {
      updated[index].weight = {
        lbs: num,
        kg : num === "" ? "" : floorTo1Decimal(num / KG_TO_LBS),
      };
    }
    return updated;
    });
  }
    const weight = formData[index].weight

  return (
    <div className="weight-input">
      <input 
      type="number"
      placeholder='weight'
      value={
        weightUnit === "kg"
       ? weight.kg
        : weight.lbs
      }
      onChange={handleWeightChange}
      />
      <span>{weightUnit}</span>
      <span>{weightUnit === "kg" 
      ? `( ${weight.lbs !== "" ? weight.lbs.toFixed(1): "-"} lbs)` 
      : `( ${weight.kg !== "" ? weight.kg.toFixed(1): "-"} kg)`}</span>
    </div>
  )
}
