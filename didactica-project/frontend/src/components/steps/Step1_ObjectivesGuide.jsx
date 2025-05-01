/*import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card } from "react-bootstrap";
import Theory from "./Theory";  // Componenta pentru teoria etapei
import Quiz from "./Quiz"; // Componenta pentru quiz

export default function Step1_ObjectivesGuide() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [theoryLoaded, setTheoryLoaded] = useState(false); // Stare pentru încărcarea teoriei

  const navigate = useNavigate();
  const userNickname = localStorage.getItem("userNickname");

  // Handle finalizarea quiz-ului
  const handleQuizFinish = (finalScore, total) => {
    setScore(finalScore);
    setTotalQuestions(total);
    setQuizCompleted(true);

    // Salvează progresul utilizatorului
    if (!userNickname) return;

    const userData = JSON.parse(localStorage.getItem(userNickname)) || {
      unlockedSteps: ["1"],
      scores: {},
    };

    userData.scores["step1"] = finalScore;

    // Dacă utilizatorul a obținut 50% sau mai mult, poate trece la pasul următor
    if (finalScore / total >= 0.5 && !userData.unlockedSteps.includes("2")) {
      userData.unlockedSteps.push("2");
    }

    localStorage.setItem(userNickname, JSON.stringify(userData));
  };

  // Dacă scorul este suficient, direcționează către următorul pas
  const handleContinue = () => {
    if (score / totalQuestions >= 0.5) {
      navigate("/step/2");
    }
  };

  // Dacă scorul nu este suficient, permite reluarea etapei
  const handleRetry = () => {
    setQuizCompleted(false);
    setScore(0);
    setTheoryLoaded(false); // Reîncarcă teoria
  };

  // Mark theory as loaded
  const handleTheoryLoaded = () => {
    setTheoryLoaded(true);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Etapa 1: Formularea obiectivelor</h2>

      <Card className="mb-4 shadow">
        <Card.Body>
          <Theory stepKey={1} onLoaded={handleTheoryLoaded} />
        </Card.Body>
      </Card>

      {/* Verificăm dacă teoria a fost încărcată înainte de a arăta quiz-ul */}
      {theoryLoaded && !quizCompleted && (
        <Card className="mb-4 shadow">
          <Card.Body>
            <Quiz
              step="1"
              title="Test de verificare"
              onFinish={handleQuizFinish}
            />
          </Card.Body>
        </Card>
      )}

      {/* Alerta cu succes sau opțiunea de a reia etapa */}
      {quizCompleted && (
        <Alert variant={score / totalQuestions >= 0.5 ? "success" : "danger"} className="text-center">
          <h5>{score / totalQuestions >= 0.5 ? "Felicitări! Ai finalizat quiz-ul." : "Scor insuficient!"}</h5>
          <p>
            Ai obținut {score} din {totalQuestions} puncte.
          </p>
          {score / totalQuestions >= 0.5 ? (
            <Button variant="success" onClick={handleContinue}>
              Continuă la etapa 2
            </Button>
          ) : (
            <Button variant="danger" onClick={handleRetry}>
              Reia etapa
            </Button>
          )}
        </Alert>
      )}
    </div>
  );
}
*/