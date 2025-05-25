package com.aksi.api;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.application.dto.common.AutocompleteResponseDTO;
import com.aksi.domain.pricing.dto.PriceListItemDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.dto.ServiceCategoryDTO;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierCategory;
import com.aksi.domain.pricing.service.CatalogPriceModifierService;
import com.aksi.domain.pricing.service.PriceListService;
import com.aksi.domain.pricing.service.ServiceCategoryService;
import com.aksi.util.ApiResponseUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Контролер для автокомпліт функціональності.
 * Забезпечує швидкий пошук та автокомпліт для різних типів даних.
 */
@RestController
@RequestMapping("/api/autocomplete")
@Tag(name = "Autocomplete API", description = "API для автокомпліт функціональності")
@RequiredArgsConstructor
@Slf4j
public class AutocompleteController {

    private final CatalogPriceModifierService modifierService;
    private final PriceListService priceListService;
    private final ServiceCategoryService serviceCategoryService;

    /**
     * Автокомпліт для назв предметів з прайс-листа.
     */
    @GetMapping("/items")
    @Operation(
        summary = "Автокомпліт для назв предметів",
        description = "Повертає список варіантів назв предметів для автокомпліту на основі введеного тексту",
        tags = {"Autocomplete"}
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Успішно отримано варіанти автокомпліту",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = AutocompleteResponseDTO.class)
            )
        ),
        @ApiResponse(responseCode = "400", description = "Некоректні параметри запиту")
    })
    public ResponseEntity<?> autocompleteItems(
            @Parameter(description = "Текст для пошуку", example = "сорочка")
            @RequestParam @Size(min = 2, max = 100, message = "Запит повинен містити від 2 до 100 символів") String query,

            @Parameter(description = "Код категорії для фільтрації", example = "CLOTHING")
            @RequestParam(required = false) String categoryCode,

            @Parameter(description = "Максимальна кількість результатів", example = "10")
            @RequestParam(defaultValue = "10") @Min(1) @Max(50) int limit) {

        log.info("Запит автокомпліту предметів: '{}', категорія: {}, ліміт: {}", query, categoryCode, limit);

        try {
            // Отримуємо предмети з прайс-листа через сервіс
            List<PriceListItemDTO> priceListItems;

            if (categoryCode != null && !categoryCode.isEmpty()) {
                // Фільтруємо за категорією
                priceListItems = priceListService.getItemsByCategoryCode(categoryCode);
            } else {
                // Отримуємо всі активні предмети
                priceListItems = priceListService.getAllActiveItems();
            }

            // Фільтруємо за запитом та обмежуємо кількість
            List<PriceListItemDTO> filteredItems = priceListItems.stream()
                .filter(item -> item.getName().toLowerCase().contains(query.toLowerCase()))
                .limit(limit)
                .collect(Collectors.toList());

            List<AutocompleteResponseDTO.AutocompleteItem> autocompleteItems = filteredItems.stream()
                .map(item -> AutocompleteResponseDTO.AutocompleteItem.builder()
                    .id(item.getId().toString())
                    .label(item.getName())
                    .value(item.getName())
                    .type("ITEM")
                    .active(item.isActive())
                    .priority(item.isActive() ? 1 : 2)
                    .metadata(Map.of(
                        "categoryId", item.getCategoryId().toString(),
                        "unitOfMeasure", item.getUnitOfMeasure(),
                        "basePrice", item.getBasePrice().toString(),
                        "catalogNumber", item.getCatalogNumber() != null ? item.getCatalogNumber().toString() : ""
                    ))
                    .build())
                .collect(Collectors.toList());

            AutocompleteResponseDTO response = AutocompleteResponseDTO.builder()
                .items(autocompleteItems)
                .totalCount((long) filteredItems.size())
                .category("ITEM_NAMES")
                .build();

            return ApiResponseUtils.ok(response, "Знайдено {} варіантів для '{}'", filteredItems.size(), query);

        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.badRequest("Некоректні параметри запиту",
                "Помилка в параметрах автокомпліту: {}", e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при автокомпліті",
                "Виникла помилка при автокомпліті предметів: {}", e.getMessage());
        }
    }

    /**
     * Автокомпліт для модифікаторів.
     */
    @GetMapping("/modifiers")
    @Operation(
        summary = "Автокомпліт для модифікаторів",
        description = "Повертає список варіантів модифікаторів для автокомпліту",
        tags = {"Autocomplete"}
    )
    public ResponseEntity<?> autocompleteModifiers(
            @Parameter(description = "Текст для пошуку", example = "знижка")
            @RequestParam @Size(min = 2, max = 100) String query,

            @Parameter(description = "Категорія модифікаторів")
            @RequestParam(required = false) ModifierCategory category,

            @Parameter(description = "Максимальна кількість результатів", example = "10")
            @RequestParam(defaultValue = "10") @Min(1) @Max(50) int limit) {

        log.info("Запит автокомпліту модифікаторів: '{}', категорія: {}, ліміт: {}", query, category, limit);

        try {
            // Фільтруємо модифікатори за запитом
            List<PriceModifierDTO> allModifiers = modifierService.getAllActiveModifiers();

            List<PriceModifierDTO> filteredModifiers = allModifiers.stream()
                .filter(m -> category == null || m.getCategory() == category)
                .filter(m -> m.getName().toLowerCase().contains(query.toLowerCase()) ||
                           m.getDescription().toLowerCase().contains(query.toLowerCase()) ||
                           m.getCode().toLowerCase().contains(query.toLowerCase()))
                .limit(limit)
                .collect(Collectors.toList());

            List<AutocompleteResponseDTO.AutocompleteItem> autocompleteItems = filteredModifiers.stream()
                .map(modifier -> AutocompleteResponseDTO.AutocompleteItem.builder()
                    .id(modifier.getId().toString())
                    .label(modifier.getName())
                    .value(modifier.getCode())
                    .description(modifier.getDescription())
                    .type("MODIFIER")
                    .active(modifier.isActive())
                    .priority(modifier.isActive() ? 1 : 2)
                    .metadata(Map.of(
                        "category", modifier.getCategory().toString(),
                        "modifierType", modifier.getModifierType().toString(),
                        "hasRange", modifier.getMinValue() != null && modifier.getMaxValue() != null
                    ))
                    .build())
                .collect(Collectors.toList());

            AutocompleteResponseDTO response = AutocompleteResponseDTO.builder()
                .items(autocompleteItems)
                .totalCount((long) filteredModifiers.size())
                .category("MODIFIERS")
                .build();

            return ApiResponseUtils.ok(response, "Знайдено {} модифікаторів для '{}'", filteredModifiers.size(), query);

        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при автокомпліті модифікаторів",
                "Виникла помилка при автокомпліті модифікаторів: {}", e.getMessage());
        }
    }

    /**
     * Автокомпліт для категорій послуг.
     */
    @GetMapping("/categories")
    @Operation(
        summary = "Автокомпліт для категорій послуг",
        description = "Повертає список варіантів категорій послуг для автокомпліту",
        tags = {"Autocomplete"}
    )
    public ResponseEntity<?> autocompleteCategories(
            @Parameter(description = "Текст для пошуку", example = "одяг")
            @RequestParam @Size(min = 1, max = 100) String query,

            @Parameter(description = "Максимальна кількість результатів", example = "10")
            @RequestParam(defaultValue = "10") @Min(1) @Max(20) int limit) {

        log.info("Запит автокомпліту категорій: '{}', ліміт: {}", query, limit);

        try {
            // Отримуємо категорії послуг через сервіс
            List<ServiceCategoryDTO> allCategories = serviceCategoryService.getAllActiveCategories();

            // Фільтруємо за запитом та обмежуємо кількість
            List<ServiceCategoryDTO> filteredCategories = allCategories.stream()
                .filter(cat -> cat.getName().toLowerCase().contains(query.toLowerCase()) ||
                             cat.getCode().toLowerCase().contains(query.toLowerCase()) ||
                             (cat.getDescription() != null && cat.getDescription().toLowerCase().contains(query.toLowerCase())))
                .limit(limit)
                .collect(Collectors.toList());

            List<AutocompleteResponseDTO.AutocompleteItem> autocompleteItems = filteredCategories.stream()
                .map(cat -> AutocompleteResponseDTO.AutocompleteItem.builder()
                    .id(cat.getId().toString())
                    .label(cat.getName())
                    .value(cat.getCode())
                    .description(cat.getDescription())
                    .type("CATEGORY")
                    .active(cat.isActive())
                    .priority(cat.isActive() ? 1 : 2)
                    .metadata(Map.of(
                        "code", cat.getCode(),
                        "name", cat.getName()
                    ))
                    .build())
                .collect(Collectors.toList());

            AutocompleteResponseDTO response = AutocompleteResponseDTO.builder()
                .items(autocompleteItems)
                .totalCount((long) filteredCategories.size())
                .category("SERVICE_CATEGORIES")
                .build();

            return ApiResponseUtils.ok(response, "Знайдено {} категорій для '{}'", filteredCategories.size(), query);

        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при автокомпліті категорій",
                "Виникла помилка при автокомпліті категорій: {}", e.getMessage());
        }
    }
}
