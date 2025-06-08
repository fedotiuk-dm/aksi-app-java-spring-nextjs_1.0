package com.aksi.domain.order.statemachine.config;

import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage4.actions.OrderCompletionActions;
import com.aksi.domain.order.statemachine.stage4.guards.CanCompleteWizardGuard;
import com.aksi.domain.order.statemachine.stage4.guards.CanGenerateReceiptGuard;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Конфігуратор переходів для Етапу 4: Підтвердження та завершення.
 *
 * Відповідає за:
 * - Перегляд замовлення
 * - Юридичні аспекти
 * - Генерацію квитанції
 * - Завершення wizard
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class Stage4TransitionConfigurer implements StageTransitionConfigurer {

    // Stage 4 Actions
    private final OrderCompletionActions.EnterOrderCompletionStageAction enterOrderCompletionStageAction;
    private final OrderCompletionActions.SaveOrderSummaryAction saveOrderSummaryAction;
    private final OrderCompletionActions.SaveTermsAgreementAction saveTermsAgreementAction;
    private final OrderCompletionActions.PrintReceiptAction printReceiptAction;

    // Stage 4 Guards
    private final CanCompleteWizardGuard canCompleteWizardGuard;
    private final CanGenerateReceiptGuard canGenerateReceiptGuard;

    @Override
    public void configureTransitions(StateMachineTransitionConfigurer<OrderState, OrderEvent> transitions)
            throws Exception {

        log.info("Конфігурація переходів для {}", getStageName());

        transitions
            // === ЕТАП 4: Підтвердження та завершення ===

            // 4.0 -> 4.1: Вхід в етап -> Перегляд замовлення
            .withExternal()
                .source(OrderState.ORDER_CONFIRMATION)
                .target(OrderState.ORDER_REVIEW)
                .event(OrderEvent.REVIEW_ORDER)
                .action(enterOrderCompletionStageAction)

            // 4.1 -> 4.2: Перегляд замовлення -> Юридичні аспекти
            .and()
            .withExternal()
                .source(OrderState.ORDER_REVIEW)
                .target(OrderState.LEGAL_ASPECTS)
                .event(OrderEvent.ORDER_APPROVED)
                .action(saveOrderSummaryAction)

            // 4.2 -> 4.3: Юридичні аспекти -> Генерація квитанції
            .and()
            .withExternal()
                .source(OrderState.LEGAL_ASPECTS)
                .target(OrderState.RECEIPT_GENERATION)
                .event(OrderEvent.TERMS_ACCEPTED)
                .action(saveTermsAgreementAction)
                .guard(canCompleteWizardGuard)

            // 4.3 -> COMPLETED: Генерація квитанції -> Завершення
            .and()
            .withExternal()
                .source(OrderState.RECEIPT_GENERATION)
                .target(OrderState.COMPLETED)
                .event(OrderEvent.RECEIPT_GENERATED)
                .action(printReceiptAction)
                .guard(canGenerateReceiptGuard)

            // === Навігація назад в етапі 4 ===

            // 4.2 -> 4.1
            .and()
            .withExternal()
                .source(OrderState.LEGAL_ASPECTS)
                .target(OrderState.ORDER_REVIEW)
                .event(OrderEvent.GO_BACK)

            // 4.3 -> 4.2
            .and()
            .withExternal()
                .source(OrderState.RECEIPT_GENERATION)
                .target(OrderState.LEGAL_ASPECTS)
                .event(OrderEvent.GO_BACK)

            // === Скасування на етапі 4 ===

            .and()
            .withExternal()
                .source(OrderState.ORDER_REVIEW)
                .target(OrderState.CANCELLED)
                .event(OrderEvent.CANCEL_ORDER)

            .and()
            .withExternal()
                .source(OrderState.LEGAL_ASPECTS)
                .target(OrderState.CANCELLED)
                .event(OrderEvent.CANCEL_ORDER)

            .and()
            .withExternal()
                .source(OrderState.RECEIPT_GENERATION)
                .target(OrderState.CANCELLED)
                .event(OrderEvent.CANCEL_ORDER);

        log.debug("Конфігурація переходів для {} завершена", getStageName());
    }

    @Override
    public int getStageNumber() {
        return 4;
    }

    @Override
    public String getStageName() {
        return "Етап 4: Підтвердження та завершення";
    }
}
