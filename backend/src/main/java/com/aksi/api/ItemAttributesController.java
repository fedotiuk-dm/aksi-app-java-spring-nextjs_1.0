package com.aksi.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.dto.catalog.ColorDto;
import com.aksi.dto.catalog.MeasurementUnitDto;
import com.aksi.dto.catalog.WearDegreeDto;
import com.aksi.service.catalog.ItemAttributesService;

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
}
