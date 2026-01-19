import React, { useState } from 'react'

export default function WeightUnitSwich({ unit, setUnit }) {
  return (
    <div className="unit-swich">
      <button onClick={() => setUnit('kg')}clasName={unit === "kg" ? "active" : ""}>kg</button>
      <button onClick={() => setUnit("lbs")} className={unit === "lbs" ? "active" : ""}>lbs</button>
    </div>
  )
}