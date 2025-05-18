package com.aksi.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.entity.PriceModifierEntity.ModifierCategory;
import com.aksi.domain.pricing.service.PriceModifierService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST API для управління модифікаторами цін.
 */
@RestController
@RequestMapping("/price-modifiers")
@Tag(name = "Price Modifiers", description = "API для управління модифікаторами цін")
@RequiredArgsConstructor
@Slf4j
public class PriceModifierController {
    
    private final PriceModifierService modifierService;
    
    /**
     * Отримати всі активні модифікатори.
     * 
     * @return Список активних модифікаторів
     */
    @GetMapping
    @Operation(summary = "Отримати всі активні модифікатори")
    public ResponseEntity<List<PriceModifierDTO>> getAllModifiers() {
        log.info("REST запит на отримання всіх активних модифікаторів");
        return ResponseEntity.ok(modifierService.getAllActiveModifiers());
    }
    
    /**
     * Отримати модифікатор за ID.
     * 
     * @param id ID модифікатора
     * @return Деталі модифікатора
     */
    @GetMapping("/{id}")
    @Operation(summary = "Отримати модифікатор за ID")
    public ResponseEntity<PriceModifierDTO> getModifierById(@PathVariable UUID id) {
        log.info("REST запит на отримання модифікатора за ID: {}", id);
        PriceModifierDTO modifier = modifierService.getModifierById(id);
        if (modifier == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(modifier);
    }
    
    /**
     * Отримати модифікатор за кодом.
     * 
     * @param code Код модифікатора
     * @return Деталі модифікатора
     */
    @GetMapping("/code/{code}")
    @Operation(summary = "Отримати модифікатор за кодом")
    public ResponseEntity<PriceModifierDTO> getModifierByCode(@PathVariable String code) {
        log.info("REST запит на отримання модифікатора за кодом: {}", code);
        PriceModifierDTO modifier = modifierService.getModifierByCode(code);
        if (modifier == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(modifier);
    }
    
    /**
     * Отримати модифікатори для певної категорії послуг.
     * 
     * @param categoryCode Код категорії
     * @return Список модифікаторів для категорії
     */
    @GetMapping("/service-category/{categoryCode}")
    @Operation(summary = "Отримати модифікатори для категорії послуг")
    public ResponseEntity<List<PriceModifierDTO>> getModifiersForServiceCategory(
            @PathVariable String categoryCode) {
        log.info("REST запит на отримання модифікаторів для категорії послуг: {}", categoryCode);
        return ResponseEntity.ok(modifierService.getModifiersForServiceCategory(categoryCode));
    }
    
    /**
     * Отримати модифікатори за категорією (GENERAL, TEXTILE, LEATHER).
     * 
     * @param category Категорія модифікатора
     * @return Список модифікаторів у категорії
     */
    @GetMapping("/category")
    @Operation(summary = "Отримати модифікатори за категорією")
    public ResponseEntity<List<PriceModifierDTO>> getModifiersByCategory(
            @RequestParam ModifierCategory category) {
        log.info("REST запит на отримання модифікаторів за категорією: {}", category);
        return ResponseEntity.ok(modifierService.getModifiersByCategory(category));
    }
    
    /**
     * Створити новий модифікатор ціни.
     * 
     * @param modifierDTO Дані нового модифікатора
     * @return Створений модифікатор
     */
    @PostMapping
    @Operation(summary = "Створити новий модифікатор ціни")
    public ResponseEntity<PriceModifierDTO> createModifier(
            @Valid @RequestBody PriceModifierDTO modifierDTO) {
        log.info("REST запит на створення нового модифікатора: {}", modifierDTO);
        PriceModifierDTO createdModifier = modifierService.createModifier(modifierDTO);
        return new ResponseEntity<>(createdModifier, HttpStatus.CREATED);
    }
    
    /**
     * Оновити існуючий модифікатор ціни.
     * 
     * @param id ID модифікатора
     * @param modifierDTO Нові дані модифікатора
     * @return Оновлений модифікатор
     */
    @PutMapping("/{id}")
    @Operation(summary = "Оновити існуючий модифікатор ціни")
    public ResponseEntity<PriceModifierDTO> updateModifier(
            @PathVariable UUID id, 
            @Valid @RequestBody PriceModifierDTO modifierDTO) {
        log.info("REST запит на оновлення модифікатора з ID {}: {}", id, modifierDTO);
        PriceModifierDTO updatedModifier = modifierService.updateModifier(id, modifierDTO);
        return ResponseEntity.ok(updatedModifier);
    }
    
    /**
     * Деактивувати модифікатор ціни.
     * 
     * @param id ID модифікатора
     * @return Статус без вмісту
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Деактивувати модифікатор ціни")
    public ResponseEntity<Void> deactivateModifier(@PathVariable UUID id) {
        log.info("REST запит на деактивацію модифікатора з ID: {}", id);
        modifierService.deactivateModifier(id);
        return ResponseEntity.noContent().build();
    }
} 