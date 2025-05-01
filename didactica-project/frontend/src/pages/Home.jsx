import React, { useState } from 'react';
import SplineViewer from '../components/SplineViewer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import NicknameModal from '../components/NicknameModal'; 

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleStartLearning = () => {
    setModalOpen(true); // deschide modalul
  };

  return (
    <div className="container-fluid">
      <div className="row w-100">
        {/* LEFT SIDE */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-start p-5">
        <h1 className="display-4 fw-bold animate__animated animate__backInLeft hero-title">
          Didactica App
        </h1>

          <p className="lead mt-3">Ghid pas cu pas pentru crearea testelor de cunoștințe didactice.</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
        <div className="spline-container" style={{ width: '100%', maxWidth: '600px', height: '400px' }}>
          <SplineViewer />
        </div>
        <button className="hero-button mt-4" onClick={handleStartLearning}>
          Start Learning
        </button>
      </div>
      </div>

      {/* Modal */}
      {modalOpen && <NicknameModal onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default Home;
