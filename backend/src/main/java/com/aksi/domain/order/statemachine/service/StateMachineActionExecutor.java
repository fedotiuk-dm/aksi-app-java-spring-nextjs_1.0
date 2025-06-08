package com.aksi.domain.order.statemachine.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.service.lifecycle.StateMachineLifecycleService;
import com.aksi.domain.order.statemachine.service.state.WizardStateService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для виконання дій через Spring State Machine.
 *
 * Відповідає за:
 * - Конвертацію дій користувача в події State Machine
 * - Надсилання подій до State Machine
 * - Обробку результатів виконання
 * - Формування відповідей для Facade
 *
 * Принципи SOLID:
 * - SRP: Тільки виконання дій через State Machine
 * - OCP: Легко розширюється новими типами дій
 * - LSP: Всі executors мають однаковий контракт
 * - ISP: Клієнти використовують тільки потрібні методи
 * - DIP: Залежить від абстракцій StateService і Converter
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class StateMachineActionExecutor {

    private final WizardStateService stateService;
    private final StateMachineLifecycleService lifecycleService;
    private final ActionToEventConverter actionConverter;

    /**
     * Виконує дію через State Machine.
     *
     * @param wizardId ідентифікатор візарда
     * @param stage номер етапу (1-4)
     * @param action назва дії
     * @param data дані дії
     * @return результат виконання
     */
    public Map<String, Object> executeAction(String wizardId, int stage, String action, Map<String, Object> data) {
        log.debug("Виконання дії '{}' етапу {} для wizard {}", action, stage, wizardId);

        try {
            // Перевіряємо чи існує wizard через lifecycleService
            if (!lifecycleService.wizardExists(wizardId)) {
                return createErrorResponse(action, stage, "Wizard не знайдено: " + wizardId);
            }

            // Конвертуємо дію в подію
            OrderEvent event = actionConverter.convertActionToEvent(stage, action);
            if (event == OrderEvent.SAVE_DRAFT) { // Використовуємо існуючу подію як fallback
                log.warn("Дія '{}' етапу {} не має відповідної події. Використовується SAVE_DRAFT.", action, stage);
            }

            // Перевіряємо чи можна надіслати подію
            if (!stateService.canSendEvent(wizardId, event)) {
                OrderState currentState = stateService.getCurrentState(wizardId);
                return createErrorResponse(action, stage,
                    String.format("Подія %s не може бути надіслана в стані %s", event, currentState));
            }

            // Підготовуємо дані для події
            Map<String, Object> eventData = prepareEventData(action, stage, data);

            // Надсилаємо подію до State Machine
            boolean success = stateService.sendEvent(wizardId, event, eventData);

            if (success) {
                return createSuccessResponse(wizardId, action, stage, event);
            } else {
                return createErrorResponse(action, stage, "Помилка обробки події в State Machine");
            }

        } catch (Exception e) {
            log.error("Помилка виконання дії '{}' етапу {}: {}", action, stage, e.getMessage(), e);
            return createErrorResponse(action, stage, "Внутрішня помилка: " + e.getMessage());
        }
    }

    /**
     * Підготовує дані для надсилання події до State Machine.
     */
    private Map<String, Object> prepareEventData(String action, int stage, Map<String, Object> data) {
        Map<String, Object> eventData = data != null ? new java.util.HashMap<>(data) : new java.util.HashMap<>();

        // Додаємо метадані дії
        eventData.put("action", action);
        eventData.put("stage", stage);
        eventData.put("timestamp", System.currentTimeMillis());

        log.debug("Підготовлено дані для події: action={}, stage={}, dataKeys={}",
            action, stage, eventData.keySet());

        return eventData;
    }

    /**
     * Створює успішну відповідь.
     */
    private Map<String, Object> createSuccessResponse(String wizardId, String action, int stage, OrderEvent event) {
        OrderState currentState = stateService.getCurrentState(wizardId);

        Map<String, Object> response = Map.of(
            "success", true,
            "wizardId", wizardId,
            "action", action,
            "stage", stage,
            "event", event.toString(),
            "currentState", currentState != null ? currentState.toString() : "UNKNOWN",
            "timestamp", System.currentTimeMillis()
        );

        log.debug("Успішне виконання дії '{}' етапу {}: currentState={}", action, stage, currentState);
        return response;
    }

    /**
     * Створює відповідь з помилкою.
     */
    private Map<String, Object> createErrorResponse(String action, int stage, String errorMessage) {
        Map<String, Object> response = Map.of(
            "success", false,
            "action", action,
            "stage", stage,
            "error", errorMessage,
            "timestamp", System.currentTimeMillis()
        );

        log.warn("Помилка виконання дії '{}' етапу {}: {}", action, stage, errorMessage);
        return response;
    }

    /**
     * Перевіряє чи може бути виконана дія для вказаного етапу.
     */
    public boolean canExecuteAction(String wizardId, int stage, String action) {
        try {
            // Перевіряємо чи існує wizard
            if (!lifecycleService.wizardExists(wizardId)) {
                return false;
            }

            // Перевіряємо чи підтримується дія
            if (!actionConverter.isActionSupported(stage, action)) {
                return false;
            }

            // Конвертуємо дію в подію та перевіряємо чи можна її надіслати
            OrderEvent event = actionConverter.convertActionToEvent(stage, action);
            return stateService.canSendEvent(wizardId, event);

        } catch (Exception e) {
            log.debug("Неможливо виконати дію '{}' етапу {}: {}", action, stage, e.getMessage());
            return false;
        }
    }

    /**
     * Отримує інформацію про можливі дії для поточного стану wizard.
     */
    public Map<String, Object> getAvailableActions(String wizardId) {
        if (!lifecycleService.wizardExists(wizardId)) {
            return Map.of("error", "Wizard не знайдено: " + wizardId);
        }

        OrderState currentState = stateService.getCurrentState(wizardId);

        Map<String, Object> info = new java.util.HashMap<>();
        info.put("wizardId", wizardId);
        info.put("currentState", currentState != null ? currentState.toString() : "UNKNOWN");

        // Додаємо доступні дії для кожного етапу
        for (int stage = 1; stage <= 4; stage++) {
            Map<String, String> stageActions = actionConverter.getSupportedActions(stage);
            Map<String, Boolean> availableActions = new java.util.HashMap<>();

            for (String action : stageActions.keySet()) {
                availableActions.put(action, canExecuteAction(wizardId, stage, action));
            }

            info.put("stage" + stage + "Actions", availableActions);
        }

        return info;
    }
}
