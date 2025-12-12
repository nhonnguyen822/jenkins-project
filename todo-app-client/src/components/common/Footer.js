import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="bg-dark text-white mt-auto py-3">
            <Container>
                <Row>
                    <Col md={6}>
                        <h5>Todo App</h5>
                        <p className="mb-0">A FullStack Todo Application with React & Spring Boot</p>
                    </Col>
                    <Col md={6} className="text-md-end">
                        <p className="mb-0">© {new Date().getFullYear()} All rights reserved</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;