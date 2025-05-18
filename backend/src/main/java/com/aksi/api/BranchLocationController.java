package com.aksi.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.branch.dto.BranchLocationCreateRequest;
import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.branch.dto.BranchLocationUpdateRequest;
import com.aksi.domain.branch.service.BranchLocationService;
import com.aksi.util.ApiResponseUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Контролер для роботи з API пунктів прийому замовлень.
 */
@RestController
@RequestMapping("/branch-locations")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Branch Locations API", description = "API для управління пунктами прийому замовлень")
public class BranchLocationController {
    
    private final BranchLocationService branchLocationService;
    
    @Operation(summary = "Отримати всі пункти прийому замовлень", 
               description = "Повертає список всіх пунктів прийому, якщо active=true - тільки активні")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успішно отримано список пунктів прийому",
                     content = @Content(schema = @Schema(implementation = BranchLocationDTO.class)))
    })
    @GetMapping
    public ResponseEntity<?> getAllBranchLocations(
            @RequestParam(required = false) Boolean active) {
        try {
            List<BranchLocationDTO> result;
            
            if (active != null && active) {
                log.info("Запит на отримання активних пунктів прийому");
                result = branchLocationService.getActiveBranchLocations();
                return ApiResponseUtils.ok(result, "Отримано {} активних пунктів прийому", result.size());
            } else {
                log.info("Запит на отримання всіх пунктів прийому");
                result = branchLocationService.getAllBranchLocations();
                return ApiResponseUtils.ok(result, "Отримано {} пунктів прийому", result.size());
            }
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні пунктів прийому", 
                    "Виникла несподівана помилка при отриманні пунктів прийому. Причина: {}", 
                    e.getMessage());
        }
    }
    
    @Operation(summary = "Отримати пункт прийому за ID", 
               description = "Повертає пункт прийому за вказаним ідентифікатором")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успішно отримано пункт прийому",
                     content = @Content(schema = @Schema(implementation = BranchLocationDTO.class))),
        @ApiResponse(responseCode = "404", description = "Пункт прийому не знайдено")
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> getBranchLocationById(@PathVariable UUID id) {
        log.info("Запит на отримання пункту прийому за ID: {}", id);
        
        try {
            BranchLocationDTO result = branchLocationService.getBranchLocationById(id);
            return ApiResponseUtils.ok(result, "Отримано пункт прийому за ID: {}", id);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Пункт прийому не знайдено", 
                    "Пункт прийому з ID: {} не знайдено. Причина: {}", id, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні пункту прийому", 
                    "Виникла несподівана помилка при отриманні пункту прийому з ID: {}. Причина: {}", 
                    id, e.getMessage());
        }
    }
    
    @Operation(summary = "Отримати пункт прийому за кодом", 
               description = "Повертає пункт прийому за вказаним кодом")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успішно отримано пункт прийому",
                     content = @Content(schema = @Schema(implementation = BranchLocationDTO.class))),
        @ApiResponse(responseCode = "404", description = "Пункт прийому не знайдено")
    })
    @GetMapping("/code/{code}")
    public ResponseEntity<?> getBranchLocationByCode(@PathVariable String code) {
        log.info("Запит на отримання пункту прийому за кодом: {}", code);
        
        try {
            BranchLocationDTO result = branchLocationService.getBranchLocationByCode(code);
            return ApiResponseUtils.ok(result, "Отримано пункт прийому за кодом: {}", code);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Пункт прийому не знайдено", 
                    "Пункт прийому з кодом: {} не знайдено. Причина: {}", code, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні пункту прийому", 
                    "Виникла несподівана помилка при отриманні пункту прийому з кодом: {}. Причина: {}", 
                    code, e.getMessage());
        }
    }
    
    @Operation(summary = "Створити новий пункт прийому", 
               description = "Створює новий пункт прийому замовлень")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Пункт прийому успішно створено",
                     content = @Content(schema = @Schema(implementation = BranchLocationDTO.class))),
        @ApiResponse(responseCode = "400", description = "Некоректні дані запиту"),
        @ApiResponse(responseCode = "409", description = "Пункт прийому з таким кодом вже існує")
    })
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> createBranchLocation(
            @Valid @RequestBody BranchLocationCreateRequest request) {
        log.info("Запит на створення нового пункту прийому: {}", request);
        
        try {
            BranchLocationDTO result = branchLocationService.createBranchLocation(request);
            return ApiResponseUtils.created(result, "Створено новий пункт прийому: {}", result.getName());
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.badRequest("Некоректні дані для створення пункту прийому", 
                    "Не вдалося створити пункт прийому. Причина: {}", e.getMessage());
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().contains("вже існує")) {
                return ApiResponseUtils.conflict("Пункт прийому з таким кодом вже існує", 
                        "Пункт прийому з кодом: {} вже існує.", request.getCode());
            }
            return ApiResponseUtils.internalServerError("Помилка при створенні пункту прийому", 
                    "Виникла несподівана помилка при створенні пункту прийому. Причина: {}", 
                    e.getMessage());
        }
    }
    
    @Operation(summary = "Оновити пункт прийому", 
               description = "Оновлює існуючий пункт прийому замовлень")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Пункт прийому успішно оновлено",
                     content = @Content(schema = @Schema(implementation = BranchLocationDTO.class))),
        @ApiResponse(responseCode = "400", description = "Некоректні дані запиту"),
        @ApiResponse(responseCode = "404", description = "Пункт прийому не знайдено"),
        @ApiResponse(responseCode = "409", description = "Пункт прийому з таким кодом вже існує")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> updateBranchLocation(
            @PathVariable UUID id,
            @Valid @RequestBody BranchLocationUpdateRequest request) {
        log.info("Запит на оновлення пункту прийому з ID: {}, дані: {}", id, request);
        
        try {
            BranchLocationDTO result = branchLocationService.updateBranchLocation(id, request);
            return ApiResponseUtils.ok(result, "Оновлено пункт прийому з ID: {}", id);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Пункт прийому не знайдено", 
                    "Пункт прийому з ID: {} не знайдено. Причина: {}", id, e.getMessage());
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().contains("вже існує")) {
                return ApiResponseUtils.conflict("Пункт прийому з таким кодом вже існує", 
                        "Не вдалося оновити пункт прийому. Код: {} вже використовується.", request.getCode());
            }
            return ApiResponseUtils.internalServerError("Помилка при оновленні пункту прийому", 
                    "Виникла несподівана помилка при оновленні пункту прийому з ID: {}. Причина: {}", 
                    id, e.getMessage());
        }
    }
    
    @Operation(summary = "Змінити статус активності", 
               description = "Змінює статус активності пункту прийому")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Статус активності успішно змінено",
                     content = @Content(schema = @Schema(implementation = BranchLocationDTO.class))),
        @ApiResponse(responseCode = "404", description = "Пункт прийому не знайдено")
    })
    @PutMapping("/{id}/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> setActiveStatus(
            @PathVariable UUID id,
            @RequestParam boolean active) {
        log.info("Запит на зміну статусу активності пункту прийому з ID: {} на: {}", id, active);
        
        try {
            BranchLocationDTO result = branchLocationService.setActive(id, active);
            return ApiResponseUtils.ok(result, "Змінено статус активності пункту прийому з ID: {} на: {}", id, active);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Пункт прийому не знайдено", 
                    "Пункт прийому з ID: {} не знайдено. Причина: {}", id, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при зміні статусу активності", 
                    "Виникла несподівана помилка при зміні статусу активності пункту прийому з ID: {}. Причина: {}", 
                    id, e.getMessage());
        }
    }
    
    @Operation(summary = "Видалити пункт прийому", 
               description = "Видаляє пункт прийому замовлень")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Пункт прийому успішно видалено"),
        @ApiResponse(responseCode = "404", description = "Пункт прийому не знайдено")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteBranchLocation(@PathVariable UUID id) {
        log.info("Запит на видалення пункту прийому з ID: {}", id);
        
        try {
            branchLocationService.deleteBranchLocation(id);
            return ApiResponseUtils.noContent("Видалено пункт прийому з ID: {}", id);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Пункт прийому не знайдено", 
                    "Пункт прийому з ID: {} не знайдено. Причина: {}", id, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при видаленні пункту прийому", 
                    "Виникла несподівана помилка при видаленні пункту прийому з ID: {}. Причина: {}", 
                    id, e.getMessage());
        }
    }
}
