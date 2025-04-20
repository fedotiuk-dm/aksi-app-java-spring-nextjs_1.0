package com.aksi.api;

import com.aksi.dto.order.ReceptionPointDTO;
import com.aksi.service.order.ReceptionPointService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST контролер для роботи з пунктами прийому замовлень
 */
@RestController
@RequestMapping("/reception-points")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Reception Points", description = "API для управління пунктами прийому замовлень")
public class ReceptionPointController {
    
    private final ReceptionPointService receptionPointService;
    
    /**
     * Отримати всі активні пункти прийому
     * @return список активних пунктів прийому
     */
    @GetMapping
    @Operation(summary = "Отримати всі активні пункти прийому", 
              description = "Повертає список всіх активних пунктів прийому замовлень")
    public ResponseEntity<List<ReceptionPointDTO>> getActiveReceptionPoints() {
        log.info("REST запит на отримання активних пунктів прийому");
        List<ReceptionPointDTO> result = receptionPointService.getActiveReceptionPoints();
        return ResponseEntity.ok(result);
    }
    
    /**
     * Отримати всі пункти прийому (активні та неактивні)
     * @return список всіх пунктів прийому
     */
    @GetMapping("/all")
    @Operation(summary = "Отримати всі пункти прийому", 
              description = "Повертає список всіх пунктів прийому замовлень (активних та неактивних)")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<ReceptionPointDTO>> getAllReceptionPoints() {
        log.info("REST запит на отримання всіх пунктів прийому");
        List<ReceptionPointDTO> result = receptionPointService.getAllReceptionPoints();
        return ResponseEntity.ok(result);
    }
    
    /**
     * Отримати пункт прийому за ідентифікатором
     * @param id ідентифікатор пункту прийому
     * @return дані пункту прийому
     */
    @GetMapping("/{id}")
    @Operation(summary = "Отримати пункт прийому за ідентифікатором", 
              description = "Повертає дані пункту прийому за його ідентифікатором")
    public ResponseEntity<ReceptionPointDTO> getReceptionPointById(
            @Parameter(description = "Ідентифікатор пункту прийому") 
            @PathVariable UUID id) {
        log.info("REST запит на отримання пункту прийому за ідентифікатором: {}", id);
        ReceptionPointDTO result = receptionPointService.getReceptionPointById(id);
        return ResponseEntity.ok(result);
    }
    
    /**
     * Створити новий пункт прийому
     * @param dto дані нового пункту прийому
     * @return дані створеного пункту прийому
     */
    @PostMapping
    @Operation(summary = "Створити новий пункт прийому", 
              description = "Створює новий пункт прийому замовлень")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ReceptionPointDTO> createReceptionPoint(
            @Valid @RequestBody ReceptionPointDTO dto) {
        log.info("REST запит на створення нового пункту прийому: {}", dto.getName());
        ReceptionPointDTO result = receptionPointService.createReceptionPoint(dto);
        return ResponseEntity.ok(result);
    }
    
    /**
     * Оновити існуючий пункт прийому
     * @param id ідентифікатор пункту прийому
     * @param dto нові дані пункту прийому
     * @return оновлені дані пункту прийому
     */
    @PutMapping("/{id}")
    @Operation(summary = "Оновити пункт прийому", 
              description = "Оновлює дані існуючого пункту прийому замовлень")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ReceptionPointDTO> updateReceptionPoint(
            @Parameter(description = "Ідентифікатор пункту прийому") 
            @PathVariable UUID id,
            @Valid @RequestBody ReceptionPointDTO dto) {
        log.info("REST запит на оновлення пункту прийому з ідентифікатором: {}", id);
        ReceptionPointDTO result = receptionPointService.updateReceptionPoint(id, dto);
        return ResponseEntity.ok(result);
    }
    
    /**
     * Змінити статус активності пункту прийому
     * @param id ідентифікатор пункту прийому
     * @param active новий статус активності
     * @return оновлені дані пункту прийому
     */
    @PatchMapping("/{id}/status")
    @Operation(summary = "Змінити статус активності пункту прийому", 
              description = "Змінює статус активності (активний/неактивний) пункту прийому замовлень")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ReceptionPointDTO> setReceptionPointStatus(
            @Parameter(description = "Ідентифікатор пункту прийому") 
            @PathVariable UUID id,
            @Parameter(description = "Статус активності (true - активний, false - неактивний)") 
            @RequestParam boolean active) {
        log.info("REST запит на зміну статусу активності пункту прийому з ідентифікатором: {} на {}", id, active);
        ReceptionPointDTO result = receptionPointService.setReceptionPointStatus(id, active);
        return ResponseEntity.ok(result);
    }
}
