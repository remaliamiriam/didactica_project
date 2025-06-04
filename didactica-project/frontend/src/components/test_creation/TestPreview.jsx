import React, { useState, useRef, useEffect } from 'react';
import  './TestPreview.css';
import {
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Form,
  Card,
  Row,
  Col,
} from 'react-bootstrap';
import html2pdf from 'html2pdf.js';
import './TestPreview.css';

const TestPreview = ({ questions = [], testTitle = '', onGenerateFeedback, onBack }) => {
  const [viewMode, setViewMode] = useState('profesor');
  const [studentAnswers, setStudentAnswers] = useState({});
  const [localTestTitle, setLocalTestTitle] = useState(testTitle || localStorage.getItem('testTitle') || '');
  const contentRef = useRef(null);

  useEffect(() => {
    if (testTitle) {
      setLocalTestTitle(testTitle);
    }
  }, [testTitle]);

  const handleStudentAnswerChange = (questionIndex, value, isMultiple) => {
    setStudentAnswers((prev) => {
      const current = prev[questionIndex] || [];

      if (isMultiple) {
        if (current.includes(value)) {
          return {
            ...prev,
            [questionIndex]: current.filter((v) => v !== value),
          };
        } else {
          return {
            ...prev,
            [questionIndex]: [...current, value],
          };
        }
      } else {
        return {
          ...prev,
          [questionIndex]: [value],
        };
      }
    });
  };

  const handleGenerateFeedback = () => {
    const feedback = { message: 'Testul este complet și valid!' };
    if (onGenerateFeedback) {
      onGenerateFeedback(feedback);
    }
  };

  const handleDownloadPDF = () => {
    const element = contentRef.current;
    element.classList.add('pdf-export-mode');

    const opt = {
      margin: 0.5,
      filename: `test-${viewMode}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .finally(() => {
        element.classList.remove('pdf-export-mode');
      });
  };

  return (
    <Card className="test-preview-card">
      <div className="test-preview-header text-center">
        <h3>Previzualizare Test ({viewMode === 'profesor' ? 'Profesor' : 'Elev'})</h3>
        <ToggleButtonGroup
          type="radio"
          name="viewMode"
          value={viewMode}
          onChange={(val) => setViewMode(val)}
          className="mt-3"
        >
          <ToggleButton id="view-prof" value="profesor" variant="outline-purple" size="sm">
            Ca profesor
          </ToggleButton>
          <ToggleButton id="view-elev" value="elev" variant="outline-purple" size="sm">
            Ca elev
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {/* Titlul și întrebările sunt incluse în PDF */}
      <div ref={contentRef}>
        {localTestTitle && <h4 className="fw-bold text-center mt-4 mb-4">{localTestTitle}</h4>}

        {questions.length === 0 ? (
          <p className="text-muted">Nu există întrebări de afișat.</p>
        ) : (
          questions.map((question, index) => {
            const isMultiple = (question.correctAnswers?.length || 0) > 1;

            return (
              <div key={index} className="question-preview">
                {viewMode === 'profesor' && question.competency && (
                  <p><strong>Competență:</strong> {question.competency}</p>
                )}

                <p><strong>Întrebare {index + 1}:</strong> {question.questionText}</p>

                {question.options?.length > 0 && (
                  <>
                    <p><strong>Opțiuni:</strong></p>
                    {viewMode === 'profesor' ? (
                      <ul>
                        {question.options.map((option, idx) => (
                          <li key={idx}>{option}</li>
                        ))}
                      </ul>
                    ) : (
                      <Form>
                        {question.options.map((option, idx) => (
                          <Form.Check
                            key={idx}
                            type={isMultiple ? 'checkbox' : 'radio'}
                            label={option}
                            name={`question-${index}`}
                            value={option}
                            checked={studentAnswers[index]?.includes(option) || false}
                            onChange={() =>
                              handleStudentAnswerChange(index, option, isMultiple)
                            }
                          />
                        ))}
                      </Form>
                    )}
                  </>
                )}

                {question.pairs?.left?.length > 0 && question.pairs?.right?.length > 0 && (
                  <div>
                    <p><strong>Matching:</strong></p>
                    <Row>
                      <Col>
                        <ul>
                          {question.pairs.left.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </Col>
                      <Col>
                        <ul>
                          {question.pairs.right.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </Col>
                    </Row>
                  </div>
                )}

                {viewMode === 'profesor' && question.correctAnswers?.length > 0 && (
                  <p><strong>Răspunsuri corecte:</strong> {question.correctAnswers.join(', ')}</p>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="d-flex justify-content-between mt-4">
        {onBack && (
          <Button variant="secondary" onClick={onBack}>
            Înapoi
          </Button>
        )}
        <div className="d-flex gap-2">
          {viewMode === 'profesor' && onGenerateFeedback && (
            <Button variant="primary" onClick={handleGenerateFeedback}>
              Generează Feedback
            </Button>
          )}
          <Button variant="success" onClick={handleDownloadPDF}>
            Descărcați PDF
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TestPreview;
