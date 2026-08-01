package com.supermarket.controller;

import com.supermarket.entity.Category;
import com.supermarket.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<Category> getAll() {
        return categoryService.getAll();
    }

    @PostMapping
    public Category save(@RequestBody Category category) {
        return categoryService.save(category);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        categoryService.delete(id);
        return ResponseEntity.ok().build();
    }
}
