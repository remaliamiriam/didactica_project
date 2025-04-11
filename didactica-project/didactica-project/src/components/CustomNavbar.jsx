import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import './CustomNavbar.css'; // Asigură-te că stilurile sunt incluse aici

export const CustomNavbar = () => {
  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="w-100 fixed-top">
      <Navbar.Brand href="#home" className="ms-3">Didactica App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#guide">Ghid</Nav.Link>
          <Nav.Link href="#resources">Resurse</Nav.Link>
          <Nav.Link href="#simulation">Simulare Test</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
