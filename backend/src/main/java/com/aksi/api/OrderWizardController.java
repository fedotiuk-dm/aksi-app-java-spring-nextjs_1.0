package com.aksi.api;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.dto.CreateOrderRequest;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.OrderWizardAction;
import com.aksi.domain.order.statemachine.dto.OrderWizardDataResponse;
import com.aksi.domain.order.statemachine.dto.OrderWizardSessionResponse;
import com.aksi.domain.order.statemachine.entity.OrderWizardSessionEntity;
import com.aksi.domain.order.statemachine.mapper.OrderWizardSessionMapper;
import com.aksi.domain.order.statemachine.service.OrderWizardActionService;
import com.aksi.domain.order.statemachine.service.OrderWizardPersistenceService;
import com.aksi.domain.order.statemachine.service.OrderWizardStateMachineService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Головний REST API контролер для Order Wizard State Machine
 *
 * Відповідає за основні операції управління wizard:
 * - Створення та ініціалізацію wizard
 * - Отримання загального стану wizard
 * - Завершення та скасування wizard
 * - Управління активними wizards
 *
 * Конкретні операції етапів винесені в окремі контролери:
 * - OrderWizardStage1Controller - Етап 1 (Клієнт та базова інформація)
 */
@RestController
@RequestMapping("/api/order-wizard")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@Tag(name = "Order Wizard", description = "API для управління Order Wizard")
public class OrderWizardController {

    private final OrderWizardStateMachineService wizardService;
    private final OrderWizardPersistenceService persistenceService;
    private final OrderWizardSessionMapper sessionMapper;
    private final OrderWizardActionService actionService;

    /**
     * Створення нового Order Wizard
     */
    @PostMapping("/create")
    @Operation(summary = "Створити новий Order Wizard",
               description = "Створює нову сесію Order Wizard для оформлення замовлення")
    @ApiResponse(responseCode = "200", description = "Wizard успішно створено")
    public ResponseEntity<OrderWizardSessionResponse> createWizard() {
        log.info("Створення нового Order Wizard");

        try {
            String wizardId = wizardService.createNewWizard();

            // Отримуємо збережену сесію з БД
            Optional<OrderWizardSessionEntity> sessionOpt = persistenceService.getWizardSession(wizardId);

            if (sessionOpt.isPresent()) {
                OrderWizardSessionResponse response = sessionMapper.toResponse(sessionOpt.get());
                return ResponseEntity.ok(response);
            } else {
                throw new RuntimeException("Не вдалося знайти створену сесію");
            }

        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("Помилка валідації при створенні Order Wizard: {}", e.getMessage(), e);
            throw new RuntimeException("Помилка валідації wizard: " + e.getMessage());
        } catch (RuntimeException e) {
            log.error("Помилка виконання при створенні Order Wizard: {}", e.getMessage(), e);
            throw new RuntimeException("Помилка створення wizard: " + e.getMessage());
        } catch (Exception e) {
            log.error("Непередбачена помилка при створенні Order Wizard: {}", e.getMessage(), e);
            throw new RuntimeException("Системна помилка створення wizard: " + e.getMessage());
        }
    }

    /**
     * Отримання поточного стану wizard
     */
    @GetMapping("/{wizardId}/state")
    @Operation(summary = "Отримати стан Order Wizard",
               description = "Повертає поточний стан wizard та всі збережені дані")
    @ApiResponse(responseCode = "200", description = "Стан wizard успішно отримано")
    @ApiResponse(responseCode = "404", description = "Wizard не знайдено")
    public ResponseEntity<OrderWizardDataResponse> getWizardState(@PathVariable String wizardId) {
        try {
            // Отримуємо сесію з БД
            Optional<OrderWizardSessionEntity> sessionOpt = persistenceService.getWizardSession(wizardId);

            if (sessionOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Отримуємо поточний стан та дані з State Machine
            OrderState currentState = wizardService.getCurrentState(wizardId);
            Map<Object, Object> wizardData = wizardService.getWizardData(wizardId);

            // Конвертуємо дані для відповіді
            Map<String, Object> cleanData = wizardData.entrySet().stream()
                .filter(entry -> entry.getKey() instanceof String)
                .collect(Collectors.toMap(
                    entry -> (String) entry.getKey(),
                    Map.Entry::getValue
                ));

            // Створюємо відповідь
            OrderWizardSessionResponse sessionResponse = sessionMapper.toResponse(sessionOpt.get());
            sessionResponse.setCurrentState(currentState);

            // Визначаємо доступні дії
            Map<String, Boolean> availableActions = actionService.getAvailableActions(currentState, cleanData);

            OrderWizardDataResponse response = OrderWizardDataResponse.builder()
                .session(sessionResponse)
                .data(cleanData)
                .availableActions(availableActions)
                .build();

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Помилка отримання стану wizard {}: {}", wizardId, e.getMessage(), e);

            OrderWizardDataResponse errorResponse = OrderWizardDataResponse.builder()
                .validationErrors(Map.of("error", "Помилка отримання стану"))
                .build();

            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Завершення wizard і створення реального замовлення
     */
    @PostMapping("/{wizardId}/complete")
    public ResponseEntity<?> completeWizard(
            @PathVariable String wizardId,
            @RequestBody CreateOrderRequest orderRequest) {

        log.info("Завершення wizard: {}", wizardId);

        try {
            // Тут можна додати логіку створення реального замовлення
            // використовуючи існуючий OrderService

            wizardService.closeWizard(wizardId);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Wizard завершено успішно"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Помилка завершення wizard {}: {}", wizardId, e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Помилка завершення"));
        }
    }

    /**
     * Скасування wizard
     */
    @DeleteMapping("/{wizardId}")
    public ResponseEntity<?> cancelWizard(@PathVariable String wizardId) {
        log.info("Скасування wizard: {}", wizardId);

        try {
            wizardService.closeWizard(wizardId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Wizard скасовано успішно"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Помилка скасування wizard {}: {}", wizardId, e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Внутрішня помилка"));
        }
    }

    /**
     * Отримання списку активних wizards
     */
    @GetMapping("/active")
    public ResponseEntity<Map<String, OrderState>> getActiveWizards() {
        try {
            Map<String, OrderState> activeWizards = wizardService.getActiveWizards();
            return ResponseEntity.ok(activeWizards);
        } catch (Exception e) {
            log.error("Помилка отримання активних wizards: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Отримання доступних дій для wizard
     */
    @GetMapping("/{wizardId}/actions")
    @Operation(summary = "Отримати доступні дії для Order Wizard",
               description = "Повертає список доступних дій для поточного стану wizard")
    @ApiResponse(responseCode = "200", description = "Дії успішно отримані")
    @ApiResponse(responseCode = "404", description = "Wizard не знайдено")
    public ResponseEntity<Map<String, Boolean>> getAvailableActions(@PathVariable String wizardId) {
        try {
            // Отримуємо поточний стан та дані
            OrderState currentState = wizardService.getCurrentState(wizardId);
            Map<Object, Object> wizardData = wizardService.getWizardData(wizardId);

            // Конвертуємо дані для обробки
            Map<String, Object> cleanData = wizardData.entrySet().stream()
                .filter(entry -> entry.getKey() instanceof String)
                .collect(Collectors.toMap(
                    entry -> (String) entry.getKey(),
                    Map.Entry::getValue
                ));

            // Визначаємо доступні дії
            Map<String, Boolean> availableActions = actionService.getAvailableActions(currentState, cleanData);

            return ResponseEntity.ok(availableActions);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Помилка отримання дій для wizard {}: {}", wizardId, e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of());
        }
    }

    /**
     * Виконання дії в wizard
     */
    @PostMapping("/{wizardId}/action/{actionName}")
    @Operation(summary = "Виконати дію в Order Wizard",
               description = "Виконує певну дію в wizard на основі OrderWizardAction enum")
    @ApiResponse(responseCode = "200", description = "Дія виконана успішно")
    @ApiResponse(responseCode = "400", description = "Недопустима дія")
    @ApiResponse(responseCode = "404", description = "Wizard не знайдено")
    public ResponseEntity<?> executeAction(
            @PathVariable String wizardId,
            @PathVariable String actionName,
            @RequestBody(required = false) Map<String, Object> actionData) {

        log.info("Виконання дії {} для wizard {}", actionName, wizardId);

        try {
            // Перевіряємо чи існує така дія
            OrderWizardAction action;
            try {
                action = OrderWizardAction.valueOf(actionName.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Невідома дія: " + actionName,
                    "availableActions", Arrays.stream(OrderWizardAction.values())
                        .map(OrderWizardAction::getActionName)
                        .toList()
                ));
            }

            // Перевіряємо чи дія доступна зараз
            OrderState currentState = wizardService.getCurrentState(wizardId);
            Map<Object, Object> wizardData = wizardService.getWizardData(wizardId);

            Map<String, Object> cleanData = wizardData.entrySet().stream()
                .filter(entry -> entry.getKey() instanceof String)
                .collect(Collectors.toMap(
                    entry -> (String) entry.getKey(),
                    Map.Entry::getValue
                ));

            Map<String, Boolean> availableActions = actionService.getAvailableActions(currentState, cleanData);

            if (!availableActions.getOrDefault(action.getActionName(), false)) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Дія недоступна в поточному стані: " + currentState,
                    "action", action.getActionName(),
                    "availableActions", availableActions
                ));
            }

            // Виконуємо дію залежно від типу
            Object result = switch (action) {
                case GET_STATE -> getCurrentWizardState(wizardId);
                case CANCEL -> {
                    wizardService.closeWizard(wizardId);
                    yield Map.of("success", true, "message", "Wizard скасовано");
                }
                default -> Map.of(
                    "success", true,
                    "message", "Дія " + action.getDescription() + " розпізнана але ще не реалізована",
                    "action", action.getActionName(),
                    "data", actionData != null ? actionData : Map.of()
                );
            };

            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Помилка виконання дії {} для wizard {}: {}", actionName, wizardId, e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Внутрішня помилка сервера",
                "action", actionName
            ));
        }
    }

    /**
     * Допоміжний метод для отримання стану wizard
     */
    private Map<String, Object> getCurrentWizardState(String wizardId) throws Exception {
        OrderState currentState = wizardService.getCurrentState(wizardId);
        Map<Object, Object> wizardData = wizardService.getWizardData(wizardId);

        Map<String, Object> cleanData = wizardData.entrySet().stream()
            .filter(entry -> entry.getKey() instanceof String)
            .collect(Collectors.toMap(
                entry -> (String) entry.getKey(),
                Map.Entry::getValue
            ));

        Map<String, Boolean> availableActions = actionService.getAvailableActions(currentState, cleanData);

        return Map.of(
            "wizardId", wizardId,
            "currentState", currentState,
            "data", cleanData,
            "availableActions", availableActions
        );
    }

    /**
     * Отримання всіх можливих дій wizard
     */
    @GetMapping("/available-actions")
    @Operation(summary = "Отримати всі можливі дії Order Wizard",
               description = "Повертає повний список всіх дій, які можуть бути виконані в wizard")
    @ApiResponse(responseCode = "200", description = "Список дій успішно отримано")
    public ResponseEntity<Map<String, String>> getAllAvailableActions() {
        Map<String, String> allActions = Arrays.stream(OrderWizardAction.values())
            .collect(Collectors.toMap(
                OrderWizardAction::getActionName,
                OrderWizardAction::getDescription
            ));

        return ResponseEntity.ok(allActions);
    }

}
