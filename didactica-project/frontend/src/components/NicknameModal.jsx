import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NicknameModal = ({ onClose }) => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    if (!nickname.trim()) {
      setError('Te rugăm să introduci un nickname.');
      return;
    }

    try {
      const checkResponse = await fetch('http://localhost:4000/check-nickname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname }),
        credentials: 'include',
      });

      const checkData = await checkResponse.json(); // <- mutat aici

      if (checkResponse.ok) {
        if (checkData.exists) {
          navigate('/profile');
        } else {
          navigate(`/create-account?nickname=${encodeURIComponent(nickname)}`);
        }
      } else {
        setError(checkData.error || 'Eroare la verificarea nickname-ului.');
        console.error('Eroare la verificare:', checkData);
      }
    } catch (err) {
      setError('Eroare de rețea. Încearcă din nou.');
      console.error('Eroare de rețea:', err);
    }
  };

  return (
    <div className="glass-modal">
      <div className="modal-content">
        <h2>Introdu nickname-ul</h2>
        <input
          type="text"
          placeholder="ex: Ana123"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        {error && <p className="error-text">{error}</p>}
        <div className="modal-buttons mt-3">
          <button onClick={handleSubmit}>Continuă</button>
          <button onClick={onClose} className="ms-2">Închide</button>
        </div>
      </div>
    </div>
  );
};

export default NicknameModal;
