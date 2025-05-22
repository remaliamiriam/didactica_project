import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Table } from 'react-bootstrap';

const QuestionDistributionValidation = ({ specifications, onSubmit }) => {
  const [duration, setDuration] = useState(90); // default 90 minute
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(0);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const total = Object.values(specifications).reduce(
      (sum, row) => sum + row.objectives.reduce((a, b) => a + b, 0),
      0
    );
    setTotalQuestions(total);
  }, [specifications]);

  useEffect(() => {
    const max = Math.floor((duration * 60) / 3); // 3 secunde per întrebare
    setMaxQuestions(max);
    setIsValid(totalQuestions <= max);
  }, [duration, totalQuestions]);

  const handleSubmit = () => {
    if (isValid) {
      onSubmit({
        totalQuestions,
        duration,
        passedValidation: true
      });
    }
  };

  return (
    <div className="p-4">
      <h4>3. Verificare distribuție întrebări și durată test</h4>

      <Form.Group className="mb-3">
        <Form.Label>Durata testului (în minute)</Form.Label>
        <Form.Control
          type="number"
          min="1"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </Form.Group>

      <Table striped bordered>
        <tbody>
          <tr>
            <td><strong>Total întrebări definite</strong></td>
            <td>{totalQuestions}</td>
          </tr>
          <tr>
            <td><strong>Întrebări permise (durată × 60 ÷ 3)</strong></td>
            <td>{maxQuestions}</td>
          </tr>
        </tbody>
      </Table>

      {!isValid && (
        <Alert variant="danger">
          Numărul de întrebări depășește limita permisă pentru durata introdusă.
        </Alert>
      )}

      <div className="d-flex justify-content-end mt-3">
        <Button
          variant="success"
          onClick={handleSubmit}
          disabled={!isValid}
        >
          Continuă
        </Button>
      </div>
    </div>
  );
};

export default QuestionDistributionValidation;
