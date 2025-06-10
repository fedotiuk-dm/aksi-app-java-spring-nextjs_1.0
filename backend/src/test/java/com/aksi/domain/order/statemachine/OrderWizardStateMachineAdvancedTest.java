package com.aksi.domain.order.statemachine;

import java.util.EnumSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import com.aksi.domain.order.statemachine.enums.OrderStateTransitions;

/**
 * Розширені тести для Order Wizard State Machine.
 * Покривають всі можливі сценарії, edge cases та циклічні переходи.
 */
@DisplayName("Order Wizard State Machine - Розширені тести")
public class OrderWizardStateMachineAdvancedTest {

    private Set<OrderState> allStates;
    private Set<OrderEvent> allEvents;

    @BeforeEach
    void setUp() {
        allStates = EnumSet.allOf(OrderState.class);
        allEvents = EnumSet.allOf(OrderEvent.class);
    }

    // =================== ТЕСТИ ПОВНОГО ПОКРИТТЯ ===================

    @Test
    @DisplayName("Тестування що всі стани мають хоча б один доступний перехід")
    void shouldEnsureAllStatesHaveTransitions() {
        for (OrderState state : allStates) {
            List<OrderEvent> availableEvents = OrderStateTransitions.getAvailableEvents(state);
            assertFalse(availableEvents.isEmpty(),
                "Стан " + state + " не має жодного доступного переходу");
        }
    }

    @Test
    @DisplayName("Тестування що всі події використовуються хоча б в одному стані")
    void shouldEnsureAllEventsAreUsed() {
        for (OrderEvent event : allEvents) {
            List<OrderState> statesAllowingEvent = OrderStateTransitions.getStatesAllowingEvent(event);
            assertFalse(statesAllowingEvent.isEmpty(),
                "Подія " + event + " не використовується жодним станом");
        }
    }

    // =================== ТЕСТИ ЦИКЛІЧНИХ ПЕРЕХОДІВ ===================

    @Test
    @DisplayName("Тестування GO_BACK переходів - повернення на попередній етап")
    void shouldValidateGoBackTransitions() {
        // Перевіряємо що GO_BACK доступний тільки з станів де це логічно
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ORDER_INITIALIZATION, OrderEvent.GO_BACK));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ITEM_MANAGEMENT, OrderEvent.GO_BACK));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.EXECUTION_PARAMS, OrderEvent.GO_BACK));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.GLOBAL_DISCOUNTS, OrderEvent.GO_BACK));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.PAYMENT_PROCESSING, OrderEvent.GO_BACK));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ADDITIONAL_INFO, OrderEvent.GO_BACK));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ORDER_CONFIRMATION, OrderEvent.GO_BACK));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ORDER_REVIEW, OrderEvent.GO_BACK));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.LEGAL_ASPECTS, OrderEvent.GO_BACK));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.RECEIPT_GENERATION, OrderEvent.GO_BACK));

        // GO_BACK НЕ доступний з початкових та кінцевих станів
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.CLIENT_SELECTION, OrderEvent.GO_BACK));
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.COMPLETED, OrderEvent.GO_BACK));
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.CANCELLED, OrderEvent.GO_BACK));
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.INITIAL, OrderEvent.GO_BACK));
    }

    @Test
    @DisplayName("Тестування CANCEL_ORDER - скасування з будь-якого активного стану")
    void shouldValidateCancelOrderTransitions() {
        // CANCEL_ORDER доступний з усіх активних станів
        List<OrderState> activeStates = List.of(
            OrderState.CLIENT_SELECTION,
            OrderState.ORDER_INITIALIZATION,
            OrderState.ITEM_MANAGEMENT,
            OrderState.ITEM_WIZARD_ACTIVE,
            OrderState.EXECUTION_PARAMS,
            OrderState.GLOBAL_DISCOUNTS,
            OrderState.PAYMENT_PROCESSING,
            OrderState.ADDITIONAL_INFO,
            OrderState.ORDER_CONFIRMATION,
            OrderState.ORDER_REVIEW,
            OrderState.LEGAL_ASPECTS,
            OrderState.RECEIPT_GENERATION
        );

        for (OrderState state : activeStates) {
            assertTrue(OrderStateTransitions.isTransitionAllowed(state, OrderEvent.CANCEL_ORDER),
                "CANCEL_ORDER повинен бути доступний зі стану " + state);
        }

        // CANCEL_ORDER НЕ доступний з кінцевих станів
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.COMPLETED, OrderEvent.CANCEL_ORDER));
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.CANCELLED, OrderEvent.CANCEL_ORDER));
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.INITIAL, OrderEvent.CANCEL_ORDER));
    }

    @Test
    @DisplayName("Тестування START_ORDER - перезапуск з кінцевих станів")
    void shouldValidateStartOrderTransitions() {
        // START_ORDER доступний тільки з кінцевих та початкового станів
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.INITIAL, OrderEvent.START_ORDER));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.COMPLETED, OrderEvent.START_ORDER));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.CANCELLED, OrderEvent.START_ORDER));

        // START_ORDER НЕ доступний з активних станів
        List<OrderState> activeStates = List.of(
            OrderState.CLIENT_SELECTION,
            OrderState.ORDER_INITIALIZATION,
            OrderState.ITEM_MANAGEMENT,
            OrderState.EXECUTION_PARAMS,
            OrderState.ORDER_CONFIRMATION
        );

        for (OrderState state : activeStates) {
            assertFalse(OrderStateTransitions.isTransitionAllowed(state, OrderEvent.START_ORDER),
                "START_ORDER не повинен бути доступний зі стану " + state);
        }
    }

    // =================== ТЕСТИ ITEM WIZARD ЦИКЛУ ===================

    @Test
    @DisplayName("Тестування Item Wizard підциклу")
    void shouldValidateItemWizardCycle() {
        // З ITEM_MANAGEMENT можна запустити візард
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ITEM_MANAGEMENT, OrderEvent.START_ITEM_WIZARD));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ITEM_MANAGEMENT, OrderEvent.ADD_ITEM));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ITEM_MANAGEMENT, OrderEvent.EDIT_ITEM));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ITEM_MANAGEMENT, OrderEvent.DELETE_ITEM));

        // З ITEM_WIZARD_ACTIVE можна завершити або скасувати
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ITEM_WIZARD_ACTIVE, OrderEvent.ITEM_ADDED));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ITEM_WIZARD_ACTIVE, OrderEvent.CANCEL_ITEM_WIZARD));

        // З ITEM_MANAGEMENT можна завершити етап
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ITEM_MANAGEMENT, OrderEvent.ITEMS_COMPLETED));
    }

    // =================== ПАРАМЕТРИЗОВАНІ ТЕСТИ ===================

    @ParameterizedTest
    @EnumSource(OrderState.class)
    @DisplayName("Параметризований тест - всі стани повертають непустий список подій")
    void shouldReturnNonEmptyEventsForAllStates(OrderState state) {
        List<OrderEvent> events = OrderStateTransitions.getAvailableEvents(state);
        assertNotNull(events, "Список подій для стану " + state + " не повинен бути null");
        assertFalse(events.isEmpty(), "Список подій для стану " + state + " не повинен бути пустим");
    }

    @ParameterizedTest
    @EnumSource(OrderEvent.class)
    @DisplayName("Параметризований тест - всі події мають хоча б один стан")
    void shouldHaveAtLeastOneStateForAllEvents(OrderEvent event) {
        List<OrderState> states = OrderStateTransitions.getStatesAllowingEvent(event);
        assertNotNull(states, "Список станів для події " + event + " не повинен бути null");
        assertFalse(states.isEmpty(), "Подія " + event + " повинна бути доступна хоча б з одного стану");
    }

    // =================== ТЕСТИ СПЕЦИФІЧНИХ СЦЕНАРІЇВ ===================

    @Test
    @DisplayName("Тестування послідовності з поверненням назад")
    void shouldValidateBackwardSequence() {
        // Прямий шлях: CLIENT_SELECTION -> ORDER_INITIALIZATION -> ITEM_MANAGEMENT
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.CLIENT_SELECTION, OrderEvent.CLIENT_SELECTED));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ORDER_INITIALIZATION, OrderEvent.ORDER_INFO_COMPLETED));

        // Зворотний шлях: ITEM_MANAGEMENT -> GO_BACK
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ITEM_MANAGEMENT, OrderEvent.GO_BACK));

        // З ORDER_INITIALIZATION також можна повернутися
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ORDER_INITIALIZATION, OrderEvent.GO_BACK));
    }

    @Test
    @DisplayName("Тестування альтернативних сценаріїв скасування")
    void shouldValidateCancellationScenarios() {
        // Скасування на ранніх етапах
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.CLIENT_SELECTION, OrderEvent.CANCEL_ORDER));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ITEM_MANAGEMENT, OrderEvent.CANCEL_ORDER));

        // Скасування на пізніх етапах
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ORDER_CONFIRMATION, OrderEvent.CANCEL_ORDER));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.RECEIPT_GENERATION, OrderEvent.CANCEL_ORDER));

        // Скасування з Item Wizard
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ITEM_WIZARD_ACTIVE, OrderEvent.CANCEL_ORDER));
        assertTrue(OrderStateTransitions.isTransitionAllowed(OrderState.ITEM_WIZARD_ACTIVE, OrderEvent.CANCEL_ITEM_WIZARD));
    }

    // =================== ТЕСТИ ВАЛІДАЦІЇ МАТРИЦІ ПЕРЕХОДІВ ===================

    @Test
    @DisplayName("Валідація повної матриці переходів - Stage 1")
    void shouldValidateStage1TransitionMatrix() {
        // CLIENT_SELECTION - тільки 2 події
        List<OrderEvent> clientSelectionEvents = OrderStateTransitions.getAvailableEvents(OrderState.CLIENT_SELECTION);
        assertEquals(2, clientSelectionEvents.size());
        assertTrue(clientSelectionEvents.containsAll(List.of(OrderEvent.CLIENT_SELECTED, OrderEvent.CANCEL_ORDER)));

        // ORDER_INITIALIZATION - 3 події
        List<OrderEvent> orderInitEvents = OrderStateTransitions.getAvailableEvents(OrderState.ORDER_INITIALIZATION);
        assertEquals(3, orderInitEvents.size());
        assertTrue(orderInitEvents.containsAll(List.of(
            OrderEvent.ORDER_INFO_COMPLETED, OrderEvent.GO_BACK, OrderEvent.CANCEL_ORDER)));
    }

    @Test
    @DisplayName("Валідація повної матриці переходів - Stage 2")
    void shouldValidateStage2TransitionMatrix() {
        // ITEM_MANAGEMENT - 7 подій
        List<OrderEvent> itemMgmtEvents = OrderStateTransitions.getAvailableEvents(OrderState.ITEM_MANAGEMENT);
        assertEquals(7, itemMgmtEvents.size());
        assertTrue(itemMgmtEvents.containsAll(List.of(
            OrderEvent.START_ITEM_WIZARD, OrderEvent.ADD_ITEM, OrderEvent.EDIT_ITEM,
            OrderEvent.DELETE_ITEM, OrderEvent.ITEMS_COMPLETED, OrderEvent.GO_BACK, OrderEvent.CANCEL_ORDER)));

        // ITEM_WIZARD_ACTIVE - 3 події
        List<OrderEvent> wizardEvents = OrderStateTransitions.getAvailableEvents(OrderState.ITEM_WIZARD_ACTIVE);
        assertEquals(3, wizardEvents.size());
        assertTrue(wizardEvents.containsAll(List.of(
            OrderEvent.ITEM_ADDED, OrderEvent.CANCEL_ITEM_WIZARD, OrderEvent.CANCEL_ORDER)));
    }

    @Test
    @DisplayName("Валідація повної матриці переходів - Stage 3")
    void shouldValidateStage3TransitionMatrix() {
        // Всі стани Stage 3 повинні мати 3 стандартні події
        List<OrderState> stage3States = List.of(
            OrderState.EXECUTION_PARAMS, OrderState.GLOBAL_DISCOUNTS,
            OrderState.PAYMENT_PROCESSING, OrderState.ADDITIONAL_INFO);

        for (OrderState state : stage3States) {
            List<OrderEvent> events = OrderStateTransitions.getAvailableEvents(state);
            assertEquals(3, events.size(), "Стан " + state + " повинен мати 3 події");
            assertTrue(events.contains(OrderEvent.GO_BACK));
            assertTrue(events.contains(OrderEvent.CANCEL_ORDER));
        }

        // Перевірка специфічних подій для кожного стану
        assertTrue(OrderStateTransitions.getAvailableEvents(OrderState.EXECUTION_PARAMS)
            .contains(OrderEvent.EXECUTION_PARAMS_SET));
        assertTrue(OrderStateTransitions.getAvailableEvents(OrderState.GLOBAL_DISCOUNTS)
            .contains(OrderEvent.DISCOUNTS_APPLIED));
        assertTrue(OrderStateTransitions.getAvailableEvents(OrderState.PAYMENT_PROCESSING)
            .contains(OrderEvent.PAYMENT_PROCESSED));
        assertTrue(OrderStateTransitions.getAvailableEvents(OrderState.ADDITIONAL_INFO)
            .contains(OrderEvent.ADDITIONAL_INFO_COMPLETED));
    }

    @Test
    @DisplayName("Валідація повної матриці переходів - Stage 4")
    void shouldValidateStage4TransitionMatrix() {
        // ORDER_CONFIRMATION, ORDER_REVIEW, LEGAL_ASPECTS - по 3 події
        List<OrderState> stage4ActiveStates = List.of(
            OrderState.ORDER_CONFIRMATION, OrderState.ORDER_REVIEW, OrderState.LEGAL_ASPECTS);

        for (OrderState state : stage4ActiveStates) {
            List<OrderEvent> events = OrderStateTransitions.getAvailableEvents(state);
            assertEquals(3, events.size(), "Стан " + state + " повинен мати 3 події");
            assertTrue(events.contains(OrderEvent.GO_BACK));
            assertTrue(events.contains(OrderEvent.CANCEL_ORDER));
        }

        // RECEIPT_GENERATION - 3 події (включаючи CANCEL_ORDER)
        List<OrderEvent> receiptEvents = OrderStateTransitions.getAvailableEvents(OrderState.RECEIPT_GENERATION);
        assertEquals(3, receiptEvents.size());
        assertTrue(receiptEvents.containsAll(List.of(
            OrderEvent.RECEIPT_GENERATED, OrderEvent.GO_BACK, OrderEvent.CANCEL_ORDER)));
    }

    @Test
    @DisplayName("Валідація кінцевих станів")
    void shouldValidateFinalStates() {
        // COMPLETED та CANCELLED - тільки START_ORDER
        List<OrderEvent> completedEvents = OrderStateTransitions.getAvailableEvents(OrderState.COMPLETED);
        assertEquals(1, completedEvents.size());
        assertEquals(OrderEvent.START_ORDER, completedEvents.get(0));

        List<OrderEvent> cancelledEvents = OrderStateTransitions.getAvailableEvents(OrderState.CANCELLED);
        assertEquals(1, cancelledEvents.size());
        assertEquals(OrderEvent.START_ORDER, cancelledEvents.get(0));

        // INITIAL - тільки START_ORDER
        List<OrderEvent> initialEvents = OrderStateTransitions.getAvailableEvents(OrderState.INITIAL);
        assertEquals(1, initialEvents.size());
        assertEquals(OrderEvent.START_ORDER, initialEvents.get(0));
    }

    // =================== ТЕСТИ EDGE CASES ===================

    @Test
    @DisplayName("Тестування граничних випадків переходів")
    void shouldHandleEdgeCases() {
        // Неможливі переходи між віддаленими станами
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.CLIENT_SELECTION, OrderEvent.RECEIPT_GENERATED));
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.EXECUTION_PARAMS, OrderEvent.CLIENT_SELECTED));
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.COMPLETED, OrderEvent.ITEMS_COMPLETED));

        // Спроба виконати події з неправильних станів
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.ORDER_REVIEW, OrderEvent.ITEM_ADDED));
        assertFalse(OrderStateTransitions.isTransitionAllowed(OrderState.LEGAL_ASPECTS, OrderEvent.EXECUTION_PARAMS_SET));
    }

    @Test
    @DisplayName("Тестування консистентності переходів")
    void shouldEnsureTransitionConsistency() {
        // Якщо стан A може перейти до події E, то E повинна бути у списку для стану A
        for (OrderState state : allStates) {
            List<OrderEvent> events = OrderStateTransitions.getAvailableEvents(state);

            for (OrderEvent event : events) {
                assertTrue(OrderStateTransitions.isTransitionAllowed(state, event),
                    "Подія " + event + " є у списку для стану " + state +
                    " але isTransitionAllowed повертає false");

                List<OrderState> statesForEvent = OrderStateTransitions.getStatesAllowingEvent(event);
                assertTrue(statesForEvent.contains(state),
                    "Стан " + state + " дозволяє подію " + event +
                    " але не входить до списку getStatesAllowingEvent");
            }
        }
    }

    // =================== ТЕСТИ ПРОДУКТИВНОСТІ ===================

    @Test
    @DisplayName("Тестування продуктивності методів")
    void shouldPerformWell() {
        long startTime = System.nanoTime();

        // Виконуємо багато операцій
        for (int i = 0; i < 1000; i++) {
            for (OrderState state : allStates) {
                OrderStateTransitions.getAvailableEvents(state);
                for (OrderEvent event : allEvents) {
                    OrderStateTransitions.isTransitionAllowed(state, event);
                }
            }
        }

        long endTime = System.nanoTime();
        long durationMs = (endTime - startTime) / 1_000_000;

        // Всі операції повинні виконуватися швидко (менше 1 секунди)
        assertTrue(durationMs < 1000,
            "Операції займають забагато часу: " + durationMs + "мс");
    }
}
