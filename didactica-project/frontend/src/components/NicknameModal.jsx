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
      const response = await fetch('http://localhost:4000/users/create-nickname-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ nickname }),
      });

      const text = await response.text();
      console.log('📥 Răspuns brut de la server:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error('❌ Răspunsul nu e JSON valid:', err);
        setError('Serverul a trimis un răspuns invalid.');
        return;
      }

      if (response.ok) {
        // ✅ Salvăm nickname-ul global
        localStorage.setItem("userNickname", nickname);

        if (data.message === 'Utilizator deja existent.') {
          navigate('/profile-home');
        } else if (data.message === 'Cont creat cu succes!') {
          navigate('/profile-home');
        } else {
          console.log('⚠️ Răspuns necunoscut:', data);
          setError('Răspuns necunoscut de la server.');
        }
      } else {
        console.error('Eroare la răspuns:', data);
        setError(data.error || 'Eroare la crearea contului.');
      }
    } catch (err) {
      console.error('💥 Eroare de rețea:', err);
      setError('Eroare de rețea. Încearcă din nou.');
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
