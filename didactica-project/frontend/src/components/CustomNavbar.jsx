import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './CustomNavbar.css';

export const CustomNavbar = () => {
  const [theme, setTheme] = useState('dark-mode');
  //const navigate = useNavigate();

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

  /*const handleLoginClick = () => {
    navigate('/create-account');
  };*/

  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="w-100 fixed-top">
      <Navbar.Brand href="#home" className="ms-3">Didactica App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto align-items-center">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#guide">Ghid</Nav.Link>
          <Nav.Link href="#resources">Resurse</Nav.Link>
          <Nav.Link href="#simulation">Simulare Test</Nav.Link>
          <Button variant="outline-light" onClick={toggleTheme} className="ms-3 theme-toggle-btn">
            {theme === 'dark-mode' ? '☀️' : '🌙'}
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
