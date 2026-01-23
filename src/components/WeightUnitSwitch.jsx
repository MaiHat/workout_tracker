import React, { useState } from 'react'

export default function WeightUnitSwitch({ unit, setUnit }) {
  return (
    <div className="unit-switch">
      <button onClick={() => setUnit('kg')} type="button" className={ unit === "kg" ? "btn btn--dark" : "btn btn--light"}>kg</button>
      <button onClick={() => setUnit("lbs")} type="button" className={ unit === "lbs" ? "btn btn--dark" : "btn btn--light"}>lbs</button>
    </div>
  )
}