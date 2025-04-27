package com.aksi.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.service.ItemCharacteristicsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Контролер для роботи з характеристиками предметів замовлення.
 */
@RestController
@RequestMapping("/item-characteristics")
@Tag(name = "Item Characteristics", description = "API для роботи з характеристиками предметів замовлення")
@RequiredArgsConstructor
@Slf4j
public class ItemCharacteristicsController {
    
    private final ItemCharacteristicsService itemCharacteristicsService;
    
    /**
     * Отримати доступні матеріали для предметів.
     * 
     * @param category Категорія предмета (опціонально)
     * @return Список доступних матеріалів
     */
    @GetMapping("/materials")
    @Operation(summary = "Отримати доступні матеріали для предметів")
    public ResponseEntity<List<String>> getMaterials(@RequestParam(required = false) String category) {
        log.info("REST запит на отримання доступних матеріалів для категорії: {}", category);
        return ResponseEntity.ok(itemCharacteristicsService.getMaterialsByCategory(category));
    }
    
    /**
     * Отримати базові кольори для предметів.
     * 
     * @return Список базових кольорів
     */
    @GetMapping("/colors")
    @Operation(summary = "Отримати базові кольори для предметів")
    public ResponseEntity<List<String>> getColors() {
        log.info("REST запит на отримання базових кольорів");
        return ResponseEntity.ok(itemCharacteristicsService.getAllColors());
    }
    
    /**
     * Отримати типи наповнювачів для предметів.
     * 
     * @return Список типів наповнювачів
     */
    @GetMapping("/filler-types")
    @Operation(summary = "Отримати типи наповнювачів для предметів")
    public ResponseEntity<List<String>> getFillerTypes() {
        log.info("REST запит на отримання типів наповнювачів");
        return ResponseEntity.ok(itemCharacteristicsService.getAllFillerTypes());
    }
    
    /**
     * Отримати ступені зносу для предметів.
     * 
     * @return Список ступенів зносу
     */
    @GetMapping("/wear-degrees")
    @Operation(summary = "Отримати ступені зносу для предметів")
    public ResponseEntity<List<String>> getWearDegrees() {
        log.info("REST запит на отримання ступенів зносу");
        return ResponseEntity.ok(itemCharacteristicsService.getAllWearDegrees());
    }

    // ---------- Забруднення та дефекти ----------

    /**
     * Отримати типи плям для предметів.
     * 
     * @return Список типів плям
     */
    @GetMapping("/stain-types")
    @Operation(summary = "Отримати типи плям для предметів")
    public ResponseEntity<List<String>> getStainTypes() {
        log.info("REST запит на отримання типів плям");
        return ResponseEntity.ok(itemCharacteristicsService.getAllStainTypes());
    }

    /**
     * Отримати дефекти та ризики для предметів.
     * 
     * @return Список дефектів і ризиків
     */
    @GetMapping("/defects-and-risks")
    @Operation(summary = "Отримати дефекти та ризики для предметів")
    public ResponseEntity<List<String>> getDefectsAndRisks() {
        log.info("REST запит на отримання дефектів та ризиків");
        return ResponseEntity.ok(itemCharacteristicsService.getAllDefectsAndRisks());
    }

    /**
     * Отримати тільки дефекти для предметів.
     * 
     * @return Список дефектів
     */
    @GetMapping("/defects")
    @Operation(summary = "Отримати тільки дефекти для предметів")
    public ResponseEntity<List<String>> getDefects() {
        log.info("REST запит на отримання тільки дефектів");
        return ResponseEntity.ok(itemCharacteristicsService.getDefects());
    }

    /**
     * Отримати тільки ризики для предметів.
     * 
     * @return Список ризиків
     */
    @GetMapping("/risks")
    @Operation(summary = "Отримати тільки ризики для предметів")
    public ResponseEntity<List<String>> getRisks() {
        log.info("REST запит на отримання тільки ризиків");
        return ResponseEntity.ok(itemCharacteristicsService.getRisks());
    }
}
