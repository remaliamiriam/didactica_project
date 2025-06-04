import React, { useState, useEffect } from 'react'; 
import { Button, Form, Alert, Row, Col, Card } from 'react-bootstrap';
import { validateQuestion } from '../../utils/validator';
import './QuestionsForm.css';

const MultipleChoiceEditor = ({ questionType, options, correctAnswers, setOptions, setCorrectAnswers }) => {
  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const toggleCorrect = (index) => {
    const option = options[index];
    if (questionType === 'multiple-choice-single') {
      setCorrectAnswers([option]);
    } else {
      setCorrectAnswers(
        correctAnswers.includes(option)
          ? correctAnswers.filter((ans) => ans !== option)
          : [...correctAnswers, option]
      );
    }
  };

  const addOption = () => setOptions([...options, '']);
  const removeOption = (index) => {
    const removed = options[index];
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);
    setCorrectAnswers(correctAnswers.filter((ans) => ans !== removed));
  };

  return (
    <Card className="mb-3 p-3">
      <Card.Title as="h6" className="mb-3">Opțiuni:</Card.Title>
      {options.map((opt, idx) => (
        <Row key={idx} className="mb-2 align-items-center">
          <Col xs="auto">
            <Form.Check
              type={questionType === 'multiple-choice-single' ? 'radio' : 'checkbox'}
              name="correct-answer"
              checked={correctAnswers.includes(opt)}
              onChange={() => toggleCorrect(idx)}
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
            />
          </Col>
          <Col xs="auto">
            <Button variant="danger" size="sm" onClick={() => removeOption(idx)}>Șterge</Button>
          </Col>
        </Row>
      ))}
      <Button variant="secondary" size="sm" onClick={addOption}>Adaugă opțiune</Button>
    </Card>
  );
};

const MatchingEditor = ({ pairs, setPairs }) => {
  const handleChange = (index, side, value) => {
    const updated = [...pairs];
    updated[index][side] = value;
    setPairs(updated);
  };

  const addPair = () => setPairs([...pairs, { left: '', right: '' }]);
  const removePair = (index) => setPairs(pairs.filter((_, i) => i !== index));

  return (
    <Card className="mb-3 p-3">
      <Card.Title as="h6" className="mb-3">Perechi:</Card.Title>
      {pairs.map((pair, idx) => (
        <Row key={idx} className="mb-2">
          <Col>
            <Form.Control
              placeholder="Stânga"
              value={pair.left}
              onChange={(e) => handleChange(idx, 'left', e.target.value)}
            />
          </Col>
          <Col>
            <Form.Control
              placeholder="Dreapta"
              value={pair.right}
              onChange={(e) => handleChange(idx, 'right', e.target.value)}
            />
          </Col>
          <Col xs="auto">
            <Button variant="danger" size="sm" onClick={() => removePair(idx)}>Șterge</Button>
          </Col>
        </Row>
      ))}
      <Button variant="secondary" size="sm" onClick={addPair}>Adaugă pereche</Button>
    </Card>
  );
};

const QuestionsForm = ({ competencies, onQuestionsChange, onNextStep, onBack, initialQuestions = [] }) => {
  const [testTitle, setTestTitle] = useState(localStorage.getItem('testTitle') || '');
  const [questionType, setQuestionType] = useState('multiple-choice-single');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [points, setPoints] = useState('');
  const [selectedCompetency, setSelectedCompetency] = useState('');
  const [errors, setErrors] = useState([]);
  const [questions, setQuestions] = useState(initialQuestions);
  const [editIndex, setEditIndex] = useState(null);

  // Salvează titlul în localStorage când se schimbă
  useEffect(() => {
    localStorage.setItem('testTitle', testTitle);
  }, [testTitle]);

  useEffect(() => {
    onQuestionsChange(questions);
    localStorage.setItem('questions', JSON.stringify(questions));
  }, [questions]);

  const handleAddOrUpdateQuestion = () => {
    const validationErrors = validateQuestion(questionText);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newQuestion = {
      questionText,
      questionType,
      points: Number(points),
      competency: selectedCompetency,
      ...(questionType.startsWith('multiple-choice') && { options, correctAnswers }),
      ...(questionType === 'true-false' && { correctAnswers }),
      ...(questionType === 'matching' && { pairs }),
    };

    const updatedQuestions = [...questions];
    if (editIndex !== null) {
      updatedQuestions[editIndex] = newQuestion;
    } else {
      updatedQuestions.push(newQuestion);
    }

    setQuestions(updatedQuestions);
    resetForm();
  };

  const handleEdit = (index) => {
    const q = questions[index];
    setQuestionText(q.questionText);
    setQuestionType(q.questionType);
    setPoints(q.points);
    setSelectedCompetency(q.competency);
    setOptions(q.options || []);
    setCorrectAnswers(q.correctAnswers || []);
    setPairs(q.pairs || []);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const resetForm = () => {
    setQuestionText('');
    setQuestionType('multiple-choice-single');
    setOptions([]);
    setCorrectAnswers([]);
    setPairs([]);
    setPoints('');
    setSelectedCompetency('');
    setErrors([]);
    setEditIndex(null);
  };

  const handleContinue = () => {
    onNextStep(testTitle);  // aici trimiți titlul mai departe
  };

  return (
    <div className="questions-form-container">
      <div className="left-column">
        {/* Câmp titlu test */}
        <Form.Group className="mb-4">
          <Form.Label>Titlul testului:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Introdu titlul testului"
            value={testTitle}
            onChange={(e) => setTestTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tipul întrebării:</Form.Label>
          <Form.Control
            as="select"
            value={questionType}
            onChange={(e) => {
              setQuestionType(e.target.value);
              setOptions([]);
              setCorrectAnswers([]);
              setPairs([]);
            }}
          >
            <option value="multiple-choice-single">Alegere multiplă (1 răspuns corect)</option>
            <option value="multiple-choice-multiple">Alegere multiplă (mai multe răspunsuri)</option>
            <option value="true-false">Adevărat / Fals</option>
            <option value="matching">Perechi (asociere)</option>
            <option value="open-ended-short">Răspuns scurt</option>
            <option value="open-ended-long">Răspuns lung / eseu</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Textul întrebării:</Form.Label>
          <Form.Control
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            isInvalid={errors.length > 0}
          />
          {errors.length > 0 && (
            <Alert variant="danger" className="mt-2">
              {errors.map((err, i) => <div key={i}>• {err}</div>)}
            </Alert>
          )}
        </Form.Group>

        {(questionType === 'multiple-choice-single' || questionType === 'multiple-choice-multiple') && (
          <MultipleChoiceEditor
            questionType={questionType}
            options={options}
            correctAnswers={correctAnswers}
            setOptions={setOptions}
            setCorrectAnswers={setCorrectAnswers}
          />
        )}

        {questionType === 'true-false' && (
          <Form.Group className="mb-3">
            <Form.Label>Răspuns corect:</Form.Label>
            <Form.Control as="select" onChange={(e) => setCorrectAnswers([e.target.value])}>
              <option value="">Selectează</option>
              <option value="adevărat">Adevărat</option>
              <option value="fals">Fals</option>
            </Form.Control>
          </Form.Group>
        )}

        {questionType === 'matching' && (
          <MatchingEditor pairs={pairs} setPairs={setPairs} />
        )}

        {(questionType === 'open-ended-short' || questionType === 'open-ended-long') && (
          <Form.Text className="manual-evaluation-message">
            Acest tip de întrebare necesită evaluare manuală.
          </Form.Text>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Punctaj:</Form.Label>
          <Form.Control
            type="number"
            min="0"
            step="0.5"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
          />
        </Form.Group>

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

        <Button className="mt-3 me-2" onClick={handleAddOrUpdateQuestion}>
          {editIndex !== null ? 'Actualizează Întrebarea' : 'Adaugă Întrebare'}
        </Button>

        <div className="nav-buttons">
          <Button className="btn-back" onClick={onBack}>Înapoi</Button>
          <Button className="btn-continue" onClick={handleContinue}>Continuă</Button>
        </div>
      </div>

      <div className="right-column">
        <h5>Întrebări salvate:</h5>
        {questions.map((q, idx) => (
          <Card key={idx} className="question-card">
            <div><strong>{q.questionText}</strong></div>
            <div className="mt-1"><small>{q.questionType} – {q.points} puncte</small></div>
            <div className="mt-2 text-end">
              <Button size="sm" className="btn-edit me-2" onClick={() => handleEdit(idx)}>Editează</Button>
              <Button size="sm" className="btn-delete" onClick={() => handleDelete(idx)}>Șterge</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuestionsForm;
