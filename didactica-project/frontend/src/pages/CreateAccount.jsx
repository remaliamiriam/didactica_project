import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/UserContext'; // import context
import './CreateAccount.css';

const CreateAccount = () => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();  // folosește contextul

  const handleSubmit = async () => {
    setError('');
    if (!nickname.trim() || !password.trim()) {
      setError('Te rugăm să introduci un nickname și o parolă.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/users/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nickname, password }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);  // actualizează contextul
        navigate('/profile-home');
      } else {
        setError(data.error || 'A apărut o eroare.');
      }
    } catch (err) {
      setError('Eroare de rețea. Încearcă din nou.');
      console.error('Eroare de rețea:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-account-page">
      <div className="glass-panel">
        <h2>Crează un cont nou</h2>
        <input
          type="text"
          placeholder="Introdu nickname-ul"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          type="password"
          placeholder="Introdu parola"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="password-warning">
          Atentie!!!!  Dacă uiți această parolă, nu va putea fi resetată
        </p>
        {error && <p className="error-text">{error}</p>}
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Se creează...' : 'Continuă'}
        </button>
      </div>
    </div>
  );
};

export default CreateAccount;
