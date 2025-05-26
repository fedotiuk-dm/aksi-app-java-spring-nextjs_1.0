package com.aksi.api;

import java.util.List;

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
    public List<String> getMaterials(@RequestParam(required = false) String category) {
        log.info("Запит на отримання доступних матеріалів для категорії: {}", category);
        List<String> materials = itemCharacteristicsService.getMaterialsByCategory(category);
        log.info("Отримано {} матеріалів для категорії: {}", materials.size(),
                category != null ? category : "всі категорії");
        return materials;
    }

    /**
     * Отримати базові кольори для предметів.
     *
     * @return Список базових кольорів
     */
    @GetMapping("/colors")
    @Operation(summary = "Отримати базові кольори для предметів")
    public List<String> getColors() {
        log.info("Запит на отримання базових кольорів");
        List<String> colors = itemCharacteristicsService.getAllColors();
        log.info("Отримано {} базових кольорів", colors.size());
        return colors;
    }

    /**
     * Отримати типи наповнювачів для предметів.
     *
     * @return Список типів наповнювачів
     */
    @GetMapping("/filler-types")
    @Operation(summary = "Отримати типи наповнювачів для предметів")
    public List<String> getFillerTypes() {
        log.info("Запит на отримання типів наповнювачів");
        List<String> fillerTypes = itemCharacteristicsService.getAllFillerTypes();
        log.info("Отримано {} типів наповнювачів", fillerTypes.size());
        return fillerTypes;
    }

    /**
     * Отримати ступені зносу для предметів.
     *
     * @return Список ступенів зносу
     */
    @GetMapping("/wear-degrees")
    @Operation(summary = "Отримати ступені зносу для предметів")
    public List<String> getWearDegrees() {
        log.info("Запит на отримання ступенів зносу");
        List<String> wearDegrees = itemCharacteristicsService.getAllWearDegrees();
        log.info("Отримано {} ступенів зносу", wearDegrees.size());
        return wearDegrees;
    }

    // ---------- Забруднення та дефекти ----------

    /**
     * Отримати типи плям для предметів.
     *
     * @return Список типів плям
     */
    @GetMapping("/stain-types")
    @Operation(summary = "Отримати типи плям для предметів")
    public List<String> getStainTypes() {
        log.info("Запит на отримання типів плям");
        List<String> stainTypes = itemCharacteristicsService.getAllStainTypes();
        log.info("Отримано {} типів плям", stainTypes.size());
        return stainTypes;
    }

    /**
     * Отримати дефекти та ризики для предметів.
     *
     * @return Список дефектів і ризиків
     */
    @GetMapping("/defects-and-risks")
    @Operation(summary = "Отримати дефекти та ризики для предметів")
    public List<String> getDefectsAndRisks() {
        log.info("Запит на отримання дефектів та ризиків");
        List<String> defectsAndRisks = itemCharacteristicsService.getAllDefectsAndRisks();
        log.info("Отримано {} дефектів та ризиків", defectsAndRisks.size());
        return defectsAndRisks;
    }

    /**
     * Отримати тільки дефекти для предметів.
     *
     * @return Список дефектів
     */
    @GetMapping("/defects")
    @Operation(summary = "Отримати тільки дефекти для предметів")
    public List<String> getDefects() {
        log.info("Запит на отримання тільки дефектів");
        List<String> defects = itemCharacteristicsService.getDefects();
        log.info("Отримано {} дефектів", defects.size());
        return defects;
    }

    /**
     * Отримати тільки ризики для предметів.
     *
     * @return Список ризиків
     */
    @GetMapping("/risks")
    @Operation(summary = "Отримати тільки ризики для предметів")
    public List<String> getRisks() {
        log.info("Запит на отримання тільки ризиків");
        List<String> risks = itemCharacteristicsService.getRisks();
        log.info("Отримано {} ризиків", risks.size());
        return risks;
    }
}
