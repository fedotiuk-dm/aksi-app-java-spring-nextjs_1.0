package com.aksi.api;

import com.aksi.dto.pricing.PriceListItemDto;
import com.aksi.dto.pricing.ServiceCategoryDto;
import com.aksi.service.pricing.PriceListService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/price-list")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Price-list", description = "API для роботи з прайс-листом хімчистки")
public class PriceListController {

    private final PriceListService priceListService;

    @GetMapping
    @Operation(summary = "Отримати всі категорії послуг")
    public ResponseEntity<List<ServiceCategoryDto>> getAllCategories() {
        log.info("REST запит на отримання всіх категорій послуг");
        return ResponseEntity.ok(priceListService.getAllCategories());
    }

    @GetMapping("/{categoryId}")
    @Operation(summary = "Отримати категорію послуг за ідентифікатором")
    public ResponseEntity<ServiceCategoryDto> getCategoryById(
            @PathVariable UUID categoryId) {
        log.info("REST запит на отримання категорії послуг за ID: {}", categoryId);
        return ResponseEntity.ok(priceListService.getCategoryById(categoryId));
    }

    @GetMapping("/category/{code}")
    @Operation(summary = "Отримати категорію послуг за кодом")
    public ResponseEntity<ServiceCategoryDto> getCategoryByCode(
            @PathVariable String code) {
        log.info("REST запит на отримання категорії послуг за кодом: {}", code);
        return ResponseEntity.ok(priceListService.getCategoryByCode(code));
    }
    
    @PostMapping("/category")
    @Operation(summary = "Створити нову категорію послуг")
    public ResponseEntity<ServiceCategoryDto> createCategory(
            @RequestBody ServiceCategoryDto categoryDto) {
        log.info("REST запит на створення нової категорії послуг: {}", categoryDto.getName());
        return new ResponseEntity<>(priceListService.createServiceCategory(categoryDto), HttpStatus.CREATED);
    }
    
    @PutMapping("/category/{categoryId}")
    @Operation(summary = "Оновити категорію послуг")
    public ResponseEntity<ServiceCategoryDto> updateCategory(
            @PathVariable UUID categoryId,
            @RequestBody ServiceCategoryDto categoryDto) {
        log.info("REST запит на оновлення категорії послуг з ID: {}", categoryId);
        return ResponseEntity.ok(priceListService.updateServiceCategory(categoryId, categoryDto));
    }
    
    @PostMapping("/{categoryId}/item")
    @Operation(summary = "Створити новий елемент прайс-листа в категорії")
    public ResponseEntity<PriceListItemDto> createPriceListItem(
            @PathVariable UUID categoryId,
            @RequestBody PriceListItemDto itemDto) {
        log.info("REST запит на створення нового елемента прайс-листа в категорії з ID: {}", categoryId);
        return new ResponseEntity<>(priceListService.createPriceListItem(categoryId, itemDto), HttpStatus.CREATED);
    }
    
    @PutMapping("/item/{itemId}")
    @Operation(summary = "Оновити елемент прайс-листа")
    public ResponseEntity<PriceListItemDto> updatePriceListItem(
            @PathVariable UUID itemId,
            @RequestBody PriceListItemDto itemDto) {
        log.info("REST запит на оновлення елемента прайс-листа з ID: {}", itemId);
        return ResponseEntity.ok(priceListService.updatePriceListItem(itemId, itemDto));
    }
}
