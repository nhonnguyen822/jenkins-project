package com.example.todoappsever.repository;


import com.example.todoappsever.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

    List<Todo> findByCompleted(Boolean completed);

    List<Todo> findByPriority(String priority);

    List<Todo> findByTitleContainingIgnoreCase(String title);
}