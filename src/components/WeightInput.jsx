import React, { useEffect } from 'react'

const KG_TO_LBS = 2.20462;

function floorTo1Decimal(num) {
  return Math.floor(num * 10) / 10;
}

export default function WeightInput({ index, weightUnit, formData, setFormData }) {
 const weight = formData[index].weight;

  const handleWeightChange = (e) => {
    const value = e.target.value;
    const num = value === "" ? "" : Number(value);

    setFormData(prev => {
      const updated = [...prev];
      updated[index].weight = {
        ...weight,
        inputValue: num,
        kg: weightUnit === "kg" ? num : num === "" ? "" : floorTo1Decimal(num / KG_TO_LBS),
        lbs: weightUnit === "lbs" ? num : num === "" ? "" : floorTo1Decimal(num * KG_TO_LBS),
      };
      return updated;
    });
  };
   useEffect(() => {
    setFormData(prev => {
      const updated = [...prev];
      const w = updated[index].weight;

      if (w.inputValue === "") return updated;

      updated[index].weight = {
        ...w,
        kg: weightUnit === "kg" ? w.inputValue : floorTo1Decimal(w.inputValue / KG_TO_LBS),
        lbs: weightUnit === "lbs" ? w.inputValue : floorTo1Decimal(w.inputValue * KG_TO_LBS),
      };
      return updated;
    });
  }, [weightUnit]); // weightUnit が変わったら再計算


  return (
    <div className="weight-input">
      <input 
      type="number"
      placeholder='weight'
      value={weight.inputValue ?? ""}
      onChange={handleWeightChange}
      />
      <span>{weightUnit}</span>
      <span>{weightUnit === "kg" 
      ? `( ${weight.lbs !== "" ? weight.lbs.toFixed(1): "-"} lbs)` 
      : `( ${weight.kg !== "" ? weight.kg.toFixed(1): "-"} kg)`}</span>
    </div>
  )
}
