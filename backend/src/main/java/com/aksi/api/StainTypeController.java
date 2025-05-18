package com.aksi.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.pricing.dto.StainTypeDTO;
import com.aksi.domain.pricing.entity.StainTypeEntity.RiskLevel;
import com.aksi.domain.pricing.service.StainTypeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * REST контролер для управління типами плям.
 */
@RestController
@RequestMapping("/stain-types")
@RequiredArgsConstructor
@Tag(name = "Типи плям", description = "API для управління типами плям")
public class StainTypeController {
    
    private final StainTypeService stainTypeService;
    
    /**
     * Отримати всі типи плям.
     * 
     * @param activeOnly прапорець для отримання лише активних типів
     * @param riskLevel рівень ризику для фільтрації (опціонально)
     * @return список типів плям
     */
    @GetMapping
    @Operation(summary = "Отримати типи плям", description = "Повертає список всіх або тільки активних типів плям з можливістю фільтрації за рівнем ризику")
    public ResponseEntity<List<StainTypeDTO>> getStainTypes(
            @RequestParam(name = "activeOnly", defaultValue = "true") boolean activeOnly,
            @RequestParam(name = "riskLevel", required = false) RiskLevel riskLevel) {
        
        List<StainTypeDTO> stainTypes;
        
        if (riskLevel != null) {
            stainTypes = stainTypeService.getStainTypesByRiskLevel(riskLevel);
        } else if (activeOnly) {
            stainTypes = stainTypeService.getActiveStainTypes();
        } else {
            stainTypes = stainTypeService.getAllStainTypes();
        }
        
        return ResponseEntity.ok(stainTypes);
    }
    
    /**
     * Отримати тип плями за ідентифікатором.
     * 
     * @param id ідентифікатор типу плями
     * @return тип плями
     */
    @GetMapping("/{id}")
    @Operation(summary = "Отримати тип плями за ID", description = "Повертає тип плями за вказаним ідентифікатором")
    public ResponseEntity<StainTypeDTO> getStainTypeById(@PathVariable UUID id) {
        return ResponseEntity.ok(stainTypeService.getStainTypeById(id));
    }
    
    /**
     * Отримати тип плями за кодом.
     * 
     * @param code код типу плями
     * @return тип плями
     */
    @GetMapping("/by-code/{code}")
    @Operation(summary = "Отримати тип плями за кодом", description = "Повертає тип плями за вказаним кодом")
    public ResponseEntity<StainTypeDTO> getStainTypeByCode(@PathVariable String code) {
        return ResponseEntity.ok(stainTypeService.getStainTypeByCode(code));
    }
    
    /**
     * Створити новий тип плями.
     * 
     * @param stainTypeDTO дані нового типу плями
     * @return створений тип плями
     */
    @PostMapping
    @Operation(summary = "Створити тип плями", description = "Створює новий тип плями з вказаними даними")
    public ResponseEntity<StainTypeDTO> createStainType(@Valid @RequestBody StainTypeDTO stainTypeDTO) {
        return new ResponseEntity<>(stainTypeService.createStainType(stainTypeDTO), HttpStatus.CREATED);
    }
    
    /**
     * Оновити існуючий тип плями.
     * 
     * @param id ідентифікатор типу плями
     * @param stainTypeDTO нові дані типу плями
     * @return оновлений тип плями
     */
    @PutMapping("/{id}")
    @Operation(summary = "Оновити тип плями", description = "Оновлює існуючий тип плями за вказаним ідентифікатором")
    public ResponseEntity<StainTypeDTO> updateStainType(
            @PathVariable UUID id, 
            @Valid @RequestBody StainTypeDTO stainTypeDTO) {
        return ResponseEntity.ok(stainTypeService.updateStainType(id, stainTypeDTO));
    }
    
    /**
     * Видалити тип плями.
     * 
     * @param id ідентифікатор типу плями
     * @return статус операції
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Видалити тип плями", description = "Видаляє тип плями за вказаним ідентифікатором")
    public ResponseEntity<Void> deleteStainType(@PathVariable UUID id) {
        stainTypeService.deleteStainType(id);
        return ResponseEntity.noContent().build();
    }
} 