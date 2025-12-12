// src/pages/TodoPage.js
import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Button,
    Alert,
    InputGroup,
    Form,
    Card,
    Spinner,
    Badge
} from 'react-bootstrap';
import { FaPlus, FaSearch, FaSync, FaExclamationTriangle } from 'react-icons/fa';
import TodoItem from '../components/ui/TodoItem';
import TodoForm from '../components/ui/TodoForm';
import { todoApi } from '../services/api';

const TodoPage = () => {
    const [todos, setTodos] = useState([]);
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, completed, pending
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [apiConnected, setApiConnected] = useState(false);

    // Check API connection on component mount
    useEffect(() => {
        checkApiConnection();
    }, []);

    // Fetch todos when component mounts or filter changes
    useEffect(() => {
        if (apiConnected) {
            fetchTodos();
        }
    }, [apiConnected]);

    // Filter todos when search term, filter, or todos change
    useEffect(() => {
        filterTodos();
    }, [searchTerm, filter, todos]);

    const checkApiConnection = async () => {
        try {
            const isHealthy = await todoApi.healthCheck();
            setApiConnected(isHealthy);
            if (!isHealthy) {
                setError('Cannot connect to backend server. Please make sure the backend is running.');
            }
        } catch (err) {
            setApiConnected(false);
            setError('Failed to connect to backend server.');
            console.error('API Connection Error:', err);
        }
    };

    const fetchTodos = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await todoApi.getAllTodos();
            if (response && response.success) {
                setTodos(response.data || []);
            } else {
                setError(response?.message || 'Failed to fetch todos');
            }
        } catch (err) {
            setError(err.message || 'Failed to load todos from server');
            console.error('Fetch Todos Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterTodos = () => {
        let filtered = [...todos];

        // Filter by status
        if (filter === 'completed') {
            filtered = filtered.filter(todo => todo.completed);
        } else if (filter === 'pending') {
            filtered = filtered.filter(todo => !todo.completed);
        }

        // Filter by search term
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(todo =>
                todo.title?.toLowerCase().includes(term) ||
                todo.description?.toLowerCase().includes(term)
            );
        }

        setFilteredTodos(filtered);
    };

    const handleAddTodo = () => {
        setSelectedTodo(null);
        setShowForm(true);
    };

    const handleEditTodo = (todo) => {
        setSelectedTodo(todo);
        setShowForm(true);
    };

    const handleDeleteTodo = async (id) => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            setLoading(true);
            setError('');
            try {
                const response = await todoApi.deleteTodo(id);
                if (response && response.success) {
                    // Remove from local state
                    setTodos(todos.filter(todo => todo.id !== id));
                } else {
                    setError(response?.message || 'Failed to delete todo');
                }
            } catch (err) {
                setError(err.message || 'Failed to delete todo');
                console.error('Delete Todo Error:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleToggleTodo = async (id) => {
        setLoading(true);
        setError('');
        try {
            const response = await todoApi.toggleTodoStatus(id);
            if (response && response.success) {
                // Update local state
                setTodos(todos.map(todo =>
                    todo.id === id ? { ...todo, completed: !todo.completed } : todo
                ));
            } else {
                setError(response?.message || 'Failed to toggle todo status');
            }
        } catch (err) {
            setError(err.message || 'Failed to toggle todo status');
            console.error('Toggle Todo Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTodo = async (todoData) => {
        setLoading(true);
        setError('');
        try {
            let response;
            if (selectedTodo) {
                // Update existing todo
                response = await todoApi.updateTodo(selectedTodo.id, todoData);
            } else {
                // Create new todo
                response = await todoApi.createTodo(todoData);
            }

            if (response && response.success) {
                // Refresh todos from server
                await fetchTodos();
                setShowForm(false);
                setSelectedTodo(null);
            } else {
                setError(response?.message || 'Failed to save todo');
            }
        } catch (err) {
            setError(err.message || 'Failed to save todo');
            console.error('Save Todo Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchTodos();
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    // Stats
    const totalCount = todos.length;
    const completedCount = todos.filter(t => t.completed).length;
    const pendingCount = totalCount - completedCount;

    return (
        <Container className="py-4">
            {/* Header */}
            <Row className="mb-4 align-items-center">
                <Col>
                    <h1 className="display-6 fw-bold">
                        <FaSync className="me-2" />
                        Todo Management
                    </h1>
                    <p className="text-muted">Manage your tasks efficiently</p>
                </Col>
                <Col className="text-end">
                    <Button
                        variant="outline-primary"
                        onClick={handleRefresh}
                        disabled={loading}
                        className="me-2"
                    >
                        <FaSync className={loading ? 'spinning' : ''} />
                        {loading ? ' Loading...' : ' Refresh'}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleAddTodo}
                        disabled={!apiConnected}
                    >
                        <FaPlus className="me-2" /> Add New Todo
                    </Button>
                </Col>
            </Row>

            {/* Connection Status */}
            {!apiConnected && (
                <Row className="mb-3">
                    <Col>
                        <Alert variant="danger" className="d-flex align-items-center">
                            <FaExclamationTriangle className="me-2" />
                            <div>
                                <strong>Backend Server Unavailable</strong>
                                <div className="small">
                                    Please make sure the Spring Boot backend is running on port 8080.
                                    <br />
                                    Run: <code>docker-compose up backend</code> or start the backend manually.
                                </div>
                            </div>
                        </Alert>
                    </Col>
                </Row>
            )}

            {/* Error Message */}
            {error && (
                <Row className="mb-3">
                    <Col>
                        <Alert variant="danger" onClose={() => setError('')} dismissible>
                            {error}
                        </Alert>
                    </Col>
                </Row>
            )}

            {/* Stats */}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="text-center border-primary shadow-sm">
                        <Card.Body>
                            <Card.Title>Total Todos</Card.Title>
                            <h2 className="text-primary">{totalCount}</h2>
                            {loading && <Spinner size="sm" animation="border" className="ms-2" />}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center border-success shadow-sm">
                        <Card.Body>
                            <Card.Title>Completed</Card.Title>
                            <h2 className="text-success">{completedCount}</h2>
                            <Badge bg="success" className="mt-1">
                                {totalCount > 0 ? `${Math.round((completedCount / totalCount) * 100)}%` : '0%'}
                            </Badge>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center border-warning shadow-sm">
                        <Card.Body>
                            <Card.Title>Pending</Card.Title>
                            <h2 className="text-warning">{pendingCount}</h2>
                            <Badge bg="warning" className="mt-1">
                                {totalCount > 0 ? `${Math.round((pendingCount / totalCount) * 100)}%` : '0%'}
                            </Badge>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Search and Filter */}
            <Row className="mb-4">
                <Col md={8}>
                    <InputGroup>
                        <InputGroup.Text>
                            <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Search todos by title or description..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            disabled={!apiConnected}
                        />
                    </InputGroup>
                </Col>
                <Col md={4}>
                    <Form.Select
                        value={filter}
                        onChange={handleFilterChange}
                        disabled={!apiConnected}
                    >
                        <option value="all">All Todos ({totalCount})</option>
                        <option value="completed">Completed ({completedCount})</option>
                        <option value="pending">Pending ({pendingCount})</option>
                    </Form.Select>
                </Col>
            </Row>

            {/* Loading Spinner */}
            {loading && filteredTodos.length === 0 && (
                <Row className="mb-4">
                    <Col className="text-center">
                        <Spinner animation="border" role="status" variant="primary">
                            <span className="visually-hidden">Loading todos...</span>
                        </Spinner>
                        <p className="mt-2 text-muted">Loading todos from server...</p>
                    </Col>
                </Row>
            )}

            {/* Todo List */}
            <Row>
                <Col>
                    {!apiConnected ? (
                        <Alert variant="info" className="text-center">
                            <h5>Waiting for backend connection...</h5>
                            <p>Please start the backend server to load todos.</p>
                            <Button variant="outline-primary" onClick={checkApiConnection}>
                                Retry Connection
                            </Button>
                        </Alert>
                    ) : filteredTodos.length === 0 ? (
                        <Alert variant={searchTerm ? 'warning' : 'info'} className="text-center">
                            {searchTerm
                                ? `No todos found matching "${searchTerm}".`
                                : loading
                                    ? 'Loading todos...'
                                    : 'No todos found. Add your first todo!'}
                        </Alert>
                    ) : (
                        filteredTodos.map(todo => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onToggle={handleToggleTodo}
                                onEdit={handleEditTodo}
                                onDelete={handleDeleteTodo}
                            />
                        ))
                    )}
                </Col>
            </Row>

            {/* Todo Form Modal */}
            <TodoForm
                show={showForm}
                todo={selectedTodo}
                onClose={() => {
                    setShowForm(false);
                    setSelectedTodo(null);
                }}
                onSave={handleSaveTodo}
            />

            {/* Footer */}
            <Row className="mt-5 pt-4 border-top">
                <Col className="text-center text-muted">
                    <small>
                        {apiConnected ? (
                            <>
                                Backend: <Badge bg="success">Connected</Badge> |
                                Total: {totalCount} |
                                Completed: {completedCount} |
                                Pending: {pendingCount}
                            </>
                        ) : (
                            <>
                                Backend: <Badge bg="danger">Disconnected</Badge> |
                                Please start the backend server
                            </>
                        )}
                    </small>
                    <br />
                    <small className="text-muted">
                        Double-click a todo to toggle its status | Click edit button to modify
                    </small>
                </Col>
            </Row>
        </Container>
    );
};

export default TodoPage;