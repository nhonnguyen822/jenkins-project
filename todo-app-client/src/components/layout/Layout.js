import React from 'react';
import { Container } from 'react-bootstrap';
import Header from '../common/Header';
import Footer from '../common/Footer';

const Layout = ({ children }) => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <Container className="flex-grow-1 py-4">
                {children}
            </Container>
            <Footer />
        </div>
    );
};

export default Layout;