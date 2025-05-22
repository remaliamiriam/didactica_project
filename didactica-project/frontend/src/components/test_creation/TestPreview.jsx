import React from 'react';
import { Button } from 'react-bootstrap'; // Importă Button pentru a-l folosi

const TestPreview = ({ questions, onGenerateFeedback }) => {
  const handleGenerateFeedback = () => {
    const feedback = { message: 'Testul este complet și valid!' };
    onGenerateFeedback(feedback);
  };

  return (
    <div>
      <h3>Previzualizare Test</h3>
      {questions.map((question, index) => (
        <div key={index} className="mb-3">
          <p><strong>{question.questionText}</strong></p>

          {/* Afișează competența asociată */}
          {question.competency && (
            <p><strong>Competență asociată:</strong> {question.competency}</p>
          )}

          {/* Afișează opțiunile pentru întrebările de tip multiple-choice */}
          {question.options && (
            <ul>
              {question.options.map((option, idx) => (
                <li key={idx}>{option}</li>
              ))}
            </ul>
          )}

          {/* Afișează perechile pentru întrebările de tip matching */}
          {question.pairs && (
            <div>
              <p><strong>Listă stângă:</strong></p>
              <ul>
                {question.pairs.left.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <p><strong>Listă dreaptă:</strong></p>
              <ul>
                {question.pairs.right.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Afișează răspunsurile corecte pentru întrebările de tip true-false */}
          {question.correctAnswers && (
            <p><strong>Răspuns corect:</strong> {question.correctAnswers.join(', ')}</p>
          )}
        </div>
      ))}

      <Button onClick={handleGenerateFeedback}>Generează Feedback</Button>
    </div>
  );
};

export default TestPreview;
