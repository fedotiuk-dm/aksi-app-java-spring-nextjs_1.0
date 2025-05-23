package com.aksi.api;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.service.ItemCharacteristicsService;
import static com.aksi.domain.pricing.constants.ApiConstants.Autocomplete.COLORS;
import static com.aksi.domain.pricing.constants.ApiConstants.Autocomplete.MATERIALS;
import static com.aksi.domain.pricing.constants.ApiConstants.AutocompleteLimits.MAX_LIMIT;
import com.aksi.domain.pricing.constants.PricingConstants.CategoryLabels;
import com.aksi.domain.pricing.constants.PricingConstants.ClothingSizes;
import com.aksi.domain.pricing.constants.PricingConstants.CommonColors;
import com.aksi.domain.pricing.constants.PricingConstants.CommonMaterials;
import com.aksi.domain.pricing.constants.PricingConstants.ItemCategories;
import com.aksi.domain.pricing.constants.PricingConstants.ItemConditions;
import com.aksi.domain.pricing.constants.PricingConstants.ModifierTypeLabels;
import com.aksi.domain.pricing.constants.PricingConstants.ModifierTypes;
import com.aksi.domain.pricing.constants.UnitOfMeasureConstants;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST контролер для роботи з довідковими даними системи.
 * Надає доступ до статичних констант та динамічних довідників.
 *
 * Цей контролер є єдиним джерелом для всіх довідкових даних системи,
 * консолідуючи функціональність з раніше видалених контролерів.
 */
@RestController
@RequestMapping("/api/reference")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Reference Data", description = "Консолідований API для отримання всіх довідкових даних")
public class ReferenceDataController {

    private final ItemCharacteristicsService itemCharacteristicsService;

    @Operation(
        summary = "Отримати список кольорів предметів",
        description = "Повертає список доступних кольорів з константи CommonColors"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Список кольорів успішно отримано"),
        @ApiResponse(responseCode = "500", description = "Внутрішня помилка сервера")
    })
    @GetMapping("/colors")
    public ResponseEntity<Map<String, String>> getColors() {
        log.debug("Запит на отримання списку кольорів");

        try {
            Map<String, String> colors = Map.of(
                "black", CommonColors.BLACK,
                "white", CommonColors.WHITE,
                "blue", CommonColors.BLUE,
                "red", CommonColors.RED,
                "green", CommonColors.GREEN,
                "yellow", CommonColors.YELLOW,
                "brown", CommonColors.BROWN,
                "gray", CommonColors.GRAY,
                "pink", CommonColors.PINK,
                "purple", CommonColors.PURPLE
            );

            return ResponseEntity.ok(colors);
        } catch (Exception e) {
            log.error("Помилка при отриманні кольорів: {}", e.getMessage(), e);
            return ResponseEntity.ok(Map.of());
        }
    }

    @Operation(
        summary = "Отримати список матеріалів предметів",
        description = "Повертає список доступних матеріалів з константи CommonMaterials"
    )
    @GetMapping("/materials")
    public ResponseEntity<Map<String, String>> getMaterials() {
        log.debug("Запит на отримання списку матеріалів");

        try {
            Map<String, String> materials = Map.of(
                "cotton", CommonMaterials.COTTON,
                "wool", CommonMaterials.WOOL,
                "silk", CommonMaterials.SILK,
                "polyester", CommonMaterials.POLYESTER,
                "leather", CommonMaterials.LEATHER,
                "suede", CommonMaterials.SUEDE,
                "denim", CommonMaterials.DENIM,
                "linen", CommonMaterials.LINEN,
                "cashmere", CommonMaterials.CASHMERE,
                "velvet", CommonMaterials.VELVET
            );

            return ResponseEntity.ok(materials);
        } catch (Exception e) {
            log.error("Помилка при отриманні матеріалів: {}", e.getMessage(), e);
            return ResponseEntity.ok(Map.of());
        }
    }

    @Operation(
        summary = "Отримати список категорій предметів",
        description = "Повертає список категорій з кодами та локалізованими назвами"
    )
    @GetMapping("/categories")
    public ResponseEntity<Map<String, String>> getCategories() {
        log.debug("Запит на отримання списку категорій");

        try {
            Map<String, String> categories = Map.of(
                ItemCategories.CLOTHING, CategoryLabels.CLOTHING,
                ItemCategories.LAUNDRY, CategoryLabels.LAUNDRY,
                ItemCategories.IRONING, CategoryLabels.IRONING,
                ItemCategories.LEATHER, CategoryLabels.LEATHER,
                ItemCategories.PADDING, CategoryLabels.PADDING,
                ItemCategories.FUR, CategoryLabels.FUR,
                ItemCategories.DYEING, CategoryLabels.DYEING,
                ItemCategories.ADDITIONAL_SERVICES, CategoryLabels.ADDITIONAL_SERVICES
            );

            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Помилка при отриманні категорій: {}", e.getMessage(), e);
            return ResponseEntity.ok(Map.of());
        }
    }

    @Operation(
        summary = "Отримати список типів модифікаторів цін",
        description = "Повертає список типів модифікаторів з кодами та локалізованими назвами"
    )
    @GetMapping("/modifier-types")
    public ResponseEntity<Map<String, String>> getModifierTypes() {
        log.debug("Запит на отримання списку типів модифікаторів");

        try {
            Map<String, String> modifierTypes = Map.of(
                ModifierTypes.EXPEDITE, ModifierTypeLabels.EXPEDITE,
                ModifierTypes.MATERIAL_SURCHARGE, ModifierTypeLabels.MATERIAL_SURCHARGE,
                ModifierTypes.SIZE_MODIFIER, ModifierTypeLabels.SIZE_MODIFIER,
                ModifierTypes.CONDITION_MODIFIER, ModifierTypeLabels.CONDITION_MODIFIER,
                ModifierTypes.SPECIAL_TREATMENT, ModifierTypeLabels.SPECIAL_TREATMENT,
                ModifierTypes.SEASONAL_DISCOUNT, ModifierTypeLabels.SEASONAL_DISCOUNT
            );

            return ResponseEntity.ok(modifierTypes);
        } catch (Exception e) {
            log.error("Помилка при отриманні типів модифікаторів: {}", e.getMessage(), e);
            return ResponseEntity.ok(Map.of());
        }
    }

    @Operation(
        summary = "Отримати список розмірів одягу за типом",
        description = "Повертає список розмірів одягу для вказаного типу (standard, numeric, shoe)"
    )
    @GetMapping("/clothing-sizes")
    public ResponseEntity<Map<String, List<String>>> getClothingSizes(
        @Parameter(description = "Тип розміру: standard, numeric, shoe", example = "standard")
        @RequestParam(required = false) String type
    ) {
        log.debug("Запит на отримання розмірів одягу, тип: {}", type);

        try {
            Map<String, List<String>> sizes = Map.of(
                "standard", List.of(ClothingSizes.STANDARD_SIZES),
                "numeric", List.of(ClothingSizes.NUMERIC_SIZES),
                "shoe", List.of(ClothingSizes.SHOE_SIZES)
            );

            if (type != null && sizes.containsKey(type)) {
                return ResponseEntity.ok(Map.of(type, sizes.get(type)));
            }

            return ResponseEntity.ok(sizes);
        } catch (Exception e) {
            log.error("Помилка при отриманні розмірів одягу: {}", e.getMessage(), e);
            return ResponseEntity.ok(Map.of());
        }
    }

    @Operation(
        summary = "Отримати список станів предметів",
        description = "Повертає список можливих станів предметів"
    )
    @GetMapping("/item-conditions")
    public ResponseEntity<Map<String, String>> getItemConditions() {
        log.debug("Запит на отримання списку станів предметів");

        try {
            Map<String, String> conditions = Map.of(
                "new", ItemConditions.NEW,
                "like_new", ItemConditions.LIKE_NEW,
                "good", ItemConditions.GOOD,
                "fair", ItemConditions.FAIR,
                "worn", ItemConditions.WORN,
                "damaged", ItemConditions.DAMAGED
            );

            return ResponseEntity.ok(conditions);
        } catch (Exception e) {
            log.error("Помилка при отриманні станів предметів: {}", e.getMessage(), e);
            return ResponseEntity.ok(Map.of());
        }
    }

    @Operation(
        summary = "Отримати список одиниць виміру",
        description = "Повертає список доступних одиниць виміру"
    )
    @GetMapping("/units-of-measure")
    public ResponseEntity<Map<String, String>> getUnitsOfMeasure() {
        log.debug("Запит на отримання списку одиниць виміру");

        try {
            Map<String, String> units = Map.of(
                "pieces", UnitOfMeasureConstants.PIECES,
                "kilograms", UnitOfMeasureConstants.KILOGRAMS,
                "pair", UnitOfMeasureConstants.PAIR,
                "square_meters", UnitOfMeasureConstants.SQUARE_METERS
            );

            return ResponseEntity.ok(units);
        } catch (Exception e) {
            log.error("Помилка при отриманні одиниць виміру: {}", e.getMessage(), e);
            return ResponseEntity.ok(Map.of());
        }
    }

    @Operation(
        summary = "Отримати всі довідкові дані разом",
        description = "Повертає всі довідкові дані в одному запиті для зручності фронтенду"
    )
    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllReferenceData() {
        log.debug("Запит на отримання всіх довідкових даних");

        try {
            Map<String, Object> allData = new HashMap<>();
            allData.put("colors", getColors().getBody() != null ? getColors().getBody() : Map.of());
            allData.put("materials", getMaterials().getBody() != null ? getMaterials().getBody() : Map.of());
            allData.put("categories", getCategories().getBody() != null ? getCategories().getBody() : Map.of());
            allData.put("modifierTypes", getModifierTypes().getBody() != null ? getModifierTypes().getBody() : Map.of());
            allData.put("clothingSizes", getClothingSizes(null).getBody() != null ? getClothingSizes(null).getBody() : Map.of());
            allData.put("itemConditions", getItemConditions().getBody() != null ? getItemConditions().getBody() : Map.of());
            allData.put("unitsOfMeasure", getUnitsOfMeasure().getBody() != null ? getUnitsOfMeasure().getBody() : Map.of());
            allData.put("stainTypes", getStainTypes().getBody() != null ? getStainTypes().getBody() : List.of());
            allData.put("defectTypes", getDefectTypes().getBody() != null ? getDefectTypes().getBody() : List.of());
            allData.put("riskTypes", getRiskTypes().getBody() != null ? getRiskTypes().getBody() : List.of());
            allData.put("fillerTypes", getFillerTypes().getBody() != null ? getFillerTypes().getBody() : List.of());
            allData.put("wearDegrees", getWearDegrees().getBody() != null ? getWearDegrees().getBody() : List.of());

            return ResponseEntity.ok(allData);
        } catch (Exception e) {
            log.error("Помилка при отриманні всіх довідкових даних: {}", e.getMessage(), e);
            return ResponseEntity.ok(Map.of());
        }
    }

    @Operation(
        summary = "Автокомпліт для кольорів",
        description = "Пошук кольорів для автокомпліту з фільтрацією за запитом"
    )
    @GetMapping(COLORS)
    public ResponseEntity<List<Map<String, String>>> searchColors(
        @Parameter(description = "Запит для пошуку", example = "чорн")
        @RequestParam(required = false) String query,
        @Parameter(description = "Максимальна кількість результатів", example = "10")
        @RequestParam(defaultValue = "10") int limit
    ) {
        log.debug("Автокомпліт кольорів, запит: {}, ліміт: {}", query, limit);

        // Валідація параметрів
        if (limit <= 0) {
            limit = 10;
        }
        limit = Math.min(limit, MAX_LIMIT);

        // Нормалізація запиту
        String normalizedQuery = (query != null) ? query.trim().toLowerCase() : null;

        try {
            ResponseEntity<Map<String, String>> colorsResponse = getColors();
            Map<String, String> colors = colorsResponse.getBody();

            if (colors == null) {
                log.warn("Отримано null response для кольорів");
                return ResponseEntity.ok(List.of());
            }

            List<Map<String, String>> results = colors.entrySet().stream()
                .filter(entry -> normalizedQuery == null || normalizedQuery.isEmpty() ||
                        entry.getValue().toLowerCase().contains(normalizedQuery))
                .limit(limit)
                .map(entry -> Map.of("code", entry.getKey(), "name", entry.getValue()))
                .toList();

            return ResponseEntity.ok(results);
        } catch (Exception e) {
            log.error("Помилка при автокомпліті кольорів: {}", e.getMessage(), e);
            return ResponseEntity.ok(List.of());
        }
    }

    @Operation(
        summary = "Автокомпліт для матеріалів",
        description = "Пошук матеріалів для автокомпліту з фільтрацією за запитом"
    )
    @GetMapping(MATERIALS)
    public ResponseEntity<List<Map<String, String>>> searchMaterials(
        @RequestParam(required = false) String query,
        @RequestParam(defaultValue = "10") int limit
    ) {
        log.debug("Автокомпліт матеріалів, запит: {}, ліміт: {}", query, limit);

        // Валідація параметрів
        if (limit <= 0) {
            limit = 10;
        }
        limit = Math.min(limit, MAX_LIMIT);

        // Нормалізація запиту
        String normalizedQuery = (query != null) ? query.trim().toLowerCase() : null;

        try {
            ResponseEntity<Map<String, String>> materialsResponse = getMaterials();
            Map<String, String> materials = materialsResponse.getBody();

            if (materials == null) {
                log.warn("Отримано null response для матеріалів");
                return ResponseEntity.ok(List.of());
            }

            List<Map<String, String>> results = materials.entrySet().stream()
                .filter(entry -> normalizedQuery == null || normalizedQuery.isEmpty() ||
                        entry.getValue().toLowerCase().contains(normalizedQuery))
                .limit(limit)
                .map(entry -> Map.of("code", entry.getKey(), "name", entry.getValue()))
                .toList();

            return ResponseEntity.ok(results);
        } catch (Exception e) {
            log.error("Помилка при автокомпліті матеріалів: {}", e.getMessage(), e);
            return ResponseEntity.ok(List.of());
        }
    }

    @Operation(
        summary = "Отримати типи плям",
        description = "Повертає список доступних типів плям"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Список типів плям успішно отримано"),
        @ApiResponse(responseCode = "500", description = "Внутрішня помилка сервера")
    })
    @GetMapping("/stain-types")
    public ResponseEntity<List<String>> getStainTypes() {
        log.debug("Запит на отримання списку типів плям");

        try {
            List<String> stainTypes = itemCharacteristicsService.getAllStainTypes();
            return ResponseEntity.ok(stainTypes);
        } catch (Exception e) {
            log.error("Помилка при отриманні типів плям: {}", e.getMessage(), e);
            return ResponseEntity.ok(List.of());
        }
    }

    @Operation(
        summary = "Отримати типи дефектів",
        description = "Повертає список доступних типів дефектів"
    )
    @GetMapping("/defect-types")
    public ResponseEntity<List<String>> getDefectTypes() {
        log.debug("Запит на отримання списку типів дефектів");

        try {
            List<String> defects = itemCharacteristicsService.getDefects();
            return ResponseEntity.ok(defects);
        } catch (Exception e) {
            log.error("Помилка при отриманні типів дефектів: {}", e.getMessage(), e);
            return ResponseEntity.ok(List.of());
        }
    }

    @Operation(
        summary = "Отримати типи ризиків",
        description = "Повертає список доступних типів ризиків"
    )
    @GetMapping("/risk-types")
    public ResponseEntity<List<String>> getRiskTypes() {
        log.debug("Запит на отримання списку типів ризиків");

        try {
            List<String> risks = itemCharacteristicsService.getRisks();
            return ResponseEntity.ok(risks);
        } catch (Exception e) {
            log.error("Помилка при отриманні типів ризиків: {}", e.getMessage(), e);
            return ResponseEntity.ok(List.of());
        }
    }

    @Operation(
        summary = "Отримати типи наповнювачів",
        description = "Повертає список доступних типів наповнювачів"
    )
    @GetMapping("/filler-types")
    public ResponseEntity<List<String>> getFillerTypes() {
        log.debug("Запит на отримання списку типів наповнювачів");

        try {
            List<String> fillerTypes = itemCharacteristicsService.getAllFillerTypes();
            return ResponseEntity.ok(fillerTypes);
        } catch (Exception e) {
            log.error("Помилка при отриманні типів наповнювачів: {}", e.getMessage(), e);
            return ResponseEntity.ok(List.of());
        }
    }

    @Operation(
        summary = "Отримати ступені зносу",
        description = "Повертає список доступних ступенів зносу"
    )
    @GetMapping("/wear-degrees")
    public ResponseEntity<List<String>> getWearDegrees() {
        log.debug("Запит на отримання списку ступенів зносу");

        try {
            List<String> wearDegrees = itemCharacteristicsService.getAllWearDegrees();
            return ResponseEntity.ok(wearDegrees);
        } catch (Exception e) {
            log.error("Помилка при отриманні ступенів зносу: {}", e.getMessage(), e);
            return ResponseEntity.ok(List.of());
        }
    }

    @Operation(
        summary = "Отримати матеріали за категорією",
        description = "Повертає список доступних матеріалів для вказаної категорії або всі матеріали"
    )
    @GetMapping("/materials-by-category")
    public ResponseEntity<List<String>> getMaterialsByCategory(
        @Parameter(description = "Категорія предмета", example = "clothing")
        @RequestParam(required = false) String category
    ) {
        log.debug("Запит на отримання матеріалів для категорії: {}", category);

        try {
            List<String> materials = itemCharacteristicsService.getMaterialsByCategory(category);
            return ResponseEntity.ok(materials);
        } catch (Exception e) {
            log.error("Помилка при отриманні матеріалів для категорії {}: {}", category, e.getMessage(), e);
            return ResponseEntity.ok(List.of());
        }
    }

    @Operation(
        summary = "Автокомпліт для типів плям",
        description = "Пошук типів плям для автокомпліту з фільтрацією за запитом"
    )
    @GetMapping("/autocomplete/stain-types")
    public ResponseEntity<List<Map<String, String>>> searchStainTypes(
        @Parameter(description = "Запит для пошуку", example = "жир")
        @RequestParam(required = false) String query,
        @Parameter(description = "Максимальна кількість результатів", example = "10")
        @RequestParam(defaultValue = "10") int limit
    ) {
        log.debug("Автокомпліт типів плям, запит: {}, ліміт: {}", query, limit);

        // Валідація параметрів
        if (limit <= 0) {
            limit = 10;
        }
        limit = Math.min(limit, MAX_LIMIT);

        // Нормалізація запиту
        String normalizedQuery = (query != null) ? query.trim().toLowerCase() : null;

        try {
            ResponseEntity<List<String>> stainTypesResponse = getStainTypes();
            List<String> stainTypes = stainTypesResponse.getBody();

            if (stainTypes == null) {
                log.warn("Отримано null response для типів плям");
                return ResponseEntity.ok(List.of());
            }

            List<Map<String, String>> results = stainTypes.stream()
                .filter(stainType -> normalizedQuery == null || normalizedQuery.isEmpty() ||
                        stainType.toLowerCase().contains(normalizedQuery))
                .limit(limit)
                .map(stainType -> Map.of("name", stainType))
                .toList();

            return ResponseEntity.ok(results);
        } catch (Exception e) {
            log.error("Помилка при автокомпліті типів плям: {}", e.getMessage(), e);
            return ResponseEntity.ok(List.of());
        }
    }

    @Operation(
        summary = "Автокомпліт для типів дефектів",
        description = "Пошук типів дефектів для автокомпліту з фільтрацією за запитом"
    )
    @GetMapping("/autocomplete/defect-types")
    public ResponseEntity<List<Map<String, String>>> searchDefectTypes(
        @Parameter(description = "Запит для пошуку", example = "дірка")
        @RequestParam(required = false) String query,
        @Parameter(description = "Максимальна кількість результатів", example = "10")
        @RequestParam(defaultValue = "10") int limit
    ) {
        log.debug("Автокомпліт типів дефектів, запит: {}, ліміт: {}", query, limit);

        // Валідація параметрів
        if (limit <= 0) {
            limit = 10;
        }
        limit = Math.min(limit, MAX_LIMIT);

        // Нормалізація запиту
        String normalizedQuery = (query != null) ? query.trim().toLowerCase() : null;

        try {
            ResponseEntity<List<String>> defectTypesResponse = getDefectTypes();
            List<String> defectTypes = defectTypesResponse.getBody();

            if (defectTypes == null) {
                log.warn("Отримано null response для типів дефектів");
                return ResponseEntity.ok(List.of());
            }

            List<Map<String, String>> results = defectTypes.stream()
                .filter(defectType -> normalizedQuery == null || normalizedQuery.isEmpty() ||
                        defectType.toLowerCase().contains(normalizedQuery))
                .limit(limit)
                .map(defectType -> Map.of("name", defectType))
                .toList();

            return ResponseEntity.ok(results);
        } catch (Exception e) {
            log.error("Помилка при автокомпліті типів дефектів: {}", e.getMessage(), e);
            return ResponseEntity.ok(List.of());
        }
    }

    @Operation(
        summary = "Автокомпліт для типів ризиків",
        description = "Пошук типів ризиків для автокомпліту з фільтрацією за запитом"
    )
    @GetMapping("/autocomplete/risk-types")
    public ResponseEntity<List<Map<String, String>>> searchRiskTypes(
        @Parameter(description = "Запит для пошуку", example = "розрив")
        @RequestParam(required = false) String query,
        @Parameter(description = "Максимальна кількість результатів", example = "10")
        @RequestParam(defaultValue = "10") int limit
    ) {
        log.debug("Автокомпліт типів ризиків, запит: {}, ліміт: {}", query, limit);

        // Валідація параметрів
        if (limit <= 0) {
            limit = 10;
        }
        limit = Math.min(limit, MAX_LIMIT);

        // Нормалізація запиту
        String normalizedQuery = (query != null) ? query.trim().toLowerCase() : null;

        try {
            ResponseEntity<List<String>> riskTypesResponse = getRiskTypes();
            List<String> riskTypes = riskTypesResponse.getBody();

            if (riskTypes == null) {
                log.warn("Отримано null response для типів ризиків");
                return ResponseEntity.ok(List.of());
            }

            List<Map<String, String>> results = riskTypes.stream()
                .filter(riskType -> normalizedQuery == null || normalizedQuery.isEmpty() ||
                        riskType.toLowerCase().contains(normalizedQuery))
                .limit(limit)
                .map(riskType -> Map.of("name", riskType))
                .toList();

            return ResponseEntity.ok(results);
        } catch (Exception e) {
            log.error("Помилка при автокомпліті типів ризиків: {}", e.getMessage(), e);
            return ResponseEntity.ok(List.of());
        }
    }
}
