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

import com.aksi.domain.pricing.dto.DefectTypeDTO;
import com.aksi.domain.pricing.enums.RiskLevel;
import com.aksi.domain.pricing.service.DefectTypeService;
import com.aksi.util.ApiResponseUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST контролер для управління типами дефектів.
 */
@RestController
@RequestMapping("/defect-types")
@RequiredArgsConstructor
@Tag(name = "Pricing - Defect Types", description = "API для управління типами дефектів")
@Slf4j
public class DefectTypeController {

    private final DefectTypeService defectTypeService;

    /**
     * Отримати всі типи дефектів.
     *
     * @param activeOnly прапорець для отримання лише активних типів
     * @param riskLevel рівень ризику для фільтрації (опціонально)
     * @return список типів дефектів
     */
    @GetMapping
    @Operation(summary = "Отримати типи дефектів", description = "Повертає список всіх або тільки активних типів дефектів з можливістю фільтрації за рівнем ризику")
    public ResponseEntity<List<DefectTypeDTO>> getDefectTypes(
            @RequestParam(name = "activeOnly", defaultValue = "true") boolean activeOnly,
            @RequestParam(name = "riskLevel", required = false) RiskLevel riskLevel) {

        List<DefectTypeDTO> defectTypes;

        if (riskLevel != null) {
            defectTypes = defectTypeService.getDefectTypesByRiskLevel(riskLevel);
            return ApiResponseUtils.ok(defectTypes, "REST запит на отримання типів дефектів з рівнем ризику: {}", riskLevel);
        } else if (activeOnly) {
            defectTypes = defectTypeService.getActiveDefectTypes();
            return ApiResponseUtils.ok(defectTypes, "REST запит на отримання активних типів дефектів");
        } else {
            defectTypes = defectTypeService.getAllDefectTypes();
            return ApiResponseUtils.ok(defectTypes, "REST запит на отримання всіх типів дефектів");
        }
    }

    /**
     * Отримати тип дефекту за ідентифікатором.
     *
     * @param id ідентифікатор типу дефекту
     * @return тип дефекту
     */
    @GetMapping("/{id}")
    @Operation(summary = "Отримати тип дефекту за ID", description = "Повертає тип дефекту за вказаним ідентифікатором")
    public ResponseEntity<?> getDefectTypeById(@PathVariable UUID id) {
        DefectTypeDTO defectType = defectTypeService.getDefectTypeById(id);
        if (defectType == null) {
            return ApiResponseUtils.notFound("Тип дефекту не знайдено", "Тип дефекту з ID: {} не знайдено", id);
        }
        return ApiResponseUtils.ok(defectType, "REST запит на отримання типу дефекту за ID: {}", id);
    }

    /**
     * Отримати тип дефекту за кодом.
     *
     * @param code код типу дефекту
     * @return тип дефекту
     */
    @GetMapping("/by-code/{code}")
    @Operation(summary = "Отримати тип дефекту за кодом", description = "Повертає тип дефекту за вказаним кодом")
    public ResponseEntity<?> getDefectTypeByCode(@PathVariable String code) {
        DefectTypeDTO defectType = defectTypeService.getDefectTypeByCode(code);
        if (defectType == null) {
            return ApiResponseUtils.notFound("Тип дефекту не знайдено", "Тип дефекту з кодом: {} не знайдено", code);
        }
        return ApiResponseUtils.ok(defectType, "REST запит на отримання типу дефекту за кодом: {}", code);
    }

    /**
     * Створити новий тип дефекту.
     *
     * @param defectTypeDTO дані нового типу дефекту
     * @return створений тип дефекту
     */
    @PostMapping
    @Operation(summary = "Створити тип дефекту", description = "Створює новий тип дефекту з вказаними даними")
    public ResponseEntity<DefectTypeDTO> createDefectType(@Valid @RequestBody DefectTypeDTO defectTypeDTO) {
        DefectTypeDTO createdDefectType = defectTypeService.createDefectType(defectTypeDTO);
        return ApiResponseUtils.created(createdDefectType, "REST запит на створення нового типу дефекту: {}", defectTypeDTO);
    }

    /**
     * Оновити існуючий тип дефекту.
     *
     * @param id ідентифікатор типу дефекту
     * @param defectTypeDTO нові дані типу дефекту
     * @return оновлений тип дефекту
     */
    @PutMapping("/{id}")
    @Operation(summary = "Оновити тип дефекту", description = "Оновлює існуючий тип дефекту за вказаним ідентифікатором")
    public ResponseEntity<DefectTypeDTO> updateDefectType(
            @PathVariable UUID id,
            @Valid @RequestBody DefectTypeDTO defectTypeDTO) {
        DefectTypeDTO updatedDefectType = defectTypeService.updateDefectType(id, defectTypeDTO);
        return ApiResponseUtils.ok(updatedDefectType, "REST запит на оновлення типу дефекту з ID {}: {}", id, defectTypeDTO);
    }

    /**
     * Видалити тип дефекту.
     *
     * @param id ідентифікатор типу дефекту
     * @return статус операції
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Видалити тип дефекту", description = "Видаляє тип дефекту за вказаним ідентифікатором")
    public ResponseEntity<Void> deleteDefectType(@PathVariable UUID id) {
        defectTypeService.deleteDefectType(id);
        return ApiResponseUtils.noContent("REST запит на деактивацію типу дефекту з ID: {}", id);
    }
}
