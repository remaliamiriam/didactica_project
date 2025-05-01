import React from 'react';
import { motion } from 'framer-motion';
import './StatsCards.css'; // Asigură-te că ai acest fișier pentru stiluri

const StatsCard = ({ title, value, icon }) => {
  return (
    <motion.div
      className="stats-card glass-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p>{value}</p>
    </motion.div>
  );
};

export default StatsCard;
