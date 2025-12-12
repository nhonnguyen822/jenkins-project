import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTasks, FaBolt, FaUsers } from 'react-icons/fa';

const HomePage = () => {
    const features = [
        {
            icon: <FaTasks size={40} />,
            title: "Task Management",
            description: "Create, update, and delete todos with ease"
        },
        {
            icon: <FaBolt size={40} />,
            title: "Fast & Responsive",
            description: "Built with React for blazing fast performance"
        },
        {
            icon: <FaUsers size={40} />,
            title: "User Friendly",
            description: "Intuitive interface with Bootstrap styling"
        }
    ];

    return (
        <Container>
            {/* Hero Section */}
            <Row className="align-items-center py-5">
                <Col md={6}>
                    <h1 className="display-4 fw-bold mb-4">
                        Manage Your Todos <span className="text-primary">Efficiently</span>
                    </h1>
                    <p className="lead mb-4">
                        A powerful todo application built with React, Spring Boot, and Docker.
                        Stay organized and boost your productivity.
                    </p>
                    <div className="d-flex gap-3">
                        <Button as={Link} to="/todos" variant="primary" size="lg">
                            Get Started
                        </Button>
                        <Button variant="outline-primary" size="lg">
                            Learn More
                        </Button>
                    </div>
                </Col>
                <Col md={6}>
                    <img
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Todo App"
                        className="img-fluid rounded shadow"
                    />
                </Col>
            </Row>

            {/* Features Section */}
            <Row className="py-5">
                <Col className="text-center mb-5">
                    <h2 className="fw-bold mb-3">Why Choose Our Todo App?</h2>
                    <p className="text-muted">Powerful features to boost your productivity</p>
                </Col>

                {features.map((feature, index) => (
                    <Col md={4} key={index} className="mb-4">
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Body className="text-center p-4">
                                <div className="text-primary mb-3">
                                    {feature.icon}
                                </div>
                                <Card.Title>{feature.title}</Card.Title>
                                <Card.Text className="text-muted">
                                    {feature.description}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* CTA Section */}
            <Row className="py-5 bg-light rounded-3 mb-4">
                <Col className="text-center">
                    <h2 className="fw-bold mb-4">Ready to Get Organized?</h2>
                    <p className="lead mb-4">
                        Start managing your tasks efficiently with our todo application.
                    </p>
                    <Button as={Link} to="/todos" variant="primary" size="lg">
                        Start Managing Todos
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;