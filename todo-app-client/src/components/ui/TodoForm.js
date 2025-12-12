import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const TodoForm = ({ show, todo, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        completed: false,
        priority: 'Medium'
    });

    useEffect(() => {
        if (todo) {
            setFormData({
                title: todo.title || '',
                description: todo.description || '',
                completed: todo.completed || false,
                priority: todo.priority || 'Medium'
            });
        } else {
            setFormData({
                title: '',
                description: '',
                completed: false,
                priority: 'Medium'
            });
        }
    }, [todo]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{todo ? 'Edit Todo' : 'Add New Todo'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Title *</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter todo title"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter todo description"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Priority</Form.Label>
                        <Form.Select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            name="completed"
                            label="Completed"
                            checked={formData.completed}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        {todo ? 'Update' : 'Save'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default TodoForm;