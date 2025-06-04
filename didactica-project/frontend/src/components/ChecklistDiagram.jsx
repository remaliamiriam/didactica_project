import React from "react";
import { motion } from "framer-motion";
import "./ChecklistDiagram.css";

// Culorile din BloomDiagram
const bloomColors = [
  "#ffc107", // Cunoaștere
  "#0dcaf0", // Înțelegere
  "#20c997", // Aplicare
  "#6f42c1", // Analiză
  "#d63384", // Sinteză
  "#fd7e14", // Evaluare
];

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeInOut" },
  },
};

const ChecklistDiagram = ({ items }) => {
  return (
    <div className="checklist-vertical-wrapper">
      {items.map((item, index) => {
        const color = bloomColors[index % bloomColors.length];
        return (
          <motion.div
            key={index}
            className="checklist-point animated-checkpoint"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            whileHover={{
              scale: 1.02,
               transition: { duration: 0.15, ease: "easeOut" },
            }}
          >
            <div className="checklist-icon-wrapper">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="checklist-svg"
              >
                <motion.path
                  variants={draw}
                  d="M5 13l4 4L19 7"
                  className="checklist-check"
                />
              </svg>
            </div>
            <div className="checklist-text-wrapper" style={{ maxWidth: "600px" }}>
              <motion.div
                className="checklist-text"
                style={{
                  borderColor: color,
                  backgroundColor: `${color}10`,
                }}
                whileHover={{
                  backgroundColor: `${color}30`,
                  transition: { duration: 0.3 },
                }}
              >
                {item}
              </motion.div>
              <svg
                viewBox="0 0 100 5"
                className="underline-svg"
                preserveAspectRatio="none"
              >
                <motion.line
                  x1="0"
                  y1="2.5"
                  x2="100"
                  y2="2.5"
                  stroke={color}
                  strokeWidth="4"
                  strokeLinecap="round"
                  variants={draw}
                />
              </svg>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ChecklistDiagram;
