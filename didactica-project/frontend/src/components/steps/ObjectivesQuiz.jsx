/*import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Form, Spinner } from 'react-bootstrap';

const ObjectivesQuiz = ({ onPassed }) => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch('/api/step1/quiz');
        const data = await response.json();
        setQuizQuestions(data.questions);
      } catch (error) {
        console.error("Eroare la încărcarea quizului:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []);

  const handleOptionChange = (qIndex, answer) => {
    setUserAnswers(prev => ({ ...prev, [qIndex]: answer }));
    const isCorrect = quizQuestions[qIndex].correctAnswer === answer;
    setFeedback(prev => ({ ...prev, [qIndex]: isCorrect ? '✅ Corect!' : '❌ Greșit!' }));
  };

  const handleFinish = () => {
    const correctCount = quizQuestions.reduce((acc, q, index) => {
      return acc + (userAnswers[index] === q.correctAnswer ? 1 : 0);
    }, 0);
    setScore(correctCount);

    if (correctCount === quizQuestions.length) {
      localStorage.setItem("step1_completed", "true");
      if (onPassed) onPassed();
    }
  };

  if (loading) return <Spinner animation="border" className="mt-4" />;

  return (
    <Card className="glass-panel shadow-sm mt-4 p-4">
      <Card.Body>
        <Card.Title className="fs-4 mb-3">📝 Quiz: Formularea obiectivelor</Card.Title>

        {quizQuestions.map((q, index) => (
          <div key={index} className="mb-4">
            <strong>{index + 1}. {q.question}</strong>
            <Form>
              {q.options.map((option, i) => (
                <Form.Check
                  key={i}
                  type="radio"
                  name={`question-${index}`}
                  label={option}
                  value={option}
                  checked={userAnswers[index] === option}
                  onChange={() => handleOptionChange(index, option)}
                />
              ))}
            </Form>
            {feedback[index] && (
              <Alert variant={feedback[index].startsWith('✅') ? "success" : "danger"} className="mt-2">
                {feedback[index]}
              </Alert>
            )}
          </div>
        ))}

        <Button variant="primary" onClick={handleFinish}>Termină quiz-ul</Button>

        {score !== null && (
          <Alert className="mt-3" variant={score === quizQuestions.length ? "success" : "warning"}>
            Ai obținut {score} din {quizQuestions.length}. {score === quizQuestions.length ? "Bravo! Etapa 2 este deblocată." : "Încearcă din nou pentru a trece etapa."}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default ObjectivesQuiz;*/