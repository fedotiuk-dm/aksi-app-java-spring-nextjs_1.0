package com.aksi.domain.order.statemachine.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.service.Stage1CoordinationService;
import com.aksi.domain.order.statemachine.stage2.service.Stage2CoordinationService;
import com.aksi.domain.order.statemachine.stage3.service.Stage3CoordinationService;
import com.aksi.domain.order.statemachine.stage4.service.Stage4CoordinationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Адаптер для Order Wizard State Machine через Facade Pattern.
 *
 * РЕФАКТОРИНГ ЗАВЕРШЕНО:
 * - Видалено 577 рядків монолітного коду
 * - Замінено на Facade Pattern з малими спеціалізованими компонентами
 * - Дотримання SOLID принципів
 *
 * Архітектура після рефакторингу:
 * - OrderWizardFacade - Facade Pattern для спрощення API
 * - StateMachineLifecycleService - керування життєвим циклом (SRP)
 * - WizardStateService - керування станом та подіями (SRP)
 * - StateMachineActionExecutor - виконання дій через State Machine (OCP, LSP)
 *
 * Цей клас забезпечує зворотну сумісність з існуючими контролерами,
 * але всю роботу делегує до Facade.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderWizardStateMachineService {

    private final OrderWizardFacade facade;

    // === ОСНОВНІ ОПЕРАЦІЇ ===

    /**
     * Створює новий Order Wizard.
     */
    public String createNewWizard() {
        log.debug("Делегування створення wizard до Facade");
        return facade.createNewWizard();
    }

    /**
     * Закриває Order Wizard.
     */
    public void closeWizard(String wizardId) {
        log.debug("Делегування закриття wizard {} до Facade", wizardId);
        facade.closeWizard(wizardId);
    }

    /**
     * Отримує поточний стан wizard.
     */
    public OrderState getCurrentState(String wizardId) {
        return facade.getCurrentState(wizardId);
    }

    /**
     * Отримує всі дані wizard.
     */
    public Map<Object, Object> getWizardData(String wizardId) {
        return facade.getWizardData(wizardId);
    }

    /**
     * Надсилає подію до wizard.
     */
    public boolean sendEvent(String wizardId, OrderEvent event) {
        return facade.sendEvent(wizardId, event);
    }

    /**
     * Надсилає подію з даними до wizard.
     */
    public boolean sendEvent(String wizardId, OrderEvent event, Map<String, Object> eventData) {
        return facade.sendEvent(wizardId, event, eventData);
    }

    /**
     * Перевіряє чи можна надіслати подію.
     */
    public boolean canSendEvent(String wizardId, OrderEvent event) {
        return facade.canSendEvent(wizardId, event);
    }

    /**
     * Отримує список активних wizards.
     */
    public Map<String, OrderState> getActiveWizards() {
        return facade.getActiveWizards();
    }

    // === ВИКОНАННЯ ДІЙ ЕТАПІВ ===

    /**
     * Виконує дію етапу 1.
     */
    public Map<String, Object> executeStage1Action(String wizardId, String action, Map<String, Object> data) {
        log.debug("Делегування дії {} етапу 1 для wizard {} до Facade", action, wizardId);
        return facade.executeStage1Action(wizardId, action, data);
    }

    /**
     * Виконує дію етапу 2.
     */
    public Map<String, Object> executeStage2Action(String wizardId, String action, Map<String, Object> data) {
        log.debug("Делегування дії {} етапу 2 для wizard {} до Facade", action, wizardId);
        return facade.executeStage2Action(wizardId, action, data);
    }

    /**
     * Виконує дію етапу 3.
     */
    public Map<String, Object> executeStage3Action(String wizardId, String action, Map<String, Object> data) {
        log.debug("Делегування дії {} етапу 3 для wizard {} до Facade", action, wizardId);
        return facade.executeStage3Action(wizardId, action, data);
    }

    /**
     * Виконує дію етапу 4.
     */
    public Map<String, Object> executeStage4Action(String wizardId, String action, Map<String, Object> data) {
        log.debug("Делегування дії {} етапу 4 для wizard {} до Facade", action, wizardId);
        return facade.executeStage4Action(wizardId, action, data);
    }

    /**
     * Виконує дію Item Wizard.
     */
    public Map<String, Object> executeItemWizardAction(String wizardId, String itemWizardId, String action, Map<String, Object> data) {
        log.debug("Делегування дії {} Item Wizard {} для wizard {} до Facade", action, itemWizardId, wizardId);
        return facade.executeItemWizardAction(wizardId, itemWizardId, action, data);
    }

    // === ОТРИМАННЯ КООРДИНАТОРІВ (ЗВОРОТНА СУМІСНІСТЬ) ===

    /**
     * Отримує координатор етапу 1.
     * @deprecated Використовуйте facade.getStageActions(1)
     */
    @Deprecated(since = "1.0", forRemoval = false)
    public Stage1CoordinationService getStage1Coordinator() {
        log.warn("DEPRECATED: Спроба отримання Stage1Coordinator. Координатори більше не доступні напряму");
        throw new UnsupportedOperationException(
            "Координатори більше не доступні напряму. Використовуйте facade.executeStage1Action() для виконання дій"
        );
    }

    /**
     * Отримує координатор етапу 2.
     * @deprecated Використовуйте facade.getStageActions(2)
     */
    @Deprecated(since = "1.0", forRemoval = false)
    public Stage2CoordinationService getStage2Coordinator() {
        log.warn("DEPRECATED: Спроба отримання Stage2Coordinator. Координатори більше не доступні напряму");
        throw new UnsupportedOperationException(
            "Координатори більше не доступні напряму. Використовуйте facade.executeStage2Action() для виконання дій"
        );
    }

    /**
     * Отримує координатор етапу 3.
     * @deprecated Використовуйте facade.getStageActions(3)
     */
    @Deprecated(since = "1.0", forRemoval = false)
    public Stage3CoordinationService getStage3Coordinator() {
        log.warn("DEPRECATED: Спроба отримання Stage3Coordinator. Координатори більше не доступні напряму");
        throw new UnsupportedOperationException(
            "Координатори більше не доступні напряму. Використовуйте facade.executeStage3Action() для виконання дій"
        );
    }

    /**
     * Отримує координатор етапу 4.
     * @deprecated Використовуйте facade.getStageActions(4)
     */
    @Deprecated(since = "1.0", forRemoval = false)
    public Stage4CoordinationService getStage4Coordinator() {
        log.warn("DEPRECATED: Спроба отримання Stage4Coordinator. Координатори більше не доступні напряму");
        throw new UnsupportedOperationException(
            "Координатори більше не доступні напряму. Використовуйте facade.executeStage4Action() для виконання дій"
        );
    }

    // === ДОПОМІЖНІ МЕТОДИ ===

    /**
     * Очищає неактивні wizards.
     */
    public void cleanupInactiveWizards() {
        log.debug("Делегування cleanup до Facade");
        facade.cleanupInactiveWizards();
    }

    /**
     * Перевіряє чи існує wizard.
     */
    public boolean wizardExists(String wizardId) {
        return facade.wizardExists(wizardId);
    }
}
