package com.aksi.domain.order.statemachine.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.OrderWizardAction;

import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для визначення доступних дій користувача в Order Wizard
 *
 * Відповідає за бізнес-логіку доступності дій в залежності від:
 * - Поточного стану State Machine
 * - Збережених даних wizard
 * - Бізнес-правил системи
 */
@Service
@Slf4j
public class OrderWizardActionService {

    /**
     * Визначає доступні дії для поточного стану wizard
     *
     * @param currentState поточний стан State Machine
     * @param wizardData збережені дані wizard
     * @return Map з доступними діями (ключ - назва дії, значення - чи доступна)
     */
    public Map<String, Boolean> getAvailableActions(OrderState currentState, Map<String, Object> wizardData) {
        log.debug("Визначення доступних дій для стану: {} з даними: {}", currentState, wizardData.keySet());

        Map<String, Boolean> actions = new HashMap<>();

        // Базові дії завжди доступні
        addBaseActions(actions);

        // Дії залежно від поточного стану
        addStateSpecificActions(actions, currentState, wizardData);

        log.debug("Доступні дії для стану {}: {}", currentState, actions);
        return actions;
    }

    /**
     * Додає базові дії, які завжди доступні
     */
    private void addBaseActions(Map<String, Boolean> actions) {
        actions.put(OrderWizardAction.CANCEL.getActionName(), true);
        actions.put(OrderWizardAction.GET_STATE.getActionName(), true);
    }

    /**
     * Додає дії специфічні для поточного стану
     */
    private void addStateSpecificActions(Map<String, Boolean> actions, OrderState currentState, Map<String, Object> wizardData) {
        switch (currentState) {
            case CLIENT_SELECTION -> addClientSelectionActions(actions, wizardData);
            case ORDER_INITIALIZATION -> addOrderInitializationActions(actions, wizardData);
            case ITEM_MANAGEMENT -> addItemManagementActions(actions, wizardData);
            case ITEM_WIZARD_ACTIVE, ITEM_BASIC_INFO, ITEM_CHARACTERISTICS,
                 ITEM_DEFECTS_STAINS, ITEM_PRICING, ITEM_PHOTOS -> addItemWizardActions(actions, currentState, wizardData);
            case EXECUTION_PARAMS -> addExecutionParamsActions(actions, wizardData);
            case GLOBAL_DISCOUNTS -> addGlobalDiscountsActions(actions, wizardData);
            case PAYMENT_PROCESSING -> addPaymentProcessingActions(actions, wizardData);
            case ADDITIONAL_INFO -> addAdditionalInfoActions(actions, wizardData);
            case ORDER_CONFIRMATION, ORDER_REVIEW -> addOrderReviewActions(actions, wizardData);
            case LEGAL_ASPECTS -> addLegalAspectsActions(actions, wizardData);
            case RECEIPT_GENERATION -> addReceiptGenerationActions(actions, wizardData);
            case COMPLETED, CANCELLED -> addFinalStateActions(actions);
            default -> log.warn("Невідомий стан: {}", currentState);
        }
    }

    /**
     * Дії для етапу вибору клієнта
     */
    private void addClientSelectionActions(Map<String, Boolean> actions, Map<String, Object> wizardData) {
        actions.put(OrderWizardAction.SELECT_CLIENT.getActionName(), true);
        actions.put(OrderWizardAction.CREATE_CLIENT.getActionName(), true);
        actions.put(OrderWizardAction.SAVE_CLIENT.getActionName(),
            wizardData.containsKey("selectedClient") || wizardData.containsKey("newClientData"));
    }

    /**
     * Дії для етапу ініціалізації замовлення
     */
    private void addOrderInitializationActions(Map<String, Boolean> actions, Map<String, Object> wizardData) {
        actions.put(OrderWizardAction.SET_ORDER_INFO.getActionName(), true);
        actions.put(OrderWizardAction.SAVE_ORDER_INFO.getActionName(),
            hasRequiredOrderData(wizardData));
    }

    /**
     * Дії для етапу управління предметами
     */
    private void addItemManagementActions(Map<String, Boolean> actions, Map<String, Object> wizardData) {
        boolean hasItems = hasItems(wizardData);

        actions.put(OrderWizardAction.ADD_ITEM.getActionName(), true);
        actions.put(OrderWizardAction.VIEW_ITEMS.getActionName(), hasItems);
        actions.put(OrderWizardAction.EDIT_ITEM.getActionName(), hasItems);
        actions.put(OrderWizardAction.REMOVE_ITEM.getActionName(), hasItems);
        actions.put(OrderWizardAction.PROCEED_TO_PARAMS.getActionName(), hasItems);
    }

    /**
     * Дії для підвізарда предметів
     */
    private void addItemWizardActions(Map<String, Boolean> actions, OrderState currentState, Map<String, Object> wizardData) {
        actions.put(OrderWizardAction.SET_ITEM_BASIC_INFO.getActionName(),
            currentState == OrderState.ITEM_BASIC_INFO);
        actions.put(OrderWizardAction.SET_ITEM_CHARACTERISTICS.getActionName(),
            currentState == OrderState.ITEM_CHARACTERISTICS);
        actions.put(OrderWizardAction.SET_ITEM_DEFECTS_STAINS.getActionName(),
            currentState == OrderState.ITEM_DEFECTS_STAINS);
        actions.put(OrderWizardAction.CALCULATE_ITEM_PRICE.getActionName(),
            currentState == OrderState.ITEM_PRICING);
        actions.put(OrderWizardAction.ADD_ITEM_PHOTOS.getActionName(),
            currentState == OrderState.ITEM_PHOTOS);
        actions.put(OrderWizardAction.COMPLETE_ITEM.getActionName(),
            currentState == OrderState.ITEM_COMPLETED || hasCurrentItemData(wizardData));
    }

    /**
     * Дії для етапу параметрів виконання
     */
    private void addExecutionParamsActions(Map<String, Boolean> actions, Map<String, Object> wizardData) {
        actions.put(OrderWizardAction.SET_EXECUTION_PARAMS.getActionName(), true);
    }

    /**
     * Дії для етапу глобальних знижок
     */
    private void addGlobalDiscountsActions(Map<String, Boolean> actions, Map<String, Object> wizardData) {
        actions.put(OrderWizardAction.SET_GLOBAL_DISCOUNTS.getActionName(), true);
    }

    /**
     * Дії для етапу обробки оплати
     */
    private void addPaymentProcessingActions(Map<String, Boolean> actions, Map<String, Object> wizardData) {
        actions.put(OrderWizardAction.SET_PAYMENT_INFO.getActionName(), true);
    }

    /**
     * Дії для етапу додаткової інформації
     */
    private void addAdditionalInfoActions(Map<String, Boolean> actions, Map<String, Object> wizardData) {
        actions.put(OrderWizardAction.SET_ADDITIONAL_INFO.getActionName(), true);
    }

    /**
     * Дії для етапу перегляду замовлення
     */
    private void addOrderReviewActions(Map<String, Boolean> actions, Map<String, Object> wizardData) {
        actions.put(OrderWizardAction.REVIEW_ORDER.getActionName(), true);
        actions.put(OrderWizardAction.COMPLETE_ORDER.getActionName(),
            isOrderValid(wizardData));
    }

    /**
     * Дії для етапу юридичних аспектів
     */
    private void addLegalAspectsActions(Map<String, Boolean> actions, Map<String, Object> wizardData) {
        actions.put(OrderWizardAction.ACCEPT_TERMS.getActionName(), true);
        actions.put(OrderWizardAction.DIGITAL_SIGNATURE.getActionName(),
            wizardData.containsKey("termsAccepted"));
    }

    /**
     * Дії для етапу генерації квитанції
     */
    private void addReceiptGenerationActions(Map<String, Boolean> actions, Map<String, Object> wizardData) {
        actions.put(OrderWizardAction.GENERATE_RECEIPT.getActionName(), true);
        actions.put(OrderWizardAction.PRINT_RECEIPT.getActionName(),
            wizardData.containsKey("receiptGenerated"));
    }

    /**
     * Дії для фінальних станів
     */
    private void addFinalStateActions(Map<String, Boolean> actions) {
        // У фінальних станах доступні тільки базові дії
        actions.put(OrderWizardAction.PRINT_RECEIPT.getActionName(), true);
    }

    // === ДОПОМІЖНІ МЕТОДИ ===

    /**
     * Перевіряє чи є всі необхідні дані для збереження базової інформації замовлення
     */
    private boolean hasRequiredOrderData(Map<String, Object> wizardData) {
        return wizardData.containsKey("branchId") && wizardData.containsKey("receiptNumber");
    }

    /**
     * Перевіряє чи є додані предмети до замовлення
     */
    private boolean hasItems(Map<String, Object> wizardData) {
        Object itemsObj = wizardData.get("items");
        if (itemsObj instanceof List<?> items) {
            return !items.isEmpty();
        }
        return false;
    }

    /**
     * Перевіряє чи є дані поточного предмета, що додається
     */
    private boolean hasCurrentItemData(Map<String, Object> wizardData) {
        return wizardData.containsKey("currentItem") &&
               wizardData.containsKey("currentItemBasicInfo");
    }

    /**
     * Перевіряє чи замовлення готове до завершення
     */
    private boolean isOrderValid(Map<String, Object> wizardData) {
        return hasRequiredOrderData(wizardData) &&
               hasItems(wizardData) &&
               wizardData.containsKey("executionParams") &&
               wizardData.containsKey("paymentInfo");
    }
}
