/*import { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export const CustomNavbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Navbar
      expand="lg"
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      style={{
        backgroundColor: scrolled ? '#000' : 'transparent',
        transition: 'background-color 0.3s ease'
      }}
    >
      <Container>
        <Navbar.Brand href="#home" style={{ color: 'white' }}>Didactica App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home" style={{ color: 'white' }}>Home</Nav.Link>
            <Nav.Link href="#link" style={{ color: 'white' }}>Link</Nav.Link>
            <Nav.Link href="#about" style={{ color: 'white' }}>About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
*/

import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import './CustomNavbar.css';  // Asigură-te că ai stiluri separate pentru navbar

export const CustomNavbar = () => {
  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="w-100">
      <Navbar.Brand href="#" className="ms-3">Didactica App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto"> {/* 'ms-auto' plasează elementele la dreapta */}
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#about">About</Nav.Link>
          <Nav.Link href="#contact">Contact</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
