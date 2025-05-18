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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

/**
 * REST API для отримання рекомендацій модифікаторів
 */
@RestController
@RequestMapping("/modifier-recommendations")
@Tag(name = "Рекомендації модифікаторів", description = "API для отримання рекомендацій щодо застосування цінових модифікаторів")
@RequiredArgsConstructor
public class ModifierRecommendationController {

    private final ModifierRecommendationService recommendationService;
    
    @GetMapping("/stains")
    @Operation(summary = "Отримати рекомендовані модифікатори на основі плям", 
               description = "Повертає список рекомендованих модифікаторів цін на основі вказаних типів плям, категорії та матеріалу")
    public ResponseEntity<List<ModifierRecommendationDTO>> getRecommendationsForStains(
            @RequestParam Set<String> stains,
            @RequestParam(required = false) String categoryCode,
            @RequestParam(required = false) String materialType) {
        
        List<ModifierRecommendationDTO> recommendations = 
                recommendationService.getRecommendedModifiersForStains(stains, categoryCode, materialType);
        
        return ResponseEntity.ok(recommendations);
    }
    
    @GetMapping("/defects")
    @Operation(summary = "Отримати рекомендовані модифікатори на основі дефектів", 
               description = "Повертає список рекомендованих модифікаторів цін на основі вказаних типів дефектів, категорії та матеріалу")
    public ResponseEntity<List<ModifierRecommendationDTO>> getRecommendationsForDefects(
            @RequestParam Set<String> defects,
            @RequestParam(required = false) String categoryCode,
            @RequestParam(required = false) String materialType) {
        
        List<ModifierRecommendationDTO> recommendations = 
                recommendationService.getRecommendedModifiersForDefects(defects, categoryCode, materialType);
        
        return ResponseEntity.ok(recommendations);
    }
    
    @GetMapping("/risks")
    @Operation(summary = "Отримати попередження про ризики", 
               description = "Повертає список попереджень про ризики на основі вказаних плям, дефектів, матеріалу та категорії")
    public ResponseEntity<List<String>> getRiskWarnings(
            @RequestParam(required = false) Set<String> stains,
            @RequestParam(required = false) Set<String> defects,
            @RequestParam(required = false) String materialType,
            @RequestParam(required = false) String categoryCode) {
        
        List<String> warnings = 
                recommendationService.getRiskWarnings(stains, defects, materialType, categoryCode);
        
        return ResponseEntity.ok(warnings);
    }
} 