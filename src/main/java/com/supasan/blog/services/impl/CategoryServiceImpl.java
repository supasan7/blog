package com.supasan.blog.services.impl;

import com.supasan.blog.domain.entities.Category;
import com.supasan.blog.repositories.CategoryRepository;
import com.supasan.blog.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> listCategories() {
        return categoryRepository.findAllWithPostCount();
    }

    @Override
    public Category createCategory(Category category) {
        String categoryName = category.getName();
        if(categoryRepository.existsByNameIgnoreCase(categoryName)){
            throw new IllegalArgumentException("Category already exists with name" + categoryName);
        }
        return categoryRepository.save(category);
    }
}
