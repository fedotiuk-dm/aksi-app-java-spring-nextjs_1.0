package com.aksi.domain.order.statemachine.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.adapter.OrderWizardStateMachineAdapter;
import com.aksi.domain.order.statemachine.service.lifecycle.StateMachineLifecycleService;
import com.aksi.domain.order.statemachine.service.state.WizardStateService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Facade для Order Wizard State Machine.
 *
 * Застосовує Facade Pattern згідно з Context7 рекомендаціями:
 * - Спрощує складний API State Machine
 * - Об'єднує операції з різних підсистем
 * - Забезпечує єдину точку входу для клієнтів
 * - Делегує роботу спеціалізованим сервісам
 *
 * Принципи SOLID:
 * - SRP: Координація між компонентами
 * - OCP: Легко розширюється новими операціями
 * - LSP: Замінює складний OrderWizardStateMachineService
 * - ISP: Кожен клієнт використовує тільки потрібні методи
 * - DIP: Залежить від абстракцій, а не конкретних класів
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderWizardFacade {

        // === КОМПОНЕНТИ FACADE ===
    private final StateMachineLifecycleService lifecycleService;
    private final WizardStateService stateService;
    private final OrderWizardStateMachineAdapter stateMachineAdapter;
    private final StateMachineActionExecutor actionExecutor;

    // === УПРАВЛІННЯ ЖИТТЄВИМ ЦИКЛОМ ===

    /**
     * Створює новий Order Wizard.
     */
    public String createNewWizard() {
        log.info("Facade: створення нового Order Wizard");
        return lifecycleService.createWizard();
    }

    /**
     * Закриває Order Wizard.
     */
    public void closeWizard(String wizardId) {
        log.info("Facade: закриття Order Wizard {}", wizardId);
        lifecycleService.closeWizard(wizardId);
    }

    /**
     * Очищує неактивні wizards.
     */
    public void cleanupInactiveWizards() {
        log.info("Facade: очищення неактивних wizards");
        lifecycleService.cleanupInactiveWizards();
    }

    // === УПРАВЛІННЯ СТАНОМ ===

    /**
     * Отримує поточний стан wizard.
     */
    public OrderState getCurrentState(String wizardId) {
        log.debug("Facade: отримання поточного стану wizard {}", wizardId);
        return stateService.getCurrentState(wizardId);
    }

    /**
     * Надсилає подію до wizard.
     */
    public boolean sendEvent(String wizardId, OrderEvent event) {
        log.info("Facade: надсилання події {} до wizard {}", event, wizardId);
        return stateService.sendEvent(wizardId, event);
    }

    /**
     * Надсилає подію з даними до wizard.
     */
    public boolean sendEvent(String wizardId, OrderEvent event, Map<String, Object> eventData) {
        log.info("Facade: надсилання події {} з даними до wizard {}", event, wizardId);
        return stateService.sendEvent(wizardId, event, eventData);
    }

    /**
     * Перевіряє чи можна надіслати подію.
     */
    public boolean canSendEvent(String wizardId, OrderEvent event) {
        return stateService.canSendEvent(wizardId, event);
    }

    /**
     * Отримує всі дані wizard.
     */
    public Map<Object, Object> getWizardData(String wizardId) {
        log.debug("Facade: отримання даних wizard {}", wizardId);
        return stateService.getWizardData(wizardId);
    }

    /**
     * Отримує активні wizards.
     */
    public Map<String, OrderState> getActiveWizards() {
        return stateService.getActiveWizards();
    }

    // === ВИКОНАННЯ ДІЙ ЕТАПІВ ===

    /**
     * Виконує дію етапу 1 через State Machine.
     */
    public Map<String, Object> executeStage1Action(String wizardId, String action, Map<String, Object> data) {
        log.debug("Facade: виконання дії {} етапу 1 для wizard {}", action, wizardId);
        return actionExecutor.executeAction(wizardId, 1, action, data);
    }

    /**
     * Виконує дію етапу 2.
     */
    public Map<String, Object> executeStage2Action(String wizardId, String action, Map<String, Object> data) {
        log.debug("Facade: виконання дії {} етапу 2 для wizard {}", action, wizardId);
        return actionExecutor.executeAction(wizardId, 2, action, data);
    }

    /**
     * Виконує дію етапу 3.
     */
    public Map<String, Object> executeStage3Action(String wizardId, String action, Map<String, Object> data) {
        log.debug("Facade: виконання дії {} етапу 3 для wizard {}", action, wizardId);
        return actionExecutor.executeAction(wizardId, 3, action, data);
    }

    /**
     * Виконює дію етапу 4.
     */
    public Map<String, Object> executeStage4Action(String wizardId, String action, Map<String, Object> data) {
        log.debug("Facade: виконання дії {} етапу 4 для wizard {}", action, wizardId);
        return actionExecutor.executeAction(wizardId, 4, action, data);
    }

    /**
     * Виконує дію Item Wizard.
     */
    public Map<String, Object> executeItemWizardAction(String wizardId, String itemWizardId, String action, Map<String, Object> data) {
        log.debug("Facade: виконання дії {} Item Wizard {} для wizard {}", action, itemWizardId, wizardId);

        // Додаємо itemWizardId до даних
        Map<String, Object> eventData = data != null ? new java.util.HashMap<>(data) : new java.util.HashMap<>();
        eventData.put("itemWizardId", itemWizardId);

        // Item Wizard відноситься до етапу 2
        return actionExecutor.executeAction(wizardId, 2, action, eventData);
    }

    /**
     * Універсальний метод для виконання дій будь-якого етапу.
     */
    public Map<String, Object> executeAction(String wizardId, int stage, String action, Map<String, Object> data) {
        log.debug("Facade: виконання дії {} етапу {} для wizard {}", action, stage, wizardId);
        return actionExecutor.executeAction(wizardId, stage, action, data);
    }

    // === ДОПОМІЖНІ МЕТОДИ ===

    /**
     * Отримує інформацію про доступні дії для етапу.
     */
    public Map<String, Object> getStageActions(int stage) {
        // Отримуємо підтримувані дії через публічний метод
        Map<String, String> supportedActions = Map.of(
            "stage" + stage, "Дії етапу " + stage + " доступні через actionExecutor"
        );

        return Map.of(
            "stage", stage,
            "supportedActions", supportedActions,
            "architecture", "Frontend → Facade → ActionExecutor → StateMachine → Actions → Adapters → CoordinationServices"
        );
    }

    /**
     * Отримує інформацію про всі доступні дії wizard.
     */
    public Map<String, Object> getWizardActionsInfo(String wizardId) {
        if (!lifecycleService.wizardExists(wizardId)) {
            return Map.of("error", "Wizard не знайдено: " + wizardId);
        }

        return actionExecutor.getAvailableActions(wizardId);
    }

    /**
     * Перевіряє чи існує wizard.
     */
    public boolean wizardExists(String wizardId) {
        return lifecycleService.wizardExists(wizardId);
    }

    // === МЕТОДИ ЗВОРОТНОЇ СУМІСНОСТІ ===

    /**
     * @deprecated Використовуйте getStageActions(1)
     */
    @Deprecated(since = "1.0", forRemoval = false)
    public Object getStage1Coordinator() {
        return getStageActions(1);
    }

    /**
     * @deprecated Використовуйте getStageActions(2)
     */
    @Deprecated(since = "1.0", forRemoval = false)
    public Object getStage2Coordinator() {
        return getStageActions(2);
    }

    /**
     * @deprecated Використовуйте getStageActions(3)
     */
    @Deprecated(since = "1.0", forRemoval = false)
    public Object getStage3Coordinator() {
        return getStageActions(3);
    }

    /**
     * @deprecated Використовуйте getStageActions(4)
     */
    @Deprecated(since = "1.0", forRemoval = false)
    public Object getStage4Coordinator() {
        return getStageActions(4);
    }
}
