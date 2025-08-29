package com.project.shopapp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "content_banners")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContentBanner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String title;
    private String imageUrl;
    private String linkUrl;
    private boolean isActive;
    private String position; // e.g., "homepage-top"
}