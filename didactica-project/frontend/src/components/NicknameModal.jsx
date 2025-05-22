import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/UserContext';
import './NicknameModal.css'; 

const NicknameModal = ({ onClose }) => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = async () => {
    setError('');
    if (!nickname.trim() || !password.trim()) {
      setError('Te rugăm să introduci un nickname și o parolă.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ nickname, password }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        navigate('/profile-home');
      } else {
        setError(data.error || 'Nickname sau parolă incorecte.');
      }
    } catch (err) {
      console.error('💥 Eroare de rețea:', err);
      setError('Eroare de rețea. Încearcă din nou.');
    }
  };

  return (
    <div className="glass-modal">
      <div className="modal-content">
     
        <h2>Autentificare</h2>
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          type="password"
          placeholder="Parolă"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        {error && <p className="error-text">{error}</p>}
        <div className="modal-buttons mt-3">
           <button onClick={onClose} className="ms-2">Închide</button>
           <button onClick={handleLogin}>Continuă</button>
        </div>
        <p className="mt-3">
          Nu ai cont?{' '}
          <a href="/create-account" style={{ color: '#c77dff' }}>
            Creează unul aici
          </a>
        </p>
      
    </div>
    </div>
  );
};

export default NicknameModal;
