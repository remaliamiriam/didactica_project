import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <>
      <div className="sidebar-offcanvas" id="sidebar">
        <div className="sidebar-header">
          <h2>Profil</h2>
        </div>
        <ul className="sidebar-links">
          <li><Link to="/profile">Acasă</Link></li>
          <li><Link to="/profile/settings">Setări</Link></li>
          <li><Link to="/profile/leaderboard">Leaderboard</Link></li>
          {/* Adaugă mai multe linkuri pe măsură ce e necesar */}
        </ul>
      </div>

      {/* Buton pentru deschiderea offcanvas-ului */}
      <button className="btn btn-primary d-md-none" data-bs-toggle="offcanvas" data-bs-target="#sidebar" aria-controls="sidebar">
        Meniu
      </button>
    </>
  );
};

export default Sidebar;
