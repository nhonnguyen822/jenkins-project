package com.example.todoappsever.controller;

import com.example.todoappsever.dto.ApiResponse;
import com.example.todoappsever.dto.TodoDTO;
import com.example.todoappsever.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TodoDTO>>> getAllTodos() {
        List<TodoDTO> todos = todoService.getAllTodos();

        System.out.println();
        return ResponseEntity.ok(ApiResponse.success(todos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TodoDTO>> getTodoById(@PathVariable Long id) {
        TodoDTO todo = todoService.getTodoById(id);
        return ResponseEntity.ok(ApiResponse.success(todo));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TodoDTO>> createTodo( @RequestBody TodoDTO todoDTO) {
        TodoDTO createdTodo = todoService.createTodo(todoDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Todo created successfully", createdTodo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TodoDTO>> updateTodo(
            @PathVariable Long id,
            @RequestBody TodoDTO todoDTO) {
        TodoDTO updatedTodo = todoService.updateTodo(id, todoDTO);
        return ResponseEntity.ok(ApiResponse.success("Todo updated successfully", updatedTodo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.ok(ApiResponse.success("Todo deleted successfully", null));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<TodoDTO>> toggleTodoStatus(@PathVariable Long id) {
        TodoDTO updatedTodo = todoService.toggleTodoStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Todo status toggled", updatedTodo));
    }

    @GetMapping("/status/{completed}")
    public ResponseEntity<ApiResponse<List<TodoDTO>>> getTodosByStatus(
            @PathVariable Boolean completed) {
        List<TodoDTO> todos = todoService.getTodosByStatus(completed);
        return ResponseEntity.ok(ApiResponse.success(todos));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<TodoDTO>>> searchTodos(
            @RequestParam String keyword) {
        List<TodoDTO> todos = todoService.searchTodos(keyword);
        return ResponseEntity.ok(ApiResponse.success(todos));
    }

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Todo Backend is running!");
    }
}