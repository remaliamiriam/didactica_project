// src/components/LeaderboardPanel.jsx
import React, { useState, useEffect } from "react";
import { Tabs, Tab, Table, Spinner } from "react-bootstrap";
import "./LeaderboardPanel.css";

const LeaderboardPanel = ({ currentUserId }) => {
  const [activeTab, setActiveTab] = useState("topPerformers");
  const [leaderboardData, setLeaderboardData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboards = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/leaderboard?userId=${currentUserId}`);
        const data = await res.json();
        setLeaderboardData(data);
      } catch (error) {
        console.error("Eroare la leaderboard:", error);
      }
      setLoading(false);
    };

    fetchLeaderboards();
  }, [currentUserId]);

  const renderTable = (data, headers) => (
    <Table striped bordered hover responsive>
      <thead>
        <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <tr key={idx}>
            <td>{idx + 1}</td>
            <td>{item.nickname}</td>
            <td>{item.value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  if (loading) return <Spinner animation="border" variant="info" />;

  return (
    <div className="glass-panel p-4 mt-4 leaderboard-wrapper">
      <h4 className="mb-3">🏆 Clasamente</h4>
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="topPerformers" title="🕒 Scor perfect + Timp">
          {renderTable(leaderboardData.topPerformers || [], ["#", "Nume", "Timp (sec)"])}
        </Tab>
        <Tab eventKey="mostTests" title="📈 Teste finalizate">
          {renderTable(leaderboardData.mostTests || [], ["#", "Nume", "Teste"])}
        </Tab>
        <Tab eventKey="streaks" title="🔥 Streak-uri">
          {renderTable(leaderboardData.streaks || [], ["#", "Nume", "Zile"])}
        </Tab>
        <Tab eventKey="quizMasters" title="🧠 Quiz Masters">
          {renderTable(leaderboardData.quizMasters || [], ["#", "Nume", "Scor mediu"])}
        </Tab>
        <Tab eventKey="similar" title="🎯 Similar cu tine">
          {renderTable(leaderboardData.similar || [], ["#", "Nume", "Scor apropiat"])}
        </Tab>
      </Tabs>
    </div>
  );
};

export default LeaderboardPanel;
