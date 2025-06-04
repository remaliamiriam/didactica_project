import React from 'react';
import { useNavigate } from 'react-router-dom';
import SplineViewer from '../components/SplineViewer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate('/guide'); // redirecționează către pagina Ghid
  };

  return (
    <div className="container-fluid">
      <div className="row w-100">
        {/* LEFT SIDE */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-start p-5">
          <h1 className="display-4 fw-bold animate__animated animate__backInLeft hero-title">
            Didactica App
          </h1>
          <p className="lead mt-3 text-white">
            Ghid pas cu pas pentru crearea testelor de cunoștințe didactice.
          </p>
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

      {/* Warning pentru telefon */}
      <div className="d-block d-md-none bg-warning text-dark text-center p-2 mt-4">
        ⚠️ Atenție: această aplicatie nu este optimizată pentru telefoane mobile.
      </div>
    </div>
  );
};

export default Home;
