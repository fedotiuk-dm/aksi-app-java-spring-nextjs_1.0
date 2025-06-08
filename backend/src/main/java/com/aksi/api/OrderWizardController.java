package com.aksi.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.statemachine.adapter.OrderWizardStateMachineAdapterSimplified;
import com.aksi.domain.order.statemachine.dto.OrderWizardDataResponse;
import com.aksi.domain.order.statemachine.dto.StateTransitionRequestDTO;
import com.aksi.domain.order.statemachine.dto.StateTransitionResponseDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST API контролер для Order Wizard.
 *
 * Забезпечує API для:
 * - Створення та управління wizard сесіями
 * - Виконання переходів між етапами
 * - Отримання даних wizard
 *
 * Використовує модульну архітектуру з новими DTO.
 */
@RestController
@RequestMapping("/api/order-wizard")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Order Wizard", description = "API для управління Order Wizard")
public class OrderWizardController {

    private final OrderWizardStateMachineAdapterSimplified wizardAdapter;

    /**
     * Створює нову сесію Order Wizard.
     */
    @PostMapping("/create")
    @Operation(summary = "Створити нову сесію Order Wizard",
               description = "Ініціалізує нову сесію Order Wizard та повертає wizardId")
    public ResponseEntity<StateTransitionResponseDTO> createWizardSession() {
        log.info("API: Запит на створення нової сесії Order Wizard");

        try {
            StateTransitionResponseDTO response = wizardAdapter.createNewWizardSession();

            if (Boolean.TRUE.equals(response.getSuccess())) {
                log.info("API: Сесію wizard створено успішно: {}", response.getWizardId());
                return ResponseEntity.ok(response);
            } else {
                log.warn("API: Помилка створення сесії wizard: {}", response.getErrors());
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            log.error("API: Критична помилка створення сесії wizard: {}", e.getMessage(), e);

            StateTransitionResponseDTO errorResponse = StateTransitionResponseDTO.builder()
                .success(false)
                .errors(java.util.List.of("Критична помилка сервера: " + e.getMessage()))
                .build();

            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Виконує перехід між станами wizard.
     */
    @PostMapping("/transition")
    @Operation(summary = "Виконати перехід між станами",
               description = "Обробляє перехід wizard між станами на основі події")
    public ResponseEntity<StateTransitionResponseDTO> processTransition(
            @Valid @RequestBody StateTransitionRequestDTO request) {

        log.info("API: Запит на перехід wizard: {}, подія: {}",
            request.getWizardId(), request.getEvent());

        try {
            StateTransitionResponseDTO response = wizardAdapter.processTransition(request);

            if (Boolean.TRUE.equals(response.getSuccess())) {
                log.info("API: Перехід виконано успішно: {} -> {}",
                    response.getPreviousState(), response.getCurrentState());
                return ResponseEntity.ok(response);
            } else {
                log.warn("API: Помилка переходу wizard {}: {}",
                    request.getWizardId(), response.getErrors());
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            log.error("API: Критична помилка переходу wizard {}: {}",
                request.getWizardId(), e.getMessage(), e);

            StateTransitionResponseDTO errorResponse = StateTransitionResponseDTO.builder()
                .wizardId(request.getWizardId())
                .success(false)
                .errors(java.util.List.of("Критична помилка сервера: " + e.getMessage()))
                .build();

            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Отримує повні дані wizard сесії.
     */
    @GetMapping("/{wizardId}")
    @Operation(summary = "Отримати дані wizard",
               description = "Повертає повну інформацію про стан wizard сесії")
    public ResponseEntity<OrderWizardDataResponse> getWizardData(
            @PathVariable String wizardId) {

        log.info("API: Запит на отримання даних wizard: {}", wizardId);

        try {
            OrderWizardDataResponse response = wizardAdapter.getWizardData(wizardId);

            log.info("API: Дані wizard {} отримано успішно, стан: {}",
                wizardId, response.getContext().getCurrentState());

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.warn("API: Wizard не знайдено: {}", e.getMessage());
            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            log.error("API: Критична помилка отримання даних wizard {}: {}",
                wizardId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Отримує статус wizard сесії (спрощена версія).
     */
    @GetMapping("/{wizardId}/status")
    @Operation(summary = "Отримати статус wizard",
               description = "Повертає базовий статус wizard сесії")
    public ResponseEntity<Object> getWizardStatus(@PathVariable String wizardId) {

        log.info("API: Запит на отримання статусу wizard: {}", wizardId);

        try {
            OrderWizardDataResponse data = wizardAdapter.getWizardData(wizardId);

            // Формуємо спрощений статус
            var status = java.util.Map.of(
                "wizardId", wizardId,
                "currentState", data.getContext().getCurrentState(),
                "isActive", data.getSession().getIsActive(),
                "lastUpdated", data.getSession().getUpdatedAt(),
                "currentStage", data.getCompletionStatus().getCurrentStageNumber(),
                "stageName", data.getCompletionStatus().getCurrentStageName()
            );

            return ResponseEntity.ok(status);

        } catch (IllegalArgumentException e) {
            log.warn("API: Wizard не знайдено: {}", e.getMessage());
            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            log.error("API: Критична помилка отримання статусу wizard {}: {}",
                wizardId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
