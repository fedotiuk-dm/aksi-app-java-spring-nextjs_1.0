package com.aksi.service.catalog.impl;

import com.aksi.domain.catalog.entity.CategoryMaterialMapping;
import com.aksi.domain.catalog.entity.MaterialStainWarning;
import com.aksi.domain.catalog.entity.StainModifierRecommendation;
import com.aksi.domain.catalog.repository.CategoryMaterialMappingRepository;
import com.aksi.domain.catalog.repository.MaterialStainWarningRepository;
import com.aksi.domain.catalog.repository.StainModifierRecommendationRepository;
import com.aksi.domain.order.entity.StainType;
import com.aksi.domain.pricing.entity.ServiceCategory;
import com.aksi.domain.pricing.repository.ServiceCategoryRepository;
import com.aksi.dto.catalog.MaterialWarningDto;
import com.aksi.dto.catalog.ModifierRecommendationDto;
import com.aksi.service.catalog.CatalogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Реалізація сервісу для роботи з каталогами та допоміжними даними
 * для забезпечення інтелектуальних залежностей в системі.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class CatalogServiceImpl implements CatalogService {

    private final CategoryMaterialMappingRepository categoryMaterialRepository;
    private final StainModifierRecommendationRepository stainModifierRepository;
    private final MaterialStainWarningRepository materialWarningRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<String> getMaterialsForCategory(UUID categoryId) {
        log.debug("Getting materials for category ID: {}", categoryId);
        return categoryMaterialRepository.findMaterialsByCategoryId(categoryId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getMaterialsForCategoryByCode(String categoryCode) {
        log.debug("Getting materials for category code: {}", categoryCode);
        return categoryMaterialRepository.findMaterialsByCategoryCode(categoryCode);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ModifierRecommendationDto> getRecommendedModifiersForStains(List<StainType> stainTypes) {
        if (stainTypes == null || stainTypes.isEmpty()) {
            return new ArrayList<>();
        }
        
        log.debug("Getting recommended modifiers for stain types: {}", stainTypes);
        
        // Отримуємо всі рекомендації для вказаних типів забруднень
        List<StainModifierRecommendation> recommendations = 
                stainModifierRepository.findByStainTypeInOrderByPriorityDesc(stainTypes);
        
        // Перетворюємо їх у DTO
        return recommendations.stream()
                .map(this::mapToModifierRecommendationDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaterialWarningDto> getWarningsForMaterialAndStains(String material, List<StainType> stainTypes) {
        if (material == null || stainTypes == null || stainTypes.isEmpty()) {
            return new ArrayList<>();
        }
        
        log.debug("Getting warnings for material: {} and stain types: {}", material, stainTypes);
        
        // Отримуємо всі попередження для матеріалу та типів забруднень
        List<MaterialStainWarning> warnings = 
                materialWarningRepository.findByMaterialAndStainTypeIn(material, stainTypes);
        
        // Перетворюємо їх у DTO
        return warnings.stream()
                .map(this::mapToMaterialWarningDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean addMaterialToCategory(UUID categoryId, String material, Integer sortOrder) {
        log.debug("Adding material: {} to category ID: {}", material, categoryId);
        
        try {
            ServiceCategory category = serviceCategoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found with ID: " + categoryId));
            
            CategoryMaterialMapping mapping = CategoryMaterialMapping.builder()
                    .category(category)
                    .material(material)
                    .sortOrder(sortOrder != null ? sortOrder : 0)
                    .build();
            
            categoryMaterialRepository.save(mapping);
            return true;
        } catch (Exception e) {
            log.error("Error adding material to category: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    @Transactional
    public boolean addStainModifierRecommendation(StainType stainType, String modifierName, 
                                              String modifierType, double modifierValue, 
                                              String description, int priority) {
        log.debug("Adding stain modifier recommendation for stain type: {}, modifier: {}", 
                stainType, modifierName);
        
        try {
            StainModifierRecommendation recommendation = StainModifierRecommendation.builder()
                    .stainType(stainType)
                    .modifierName(modifierName)
                    .modifierType(modifierType)
                    .modifierValue(BigDecimal.valueOf(modifierValue))
                    .description(description)
                    .priority(priority)
                    .build();
            
            stainModifierRepository.save(recommendation);
            return true;
        } catch (Exception e) {
            log.error("Error adding stain modifier recommendation: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    @Transactional
    public boolean addMaterialStainWarning(String material, StainType stainType, 
                                      String warningType, String warningMessage, 
                                      String severity) {
        log.debug("Adding material stain warning for material: {}, stain type: {}", 
                material, stainType);
        
        try {
            MaterialStainWarning warning = MaterialStainWarning.builder()
                    .material(material)
                    .stainType(stainType)
                    .warningType(warningType)
                    .warningMessage(warningMessage)
                    .severity(severity)
                    .build();
            
            materialWarningRepository.save(warning);
            return true;
        } catch (Exception e) {
            log.error("Error adding material stain warning: {}", e.getMessage(), e);
            return false;
        }
    }
    
    /**
     * Перетворює сутність StainModifierRecommendation в DTO.
     */
    private ModifierRecommendationDto mapToModifierRecommendationDto(StainModifierRecommendation recommendation) {
        return ModifierRecommendationDto.builder()
                .stainType(recommendation.getStainType())
                .modifierName(recommendation.getModifierName())
                .modifierType(recommendation.getModifierType())
                .modifierValue(recommendation.getModifierValue())
                .description(recommendation.getDescription())
                .priority(recommendation.getPriority())
                .applyAutomatically(recommendation.getPriority() > 15) // Високий пріоритет - автоматично застосовувати
                .build();
    }
    
    /**
     * Перетворює сутність MaterialStainWarning в DTO.
     */
    private MaterialWarningDto mapToMaterialWarningDto(MaterialStainWarning warning) {
        return MaterialWarningDto.builder()
                .material(warning.getMaterial())
                .stainType(warning.getStainType())
                .warningType(warning.getWarningType())
                .warningMessage(warning.getWarningMessage())
                .severity(warning.getSeverity())
                .requiresConfirmation("DANGER".equals(warning.getSeverity())) // Небезпечні попередження вимагають підтвердження
                .build();
    }
}
