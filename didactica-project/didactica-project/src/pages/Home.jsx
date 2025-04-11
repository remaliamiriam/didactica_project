import React from 'react';
import SplineViewer from '../components/SplineViewer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';


const Home = () => {
  return (
    <div className="container-fluid">
      <div className="row w-100">
        { /*LEFT SIDE: TITLU*/}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-start p-5">
          <h1 className="hero-title display-4 fw-bold">Didactica App</h1>
          <p className="lead mt-3">Ghid pas cu pas pentru crearea testelor de cunoștințe didactice.</p>
        </div>

        { /*RIGHT SIDE: SPLINE + BUTTON */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
          <div style={{ width: '100%', maxWidth: '600px', height: '400px' }}>
            <SplineViewer />
          </div>
          <button className="hero-button mt-4">Start Learning</button>

          <h1 className="hero-title typing-animation">Didactica App</h1>

        </div>
      </div>
    </div>
  );
};

export default Home;
