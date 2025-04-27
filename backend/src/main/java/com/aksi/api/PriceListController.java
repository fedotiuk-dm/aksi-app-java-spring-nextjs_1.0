package com.aksi.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
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
import com.aksi.service.pricing.PriceListService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/price-list")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Price-list", description = "API для роботи з прайс-листом хімчистки")
public class PriceListController {

    private final PriceListService priceListService;

    @GetMapping
    @Operation(summary = "Отримати всі категорії послуг")
    public ResponseEntity<List<ServiceCategoryDTO>> getAllCategories() {
        log.info("REST запит на отримання всіх категорій послуг");
        return ResponseEntity.ok(priceListService.getAllCategories());
    }

    @GetMapping("/{categoryId}")
    @Operation(summary = "Отримати категорію послуг за ідентифікатором")
    public ResponseEntity<ServiceCategoryDTO> getCategoryById(
            @PathVariable UUID categoryId) {
        log.info("REST запит на отримання категорії послуг за ID: {}", categoryId);
        return ResponseEntity.ok(priceListService.getCategoryById(categoryId));
    }

    @GetMapping("/category/{code}")
    @Operation(summary = "Отримати категорію послуг за кодом")
    public ResponseEntity<ServiceCategoryDTO> getCategoryByCode(
            @PathVariable String code) {
        log.info("REST запит на отримання категорії послуг за кодом: {}", code);
        return ResponseEntity.ok(priceListService.getCategoryByCode(code));
    }
    
    @PostMapping("/category")
    @Operation(summary = "Створити нову категорію послуг")
    public ResponseEntity<ServiceCategoryDTO> createCategory(
            @RequestBody ServiceCategoryDTO categoryDto) {
        log.info("REST запит на створення нової категорії послуг: {}", categoryDto.getName());
        return new ResponseEntity<>(priceListService.createServiceCategory(categoryDto), HttpStatus.CREATED);
    }
    
    @PutMapping("/category/{categoryId}")
    @Operation(summary = "Оновити категорію послуг")
    public ResponseEntity<ServiceCategoryDTO> updateCategory(
            @PathVariable UUID categoryId,
            @RequestBody ServiceCategoryDTO categoryDto) {
        log.info("REST запит на оновлення категорії послуг з ID: {}", categoryId);
        return ResponseEntity.ok(priceListService.updateServiceCategory(categoryId, categoryDto));
    }
    
    @PostMapping("/{categoryId}/item")
    @Operation(summary = "Створити новий елемент прайс-листа в категорії")
    public ResponseEntity<PriceListItemDTO> createPriceListItem(
            @PathVariable UUID categoryId,
            @RequestBody PriceListItemDTO itemDto) {
        log.info("REST запит на створення нового елемента прайс-листа в категорії з ID: {}", categoryId);
        return new ResponseEntity<>(priceListService.createPriceListItem(categoryId, itemDto), HttpStatus.CREATED);
    }
    
    @PutMapping("/item/{itemId}")
    @Operation(summary = "Оновити елемент прайс-листа")
    public ResponseEntity<PriceListItemDTO> updatePriceListItem(
            @PathVariable UUID itemId,
            @RequestBody PriceListItemDTO itemDto) {
        log.info("REST запит на оновлення елемента прайс-листа з ID: {}", itemId);
        return ResponseEntity.ok(priceListService.updatePriceListItem(itemId, itemDto));
    }
    
    @GetMapping("/category/{categoryId}/items")
    @Operation(summary = "Отримати всі елементи прайс-листа за категорією")
    public ResponseEntity<List<PriceListItemDTO>> getItemsByCategory(
            @PathVariable UUID categoryId) {
        log.info("REST запит на отримання елементів прайс-листа за категорією з ID: {}", categoryId);
        return ResponseEntity.ok(priceListService.getItemsByCategory(categoryId));
    }
    
    @GetMapping("/category/code/{categoryCode}/items")
    @Operation(summary = "Отримати всі елементи прайс-листа за кодом категорії")
    public ResponseEntity<List<PriceListItemDTO>> getItemsByCategoryCode(
            @PathVariable String categoryCode) {
        log.info("REST запит на отримання елементів прайс-листа за кодом категорії: {}", categoryCode);
        return ResponseEntity.ok(priceListService.getItemsByCategoryCode(categoryCode));
    }
    
    @GetMapping("/item/{itemId}")
    @Operation(summary = "Отримати елемент прайс-листа за ID")
    public ResponseEntity<PriceListItemDTO> getItemById(
            @PathVariable UUID itemId) {
        log.info("REST запит на отримання елемента прайс-листа за ID: {}", itemId);
        return ResponseEntity.ok(priceListService.getItemById(itemId));
    }
    
    @GetMapping("/category/{categoryId}/units-of-measure")
    @Operation(summary = "Отримати доступні одиниці виміру для категорії")
    public ResponseEntity<List<String>> getAvailableUnitsOfMeasure(
            @PathVariable UUID categoryId) {
        log.info("REST запит на отримання доступних одиниць виміру для категорії з ID: {}", categoryId);
        return ResponseEntity.ok(priceListService.getAvailableUnitsOfMeasure(categoryId));
    }
    
    @GetMapping("/category/{categoryId}/item-names")
    @Operation(summary = "Отримати список найменувань виробів за категорією")
    public ResponseEntity<List<String>> getItemNamesByCategory(
            @PathVariable UUID categoryId) {
        log.info("REST запит на отримання списку найменувань виробів за категорією з ID: {}", categoryId);
        return ResponseEntity.ok(priceListService.getItemNamesByCategory(categoryId));
    }
}
