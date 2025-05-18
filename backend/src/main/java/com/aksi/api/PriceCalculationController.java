package com.aksi.api;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.entity.PriceModifierEntity.ModifierCategory;
import com.aksi.domain.pricing.service.PriceCalculationService;
import com.aksi.domain.pricing.service.PriceCalculationService.FixedModifierQuantity;
import com.aksi.domain.pricing.service.PriceCalculationService.RangeModifierValue;
import com.aksi.domain.pricing.service.PriceModifierService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Контролер для розрахунку цін з модифікаторами.
 */
@RestController
@RequestMapping("/price-calculation")
@Tag(name = "Price Calculation", description = "API для розрахунку цін з використанням модифікаторів з БД")
@RequiredArgsConstructor
@Slf4j
public class PriceCalculationController {
    
    private final PriceCalculationService priceCalculationService;
    private final PriceModifierService priceModifierService;
    
    /**
     * Отримати базову ціну для предмету з прайс-листа.
     * 
     * @param categoryCode Код категорії
     * @param itemName Найменування предмету
     * @param color Колір предмету
     * @return Базова ціна предмету
     */
    @GetMapping("/base-price")
    @Operation(summary = "Отримати базову ціну для предмету з прайс-листа")
    public ResponseEntity<BigDecimal> getBasePrice(
            @RequestParam String categoryCode,
            @RequestParam String itemName,
            @RequestParam(required = false) String color) {
        log.info("REST запит на отримання базової ціни для категорії {}, предмету {}, колір {}", 
                categoryCode, itemName, color);
        BigDecimal basePrice = priceCalculationService.getBasePrice(categoryCode, itemName, color);
        return ResponseEntity.ok(basePrice);
    }
    
    /**
     * Отримати доступні модифікатори для категорії.
     * 
     * @param categoryCode Код категорії
     * @return Список кодів доступних модифікаторів
     */
    @GetMapping("/available-modifiers")
    @Operation(summary = "Отримати доступні модифікатори для категорії")
    public ResponseEntity<List<String>> getAvailableModifiersForCategory(
            @RequestParam String categoryCode) {
        log.info("REST запит на отримання доступних модифікаторів для категорії {}", categoryCode);
        List<String> modifierCodes = priceCalculationService.getAvailableModifiersForCategory(categoryCode);
        return ResponseEntity.ok(modifierCodes);
    }
    
    /**
     * Отримати всі модифікатори для конкретної категорії послуг.
     * 
     * @param categoryCode Код категорії
     * @return Список модифікаторів
     */
    @GetMapping("/modifiers/by-category/{categoryCode}")
    @Operation(summary = "Отримати всі модифікатори для конкретної категорії послуг",
              description = "Повертає повні дані про модифікатори для вказаної категорії послуг")
    public ResponseEntity<List<PriceModifierDTO>> getModifiersForServiceCategory(
            @PathVariable String categoryCode) {
        log.info("REST запит на отримання модифікаторів для категорії послуг {}", categoryCode);
        List<PriceModifierDTO> modifiers = priceModifierService.getModifiersForServiceCategory(categoryCode);
        return ResponseEntity.ok(modifiers);
    }
    
    /**
     * Отримати модифікатори за типом (загальні, текстильні, шкіряні).
     * 
     * @param category Тип модифікатора (GENERAL, TEXTILE, LEATHER)
     * @return Список модифікаторів
     */
    @GetMapping("/modifiers/by-type/{category}")
    @Operation(summary = "Отримати модифікатори за типом",
               description = "Повертає модифікатори за типом (загальні, текстильні, шкіряні)")
    public ResponseEntity<List<PriceModifierDTO>> getModifiersByCategory(
            @PathVariable ModifierCategory category) {
        log.info("REST запит на отримання модифікаторів за типом {}", category);
        List<PriceModifierDTO> modifiers = priceModifierService.getModifiersByCategory(category);
        return ResponseEntity.ok(modifiers);
    }
    
    /**
     * Отримати детальну інформацію про модифікатор за кодом.
     * 
     * @param code Код модифікатора
     * @return Інформація про модифікатор
     */
    @GetMapping("/modifiers/{code}")
    @Operation(summary = "Отримати детальну інформацію про модифікатор",
               description = "Повертає повну інформацію про модифікатор за його кодом")
    public ResponseEntity<PriceModifierDTO> getModifierByCode(
            @PathVariable String code) {
        log.info("REST запит на отримання інформації про модифікатор {}", code);
        PriceModifierDTO modifier = priceModifierService.getModifierByCode(code);
        return ResponseEntity.ok(modifier);
    }
    
    /**
     * Отримати інформацію про кілька модифікаторів за їх кодами.
     * 
     * @param codes Список кодів модифікаторів
     * @return Список модифікаторів
     */
    @PostMapping("/modifiers/batch")
    @Operation(summary = "Отримати інформацію про кілька модифікаторів",
               description = "Повертає інформацію про модифікатори за списком їх кодів")
    public ResponseEntity<List<PriceModifierDTO>> getModifiersByCodes(
            @RequestBody List<String> codes) {
        log.info("REST запит на отримання інформації про модифікатори: {}", codes);
        List<PriceModifierDTO> modifiers = priceModifierService.getModifiersByCodes(codes);
        return ResponseEntity.ok(modifiers);
    }
    
    /**
     * Розрахувати ціну з урахуванням вибраних модифікаторів.
     */
    @PostMapping("/calculate")
    @Operation(
        summary = "Розрахувати ціну з урахуванням вибраних модифікаторів",
        description = "Детальний розрахунок ціни з урахуванням базової ціни, модифікаторів, знижок та терміновості",
        responses = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200", 
                description = "Успішний розрахунок ціни", 
                content = @io.swagger.v3.oas.annotations.media.Content(
                    mediaType = "application/json",
                    schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = PriceCalculationResponseDTO.class)
                )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "400", 
                description = "Неправильні вхідні дані"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "404", 
                description = "Не знайдено предмет або категорію в прайс-листі"
            )
        }
    )
    public ResponseEntity<PriceCalculationResponseDTO> calculatePrice(
            @RequestBody PriceCalculationRequestDTO request) {
        log.info("REST запит на розрахунок ціни для категорії {} та предмету {} з {} модифікаторами", 
                request.getCategoryCode(), request.getItemName(), 
                request.getModifierCodes() != null ? request.getModifierCodes().size() : 0);
        
        PriceCalculationResponseDTO response = priceCalculationService.calculatePrice(
                request.getCategoryCode(),
                request.getItemName(),
                request.getQuantity(),
                request.getColor(),
                request.getModifierCodes(),
                request.getRangeModifierValues(),
                request.getFixedModifierQuantities(),
                request.isExpedited(),
                request.getExpeditePercent(),
                request.getDiscountPercent()
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * DTO для запиту на розрахунок ціни.
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    @io.swagger.v3.oas.annotations.media.Schema(description = "Запит на розрахунок ціни для предмета")
    public static class PriceCalculationRequestDTO {
        /**
         * Код категорії послуги.
         */
        @io.swagger.v3.oas.annotations.media.Schema(description = "Код категорії послуги", example = "CLOTHING", required = true)
        private String categoryCode;
        
        /**
         * Найменування предмету з прайс-листа.
         */
        @io.swagger.v3.oas.annotations.media.Schema(description = "Найменування предмету з прайс-листа", example = "Піджак", required = true)
        private String itemName;
        
        /**
         * Колір предмету.
         */
        @io.swagger.v3.oas.annotations.media.Schema(description = "Колір предмету", example = "чорний")
        private String color;
        
        /**
         * Кількість предметів.
         */
        @io.swagger.v3.oas.annotations.media.Schema(description = "Кількість предметів", example = "1", required = true)
        private int quantity;
        
        /**
         * Список кодів модифікаторів.
         */
        @io.swagger.v3.oas.annotations.media.Schema(description = "Список кодів модифікаторів", example = "[\"manual_cleaning\", \"kids_items\"]")
        private List<String> modifierCodes;
        
        /**
         * Значення для модифікаторів з діапазоном.
         */
        @io.swagger.v3.oas.annotations.media.Schema(description = "Значення для модифікаторів з діапазоном", example = "[{\"modifierCode\": \"dirt_level\", \"value\": 30.0}]")
        private List<RangeModifierValue> rangeModifierValues;
        
        /**
         * Кількості для фіксованих модифікаторів.
         */
        @io.swagger.v3.oas.annotations.media.Schema(description = "Кількості для фіксованих модифікаторів", example = "[{\"modifierCode\": \"buttons\", \"quantity\": 5}]")
        private List<FixedModifierQuantity> fixedModifierQuantities;
        
        /**
         * Чи термінове замовлення.
         */
        @io.swagger.v3.oas.annotations.media.Schema(description = "Чи термінове замовлення", example = "false")
        private boolean expedited;
        
        /**
         * Відсоток надбавки за терміновість.
         */
        @io.swagger.v3.oas.annotations.media.Schema(description = "Відсоток надбавки за терміновість", example = "50.0")
        private BigDecimal expeditePercent;
        
        /**
         * Відсоток знижки.
         */
        @io.swagger.v3.oas.annotations.media.Schema(description = "Відсоток знижки", example = "10.0")
        private BigDecimal discountPercent;
    }
    
    @GetMapping("/recommended-modifiers")
    @Operation(summary = "Отримати рекомендовані модифікатори на основі плям та дефектів", 
               description = "Повертає список рекомендованих модифікаторів для предмета на основі його плям, дефектів, категорії та матеріалу")
    public ResponseEntity<List<PriceModifierDTO>> getRecommendedModifiers(
            @RequestParam(required = false) Set<String> stains,
            @RequestParam(required = false) Set<String> defects,
            @RequestParam(required = false) String categoryCode,
            @RequestParam(required = false) String materialType) {
        
        List<PriceModifierDTO> recommendedModifiers = 
                priceCalculationService.getRecommendedModifiersForItem(stains, defects, categoryCode, materialType);
        
        return ResponseEntity.ok(recommendedModifiers);
    }
    
    @GetMapping("/risk-warnings")
    @Operation(summary = "Отримати попередження про ризики", 
               description = "Повертає список попереджень про ризики для предмета на основі його плям, дефектів, категорії та матеріалу")
    public ResponseEntity<List<String>> getRiskWarnings(
            @RequestParam(required = false) Set<String> stains,
            @RequestParam(required = false) Set<String> defects,
            @RequestParam(required = false) String categoryCode,
            @RequestParam(required = false) String materialType) {
        
        List<String> warnings = 
                priceCalculationService.getRiskWarningsForItem(stains, defects, materialType, categoryCode);
        
        return ResponseEntity.ok(warnings);
    }
} 