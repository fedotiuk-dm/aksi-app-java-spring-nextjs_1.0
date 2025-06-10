package com.aksi.domain.order.statemachine;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.aksi.domain.order.statemachine.enums.OrderStateTransitions;

/**
 * Юніт тести для перевірки логіки переходів Order Wizard State Machine.
 * Тестує валідацію переходів без Spring Context.
 */
@DisplayName("Order Wizard State Machine Logic Tests")
public class OrderWizardStateMachineTest {

    @BeforeEach
    void setUp() {
        // Простий Unit тест без Spring Context
    }

    @Test
    @DisplayName("Тестування валідних переходів між етапами")
    void shouldValidateCorrectTransitions() {
        // Test Stage 1 transitions
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.CLIENT_SELECTION, OrderEvent.CLIENT_SELECTED));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.CLIENT_SELECTION, OrderEvent.CANCEL_ORDER));

        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ORDER_INITIALIZATION, OrderEvent.ORDER_INFO_COMPLETED));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ORDER_INITIALIZATION, OrderEvent.CANCEL_ORDER));

        // Test Stage 2 transitions
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ITEM_MANAGEMENT, OrderEvent.ITEMS_COMPLETED));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ITEM_MANAGEMENT, OrderEvent.GO_BACK));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ITEM_MANAGEMENT, OrderEvent.CANCEL_ORDER));

        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ITEM_WIZARD_ACTIVE, OrderEvent.ITEM_ADDED));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ITEM_WIZARD_ACTIVE, OrderEvent.CANCEL_ITEM_WIZARD));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ITEM_WIZARD_ACTIVE, OrderEvent.CANCEL_ORDER));

        // Test Stage 3 transitions
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.EXECUTION_PARAMS, OrderEvent.EXECUTION_PARAMS_SET));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.EXECUTION_PARAMS, OrderEvent.GO_BACK));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.EXECUTION_PARAMS, OrderEvent.CANCEL_ORDER));

        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.GLOBAL_DISCOUNTS, OrderEvent.DISCOUNTS_APPLIED));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.GLOBAL_DISCOUNTS, OrderEvent.GO_BACK));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.GLOBAL_DISCOUNTS, OrderEvent.CANCEL_ORDER));

        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.PAYMENT_PROCESSING, OrderEvent.PAYMENT_PROCESSED));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.PAYMENT_PROCESSING, OrderEvent.GO_BACK));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.PAYMENT_PROCESSING, OrderEvent.CANCEL_ORDER));

        // Test Stage 4 transitions
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ORDER_CONFIRMATION, OrderEvent.REVIEW_ORDER));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ORDER_CONFIRMATION, OrderEvent.GO_BACK));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ORDER_CONFIRMATION, OrderEvent.CANCEL_ORDER));

        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ORDER_REVIEW, OrderEvent.ORDER_APPROVED));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ORDER_REVIEW, OrderEvent.GO_BACK));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ORDER_REVIEW, OrderEvent.CANCEL_ORDER));

        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.LEGAL_ASPECTS, OrderEvent.TERMS_ACCEPTED));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.LEGAL_ASPECTS, OrderEvent.GO_BACK));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.LEGAL_ASPECTS, OrderEvent.CANCEL_ORDER));

        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.RECEIPT_GENERATION, OrderEvent.RECEIPT_GENERATED));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.RECEIPT_GENERATION, OrderEvent.GO_BACK));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.RECEIPT_GENERATION, OrderEvent.CANCEL_ORDER));
    }

    @Test
    @DisplayName("Тестування неправильних переходів")
    void shouldRejectInvalidTransitions() {
        // Неправильні переходи з CLIENT_SELECTION
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.CLIENT_SELECTION, OrderEvent.ITEMS_COMPLETED));
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.CLIENT_SELECTION, OrderEvent.RECEIPT_GENERATED));
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.CLIENT_SELECTION, OrderEvent.PAYMENT_PROCESSED));

        // Неправильні переходи з ITEM_MANAGEMENT
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.ITEM_MANAGEMENT, OrderEvent.CLIENT_SELECTED));
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.ITEM_MANAGEMENT, OrderEvent.RECEIPT_GENERATED));
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.ITEM_MANAGEMENT, OrderEvent.ORDER_APPROVED));

        // Неправильні переходи з COMPLETED
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.COMPLETED, OrderEvent.GO_BACK));
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.COMPLETED, OrderEvent.CANCEL_ORDER));
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.COMPLETED, OrderEvent.CLIENT_SELECTED));

        // Неправильні переходи з CANCELLED
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.CANCELLED, OrderEvent.ORDER_INFO_COMPLETED));
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.CANCELLED, OrderEvent.ITEMS_COMPLETED));
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.CANCELLED, OrderEvent.RECEIPT_GENERATED));
    }

    @Test
    @DisplayName("Тестування отримання доступних подій для стану")
    void shouldGetAvailableEventsForState() {
        // Test CLIENT_SELECTION available events
        List<OrderEvent> clientSelectionEvents = OrderStateTransitions.getAvailableEvents(OrderState.CLIENT_SELECTION);
        assertNotNull(clientSelectionEvents);
        assertTrue(clientSelectionEvents.contains(OrderEvent.CLIENT_SELECTED));
        assertTrue(clientSelectionEvents.contains(OrderEvent.CANCEL_ORDER));

        // Test ITEM_MANAGEMENT available events
        List<OrderEvent> itemManagementEvents = OrderStateTransitions.getAvailableEvents(OrderState.ITEM_MANAGEMENT);
        assertNotNull(itemManagementEvents);
        assertTrue(itemManagementEvents.contains(OrderEvent.ITEMS_COMPLETED)); // Правильна подія
        assertTrue(itemManagementEvents.contains(OrderEvent.GO_BACK));
        assertTrue(itemManagementEvents.contains(OrderEvent.CANCEL_ORDER));

                // Test COMPLETED - має підтримувати START_ORDER для перезапуску
        List<OrderEvent> completedEvents = OrderStateTransitions.getAvailableEvents(OrderState.COMPLETED);
        assertNotNull(completedEvents);
        assertFalse(completedEvents.isEmpty());
        assertTrue(completedEvents.contains(OrderEvent.START_ORDER));

        // Test CANCELLED - має підтримувати START_ORDER для перезапуску
        List<OrderEvent> cancelledEvents = OrderStateTransitions.getAvailableEvents(OrderState.CANCELLED);
        assertNotNull(cancelledEvents);
        assertFalse(cancelledEvents.isEmpty());
        assertTrue(cancelledEvents.contains(OrderEvent.START_ORDER));
    }

    @Test
    @DisplayName("Тестування отримання станів що дозволяють подію")
    void shouldGetStatesAllowingEvent() {
        // Test CANCEL_ORDER event (повинен бути доступний майже з усіх станів)
        List<OrderState> cancelStates = OrderStateTransitions.getStatesAllowingEvent(OrderEvent.CANCEL_ORDER);
        assertNotNull(cancelStates);
        assertTrue(cancelStates.contains(OrderState.CLIENT_SELECTION));
        assertTrue(cancelStates.contains(OrderState.ITEM_MANAGEMENT));
        assertTrue(cancelStates.contains(OrderState.EXECUTION_PARAMS));
        assertTrue(cancelStates.contains(OrderState.ORDER_CONFIRMATION));
        // Не повинен бути доступний з кінцевих станів
        assertFalse(cancelStates.contains(OrderState.COMPLETED));
        assertFalse(cancelStates.contains(OrderState.CANCELLED));

        // Test GO_BACK event
        List<OrderState> goBackStates = OrderStateTransitions.getStatesAllowingEvent(OrderEvent.GO_BACK);
        assertNotNull(goBackStates);
        assertTrue(goBackStates.contains(OrderState.ITEM_MANAGEMENT));
        assertTrue(goBackStates.contains(OrderState.EXECUTION_PARAMS));
        assertTrue(goBackStates.contains(OrderState.ORDER_CONFIRMATION));
        // Не повинен бути доступний з початкового стану
        assertFalse(goBackStates.contains(OrderState.CLIENT_SELECTION));

        // Test CLIENT_SELECTED event (тільки з CLIENT_SELECTION)
        List<OrderState> clientSelectedStates = OrderStateTransitions.getStatesAllowingEvent(OrderEvent.CLIENT_SELECTED);
        assertNotNull(clientSelectedStates);
        assertEquals(1, clientSelectedStates.size());
        assertTrue(clientSelectedStates.contains(OrderState.CLIENT_SELECTION));
    }

        @Test
    @DisplayName("Тестування підрахунку кількості переходів")
    void shouldCountTransitionsCorrectly() {
        // Перевіряємо кількість переходів для конкретних станів
        int clientSelectionTransitions = OrderStateTransitions.getTransitionCount(OrderState.CLIENT_SELECTION);
        assertTrue(clientSelectionTransitions > 0);
        assertEquals(2, clientSelectionTransitions); // CLIENT_SELECTED, CANCEL_ORDER

        int itemManagementTransitions = OrderStateTransitions.getTransitionCount(OrderState.ITEM_MANAGEMENT);
        assertTrue(itemManagementTransitions > 0);
        assertEquals(7, itemManagementTransitions); // 7 events listed in transitions

        int completedTransitions = OrderStateTransitions.getTransitionCount(OrderState.COMPLETED);
        assertEquals(1, completedTransitions); // START_ORDER
    }

    @Test
    @DisplayName("Тестування null безпеки")
    void shouldHandleNullInputsSafely() {
        // Test null state
        assertFalse(OrderStateTransitions.isTransitionAllowed(null, OrderEvent.CLIENT_SELECTED));

        // Test null event
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.CLIENT_SELECTION, null));

        // Test both null
        assertFalse(OrderStateTransitions.isTransitionAllowed(null, null));

        // Test getAvailableEvents with null
        List<OrderEvent> nullStateEvents = OrderStateTransitions.getAvailableEvents(null);
        assertNotNull(nullStateEvents);
        assertTrue(nullStateEvents.isEmpty());

        // Test getStatesAllowingEvent with null
        List<OrderState> nullEventStates = OrderStateTransitions.getStatesAllowingEvent(null);
        assertNotNull(nullEventStates);
        assertTrue(nullEventStates.isEmpty());
    }

    @Test
    @DisplayName("Тестування послідовності позитивного сценарію")
    void shouldValidatePositiveScenarioSequence() {
        // Симулюємо повний позитивний сценарій
        OrderState currentState = OrderState.CLIENT_SELECTION;

        // Stage 1: CLIENT_SELECTION -> ORDER_INITIALIZATION
        assertTrue(OrderStateTransitions.isTransitionAllowed(currentState, OrderEvent.CLIENT_SELECTED));
        currentState = OrderState.ORDER_INITIALIZATION;

        // Stage 1: ORDER_INITIALIZATION -> ITEM_MANAGEMENT
        assertTrue(OrderStateTransitions.isTransitionAllowed(currentState, OrderEvent.ORDER_INFO_COMPLETED));
        currentState = OrderState.ITEM_MANAGEMENT;

        // Stage 2: ITEM_MANAGEMENT -> EXECUTION_PARAMS (через ITEMS_COMPLETED)
        assertTrue(OrderStateTransitions.isTransitionAllowed(currentState, OrderEvent.ITEMS_COMPLETED));
        currentState = OrderState.EXECUTION_PARAMS;

                // Stage 3: EXECUTION_PARAMS -> GLOBAL_DISCOUNTS -> PAYMENT_PROCESSING -> ADDITIONAL_INFO -> ORDER_CONFIRMATION
        assertTrue(OrderStateTransitions.isTransitionAllowed(currentState, OrderEvent.EXECUTION_PARAMS_SET));
        currentState = OrderState.GLOBAL_DISCOUNTS;

        assertTrue(OrderStateTransitions.isTransitionAllowed(currentState, OrderEvent.DISCOUNTS_APPLIED));
        currentState = OrderState.PAYMENT_PROCESSING;

        assertTrue(OrderStateTransitions.isTransitionAllowed(currentState, OrderEvent.PAYMENT_PROCESSED));
        currentState = OrderState.ADDITIONAL_INFO;

        assertTrue(OrderStateTransitions.isTransitionAllowed(currentState, OrderEvent.ADDITIONAL_INFO_COMPLETED));
        currentState = OrderState.ORDER_CONFIRMATION;

        // Stage 4: ORDER_CONFIRMATION -> ORDER_REVIEW -> LEGAL_ASPECTS -> RECEIPT_GENERATION -> COMPLETED
        assertTrue(OrderStateTransitions.isTransitionAllowed(currentState, OrderEvent.REVIEW_ORDER));
        currentState = OrderState.ORDER_REVIEW;

        assertTrue(OrderStateTransitions.isTransitionAllowed(currentState, OrderEvent.ORDER_APPROVED));
        currentState = OrderState.LEGAL_ASPECTS;

        assertTrue(OrderStateTransitions.isTransitionAllowed(currentState, OrderEvent.TERMS_ACCEPTED));
        currentState = OrderState.RECEIPT_GENERATION;

        assertTrue(OrderStateTransitions.isTransitionAllowed(currentState, OrderEvent.RECEIPT_GENERATED));
        currentState = OrderState.COMPLETED;

        // Завершення - доступний START_ORDER для перезапуску
        List<OrderEvent> finalEvents = OrderStateTransitions.getAvailableEvents(currentState);
        assertFalse(finalEvents.isEmpty());
        assertTrue(finalEvents.contains(OrderEvent.START_ORDER));
    }
}
