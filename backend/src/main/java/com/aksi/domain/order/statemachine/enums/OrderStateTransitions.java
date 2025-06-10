package com.aksi.domain.order.statemachine.enums;

import java.util.Collections;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;

/**
 * Enum що визначає доступні переходи для кожного стану Order Wizard.
 * Використовує кращі практики замість switch statement.
 */
public enum OrderStateTransitions {

    // Статична карта переходів для кращої продуктивності
    ;

    private static final Map<OrderState, List<OrderEvent>> STATE_TRANSITIONS;

    static {
        Map<OrderState, List<OrderEvent>> transitions = new EnumMap<>(OrderState.class);

        // Stage 1 - Клієнт та базова інформація
        transitions.put(OrderState.CLIENT_SELECTION, List.of(
            OrderEvent.CLIENT_SELECTED,
            OrderEvent.CANCEL_ORDER
        ));
        transitions.put(OrderState.ORDER_INITIALIZATION, List.of(
            OrderEvent.ORDER_INFO_COMPLETED,
            OrderEvent.GO_BACK,
            OrderEvent.CANCEL_ORDER
        ));

        // Stage 2 - Менеджер предметів
        transitions.put(OrderState.ITEM_MANAGEMENT, List.of(
            OrderEvent.START_ITEM_WIZARD,
            OrderEvent.ADD_ITEM,
            OrderEvent.EDIT_ITEM,
            OrderEvent.DELETE_ITEM,
            OrderEvent.ITEMS_COMPLETED,
            OrderEvent.GO_BACK,
            OrderEvent.CANCEL_ORDER
        ));
        transitions.put(OrderState.ITEM_WIZARD_ACTIVE, List.of(
            OrderEvent.ITEM_ADDED,
            OrderEvent.CANCEL_ITEM_WIZARD,
            OrderEvent.CANCEL_ORDER
        ));

        // Stage 3 - Загальні параметри замовлення
        transitions.put(OrderState.EXECUTION_PARAMS, List.of(
            OrderEvent.EXECUTION_PARAMS_SET,
            OrderEvent.GO_BACK,
            OrderEvent.CANCEL_ORDER
        ));
        transitions.put(OrderState.GLOBAL_DISCOUNTS, List.of(
            OrderEvent.DISCOUNTS_APPLIED,
            OrderEvent.GO_BACK,
            OrderEvent.CANCEL_ORDER
        ));
        transitions.put(OrderState.PAYMENT_PROCESSING, List.of(
            OrderEvent.PAYMENT_PROCESSED,
            OrderEvent.GO_BACK,
            OrderEvent.CANCEL_ORDER
        ));
        transitions.put(OrderState.ADDITIONAL_INFO, List.of(
            OrderEvent.ADDITIONAL_INFO_COMPLETED,
            OrderEvent.GO_BACK,
            OrderEvent.CANCEL_ORDER
        ));

        // Stage 4 - Підтвердження та завершення
        transitions.put(OrderState.ORDER_CONFIRMATION, List.of(
            OrderEvent.REVIEW_ORDER,
            OrderEvent.GO_BACK,
            OrderEvent.CANCEL_ORDER
        ));
        transitions.put(OrderState.ORDER_REVIEW, List.of(
            OrderEvent.ORDER_APPROVED,
            OrderEvent.GO_BACK,
            OrderEvent.CANCEL_ORDER
        ));
        transitions.put(OrderState.LEGAL_ASPECTS, List.of(
            OrderEvent.TERMS_ACCEPTED,
            OrderEvent.GO_BACK,
            OrderEvent.CANCEL_ORDER
        ));
        transitions.put(OrderState.RECEIPT_GENERATION, List.of(
            OrderEvent.RECEIPT_GENERATED,
            OrderEvent.GO_BACK,
            OrderEvent.CANCEL_ORDER
        ));

        // Фінальні стани
        transitions.put(OrderState.COMPLETED, List.of(
            OrderEvent.START_ORDER
        ));
        transitions.put(OrderState.CANCELLED, List.of(
            OrderEvent.START_ORDER
        ));

        // Початковий стан
        transitions.put(OrderState.INITIAL, List.of(
            OrderEvent.START_ORDER
        ));

        STATE_TRANSITIONS = Collections.unmodifiableMap(transitions);
    }

    /**
     * Отримує доступні події для конкретного стану.
     *
     * @param state поточний стан
     * @return список доступних подій
     */
    public static List<OrderEvent> getAvailableEvents(OrderState state) {
        if (state == null) {
            return Collections.emptyList();
        }
        return STATE_TRANSITIONS.getOrDefault(state, Collections.emptyList());
    }

    /**
     * Отримує доступні події як масив рядків для API.
     *
     * @param state поточний стан
     * @return масив назв подій
     */
    public static String[] getAvailableEventsAsStringArray(OrderState state) {
        return getAvailableEvents(state)
            .stream()
            .map(Enum::name)
            .toArray(String[]::new);
    }

    /**
     * Перевіряє чи можна здійснити перехід з поточного стану за певною подією.
     *
     * @param currentState поточний стан
     * @param event подія для перевірки
     * @return true якщо перехід дозволений
     */
    public static boolean isTransitionAllowed(OrderState currentState, OrderEvent event) {
        if (currentState == null || event == null) {
            return false;
        }
        return getAvailableEvents(currentState).contains(event);
    }

    /**
     * Отримує всі стани які можуть переходити до іншого стану за певною подією.
     *
     * @param event подія
     * @return список станів
     */
    public static List<OrderState> getStatesAllowingEvent(OrderEvent event) {
        if (event == null) {
            return Collections.emptyList();
        }
        return STATE_TRANSITIONS.entrySet()
            .stream()
            .filter(entry -> entry.getValue().contains(event))
            .map(Map.Entry::getKey)
            .toList();
    }

    /**
     * Отримує кількість доступних переходів для стану.
     *
     * @param state стан для перевірки
     * @return кількість доступних переходів
     */
    public static int getTransitionCount(OrderState state) {
        return getAvailableEvents(state).size();
    }
}
