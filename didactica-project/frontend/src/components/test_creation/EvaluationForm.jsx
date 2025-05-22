// EvaluationForm.jsx
import React, { useState } from 'react';

function EvaluationForm({ formData, updateFormData }) {
  const [evaluationMethod, setEvaluationMethod] = useState(formData.evaluationMethod);

  const handleEvaluationChange = (event) => {
    setEvaluationMethod(event.target.value);
    updateFormData({ evaluationMethod: event.target.value });
  };

  return (
    <div className="form-section">
      <h3>Alegerea Modului de Evaluare</h3>
      <select value={evaluationMethod} onChange={handleEvaluationChange} className="form-control">
        <option value="grila">Grilă</option>
        <option value="adev_fals">Adevărat/Fals</option>
        <option value="eseu">Eseu</option>
      </select>
    </div>
  );
}

export default EvaluationForm;
