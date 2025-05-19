package com.aksi.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.service.ItemCharacteristicsService;
import com.aksi.util.ApiResponseUtils;

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
    public ResponseEntity<?> getMaterials(@RequestParam(required = false) String category) {
        log.info("Запит на отримання доступних матеріалів для категорії: {}", category);
        try {
            List<String> materials = itemCharacteristicsService.getMaterialsByCategory(category);
            return ApiResponseUtils.ok(materials, "Отримано {} матеріалів для категорії: {}",
                    materials.size(), category != null ? category : "всі категорії");
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні матеріалів",
                    "Не вдалося отримати матеріали для категорії: {}. Причина: {}",
                    category != null ? category : "всі категорії", e.getMessage());
        }
    }

    /**
     * Отримати базові кольори для предметів.
     *
     * @return Список базових кольорів
     */
    @GetMapping("/colors")
    @Operation(summary = "Отримати базові кольори для предметів")
    public ResponseEntity<?> getColors() {
        log.info("Запит на отримання базових кольорів");
        try {
            List<String> colors = itemCharacteristicsService.getAllColors();
            return ApiResponseUtils.ok(colors, "Отримано {} базових кольорів", colors.size());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні кольорів",
                    "Не вдалося отримати базові кольори. Причина: {}", e.getMessage());
        }
    }

    /**
     * Отримати типи наповнювачів для предметів.
     *
     * @return Список типів наповнювачів
     */
    @GetMapping("/filler-types")
    @Operation(summary = "Отримати типи наповнювачів для предметів")
    public ResponseEntity<?> getFillerTypes() {
        log.info("Запит на отримання типів наповнювачів");
        try {
            List<String> fillerTypes = itemCharacteristicsService.getAllFillerTypes();
            return ApiResponseUtils.ok(fillerTypes, "Отримано {} типів наповнювачів", fillerTypes.size());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні типів наповнювачів",
                    "Не вдалося отримати типи наповнювачів. Причина: {}", e.getMessage());
        }
    }

    /**
     * Отримати ступені зносу для предметів.
     *
     * @return Список ступенів зносу
     */
    @GetMapping("/wear-degrees")
    @Operation(summary = "Отримати ступені зносу для предметів")
    public ResponseEntity<?> getWearDegrees() {
        log.info("Запит на отримання ступенів зносу");
        try {
            List<String> wearDegrees = itemCharacteristicsService.getAllWearDegrees();
            return ApiResponseUtils.ok(wearDegrees, "Отримано {} ступенів зносу", wearDegrees.size());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні ступенів зносу",
                    "Не вдалося отримати ступені зносу. Причина: {}", e.getMessage());
        }
    }

    // ---------- Забруднення та дефекти ----------

    /**
     * Отримати типи плям для предметів.
     *
     * @return Список типів плям
     */
    @GetMapping("/stain-types")
    @Operation(summary = "Отримати типи плям для предметів")
    public ResponseEntity<?> getStainTypes() {
        log.info("Запит на отримання типів плям");
        try {
            List<String> stainTypes = itemCharacteristicsService.getAllStainTypes();
            return ApiResponseUtils.ok(stainTypes, "Отримано {} типів плям", stainTypes.size());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні типів плям",
                    "Не вдалося отримати типи плям. Причина: {}", e.getMessage());
        }
    }

    /**
     * Отримати дефекти та ризики для предметів.
     *
     * @return Список дефектів і ризиків
     */
    @GetMapping("/defects-and-risks")
    @Operation(summary = "Отримати дефекти та ризики для предметів")
    public ResponseEntity<?> getDefectsAndRisks() {
        log.info("Запит на отримання дефектів та ризиків");
        try {
            List<String> defectsAndRisks = itemCharacteristicsService.getAllDefectsAndRisks();
            return ApiResponseUtils.ok(defectsAndRisks, "Отримано {} дефектів та ризиків", defectsAndRisks.size());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні дефектів та ризиків",
                    "Не вдалося отримати дефекти та ризики. Причина: {}", e.getMessage());
        }
    }

    /**
     * Отримати тільки дефекти для предметів.
     *
     * @return Список дефектів
     */
    @GetMapping("/defects")
    @Operation(summary = "Отримати тільки дефекти для предметів")
    public ResponseEntity<?> getDefects() {
        log.info("Запит на отримання тільки дефектів");
        try {
            List<String> defects = itemCharacteristicsService.getDefects();
            return ApiResponseUtils.ok(defects, "Отримано {} дефектів", defects.size());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні дефектів",
                    "Не вдалося отримати дефекти. Причина: {}", e.getMessage());
        }
    }

    /**
     * Отримати тільки ризики для предметів.
     *
     * @return Список ризиків
     */
    @GetMapping("/risks")
    @Operation(summary = "Отримати тільки ризики для предметів")
    public ResponseEntity<?> getRisks() {
        log.info("Запит на отримання тільки ризиків");
        try {
            List<String> risks = itemCharacteristicsService.getRisks();
            return ApiResponseUtils.ok(risks, "Отримано {} ризиків", risks.size());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні ризиків",
                    "Не вдалося отримати ризики. Причина: {}", e.getMessage());
        }
    }
}
