package com.aksi.domain.order.statemachine.adapter;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.statemachine.StateMachine;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.service.OrderStateMachineService;
import com.aksi.domain.order.statemachine.service.OrderWizardSessionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST API контролер для Order Wizard State Machine.
 * Забезпечує взаємодію фронтенду з машиною станів замовлення.
 */
@RestController
@RequestMapping("/api/order-wizard")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Order Wizard", description = "API для управління Order Wizard State Machine")
public class OrderWizardController {

    private final OrderStateMachineService stateMachineService;
    private final OrderWizardSessionService sessionService;

    /**
     * Створює нову сесію Order Wizard.
     */
    @PostMapping("/sessions")
    @Operation(summary = "Створити нову сесію Order Wizard",
               description = "Ініціалізує нову сесію замовлення та запускає State Machine")
    public ResponseEntity<WizardSessionResponse> createSession() {
        log.info("Створення нової сесії Order Wizard");

        try {
            // Створюємо нову сесію
            UUID sessionId = UUID.randomUUID();

            // Ініціалізуємо State Machine
            StateMachine<OrderState, OrderEvent> stateMachine = stateMachineService.createOrderStateMachine(sessionId);

            // Запускаємо Order Wizard
            boolean started = stateMachineService.sendEvent(sessionId, OrderEvent.START_ORDER);

            if (!started) {
                log.error("Не вдалося запустити Order Wizard для сесії: {}", sessionId);
                return ResponseEntity.badRequest().build();
            }

            WizardSessionResponse response = WizardSessionResponse.builder()
                .sessionId(sessionId)
                .currentState(stateMachine.getState().getId())
                .message("Order Wizard успішно запущено")
                .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Помилка створення сесії Order Wizard: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Отримує інформацію про поточну сесію.
     */
    @GetMapping("/sessions/{sessionId}")
    @Operation(summary = "Отримати інформацію про сесію",
               description = "Повертає поточний стан та інформацію про сесію Order Wizard")
    public ResponseEntity<WizardSessionInfo> getSessionInfo(
            @Parameter(description = "ID сесії Order Wizard")
            @PathVariable UUID sessionId) {

        log.debug("Отримання інформації про сесію: {}", sessionId);

        // Перевіряємо чи існує сесія
        if (!sessionService.isSessionActive(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        // Отримуємо поточний стан
        OrderState currentState = stateMachineService.getCurrentState(sessionId);
        if (currentState == null) {
            return ResponseEntity.notFound().build();
        }

        OrderWizardSessionService.WizardSession session = sessionService.getSession(sessionId);

        WizardSessionInfo info = WizardSessionInfo.builder()
            .sessionId(sessionId)
            .currentState(currentState)
            .createdAt(session.getCreatedAt())
            .lastActivity(session.getLastActivity())
            .data(session.getSessionData())
            .build();

        return ResponseEntity.ok(info);
    }

    /**
     * Відправляє подію до State Machine.
     */
    @PostMapping("/sessions/{sessionId}/events")
    @Operation(summary = "Відправити подію до State Machine",
               description = "Обробляє подію в контексті поточної сесії Order Wizard")
    public ResponseEntity<EventResponse> sendEvent(
            @Parameter(description = "ID сесії Order Wizard")
            @PathVariable UUID sessionId,
            @RequestBody EventRequest request) {

        log.info("Відправка події {} для сесії {}", request.getEvent(), sessionId);

        // Перевіряємо чи існує сесія
        if (!sessionService.isSessionActive(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        try {
            // Додаємо дані до контексту якщо є
            if (request.getData() != null && !request.getData().isEmpty()) {
                StateMachine<OrderState, OrderEvent> stateMachine = stateMachineService.getStateMachine(sessionId);
                if (stateMachine != null) {
                    request.getData().forEach((key, value) ->
                        stateMachine.getExtendedState().getVariables().put(key, value));
                }
            }

            // Відправляємо подію
            boolean processed = stateMachineService.sendEvent(sessionId, request.getEvent());

            // Отримуємо новий стан
            OrderState newState = stateMachineService.getCurrentState(sessionId);

            EventResponse response = EventResponse.builder()
                .processed(processed)
                .newState(newState)
                .message(processed ? "Подію успішно оброблено" : "Подію не прийнято")
                .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Помилка обробки події {} для сесії {}: {}", request.getEvent(), sessionId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Завершує сесію Order Wizard.
     */
    @DeleteMapping("/sessions/{sessionId}")
    @Operation(summary = "Завершити сесію Order Wizard",
               description = "Завершує роботу сесії та очищує ресурси")
    public ResponseEntity<Void> completeSession(
            @Parameter(description = "ID сесії Order Wizard")
            @PathVariable UUID sessionId) {

        log.info("Завершення сесії Order Wizard: {}", sessionId);

        try {
            stateMachineService.completeStateMachine(sessionId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Помилка завершення сесії {}: {}", sessionId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Скасовує сесію Order Wizard.
     */
    @PostMapping("/sessions/{sessionId}/cancel")
    @Operation(summary = "Скасувати сесію Order Wizard",
               description = "Скасовує поточну сесію замовлення")
    public ResponseEntity<Void> cancelSession(
            @Parameter(description = "ID сесії Order Wizard")
            @PathVariable UUID sessionId) {

        log.info("Скасування сесії Order Wizard: {}", sessionId);

        try {
            stateMachineService.cancelStateMachine(sessionId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Помилка скасування сесії {}: {}", sessionId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Отримує статистику активних сесій.
     */
    @GetMapping("/stats")
    @Operation(summary = "Отримати статистику Order Wizard",
               description = "Повертає інформацію про активні сесії та State Machine")
    public ResponseEntity<WizardStats> getStats() {
        WizardStats stats = WizardStats.builder()
            .activeStateMachines(stateMachineService.getActiveStateMachinesCount())
            .build();

        return ResponseEntity.ok(stats);
    }

    // DTO класи для API

    @lombok.Data
    @lombok.Builder
    public static class WizardSessionResponse {
        private UUID sessionId;
        private OrderState currentState;
        private String message;
    }

    @lombok.Data
    @lombok.Builder
    public static class WizardSessionInfo {
        private UUID sessionId;
        private OrderState currentState;
        private java.time.LocalDateTime createdAt;
        private java.time.LocalDateTime lastActivity;
        private Map<String, Object> data;
    }

    @lombok.Data
    public static class EventRequest {
        private OrderEvent event;
        private Map<String, Object> data;
    }

    @lombok.Data
    @lombok.Builder
    public static class EventResponse {
        private boolean processed;
        private OrderState newState;
        private String message;
    }

    @lombok.Data
    @lombok.Builder
    public static class WizardStats {
        private int activeStateMachines;
    }
}
