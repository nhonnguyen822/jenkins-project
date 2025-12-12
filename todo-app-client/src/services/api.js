// src/services/api.js
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function for API calls
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors', // Important for CORS
    };

    try {
        const response = await fetch(url, { ...defaultOptions, ...options });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        // Handle empty responses
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        return { success: true, data: null };
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
};

// Todo API functions
export const todoApi = {
    // Get all todos
    getAllTodos: async () => {
        return apiRequest('/todos');
    },

    // Get todo by ID
    getTodoById: async (id) => {
        return apiRequest(`/todos/${id}`);
    },

    // Create new todo
    createTodo: async (todoData) => {
        return apiRequest('/todos', {
            method: 'POST',
            body: JSON.stringify(todoData),
        });
    },

    // Update todo
    updateTodo: async (id, todoData) => {
        return apiRequest(`/todos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(todoData),
        });
    },

    // Delete todo
    deleteTodo: async (id) => {
        return apiRequest(`/todos/${id}`, {
            method: 'DELETE',
        });
    },

    // Toggle todo status
    toggleTodoStatus: async (id) => {
        return apiRequest(`/todos/${id}/toggle`, {
            method: 'PATCH',
        });
    },

    // Get todos by status
    getTodosByStatus: async (completed) => {
        return apiRequest(`/todos/status/${completed}`);
    },

    // Search todos
    searchTodos: async (keyword) => {
        return apiRequest(`/todos/search?keyword=${encodeURIComponent(keyword)}`);
    },

    // Health check
    healthCheck: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/todos/health`, {
                mode: 'cors',
            });
            return response.ok;
        } catch {
            return false;
        }
    },
};