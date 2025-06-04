import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './CustomNavbar.css';

export const CustomNavbar = () => {
  const [theme, setTheme] = useState('dark-mode');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || 'dark-mode';
    setTheme(initialTheme);
    document.body.classList.add(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark-mode' ? 'light-mode' : 'dark-mode';
    setTheme(newTheme);
    document.body.classList.remove('dark-mode', 'light-mode');
    document.body.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="w-100 fixed-top">
      <Navbar.Brand as={Link} to="/" className="ms-3" style={{ cursor: 'pointer' }}>
        Didactica App
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto align-items-center">
          {/* Eliminat Nav.Link Home */}
          <Nav.Link as={Link} to="/guide">Ghid</Nav.Link>
          <Nav.Link as={Link} to="/resources">Resurse</Nav.Link>
          <Nav.Link as={Link} to="/creation">Creare Test</Nav.Link>
          <Button variant="outline-light" onClick={toggleTheme} className="ms-3 theme-toggle-btn">
            {theme === 'dark-mode' ? '☀️' : '🌙'}
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
