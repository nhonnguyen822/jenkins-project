package com.example.todoappsever.service;

import com.example.todoappsever.dto.TodoDTO;
import com.example.todoappsever.entity.Todo;
import com.example.todoappsever.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TodoServiceImpl implements TodoService {

    private final TodoRepository todoRepository;

    @Override
    public List<TodoDTO> getAllTodos() {
        return todoRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TodoDTO getTodoById(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found with id: " + id));
        return convertToDTO(todo);
    }

    @Override
    public TodoDTO createTodo(TodoDTO todoDTO) {
        Todo todo = convertToEntity(todoDTO);
        Todo savedTodo = todoRepository.save(todo);
        return convertToDTO(savedTodo);
    }

    @Override
    public TodoDTO updateTodo(Long id, TodoDTO todoDTO) {
        Todo existingTodo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found with id: " + id));

        existingTodo.setTitle(todoDTO.getTitle());
        existingTodo.setDescription(todoDTO.getDescription());
        existingTodo.setCompleted(todoDTO.getCompleted());
        existingTodo.setPriority(todoDTO.getPriority());

        Todo updatedTodo = todoRepository.save(existingTodo);
        return convertToDTO(updatedTodo);
    }

    @Override
    public void deleteTodo(Long id) {
        if (!todoRepository.existsById(id)) {
            throw new RuntimeException("Todo not found with id: " + id);
        }
        todoRepository.deleteById(id);
    }

    @Override
    public TodoDTO toggleTodoStatus(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found with id: " + id));

        todo.setCompleted(!todo.getCompleted());
        Todo updatedTodo = todoRepository.save(todo);
        return convertToDTO(updatedTodo);
    }

    @Override
    public List<TodoDTO> getTodosByStatus(Boolean completed) {
        return todoRepository.findByCompleted(completed)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TodoDTO> searchTodos(String keyword) {
        return todoRepository.findByTitleContainingIgnoreCase(keyword)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private TodoDTO convertToDTO(Todo todo) {
        TodoDTO dto = new TodoDTO();
        dto.setId(todo.getId());
        dto.setTitle(todo.getTitle());
        dto.setDescription(todo.getDescription());
        dto.setCompleted(todo.getCompleted());
        dto.setPriority(todo.getPriority());
        return dto;
    }

    private Todo convertToEntity(TodoDTO dto) {
        Todo todo = new Todo();
        todo.setTitle(dto.getTitle());
        todo.setDescription(dto.getDescription());
        todo.setCompleted(dto.getCompleted());
        todo.setPriority(dto.getPriority());
        return todo;
    }
}