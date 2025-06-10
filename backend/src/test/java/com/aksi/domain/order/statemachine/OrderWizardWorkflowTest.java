package com.aksi.domain.order.statemachine;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.aksi.domain.order.statemachine.enums.OrderStateTransitions;

/**
 * Тести для симуляції реальних workflow сценаріїв Order Wizard.
 * Ці тести моделюють реальне використання системи операторами хімчистки.
 */
@DisplayName("Order Wizard - Workflow симуляції")
public class OrderWizardWorkflowTest {

    /**
     * Клас для симуляції сесії замовлення
     */
    private static class OrderSession {
        private OrderState currentState;
        private final List<OrderEvent> eventHistory;
        private final List<OrderState> stateHistory;

        public OrderSession() {
            this.currentState = OrderState.INITIAL;
            this.eventHistory = new ArrayList<>();
            this.stateHistory = new ArrayList<>();
            this.stateHistory.add(currentState);
        }

        public boolean processEvent(OrderEvent event) {
            if (OrderStateTransitions.isTransitionAllowed(currentState, event)) {
                eventHistory.add(event);
                // Симуляція переходу до наступного стану (спрощено)
                this.currentState = determineNextState(currentState, event);
                stateHistory.add(currentState);
                return true;
            }
            return false;
        }

        public OrderState getCurrentState() {
            return currentState;
        }

        public List<OrderEvent> getEventHistory() {
            return new ArrayList<>(eventHistory);
        }

        public List<OrderState> getStateHistory() {
            return new ArrayList<>(stateHistory);
        }

        public List<OrderEvent> getAvailableEvents() {
            return OrderStateTransitions.getAvailableEvents(currentState);
        }

        private OrderState determineNextState(OrderState current, OrderEvent event) {
            // Спрощена логіка переходів для тестування
            return switch (current) {
                case INITIAL -> {
                    if (event == OrderEvent.START_ORDER) yield OrderState.CLIENT_SELECTION;
                    yield current;
                }
                case CLIENT_SELECTION -> {
                    if (event == OrderEvent.CLIENT_SELECTED) yield OrderState.ORDER_INITIALIZATION;
                    if (event == OrderEvent.CANCEL_ORDER) yield OrderState.CANCELLED;
                    yield current;
                }
                case ORDER_INITIALIZATION -> {
                    if (event == OrderEvent.ORDER_INFO_COMPLETED) yield OrderState.ITEM_MANAGEMENT;
                    if (event == OrderEvent.GO_BACK) yield OrderState.CLIENT_SELECTION;
                    if (event == OrderEvent.CANCEL_ORDER) yield OrderState.CANCELLED;
                    yield current;
                }
                case ITEM_MANAGEMENT -> {
                    if (event == OrderEvent.START_ITEM_WIZARD) yield OrderState.ITEM_WIZARD_ACTIVE;
                    if (event == OrderEvent.ITEMS_COMPLETED) yield OrderState.EXECUTION_PARAMS;
                    if (event == OrderEvent.GO_BACK) yield OrderState.ORDER_INITIALIZATION;
                    if (event == OrderEvent.CANCEL_ORDER) yield OrderState.CANCELLED;
                    yield current;
                }
                case ITEM_WIZARD_ACTIVE -> {
                    if (event == OrderEvent.ITEM_ADDED || event == OrderEvent.CANCEL_ITEM_WIZARD) yield OrderState.ITEM_MANAGEMENT;
                    if (event == OrderEvent.CANCEL_ORDER) yield OrderState.CANCELLED;
                    yield current;
                }
                case EXECUTION_PARAMS -> {
                    if (event == OrderEvent.EXECUTION_PARAMS_SET) yield OrderState.GLOBAL_DISCOUNTS;
                    if (event == OrderEvent.GO_BACK) yield OrderState.ITEM_MANAGEMENT;
                    if (event == OrderEvent.CANCEL_ORDER) yield OrderState.CANCELLED;
                    yield current;
                }
                case GLOBAL_DISCOUNTS -> {
                    if (event == OrderEvent.DISCOUNTS_APPLIED) yield OrderState.PAYMENT_PROCESSING;
                    if (event == OrderEvent.GO_BACK) yield OrderState.EXECUTION_PARAMS;
                    if (event == OrderEvent.CANCEL_ORDER) yield OrderState.CANCELLED;
                    yield current;
                }
                case PAYMENT_PROCESSING -> {
                    if (event == OrderEvent.PAYMENT_PROCESSED) yield OrderState.ADDITIONAL_INFO;
                    if (event == OrderEvent.GO_BACK) yield OrderState.GLOBAL_DISCOUNTS;
                    if (event == OrderEvent.CANCEL_ORDER) yield OrderState.CANCELLED;
                    yield current;
                }
                case ADDITIONAL_INFO -> {
                    if (event == OrderEvent.ADDITIONAL_INFO_COMPLETED) yield OrderState.ORDER_CONFIRMATION;
                    if (event == OrderEvent.GO_BACK) yield OrderState.PAYMENT_PROCESSING;
                    if (event == OrderEvent.CANCEL_ORDER) yield OrderState.CANCELLED;
                    yield current;
                }
                case ORDER_CONFIRMATION -> {
                    if (event == OrderEvent.REVIEW_ORDER) yield OrderState.ORDER_REVIEW;
                    if (event == OrderEvent.GO_BACK) yield OrderState.ADDITIONAL_INFO;
                    if (event == OrderEvent.CANCEL_ORDER) yield OrderState.CANCELLED;
                    yield current;
                }
                case ORDER_REVIEW -> {
                    if (event == OrderEvent.ORDER_APPROVED) yield OrderState.LEGAL_ASPECTS;
                    if (event == OrderEvent.GO_BACK) yield OrderState.ORDER_CONFIRMATION;
                    if (event == OrderEvent.CANCEL_ORDER) yield OrderState.CANCELLED;
                    yield current;
                }
                case LEGAL_ASPECTS -> {
                    if (event == OrderEvent.TERMS_ACCEPTED) yield OrderState.RECEIPT_GENERATION;
                    if (event == OrderEvent.GO_BACK) yield OrderState.ORDER_REVIEW;
                    if (event == OrderEvent.CANCEL_ORDER) yield OrderState.CANCELLED;
                    yield current;
                }
                case RECEIPT_GENERATION -> {
                    if (event == OrderEvent.RECEIPT_GENERATED) yield OrderState.COMPLETED;
                    if (event == OrderEvent.GO_BACK) yield OrderState.LEGAL_ASPECTS;
                    if (event == OrderEvent.CANCEL_ORDER) yield OrderState.CANCELLED;
                    yield current;
                }
                case COMPLETED, CANCELLED -> {
                    if (event == OrderEvent.START_ORDER) yield OrderState.CLIENT_SELECTION;
                    yield current;
                }
            };
        }
    }

    @Nested
    @DisplayName("Позитивні сценарії")
    class PositiveScenarios {

        @Test
        @DisplayName("Повний позитивний флоу - від початку до завершення")
        void shouldCompleteFullPositiveFlow() {
            OrderSession session = new OrderSession();

            // Початок
            assertTrue(session.processEvent(OrderEvent.START_ORDER));
            assertEquals(OrderState.CLIENT_SELECTION, session.getCurrentState());

            // Stage 1: Клієнт та базова інформація
            assertTrue(session.processEvent(OrderEvent.CLIENT_SELECTED));
            assertEquals(OrderState.ORDER_INITIALIZATION, session.getCurrentState());

            assertTrue(session.processEvent(OrderEvent.ORDER_INFO_COMPLETED));
            assertEquals(OrderState.ITEM_MANAGEMENT, session.getCurrentState());

            // Stage 2: Менеджер предметів
            assertTrue(session.processEvent(OrderEvent.START_ITEM_WIZARD));
            assertEquals(OrderState.ITEM_WIZARD_ACTIVE, session.getCurrentState());

            assertTrue(session.processEvent(OrderEvent.ITEM_ADDED));
            assertEquals(OrderState.ITEM_MANAGEMENT, session.getCurrentState());

            assertTrue(session.processEvent(OrderEvent.ITEMS_COMPLETED));
            assertEquals(OrderState.EXECUTION_PARAMS, session.getCurrentState());

            // Stage 3: Загальні параметри
            assertTrue(session.processEvent(OrderEvent.EXECUTION_PARAMS_SET));
            assertEquals(OrderState.GLOBAL_DISCOUNTS, session.getCurrentState());

            assertTrue(session.processEvent(OrderEvent.DISCOUNTS_APPLIED));
            assertEquals(OrderState.PAYMENT_PROCESSING, session.getCurrentState());

            assertTrue(session.processEvent(OrderEvent.PAYMENT_PROCESSED));
            assertEquals(OrderState.ADDITIONAL_INFO, session.getCurrentState());

            assertTrue(session.processEvent(OrderEvent.ADDITIONAL_INFO_COMPLETED));
            assertEquals(OrderState.ORDER_CONFIRMATION, session.getCurrentState());

            // Stage 4: Підтвердження та завершення
            assertTrue(session.processEvent(OrderEvent.REVIEW_ORDER));
            assertEquals(OrderState.ORDER_REVIEW, session.getCurrentState());

            assertTrue(session.processEvent(OrderEvent.ORDER_APPROVED));
            assertEquals(OrderState.LEGAL_ASPECTS, session.getCurrentState());

            assertTrue(session.processEvent(OrderEvent.TERMS_ACCEPTED));
            assertEquals(OrderState.RECEIPT_GENERATION, session.getCurrentState());

            assertTrue(session.processEvent(OrderEvent.RECEIPT_GENERATED));
            assertEquals(OrderState.COMPLETED, session.getCurrentState());

            // Перевіряємо історію
            List<OrderEvent> history = session.getEventHistory();
            assertEquals(13, history.size());
            assertTrue(history.contains(OrderEvent.START_ORDER));
            assertTrue(history.contains(OrderEvent.CLIENT_SELECTED));
            assertTrue(history.contains(OrderEvent.RECEIPT_GENERATED));
        }

        @Test
        @DisplayName("Флоу з додаванням кількох предметів")
        void shouldHandleMultipleItemsFlow() {
            OrderSession session = new OrderSession();

            // Дійдемо до ITEM_MANAGEMENT
            session.processEvent(OrderEvent.START_ORDER);
            session.processEvent(OrderEvent.CLIENT_SELECTED);
            session.processEvent(OrderEvent.ORDER_INFO_COMPLETED);

            assertEquals(OrderState.ITEM_MANAGEMENT, session.getCurrentState());

            // Додаємо перший предмет
            assertTrue(session.processEvent(OrderEvent.START_ITEM_WIZARD));
            assertEquals(OrderState.ITEM_WIZARD_ACTIVE, session.getCurrentState());

            assertTrue(session.processEvent(OrderEvent.ITEM_ADDED));
            assertEquals(OrderState.ITEM_MANAGEMENT, session.getCurrentState());

            // Додаємо другий предмет
            assertTrue(session.processEvent(OrderEvent.START_ITEM_WIZARD));
            assertEquals(OrderState.ITEM_WIZARD_ACTIVE, session.getCurrentState());

            assertTrue(session.processEvent(OrderEvent.ITEM_ADDED));
            assertEquals(OrderState.ITEM_MANAGEMENT, session.getCurrentState());

            // Редагуємо предмет
            assertTrue(session.processEvent(OrderEvent.EDIT_ITEM));
            assertEquals(OrderState.ITEM_MANAGEMENT, session.getCurrentState());

            // Завершуємо етап
            assertTrue(session.processEvent(OrderEvent.ITEMS_COMPLETED));
            assertEquals(OrderState.EXECUTION_PARAMS, session.getCurrentState());

            // Перевіряємо що було кілька циклів додавання предметів
            List<OrderEvent> history = session.getEventHistory();
            long itemWizardStarts = history.stream().filter(e -> e == OrderEvent.START_ITEM_WIZARD).count();
            long itemsAdded = history.stream().filter(e -> e == OrderEvent.ITEM_ADDED).count();

            assertEquals(2, itemWizardStarts);
            assertEquals(2, itemsAdded);
        }

        @Test
        @DisplayName("Флоу з перезапуском після завершення")
        void shouldHandleRestartAfterCompletion() {
            OrderSession session = new OrderSession();

            // Швидкий шлях до завершення
            session.processEvent(OrderEvent.START_ORDER);
            session.processEvent(OrderEvent.CLIENT_SELECTED);
            session.processEvent(OrderEvent.ORDER_INFO_COMPLETED);
            session.processEvent(OrderEvent.ITEMS_COMPLETED);
            session.processEvent(OrderEvent.EXECUTION_PARAMS_SET);
            session.processEvent(OrderEvent.DISCOUNTS_APPLIED);
            session.processEvent(OrderEvent.PAYMENT_PROCESSED);
            session.processEvent(OrderEvent.ADDITIONAL_INFO_COMPLETED);
            session.processEvent(OrderEvent.REVIEW_ORDER);
            session.processEvent(OrderEvent.ORDER_APPROVED);
            session.processEvent(OrderEvent.TERMS_ACCEPTED);
            session.processEvent(OrderEvent.RECEIPT_GENERATED);

            assertEquals(OrderState.COMPLETED, session.getCurrentState());

            // Перезапуск
            assertTrue(session.processEvent(OrderEvent.START_ORDER));
            assertEquals(OrderState.CLIENT_SELECTION, session.getCurrentState());

            // Можемо почати новий цикл
            assertTrue(session.processEvent(OrderEvent.CLIENT_SELECTED));
            assertEquals(OrderState.ORDER_INITIALIZATION, session.getCurrentState());
        }
    }

    @Nested
    @DisplayName("Сценарії з поверненням назад")
    class BackwardScenarios {

        @Test
        @DisplayName("Повернення назад через кілька етапів")
        void shouldHandleMultipleBackwardSteps() {
            OrderSession session = new OrderSession();

            // Дійдемо до PAYMENT_PROCESSING
            session.processEvent(OrderEvent.START_ORDER);
            session.processEvent(OrderEvent.CLIENT_SELECTED);
            session.processEvent(OrderEvent.ORDER_INFO_COMPLETED);
            session.processEvent(OrderEvent.ITEMS_COMPLETED);
            session.processEvent(OrderEvent.EXECUTION_PARAMS_SET);
            session.processEvent(OrderEvent.DISCOUNTS_APPLIED);

            assertEquals(OrderState.PAYMENT_PROCESSING, session.getCurrentState());

            // Повертаємося назад поетапно
            assertTrue(session.processEvent(OrderEvent.GO_BACK));
            assertEquals(OrderState.GLOBAL_DISCOUNTS, session.getCurrentState());

            assertTrue(session.processEvent(OrderEvent.GO_BACK));
            assertEquals(OrderState.EXECUTION_PARAMS, session.getCurrentState());

            assertTrue(session.processEvent(OrderEvent.GO_BACK));
            assertEquals(OrderState.ITEM_MANAGEMENT, session.getCurrentState());

            assertTrue(session.processEvent(OrderEvent.GO_BACK));
            assertEquals(OrderState.ORDER_INITIALIZATION, session.getCurrentState());

            // З ORDER_INITIALIZATION можемо повернутися до CLIENT_SELECTION
            assertTrue(session.processEvent(OrderEvent.GO_BACK));
            assertEquals(OrderState.CLIENT_SELECTION, session.getCurrentState());

            // З CLIENT_SELECTION GO_BACK недоступний
            assertFalse(session.processEvent(OrderEvent.GO_BACK));
            assertEquals(OrderState.CLIENT_SELECTION, session.getCurrentState());
        }

        @Test
        @DisplayName("Повернення і продовження вперед")
        void shouldHandleBackwardAndForwardFlow() {
            OrderSession session = new OrderSession();

            // Дійдемо до ORDER_CONFIRMATION
            session.processEvent(OrderEvent.START_ORDER);
            session.processEvent(OrderEvent.CLIENT_SELECTED);
            session.processEvent(OrderEvent.ORDER_INFO_COMPLETED);
            session.processEvent(OrderEvent.ITEMS_COMPLETED);
            session.processEvent(OrderEvent.EXECUTION_PARAMS_SET);
            session.processEvent(OrderEvent.DISCOUNTS_APPLIED);
            session.processEvent(OrderEvent.PAYMENT_PROCESSED);
            session.processEvent(OrderEvent.ADDITIONAL_INFO_COMPLETED);

            assertEquals(OrderState.ORDER_CONFIRMATION, session.getCurrentState());

            // Повертаємося назад до EXECUTION_PARAMS
            session.processEvent(OrderEvent.GO_BACK); // -> ADDITIONAL_INFO
            session.processEvent(OrderEvent.GO_BACK); // -> PAYMENT_PROCESSING
            session.processEvent(OrderEvent.GO_BACK); // -> GLOBAL_DISCOUNTS
            session.processEvent(OrderEvent.GO_BACK); // -> EXECUTION_PARAMS

            assertEquals(OrderState.EXECUTION_PARAMS, session.getCurrentState());

            // Знову йдемо вперед
            session.processEvent(OrderEvent.EXECUTION_PARAMS_SET);
            session.processEvent(OrderEvent.DISCOUNTS_APPLIED);
            session.processEvent(OrderEvent.PAYMENT_PROCESSED);
            session.processEvent(OrderEvent.ADDITIONAL_INFO_COMPLETED);

            assertEquals(OrderState.ORDER_CONFIRMATION, session.getCurrentState());

            // Продовжуємо до кінця
            session.processEvent(OrderEvent.REVIEW_ORDER);
            session.processEvent(OrderEvent.ORDER_APPROVED);
            session.processEvent(OrderEvent.TERMS_ACCEPTED);
            session.processEvent(OrderEvent.RECEIPT_GENERATED);

            assertEquals(OrderState.COMPLETED, session.getCurrentState());
        }
    }

    @Nested
    @DisplayName("Сценарії скасування")
    class CancellationScenarios {

        @Test
        @DisplayName("Скасування на різних етапах")
        void shouldHandleCancellationAtDifferentStages() {
            // Скасування на етапі вибору клієнта
            OrderSession session1 = new OrderSession();
            session1.processEvent(OrderEvent.START_ORDER);
            assertEquals(OrderState.CLIENT_SELECTION, session1.getCurrentState());

            assertTrue(session1.processEvent(OrderEvent.CANCEL_ORDER));
            assertEquals(OrderState.CANCELLED, session1.getCurrentState());

            // Скасування на етапі item management
            OrderSession session2 = new OrderSession();
            session2.processEvent(OrderEvent.START_ORDER);
            session2.processEvent(OrderEvent.CLIENT_SELECTED);
            session2.processEvent(OrderEvent.ORDER_INFO_COMPLETED);
            assertEquals(OrderState.ITEM_MANAGEMENT, session2.getCurrentState());

            assertTrue(session2.processEvent(OrderEvent.CANCEL_ORDER));
            assertEquals(OrderState.CANCELLED, session2.getCurrentState());

            // Скасування на пізньому етапі
            OrderSession session3 = new OrderSession();
            session3.processEvent(OrderEvent.START_ORDER);
            session3.processEvent(OrderEvent.CLIENT_SELECTED);
            session3.processEvent(OrderEvent.ORDER_INFO_COMPLETED);
            session3.processEvent(OrderEvent.ITEMS_COMPLETED);
            session3.processEvent(OrderEvent.EXECUTION_PARAMS_SET);
            session3.processEvent(OrderEvent.DISCOUNTS_APPLIED);
            session3.processEvent(OrderEvent.PAYMENT_PROCESSED);
            session3.processEvent(OrderEvent.ADDITIONAL_INFO_COMPLETED);
            assertEquals(OrderState.ORDER_CONFIRMATION, session3.getCurrentState());

            assertTrue(session3.processEvent(OrderEvent.CANCEL_ORDER));
            assertEquals(OrderState.CANCELLED, session3.getCurrentState());
        }

        @Test
        @DisplayName("Скасування з Item Wizard")
        void shouldHandleItemWizardCancellation() {
            OrderSession session = new OrderSession();

            // Дійдемо до Item Wizard
            session.processEvent(OrderEvent.START_ORDER);
            session.processEvent(OrderEvent.CLIENT_SELECTED);
            session.processEvent(OrderEvent.ORDER_INFO_COMPLETED);
            session.processEvent(OrderEvent.START_ITEM_WIZARD);

            assertEquals(OrderState.ITEM_WIZARD_ACTIVE, session.getCurrentState());

            // Скасування всього замовлення з Item Wizard
            assertTrue(session.processEvent(OrderEvent.CANCEL_ORDER));
            assertEquals(OrderState.CANCELLED, session.getCurrentState());

            // Новий сеанс - скасування тільки Item Wizard
            OrderSession session2 = new OrderSession();
            session2.processEvent(OrderEvent.START_ORDER);
            session2.processEvent(OrderEvent.CLIENT_SELECTED);
            session2.processEvent(OrderEvent.ORDER_INFO_COMPLETED);
            session2.processEvent(OrderEvent.START_ITEM_WIZARD);

            assertEquals(OrderState.ITEM_WIZARD_ACTIVE, session2.getCurrentState());

            // Скасування тільки візарда
            assertTrue(session2.processEvent(OrderEvent.CANCEL_ITEM_WIZARD));
            assertEquals(OrderState.ITEM_MANAGEMENT, session2.getCurrentState());

            // Можемо продовжити роботу
            assertTrue(session2.processEvent(OrderEvent.ITEMS_COMPLETED));
            assertEquals(OrderState.EXECUTION_PARAMS, session2.getCurrentState());
        }

        @Test
        @DisplayName("Перезапуск після скасування")
        void shouldHandleRestartAfterCancellation() {
            OrderSession session = new OrderSession();

            // Дійдемо до середини процесу і скасуємо
            session.processEvent(OrderEvent.START_ORDER);
            session.processEvent(OrderEvent.CLIENT_SELECTED);
            session.processEvent(OrderEvent.ORDER_INFO_COMPLETED);
            session.processEvent(OrderEvent.ITEMS_COMPLETED);
            session.processEvent(OrderEvent.CANCEL_ORDER);

            assertEquals(OrderState.CANCELLED, session.getCurrentState());

            // Перезапуск
            assertTrue(session.processEvent(OrderEvent.START_ORDER));
            assertEquals(OrderState.CLIENT_SELECTION, session.getCurrentState());

            // Можемо почати новий цикл
            assertTrue(session.processEvent(OrderEvent.CLIENT_SELECTED));
            assertEquals(OrderState.ORDER_INITIALIZATION, session.getCurrentState());

            assertTrue(session.processEvent(OrderEvent.ORDER_INFO_COMPLETED));
            assertEquals(OrderState.ITEM_MANAGEMENT, session.getCurrentState());
        }
    }

    @Nested
    @DisplayName("Складні сценарії")
    class ComplexScenarios {

        @Test
        @DisplayName("Сценарій з кількома спробами додавання предметів")
        void shouldHandleMultipleItemAdditionAttempts() {
            OrderSession session = new OrderSession();

            // Дійдемо до ITEM_MANAGEMENT
            session.processEvent(OrderEvent.START_ORDER);
            session.processEvent(OrderEvent.CLIENT_SELECTED);
            session.processEvent(OrderEvent.ORDER_INFO_COMPLETED);

            assertEquals(OrderState.ITEM_MANAGEMENT, session.getCurrentState());

            // Кілька циклів додавання/скасування предметів
            for (int i = 0; i < 3; i++) {
                assertTrue(session.processEvent(OrderEvent.START_ITEM_WIZARD));
                assertEquals(OrderState.ITEM_WIZARD_ACTIVE, session.getCurrentState());

                if (i < 2) {
                    // Скасування перших двох спроб
                    assertTrue(session.processEvent(OrderEvent.CANCEL_ITEM_WIZARD));
                    assertEquals(OrderState.ITEM_MANAGEMENT, session.getCurrentState());
                } else {
                    // Успішне додавання третьої спроби
                    assertTrue(session.processEvent(OrderEvent.ITEM_ADDED));
                    assertEquals(OrderState.ITEM_MANAGEMENT, session.getCurrentState());
                }
            }

            // Перевіряємо, що можемо продовжити
            assertTrue(session.processEvent(OrderEvent.ITEMS_COMPLETED));
            assertEquals(OrderState.EXECUTION_PARAMS, session.getCurrentState());

            // Перевіряємо історію подій
            List<OrderEvent> history = session.getEventHistory();
            long wizardStarts = history.stream().filter(e -> e == OrderEvent.START_ITEM_WIZARD).count();
            long wizardCancels = history.stream().filter(e -> e == OrderEvent.CANCEL_ITEM_WIZARD).count();
            long itemsAdded = history.stream().filter(e -> e == OrderEvent.ITEM_ADDED).count();

            assertEquals(3, wizardStarts);
            assertEquals(2, wizardCancels);
            assertEquals(1, itemsAdded);
        }

        @Test
        @DisplayName("Максимально складний сценарій з усіма можливими поверненнями")
        void shouldHandleComplexBackAndForthScenario() {
            OrderSession session = new OrderSession();

            // Початкова послідовність
            session.processEvent(OrderEvent.START_ORDER);
            session.processEvent(OrderEvent.CLIENT_SELECTED);
            session.processEvent(OrderEvent.ORDER_INFO_COMPLETED);
            session.processEvent(OrderEvent.ITEMS_COMPLETED);
            session.processEvent(OrderEvent.EXECUTION_PARAMS_SET);
            session.processEvent(OrderEvent.DISCOUNTS_APPLIED);

            assertEquals(OrderState.PAYMENT_PROCESSING, session.getCurrentState());

            // Повертаємося і знову йдемо вперед кілька разів
            for (int i = 0; i < 2; i++) {
                // Назад до EXECUTION_PARAMS
                session.processEvent(OrderEvent.GO_BACK); // -> GLOBAL_DISCOUNTS
                session.processEvent(OrderEvent.GO_BACK); // -> EXECUTION_PARAMS

                // Знову вперед
                session.processEvent(OrderEvent.EXECUTION_PARAMS_SET); // -> GLOBAL_DISCOUNTS
                session.processEvent(OrderEvent.DISCOUNTS_APPLIED); // -> PAYMENT_PROCESSING
            }

            assertEquals(OrderState.PAYMENT_PROCESSING, session.getCurrentState());

            // Продовжуємо до кінця
            session.processEvent(OrderEvent.PAYMENT_PROCESSED);
            session.processEvent(OrderEvent.ADDITIONAL_INFO_COMPLETED);
            session.processEvent(OrderEvent.REVIEW_ORDER);
            session.processEvent(OrderEvent.ORDER_APPROVED);
            session.processEvent(OrderEvent.TERMS_ACCEPTED);
            session.processEvent(OrderEvent.RECEIPT_GENERATED);

            assertEquals(OrderState.COMPLETED, session.getCurrentState());

            // Перевіряємо, що історія містить кілька циклів
            List<OrderEvent> history = session.getEventHistory();
            long executionParamsCount = history.stream().filter(e -> e == OrderEvent.EXECUTION_PARAMS_SET).count();
            long discountsAppliedCount = history.stream().filter(e -> e == OrderEvent.DISCOUNTS_APPLIED).count();
            long goBackCount = history.stream().filter(e -> e == OrderEvent.GO_BACK).count();

            assertEquals(3, executionParamsCount); // 1 + 2 повторення
            assertEquals(3, discountsAppliedCount); // 1 + 2 повторення
            assertEquals(4, goBackCount); // 2 * 2 кроки назад
        }
    }

    @Nested
    @DisplayName("Валідація доступних подій")
    class AvailableEventsValidation {

        @Test
        @DisplayName("Доступні події змінюються правильно по ходу процесу")
        void shouldValidateAvailableEventsChangeCorrectly() {
            OrderSession session = new OrderSession();

            // INITIAL
            List<OrderEvent> initialEvents = session.getAvailableEvents();
            assertEquals(1, initialEvents.size());
            assertTrue(initialEvents.contains(OrderEvent.START_ORDER));

            // CLIENT_SELECTION
            session.processEvent(OrderEvent.START_ORDER);
            List<OrderEvent> clientEvents = session.getAvailableEvents();
            assertEquals(2, clientEvents.size());
            assertTrue(clientEvents.contains(OrderEvent.CLIENT_SELECTED));
            assertTrue(clientEvents.contains(OrderEvent.CANCEL_ORDER));

            // ORDER_INITIALIZATION
            session.processEvent(OrderEvent.CLIENT_SELECTED);
            List<OrderEvent> orderInitEvents = session.getAvailableEvents();
            assertEquals(3, orderInitEvents.size());
            assertTrue(orderInitEvents.contains(OrderEvent.ORDER_INFO_COMPLETED));
            assertTrue(orderInitEvents.contains(OrderEvent.GO_BACK));
            assertTrue(orderInitEvents.contains(OrderEvent.CANCEL_ORDER));

            // ITEM_MANAGEMENT
            session.processEvent(OrderEvent.ORDER_INFO_COMPLETED);
            List<OrderEvent> itemMgmtEvents = session.getAvailableEvents();
            assertEquals(7, itemMgmtEvents.size());
            assertTrue(itemMgmtEvents.contains(OrderEvent.START_ITEM_WIZARD));
            assertTrue(itemMgmtEvents.contains(OrderEvent.ADD_ITEM));
            assertTrue(itemMgmtEvents.contains(OrderEvent.EDIT_ITEM));
            assertTrue(itemMgmtEvents.contains(OrderEvent.DELETE_ITEM));
            assertTrue(itemMgmtEvents.contains(OrderEvent.ITEMS_COMPLETED));
            assertTrue(itemMgmtEvents.contains(OrderEvent.GO_BACK));
            assertTrue(itemMgmtEvents.contains(OrderEvent.CANCEL_ORDER));

            // ITEM_WIZARD_ACTIVE
            session.processEvent(OrderEvent.START_ITEM_WIZARD);
            List<OrderEvent> wizardEvents = session.getAvailableEvents();
            assertEquals(3, wizardEvents.size());
            assertTrue(wizardEvents.contains(OrderEvent.ITEM_ADDED));
            assertTrue(wizardEvents.contains(OrderEvent.CANCEL_ITEM_WIZARD));
            assertTrue(wizardEvents.contains(OrderEvent.CANCEL_ORDER));
        }

        @Test
        @DisplayName("CANCEL_ORDER доступний на всіх активних етапах")
        void shouldValidateCancelOrderAvailableOnActiveStages() {
            OrderSession session = new OrderSession();

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

            // Симуляція проходження через всі стани
            session.processEvent(OrderEvent.START_ORDER);

            for (int i = 0; i < activeStates.size(); i++) {
                OrderState expectedState = activeStates.get(i);

                // Переходимо до потрібного стану (спрощено)
                while (session.getCurrentState() != expectedState && i > 0) {
                    List<OrderEvent> availableEvents = session.getAvailableEvents();
                    // Знаходимо першу "forward" подію
                    OrderEvent forwardEvent = availableEvents.stream()
                        .filter(e -> e != OrderEvent.GO_BACK && e != OrderEvent.CANCEL_ORDER)
                        .findFirst()
                        .orElse(null);

                    if (forwardEvent != null) {
                        session.processEvent(forwardEvent);
                    } else {
                        break;
                    }
                }

                // Перевіряємо що CANCEL_ORDER доступний
                if (session.getCurrentState() == expectedState) {
                    List<OrderEvent> availableEvents = session.getAvailableEvents();
                    assertTrue(availableEvents.contains(OrderEvent.CANCEL_ORDER),
                        "CANCEL_ORDER повинен бути доступний у стані " + expectedState);
                }
            }
        }
    }
}
