package com.aksi.api;

import java.lang.reflect.Field;
import java.math.BigDecimal;
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
import com.aksi.domain.pricing.constants.PriceModifierConstants.FixedPriceModifier;
import com.aksi.domain.pricing.constants.PriceModifierConstants.ModifierType;
import com.aksi.domain.pricing.constants.PriceModifierConstants.PercentageModifier;
import com.aksi.domain.pricing.constants.PriceModifierConstants.PriceModifier;
import com.aksi.domain.pricing.constants.PriceModifierConstants.RangePercentageModifier;
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
        ModifierDTO.ModifierDTOBuilder builder = ModifierDTO.builder()
                .id(modifier.getId())
                .name(modifier.getName())
                .description(modifier.getDescription())
                .changeDescription(modifier.getChangeDescription())
                .type(modifier.getType().name())
                .category(modifier.getType().name());
        
        // Визначаємо, чи це знижка на основі опису зміни
        String changeDesc = modifier.getChangeDescription();
        boolean isDiscount = changeDesc != null && changeDesc.startsWith("-");
        builder.discount(isDiscount);
        
        // Визначаємо тип модифікатора та встановлюємо відповідні поля
        if (modifier instanceof PercentageModifier) {
            // Простий відсотковий модифікатор
            builder.percentage(true);
            
            // Спроба отримати значення через рефлексію
            try {
                Field percentageModifierField = PercentageModifier.class.getDeclaredField("percentageModifier");
                percentageModifierField.setAccessible(true);
                
                BigDecimal percentageValue = (BigDecimal) percentageModifierField.get(modifier);
                builder.value(percentageValue != null ? Math.abs(percentageValue.doubleValue()) : 0.0);
            } catch (NoSuchFieldException | IllegalAccessException | ClassCastException | NullPointerException e) {
                log.warn("Не вдалося отримати значення відсотка через рефлексію: {}", e.getMessage());
                
                // Якщо не вдалося отримати через рефлексію, пробуємо парсити з опису зміни
                if (changeDesc != null) {
                    try {
                        String percentStr = changeDesc.replace("%", "").replace("+", "").replace("-", "").trim();
                        double value = Double.parseDouble(percentStr);
                        builder.value(value);
                    } catch (NumberFormatException ne) {
                        log.warn("Не вдалося розпарсити відсоткове значення модифікатора {}: {}", modifier.getId(), changeDesc);
                        builder.value(0.0);
                    }
                } else {
                    builder.value(0.0);
                }
            }
        } else if (modifier instanceof RangePercentageModifier) {
            // Модифікатор з діапазоном значень
            builder.percentage(true);
            
            // Спроба отримати значення через рефлексію
            try {
                Field minPercentageField = RangePercentageModifier.class.getDeclaredField("minPercentage");
                Field maxPercentageField = RangePercentageModifier.class.getDeclaredField("maxPercentage");
                
                minPercentageField.setAccessible(true);
                maxPercentageField.setAccessible(true);
                
                BigDecimal minPercentage = (BigDecimal) minPercentageField.get(modifier);
                BigDecimal maxPercentage = (BigDecimal) maxPercentageField.get(modifier);
                
                builder.minValue(minPercentage != null ? minPercentage.doubleValue() : 0.0);
                builder.maxValue(maxPercentage != null ? maxPercentage.doubleValue() : 0.0);
                builder.value(minPercentage != null ? minPercentage.doubleValue() : 0.0);
            } catch (NoSuchFieldException | IllegalAccessException | ClassCastException | NullPointerException e) {
                log.warn("Не вдалося отримати значення мінімального/максимального відсотка через рефлексію: {}", e.getMessage());
                
                // Якщо не вдалося отримати через рефлексію, пробуємо парсити з опису
                String description = modifier.getDescription();
                if (description != null && description.toLowerCase().contains("від") && description.toLowerCase().contains("до")) {
                    String[] parts = description.toLowerCase().split("від|до");
                    if (parts.length >= 3) {
                        try {
                            String minStr = parts[1].trim();
                            String maxStr = parts[2].trim();
                            
                            // Видаляємо все, крім чисел і крапки
                            minStr = minStr.replaceAll("[^0-9.]", "");
                            maxStr = maxStr.replaceAll("[^0-9.]", "");
                            
                            double min = Double.parseDouble(minStr);
                            double max = Double.parseDouble(maxStr);
                            
                            builder.minValue(min);
                            builder.maxValue(max);
                            builder.value(min); // За замовчуванням - мінімальне значення
                        } catch (NumberFormatException ne) {
                            log.warn("Не вдалося розпарсити діапазон для модифікатора {}: {}", modifier.getId(), ne.getMessage());
                            // Встановлюємо значення за замовчуванням
                            builder.minValue(0.0);
                            builder.maxValue(0.0);
                            builder.value(0.0);
                        }
                    } else {
                        // Недостатньо частин у розбивці
                        builder.minValue(0.0);
                        builder.maxValue(0.0);
                        builder.value(0.0);
                    }
                } else {
                    // Опис не містить "від" або "до"
                    builder.minValue(0.0);
                    builder.maxValue(0.0);
                    builder.value(0.0);
                }
            }
        } else if (modifier instanceof FixedPriceModifier) {
            // Фіксований ціновий модифікатор
            builder.percentage(false);
            
            // Спроба отримати значення через рефлексію
            try {
                Field fixedPriceField = FixedPriceModifier.class.getDeclaredField("fixedPrice");
                fixedPriceField.setAccessible(true);
                
                BigDecimal fixedPrice = (BigDecimal) fixedPriceField.get(modifier);
                builder.value(fixedPrice != null ? fixedPrice.doubleValue() : 0.0);
            } catch (NoSuchFieldException | IllegalAccessException | ClassCastException | NullPointerException e) {
                log.warn("Не вдалося отримати значення фіксованої ціни через рефлексію: {}", e.getMessage());
                
                // Якщо не вдалося отримати через рефлексію, пробуємо парсити з опису зміни
                if (changeDesc != null && changeDesc.contains("Фіксована ціна:")) {
                    try {
                        String priceStr = changeDesc.replace("Фіксована ціна:", "").replace("грн", "").trim();
                        double value = Double.parseDouble(priceStr);
                        builder.value(value);
                    } catch (NumberFormatException ne) {
                        log.warn("Не вдалося розпарсити фіксовану ціну для модифікатора {}: {}", modifier.getId(), ne.getMessage());
                        builder.value(0.0);
                    }
                } else {
                    // Якщо формат не відповідає очікуваному
                    builder.value(0.0);
                }
            }
        } else {
            // Невідомий тип модифікатора
            builder.percentage(false);
            builder.value(0.0);
        }
        
        return builder.build();
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
        private String category;
        
        @io.swagger.v3.oas.annotations.media.Schema(description = "Чи є модифікатор відсотковим", example = "true")
        private boolean percentage;
        
        @io.swagger.v3.oas.annotations.media.Schema(description = "Чи є модифікатор знижкою", example = "false")
        private boolean discount;
        
        @io.swagger.v3.oas.annotations.media.Schema(description = "Значення модифікатора (відсоток або фіксована вартість)", example = "20.0")
        private Double value;
        
        @io.swagger.v3.oas.annotations.media.Schema(description = "Мінімальне значення для модифікаторів з діапазоном", example = "20.0") 
        private Double minValue;
        
        @io.swagger.v3.oas.annotations.media.Schema(description = "Максимальне значення для модифікаторів з діапазоном", example = "100.0")
        private Double maxValue;
    }
}
