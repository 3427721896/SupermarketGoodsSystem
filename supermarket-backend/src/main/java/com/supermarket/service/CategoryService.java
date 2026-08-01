package com.supermarket.service;

import com.supermarket.entity.Category;
import com.supermarket.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public Category save(Category category) {
        if (category.getId() == null || category.getId().isEmpty()) {
            category.setId(UUID.randomUUID().toString().substring(0, 8));
        }
        return categoryRepository.save(category);
    }

    public void delete(String id) {
        categoryRepository.deleteById(id);
    }
}
