package com.example.todoappsever.dto;

import lombok.Data;
@Data
public class TodoDTO {

    private Long id;

    private String title;

    private String description;

    private Boolean completed = false;

    private String priority = "MEDIUM";
}