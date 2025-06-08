package com.aksi.domain.order.statemachine.config;

import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage3.actions.OrderParametersActions;
import com.aksi.domain.order.statemachine.stage4.actions.OrderCompletionActions;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Конфігуратор переходів для Етапу 3: Параметри замовлення.
 *
 * Відповідає за:
 * - Параметри виконання (дати, терміновість)
 * - Глобальні знижки
 * - Обробку оплати
 * - Додаткову інформацію
 * - Перехід до етапу 4
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class Stage3TransitionConfigurer implements StageTransitionConfigurer {

    // Stage 3 Actions
    private final OrderParametersActions.SaveExecutionParametersAction saveExecutionParametersAction;
    private final OrderParametersActions.ApplyDiscountAction applyDiscountAction;
    private final OrderParametersActions.SetupPaymentAction setupPaymentAction;
    private final OrderParametersActions.SaveAdditionalInfoAction saveAdditionalInfoAction;

    // Stage 4 initialization
    private final OrderCompletionActions.EnterOrderCompletionStageAction enterOrderCompletionStageAction;

    @Override
    public void configureTransitions(StateMachineTransitionConfigurer<OrderState, OrderEvent> transitions)
            throws Exception {

        log.info("Конфігурація переходів для {}", getStageName());

        transitions
            // === ЕТАП 3: Параметри замовлення ===

            // 3.1 -> 3.2: Параметри виконання -> Знижки
            .withExternal()
                .source(OrderState.EXECUTION_PARAMS)
                .target(OrderState.GLOBAL_DISCOUNTS)
                .event(OrderEvent.EXECUTION_PARAMS_SET)
                .action(saveExecutionParametersAction)

            // 3.2 -> 3.3: Знижки -> Оплата
            .and()
            .withExternal()
                .source(OrderState.GLOBAL_DISCOUNTS)
                .target(OrderState.PAYMENT_PROCESSING)
                .event(OrderEvent.DISCOUNTS_APPLIED)
                .action(applyDiscountAction)

            // 3.3 -> 3.4: Оплата -> Додаткова інформація
            .and()
            .withExternal()
                .source(OrderState.PAYMENT_PROCESSING)
                .target(OrderState.ADDITIONAL_INFO)
                .event(OrderEvent.PAYMENT_PROCESSED)
                .action(setupPaymentAction)

            // 3.4 -> 4: Додаткова інформація -> Підтвердження замовлення
            .and()
            .withExternal()
                .source(OrderState.ADDITIONAL_INFO)
                .target(OrderState.ORDER_CONFIRMATION)
                .event(OrderEvent.ADDITIONAL_INFO_COMPLETED)
                .action(saveAdditionalInfoAction)

            // === Навігація назад в етапі 3 ===

            // 3.2 -> 3.1
            .and()
            .withExternal()
                .source(OrderState.GLOBAL_DISCOUNTS)
                .target(OrderState.EXECUTION_PARAMS)
                .event(OrderEvent.GO_BACK)

            // 3.3 -> 3.2
            .and()
            .withExternal()
                .source(OrderState.PAYMENT_PROCESSING)
                .target(OrderState.GLOBAL_DISCOUNTS)
                .event(OrderEvent.GO_BACK)

            // 3.4 -> 3.3
            .and()
            .withExternal()
                .source(OrderState.ADDITIONAL_INFO)
                .target(OrderState.PAYMENT_PROCESSING)
                .event(OrderEvent.GO_BACK)

            // === Перехід до етапу 4 ===

            // Початок етапу 4
            .and()
            .withExternal()
                .source(OrderState.ORDER_CONFIRMATION)
                .target(OrderState.ORDER_REVIEW)
                .event(OrderEvent.REVIEW_ORDER)
                .action(enterOrderCompletionStageAction)

            // Повернення з етапу 4 до етапу 3
            .and()
            .withExternal()
                .source(OrderState.ORDER_CONFIRMATION)
                .target(OrderState.ADDITIONAL_INFO)
                .event(OrderEvent.GO_BACK)

            // === Скасування на етапі 3 ===

            .and()
            .withExternal()
                .source(OrderState.EXECUTION_PARAMS)
                .target(OrderState.CANCELLED)
                .event(OrderEvent.CANCEL_ORDER)

            .and()
            .withExternal()
                .source(OrderState.GLOBAL_DISCOUNTS)
                .target(OrderState.CANCELLED)
                .event(OrderEvent.CANCEL_ORDER)

            .and()
            .withExternal()
                .source(OrderState.PAYMENT_PROCESSING)
                .target(OrderState.CANCELLED)
                .event(OrderEvent.CANCEL_ORDER)

            .and()
            .withExternal()
                .source(OrderState.ADDITIONAL_INFO)
                .target(OrderState.CANCELLED)
                .event(OrderEvent.CANCEL_ORDER);

        log.debug("Конфігурація переходів для {} завершена", getStageName());
    }

    @Override
    public int getStageNumber() {
        return 3;
    }

    @Override
    public String getStageName() {
        return "Етап 3: Параметри замовлення";
    }
}
