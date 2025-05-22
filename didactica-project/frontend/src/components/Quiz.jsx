import React, { useState, useEffect } from "react";
import { Card, Button, ProgressBar } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import "./Quiz.css";

const quizFiles = {
  1: () => import("../data/quizzes/step1_quiz.json"),
  2: () => import("../data/quizzes/step2_quiz.json"),
  3: () => import("../data/quizzes/step3_quiz.json"),
  4: () => import("../data/quizzes/step4_quiz.json"),
  5: () => import("../data/quizzes/step5_quiz.json"),
  6: () => import("../data/quizzes/step6_quiz.json"),
  7: () => import("../data/quizzes/step7_quiz.json"),
};

const Quiz = ({ step, onFinish }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        const quizModule = await quizFiles[step]();
        setQuestions(quizModule.default);
      } catch (error) {
        console.error("Eroare la încărcarea quizului:", error);
      }
    };

    loadQuizData();
  }, [step]);

  const currentQuestion = questions[currentIdx];
  const correctIndex = currentQuestion?.options.findIndex(
    (opt) => opt.trim() === currentQuestion.correctAnswer.trim()
  );

  const handleSelect = (idx) => {
    if (answered) return;

    setSelectedOption(idx);
    setAnswered(true);

    if (idx === correctIndex) {
      setScore((prev) => prev + 1);
    }

    // Trecerea automată la întrebare după 2 secunde
    setTimeout(() => {
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx((prev) => prev + 1);
        setSelectedOption(null);
        setAnswered(false);
      } else {
        const finalScore = score + (idx === correctIndex ? 1 : 0);
        setScore(finalScore);
        setShowResult(true);
        if (finalScore === questions.length) {
          setShowConfetti(true);
        }
      }
    }, 2000);
  };

  const handleFinish = () => {
    setShowConfetti(false);
    onFinish(score, questions.length);
  };

  if (!questions.length) return <p className="text-light">Se încarcă întrebările...</p>;

  return (
    <div className="container-fluid text-light position-relative">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <Card className="glass-panel p-4 mb-4" style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "15px" }}>
        <Card.Body>
          <ProgressBar
            now={((currentIdx + (answered ? 1 : 0)) / questions.length) * 100}
            className="mb-3"
            variant="info"
          />

          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h5>{`Întrebarea ${currentIdx + 1} din ${questions.length}`}</h5>
                <p className="fw-bold">{currentQuestion.question}</p>

                <ul className="list-unstyled">
                  {currentQuestion.options.map((opt, idx) => {
                    let variant = "outline-light";
                    let animationClass = "";

                    if (answered) {
                      if (idx === correctIndex) {
                        variant = "success";
                        animationClass = "pulse";
                      } else if (idx === selectedOption) {
                        variant = "danger";
                        animationClass = "shakeX";
                      }
                    } else if (idx === selectedOption) {
                      variant = "info";
                    }

                    return (
                      <li key={idx} className="mb-2">
                        <motion.button
                          className={`btn w-100 text-start btn-${variant} ${animationClass}`}
                          whileHover={{ scale: !answered ? 1.02 : 1 }}
                          whileTap={{ scale: !answered ? 0.98 : 1 }}
                          onClick={() => handleSelect(idx)}
                          disabled={answered}
                        >
                          {opt}
                        </motion.button>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h4>Rezultatul tău:</h4>
                <h2 className="text-info">
                  {score} / {questions.length}
                </h2>
                <p>{score === questions.length ? "Excelent!" : "Mai încearcă!"}</p>

                <Button variant="primary" onClick={handleFinish}>
                  Continuă cu următorul pas →
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Quiz;