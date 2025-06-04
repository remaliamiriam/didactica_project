import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Table } from 'react-bootstrap';
import './QuestionDistributionForm.css';

const QuestionDistributionForm = ({ specifications, onSubmit, onBack }) => {
  const [duration, setDuration] = useState(90);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [levelDistribution, setLevelDistribution] = useState({});
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');

  const cognitiveLevels = {
    0: 'Cunoaștere',
    1: 'Înțelegere',
    2: 'Aplicare',
    3: 'Analiză',
    4: 'Sinteză',
    5: 'Evaluare'
  };

  // More realistic time estimates per question type (in minutes)
  const timeEstimates = {
    'Cunoaștere': 0.5,    // Recall questions
    'Înțelegere': 1.0,    // Comprehension
    'Aplicare': 1.5,      // Problem solving
    'Analiză': 2.0,       // Analysis
    'Sinteză': 2.5,       // Synthesis
    'Evaluare': 3.0       // Evaluation
  };

  useEffect(() => {
    let total = 0;
    const levels = {
      'Cunoaștere': 0,
      'Înțelegere': 0,
      'Aplicare': 0,
      'Analiză': 0,
      'Sinteză': 0,
      'Evaluare': 0
    };

    Object.values(specifications).forEach(row => {
      row.objectives.forEach((count, index) => {
        total += count;
        const levelName = cognitiveLevels[index];
        if (levelName) {
          levels[levelName] += count;
        }
      });
    });

    setTotalQuestions(total);
    setLevelDistribution(levels);
  }, [specifications]);

  useEffect(() => {
    if (totalQuestions === 0) return;

    // Calculate total estimated time needed
    let totalEstimatedTime = 0;
    Object.entries(levelDistribution).forEach(([level, count]) => {
      totalEstimatedTime += count * timeEstimates[level];
    });

    // Calculate buffer time (10% of duration)
    const bufferTime = duration * 0.1;
    const availableTime = duration - bufferTime;

    // Validation logic
    const timeDifference = totalEstimatedTime - availableTime;
    const percentageDifference = (timeDifference / duration) * 100;

    if (totalEstimatedTime <= availableTime) {
      setIsValid(true);
      if (percentageDifference > -10) {
        setValidationMessage(`Testul este aproape de limita de timp. Timp estimat: ${Math.round(totalEstimatedTime)} minute din ${duration} disponibile.`);
      } else {
        setValidationMessage('');
      }
    } else {
      setIsValid(false);
      setValidationMessage(
        `Timpul estimat (${Math.round(totalEstimatedTime)} minute) depășește durata testului (${duration} minute) cu ${Math.round(percentageDifference)}%. 
        Recomandări:
        - Reduceți numărul de întrebări complexe
        - Adăugați ${Math.round(timeDifference)} minute la durata testului
        - Reechilibrați distribuția nivelurilor cognitive`
      );
    }
  }, [duration, totalQuestions, levelDistribution]);

  const calculateQuestionStats = () => {
    const stats = {
      totalEstimatedTime: 0,
      timePerQuestion: {},
      distribution: []
    };

    Object.entries(levelDistribution).forEach(([level, count]) => {
      const levelTime = count * timeEstimates[level];
      stats.totalEstimatedTime += levelTime;
      stats.timePerQuestion[level] = timeEstimates[level];
      if (count > 0) {
        stats.distribution.push({
          level,
          count,
          percentage: Math.round((count / totalQuestions) * 100),
          totalTime: Math.round(levelTime)
        });
      }
    });

    return stats;
  };

  const handleSubmit = () => {
    if (isValid) {
      const stats = calculateQuestionStats();
      onSubmit({
        totalQuestions,
        duration,
        levelDistribution,
        passedValidation: true,
        estimatedTime: stats.totalEstimatedTime,
        timePerQuestion: stats.timePerQuestion
      });
    }
  };

  const stats = calculateQuestionStats();

  return (
    <div className="p-4">
      <h4 className="form-title">3. Verificare distribuție întrebări și durată test</h4>

      <Form.Group className="mb-3">
        <Form.Label>Durata testului (în minute)</Form.Label>
        <Form.Control
          type="number"
          min="1"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </Form.Group>

      <Table striped bordered className="custom-table">
        <thead>
          <tr>
            <th>Nivel cognitiv</th>
            <th>Număr întrebări</th>
            <th>Procentaj</th>
            <th>Timp estimat (min)</th>
            <th>Timp pe întrebare (min)</th>
          </tr>
        </thead>
        <tbody>
          {stats.distribution.map((item) => (
            <tr key={item.level}>
              <td>{item.level}</td>
              <td>{item.count}</td>
              <td>{item.percentage}%</td>
              <td>{item.totalTime}</td>
              <td>{timeEstimates[item.level].toFixed(1)}</td>
            </tr>
          ))}
          <tr className="summary-row">
            <td><strong>Total</strong></td>
            <td><strong>{totalQuestions}</strong></td>
            <td><strong>100%</strong></td>
            <td><strong>{Math.round(stats.totalEstimatedTime)}</strong></td>
            <td><strong>{(stats.totalEstimatedTime / totalQuestions).toFixed(1)}</strong></td>
          </tr>
          <tr>
            <td colSpan="3"><strong>Durata testului</strong></td>
            <td colSpan="2"><strong>{duration} minute</strong></td>
          </tr>
          <tr>
            <td colSpan="3"><strong>Timp disponibil (cu buffer 10%)</strong></td>
            <td colSpan="2"><strong>{Math.round(duration * 0.9)} minute</strong></td>
          </tr>
        </tbody>
      </Table>

      {validationMessage && (
        <Alert variant={isValid ? 'warning' : 'danger'} className="mt-3">
          {validationMessage}
        </Alert>
      )}

      <div className="d-flex justify-content-between mt-3">
        <Button variant="secondary" onClick={onBack}>
          Înapoi
        </Button>
        <Button variant="success" onClick={handleSubmit} disabled={!isValid}>
          Continuă
        </Button>
      </div>
    </div>
  );
};

export default QuestionDistributionForm;