package com.aksi.domain.order.statemachine.stage3.adapter;

import java.util.List;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage3.dto.OrderDiscountDTO;
import com.aksi.domain.order.statemachine.stage3.service.OrderDiscountStepService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Адаптер для інтеграції OrderDiscountStepService з State Machine.
 *
 * Відокремлює логіку State Machine від основної бізнес-логіки підетапу 3.2,
 * дотримуючись принципу Single Responsibility.
 *
 * Підетап: 3.2 (Знижки замовлення)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderDiscountStateMachineAdapter {

    private final OrderDiscountStepService discountService;

    /**
     * Завантажує дані знижок для підетапу 3.2.
     */
    public void loadDiscountData(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Завантаження даних знижок");

        String wizardId = extractWizardId(context);
        List<String> categories = extractOrderItemCategories(context);

        OrderDiscountDTO discountData = discountService.loadDiscountStep(wizardId, categories);
        updateContext(context, discountData, null);
    }

    /**
     * Зберігає дані знижок.
     */
    public void saveDiscountData(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Збереження даних знижок");

        String wizardId = extractWizardId(context);
        OrderDiscountDTO currentData = extractDiscountData(context);

        if (currentData != null) {
            OrderDiscountDTO savedData = discountService.saveDiscountStep(wizardId, currentData);
            updateContext(context, savedData, null);
        }
    }

        /**
     * Застосовує знижку до замовлення.
     */
    public void applyDiscount(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Застосування знижки");

        try {
            String wizardId = extractWizardId(context);
            OrderDiscountDTO currentData = extractDiscountData(context);

            if (currentData != null) {
                OrderDiscountDTO updatedData = discountService.applyDiscount(wizardId, currentData);
                updateContext(context, updatedData, null);
            }

        } catch (Exception e) {
            log.error("Помилка застосування знижки", e);
            updateContext(context, null, "Помилка застосування знижки: " + e.getMessage());
        }
    }

    /**
     * Валідує готовність підетапу до завершення.
     */
    public boolean validateStepCompletion(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Валідація готовності підетапу знижок");

        String wizardId = extractWizardId(context);
        return discountService.canProceedToNextStep(wizardId);
    }

    /**
     * Очищує дані підетапу.
     */
    public void clearStepData(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Очищення даних підетапу знижок");

        context.getExtendedState().getVariables().remove("discountData");
        context.getExtendedState().getVariables().remove("discountError");
    }

    // Приватні допоміжні методи

    private String extractWizardId(StateContext<OrderState, OrderEvent> context) {
        String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");
        if (wizardId == null) {
            throw new IllegalStateException("WizardId не знайдено в контексті State Machine");
        }
        return wizardId;
    }

    private OrderDiscountDTO extractDiscountData(StateContext<OrderState, OrderEvent> context) {
        Object data = context.getExtendedState().getVariables().get("discountData");
        return data instanceof OrderDiscountDTO ? (OrderDiscountDTO) data : null;
    }

    @SuppressWarnings("unchecked")
    private List<String> extractOrderItemCategories(StateContext<OrderState, OrderEvent> context) {
        Object categories = context.getExtendedState().getVariables().get("orderItemCategories");
        return categories instanceof List ? (List<String>) categories : java.util.Collections.emptyList();
    }

    private void updateContext(StateContext<OrderState, OrderEvent> context,
                              OrderDiscountDTO discountData,
                              String error) {
        if (discountData != null) {
            context.getExtendedState().getVariables().put("discountData", discountData);
            context.getExtendedState().getVariables().remove("discountError");
        }

        if (error != null) {
            context.getExtendedState().getVariables().put("discountError", error);
        }
    }
}
