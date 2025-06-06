package com.aksi.domain.order.statemachine.stage1.service;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSelectionDTO;
import com.aksi.domain.order.statemachine.stage1.dto.OrderInitializationDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Головний координатор першого етапу Order Wizard.
 *
 * Етап: 1 (загальний) - координація
 * Підетапи: 1.1 (вибір клієнта), 1.2 (базова інформація замовлення)
 *
 * Відповідальності:
 * - Ініціалізація і координація всього етапу 1
 * - Управління переходами між підетапами 1.1 та 1.2
 * - Завершення всього етапу 1
 * - Делегування операцій до спеціалізованих сервісів
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class Stage1CoordinationService {

    private final Stage1StateService stateService;
    private final Stage1ValidationService validationService;
    private final Stage1OperationsService operationsService;

    // ========== Координація всього етапу 1 ==========

    /**
     * Ініціалізує весь етап 1.
     */
    public void initializeStage1(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Ініціалізація етапу 1 для wizard: {}", wizardId);

        try {
            // Очищаємо попередній стан (якщо є)
            stateService.clearStage1State(wizardId, context);

            // Ініціалізуємо підетап 1.1 (вибір клієнта)
            stateService.initializeClientSelection(wizardId, context);

            // Генеруємо номер квитанції одразу
            operationsService.generateAndSetReceiptNumber(context);

            log.debug("Етап 1 ініціалізовано для wizard: {}", wizardId);

        } catch (Exception e) {
            log.error("Помилка при ініціалізації етапу 1 для wizard {}: {}", wizardId, e.getMessage());
            throw new RuntimeException("Не вдалося ініціалізувати етап 1: " + e.getMessage());
        }
    }

    /**
     * Завершує підетап 1.1 і запускає підетап 1.2.
     */
    public void finishClientSelectionAndStartOrderInfo(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Завершення підетапу 1.1 та запуск підетапу 1.2 для wizard: {}", wizardId);

        try {
            // Валідуємо завершення підетапу 1.1
            if (!validationService.validateClientSelectionCompletion(context)) {
                log.warn("Підетап 1.1 не готовий до завершення для wizard: {}", wizardId);
                throw new IllegalStateException("Підетап вибору клієнта не готовий до завершення");
            }

            // Завершуємо вибір клієнта
            operationsService.finalizeClientSelection(context);

            // Ініціалізуємо підетап 1.2 (базова інформація замовлення)
            stateService.initializeOrderBasicInfo(wizardId, context);

            log.debug("Перехід з підетапу 1.1 до 1.2 завершено для wizard: {}", wizardId);

        } catch (Exception e) {
            log.error("Помилка при переході між підетапами для wizard {}: {}", wizardId, e.getMessage());
            throw new RuntimeException("Не вдалося перейти до наступного підетапу: " + e.getMessage());
        }
    }

    /**
     * Завершує весь етап 1.
     */
    public void finalizeStage1(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Завершення етапу 1 для wizard: {}", wizardId);

        try {
            // Валідуємо завершення всього етапу
            if (!validationService.validateStage1Completion(context)) {
                log.warn("Етап 1 не готовий до завершення для wizard: {}", wizardId);
                throw new IllegalStateException("Етап 1 не готовий до завершення");
            }

            // Завершуємо ініціалізацію замовлення
            operationsService.finalizeOrderInitialization(context);

            log.debug("Етап 1 завершено успішно для wizard: {}", wizardId);

        } catch (Exception e) {
            log.error("Помилка при завершенні етапу 1 для wizard {}: {}", wizardId, e.getMessage());
            throw new RuntimeException("Не вдалося завершити етап 1: " + e.getMessage());
        }
    }

    // ========== Допоміжні методи для отримання поточного стану ==========

    /**
     * Отримує поточний крок в рамках етапу 1.
     */
    public String getCurrentStep(StateContext<OrderState, OrderEvent> context) {
        if (!stateService.isClientSelectionCompleted(context)) {
            return "CLIENT_SELECTION"; // Підетап 1.1
        } else if (!stateService.isOrderInfoInitialized(context)) {
            return "ORDER_INITIALIZATION"; // Підетап 1.2
        } else {
            return "STAGE1_COMPLETED"; // Етап завершено
        }
    }

    /**
     * Перевіряє чи завершено підетап 1.1.
     */
    public boolean isClientSelectionCompleted(StateContext<OrderState, OrderEvent> context) {
        return stateService.isClientSelectionCompleted(context);
    }

    /**
     * Перевіряє чи ініціалізовано підетап 1.2.
     */
    public boolean isOrderInfoInitialized(StateContext<OrderState, OrderEvent> context) {
        return stateService.isOrderInfoInitialized(context);
    }

    /**
     * Валідує готовність до завершення всього етапу 1.
     */
    public boolean validateStage1Completion(StateContext<OrderState, OrderEvent> context) {
        return validationService.validateStage1Completion(context);
    }

    // ========== Методи для отримання DTO для UI ==========

    /**
     * Отримує DTO підетапу 1.1 для відображення в UI.
     */
    public ClientSelectionDTO getClientSelectionDTO(StateContext<OrderState, OrderEvent> context) {
        return stateService.getOrCreateClientSelectionDTO(context);
    }

    /**
     * Отримує DTO підетапу 1.2 для відображення в UI.
     */
    public OrderInitializationDTO getOrderInitializationDTO(StateContext<OrderState, OrderEvent> context) {
        return stateService.getOrCreateOrderInitializationDTO(context);
    }

    // ========== Делегування операцій до відповідних сервісів ==========

    /**
     * Делегує операції підетапу 1.1 до OperationsService.
     */
    public Stage1OperationsService getOperationsService() {
        return operationsService;
    }

    /**
     * Делегує валідацію до ValidationService.
     */
    public Stage1ValidationService getValidationService() {
        return validationService;
    }

    /**
     * Делегує управління станом до StateService.
     */
    public Stage1StateService getStateService() {
        return stateService;
    }
}
