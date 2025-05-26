package com.aksi.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.pricing.dto.PriceListItemDTO;
import com.aksi.domain.pricing.dto.ServiceCategoryDTO;
import com.aksi.domain.pricing.service.PriceListDomainService;
import com.aksi.util.ApiResponseUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/price-list")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Price List", description = "API для роботи з прайс-листом хімчистки")
public class PriceListController {

    private final PriceListDomainService priceListService;

    @GetMapping
    @Operation(summary = "Отримати всі категорії послуг")
    public ResponseEntity<?> getAllCategories() {
        log.info("Запит на отримання всіх категорій послуг");
        try {
            List<ServiceCategoryDTO> categories = priceListService.getAllCategories();
            return ApiResponseUtils.ok(categories, "Отримано {} категорій послуг", categories.size());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні категорій послуг",
                    "Виникла помилка при отриманні категорій послуг. Причина: {}", e.getMessage());
        }
    }

    @GetMapping("/{categoryId}")
    @Operation(summary = "Отримати категорію послуг за ідентифікатором")
    public ResponseEntity<?> getCategoryById(
            @PathVariable UUID categoryId) {
        log.info("Запит на отримання категорії послуг за ID: {}", categoryId);
        try {
            ServiceCategoryDTO category = priceListService.getCategoryById(categoryId);
            return ApiResponseUtils.ok(category, "Отримано категорію послуг: {}", category.getName());
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Категорію послуг не знайдено",
                    "Категорію послуг з ID: {} не знайдено. Причина: {}", categoryId, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні категорії послуг",
                    "Виникла помилка при отриманні категорії послуг з ID: {}. Причина: {}",
                    categoryId, e.getMessage());
        }
    }

    @GetMapping("/category/{code}")
    @Operation(summary = "Отримати категорію послуг за кодом")
    public ResponseEntity<?> getCategoryByCode(
            @PathVariable String code) {
        log.info("Запит на отримання категорії послуг за кодом: {}", code);
        try {
            ServiceCategoryDTO category = priceListService.getCategoryByCode(code);
            return ApiResponseUtils.ok(category, "Отримано категорію послуг: {}", category.getName());
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Категорію послуг не знайдено",
                    "Категорію послуг з кодом: {} не знайдено. Причина: {}", code, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні категорії послуг",
                    "Виникла помилка при отриманні категорії послуг з кодом: {}. Причина: {}",
                    code, e.getMessage());
        }
    }

    @PostMapping("/category")
    @Operation(summary = "Створити нову категорію послуг")
    public ResponseEntity<?> createCategory(
            @RequestBody ServiceCategoryDTO categoryDto) {
        log.info("Запит на створення нової категорії послуг: {}", categoryDto.getName());
        try {
            ServiceCategoryDTO createdCategory = priceListService.createServiceCategory(categoryDto);
            return ApiResponseUtils.created(createdCategory, "Створено нову категорію послуг: {}",
                    createdCategory.getName());
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.badRequest("Некоректні дані для створення категорії",
                    "Не вдалося створити категорію послуг. Причина: {}", e.getMessage());
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().contains("вже існує")) {
                return ApiResponseUtils.conflict("Категорія з таким кодом вже існує",
                        "Категорія з кодом: {} вже існує", categoryDto.getCode());
            }
            return ApiResponseUtils.internalServerError("Помилка при створенні категорії послуг",
                    "Виникла помилка при створенні категорії послуг. Причина: {}", e.getMessage());
        }
    }

    @PutMapping("/category/{categoryId}")
    @Operation(summary = "Оновити категорію послуг")
    public ResponseEntity<?> updateCategory(
            @PathVariable UUID categoryId,
            @RequestBody ServiceCategoryDTO categoryDto) {
        log.info("Запит на оновлення категорії послуг з ID: {}", categoryId);
        try {
            ServiceCategoryDTO updatedCategory = priceListService.updateServiceCategory(categoryId, categoryDto);
            return ApiResponseUtils.ok(updatedCategory, "Оновлено категорію послуг: {}",
                    updatedCategory.getName());
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Категорію послуг не знайдено",
                    "Категорію послуг з ID: {} не знайдено. Причина: {}", categoryId, e.getMessage());
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().contains("вже існує")) {
                return ApiResponseUtils.conflict("Категорія з таким кодом вже існує",
                        "Категорія з кодом: {} вже існує", categoryDto.getCode());
            }
            return ApiResponseUtils.internalServerError("Помилка при оновленні категорії послуг",
                    "Виникла помилка при оновленні категорії послуг з ID: {}. Причина: {}",
                    categoryId, e.getMessage());
        }
    }

    @PostMapping("/{categoryId}/item")
    @Operation(summary = "Створити новий елемент прайс-листа в категорії")
    public ResponseEntity<?> createPriceListItem(
            @PathVariable UUID categoryId,
            @RequestBody PriceListItemDTO itemDto) {
        log.info("Запит на створення нового елемента прайс-листа в категорії з ID: {}", categoryId);
        try {
            PriceListItemDTO createdItem = priceListService.createPriceListItem(categoryId, itemDto);
            return ApiResponseUtils.created(createdItem, "Створено новий елемент прайс-листа: {}",
                    createdItem.getName());
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Категорію послуг не знайдено",
                    "Категорію послуг з ID: {} не знайдено. Причина: {}", categoryId, e.getMessage());
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().contains("вже існує")) {
                return ApiResponseUtils.conflict("Елемент прайс-листа з таким іменем вже існує",
                        "Елемент прайс-листа з іменем: {} вже існує в категорії", itemDto.getName());
            }
            return ApiResponseUtils.internalServerError("Помилка при створенні елемента прайс-листа",
                    "Виникла помилка при створенні елемента прайс-листа в категорії з ID: {}. Причина: {}",
                    categoryId, e.getMessage());
        }
    }

    @PutMapping("/item/{itemId}")
    @Operation(summary = "Оновити елемент прайс-листа")
    public ResponseEntity<?> updatePriceListItem(
            @PathVariable UUID itemId,
            @RequestBody PriceListItemDTO itemDto) {
        log.info("Запит на оновлення елемента прайс-листа з ID: {}", itemId);
        try {
            PriceListItemDTO updatedItem = priceListService.updatePriceListItem(itemId, itemDto);
            return ApiResponseUtils.ok(updatedItem, "Оновлено елемент прайс-листа: {}",
                    updatedItem.getName());
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Елемент прайс-листа не знайдено",
                    "Елемент прайс-листа з ID: {} не знайдено. Причина: {}", itemId, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при оновленні елемента прайс-листа",
                    "Виникла помилка при оновленні елемента прайс-листа з ID: {}. Причина: {}",
                    itemId, e.getMessage());
        }
    }

    @GetMapping("/category/{categoryId}/items")
    @Operation(summary = "Отримати всі елементи прайс-листа за категорією")
    public ResponseEntity<?> getItemsByCategory(
            @PathVariable UUID categoryId) {
        log.info("Запит на отримання елементів прайс-листа за категорією з ID: {}", categoryId);
        try {
            List<PriceListItemDTO> items = priceListService.getItemsByCategory(categoryId);
            return ApiResponseUtils.ok(items, "Отримано {} елементів прайс-листа для категорії",
                    items.size());
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Категорію послуг не знайдено",
                    "Категорію послуг з ID: {} не знайдено. Причина: {}", categoryId, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні елементів прайс-листа",
                    "Виникла помилка при отриманні елементів прайс-листа для категорії з ID: {}. Причина: {}",
                    categoryId, e.getMessage());
        }
    }

    @GetMapping("/category/code/{categoryCode}/items")
    @Operation(summary = "Отримати всі елементи прайс-листа за кодом категорії")
    public ResponseEntity<?> getItemsByCategoryCode(
            @PathVariable String categoryCode) {
        log.info("Запит на отримання елементів прайс-листа за кодом категорії: {}", categoryCode);
        try {
            List<PriceListItemDTO> items = priceListService.getItemsByCategoryCode(categoryCode);
            return ApiResponseUtils.ok(items, "Отримано {} елементів прайс-листа для категорії з кодом: {}",
                    items.size(), categoryCode);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Категорію послуг не знайдено",
                    "Категорію послуг з кодом: {} не знайдено. Причина: {}", categoryCode, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні елементів прайс-листа",
                    "Виникла помилка при отриманні елементів прайс-листа для категорії з кодом: {}. Причина: {}",
                    categoryCode, e.getMessage());
        }
    }

    @GetMapping("/item/{itemId}")
    @Operation(summary = "Отримати елемент прайс-листа за ID")
    public ResponseEntity<?> getItemById(
            @PathVariable UUID itemId) {
        log.info("Запит на отримання елемента прайс-листа за ID: {}", itemId);
        try {
            PriceListItemDTO item = priceListService.getItemById(itemId);
            return ApiResponseUtils.ok(item, "Отримано елемент прайс-листа: {}", item.getName());
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Елемент прайс-листа не знайдено",
                    "Елемент прайс-листа з ID: {} не знайдено. Причина: {}", itemId, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні елемента прайс-листа",
                    "Виникла помилка при отриманні елемента прайс-листа з ID: {}. Причина: {}",
                    itemId, e.getMessage());
        }
    }

    @GetMapping("/category/{categoryId}/units-of-measure")
    @Operation(summary = "Отримати доступні одиниці виміру для категорії")
    public ResponseEntity<?> getAvailableUnitsOfMeasure(
            @PathVariable UUID categoryId) {
        log.info("Запит на отримання доступних одиниць виміру для категорії з ID: {}", categoryId);
        try {
            List<String> units = priceListService.getAvailableUnitsOfMeasure(categoryId);
            return ApiResponseUtils.ok(units, "Отримано {} одиниць виміру для категорії", units.size());
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Категорію послуг не знайдено",
                    "Категорію послуг з ID: {} не знайдено. Причина: {}", categoryId, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні одиниць виміру",
                    "Виникла помилка при отриманні доступних одиниць виміру для категорії з ID: {}. Причина: {}",
                    categoryId, e.getMessage());
        }
    }

    @GetMapping("/category/{categoryId}/item-names")
    @Operation(summary = "Отримати список найменувань виробів за категорією")
    public ResponseEntity<?> getItemNamesByCategory(
            @PathVariable UUID categoryId) {
        log.info("Запит на отримання списку найменувань виробів за категорією з ID: {}", categoryId);
        try {
            List<String> itemNames = priceListService.getItemNamesByCategory(categoryId);
            return ApiResponseUtils.ok(itemNames, "Отримано {} найменувань виробів для категорії",
                    itemNames.size());
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Категорію послуг не знайдено",
                    "Категорію послуг з ID: {} не знайдено. Причина: {}", categoryId, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні найменувань виробів",
                    "Виникла помилка при отриманні найменувань виробів для категорії з ID: {}. Причина: {}",
                    categoryId, e.getMessage());
        }
    }
}
