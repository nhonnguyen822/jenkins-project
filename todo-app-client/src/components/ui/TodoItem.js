import React from 'react';
import { Card, Button, Badge, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const TodoItem = ({ todo, onToggle, onEdit, onDelete }) => {
    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <Form.Check
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => onToggle(todo.id)}
                        className="me-3"
                    />

                    <div>
                        <Card.Title
                            className={`mb-1 ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}
                        >
                            {todo.title}
                        </Card.Title>
                        <Card.Text className="text-muted mb-0">
                            {todo.description}
                        </Card.Text>
                        <div className="mt-2">
                            <Badge bg={todo.completed ? "success" : "warning"} className="me-2">
                                {todo.completed ? "Completed" : "Pending"}
                            </Badge>
                            <Badge bg="info">
                                Priority: {todo.priority || "Medium"}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="d-flex gap-2">
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => onEdit(todo)}
                    >
                        <FaEdit />
                    </Button>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onDelete(todo.id)}
                    >
                        <FaTrash />
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default TodoItem;