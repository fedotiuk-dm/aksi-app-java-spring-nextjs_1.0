package com.aksi.domain.order.statemachine.service.state;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для логіки переходів між станами Order Wizard.
 *
 * Відповідальності (SRP):
 * - Визначення можливих переходів між станами
 * - Отримання доступних подій для стану
 * - Навігація по wizard (next/previous стани)
 *
 * Принципи:
 * - Single Responsibility: тільки логіка переходів
 * - Open/Closed: легко розширюється для нових станів
 * - Відповідає конфігурації в Stage1-4TransitionConfigurer
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WizardTransitionService {

    /**
     * Визначає чи можливий перехід між двома станами.
     */
    public boolean canTransition(OrderState from, OrderState to) {
        List<OrderState> possibleTransitions = getPossibleTransitions(from);
        boolean canTransition = possibleTransitions.contains(to);

        log.debug("Перевірка переходу {} -> {}: {}", from, to, canTransition);
        return canTransition;
    }

    /**
     * Повертає список можливих цільових станів з поточного стану.
     * Базується на конфігурації в Stage1-4TransitionConfigurer.
     */
    public List<OrderState> getPossibleTransitions(OrderState currentState) {
        return switch (currentState) {
            case INITIAL -> List.of(OrderState.CLIENT_SELECTION);

            case CLIENT_SELECTION -> List.of(OrderState.ORDER_INITIALIZATION, OrderState.CANCELLED);

            case ORDER_INITIALIZATION -> List.of(OrderState.ITEM_MANAGEMENT, OrderState.CLIENT_SELECTION, OrderState.CANCELLED);

            // Етап 2: Менеджер предметів
            case ITEM_MANAGEMENT -> List.of(OrderState.ITEM_WIZARD_ACTIVE, OrderState.EXECUTION_PARAMS, OrderState.ORDER_INITIALIZATION);

            case ITEM_WIZARD_ACTIVE -> List.of(OrderState.ITEM_BASIC_INFO, OrderState.ITEM_MANAGEMENT);

            // Підвізард предметів
            case ITEM_BASIC_INFO -> List.of(OrderState.ITEM_CHARACTERISTICS, OrderState.ITEM_WIZARD_ACTIVE, OrderState.ITEM_MANAGEMENT);

            case ITEM_CHARACTERISTICS -> List.of(OrderState.ITEM_DEFECTS_STAINS, OrderState.ITEM_BASIC_INFO, OrderState.ITEM_MANAGEMENT);

            case ITEM_DEFECTS_STAINS -> List.of(OrderState.ITEM_PRICING, OrderState.ITEM_CHARACTERISTICS, OrderState.ITEM_MANAGEMENT);

            case ITEM_PRICING -> List.of(OrderState.ITEM_PHOTOS, OrderState.ITEM_DEFECTS_STAINS, OrderState.ITEM_MANAGEMENT);

            case ITEM_PHOTOS -> List.of(OrderState.ITEM_COMPLETED, OrderState.ITEM_PRICING, OrderState.ITEM_MANAGEMENT);

            case ITEM_COMPLETED -> List.of(OrderState.ITEM_MANAGEMENT);

            // Етап 3: Параметри замовлення
            case EXECUTION_PARAMS -> List.of(OrderState.GLOBAL_DISCOUNTS, OrderState.ITEM_MANAGEMENT, OrderState.CANCELLED);

            case GLOBAL_DISCOUNTS -> List.of(OrderState.PAYMENT_PROCESSING, OrderState.EXECUTION_PARAMS, OrderState.CANCELLED);

            case PAYMENT_PROCESSING -> List.of(OrderState.ADDITIONAL_INFO, OrderState.GLOBAL_DISCOUNTS, OrderState.CANCELLED);

            case ADDITIONAL_INFO -> List.of(OrderState.ORDER_CONFIRMATION, OrderState.PAYMENT_PROCESSING, OrderState.CANCELLED);

            // Етап 4: Підтвердження та завершення
            case ORDER_CONFIRMATION -> List.of(OrderState.ORDER_REVIEW, OrderState.ADDITIONAL_INFO, OrderState.CANCELLED);

            case ORDER_REVIEW -> List.of(OrderState.LEGAL_ASPECTS, OrderState.ORDER_CONFIRMATION, OrderState.CANCELLED);

            case LEGAL_ASPECTS -> List.of(OrderState.RECEIPT_GENERATION, OrderState.ORDER_REVIEW, OrderState.CANCELLED);

            case RECEIPT_GENERATION -> List.of(OrderState.COMPLETED);

            // Фінальні стани
            case COMPLETED, CANCELLED -> List.of();

            default -> {
                log.warn("Невідомий стан: {}", currentState);
                yield List.of();
            }
        };
    }

    /**
     * Повертає список подій, які можуть бути виконані з поточного стану.
     */
    public List<OrderEvent> getAvailableEvents(OrderState currentState) {
        List<OrderEvent> events = new ArrayList<>();

        // Базові події для всіх станів
        events.add(OrderEvent.AUTO_SAVE);
        events.add(OrderEvent.VALIDATE_STEP);

        // Специфічні події для станів
        switch (currentState) {
            case INITIAL -> events.add(OrderEvent.START_ORDER);

            case CLIENT_SELECTION -> {
                events.add(OrderEvent.CLIENT_SELECTED);
                events.add(OrderEvent.CANCEL_ORDER);
                events.add(OrderEvent.GO_FORWARD);
                events.add(OrderEvent.GO_BACK);
            }

            case ORDER_INITIALIZATION -> {
                events.add(OrderEvent.ORDER_INFO_COMPLETED);
                events.add(OrderEvent.GO_FORWARD);
                events.add(OrderEvent.GO_BACK);
                events.add(OrderEvent.CANCEL_ORDER);
            }

            case ITEM_MANAGEMENT -> {
                events.add(OrderEvent.START_ITEM_WIZARD);
                events.add(OrderEvent.ADD_ITEM);
                events.add(OrderEvent.ITEMS_COMPLETED);
                events.add(OrderEvent.GO_FORWARD);
                events.add(OrderEvent.GO_BACK);
            }

                        case ITEM_WIZARD_ACTIVE -> {
                events.add(OrderEvent.BASIC_INFO_COMPLETED);
                events.add(OrderEvent.GO_BACK);
            }

            case ITEM_BASIC_INFO -> {
                events.add(OrderEvent.CHARACTERISTICS_COMPLETED);
                events.add(OrderEvent.GO_BACK);
            }

            case ITEM_CHARACTERISTICS -> {
                events.add(OrderEvent.DEFECTS_COMPLETED);
                events.add(OrderEvent.GO_BACK);
            }

            case ITEM_DEFECTS_STAINS -> {
                events.add(OrderEvent.PRICING_COMPLETED);
                events.add(OrderEvent.GO_BACK);
            }

            case ITEM_PRICING -> {
                events.add(OrderEvent.PHOTOS_COMPLETED);
                events.add(OrderEvent.GO_BACK);
            }

            case ITEM_PHOTOS -> {
                events.add(OrderEvent.ITEM_ADDED);
                events.add(OrderEvent.GO_BACK);
            }

            case ITEM_COMPLETED -> {
                events.add(OrderEvent.GO_BACK);
            }

            case EXECUTION_PARAMS, GLOBAL_DISCOUNTS, PAYMENT_PROCESSING,
                 ADDITIONAL_INFO, ORDER_CONFIRMATION, ORDER_REVIEW, LEGAL_ASPECTS -> {
                events.add(OrderEvent.GO_FORWARD);
                events.add(OrderEvent.GO_BACK);
                events.add(OrderEvent.CANCEL_ORDER);
            }

            case RECEIPT_GENERATION -> {
                events.add(OrderEvent.RECEIPT_GENERATED);
                events.add(OrderEvent.GO_BACK);
            }

            case COMPLETED, CANCELLED -> {
                // Фінальні стани не приймають події
            }

            default -> {
                // Для невідомих станів додаємо базові події
                events.add(OrderEvent.GO_FORWARD);
                events.add(OrderEvent.GO_BACK);
            }
        }

        log.debug("Знайдено {} доступних подій для стану {}", events.size(), currentState);
        return events;
    }

    /**
     * Повертає наступний очікуваний стан для стандартного потоку.
     */
    public OrderState getNextExpectedState(OrderState currentState) {
        return switch (currentState) {
            case INITIAL -> OrderState.CLIENT_SELECTION;
            case CLIENT_SELECTION -> OrderState.ORDER_INITIALIZATION;
            case ORDER_INITIALIZATION -> OrderState.ITEM_MANAGEMENT;
            case ITEM_MANAGEMENT -> OrderState.ITEM_WIZARD_ACTIVE;
            case ITEM_WIZARD_ACTIVE -> OrderState.ITEM_BASIC_INFO;
            case ITEM_BASIC_INFO -> OrderState.ITEM_CHARACTERISTICS;
            case ITEM_CHARACTERISTICS -> OrderState.ITEM_DEFECTS_STAINS;
            case ITEM_DEFECTS_STAINS -> OrderState.ITEM_PRICING;
            case ITEM_PRICING -> OrderState.ITEM_PHOTOS;
            case ITEM_PHOTOS -> OrderState.ITEM_COMPLETED;
            case ITEM_COMPLETED -> OrderState.ITEM_MANAGEMENT; // Повернення до менеджера
            case EXECUTION_PARAMS -> OrderState.GLOBAL_DISCOUNTS;
            case GLOBAL_DISCOUNTS -> OrderState.PAYMENT_PROCESSING;
            case PAYMENT_PROCESSING -> OrderState.ADDITIONAL_INFO;
            case ADDITIONAL_INFO -> OrderState.ORDER_CONFIRMATION;
            case ORDER_CONFIRMATION -> OrderState.ORDER_REVIEW;
            case ORDER_REVIEW -> OrderState.LEGAL_ASPECTS;
            case LEGAL_ASPECTS -> OrderState.RECEIPT_GENERATION;
            case RECEIPT_GENERATION -> OrderState.COMPLETED;
            default -> null; // Для фінальних та невідомих станів
        };
    }

    /**
     * Повертає попередній стан для можливості повернення назад.
     */
    public OrderState getPreviousState(OrderState currentState) {
        return switch (currentState) {
            case CLIENT_SELECTION -> OrderState.INITIAL;
            case ORDER_INITIALIZATION -> OrderState.CLIENT_SELECTION;
            case ITEM_MANAGEMENT -> OrderState.ORDER_INITIALIZATION;
            case ITEM_WIZARD_ACTIVE -> OrderState.ITEM_MANAGEMENT;
            case ITEM_BASIC_INFO -> OrderState.ITEM_WIZARD_ACTIVE;
            case ITEM_CHARACTERISTICS -> OrderState.ITEM_BASIC_INFO;
            case ITEM_DEFECTS_STAINS -> OrderState.ITEM_CHARACTERISTICS;
            case ITEM_PRICING -> OrderState.ITEM_DEFECTS_STAINS;
            case ITEM_PHOTOS -> OrderState.ITEM_PRICING;
            case ITEM_COMPLETED -> OrderState.ITEM_PHOTOS;
            case EXECUTION_PARAMS -> OrderState.ITEM_MANAGEMENT;
            case GLOBAL_DISCOUNTS -> OrderState.EXECUTION_PARAMS;
            case PAYMENT_PROCESSING -> OrderState.GLOBAL_DISCOUNTS;
            case ADDITIONAL_INFO -> OrderState.PAYMENT_PROCESSING;
            case ORDER_CONFIRMATION -> OrderState.ADDITIONAL_INFO;
            case ORDER_REVIEW -> OrderState.ORDER_CONFIRMATION;
            case LEGAL_ASPECTS -> OrderState.ORDER_REVIEW;
            case RECEIPT_GENERATION -> OrderState.LEGAL_ASPECTS;
            default -> null; // Для початкових та фінальних станів
        };
    }

    /**
     * Перевіряє чи стан є фінальним.
     */
    public boolean isFinalState(OrderState state) {
        return state == OrderState.COMPLETED || state == OrderState.CANCELLED;
    }

    /**
     * Валідує чи можна надіслати подію в поточному стані.
     */
    public boolean canSendEvent(OrderState currentState, OrderEvent event) {
        List<OrderEvent> availableEvents = getAvailableEvents(currentState);
        boolean canSend = availableEvents.contains(event);

        log.debug("Перевірка можливості надсилання події {} для стану {}: {}",
                 event, currentState, canSend);

        return canSend;
    }
}
