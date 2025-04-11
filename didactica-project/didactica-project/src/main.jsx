import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { CustomNavbar } from './components/CustomNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <>
      <CustomNavbar /> {}
      <App />
    </>
  </React.StrictMode>
);
