import React from 'react';

const TestFeedback = ({ feedback }) => {
  return (
    <div>
      <h4>Feedback pentru test:</h4>
      <p>{feedback.message}</p>
    </div>
  );
};

export default TestFeedback;
