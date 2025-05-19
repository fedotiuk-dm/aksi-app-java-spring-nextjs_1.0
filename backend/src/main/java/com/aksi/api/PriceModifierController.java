package com.aksi.api;

import java.util.List;
import java.util.UUID;

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
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierCategory;
import com.aksi.domain.pricing.service.CatalogPriceModifierService;
import com.aksi.util.ApiResponseUtils;

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
    
    private final CatalogPriceModifierService modifierService;
    
    /**
     * Отримати всі активні модифікатори.
     * 
     * @return Список активних модифікаторів
     */
    @GetMapping
    @Operation(summary = "Отримати всі активні модифікатори")
    public ResponseEntity<?> getAllModifiers() {
        log.info("Запит на отримання всіх активних модифікаторів");
        try {
            List<PriceModifierDTO> modifiers = modifierService.getAllActiveModifiers();
            return ApiResponseUtils.ok(modifiers, "Отримано {} активних модифікаторів", modifiers.size());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні модифікаторів", 
                    "Виникла помилка при отриманні активних модифікаторів. Причина: {}", e.getMessage());
        }
    }
    
    /**
     * Отримати модифікатор за ID.
     * 
     * @param id ID модифікатора
     * @return Деталі модифікатора
     */
    @GetMapping("/{id}")
    @Operation(summary = "Отримати модифікатор за ID")
    public ResponseEntity<?> getModifierById(@PathVariable UUID id) {
        log.info("Запит на отримання модифікатора за ID: {}", id);
        try {
            PriceModifierDTO modifier = modifierService.getModifierById(id);
            if (modifier == null) {
                return ApiResponseUtils.notFound("Модифікатор не знайдено", 
                        "Модифікатор з ID: {} не знайдено", id);
            }
            return ApiResponseUtils.ok(modifier, "Отримано модифікатор: {}", modifier.getName());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні модифікатора", 
                    "Виникла помилка при отриманні модифікатора з ID: {}. Причина: {}", 
                    id, e.getMessage());
        }
    }
    
    /**
     * Отримати модифікатор за кодом.
     * 
     * @param code Код модифікатора
     * @return Деталі модифікатора
     */
    @GetMapping("/code/{code}")
    @Operation(summary = "Отримати модифікатор за кодом")
    public ResponseEntity<?> getModifierByCode(@PathVariable String code) {
        log.info("Запит на отримання модифікатора за кодом: {}", code);
        try {
            PriceModifierDTO modifier = modifierService.getModifierByCode(code);
            if (modifier == null) {
                return ApiResponseUtils.notFound("Модифікатор не знайдено", 
                        "Модифікатор з кодом: {} не знайдено", code);
            }
            return ApiResponseUtils.ok(modifier, "Отримано модифікатор: {}", modifier.getName());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні модифікатора", 
                    "Виникла помилка при отриманні модифікатора з кодом: {}. Причина: {}", 
                    code, e.getMessage());
        }
    }
    
    /**
     * Отримати модифікатори для певної категорії послуг.
     * 
     * @param categoryCode Код категорії
     * @return Список модифікаторів для категорії
     */
    @GetMapping("/service-category/{categoryCode}")
    @Operation(summary = "Отримати модифікатори для категорії послуг")
    public ResponseEntity<?> getModifiersForServiceCategory(
            @PathVariable String categoryCode) {
        log.info("Запит на отримання модифікаторів для категорії послуг: {}", categoryCode);
        try {
            List<PriceModifierDTO> modifiers = modifierService.getModifiersForServiceCategory(categoryCode);
            return ApiResponseUtils.ok(modifiers, "Отримано {} модифікаторів для категорії послуг: {}", 
                    modifiers.size(), categoryCode);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Категорію послуг не знайдено", 
                    "Категорію послуг з кодом: {} не знайдено. Причина: {}", 
                    categoryCode, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні модифікаторів", 
                    "Виникла помилка при отриманні модифікаторів для категорії послуг: {}. Причина: {}", 
                    categoryCode, e.getMessage());
        }
    }
    
    /**
     * Отримати модифікатори за категорією (GENERAL, TEXTILE, LEATHER).
     * 
     * @param category Категорія модифікатора
     * @return Список модифікаторів у категорії
     */
    @GetMapping("/category")
    @Operation(summary = "Отримати модифікатори за категорією")
    public ResponseEntity<?> getModifiersByCategory(
            @RequestParam ModifierCategory category) {
        log.info("Запит на отримання модифікаторів за категорією: {}", category);
        try {
            List<PriceModifierDTO> modifiers = modifierService.getModifiersByCategory(category);
            return ApiResponseUtils.ok(modifiers, "Отримано {} модифікаторів для категорії: {}", 
                    modifiers.size(), category);
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні модифікаторів", 
                    "Виникла помилка при отриманні модифікаторів для категорії: {}. Причина: {}", 
                    category, e.getMessage());
        }
    }
    
    /**
     * Створити новий модифікатор ціни.
     * 
     * @param modifierDTO Дані нового модифікатора
     * @return Створений модифікатор
     */
    @PostMapping
    @Operation(summary = "Створити новий модифікатор ціни")
    public ResponseEntity<?> createModifier(
            @Valid @RequestBody PriceModifierDTO modifierDTO) {
        log.info("Запит на створення нового модифікатора: {}", modifierDTO);
        try {
            PriceModifierDTO createdModifier = modifierService.createModifier(modifierDTO);
            return ApiResponseUtils.created(createdModifier, "Створено новий модифікатор: {}", 
                    createdModifier.getName());
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.badRequest("Некоректні дані для модифікатора", 
                    "Не вдалося створити модифікатор. Причина: {}", e.getMessage());
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().contains("вже існує")) {
                return ApiResponseUtils.conflict("Модифікатор з таким кодом вже існує", 
                        "Модифікатор з кодом: {} вже існує", modifierDTO.getCode());
            }
            return ApiResponseUtils.internalServerError("Помилка при створенні модифікатора", 
                    "Виникла помилка при створенні модифікатора. Причина: {}", e.getMessage());
        }
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
    public ResponseEntity<?> updateModifier(
            @PathVariable UUID id, 
            @Valid @RequestBody PriceModifierDTO modifierDTO) {
        log.info("Запит на оновлення модифікатора з ID {}: {}", id, modifierDTO);
        try {
            PriceModifierDTO updatedModifier = modifierService.updateModifier(id, modifierDTO);
            return ApiResponseUtils.ok(updatedModifier, "Оновлено модифікатор: {}", 
                    updatedModifier.getName());
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Модифікатор не знайдено", 
                    "Модифікатор з ID: {} не знайдено. Причина: {}", id, e.getMessage());
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().contains("вже існує")) {
                return ApiResponseUtils.conflict("Модифікатор з таким кодом вже існує", 
                        "Модифікатор з кодом: {} вже існує", modifierDTO.getCode());
            }
            return ApiResponseUtils.internalServerError("Помилка при оновленні модифікатора", 
                    "Виникла помилка при оновленні модифікатора з ID: {}. Причина: {}", 
                    id, e.getMessage());
        }
    }
    
    /**
     * Деактивувати модифікатор ціни.
     * 
     * @param id ID модифікатора
     * @return Статус без вмісту
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Деактивувати модифікатор ціни")
    public ResponseEntity<?> deactivateModifier(@PathVariable UUID id) {
        log.info("Запит на деактивацію модифікатора з ID: {}", id);
        try {
            modifierService.deactivateModifier(id);
            return ApiResponseUtils.noContent("Деактивовано модифікатор з ID: {}", id);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Модифікатор не знайдено", 
                    "Модифікатор з ID: {} не знайдено. Причина: {}", id, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при деактивації модифікатора", 
                    "Виникла помилка при деактивації модифікатора з ID: {}. Причина: {}", 
                    id, e.getMessage());
        }
    }
} 
