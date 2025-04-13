import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importăm useHistory pentru a naviga între pagini

const NicknameModal = ({ onClose }) => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Instanțiem history pentru navigare

  const handleSubmit = async () => {
    setError('');
    if (!nickname.trim()) {
      setError('Te rugăm să introduci un nickname.');
      console.log('Nickname invalid:', nickname); // Log pentru nickname invalid
      return;
    }

    console.log('Verificăm nickname-ul:', nickname); // Log pentru nickname valid

    try {
      const checkResponse = await fetch('http://localhost:4000/check-nickname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname }),
       // mode: 'cors',
        credentials: 'include',  // Asigură-te că trimite cookie-uri
      });
      
      

      // Log pentru statusul cererii
      console.log('Status cerere:', checkResponse.status);

      

      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        console.log('Răspuns de la server:', checkData); // Log pentru răspunsul serverului
        if (checkData.exists) {
          navigate('/profile');  // Folosim React Router pentru a naviga
        } else {
          navigate.push(`/create-account?nickname=${encodeURIComponent(nickname)}`); // Navigare pentru crearea unui cont
        }
      } else {
        setError('Eroare la verificarea nickname-ului.');
        console.error('Eroare la verificare:', checkData.error); // Log pentru eroare de server
      }
    } catch (err) {
      setError('Eroare de rețea. Încearcă din nou.');
      console.error('Eroare de rețea:', err); // Log pentru eroare de rețea
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
