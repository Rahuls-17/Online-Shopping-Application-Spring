package com.project.shopapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "homepage_sections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HomepageSection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private int sectionOrder;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "homepage_section_products", joinColumns = @JoinColumn(name = "section_id"))
    @Column(name = "product_id")
    @OrderColumn
    private List<Long> productIds;
}