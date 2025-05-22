// FinalizationForm.jsx
import React from 'react';
import PropTypes from 'prop-types';

function FinalizationForm({ onGenerateTest }) {
  return (
    <div className="form-section">
      <h3>Finalizare și Generare Test</h3>
      <p>După ce ai parcurs toate etapele, poți genera testul final apăsând pe butonul de mai jos.</p>
      <button className="btn btn-success" onClick={onGenerateTest}>
        Generare Test Final
      </button>
    </div>
  );
}

FinalizationForm.propTypes = {
  onGenerateTest: PropTypes.func.isRequired,
};

export default FinalizationForm;
