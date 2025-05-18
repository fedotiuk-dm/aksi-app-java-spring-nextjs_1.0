package com.aksi.api;

import java.util.List;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.dto.ModifierRecommendationDTO;
import com.aksi.domain.order.service.ModifierRecommendationService;
import com.aksi.util.ApiResponseUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST API для отримання рекомендацій модифікаторів
 */
@RestController
@RequestMapping("/modifier-recommendations")
@Tag(name = "Рекомендації модифікаторів", description = "API для отримання рекомендацій щодо застосування цінових модифікаторів")
@RequiredArgsConstructor
@Slf4j
public class ModifierRecommendationController {

    private final ModifierRecommendationService recommendationService;
    
    @GetMapping("/stains")
    @Operation(summary = "Отримати рекомендовані модифікатори на основі плям", 
               description = "Повертає список рекомендованих модифікаторів цін на основі вказаних типів плям, категорії та матеріалу")
    public ResponseEntity<?> getRecommendedModifiersForStains(
            @RequestParam Set<String> stains,
            @RequestParam(required = false) String categoryCode,
            @RequestParam(required = false) String materialType) {
        
        log.info("Запит на отримання рекомендованих модифікаторів для плям: {}, категорія: {}, матеріал: {}", 
                stains, categoryCode, materialType);
        
        try {
            List<ModifierRecommendationDTO> recommendations = 
                    recommendationService.getRecommendedModifiersForStains(stains, categoryCode, materialType);
            
            return ApiResponseUtils.ok(recommendations, 
                    "Отримано {} рекомендованих модифікаторів для плям", recommendations.size());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні рекомендацій для плям", 
                    "Не вдалося отримати рекомендації модифікаторів для плям: {}. Причина: {}", 
                    stains, e.getMessage());
        }
    }
    
    @GetMapping("/defects")
    @Operation(summary = "Отримати рекомендовані модифікатори на основі дефектів", 
               description = "Повертає список рекомендованих модифікаторів цін на основі вказаних типів дефектів, категорії та матеріалу")
    public ResponseEntity<?> getRecommendedModifiersForDefects(
            @RequestParam Set<String> defects,
            @RequestParam(required = false) String categoryCode,
            @RequestParam(required = false) String materialType) {
        
        log.info("Запит на отримання рекомендованих модифікаторів для дефектів: {}, категорія: {}, матеріал: {}", 
                defects, categoryCode, materialType);
        
        try {
            List<ModifierRecommendationDTO> recommendations = 
                    recommendationService.getRecommendedModifiersForDefects(defects, categoryCode, materialType);
            
            return ApiResponseUtils.ok(recommendations, 
                    "Отримано {} рекомендованих модифікаторів для дефектів", recommendations.size());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні рекомендацій для дефектів", 
                    "Не вдалося отримати рекомендації модифікаторів для дефектів: {}. Причина: {}", 
                    defects, e.getMessage());
        }
    }
    
    @GetMapping("/risks")
    @Operation(summary = "Отримати попередження про ризики", 
               description = "Повертає список попереджень про ризики на основі вказаних плям, дефектів, матеріалу та категорії")
    public ResponseEntity<?> getRiskWarningsForItem(
            @RequestParam(required = false) Set<String> stains,
            @RequestParam(required = false) Set<String> defects,
            @RequestParam(required = false) String materialType,
            @RequestParam(required = false) String categoryCode) {
        
        log.info("Запит на отримання попереджень про ризики для плям: {}, дефектів: {}, матеріалу: {}, категорії: {}", 
                stains, defects, materialType, categoryCode);
        
        try {
            List<String> warnings = 
                    recommendationService.getRiskWarnings(stains, defects, materialType, categoryCode);
            
            return ApiResponseUtils.ok(warnings, 
                    "Отримано {} попереджень про ризики", warnings.size());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні попереджень про ризики", 
                    "Не вдалося отримати попередження про ризики. Причина: {}", e.getMessage());
        }
    }
} 