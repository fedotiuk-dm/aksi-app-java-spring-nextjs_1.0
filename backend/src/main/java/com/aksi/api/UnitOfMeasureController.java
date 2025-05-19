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
import com.aksi.util.ApiResponseUtils;

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
    public ResponseEntity<?> getRecommendedUnitOfMeasure(
            @RequestParam UUID categoryId,
            @RequestParam String itemName) {
        log.info("Запит на отримання рекомендованої одиниці виміру для категорії з ID: {} та предмета: {}",
                categoryId, itemName);

        try {
            String recommendedUnit = unitOfMeasureService.getRecommendedUnitOfMeasure(categoryId, itemName);
            return ApiResponseUtils.ok(recommendedUnit,
                    "Отримано рекомендовану одиницю виміру '{}' для предмета: {}",
                    recommendedUnit, itemName);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Не знайдено рекомендовану одиницю виміру",
                    "Не знайдено рекомендовану одиницю виміру для категорії з ID: {} та предмета: {}. Причина: {}",
                    categoryId, itemName, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні рекомендованої одиниці виміру",
                    "Виникла помилка при отриманні рекомендованої одиниці виміру для категорії з ID: {} та предмета: {}. Причина: {}",
                    categoryId, itemName, e.getMessage());
        }
    }

    /**
     * Отримати всі доступні одиниці виміру для обраної категорії.
     *
     * @param categoryId ID категорії послуг
     * @return Список доступних одиниць виміру
     */
    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Отримати всі доступні одиниці виміру для категорії")
    public ResponseEntity<?> getAvailableUnitsForCategory(
            @PathVariable UUID categoryId) {
        log.info("Запит на отримання доступних одиниць виміру для категорії з ID: {}", categoryId);

        try {
            List<String> availableUnits = unitOfMeasureService.getAvailableUnitsForCategory(categoryId);
            return ApiResponseUtils.ok(availableUnits,
                    "Отримано {} доступних одиниць виміру для категорії з ID: {}",
                    availableUnits.size(), categoryId);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Категорію не знайдено",
                    "Категорію з ID: {} не знайдено. Причина: {}",
                    categoryId, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні доступних одиниць виміру",
                    "Виникла помилка при отриманні доступних одиниць виміру для категорії з ID: {}. Причина: {}",
                    categoryId, e.getMessage());
        }
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
    public ResponseEntity<?> isUnitSupportedForItem(
            @RequestParam UUID categoryId,
            @RequestParam String itemName,
            @RequestParam String unitOfMeasure) {
        log.info("Запит на перевірку підтримки одиниці виміру {} для категорії з ID: {} та предмета: {}",
                unitOfMeasure, categoryId, itemName);

        try {
            boolean isSupported = unitOfMeasureService.isUnitSupportedForItem(categoryId, itemName, unitOfMeasure);
            String message = isSupported
                ? "Одиниця виміру '{}' підтримується для предмета: {}"
                : "Одиниця виміру '{}' НЕ підтримується для предмета: {}";

            return ApiResponseUtils.ok(isSupported, message, unitOfMeasure, itemName);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Категорію або предмет не знайдено",
                    "Не вдалося перевірити підтримку одиниці виміру. Причина: {}",
                    e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при перевірці підтримки одиниці виміру",
                    "Виникла помилка при перевірці підтримки одиниці виміру {} для категорії з ID: {} та предмета: {}. Причина: {}",
                    unitOfMeasure, categoryId, itemName, e.getMessage());
        }
    }
}
