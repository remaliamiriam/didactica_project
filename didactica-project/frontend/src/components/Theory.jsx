import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Theory.css";
import BloomAnimated from "././BloomDiagram";
import confetti from "canvas-confetti";

const TOTAL_STEPS = 7;

const theoryFiles = {
  1: () => import("../data/theory/step1_theory.json"),
  2: () => import("../data/theory/step2_theory.json"),
  3: () => import("../data/theory/step3_theory.json"),
  4: () => import("../data/theory/step4_theory.json"),
  5: () => import("../data/theory/step5_theory.json"),
  6: () => import("../data/theory/step6_theory.json"),
  7: () => import("../data/theory/step7_theory.json"),
};

function fireConfettiCorners() {
  const duration = 2 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 70, spread: 360, ticks: 100, zIndex: 999 };

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    // Bottom left
    confetti({
      ...defaults,
      particleCount: 80,
      origin: { x: 0, y: 1 },
    });

    // Bottom right
    confetti({
      ...defaults,
      particleCount: 80,
      origin: { x: 1, y: 1 },
    });
  }, 250);
}

function Theory({ stepKey, onLoaded, onNextStep }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef();

  const progressPercent = Math.round((stepKey / Object.keys(theoryFiles).length) * 100);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const module = await theoryFiles[stepKey]();
        setContent(module.default);
        onLoaded();
        if (panelRef.current) {
          panelRef.current.scrollTop = 0;
        }
      } catch {
        setContent({ error: "Fișierul nu a fost găsit." });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [stepKey, onLoaded]);

  // Declanșăm confetti-ul la ultimul pas
  useEffect(() => {
    if (stepKey === TOTAL_STEPS) {
      fireConfettiCorners();
    }
  }, [stepKey]);

  if (loading) return <p className="text-light">Se încarcă...</p>;
  if (content?.error) return <p className="text-danger">{content.error}</p>;

  if (stepKey === TOTAL_STEPS) {
    return (
      <div className="theory-content" ref={panelRef}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="glass-panel p-5 mt-5 text-center"
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
          >
            Poți reveni oricând pentru a repeta teoria sau testele. Succes mai departe!
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="theory-content" ref={panelRef}>
      <div className="mb-4 w-100">
        <div className="progress" style={{ height: "8px" }}>
          <div
            className="progress-bar bg-info"
            role="progressbar"
            style={{ width: `${progressPercent}%` }}
            aria-valuenow={progressPercent}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <p className="text-light mt-2 text-end small">{progressPercent}% complet</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stepKey}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="mb-4">{content.stepTitle}</h2>

          {content.steps?.map((step, index) => (
            <motion.div
              key={step.id || index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="mb-4"
            >
              <h5>{step.title}</h5>
              <p>{step.description}</p>

              {step.example && (
                <div className="mb-3">
                  {step.example.correct && (
                    <>
                      <strong className="text-success">Exemplu corect:</strong>
                      <p>{step.example.correct}</p>
                    </>
                  )}
                  {step.example.incorrect && (
                    <>
                      <strong className="text-danger">Exemplu greșit:</strong>
                      <p>{step.example.incorrect}</p>
                    </>
                  )}
                  {typeof step.example === "string" && <p>{step.example}</p>}
                </div>
              )}

              {Array.isArray(step.examples) && (
                <div className="mb-3">
                  <strong>Exemple:</strong>
                  <ul>
                    {step.examples.map((ex, idx) => (
                      <li key={idx}>
                        {typeof ex === "string" ? ex : JSON.stringify(ex)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {step.taxonomy && stepKey === 1 && (
                <div className="mb-4">
                  <h6 className="fw-bold text-info mb-3">🌟 Taxonomia Bloom (diagramă animată)</h6>
                  <BloomAnimated />
                </div>
              )}

              {Array.isArray(step.checklist) && (
                <div className="mb-3">
                  <strong>Checklist:</strong>
                  <ul>
                    {step.checklist.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}

          <div className="text-end mt-4">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#0dcaf0", color: "#000" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="btn btn-outline-info"
              onClick={onNextStep}
            >
              Următorul pas →
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Theory;