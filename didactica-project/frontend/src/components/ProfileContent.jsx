import React, { useEffect, useState } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ProfileContent.css';

const ProfileContent = ({ user }) => {
  const navigate = useNavigate();
  const [leaderboards, setLeaderboards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const savedStep = localStorage.getItem('step1_progress');
  const stepText = savedStep ? `Pasul ${parseInt(savedStep) + 1}` : "Începe de la început";

  useEffect(() => {
    if (!user) return;
    
    const fetchLeaderboards = async () => {
      try {
        const response = await fetch(`/api/leaderboard?userId=${user?.id}`);
        if (!response.ok) throw new Error('Eroare la încărcarea datelor');
        const data = await response.json();
        setLeaderboards(data);
      } catch (err) {
        console.error("Eroare la leaderboard:", err);
        setError('Nu am reușit să încarcăm clasamentele. Te rugăm să încerci din nou mai târziu.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboards();
  }, [user]);

  const renderLeaderboard = (title, icon, items, unit = '') => {
    if (!items) return null;
    const userIndex = items.findIndex(entry => entry.nickname === user?.nickname);
    return (
      <div className="leaderboard-section">
        <h5>{icon} {title}</h5>
        <ul className="leaderboard-list">
          {items.map((entry, idx) => (
            <li
              key={entry.nickname}
              className={entry.nickname === user?.nickname ? 'highlight' : ''}
            >
              <span>{idx + 1}. {entry.nickname}</span>
              <span>{entry.value}{unit}</span>
            </li>
          ))}
        </ul>
        {userIndex === -1 && (
          <div className="user-position">
            Poziția ta: în afara topului
          </div>
        )}
      </div>
    );
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h2>Bun venit!</h2>
      <p>Continuă procesul de creare a testului.</p>

      <Card className="mb-3 shadow-sm">
        <Card.Body>
          <Card.Title>📍 Continuă de unde ai rămas</Card.Title>
          <Card.Text>{stepText}</Card.Text>
          <Button
            variant="primary"
            onClick={() => navigate('/guide')}
            className="my-3"
          >
            {savedStep ? "📘 Continuă Ghidul" : "📘 Reia Ghidul"}
          </Button>
        </Card.Body>
      </Card>

      <Card className="mb-3 shadow-sm">
        <Card.Body>
          <Card.Title>🏅 Clasamente</Card.Title>
          {loading ? (
            <Spinner animation="border" size="sm" variant="info" />
          ) : (
            <>
              {renderLeaderboard('Clasament pe timp (perfect score)', '⏱️', leaderboards?.topPerformers, ' secunde')}
              {renderLeaderboard('Streak-uri active', '🔥', leaderboards?.streaks, ' zile')}
              {renderLeaderboard('Număr de teste completate', '📈', leaderboards?.mostTests)}
              {renderLeaderboard('Scor mediu la quiz', '🧠', leaderboards?.quizMasters, '%')}
            </>
          )}
        </Card.Body>
      </Card>

      {leaderboards?.similar?.length > 0 && (
        <Card className="mb-3 shadow-sm">
          <Card.Body>
            <Card.Title>🎯 Utilizatori cu scoruri similare</Card.Title>
            <ul>
              {leaderboards.similar.map((entry) => (
                <li key={entry.nickname}>
                  {entry.nickname} – {entry.value}%
                </li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ProfileContent;
