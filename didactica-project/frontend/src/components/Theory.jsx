import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Theory.css";
import BloomAnimated from "./BloomDiagram";
import ChecklistDiagram from "./ChecklistDiagram";

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

function Theory({ stepKey, onLoaded, onNextStep }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef();

  const progressPercent = Math.round((stepKey / TOTAL_STEPS) * 100);

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

  if (loading) return <p className="text-light">Se încarcă...</p>;
  if (content?.error) return <p className="text-danger">{content.error}</p>;

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
                      <strong style={{ color: "#80ff00" }}>Exemplu corect:</strong>
                      <p>{step.example.correct}</p>
                    </>
                  )}
                  {step.example.incorrect && (
                    <>
                      <strong style={{ color: "#FC00FE" }}>Exemplu greșit:</strong>
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
                  <h6 className="fw-bold text-info mb-3">🌟 Taxonomia Bloom </h6>
                  <BloomAnimated />
                </div>
              )}

              {Array.isArray(step.checklist) && (
                <div className="mb-3">
                  <h6 className="fw-bold text-info mb-3">Checklist : </h6>
                  <ChecklistDiagram items={step.checklist} />
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
              {stepKey === TOTAL_STEPS ? "Finalizează →" : "Următorul pas →"}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Theory;