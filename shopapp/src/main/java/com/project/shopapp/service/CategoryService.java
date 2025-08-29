package com.project.shopapp.service;

import com.project.shopapp.model.Category;
import com.project.shopapp.model.Product;
import com.project.shopapp.repository.CategoryRepository;
import com.project.shopapp.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category addCategory(Category category) {
        Optional<Category> existingCategory = categoryRepository.findByName(category.getName());
        if (existingCategory.isPresent()) {
            throw new RuntimeException("Category with this name already exists.");
        }
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category category) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        existing.setName(category.getName());
        return categoryRepository.save(existing);
    }

    @Transactional
    public void deleteCategory(Long id) {
        // 1. Find all products associated with this category
        List<Product> productsToUpdate = productRepository.findByCategoryId(id);

        // 2. Set their category to null (uncategorize them)
        for (Product product : productsToUpdate) {
            product.setCategory(null);
        }

        // 3. Save the updated products
        productRepository.saveAll(productsToUpdate);

        // 4. Now it's safe to delete the category
        categoryRepository.deleteById(id);
    }
}
