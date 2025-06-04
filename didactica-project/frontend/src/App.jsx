import React from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreateAccount from './pages/CreateAccount';
import ProfileHome from './pages/ProfileHome';
import GuidePage from './pages/GuidePage'; 
import { CustomNavbar } from './components/CustomNavbar';
import StepPage from './pages/StepPage'; 
import TestCreation from './pages/CreateTest'; 
import ResourcesPage from './pages/ResourcesPage'; 
import 'animate.css';

import { UserProvider } from './hooks/UserContext'; // import context

function App() {
  return (
    <UserProvider>
      <Router>
        <CustomNavbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/profile-home" element={<ProfileHome />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/creation" element={<TestCreation />} />
            <Route path="/step/:step" element={<StepPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
