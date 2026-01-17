import React, { useState } from 'react'

export default function WeightConverter({ weight }) {
  const [unit, setUnit] = useState("kg");

  const convertToPounds = (kg) => kg * 2.20462;
  const convertToKilograms = (lbs) => lbs / 2.20462;

  const primaryWeight = unit === "kg" ? weight : convertToPounds(weight).toFixed(2);
  const secondaryWeight = unit === ""



  return (
    <div>
      
    </div>
  )
}
