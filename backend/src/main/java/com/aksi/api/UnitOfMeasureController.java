package com.aksi.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.pricing.service.UnitOfMeasureService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Контролер для роботи з одиницями виміру предметів.
 */
@RestController
@RequestMapping("/units-of-measure")
@Tag(name = "Unit Of Measure", description = "API для роботи з одиницями виміру для предметів хімчистки")
@RequiredArgsConstructor
@Slf4j
public class UnitOfMeasureController {
    
    private final UnitOfMeasureService unitOfMeasureService;
    
    /**
     * Отримати рекомендовану одиницю виміру для певної категорії та типу предмета.
     * 
     * @param categoryId ID категорії послуг
     * @param itemName Назва предмета
     * @return Рекомендована одиниця виміру
     */
    @GetMapping("/recommend")
    @Operation(summary = "Отримати рекомендовану одиницю виміру для предмета")
    public ResponseEntity<String> getRecommendedUnitOfMeasure(
            @RequestParam UUID categoryId, 
            @RequestParam String itemName) {
        log.info("REST запит на отримання рекомендованої одиниці виміру для категорії з ID: {} та предмета: {}", 
                categoryId, itemName);
        
        String recommendedUnit = unitOfMeasureService.getRecommendedUnitOfMeasure(categoryId, itemName);
        
        return ResponseEntity.ok(recommendedUnit);
    }
    
    /**
     * Отримати всі доступні одиниці виміру для обраної категорії.
     * 
     * @param categoryId ID категорії послуг
     * @return Список доступних одиниць виміру
     */
    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Отримати всі доступні одиниці виміру для категорії")
    public ResponseEntity<List<String>> getAvailableUnitsForCategory(
            @PathVariable UUID categoryId) {
        log.info("REST запит на отримання доступних одиниць виміру для категорії з ID: {}", categoryId);
        
        List<String> availableUnits = unitOfMeasureService.getAvailableUnitsForCategory(categoryId);
        
        return ResponseEntity.ok(availableUnits);
    }
    
    /**
     * Перевірити, чи підтримує предмет конкретну одиницю виміру.
     * 
     * @param categoryId ID категорії послуг
     * @param itemName Назва предмета
     * @param unitOfMeasure Одиниця виміру для перевірки
     * @return true, якщо одиниця виміру підтримується для даного предмета
     */
    @GetMapping("/check-support")
    @Operation(summary = "Перевірити підтримку одиниці виміру для предмета")
    public ResponseEntity<Boolean> isUnitSupportedForItem(
            @RequestParam UUID categoryId, 
            @RequestParam String itemName, 
            @RequestParam String unitOfMeasure) {
        log.info("REST запит на перевірку підтримки одиниці виміру {} для категорії з ID: {} та предмета: {}", 
                unitOfMeasure, categoryId, itemName);
        
        boolean isSupported = unitOfMeasureService.isUnitSupportedForItem(categoryId, itemName, unitOfMeasure);
        
        return ResponseEntity.ok(isSupported);
    }
}
