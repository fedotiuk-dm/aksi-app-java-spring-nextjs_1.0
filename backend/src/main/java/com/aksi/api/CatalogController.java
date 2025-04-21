package com.aksi.api;

import com.aksi.domain.order.entity.StainType;
import com.aksi.dto.catalog.MaterialWarningDto;
import com.aksi.dto.catalog.ModifierRecommendationDto;
import com.aksi.service.catalog.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST контролер для роботи з каталогами та інтелектуальними залежностями.
 */
@RestController
@RequestMapping("/api/catalog")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Catalog API", description = "API для роботи з каталогами та інтелектуальними залежностями")
public class CatalogController {

    private final CatalogService catalogService;

    /**
     * Отримати список матеріалів для категорії за ID.
     *
     * @param categoryId ID категорії
     * @return Список доступних матеріалів
     */
    @GetMapping("/categories/{categoryId}/materials")
    @Operation(summary = "Отримати доступні матеріали для категорії", 
               description = "Повертає список матеріалів, доступних для обраної категорії")
    public ResponseEntity<List<String>> getMaterialsForCategory(
            @Parameter(description = "ID категорії") 
            @PathVariable UUID categoryId) {
        
        log.debug("REST request to get materials for category ID: {}", categoryId);
        List<String> materials = catalogService.getMaterialsForCategory(categoryId);
        return ResponseEntity.ok(materials);
    }

    /**
     * Отримати список матеріалів для категорії за кодом.
     *
     * @param categoryCode Код категорії
     * @return Список доступних матеріалів
     */
    @GetMapping("/categories/code/{categoryCode}/materials")
    @Operation(summary = "Отримати доступні матеріали для категорії за кодом", 
               description = "Повертає список матеріалів, доступних для обраної категорії за її кодом")
    public ResponseEntity<List<String>> getMaterialsForCategoryByCode(
            @Parameter(description = "Код категорії") 
            @PathVariable String categoryCode) {
        
        log.debug("REST request to get materials for category code: {}", categoryCode);
        List<String> materials = catalogService.getMaterialsForCategoryByCode(categoryCode);
        return ResponseEntity.ok(materials);
    }

    /**
     * Отримати рекомендовані модифікатори на основі типів забруднень.
     *
     * @param stainTypes Список типів забруднень
     * @return Список рекомендованих модифікаторів
     */
    @GetMapping("/stains/modifiers")
    @Operation(summary = "Отримати рекомендовані модифікатори для забруднень", 
               description = "Повертає список рекомендованих модифікаторів для вказаних типів забруднень")
    public ResponseEntity<List<ModifierRecommendationDto>> getRecommendedModifiersForStains(
            @Parameter(description = "Типи забруднень") 
            @RequestParam List<StainType> stainTypes) {
        
        log.debug("REST request to get recommended modifiers for stain types: {}", stainTypes);
        List<ModifierRecommendationDto> modifiers = catalogService.getRecommendedModifiersForStains(stainTypes);
        return ResponseEntity.ok(modifiers);
    }

    /**
     * Отримати попередження для комбінації матеріалу та типів забруднень.
     *
     * @param material Матеріал
     * @param stainTypes Список типів забруднень
     * @return Список попереджень
     */
    @GetMapping("/materials/{material}/warnings")
    @Operation(summary = "Отримати попередження для матеріалу та забруднень", 
               description = "Повертає список попереджень для вказаної комбінації матеріалу та типів забруднень")
    public ResponseEntity<List<MaterialWarningDto>> getWarningsForMaterialAndStains(
            @Parameter(description = "Назва матеріалу") 
            @PathVariable String material,
            @Parameter(description = "Типи забруднень") 
            @RequestParam(required = false) List<StainType> stainTypes) {
        
        log.debug("REST request to get warnings for material: {} and stain types: {}", material, stainTypes);
        List<MaterialWarningDto> warnings = catalogService.getWarningsForMaterialAndStains(material, stainTypes);
        return ResponseEntity.ok(warnings);
    }
    
    /**
     * Додати матеріал до категорії.
     *
     * @param categoryId ID категорії
     * @param material Назва матеріалу
     * @param sortOrder Порядок сортування
     * @return true, якщо успішно додано
     */
    @PostMapping("/categories/{categoryId}/materials")
    @Operation(summary = "Додати матеріал до категорії", 
               description = "Додає новий матеріал до вказаної категорії")
    public ResponseEntity<Boolean> addMaterialToCategory(
            @Parameter(description = "ID категорії") 
            @PathVariable UUID categoryId,
            @Parameter(description = "Назва матеріалу") 
            @RequestParam String material,
            @Parameter(description = "Порядок сортування") 
            @RequestParam(required = false) Integer sortOrder) {
        
        log.debug("REST request to add material: {} to category ID: {}", material, categoryId);
        boolean success = catalogService.addMaterialToCategory(categoryId, material, sortOrder);
        return ResponseEntity.ok(success);
    }
}
