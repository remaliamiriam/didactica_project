import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CreateAccount.css';

const CreateAccount = () => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nicknameFromUrl = params.get('nickname');
    if (nicknameFromUrl) {
      setNickname(nicknameFromUrl);
    }
  }, [location.search]);

  const handleSubmit = async () => {
    setError('');
    if (!nickname.trim()) {
      setError('Te rugăm să introduci un nickname.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/users/create-nickname-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/profile-home');
          console.log('Răspuns backend:', data);
        } else {
          setError('Contul nu a fost creat corespunzător.');
        }
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
        {error && <p className="error-text">{error}</p>}
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Se creează...' : 'Continuă'}
        </button>
      </div>
    </div>
  );
};

export default CreateAccount;
