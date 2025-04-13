import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateAccount.css';

const CreateAccount = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const createAccount = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const nickname = urlParams.get('nickname');

      if (!nickname) {
        console.error('Nickname lipsă');
        navigate('/');
        return;
      }

      try {
        // Verifică dacă nickname-ul există deja în backend
        const checkResponse = await fetch('http://localhost:4000/check-nickname', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nickname }),
        });

        const checkData = await checkResponse.json();

        if (checkResponse.ok) {
          if (checkData.exists) {
            // Dacă nickname-ul există, redirecționează la profil
            console.log('Nickname existent, redirecționare la profil...');
            navigate('/profile-home');
          } else {
            // Dacă nickname-ul nu există, creează contul
            const createResponse = await fetch('http://localhost:4000/create-account', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ nickname }),
            });

            const createData = await createResponse.json();

            if (createResponse.ok) {
              console.log('Cont creat cu succes:', createData);
              localStorage.setItem('nickname', nickname); // Salvăm nickname-ul în localStorage
              navigate('/profile-home'); // Redirecționează la pagina de profil
            } else {
              console.error('Eroare la crearea contului:', createData.error);
              navigate('/');
            }
          }
        } else {
          console.error('Eroare la verificarea nickname-ului:', checkData.error);
          navigate('/');
        }
      } catch (err) {
        console.error('Eroare de rețea:', err);
        navigate('/');
      }
    };

    createAccount();
  }, [navigate]);

  return (
    <div className="create-account-container">
      <h2>Se creează contul tău...</h2>
      <div className="loader"></div>
      <p>Te rugăm să aștepți câteva secunde.</p>
    </div>
  );
};

export default CreateAccount;
