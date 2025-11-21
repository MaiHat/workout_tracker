import React, { useEffect, useState } from 'react'

export default function WorkoutForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialData || [{ weight: "", reps: "", note: "" }]);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  function handleChange(index, e) {
    const { name, value } = e.target;
    const updated = [...formData];
    updated[index][name] = value;
    setFormData(updated);
  }

  function addSet() {
    setFormData([...formData, { weight: "", reps: "", note: "" }]);
  }10

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      {formData.map((set, index) => (
        <div key={index}>
          <input name="weight" value={set.weight} onChange={e => handleChange(index, e)} />
          <input name="reps" value={set.reps} onChange={e => handleChange(index, e)} />
          <textarea name="note" value={set.note} onChange={e => handleChange(index, e)} />
        </div>
      ))}
      <button type="button" onClick={addSet}>+ Add Set</button>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}
