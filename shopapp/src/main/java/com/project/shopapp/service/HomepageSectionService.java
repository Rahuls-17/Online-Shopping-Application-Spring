package com.project.shopapp.service;

import com.project.shopapp.model.HomepageSection;
import com.project.shopapp.repository.HomepageSectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HomepageSectionService {

    @Autowired
    private HomepageSectionRepository homepageSectionRepository;

    @Transactional
    public HomepageSection createSection(HomepageSection section) {
        if (homepageSectionRepository.existsBySectionOrder(section.getSectionOrder())) {
            throw new RuntimeException("Display order " + section.getSectionOrder() + " is already in use.");
        }
        return homepageSectionRepository.save(section);
    }

    @Transactional
    public HomepageSection updateSection(Long id, HomepageSection sectionDetails) {
        HomepageSection existingSection = homepageSectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Section not found with id: " + id));
        homepageSectionRepository.findBySectionOrder(sectionDetails.getSectionOrder()).ifPresent(s -> {
            if (!s.getId().equals(id)) {
                throw new RuntimeException("Display order " + sectionDetails.getSectionOrder() + " is already in use.");
            }
        });

        existingSection.setTitle(sectionDetails.getTitle());
        existingSection.setSectionOrder(sectionDetails.getSectionOrder());
        existingSection.setProductIds(sectionDetails.getProductIds());

        return homepageSectionRepository.save(existingSection);
    }

    public void deleteSection(Long id) {
        if (!homepageSectionRepository.existsById(id)) {
            throw new RuntimeException("Section not found with id: " + id);
        }
        homepageSectionRepository.deleteById(id);
    }
}