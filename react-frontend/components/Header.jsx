import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../src/App.scss";

const Header = () => {
  return (
    <div className="navbar-wrapper">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <img
              className="logo"
              src="https://pbs.twimg.com/profile_images/1510700341951561729/AIrTjju1_400x400.jpg"
              alt="logo picutre"
            />
            WavePortal
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link className="nav-link" to="about">
                About me
              </Link>
              <Link className="nav-link" to="/">
                Wave
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
