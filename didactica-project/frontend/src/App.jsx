import React from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreateAccount from './pages/CreateAccount';
import ProfileHome from './pages/ProfileHome';
import { CustomNavbar } from './components/CustomNavbar';

function App() {
  return (
    <Router>
      <CustomNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/profile-home" element={<ProfileHome />} />
      </Routes>
    </Router>
  );
}

export default App;
