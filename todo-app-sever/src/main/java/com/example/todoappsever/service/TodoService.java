package com.example.todoappsever.service;

import com.example.todoappsever.dto.TodoDTO;

import java.util.List;

public interface TodoService {
    List<TodoDTO> getAllTodos();

    TodoDTO getTodoById(Long id);

    TodoDTO createTodo(TodoDTO todoDTO);

    TodoDTO updateTodo(Long id, TodoDTO todoDTO);

    void deleteTodo(Long id);

    TodoDTO toggleTodoStatus(Long id);

    List<TodoDTO> getTodosByStatus(Boolean completed);

    List<TodoDTO> searchTodos(String keyword);
}
