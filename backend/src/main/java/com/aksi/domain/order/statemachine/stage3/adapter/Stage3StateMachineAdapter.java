package com.aksi.domain.order.statemachine.stage3.adapter;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage3.service.Stage3CoordinationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Адаптер для інтеграції Stage 3 координатора з State Machine.
 *
 * Відокремлює логіку State Machine від основної бізнес-логіки координації,
 * дотримуючись принципу Single Responsibility.
 *
 * Етап: 3 (Загальні параметри замовлення)
 * Підетапи: 3.1 Параметри виконання, 3.2 Знижки, 3.3 Оплата, 3.4 Додаткова інформація
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class Stage3StateMachineAdapter {

    private final Stage3CoordinationService coordinationService;
    private final ExecutionParametersStateMachineAdapter executionParametersAdapter;
    private final OrderDiscountStateMachineAdapter orderDiscountAdapter;
    private final OrderPaymentStateMachineAdapter orderPaymentAdapter;
    private final OrderAdditionalInfoStateMachineAdapter orderAdditionalInfoAdapter;

    /**
     * Ініціалізує етап 3 з усіма підетапами.
     */
    public void initializeStage3(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Ініціалізація етапу 3 - Загальні параметри замовлення");

        UUID orderId = extractOrderId(context);
        coordinationService.initializeStage3(orderId, context);
    }

    /**
     * Завершує підетап параметрів виконання та переходить до знижок.
     */
    public void finishExecutionParametersAndStartDiscounts(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Перехід від параметрів виконання до знижок");

        UUID orderId = extractOrderId(context);
        coordinationService.finishExecutionParametersAndStartDiscounts(orderId, context);
    }

    /**
     * Завершує підетап знижок та переходить до оплати.
     */
    public void finishDiscountsAndStartPayment(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Перехід від знижок до оплати");

        UUID orderId = extractOrderId(context);
        coordinationService.finishDiscountsAndStartPayment(orderId, context);
    }

    /**
     * Завершує підетап оплати та переходить до додаткової інформації.
     */
    public void finishPaymentAndStartAdditionalInfo(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Перехід від оплати до додаткової інформації");

        UUID orderId = extractOrderId(context);
        coordinationService.finishPaymentAndStartAdditionalInfo(orderId, context);
    }

    /**
     * Фіналізує весь етап 3.
     */
    public void finalizeStage3(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Фіналізація етапу 3");

        UUID orderId = extractOrderId(context);
        coordinationService.finalizeStage3(orderId, context);
    }

    /**
     * Валідує чи етап 3 готовий до завершення.
     */
    public boolean validateStage3Completion(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Валідація готовності етапу 3");

        return coordinationService.isStage3Completed(context);
    }

    /**
     * Перевіряє чи завершено підетап параметрів виконання.
     */
    public boolean isExecutionParametersCompleted(StateContext<OrderState, OrderEvent> context) {
        return coordinationService.isExecutionParametersCompleted(context);
    }

    /**
     * Перевіряє чи завершено підетап знижок.
     */
    public boolean isDiscountsCompleted(StateContext<OrderState, OrderEvent> context) {
        return coordinationService.isDiscountsCompleted(context);
    }

    /**
     * Перевіряє чи завершено підетап оплати.
     */
    public boolean isPaymentCompleted(StateContext<OrderState, OrderEvent> context) {
        return coordinationService.isPaymentCompleted(context);
    }

    /**
     * Перевіряє чи завершено підетап додаткової інформації.
     */
    public boolean isAdditionalInfoCompleted(StateContext<OrderState, OrderEvent> context) {
        return coordinationService.isAdditionalInfoCompleted(context);
    }

    /**
     * Очищує дані етапу 3.
     */
    public void clearStage3Data(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Очищення даних етапу 3");

        UUID orderId = extractOrderId(context);
        coordinationService.resetStage3State(orderId, context);
    }

    /**
     * Отримує поточний підетап етапу 3.
     */
    public Stage3CoordinationService.Stage3CurrentStep getCurrentStep(StateContext<OrderState, OrderEvent> context) {
        return coordinationService.getCurrentStep(context);
    }

    /**
     * Отримує orderId з контексту State Machine.
     */
    private UUID extractOrderId(StateContext<OrderState, OrderEvent> context) {
        Object orderIdObj = context.getExtendedState().getVariables().get("orderId");
        if (orderIdObj instanceof UUID) {
            return (UUID) orderIdObj;
        } else if (orderIdObj instanceof String) {
            return UUID.fromString((String) orderIdObj);
        }
        throw new IllegalStateException("OrderId не знайдено в контексті State Machine");
    }
}
