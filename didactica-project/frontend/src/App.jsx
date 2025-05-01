// App.jsx
import React from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreateAccount from './pages/CreateAccount';
import ProfileHome from './pages/ProfileHome';
import GuidePage from './pages/GuidePage'; // 🧠 Asigură-te că importul este prezent!
import { CustomNavbar } from './components/CustomNavbar';
import Theory from './components/Theory';
import Quiz from './components/Quiz';
import StepPage from './pages/StepPage'; // Importăm pagina StepPage
import 'animate.css';

function App() {
  return (
    <Router>
      <CustomNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/profile-home" element={<ProfileHome />} />
        <Route path="/guide" element={<GuidePage />} />
        
        {/* Ruta pentru fiecare etapă */}
        <Route path="/step/:step" element={<StepPage />} /> {/* StepPage va conține atât teoria cât și quiz-ul */}
      </Routes>
    </Router>
  );
}

export default App;
