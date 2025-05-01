import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListGroup, Badge, Button, Card } from 'react-bootstrap';
import './GuidePage.css';

const Guide = () => {
  const [steps] = useState([
    { title: 'Etapa 1 - Identificarea competențelor', isLocked: false },
    { title: 'Etapa 2 - Crearea tabelei de specificații', isLocked: true },
    { title: 'Etapa 3 - Formularea întrebărilor', isLocked: true },
    { title: 'Etapa 4 - Evaluarea testului', isLocked: true }
  ]);

  const navigate = useNavigate();

  const handleStepClick = (stepIndex) => {
    if (!steps[stepIndex].isLocked) {
      navigate(`/step/${stepIndex + 1}`); // Navigăm către pagina pentru etapa respectivă
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar pentru etape */}
      <div className="glass-panel-header">
          <h1>Ghid - Elaborare test de cunoștințe</h1>
      </div>
      <div>
        <ListGroup>
          {steps.map((step, index) => (
            <ListGroup.Item
              key={index}
              action
              onClick={() => handleStepClick(index)}
              className={`d-flex justify-content-between align-items-center ${
                step.isLocked ? 'text-muted' : ''
              }`}
              style={{ cursor: step.isLocked ? 'not-allowed' : 'pointer' }}
            >
              <span>{step.title}</span>
              {step.isLocked ? (
                <Badge bg="secondary">🔒</Badge>
              ) : (
                <Badge bg="success">✔️</Badge>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>

      {/* Conținutul ghidului */}
      <div className="flex-grow-1 p-3">
        <Card className="glass-panel">
          <Card.Body>
            <Card.Title>Ghid-Elaborare test de cunostinte</Card.Title>
            <div className="content">
              <p>Acesta este ghidul detaliat pentru crearea unui test de cunoștințe. Fiecare etapă va fi prezentată în detaliu.</p>
              <p>Continue reading...</p>
            </div>
            <div className="text-center mt-3">
              <Button variant="primary" onClick={() => navigate('/step/1')}>
                Începe ghidul
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Guide;
