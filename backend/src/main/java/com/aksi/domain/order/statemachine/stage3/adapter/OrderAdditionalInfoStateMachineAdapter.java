package com.aksi.domain.order.statemachine.stage3.adapter;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage3.dto.OrderAdditionalInfoDTO;
import com.aksi.domain.order.statemachine.stage3.service.OrderAdditionalInfoStepService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Адаптер для інтеграції OrderAdditionalInfoStepService з State Machine.
 *
 * Відокремлює логіку State Machine від основної бізнес-логіки підетапу 3.4,
 * дотримуючись принципу Single Responsibility.
 *
 * Підетап: 3.4 (Додаткова інформація замовлення)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderAdditionalInfoStateMachineAdapter {

    private final OrderAdditionalInfoStepService additionalInfoService;

        /**
     * Завантажує додаткову інформацію для підетапу 3.4.
     */
    public void loadAdditionalInfo(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Завантаження додаткової інформації");

        String wizardId = extractWizardId(context);
        OrderAdditionalInfoDTO additionalInfo = additionalInfoService.loadAdditionalInfoStep(wizardId);
        updateContext(context, additionalInfo, null);
    }

    /**
     * Зберігає додаткову інформацію.
     */
    public void saveAdditionalInfo(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Збереження додаткової інформації");

        String wizardId = extractWizardId(context);
        OrderAdditionalInfoDTO currentData = extractAdditionalInfo(context);

        if (currentData != null) {
            OrderAdditionalInfoDTO savedData = additionalInfoService.saveAdditionalInfoStep(wizardId, currentData);
            updateContext(context, savedData, null);
        }
    }

    /**
     * Оновлює примітки до замовлення.
     */
    public void updateOrderNotes(String notes, StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Оновлення приміток до замовлення");

        try {
            String wizardId = extractWizardId(context);
            OrderAdditionalInfoDTO updatedData = additionalInfoService.updateOrderNotes(wizardId, notes);
            updateContext(context, updatedData, null);

        } catch (Exception e) {
            log.error("Помилка оновлення приміток", e);
            updateContext(context, null, "Помилка оновлення приміток: " + e.getMessage());
        }
    }

    /**
     * Оновлює додаткові вимоги клієнта.
     */
    public void updateCustomerRequirements(String requirements, StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Оновлення додаткових вимог клієнта");

        try {
            String wizardId = extractWizardId(context);
            OrderAdditionalInfoDTO updatedData = additionalInfoService.updateCustomerRequirements(wizardId, requirements);
            updateContext(context, updatedData, null);

        } catch (Exception e) {
            log.error("Помилка оновлення вимог клієнта", e);
            updateContext(context, null, "Помилка оновлення вимог клієнта: " + e.getMessage());
        }
    }

    /**
     * Валідує готовність підетапу до завершення.
     */
    public boolean validateStepCompletion(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Валідація готовності підетапу додаткової інформації");

        String wizardId = extractWizardId(context);
        return additionalInfoService.canProceedToNextStep(wizardId);
    }

    /**
     * Очищує дані підетапу.
     */
    public void clearStepData(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Очищення даних підетапу додаткової інформації");

        context.getExtendedState().getVariables().remove("additionalInfo");
        context.getExtendedState().getVariables().remove("additionalInfoError");
    }

    // Приватні допоміжні методи

    private String extractWizardId(StateContext<OrderState, OrderEvent> context) {
        String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");
        if (wizardId == null) {
            throw new IllegalStateException("WizardId не знайдено в контексті State Machine");
        }
        return wizardId;
    }

    private OrderAdditionalInfoDTO extractAdditionalInfo(StateContext<OrderState, OrderEvent> context) {
        Object data = context.getExtendedState().getVariables().get("additionalInfo");
        return data instanceof OrderAdditionalInfoDTO ? (OrderAdditionalInfoDTO) data : null;
    }

    private void updateContext(StateContext<OrderState, OrderEvent> context,
                              OrderAdditionalInfoDTO additionalInfo,
                              String error) {
        if (additionalInfo != null) {
            context.getExtendedState().getVariables().put("additionalInfo", additionalInfo);
            context.getExtendedState().getVariables().remove("additionalInfoError");
        }

        if (error != null) {
            context.getExtendedState().getVariables().put("additionalInfoError", error);
        }
    }
}
