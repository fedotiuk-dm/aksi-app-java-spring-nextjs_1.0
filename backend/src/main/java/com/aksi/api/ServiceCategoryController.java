package com.aksi.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.pricing.dto.ServiceCategoryDTO;
import com.aksi.domain.pricing.service.ServiceCategoryService;
import com.aksi.util.ApiResponseUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Контролер для роботи з категоріями послуг.
 */
@RestController
@RequestMapping("/service-categories")
@Tag(name = "Service Category", description = "API для роботи з категоріями послуг")
@RequiredArgsConstructor
@Slf4j
public class ServiceCategoryController {

    private final ServiceCategoryService serviceCategoryService;

    /**
     * Отримати список всіх активних категорій послуг.
     *
     * @return Список всіх активних категорій послуг
     */
    @GetMapping
    @Operation(summary = "Отримати список всіх активних категорій послуг")
    public ResponseEntity<?> getAllActiveCategories() {
        try {
            List<ServiceCategoryDTO> categories = serviceCategoryService.getAllActiveCategories();
            if (categories == null || categories.isEmpty()) {
                return ApiResponseUtils.ok(categories, "Активні категорії послуг відсутні");
            }
            return ApiResponseUtils.ok(categories, "REST запит на отримання списку всіх активних категорій послуг");
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні списку категорій",
                "Помилка при отриманні списку активних категорій: {}", e.getMessage());
        }
    }

    /**
     * Отримати категорію послуг за ID.
     *
     * @param id ID категорії послуг
     * @return Категорія послуг
     */
    @GetMapping("/{id}")
    @Operation(summary = "Отримати категорію послуг за ID")
    public ResponseEntity<?> getCategoryById(@PathVariable UUID id) {
        try {
            ServiceCategoryDTO category = serviceCategoryService.getCategoryById(id);
            if (category == null) {
                return ApiResponseUtils.notFound("Категорію послуг не знайдено",
                    "Категорію послуг з ID: {} не знайдено", id);
            }
            return ApiResponseUtils.ok(category, "REST запит на отримання категорії послуг за ID: {}", id);
        } catch (Exception e) {
            return ApiResponseUtils.badRequest("Помилка при отриманні категорії послуг",
                "Помилка при отриманні категорії послуг з ID: {}. Причина: {}", id, e.getMessage());
        }
    }

    /**
     * Отримати категорію послуг за кодом.
     *
     * @param code Код категорії послуг
     * @return Категорія послуг
     */
    @GetMapping("/code/{code}")
    @Operation(summary = "Отримати категорію послуг за кодом")
    public ResponseEntity<?> getCategoryByCode(@PathVariable String code) {
        try {
            ServiceCategoryDTO category = serviceCategoryService.getCategoryByCode(code);
            if (category == null) {
                return ApiResponseUtils.notFound("Категорію послуг не знайдено",
                    "Категорію послуг з кодом: {} не знайдено", code);
            }
            return ApiResponseUtils.ok(category, "REST запит на отримання категорії послуг за кодом: {}", code);
        } catch (Exception e) {
            return ApiResponseUtils.badRequest("Помилка при отриманні категорії послуг",
                "Помилка при отриманні категорії послуг з кодом: {}. Причина: {}", code, e.getMessage());
        }
    }
}
