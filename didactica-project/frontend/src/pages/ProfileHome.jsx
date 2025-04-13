import React from 'react';

const Profile = () => {
  const nickname = localStorage.getItem('nickname');

  return (
    <div className="profile-page">
      {nickname ? (
        <>
          <h1>Welcome, {nickname}!</h1>
          <p>Your profile page.</p>
        </>
      ) : (
        <>
          <h1>Profil inexistent</h1>
          <p>Te rugăm să revii la pagina principală și să introduci un nickname valid.</p>
        </>
      )}
    </div>
  );
};

export default Profile;
