package com.aksi.api;

import java.util.List;
import java.util.Set;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.dto.ModifierRecommendationDTO;
import com.aksi.domain.order.service.ModifierRecommendationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST API для отримання рекомендацій модифікаторів.
 */
@RestController
@RequestMapping("/modifier-recommendations")
@Tag(name = "ModifierRecommendation", description = "API для отримання рекомендацій щодо застосування цінових модифікаторів")
@RequiredArgsConstructor
@Slf4j
public class ModifierRecommendationController {

    private final ModifierRecommendationService recommendationService;

    @GetMapping("/stains")
    @Operation(summary = "Отримати рекомендовані модифікатори на основі плям",
               description = "Повертає список рекомендованих модифікаторів цін на основі вказаних типів плям, категорії та матеріалу")
    public List<ModifierRecommendationDTO> getRecommendedModifiersForStains(
            @RequestParam Set<String> stains,
            @RequestParam(required = false) String categoryCode,
            @RequestParam(required = false) String materialType) {

        log.info("Запит на отримання рекомендованих модифікаторів для плям: {}, категорія: {}, матеріал: {}",
                stains, categoryCode, materialType);

        return recommendationService.getRecommendedModifiersForStains(stains, categoryCode, materialType);
    }

    @GetMapping("/defects")
    @Operation(summary = "Отримати рекомендовані модифікатори на основі дефектів",
               description = "Повертає список рекомендованих модифікаторів цін на основі вказаних типів дефектів, категорії та матеріалу")
    public List<ModifierRecommendationDTO> getRecommendedModifiersForDefects(
            @RequestParam Set<String> defects,
            @RequestParam(required = false) String categoryCode,
            @RequestParam(required = false) String materialType) {

        log.info("Запит на отримання рекомендованих модифікаторів для дефектів: {}, категорія: {}, матеріал: {}",
                defects, categoryCode, materialType);

        return recommendationService.getRecommendedModifiersForDefects(defects, categoryCode, materialType);
    }

    @GetMapping("/risks")
    @Operation(summary = "Отримати попередження про ризики",
               description = "Повертає список попереджень про ризики на основі вказаних плям, дефектів, матеріалу та категорії")
    public List<String> getRiskWarningsForItem(
            @RequestParam(required = false) Set<String> stains,
            @RequestParam(required = false) Set<String> defects,
            @RequestParam(required = false) String materialType,
            @RequestParam(required = false) String categoryCode) {

        log.info("Запит на отримання попереджень про ризики для плям: {}, дефектів: {}, матеріалу: {}, категорії: {}",
                stains, defects, materialType, categoryCode);

        return recommendationService.getRiskWarnings(stains, defects, materialType, categoryCode);
    }
}
