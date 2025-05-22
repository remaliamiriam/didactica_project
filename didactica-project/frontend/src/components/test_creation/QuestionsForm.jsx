import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { validateQuestion } from '../../utils/validator.js'; // ✅ Import validator

const QuestionsForm = ({ competencies, specifications, onQuestionsChange }) => {
  const [questionType, setQuestionType] = useState('multiple-choice-single');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [matchingLeft, setMatchingLeft] = useState('');
  const [matchingRight, setMatchingRight] = useState('');
  const [points, setPoints] = useState('');
  const [selectedCompetency, setSelectedCompetency] = useState(''); // ✅ Competență selectată
  const [errors, setErrors] = useState([]); // ✅ Pentru feedback

  const handleAddQuestion = () => {
    const validationErrors = validateQuestion(questionText);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);

    let newQuestion = {
      questionText,
      questionType,
      points: Number(points),
      competency: selectedCompetency, // ✅ Adăugăm competența selectată
    };

    if (questionType.startsWith('multiple-choice')) {
      newQuestion.options = options;
      newQuestion.correctAnswers = correctAnswers;
    }

    if (questionType === 'true-false') {
      newQuestion.correctAnswers = correctAnswers;
    }

    if (questionType === 'matching') {
      newQuestion.pairs = {
        left: matchingLeft.split(',').map((item) => item.trim()),
        right: matchingRight.split(',').map((item) => item.trim()),
      };
    }

    onQuestionsChange((prev) => [...prev, newQuestion]);

    setQuestionText('');
    setOptions([]);
    setCorrectAnswers([]);
    setMatchingLeft('');
    setMatchingRight('');
    setPoints('');
    setSelectedCompetency(''); // ✅ Reset competența
  };

  return (
    <div>
      <Form.Group>
        <Form.Label>Tipul întrebării:</Form.Label>
        <Form.Control
          as="select"
          value={questionType}
          onChange={(e) => {
            setQuestionType(e.target.value);
            setOptions([]);
            setCorrectAnswers([]);
          }}
        >
          <option value="multiple-choice-single">Alegere multiplă (1 răspuns corect)</option>
          <option value="multiple-choice-multiple">Alegere multiplă (mai multe răspunsuri corecte)</option>
          <option value="true-false">Adevărat / Fals</option>
          <option value="matching">Perechi (asociere)</option>
          <option value="open-ended-short">Răspuns scurt (deschis)</option>
          <option value="open-ended-long">Răspuns lung / eseu</option>
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Textul întrebării:</Form.Label>
        <Form.Control
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          isInvalid={errors.length > 0}
        />
      </Form.Group>

      {errors.length > 0 && (
        <Alert variant="danger">
          {errors.map((err, i) => (
            <div key={i}>• {err}</div>
          ))}
        </Alert>
      )}

      {(questionType === 'multiple-choice-single' || questionType === 'multiple-choice-multiple') && (
        <>
          <Form.Group>
            <Form.Label>Opțiuni (separate prin virgulă):</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ex: A,B,C,D"
              onChange={(e) => setOptions(e.target.value.split(',').map(opt => opt.trim()))}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Răspuns(uri) corect(e) (separate prin virgulă):</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ex: A sau A,C"
              onChange={(e) => setCorrectAnswers(e.target.value.split(',').map(opt => opt.trim()))}
            />
          </Form.Group>
        </>
      )}

      {questionType === 'true-false' && (
        <Form.Group>
          <Form.Label>Răspuns corect:</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => setCorrectAnswers([e.target.value])}
          >
            <option value="">Selectează</option>
            <option value="adevărat">Adevărat</option>
            <option value="fals">Fals</option>
          </Form.Control>
        </Form.Group>
      )}

      {questionType === 'matching' && (
        <>
          <Form.Group>
            <Form.Label>Listă stângă:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ex: Autor,Regulă"
              value={matchingLeft}
              onChange={(e) => setMatchingLeft(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Listă dreaptă:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ex: Operă,Exemplu"
              value={matchingRight}
              onChange={(e) => setMatchingRight(e.target.value)}
            />
          </Form.Group>
        </>
      )}

      {(questionType === 'open-ended-short' || questionType === 'open-ended-long') && (
        <Form.Text className="text-muted">
          Acest tip de întrebare va necesita evaluare manuală.
        </Form.Text>
      )}

      <Form.Group>
        <Form.Label>Punctaj:</Form.Label>
        <Form.Control
          type="number"
          min="0"
          step="0.5"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
      </Form.Group>

      {/* Dropdown pentru competență */}
      <Form.Group className="mb-3">
        <Form.Label>Competență asociată:</Form.Label>
        <Form.Control
          as="select"
          value={selectedCompetency}
          onChange={(e) => setSelectedCompetency(e.target.value)}
        >
          <option value="">Selectează o competență</option>
          {competencies.map((entry, idx) => (
            <option key={idx} value={entry.competency}>
              {entry.competency} ({entry.contentUnit})
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Button onClick={handleAddQuestion} className="mt-3">
        Adaugă Întrebare
      </Button>
    </div>
  );
};

export default QuestionsForm;
