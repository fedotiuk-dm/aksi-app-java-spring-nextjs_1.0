package com.aksi.api;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.pricing.constants.PriceModifierConstants;
import com.aksi.domain.pricing.constants.PriceModifierConstants.ModifierType;
import com.aksi.domain.pricing.constants.PriceModifierConstants.PriceModifier;
import com.aksi.domain.pricing.dto.PriceCalculationRequestDTO;
import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;
import com.aksi.domain.pricing.service.PriceCalculationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Контролер для розрахунку цін з модифікаторами.
 */
@RestController
@RequestMapping("/price-calculation")
@Tag(name = "Price Calculator", description = "API для розрахунку цін з урахуванням різних модифікаторів")
@RequiredArgsConstructor
@Slf4j
public class PriceCalculationController {
    
    private final PriceCalculationService priceCalculationService;
    
    /**
     * Отримати усі доступні модифікатори ціни.
     * 
     * @return Список модифікаторів ціни
     */
    @GetMapping("/modifiers")
    @Operation(summary = "Отримати усі доступні модифікатори ціни")
    public ResponseEntity<List<ModifierDTO>> getAllModifiers() {
        log.info("REST запит на отримання всіх модифікаторів ціни");
        List<ModifierDTO> modifiers = PriceModifierConstants.getAllModifiers().stream()
                .map(this::mapModifierToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(modifiers);
    }
    
    /**
     * Отримати модифікатори ціни згруповані за типами.
     * 
     * @return Модифікатори ціни згруповані за типами
     */
    @GetMapping("/modifiers/grouped")
    @Operation(summary = "Отримати модифікатори ціни згруповані за типами")
    public ResponseEntity<Map<String, List<ModifierDTO>>> getModifiersGroupedByType() {
        log.info("REST запит на отримання модифікаторів ціни згрупованих за типами");
        Map<ModifierType, List<PriceModifier>> modifiersByType = PriceModifierConstants.groupModifiersByType();
        
        Map<String, List<ModifierDTO>> result = modifiersByType.entrySet().stream()
                .collect(Collectors.toMap(
                        entry -> entry.getKey().name(),
                        entry -> entry.getValue().stream()
                                .map(this::mapModifierToDTO)
                                .collect(Collectors.toList())
                ));
        
        return ResponseEntity.ok(result);
    }
    
    /**
     * Отримати модифікатори ціни для конкретної категорії.
     * 
     * @param categoryCode Код категорії
     * @return Список модифікаторів ціни для категорії
     */
    @GetMapping("/modifiers/category/{categoryCode}")
    @Operation(summary = "Отримати модифікатори ціни для конкретної категорії")
    public ResponseEntity<List<ModifierDTO>> getModifiersForCategory(
            @PathVariable String categoryCode) {
        log.info("REST запит на отримання модифікаторів ціни для категорії: {}", categoryCode);
        List<ModifierDTO> modifiers = PriceModifierConstants.getModifiersForCategory(categoryCode).stream()
                .map(this::mapModifierToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(modifiers);
    }
    
    /**
     * Отримати базову ціну для предмету з прайс-листа.
     * 
     * @param categoryCode Код категорії
     * @param itemName Найменування предмету
     * @return Базова ціна предмету
     */
    @GetMapping("/base-price")
    @Operation(summary = "Отримати базову ціну для предмету з прайс-листа")
    public ResponseEntity<PriceCalculationResponseDTO> getBasePrice(
            @RequestParam String categoryCode,
            @RequestParam String itemName) {
        log.info("REST запит на отримання базової ціни для категорії {} та предмету {}", categoryCode, itemName);
        PriceCalculationResponseDTO response = priceCalculationService.getBasePrice(categoryCode, itemName);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Розрахувати ціну з урахуванням вибраних модифікаторів.
     * 
     * @param request Запит на розрахунок ціни
     * @return Результат розрахунку ціни з деталізацією
     */
    @PostMapping("/calculate")
    @Operation(summary = "Розрахувати ціну з урахуванням вибраних модифікаторів")
    public ResponseEntity<PriceCalculationResponseDTO> calculatePrice(
            @Valid @RequestBody PriceCalculationRequestDTO request) {
        log.info("REST запит на розрахунок ціни для категорії {} та предмету {} з {} модифікаторами", 
                request.getCategoryCode(), request.getItemName(), 
                request.getModifierIds() != null ? request.getModifierIds().size() : 0);
        
        PriceCalculationResponseDTO response = priceCalculationService.calculatePrice(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Мапер для перетворення PriceModifier в ModifierDTO.
     * 
     * @param modifier Модифікатор ціни
     * @return DTO модифікатора ціни
     */
    private ModifierDTO mapModifierToDTO(PriceModifier modifier) {
        return ModifierDTO.builder()
                .id(modifier.getId())
                .name(modifier.getName())
                .description(modifier.getDescription())
                .changeDescription(modifier.getChangeDescription())
                .type(modifier.getType().name())
                .build();
    }
    
    /**
     * DTO для модифікатора ціни.
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ModifierDTO {
        private String id;
        private String name;
        private String description;
        private String changeDescription;
        private String type;
    }
}
