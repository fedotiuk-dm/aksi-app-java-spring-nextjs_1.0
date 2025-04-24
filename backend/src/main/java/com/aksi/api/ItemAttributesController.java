package com.aksi.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.dto.catalog.ColorDto;
import com.aksi.dto.catalog.FillingDto;
import com.aksi.dto.catalog.MaterialDto;
import com.aksi.dto.catalog.MeasurementUnitDto;
import com.aksi.dto.catalog.WearDegreeDto;
import com.aksi.service.catalog.ItemAttributesService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST controller for managing item attributes like colors and wear degrees.
 */
@RestController
@RequestMapping("/item-attributes")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Item Attributes", description = "API для управління атрибутами товару в системі хімчистки")
public class ItemAttributesController {

    private final ItemAttributesService itemAttributesService;

    /**
     * GET: Get all available colors
     */
    @GetMapping("/colors")
    public ResponseEntity<List<ColorDto>> getAllColors() {
        return ResponseEntity.ok(itemAttributesService.getAllColors());
    }

    /**
     * GET: Get all available wear degrees
     */
    @GetMapping("/wear-degrees")
    public ResponseEntity<List<WearDegreeDto>> getAllWearDegrees() {
        return ResponseEntity.ok(itemAttributesService.getAllWearDegrees());
    }
    
    /**
     * GET: Get all available measurement units
     */
    @GetMapping("/measurement-units")
    public ResponseEntity<List<MeasurementUnitDto>> getAllMeasurementUnits() {
        return ResponseEntity.ok(itemAttributesService.getAllMeasurementUnits());
    }
    
    /**
     * GET: Get materials available for the specified category
     */
    @Operation(summary = "Отримання матеріалів для категорії", 
               description = "Повертає список матеріалів, доступних для вказаної категорії")
    @ApiResponse(responseCode = "200", description = "Успішне отримання списку матеріалів",
                 content = @Content(mediaType = "application/json", 
                 schema = @Schema(implementation = MaterialDto.class)))
    @GetMapping("/materials/category/{categoryId}")
    public ResponseEntity<List<MaterialDto>> getMaterialsByCategory(
            @Parameter(description = "ID категорії") 
            @PathVariable UUID categoryId) {
        return ResponseEntity.ok(itemAttributesService.getMaterialsByCategory(categoryId));
    }
    
    /**
     * GET: Get materials available for the specified category by code
     */
    @Operation(summary = "Отримання матеріалів для категорії за кодом", 
               description = "Повертає список матеріалів, доступних для вказаної категорії за її кодом")
    @ApiResponse(responseCode = "200", description = "Успішне отримання списку матеріалів",
                 content = @Content(mediaType = "application/json", 
                 schema = @Schema(implementation = MaterialDto.class)))
    @GetMapping("/materials/category/code/{categoryCode}")
    public ResponseEntity<List<MaterialDto>> getMaterialsByCategoryCode(
            @Parameter(description = "Код категорії") 
            @PathVariable String categoryCode) {
        return ResponseEntity.ok(itemAttributesService.getMaterialsByCategoryCode(categoryCode));
    }
    
    /**
     * GET: Check if the specified category requires filling
     */
    @Operation(summary = "Перевірка необхідності наповнювача для категорії", 
               description = "Перевіряє, чи потрібен наповнювач для вказаної категорії")
    @ApiResponse(responseCode = "200", description = "Успішна перевірка")
    @GetMapping("/filling-required/category/{categoryId}")
    public ResponseEntity<Boolean> doesCategoryNeedFilling(
            @Parameter(description = "ID категорії") 
            @PathVariable UUID categoryId) {
        return ResponseEntity.ok(itemAttributesService.doesCategoryNeedFilling(categoryId));
    }
    
    /**
     * GET: Check if the specified category requires filling by code
     */
    @Operation(summary = "Перевірка необхідності наповнювача для категорії за кодом", 
               description = "Перевіряє, чи потрібен наповнювач для вказаної категорії за її кодом")
    @ApiResponse(responseCode = "200", description = "Успішна перевірка")
    @GetMapping("/filling-required/category/code/{categoryCode}")
    public ResponseEntity<Boolean> doesCategoryNeedFillingByCode(
            @Parameter(description = "Код категорії") 
            @PathVariable String categoryCode) {
        return ResponseEntity.ok(itemAttributesService.doesCategoryNeedFillingByCode(categoryCode));
    }
    
    /**
     * GET: Get all available fillings
     */
    @Operation(summary = "Отримання всіх наповнювачів", 
               description = "Повертає список усіх доступних наповнювачів")
    @ApiResponse(responseCode = "200", description = "Успішне отримання списку наповнювачів",
                 content = @Content(mediaType = "application/json", 
                 schema = @Schema(implementation = FillingDto.class)))
    @GetMapping("/fillings")
    public ResponseEntity<List<FillingDto>> getAllFillings() {
        return ResponseEntity.ok(itemAttributesService.getAllFillings());
    }
}
