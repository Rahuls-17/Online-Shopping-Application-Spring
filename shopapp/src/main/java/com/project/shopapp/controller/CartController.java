package com.project.shopapp.controller;

import com.project.shopapp.dto.CartItemDTO;
import com.project.shopapp.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItemDTO>> viewCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.viewCart(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<CartItemDTO> addToCart(@RequestParam Long userId, @RequestParam Long productId,
            @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.addToCart(userId, productId, quantity));
    }

    @PutMapping("/update")
    public ResponseEntity<CartItemDTO> updateQuantity(@RequestParam Long userId, @RequestParam Long productId,
            @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(userId, productId, quantity));
    }

    @DeleteMapping("/remove")
    public ResponseEntity<?> removeItem(@RequestParam Long userId, @RequestParam Long productId) {
        cartService.removeFromCart(userId, productId);
        return ResponseEntity.ok(Map.of("message", "Item removed from cart"));
    }

    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok(Map.of("message", "Cart cleared successfully"));
    }

    @PostMapping("/move-to-wishlist")
    public ResponseEntity<?> moveToWishlist(@RequestParam Long userId, @RequestParam Long productId) {
        cartService.moveToWishlist(userId, productId);
        return ResponseEntity.ok(Map.of("message", "Item moved to wishlist successfully"));
    }
}