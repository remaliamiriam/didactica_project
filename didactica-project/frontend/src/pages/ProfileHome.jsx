import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoggedInUser, logout } from '../utils/auth';

const ProfileHome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getLoggedInUser();
    if (!currentUser) {
      navigate('/'); // Redirecționează dacă nu e logat
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      {user && (
        <>
          <h1>Bine ai revenit, {user.nickname}!</h1>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default ProfileHome;
