package com.aksi.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.pricing.dto.ServiceCategoryDTO;
import com.aksi.domain.pricing.service.ServiceCategoryService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Контролер для роботи з категоріями послуг.
 */
@RestController
@RequestMapping("/service-categories")
@Tag(name = "Категорії послуг", description = "API для роботи з категоріями послуг")
@RequiredArgsConstructor
@Slf4j
public class ServiceCategoryController {
    
    private final ServiceCategoryService serviceCategoryService;
    
    /**
     * Отримати список всіх активних категорій послуг.
     *
     * @return Список всіх активних категорій послуг
     */
    @GetMapping
    @Operation(summary = "Отримати список всіх активних категорій послуг")
    public ResponseEntity<List<ServiceCategoryDTO>> getAllActiveCategories() {
        log.debug("REST запит на отримання списку всіх активних категорій послуг");
        
        List<ServiceCategoryDTO> categories = serviceCategoryService.getAllActiveCategories();
        
        return ResponseEntity.ok(categories);
    }
    
    /**
     * Отримати категорію послуг за ID.
     *
     * @param id ID категорії послуг
     * @return Категорія послуг
     */
    @GetMapping("/{id}")
    @Operation(summary = "Отримати категорію послуг за ID")
    public ResponseEntity<ServiceCategoryDTO> getCategoryById(@PathVariable UUID id) {
        log.debug("REST запит на отримання категорії послуг за ID: {}", id);
        
        ServiceCategoryDTO category = serviceCategoryService.getCategoryById(id);
        
        return ResponseEntity.ok(category);
    }
    
    /**
     * Отримати категорію послуг за кодом.
     *
     * @param code Код категорії послуг
     * @return Категорія послуг
     */
    @GetMapping("/code/{code}")
    @Operation(summary = "Отримати категорію послуг за кодом")
    public ResponseEntity<ServiceCategoryDTO> getCategoryByCode(@PathVariable String code) {
        log.debug("REST запит на отримання категорії послуг за кодом: {}", code);
        
        ServiceCategoryDTO category = serviceCategoryService.getCategoryByCode(code);
        
        return ResponseEntity.ok(category);
    }
}
