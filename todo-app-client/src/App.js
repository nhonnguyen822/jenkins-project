import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TodoPage from './pages/TodoPage';
import Layout from './components/layout/Layout';

function App() {
  return (
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/todos" element={<TodoPage />} />
          </Routes>
        </Layout>
      </Router>
  );
}

export default App;