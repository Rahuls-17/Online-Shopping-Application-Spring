package com.project.shopapp.service;

import com.project.shopapp.dto.CategoryDTO;
import com.project.shopapp.dto.ProductImageDTO;
import com.project.shopapp.dto.ProductResponseDTO;
import com.project.shopapp.dto.ProductReviewResponseDTO;
import com.project.shopapp.dto.UserResponseDTO;
import com.project.shopapp.model.Category;
import com.project.shopapp.model.Product;
import com.project.shopapp.model.ProductImage;
import com.project.shopapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductReviewRepository reviewRepository;

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    public List<ProductResponseDTO> getProducts(String keyword, Long categoryId, String brand, Double minPrice,
            Double maxPrice, Double minRating) {
        List<Product> products = productRepository.searchAndFilterProducts(keyword, categoryId, brand, minPrice,
                maxPrice, minRating);
        return products.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToDto(product);
    }

    public Product addProduct(Product product) {
        Optional<Product> existingProduct = productRepository.findByName(product.getName());
        if (existingProduct.isPresent()) {
            throw new RuntimeException("Product with this name already exists.");
        }
        Category category = categoryRepository.findById(product.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        product.setCategory(category);
        if (product.getImages() != null) {
            for (ProductImage image : product.getImages()) {
                image.setProduct(product);
            }
        }
        return productRepository.save(product);
    }

    public ProductResponseDTO updateProduct(Long id, Product productDetails) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));

        existing.setName(productDetails.getName());
        existing.setDescription(productDetails.getDescription());
        existing.setPrice(productDetails.getPrice());
        existing.setOriginalPrice(productDetails.getOriginalPrice());
        existing.setImageUrl(productDetails.getImageUrl());
        existing.setStock(productDetails.getStock());
        existing.setBrand(productDetails.getBrand());
        existing.setRating(productDetails.getRating());

        existing.setSpecifications(productDetails.getSpecifications());

        if (productDetails.getCategory() != null && productDetails.getCategory().getId() != null) {
            Category category = categoryRepository.findById(productDetails.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            existing.setCategory(category);
        }

        if (productDetails.getImages() != null) {
            existing.getImages().clear();
            for (ProductImage imageDetail : productDetails.getImages()) {
                imageDetail.setProduct(existing);
                existing.getImages().add(imageDetail);
            }
        }

        Product updatedProduct = productRepository.save(existing);
        return convertToDto(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (orderItemRepository.existsByProductId(id)) {
            throw new RuntimeException(
                    "Cannot delete product with ID " + id + " because it is part of an existing order. " +
                            "Consider marking the product as 'unavailable' instead.");
        }
        reviewRepository.deleteByProductId(id);
        wishlistRepository.deleteByProductId(id);
        cartRepository.deleteByProductId(id);
        productRepository.deleteById(id);
    }

    public ProductResponseDTO convertToDto(Product product) {
        if (product == null) {
            return null;
        }

        List<ProductReviewResponseDTO> reviewDTOs = product.getReviews() != null ? product.getReviews().stream()
                .map(review -> ProductReviewResponseDTO.builder()
                        .id(review.getId())
                        .user(convertToUserDto(review.getUser()))
                        .rating(review.getRating())
                        .comment(review.getComment())
                        .createdAt(review.getCreatedAt())
                        .build())
                .collect(Collectors.toList()) : List.of();

        List<ProductImageDTO> imageDTOs = product.getImages() != null ? product.getImages().stream()
                .map(image -> ProductImageDTO.builder()
                        .id(image.getId())
                        .imageUrl(image.getImageUrl())
                        .build())
                .collect(Collectors.toList()) : List.of();

        CategoryDTO categoryDTO = product.getCategory() != null ? CategoryDTO.builder()
                .id(product.getCategory().getId())
                .name(product.getCategory().getName())
                .build() : null;

        return ProductResponseDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .originalPrice(product.getOriginalPrice())
                .imageUrl(product.getImageUrl())
                .stock(product.getStock())
                .brand(product.getBrand())
                .rating(product.getRating())
                .specifications(product.getSpecifications())
                .category(categoryDTO) // Use the new CategoryDTO
                .images(imageDTOs) // Use the new list of ProductImageDTOs
                .reviews(reviewDTOs)
                .build();
    }

    private UserResponseDTO convertToUserDto(com.project.shopapp.model.User user) {
        UserResponseDTO userDto = new UserResponseDTO();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        return userDto;
    }

    public Page<ProductResponseDTO> getProductsForAdmin(Pageable pageable) {
        Page<Product> productPage = productRepository.findAll(pageable);
        return productPage.map(this::convertToDto);
    }

    @Transactional
    public void updateAverageRating(Long productId) {
        Double avgRating = reviewRepository.calculateAverageRating(productId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));
        product.setRating(avgRating != null ? avgRating : 0.0);
        productRepository.save(product);
    }
}