package com.aksi.domain.order.statemachine.service.state;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.messaging.support.MessageBuilder;
import org.springframework.statemachine.StateMachine;
import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.dto.WizardStatusDTO;
import com.aksi.domain.order.statemachine.service.lifecycle.StateMachineLifecycleService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

/**
 * Сервіс для управління станом та подіями State Machine.
 *
 * Відповідальності (SRP):
 * - Отримання поточного стану
 * - Надсилання подій
 * - Валідація можливих переходів
 * - Управління даними контексту
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WizardStateService {

    private final StateMachineLifecycleService lifecycleService;
    private final WizardActionsService wizardActionsService;
    private final WizardCompletionService wizardCompletionService;
    private final WizardTransitionService wizardTransitionService;

    /**
     * Отримує поточний стан wizard.
     */
    public OrderState getCurrentState(String wizardId) {
        StateMachine<OrderState, OrderEvent> stateMachine = lifecycleService.getStateMachine(wizardId);
        OrderState currentState = stateMachine.getState().getId();
        log.debug("Поточний стан wizard {}: {}", wizardId, currentState);
        return currentState;
    }

    /**
     * Надсилає подію до wizard.
     */
    public boolean sendEvent(String wizardId, OrderEvent event) {
        return sendEvent(wizardId, event, null);
    }

    /**
     * Надсилає подію з даними до wizard.
     */
    public boolean sendEvent(String wizardId, OrderEvent event, Map<String, Object> eventData) {
        log.info("Надсилання події {} до wizard: {}", event, wizardId);

        StateMachine<OrderState, OrderEvent> stateMachine = lifecycleService.getStateMachine(wizardId);

        // Створюємо повідомлення з даними
        MessageBuilder<OrderEvent> messageBuilder = MessageBuilder.withPayload(event);

        if (eventData != null && !eventData.isEmpty()) {
            eventData.forEach(messageBuilder::setHeader);
            log.debug("Додано {} заголовків до події", eventData.size());
        }

        try {
            boolean result = stateMachine
                .sendEvent(Mono.just(messageBuilder.build()))
                .blockFirst() != null;

            if (result) {
                log.info("Подія {} успішно надіслана до wizard {}", event, wizardId);
            } else {
                log.warn("Подія {} відхилена wizard {}", event, wizardId);
            }

            return result;

        } catch (Exception e) {
            log.error("Помилка надсилання події {} до wizard {}: {}", event, wizardId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи можна надіслати подію.
     * Використовує WizardTransitionService для валідації.
     */
    public boolean canSendEvent(String wizardId, OrderEvent event) {
        if (!lifecycleService.wizardExists(wizardId)) {
            log.debug("Wizard {} не існує, подія {} неможлива", wizardId, event);
            return false;
        }

        try {
            StateMachine<OrderState, OrderEvent> stateMachine = lifecycleService.getStateMachine(wizardId);
            OrderState currentState = stateMachine.getState().getId();

            // Використовуємо WizardTransitionService для валідації
            boolean canSend = wizardTransitionService.canSendEvent(currentState, event);

            log.debug("Перевірка можливості надсилання події {} для wizard {} в стані {}: {}",
                     event, wizardId, currentState, canSend);

            return canSend;

        } catch (Exception e) {
            log.error("Помилка перевірки можливості надсилання події {} для wizard {}: {}",
                     event, wizardId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Отримує всі дані wizard.
     */
    public Map<Object, Object> getWizardData(String wizardId) {
        StateMachine<OrderState, OrderEvent> stateMachine = lifecycleService.getStateMachine(wizardId);
        Map<Object, Object> data = stateMachine.getExtendedState().getVariables();

        log.debug("Отримано {} елементів даних для wizard {}", data.size(), wizardId);
        return Map.copyOf(data);
    }

    /**
     * Отримує всі активні wizard зі станами.
     */
    public Map<String, OrderState> getActiveWizards() {
        return lifecycleService.getActiveWizards().entrySet().stream()
            .collect(Collectors.toMap(
                Map.Entry::getKey,
                entry -> entry.getValue().getState().getId()
            ));
    }

    /**
     * Встановлює дані в контексті wizard та оновлює час останньої зміни.
     */
    public void setWizardData(String wizardId, String key, Object value) {
        StateMachine<OrderState, OrderEvent> stateMachine = lifecycleService.getStateMachine(wizardId);
        Map<Object, Object> variables = stateMachine.getExtendedState().getVariables();

        variables.put(key, value);
        variables.put("lastModified", LocalDateTime.now());

        log.debug("Встановлено дані {} = {} для wizard {}", key, value, wizardId);
    }

    /**
     * Отримує конкретні дані з контексту wizard.
     */
    public <T> T getWizardData(String wizardId, String key, Class<T> clazz) {
        StateMachine<OrderState, OrderEvent> stateMachine = lifecycleService.getStateMachine(wizardId);
        Object value = stateMachine.getExtendedState().getVariables().get(key);

        if (value != null && clazz.isInstance(value)) {
            return clazz.cast(value);
        }

        log.debug("Дані {} не знайдено або мають неправильний тип для wizard {}", key, wizardId);
        return null;
    }

    /**
     * Отримує комплексний статус wizard, використовуючи всі допоміжні сервіси.
     */
    public WizardStatusDTO getWizardStatus(String wizardId) {
        if (!lifecycleService.wizardExists(wizardId)) {
            log.warn("Спроба отримати статус неіснуючого wizard: {}", wizardId);
            return null;
        }

        StateMachine<OrderState, OrderEvent> stateMachine = lifecycleService.getStateMachine(wizardId);
        OrderState currentState = stateMachine.getState().getId();
        Map<Object, Object> rawData = stateMachine.getExtendedState().getVariables();

        // Безпечне перетворення Map<Object, Object> -> Map<String, Object>
        Map<String, Object> wizardData = new HashMap<>();
        rawData.forEach((key, value) -> {
            if (key instanceof String stringKey) {
                wizardData.put(stringKey, value);
            }
        });

        return WizardStatusDTO.builder()
            // Поточний стан
            .currentState(currentState)
            .stateName(currentState.name())
            .stageNumber(wizardCompletionService.getCurrentStageNumber(currentState))
            .stageName(wizardCompletionService.getStageName(
                wizardCompletionService.getCurrentStageNumber(currentState)))

            // Прогрес
            .overallProgress(wizardCompletionService.calculateOverallProgress(currentState, wizardData))
            .canComplete(wizardCompletionService.canWizardComplete(currentState, wizardData))
            .isStage1Completed(wizardCompletionService.isStage1Completed(currentState, wizardData))
            .isStage2Completed(wizardCompletionService.isStage2Completed(currentState, wizardData))
            .isStage3Completed(wizardCompletionService.isStage3Completed(currentState, wizardData))
            .isStage4Completed(wizardCompletionService.isStage4Completed(currentState, wizardData))

            // Доступні дії
            .availableActions(wizardActionsService.getAvailableActions(currentState, wizardData))
            .availableEvents(wizardTransitionService.getAvailableEvents(currentState))
            .isDataInputRequired(wizardActionsService.isDataInputRequired(currentState))

            // Переходи
            .possibleTransitions(wizardTransitionService.getPossibleTransitions(currentState))
            .nextExpectedState(wizardTransitionService.getNextExpectedState(currentState))
            .previousState(wizardTransitionService.getPreviousState(currentState))
            .isFinalState(wizardTransitionService.isFinalState(currentState))

            // Валідація та блокування
            .blockingReasons(wizardCompletionService.getBlockingReasons(currentState, wizardData))
            .missingRequiredData(wizardCompletionService.getMissingRequiredData(wizardData))

            // Метаінформація
            .itemsCount(wizardCompletionService.getItemsCount(wizardData))
            .lastUpdated(LocalDateTime.now())
            .hasUnsavedChanges(hasUnsavedChanges(wizardData))

            // Додаткові дані
            .wizardData(wizardData)
            .build();
    }

    /**
     * Позначає дані wizard як збережені.
     */
    public void markWizardDataAsSaved(String wizardId) {
        if (!lifecycleService.wizardExists(wizardId)) {
            log.warn("Спроба позначити дані як збережені для неіснуючого wizard: {}", wizardId);
            return;
        }

        StateMachine<OrderState, OrderEvent> stateMachine = lifecycleService.getStateMachine(wizardId);
        stateMachine.getExtendedState().getVariables().put("lastSaved", LocalDateTime.now());

        log.debug("Дані wizard {} позначені як збережені", wizardId);
    }

    /**
     * Ініціалізує timestamps для нового wizard.
     */
    public void initializeWizardTimestamps(String wizardId) {
        if (!lifecycleService.wizardExists(wizardId)) {
            log.warn("Спроба ініціалізувати timestamps для неіснуючого wizard: {}", wizardId);
            return;
        }

        StateMachine<OrderState, OrderEvent> stateMachine = lifecycleService.getStateMachine(wizardId);
        Map<Object, Object> variables = stateMachine.getExtendedState().getVariables();

        LocalDateTime now = LocalDateTime.now();
        variables.put("createdAt", now);
        variables.put("lastModified", now);
        variables.put("lastSaved", now);

        log.debug("Ініціалізовано timestamps для wizard {}", wizardId);
    }

    // === ПРИВАТНІ МЕТОДИ ===

    /**
     * Перевіряє чи є незбережені зміни в wizard.
     * Логіка базується на порівнянні часу останньої зміни з часом останнього збереження.
     */
    private boolean hasUnsavedChanges(Map<String, Object> wizardData) {
        // Отримуємо час останньої зміни
        Object lastModified = wizardData.get("lastModified");
        Object lastSaved = wizardData.get("lastSaved");

        if (lastModified instanceof LocalDateTime lastModifiedTime && lastSaved instanceof LocalDateTime lastSavedTime) {
            return lastModifiedTime.isAfter(lastSavedTime);
        }

        // Якщо немає інформації про збереження, вважаємо що є незбережені зміни
        return lastModified != null && lastSaved == null;
    }
}
