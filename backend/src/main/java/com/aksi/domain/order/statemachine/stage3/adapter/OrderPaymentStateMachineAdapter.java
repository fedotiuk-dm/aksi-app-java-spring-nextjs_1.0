package com.aksi.domain.order.statemachine.stage3.adapter;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.model.PaymentMethod;
import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage3.dto.OrderPaymentDTO;
import com.aksi.domain.order.statemachine.stage3.service.OrderPaymentStepService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Адаптер для інтеграції OrderPaymentStepService з State Machine.
 *
 * Відокремлює логіку State Machine від основної бізнес-логіки підетапу 3.3,
 * дотримуючись принципу Single Responsibility.
 *
 * Підетап: 3.3 (Оплата замовлення)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderPaymentStateMachineAdapter {

    private final OrderPaymentStepService paymentService;

    /**
     * Завантажує дані оплати для підетапу 3.3.
     */
    public void loadPaymentData(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Завантаження даних оплати");

        UUID orderId = extractOrderId(context);
        OrderPaymentDTO paymentData = paymentService.loadPaymentStep(orderId);
        updateContext(context, paymentData, null);
    }

    /**
     * Обчислює дані оплати.
     */
    public void calculatePayment(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Обчислення даних оплати");

        OrderPaymentDTO currentData = extractPaymentData(context);

        if (currentData != null) {
            OrderPaymentDTO calculatedData = paymentService.calculatePayment(currentData);
            updateContext(context, calculatedData, null);
        }
    }

    /**
     * Встановлює спосіб оплати.
     */
    public void setPaymentMethod(PaymentMethod paymentMethod, StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Встановлення способу оплати: {}", paymentMethod);

        try {
            UUID orderId = extractOrderId(context);
            OrderPaymentDTO updatedData = paymentService.updatePaymentMethod(orderId, paymentMethod);
            updateContext(context, updatedData, null);

        } catch (Exception e) {
            log.error("Помилка встановлення способу оплати", e);
            updateContext(context, null, "Помилка встановлення способу оплати: " + e.getMessage());
        }
    }

    /**
     * Встановлює суму передоплати.
     */
    public void setPrepaymentAmount(BigDecimal prepaymentAmount, StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Встановлення суми передоплати: {}", prepaymentAmount);

        try {
            UUID orderId = extractOrderId(context);
            OrderPaymentDTO updatedData = paymentService.updatePrepaymentAmount(orderId, prepaymentAmount);
            updateContext(context, updatedData, null);

        } catch (Exception e) {
            log.error("Помилка встановлення суми передоплати", e);
            updateContext(context, null, "Помилка встановлення суми передоплати: " + e.getMessage());
        }
    }

    /**
     * Валідує готовність підетапу до завершення.
     */
    public boolean validateStepCompletion(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Валідація готовності підетапу оплати");

        OrderPaymentDTO paymentData = extractPaymentData(context);
        return paymentService.canProceedToNextStep(paymentData);
    }

    /**
     * Очищує дані підетапу.
     */
    public void clearStepData(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Очищення даних підетапу оплати");

        context.getExtendedState().getVariables().remove("paymentData");
        context.getExtendedState().getVariables().remove("paymentError");
    }

    // Приватні допоміжні методи

    private UUID extractOrderId(StateContext<OrderState, OrderEvent> context) {
        Object orderIdObj = context.getExtendedState().getVariables().get("orderId");
        if (orderIdObj instanceof UUID) {
            return (UUID) orderIdObj;
        } else if (orderIdObj instanceof String) {
            return UUID.fromString((String) orderIdObj);
        }
        throw new IllegalStateException("OrderId не знайдено в контексті State Machine");
    }

    private OrderPaymentDTO extractPaymentData(StateContext<OrderState, OrderEvent> context) {
        Object data = context.getExtendedState().getVariables().get("paymentData");
        return data instanceof OrderPaymentDTO ? (OrderPaymentDTO) data : null;
    }

    private BigDecimal extractTotalAmount(StateContext<OrderState, OrderEvent> context) {
        Object amount = context.getExtendedState().getVariables().get("totalAmount");
        if (amount instanceof BigDecimal) {
            return (BigDecimal) amount;
        } else if (amount instanceof Number) {
            return BigDecimal.valueOf(((Number) amount).doubleValue());
        }
        return BigDecimal.ZERO;
    }

    private void updateContext(StateContext<OrderState, OrderEvent> context,
                              OrderPaymentDTO paymentData,
                              String error) {
        if (paymentData != null) {
            context.getExtendedState().getVariables().put("paymentData", paymentData);
            context.getExtendedState().getVariables().remove("paymentError");
        }

        if (error != null) {
            context.getExtendedState().getVariables().put("paymentError", error);
        }
    }
}
