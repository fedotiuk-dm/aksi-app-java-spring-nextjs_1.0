package com.aksi.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
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
    public ResponseEntity<List<BranchLocationDTO>> getAllBranchLocations(
            @RequestParam(required = false) Boolean active) {
        log.debug("REST запит на отримання пунктів прийому, active={}", active);
        
        List<BranchLocationDTO> result;
        if (active != null && active) {
            result = branchLocationService.getActiveBranchLocations();
        } else {
            result = branchLocationService.getAllBranchLocations();
        }
        
        return ResponseEntity.ok(result);
    }
    
    @Operation(summary = "Отримати пункт прийому за ID", 
               description = "Повертає пункт прийому за вказаним ідентифікатором")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успішно отримано пункт прийому",
                     content = @Content(schema = @Schema(implementation = BranchLocationDTO.class))),
        @ApiResponse(responseCode = "404", description = "Пункт прийому не знайдено")
    })
    @GetMapping("/{id}")
    public ResponseEntity<BranchLocationDTO> getBranchLocationById(@PathVariable UUID id) {
        log.debug("REST запит на отримання пункту прийому за ID: {}", id);
        BranchLocationDTO result = branchLocationService.getBranchLocationById(id);
        return ResponseEntity.ok(result);
    }
    
    @Operation(summary = "Отримати пункт прийому за кодом", 
               description = "Повертає пункт прийому за вказаним кодом")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успішно отримано пункт прийому",
                     content = @Content(schema = @Schema(implementation = BranchLocationDTO.class))),
        @ApiResponse(responseCode = "404", description = "Пункт прийому не знайдено")
    })
    @GetMapping("/code/{code}")
    public ResponseEntity<BranchLocationDTO> getBranchLocationByCode(@PathVariable String code) {
        log.debug("REST запит на отримання пункту прийому за кодом: {}", code);
        BranchLocationDTO result = branchLocationService.getBranchLocationByCode(code);
        return ResponseEntity.ok(result);
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
    public ResponseEntity<BranchLocationDTO> createBranchLocation(
            @Valid @RequestBody BranchLocationCreateRequest request) {
        log.debug("REST запит на створення нового пункту прийому: {}", request);
        BranchLocationDTO result = branchLocationService.createBranchLocation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
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
    public ResponseEntity<BranchLocationDTO> updateBranchLocation(
            @PathVariable UUID id,
            @Valid @RequestBody BranchLocationUpdateRequest request) {
        log.debug("REST запит на оновлення пункту прийому з ID: {}, дані: {}", id, request);
        BranchLocationDTO result = branchLocationService.updateBranchLocation(id, request);
        return ResponseEntity.ok(result);
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
    public ResponseEntity<BranchLocationDTO> setActiveStatus(
            @PathVariable UUID id,
            @RequestParam boolean active) {
        log.debug("REST запит на зміну статусу активності пункту прийому з ID: {} на: {}", id, active);
        BranchLocationDTO result = branchLocationService.setActive(id, active);
        return ResponseEntity.ok(result);
    }
    
    @Operation(summary = "Видалити пункт прийому", 
               description = "Видаляє пункт прийому замовлень")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Пункт прийому успішно видалено"),
        @ApiResponse(responseCode = "404", description = "Пункт прийому не знайдено")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBranchLocation(@PathVariable UUID id) {
        log.debug("REST запит на видалення пункту прийому з ID: {}", id);
        branchLocationService.deleteBranchLocation(id);
        return ResponseEntity.noContent().build();
    }
}
