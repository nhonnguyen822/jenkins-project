import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaTasks } from 'react-icons/fa';

const Header = () => {
    const navigate = useNavigate();

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <FaTasks className="me-2" />
                    Todo App
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/" className="d-flex align-items-center">
                            <FaHome className="me-1" /> Home
                        </Nav.Link>
                        <Nav.Link as={Link} to="/todos" className="d-flex align-items-center">
                            <FaTasks className="me-1" /> Todos
                        </Nav.Link>
                    </Nav>

                    <div className="d-flex">
                        <Button variant="outline-light" className="me-2" onClick={() => navigate('/todos')}>
                            Get Started
                        </Button>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;