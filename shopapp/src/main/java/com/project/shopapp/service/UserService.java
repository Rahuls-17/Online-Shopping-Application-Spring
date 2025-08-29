package com.project.shopapp.service;

import com.project.shopapp.dto.UserResponseDTO;
import com.project.shopapp.model.Order;
import com.project.shopapp.model.User;
import com.project.shopapp.repository.CartRepository;
import com.project.shopapp.repository.OrderRepository;
import com.project.shopapp.repository.ProductReviewRepository;
import com.project.shopapp.repository.UserRepository;
import com.project.shopapp.repository.WishlistRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductReviewRepository reviewRepository;

    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDto(user);
    }

    public UserResponseDTO updateUser(Long id, User userDetails) {
        User existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        if (userDetails.getName() != null) {
            existingUser.setName(userDetails.getName());
        }
        if (userDetails.getPhone() != null) {
            existingUser.setPhone(userDetails.getPhone());
        }
        if (userDetails.getAddress() != null) {
            existingUser.setAddress(userDetails.getAddress());
        }

        User updatedUser = userRepository.save(existingUser);
        return convertToDto(updatedUser);
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole().equals("ADMIN")) {
            throw new RuntimeException("Admin accounts cannot be deleted.");
        }

        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(id);
        if (!orders.isEmpty()) {
            throw new RuntimeException(
                    "Cannot delete user: This user has existing orders.");
        }

        cartRepository.deleteByUserId(id);
        wishlistRepository.deleteByUserId(id);
        reviewRepository.deleteByUserId(id);
        userRepository.deleteById(id);
    }

    @Transactional
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Incorrect old password.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole().equals("ADMIN")) {
            throw new RuntimeException("Admin account cannot be disabled.");
        }

        user.setActive(!user.isActive());
        userRepository.save(user);
    }

    @Transactional
    public UserResponseDTO updateUserRole(Long id, String newRole) {
        User userToUpdate = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        boolean isDemotingAdmin = userToUpdate.getRole().equals("ADMIN") && !newRole.equalsIgnoreCase("ADMIN");

        if (isDemotingAdmin) {
            long adminCount = userRepository.countByRole("ADMIN");
            if (adminCount <= 1) {
                throw new RuntimeException("Cannot change role: This is the last administrator account.");
            }
        }

        userToUpdate.setRole(newRole.toUpperCase());
        User updatedUser = userRepository.save(userToUpdate);
        return convertToDto(updatedUser);
    }

    private UserResponseDTO convertToDto(User user) {
        UserResponseDTO userDto = new UserResponseDTO();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setPhone(user.getPhone());
        userDto.setAddress(user.getAddress());
        userDto.setRole(user.getRole());
        userDto.setActive(user.isActive());
        return userDto;
    }

}