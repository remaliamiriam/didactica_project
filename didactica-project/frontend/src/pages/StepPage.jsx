import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import Theory from "../components/Theory";
import Quiz from "../components/Quiz";
import "./StepPage.css";
import confetti from "canvas-confetti";

const TOTAL_STEPS = 7;

function fireConfetti() {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 80 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}

const StepPage = () => {
  const { stepNumber } = useParams();
  const [currentStep, setCurrentStep] = useState(parseInt(stepNumber || "1", 10));
  const [mode, setMode] = useState("theory");
  const cardRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const newStep = parseInt(stepNumber || "1", 10);
    setCurrentStep(newStep);
    setMode("theory");
  }, [stepNumber]);

  const handleNextFromTheory = () => {
    setMode("quiz");
  };

  const handleQuizFinish = (score, total) => {
    console.log(`Scor: ${score} din ${total}`);

    if (currentStep === TOTAL_STEPS) {
      fireConfetti();
      setMode("congrats");
    } else {
      const nextStep = currentStep + 1;
      const prevCompleted = parseInt(localStorage.getItem("completedStep") || "1", 10);
      if (nextStep > prevCompleted) {
        localStorage.setItem("completedStep", nextStep.toString());
      }
      setCurrentStep(nextStep);
      navigate(`/step/${nextStep}`);
      setMode("theory");
    }
  };

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, mode]);

  return (
    <div className="step-container">
      <Card ref={cardRef} className="glass-panel mx-auto">
        <Card.Body className="scrollable-content custom-scrollbar">
          {mode !== "congrats" && (
            <Card.Title as="h4" className="card-title">
              Etapa {currentStep}
            </Card.Title>
          )}

          <div className="content-section">
            <AnimatePresence mode="wait" initial={false}>
              {mode === "theory" && (
                <motion.div
                  key="theory"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Theory
                    stepKey={currentStep}
                    onLoaded={() => console.log("Teorie încărcată")}
                    onNextStep={handleNextFromTheory}
                  />
                </motion.div>
              )}

              {mode === "quiz" && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Quiz
                    step={currentStep}
                    onFinish={handleQuizFinish}
                  />
                </motion.div>
              )}

              {mode === "congrats" && (
                <motion.div
                  key="congrats"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="congrats-message text-center p-5"
                >
                  <motion.h2
                    initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-4"
                  >
                    🎉 Felicitări! Ai parcurs toate etapele 🎉
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-4"
                  >
                    Poți reveni oricând pentru a repeta teoria sau testele. Succes mai departe!
                  </motion.p>

                  <div className="d-flex justify-content-center gap-3 mt-4">
                    <button className="btn btn-primary" onClick={() => navigate("/resources")}>
                      Mergi la Resurse
                    </button>
                    <button className="btn btn-success" onClick={() => navigate("/creation")}>
                      Creează un Test
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default StepPage;
