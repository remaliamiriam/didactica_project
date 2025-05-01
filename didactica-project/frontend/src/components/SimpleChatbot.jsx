import React, { useState } from 'react';
import './SimpleChatbot.css';
import { motion } from 'framer-motion';

const DraggableChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Salut! Ai nevoie de ajutor?' }
  ]);
  const [input, setInput] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { from: 'user', text: input }]);
      // Răspunsuri bazate pe reguli simple
      const response = getBotResponse(input.toLowerCase());
      setMessages((prev) => [...prev, { from: 'bot', text: response }]);
      setInput('');
    }
  };

  const getBotResponse = (text) => {
    if (text.includes('progres')) return 'Poți vedea progresul tău în partea de sus.';
    if (text.includes('ghid')) return 'Ghidul te ajută pas cu pas. Îl găsești în bara laterală!';
    return 'Îmi pare rău, nu am înțeles. Încearcă cu: "progres", "ghid" etc.';
  };

  return (
    <motion.div drag className="chatbot-wrapper">
      {!isOpen && (
        <div className="chatbot-bubble" onClick={toggleChat}>
          💬
        </div>
      )}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header" onClick={toggleChat}>
            Asistent
            <span style={{ float: 'right', cursor: 'pointer' }}>✖</span>
          </div>
          <div className="chatbot-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message ${msg.from === 'bot' ? 'bot' : 'user'}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Scrie un mesaj..."
            />
            <button onClick={handleSend}>Trimite</button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DraggableChatbot;
