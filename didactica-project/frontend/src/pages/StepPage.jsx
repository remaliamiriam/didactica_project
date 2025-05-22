// StepPage.js
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import Theory from "../components/Theory";
import Quiz from "../components/Quiz";
import "./StepPage.css";

const TOTAL_STEPS = 7;

const StepPage = () => {
  const { stepNumber } = useParams();
  const stepNum = parseInt(stepNumber || "1");
  const [currentStep, setCurrentStep] = useState(stepNum);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const cardRef = useRef(null);
  const navigate = useNavigate();

  const goToNextStep = () => {
    if (isQuizActive) {
      const nextStep = Math.min(currentStep + 1, TOTAL_STEPS);
      const prevCompleted = parseInt(localStorage.getItem('completedStep') || '1');
      if (nextStep > prevCompleted) {
        localStorage.setItem('completedStep', nextStep.toString());
      }
      setCurrentStep(nextStep);
      navigate(`/step/${nextStep}`);
    }
    setIsQuizActive(!isQuizActive);
  };

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, isQuizActive]);

  return (
    <div className="step-container">
      <Card ref={cardRef} className="glass-panel mx-auto">
        <Card.Body className="scrollable-content custom-scrollbar">
          <Card.Title as="h4" className="card-title">
            Etapa {currentStep}
          </Card.Title>
          <div className="content-section">
            {isQuizActive ? (
              <Quiz
                step={currentStep}
                onFinish={(score, total) => {
                  console.log(`Scor: ${score} din ${total}`);
                  goToNextStep();
                }}
              />
            ) : (
              <Theory
                stepKey={currentStep}
                onLoaded={() => console.log("Teorie încărcată")}
                onNextStep={goToNextStep}
              />
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default StepPage;
