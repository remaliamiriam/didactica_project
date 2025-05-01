// StepPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Card } from "react-bootstrap";
import Theory from "../components/Theory";
import Quiz from "../components/Quiz";
import "./StepPage.css";

const TOTAL_STEPS = 7;

const StepPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const cardRef = useRef(null);

  const goToNextStep = () => {
    if (isQuizActive) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
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
      <Card
  ref={cardRef}
  className="glass-panel p-4 custom-scrollbar mx-auto"
>
        <Card.Body>
          <Card.Title as="h4" className="mb-4 text-center">
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
