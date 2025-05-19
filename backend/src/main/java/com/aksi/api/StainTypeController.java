package com.aksi.api;

import java.util.List;
import java.util.UUID;

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
import com.aksi.domain.pricing.enums.RiskLevel;
import com.aksi.domain.pricing.service.StainTypeService;
import com.aksi.util.ApiResponseUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST контролер для управління типами плям.
 */
@RestController
@RequestMapping("/stain-types")
@RequiredArgsConstructor
@Tag(name = "StainType", description = "API для управління типами плям")
@Slf4j
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
            return ApiResponseUtils.ok(stainTypes, "REST запит на отримання типів плям з рівнем ризику: {}", riskLevel);
        } else if (activeOnly) {
            stainTypes = stainTypeService.getActiveStainTypes();
            return ApiResponseUtils.ok(stainTypes, "REST запит на отримання активних типів плям");
        } else {
            stainTypes = stainTypeService.getAllStainTypes();
            return ApiResponseUtils.ok(stainTypes, "REST запит на отримання всіх типів плям");
        }
    }

    /**
     * Отримати тип плями за ідентифікатором.
     *
     * @param id ідентифікатор типу плями
     * @return тип плями
     */
    @GetMapping("/{id}")
    @Operation(summary = "Отримати тип плями за ID", description = "Повертає тип плями за вказаним ідентифікатором")
    public ResponseEntity<?> getStainTypeById(@PathVariable UUID id) {
        StainTypeDTO stainType = stainTypeService.getStainTypeById(id);
        if (stainType == null) {
            return ApiResponseUtils.notFound("Тип плями не знайдено", "Тип плями з ID: {} не знайдено", id);
        }
        return ApiResponseUtils.ok(stainType, "REST запит на отримання типу плями за ID: {}", id);
    }

    /**
     * Отримати тип плями за кодом.
     *
     * @param code код типу плями
     * @return тип плями
     */
    @GetMapping("/by-code/{code}")
    @Operation(summary = "Отримати тип плями за кодом", description = "Повертає тип плями за вказаним кодом")
    public ResponseEntity<?> getStainTypeByCode(@PathVariable String code) {
        StainTypeDTO stainType = stainTypeService.getStainTypeByCode(code);
        if (stainType == null) {
            return ApiResponseUtils.notFound("Тип плями не знайдено", "Тип плями з кодом: {} не знайдено", code);
        }
        return ApiResponseUtils.ok(stainType, "REST запит на отримання типу плями за кодом: {}", code);
    }

    /**
     * Створити новий тип плями.
     *
     * @param stainTypeDTO дані нового типу плями
     * @return створений тип плями
     */
    @PostMapping
    @Operation(summary = "Створити тип плями", description = "Створює новий тип плями з вказаними даними")
    public ResponseEntity<?> createStainType(@Valid @RequestBody StainTypeDTO stainTypeDTO) {
        try {
            StainTypeDTO createdStainType = stainTypeService.createStainType(stainTypeDTO);
            return ApiResponseUtils.created(createdStainType, "REST запит на створення нового типу плями: {}", stainTypeDTO);
        } catch (Exception e) {
            return ApiResponseUtils.conflict("Неможливо створити тип плями",
                    "Помилка при створенні типу плями: {}. Причина: {}", stainTypeDTO.getCode(), e.getMessage());
        }
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
    public ResponseEntity<?> updateStainType(
            @PathVariable UUID id,
            @Valid @RequestBody StainTypeDTO stainTypeDTO) {
        try {
            StainTypeDTO updatedStainType = stainTypeService.updateStainType(id, stainTypeDTO);
            return ApiResponseUtils.ok(updatedStainType, "REST запит на оновлення типу плями з ID {}: {}", id, stainTypeDTO);
        } catch (Exception e) {
            return ApiResponseUtils.notFound("Тип плями не знайдено або неможливо оновити",
                    "Помилка при оновленні типу плями з ID: {}. Причина: {}", id, e.getMessage());
        }
    }

    /**
     * Видалити тип плями.
     *
     * @param id ідентифікатор типу плями
     * @return статус операції
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Видалити тип плями", description = "Видаляє тип плями за вказаним ідентифікатором")
    public ResponseEntity<?> deleteStainType(@PathVariable UUID id) {
        try {
            stainTypeService.deleteStainType(id);
            return ApiResponseUtils.noContent("REST запит на деактивацію типу плями з ID: {}", id);
        } catch (Exception e) {
            return ApiResponseUtils.notFound("Тип плями не знайдено або неможливо видалити",
                    "Помилка при видаленні типу плями з ID: {}. Причина: {}", id, e.getMessage());
        }
    }
}
