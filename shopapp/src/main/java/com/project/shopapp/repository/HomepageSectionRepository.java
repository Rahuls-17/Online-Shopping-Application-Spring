package com.project.shopapp.repository;

import com.project.shopapp.model.HomepageSection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface HomepageSectionRepository extends JpaRepository<HomepageSection, Long> {
    List<HomepageSection> findAllByOrderBySectionOrderAsc();

    boolean existsBySectionOrder(int sectionOrder);

    Optional<HomepageSection> findBySectionOrder(int sectionOrder);
}