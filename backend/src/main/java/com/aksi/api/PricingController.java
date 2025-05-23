package com.aksi.api;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.pricing.dto.DefectTypeDTO;
import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;
import com.aksi.domain.pricing.dto.PriceListItemDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.dto.ServiceCategoryDTO;
import com.aksi.domain.pricing.dto.StainTypeDTO;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierCategory;
import com.aksi.domain.pricing.enums.RiskLevel;
import com.aksi.domain.pricing.service.CatalogPriceModifierService;
import com.aksi.domain.pricing.service.DefectTypeService;
import com.aksi.domain.pricing.service.PriceCalculationService;
import com.aksi.domain.pricing.service.PriceListDomainService;
import com.aksi.domain.pricing.service.ServiceCategoryService;
import com.aksi.domain.pricing.service.StainTypeService;
import com.aksi.domain.pricing.usecase.CalculatePriceUseCase;
import com.aksi.domain.pricing.usecase.GetBasePriceUseCase;
import com.aksi.domain.pricing.usecase.GetRecommendedModifiersUseCase;
import com.aksi.domain.pricing.usecase.GetRiskWarningsUseCase;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Unified REST API контролер для всіх pricing операцій.
 * <p>
 * Об'єднує функціональність розрахунку цін, управління прайс-листом,
 * модифікаторів, категорій послуг, типів дефектів та плям.
 * <p>
 * Всі винятки обробляються глобальним обробником {@link GlobalExceptionHandler}.
 */
@RestController
@RequestMapping("/pricing")
@Tag(name = "Pricing API",
     description = "Комплексне API для управління цінами та розрахунками в хімчистці")
@RequiredArgsConstructor
@Slf4j
@Validated
public class PricingController {

    // Use Cases - DDD approach
    private final CalculatePriceUseCase calculatePriceUseCase;
    private final GetBasePriceUseCase getBasePriceUseCase;
    private final GetRecommendedModifiersUseCase getRecommendedModifiersUseCase;
    private final GetRiskWarningsUseCase getRiskWarningsUseCase;

    // Legacy services - для підтримки існуючих методів
    private final PriceCalculationService priceCalculationService;
    private final CatalogPriceModifierService modifierService;
    private final PriceListDomainService priceListService;
    private final ServiceCategoryService serviceCategoryService;
    private final DefectTypeService defectTypeService;
    private final StainTypeService stainTypeService;

    // ====================================
    // CALCULATION ENDPOINTS
    // ====================================

    /**
     * Отримати базову ціну для предмету з прайс-листа.
     */
    @GetMapping("/calculation/base-price")
    @Operation(
        summary = "Отримати базову ціну для предмету",
        description = "Повертає базову ціну з прайс-листа для вказаної категорії та предмету",
        tags = {"Pricing - Calculation"}
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Успішно отримано базову ціну"),
        @ApiResponse(responseCode = "404", description = "Предмет не знайдено в прайс-листі"),
        @ApiResponse(responseCode = "400", description = "Некоректні параметри запиту")
    })
    public ResponseEntity<BigDecimal> getBasePrice(
            @Parameter(description = "Код категорії послуги",
                      example = "CLOTHING_CLEANING")
            @RequestParam @NotBlank String categoryCode,

            @Parameter(description = "Назва предмету з прайс-листа", example = "Піджак")
            @RequestParam @NotBlank String itemName,

            @Parameter(description = "Колір предмету", example = "чорний")
            @RequestParam(required = false) String color) {

        log.info("REST запит на отримання базової ціни для категорії {}, предмету {}, колір {}",
                categoryCode, itemName, color);

        BigDecimal basePrice = getBasePriceUseCase.execute(categoryCode, itemName, color);
        log.debug("Отримано базову ціну {} для категорії {}, предмету {}, колір {}",
                basePrice, categoryCode, itemName, color);

        return ResponseEntity.ok(basePrice);
    }

    /**
     * Розрахувати повну ціну з модифікаторами.
     */
    @PostMapping("/calculation/calculate")
    @Operation(
        summary = "Розрахувати ціну з урахуванням вибраних модифікаторів",
        description = "Детальний розрахунок ціни з урахуванням базової ціни, " +
                     "модифікаторів, знижок та терміновості",
        tags = {"Pricing - Calculation"}
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Успішний розрахунок ціни",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = PriceCalculationResponseDTO.class)
            )
        ),
        @ApiResponse(responseCode = "400", description = "Неправильні вхідні дані"),
        @ApiResponse(responseCode = "404",
                    description = "Не знайдено предмет або категорію в прайс-листі")
    })
    public ResponseEntity<PriceCalculationResponseDTO> calculatePrice(
            @Valid @RequestBody PriceCalculationRequestDTO request) {

        log.info("REST запит на розрахунок ціни: {}", request);

        // Конвертуємо DTO в UseCase запит
        CalculatePriceUseCase.PriceCalculationRequest useCaseRequest =
                new CalculatePriceUseCase.PriceCalculationRequest(
                        request.getCategoryCode(),
                        request.getItemName(),
                        request.getColor(),
                        request.getQuantity(),
                        request.getModifierCodes(),
                        request.getRangeModifierValues(),
                        request.getFixedModifierQuantities(),
                        request.isExpedited(),
                        request.getExpeditePercent(),
                        request.getDiscountPercent()
                );

        PriceCalculationResponseDTO response = calculatePriceUseCase.execute(useCaseRequest);
        log.debug("Успішно розраховано ціну {} для {} шт. '{}' з категорії '{}'",
                response.getFinalTotalPrice(), request.getQuantity(),
                request.getItemName(), request.getCategoryCode());

        return ResponseEntity.ok(response);
    }

    /**
     * Отримати рекомендовані модифікатори.
     */
    @GetMapping("/calculation/recommended-modifiers")
    @Operation(
        summary = "Отримати рекомендовані модифікатори на основі плям та дефектів",
        description = "Повертає список рекомендованих модифікаторів для предмета " +
                     "на основі його плям, дефектів, категорії та матеріалу",
        tags = {"Pricing - Calculation"}
    )
    public ResponseEntity<List<PriceModifierDTO>> getRecommendedModifiers(
            @RequestParam(required = false) Set<String> stains,
            @RequestParam(required = false) Set<String> defects,
            @RequestParam(required = false) String categoryCode,
            @RequestParam(required = false) String materialType) {

        log.info("REST запит на отримання рекомендованих модифікаторів для плям: {}, " +
                "дефектів: {}, категорії: {}, матеріалу: {}",
                stains, defects, categoryCode, materialType);

        GetRecommendedModifiersUseCase.RecommendationRequest useCaseRequest =
                new GetRecommendedModifiersUseCase.RecommendationRequest(
                        stains, defects, categoryCode, materialType);

        List<PriceModifierDTO> recommendedModifiers =
                getRecommendedModifiersUseCase.execute(useCaseRequest);
        log.debug("Отримано {} рекомендованих модифікаторів", recommendedModifiers.size());

        return ResponseEntity.ok(recommendedModifiers);
    }

    /**
     * Отримати попередження про ризики.
     */
    @GetMapping("/calculation/risk-warnings")
    @Operation(
        summary = "Отримати попередження про ризики",
        description = "Повертає список попереджень про ризики для предмета " +
                     "на основі його плям, дефектів, категорії та матеріалу",
        tags = {"Pricing - Calculation"}
    )
    public ResponseEntity<List<String>> getRiskWarnings(
            @RequestParam(required = false) Set<String> stains,
            @RequestParam(required = false) Set<String> defects,
            @RequestParam(required = false) String categoryCode,
            @RequestParam(required = false) String materialType) {

        log.info("REST запит на отримання попереджень про ризики для плям: {}, " +
                "дефектів: {}, категорії: {}, матеріалу: {}",
                stains, defects, categoryCode, materialType);

        GetRiskWarningsUseCase.RiskWarningRequest useCaseRequest =
                new GetRiskWarningsUseCase.RiskWarningRequest(
                        stains, defects, categoryCode, materialType);

        List<String> warnings = getRiskWarningsUseCase.execute(useCaseRequest);
        log.debug("Отримано {} попереджень про ризики", warnings.size());

        return ResponseEntity.ok(warnings);
    }

    // ====================================
    // CATEGORIES ENDPOINTS
    // ====================================

    /**
     * Отримати всі категорії послуг.
     */
    @GetMapping("/categories")
    @Operation(
        summary = "Отримати всі категорії послуг",
        description = "Повертає список всіх категорій послуг прайс-листа",
        tags = {"Pricing - Categories"}
    )
    public ResponseEntity<List<ServiceCategoryDTO>> getAllCategories() {
        log.info("Запит на отримання всіх категорій послуг");

        List<ServiceCategoryDTO> categories = priceListService.getAllCategories();
        log.debug("Отримано {} категорій послуг", categories.size());

        return ResponseEntity.ok(categories);
    }

    /**
     * Отримати активні категорії послуг.
     */
    @GetMapping("/categories/active")
    @Operation(
        summary = "Отримати активні категорії послуг",
        description = "Повертає список тільки активних категорій послуг",
        tags = {"Pricing - Categories"}
    )
    public ResponseEntity<List<ServiceCategoryDTO>> getActiveCategories() {
        log.info("Запит на отримання активних категорій послуг");

        List<ServiceCategoryDTO> categories = serviceCategoryService.getAllActiveCategories();
        log.debug("Отримано {} активних категорій послуг", categories.size());

        return ResponseEntity.ok(categories);
    }

    /**
     * Отримати категорію за ID.
     */
    @GetMapping("/categories/{id}")
    @Operation(
        summary = "Отримати категорію послуг за ID",
        description = "Повертає категорію послуг за вказаним ідентифікатором",
        tags = {"Pricing - Categories"}
    )
    public ResponseEntity<ServiceCategoryDTO> getCategoryById(@PathVariable UUID id) {
        log.info("Запит на отримання категорії послуг за ID: {}", id);

        ServiceCategoryDTO category = priceListService.getCategoryById(id);
        log.debug("Отримано категорію послуг: {}", category.getName());

        return ResponseEntity.ok(category);
    }

    /**
     * Отримати категорію за кодом.
     */
    @GetMapping("/categories/code/{code}")
    @Operation(
        summary = "Отримати категорію послуг за кодом",
        description = "Повертає категорію послуг за вказаним кодом",
        tags = {"Pricing - Categories"}
    )
    public ResponseEntity<ServiceCategoryDTO> getCategoryByCode(@PathVariable String code) {
        log.info("Запит на отримання категорії послуг за кодом: {}", code);

        ServiceCategoryDTO category = priceListService.getCategoryByCode(code);
        log.debug("Отримано категорію послуг: {}", category.getName());

        return ResponseEntity.ok(category);
    }

    // ====================================
    // PRICE LIST ENDPOINTS
    // ====================================

    /**
     * Отримати елементи прайс-листа за категорією.
     */
    @GetMapping("/price-list/category/{categoryCode}/items")
    @Operation(
        summary = "Отримати всі елементи прайс-листа за кодом категорії",
        description = "Повертає список елементів прайс-листа для вказаної категорії",
        tags = {"Pricing - Price List"}
    )
    public ResponseEntity<List<PriceListItemDTO>> getItemsByCategoryCode(
            @PathVariable String categoryCode) {
        log.info("Запит на отримання елементів прайс-листа за кодом категорії: {}",
                categoryCode);

        List<PriceListItemDTO> items = priceListService.getItemsByCategoryCode(categoryCode);
        log.debug("Отримано {} елементів прайс-листа для категорії з кодом: {}",
                items.size(), categoryCode);

        return ResponseEntity.ok(items);
    }

    /**
     * Отримати елемент прайс-листа за ID.
     */
    @GetMapping("/price-list/item/{itemId}")
    @Operation(
        summary = "Отримати елемент прайс-листа за ID",
        description = "Повертає елемент прайс-листа за вказаним ідентифікатором",
        tags = {"Pricing - Price List"}
    )
    public ResponseEntity<PriceListItemDTO> getItemById(@PathVariable UUID itemId) {
        log.info("Запит на отримання елемента прайс-листа за ID: {}", itemId);

        PriceListItemDTO item = priceListService.getItemById(itemId);
        log.debug("Отримано елемент прайс-листа: {}", item.getName());

        return ResponseEntity.ok(item);
    }

    // ====================================
    // MODIFIERS ENDPOINTS
    // ====================================

    /**
     * Отримати доступні модифікатори для категорії.
     */
    @GetMapping("/modifiers/available")
    @Operation(
        summary = "Отримати доступні модифікатори для категорії",
        description = "Повертає список кодів доступних модифікаторів для вказаної категорії",
        tags = {"Pricing - Modifiers"}
    )
    public ResponseEntity<List<String>> getAvailableModifiersForCategory(
            @RequestParam String categoryCode) {
        log.info("REST запит на отримання доступних модифікаторів для категорії {}",
                categoryCode);

        List<String> modifierCodes =
                priceCalculationService.getAvailableModifiersForCategory(categoryCode);
        log.debug("Отримано {} доступних модифікаторів для категорії {}",
                modifierCodes.size(), categoryCode);

        return ResponseEntity.ok(modifierCodes);
    }

    /**
     * Отримати модифікатори за категорією послуг.
     */
    @GetMapping("/modifiers/service-category/{categoryCode}")
    @Operation(
        summary = "Отримати модифікатори для категорії послуг",
        description = "Повертає повні дані про модифікатори для вказаної категорії послуг",
        tags = {"Pricing - Modifiers"}
    )
    public ResponseEntity<List<PriceModifierDTO>> getModifiersForServiceCategory(
            @PathVariable String categoryCode) {
        log.info("REST запит на отримання модифікаторів для категорії послуг {}",
                categoryCode);

        List<PriceModifierDTO> modifiers =
                modifierService.getModifiersForServiceCategory(categoryCode);
        log.debug("Отримано {} модифікаторів для категорії послуг {}",
                modifiers.size(), categoryCode);

        return ResponseEntity.ok(modifiers);
    }

    /**
     * Отримати модифікатори за типом.
     */
    @GetMapping("/modifiers/category/{category}")
    @Operation(
        summary = "Отримати модифікатори за типом",
        description = "Повертає модифікатори за типом (загальні, текстильні, шкіряні)",
        tags = {"Pricing - Modifiers"}
    )
    public ResponseEntity<List<PriceModifierDTO>> getModifiersByCategory(
            @PathVariable ModifierCategory category) {
        log.info("REST запит на отримання модифікаторів за типом {}", category);

        List<PriceModifierDTO> modifiers = modifierService.getModifiersByCategory(category);
        log.debug("Отримано {} модифікаторів за типом {}", modifiers.size(), category);

        return ResponseEntity.ok(modifiers);
    }

    /**
     * Отримати модифікатор за кодом.
     */
    @GetMapping("/modifiers/code/{code}")
    @Operation(
        summary = "Отримати детальну інформацію про модифікатор",
        description = "Повертає повну інформацію про модифікатор за його кодом",
        tags = {"Pricing - Modifiers"}
    )
    public ResponseEntity<PriceModifierDTO> getModifierByCode(@PathVariable String code) {
        log.info("REST запит на отримання інформації про модифікатор {}", code);

        PriceModifierDTO modifier = modifierService.getModifierByCode(code);
        log.debug("Отримано інформацію про модифікатор {}", code);

        return ResponseEntity.ok(modifier);
    }

    /**
     * Пошук модифікаторів з фільтрацією та пагінацією.
     */
    @GetMapping("/modifiers/search")
    @Operation(
        summary = "Пошук модифікаторів з фільтрацією",
        description = "Повертає список модифікаторів з можливістю фільтрації за назвою, " +
                     "категорією, типом та активністю з пагінацією",
        tags = {"Pricing - Modifiers"}
    )
    public ResponseEntity<List<PriceModifierDTO>> searchModifiers(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) ModifierCategory category,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection) {

        log.info("REST запит на пошук модифікаторів: query={}, category={}, " +
                "active={}, page={}, size={}", query, category, active, page, size);

        // Тут буде логіка пошуку з пагінацією
        // Поки що повертаємо всі модифікатори
        List<PriceModifierDTO> allModifiers = modifierService.getModifiersByCategory(category);

        // Фільтрація за активністю
        if (active != null) {
            allModifiers = allModifiers.stream()
                .filter(m -> m.isActive() == active)
                .collect(Collectors.toList());
        }

        // Пошук за назвою
        if (query != null && !query.trim().isEmpty()) {
            String lowerQuery = query.toLowerCase();
            allModifiers = allModifiers.stream()
                .filter(m -> m.getName().toLowerCase().contains(lowerQuery) ||
                           m.getDescription().toLowerCase().contains(lowerQuery))
                .collect(Collectors.toList());
        }

        log.debug("Знайдено {} модифікаторів", allModifiers.size());
        return ResponseEntity.ok(allModifiers);
    }

    // ====================================
    // ISSUES ENDPOINTS (Defects & Stains)
    // ====================================

    /**
     * Отримати всі типи дефектів.
     */
    @GetMapping("/issues/defects")
    @Operation(
        summary = "Отримати типи дефектів",
        description = "Повертає список всіх або тільки активних типів дефектів " +
                     "з можливістю фільтрації за рівнем ризику",
        tags = {"Pricing - Issues"}
    )
    public ResponseEntity<List<DefectTypeDTO>> getDefectTypes(
            @RequestParam(name = "activeOnly", defaultValue = "true") boolean activeOnly,
            @RequestParam(name = "riskLevel", required = false) RiskLevel riskLevel) {

        log.info("REST запит на отримання типів дефектів: activeOnly={}, riskLevel={}",
                activeOnly, riskLevel);

        List<DefectTypeDTO> defectTypes;

        if (riskLevel != null) {
            defectTypes = defectTypeService.getDefectTypesByRiskLevel(riskLevel);
            log.debug("Отримано типи дефектів з рівнем ризику: {}", riskLevel);
        } else if (activeOnly) {
            defectTypes = defectTypeService.getActiveDefectTypes();
            log.debug("Отримано активні типи дефектів");
        } else {
            defectTypes = defectTypeService.getAllDefectTypes();
            log.debug("Отримано всі типи дефектів");
        }

        log.debug("Загалом отримано {} типів дефектів", defectTypes.size());
        return ResponseEntity.ok(defectTypes);
    }

    /**
     * Отримати тип дефекту за кодом.
     *
     * @throws IllegalArgumentException якщо тип дефекту не знайдено
     */
    @GetMapping("/issues/defects/code/{code}")
    @Operation(
        summary = "Отримати тип дефекту за кодом",
        description = "Повертає тип дефекту за вказаним кодом",
        tags = {"Pricing - Issues"}
    )
    public ResponseEntity<DefectTypeDTO> getDefectTypeByCode(@PathVariable String code) {
        log.info("REST запит на отримання типу дефекту за кодом: {}", code);

        DefectTypeDTO defectType = defectTypeService.getDefectTypeByCode(code);
        if (defectType == null) {
            throw new IllegalArgumentException("Тип дефекту з кодом: " + code + " не знайдено");
        }

        log.debug("Отримано тип дефекту за кодом: {}", code);
        return ResponseEntity.ok(defectType);
    }

    /**
     * Отримати всі типи плям.
     */
    @GetMapping("/issues/stains")
    @Operation(
        summary = "Отримати типи плям",
        description = "Повертає список всіх або тільки активних типів плям " +
                     "з можливістю фільтрації за рівнем ризику",
        tags = {"Pricing - Issues"}
    )
    public ResponseEntity<List<StainTypeDTO>> getStainTypes(
            @RequestParam(name = "activeOnly", defaultValue = "true") boolean activeOnly,
            @RequestParam(name = "riskLevel", required = false) RiskLevel riskLevel) {

        log.info("REST запит на отримання типів плям: activeOnly={}, riskLevel={}",
                activeOnly, riskLevel);

        List<StainTypeDTO> stainTypes;

        if (riskLevel != null) {
            stainTypes = stainTypeService.getStainTypesByRiskLevel(riskLevel);
            log.debug("Отримано типи плям з рівнем ризику: {}", riskLevel);
        } else if (activeOnly) {
            stainTypes = stainTypeService.getActiveStainTypes();
            log.debug("Отримано активні типи плям");
        } else {
            stainTypes = stainTypeService.getAllStainTypes();
            log.debug("Отримано всі типи плям");
        }

        log.debug("Загалом отримано {} типів плям", stainTypes.size());
        return ResponseEntity.ok(stainTypes);
    }

    /**
     * Отримати тип плями за кодом.
     *
     * @throws IllegalArgumentException якщо тип плями не знайдено
     */
    @GetMapping("/issues/stains/code/{code}")
    @Operation(
        summary = "Отримати тип плями за кодом",
        description = "Повертає тип плями за вказаним кодом",
        tags = {"Pricing - Issues"}
    )
    public ResponseEntity<StainTypeDTO> getStainTypeByCode(@PathVariable String code) {
        log.info("REST запит на отримання типу плями за кодом: {}", code);

        StainTypeDTO stainType = stainTypeService.getStainTypeByCode(code);
        if (stainType == null) {
            throw new IllegalArgumentException("Тип плями з кодом: " + code + " не знайдено");
        }

        log.debug("Отримано тип плями за кодом: {}", code);
        return ResponseEntity.ok(stainType);
    }

    // ====================================
    // ORDER WIZARD SUPPORT ENDPOINTS
    // ====================================

    /**
     * Отримати доступні матеріали для категорії.
     */
    @GetMapping("/categories/{categoryCode}/materials")
    @Operation(
        summary = "Отримати доступні матеріали для категорії",
        description = "Повертає список матеріалів, які доступні для вибраної категорії послуг",
        tags = {"Pricing - Order Wizard Support"}
    )
    public ResponseEntity<List<String>> getMaterialsForCategory(
            @PathVariable String categoryCode) {
        log.info("REST запит на отримання матеріалів для категорії {}", categoryCode);

        // Статичний список материалів залежно від категорії
        List<String> materials = getMaterialsByCategory(categoryCode);
        log.debug("Отримано {} матеріалів для категорії {}", materials.size(), categoryCode);

        return ResponseEntity.ok(materials);
    }

    // ====================================
    // HELPER METHODS
    // ====================================

    private List<String> getMaterialsByCategory(String categoryCode) {
        return switch (categoryCode.toUpperCase()) {
            case "CLOTHING_CLEANING", "LAUNDRY", "IRONING" ->
                Arrays.asList("Бавовна", "Шерсть", "Шовк", "Синтетика", "Льон", "Віскоза");
            case "LEATHER_CLEANING" ->
                Arrays.asList("Гладка шкіра", "Нубук", "Спілок", "Замша", "Лакована шкіра");
            case "FUR_PRODUCTS" ->
                Arrays.asList("Натуральне хутро", "Штучне хутро", "Комбінований");
            case "SHEEPSKIN_PRODUCTS" ->
                Arrays.asList("Натуральна дублянка", "Штучна дублянка");
            case "TEXTILE_DYEING" ->
                Arrays.asList("Бавовна", "Шерсть", "Шовк", "Синтетика");
            default ->
                Arrays.asList("Бавовна", "Шерсть", "Шовк", "Синтетика", "Шкіра");
        };
    }

    // ====================================
    // DTO CLASSES
    // ====================================

    /**
     * DTO для запиту розрахунку ціни.
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    @Schema(description = "Запит на розрахунок ціни для предмета")
    public static class PriceCalculationRequestDTO {

        @Schema(
            description = "Код категорії послуги",
            example = "CLOTHING_CLEANING",
            required = true,
            pattern = "^[A-Z_]+$"
        )
        @NotBlank(message = "Код категорії обов'язковий")
        private String categoryCode;

        @Schema(
            description = "Найменування предмету з прайс-листа",
            example = "Піджак",
            required = true,
            minLength = 1,
            maxLength = 255
        )
        @NotBlank(message = "Назва предмету обов'язкова")
        private String itemName;

        @Schema(
            description = "Колір предмету",
            example = "чорний",
            maxLength = 100
        )
        private String color;

        @Schema(
            description = "Кількість предметів",
            example = "1",
            required = true,
            minimum = "1",
            maximum = "1000"
        )
        @Min(value = 1, message = "Кількість повинна бути більше 0")
        @Max(value = 1000, message = "Кількість не може перевищувати 1000")
        private int quantity;

        @Schema(
            description = "Список кодів модифікаторів для застосування",
            example = "[\"manual_cleaning\", \"kids_items\"]"
        )
        private List<String> modifierCodes;

        @Schema(description = "Значення для модифікаторів з діапазоном " +
                             "(наприклад, розмір плями)")
        private List<PriceCalculationService.RangeModifierValue> rangeModifierValues;

        @Schema(description = "Кількості для фіксованих модифікаторів " +
                             "(наприклад, кількість ґудзиків)")
        private List<PriceCalculationService.FixedModifierQuantity> fixedModifierQuantities;

        @Schema(description = "Чи термінове замовлення", example = "false")
        private boolean expedited;

        @Schema(
            description = "Відсоток надбавки за терміновість",
            example = "50.0",
            minimum = "0",
            maximum = "200"
        )
        @DecimalMin(value = "0.0", message = "Відсоток терміновості не може бути від'ємним")
        @DecimalMax(value = "200.0",
                   message = "Відсоток терміновості не може перевищувати 200%")
        private BigDecimal expeditePercent;

        @Schema(
            description = "Відсоток знижки",
            example = "10.0",
            minimum = "0",
            maximum = "50"
        )
        @DecimalMin(value = "0.0", message = "Відсоток знижки не може бути від'ємним")
        @DecimalMax(value = "50.0", message = "Відсоток знижки не може перевищувати 50%")
        private BigDecimal discountPercent;
    }
}
