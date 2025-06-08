package com.aksi.domain.order.statemachine.config;

import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.actions.InitializeOrderAction;
import com.aksi.domain.order.statemachine.stage1.actions.SaveClientDataAction;
import com.aksi.domain.order.statemachine.stage1.actions.SaveOrderBasicInfoAction;
import com.aksi.domain.order.statemachine.stage1.guards.ClientValidGuard;
import com.aksi.domain.order.statemachine.stage1.guards.OrderBasicInfoValidGuard;
import com.aksi.domain.order.statemachine.stage2.actions.InitializeStage2Action;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Конфігуратор переходів для Етапу 1: Клієнт та базова інформація замовлення.
 *
 * Відповідає за:
 * - Ініціалізацію Order Wizard
 * - Вибір/створення клієнта
 * - Збереження базової інформації замовлення
 * - Перехід до етапу 2
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class Stage1TransitionConfigurer implements StageTransitionConfigurer {

    // Stage 1 Actions
    private final InitializeOrderAction initializeOrderAction;
    private final SaveClientDataAction saveClientDataAction;
    private final SaveOrderBasicInfoAction saveOrderBasicInfoAction;

    // Stage 1 Guards
    private final ClientValidGuard clientValidGuard;
    private final OrderBasicInfoValidGuard orderBasicInfoValidGuard;

    // Stage 2 initialization
    private final InitializeStage2Action initializeStage2Action;

    @Override
    public void configureTransitions(StateMachineTransitionConfigurer<OrderState, OrderEvent> transitions)
            throws Exception {

        log.info("Конфігурація переходів для {}", getStageName());

        transitions
            // === Ініціалізація ===
            .withExternal()
                .source(OrderState.INITIAL)
                .target(OrderState.CLIENT_SELECTION)
                .event(OrderEvent.START_ORDER)
                .action(initializeOrderAction)

            // === ЕТАП 1.1: Робота з клієнтом ===
            .and()
            .withExternal()
                .source(OrderState.CLIENT_SELECTION)
                .target(OrderState.ORDER_INITIALIZATION)
                .event(OrderEvent.CLIENT_SELECTED)
                .action(saveClientDataAction)
                .guard(clientValidGuard)

            // === ЕТАП 1.2 -> ЕТАП 2: Базова інформація замовлення ===
            .and()
            .withExternal()
                .source(OrderState.ORDER_INITIALIZATION)
                .target(OrderState.ITEM_MANAGEMENT)
                .event(OrderEvent.ORDER_INFO_COMPLETED)
                .action(saveOrderBasicInfoAction)
                .action(initializeStage2Action)
                .guard(orderBasicInfoValidGuard)

            // === Скасування на етапі 1 ===
            .and()
            .withExternal()
                .source(OrderState.CLIENT_SELECTION)
                .target(OrderState.CANCELLED)
                .event(OrderEvent.CANCEL_ORDER)

            .and()
            .withExternal()
                .source(OrderState.ORDER_INITIALIZATION)
                .target(OrderState.CANCELLED)
                .event(OrderEvent.CANCEL_ORDER);

        log.debug("Конфігурація переходів для {} завершена", getStageName());
    }

    @Override
    public int getStageNumber() {
        return 1;
    }

    @Override
    public String getStageName() {
        return "Етап 1: Клієнт та базова інформація";
    }
}
