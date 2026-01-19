import React, { useState } from 'react'

export default function WeightUnitSwich({ unit, setUnit }) {
  return (
    <div className="unit-swich">
      <button onClick={() => setUnit('kg')} type="button" className={unit === "kg" ? "active" : ""}>kg</button>
      <button onClick={() => setUnit("lbs")} type="button" className={unit === "lbs" ? "active" : ""}>lbs</button>
    </div>
  )
}