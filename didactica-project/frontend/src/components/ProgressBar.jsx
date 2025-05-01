import React from "react";
import PropTypes from "prop-types";

const ProgressBar = ({ currentStep, totalSteps }) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="mb-4">
      <label className="form-label fw-bold">
        Progres: {currentStep}/{totalSteps} pași ({percentage}%)
      </label>
      <div className="progress" style={{ height: "25px" }}>
        <div
          className="progress-bar progress-bar-striped progress-bar-animated bg-success"
          role="progressbar"
          style={{ width: `${percentage}%` }}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {percentage}%
        </div>
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
};

export default ProgressBar;
