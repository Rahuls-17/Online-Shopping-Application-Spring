package com.project.shopapp.service;

import com.project.shopapp.dto.CartItemDTO;
import com.project.shopapp.dto.ProductResponseDTO;
import com.project.shopapp.model.CartItem;
import com.project.shopapp.model.Product;
import com.project.shopapp.model.User;
import com.project.shopapp.model.WishlistItem;
import com.project.shopapp.repository.CartRepository;
import com.project.shopapp.repository.ProductRepository;
import com.project.shopapp.repository.UserRepository;
import com.project.shopapp.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductService productService;

    public List<CartItemDTO> viewCart(Long userId) {
        List<CartItem> cartItems = cartRepository.findByUserId(userId);
        return cartItems.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CartItemDTO addToCart(Long userId, Long productId, int quantity) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem savedCartItem;
        Optional<CartItem> existingCartItem = cartRepository.findByUserIdAndProductId(userId, productId);

        if (existingCartItem.isPresent()) {
            CartItem cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            savedCartItem = cartRepository.save(cartItem);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setUser(user);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            savedCartItem = cartRepository.save(cartItem);
        }
        return convertToDto(savedCartItem);
    }

    @Transactional
    public CartItemDTO updateQuantity(Long userId, Long productId, int quantity) {
        CartItem cartItem = cartRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            cartRepository.delete(cartItem);
            return null;
        }

        cartItem.setQuantity(quantity);
        CartItem savedCartItem = cartRepository.save(cartItem);
        return convertToDto(savedCartItem);
    }

    @Transactional
    public void removeFromCart(Long userId, Long productId) {
        cartRepository.deleteByUserIdAndProductId(userId, productId);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartRepository.deleteByUserId(userId);
    }

    @Transactional
    public void moveToWishlist(Long userId, Long productId) {
        CartItem cartItem = cartRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        User user = cartItem.getUser();
        Product product = cartItem.getProduct();
        if (wishlistRepository.findByUserIdAndProductId(userId, productId).isEmpty()) {
            WishlistItem wishlistItem = new WishlistItem();
            wishlistItem.setUser(user);
            wishlistItem.setProduct(product);
            wishlistRepository.save(wishlistItem);
        }
        cartRepository.delete(cartItem);
    }

    private CartItemDTO convertToDto(CartItem cartItem) {
        ProductResponseDTO productDto = productService.convertToDto(cartItem.getProduct());

        return CartItemDTO.builder()
                .id(cartItem.getId())
                .quantity(cartItem.getQuantity())
                .product(productDto)
                .build();
    }
}