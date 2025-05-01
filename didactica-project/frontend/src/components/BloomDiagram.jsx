import React from "react";
import "./BloomDiagram.css";
import { motion } from "framer-motion";

const taxonomyLevels = [
  {
    title: "Cunoaștere",
    description: "Recunoașterea și amintirea de fapte, informații.",
    verbs: ["a recunoaște", "a enumera", "a descrie", "a identifica"],
    color: "#ffc107",
  },
  {
    title: "Înțelegere",
    description: "Explicarea conceptelor în cuvintele proprii.",
    verbs: ["a explica", "a interpreta", "a clarifica", "a parafraza"],
    color: "#0dcaf0",
  },
  {
    title: "Aplicare",
    description: "Utilizarea cunoștințelor în contexte noi.",
    verbs: ["a aplica", "a utiliza", "a rezolva", "a demonstra"],
    color: "#20c997",
  },
  {
    title: "Analiză",
    description: "Dezintegrarea unui întreg în părți componente.",
    verbs: ["a compara", "a analiza", "a evalua", "a diferenția"],
    color: "#6f42c1",
  },
  {
    title: "Sinteză",
    description: "Combinarea elementelor pentru o idee nouă.",
    verbs: ["a crea", "a formula", "a proiecta", "a concepe"],
    color: "#d63384",
  },
  {
    title: "Evaluare",
    description: "Judecarea valorii unui material sau a unei idei.",
    verbs: ["a justifica", "a argumenta", "a evalua", "a decide"],
    color: "#fd7e14",
  },
];

const BloomDiagram = () => {
  return (
    <div className="timeline-wrapper custom-scrollbar">
    
      {taxonomyLevels.map((level, index) => (
        <motion.div
          key={index}
          className="timeline-point"
          style={{ borderColor: level.color }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 500, damping: 10 }}
        >
          <div className="timeline-header" style={{ color: level.color }}>
            {level.title}
          </div>
          <div className="timeline-description">{level.description}</div>
          <div className="timeline-verbs">
            {level.verbs.map((v, i) => (
              <motion.div
                key={i}
                className="timeline-verb"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.1 }}
                style={{
                  borderColor: level.color,
                  color: level.color,
                }}
              >
                {v}
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default BloomDiagram;
