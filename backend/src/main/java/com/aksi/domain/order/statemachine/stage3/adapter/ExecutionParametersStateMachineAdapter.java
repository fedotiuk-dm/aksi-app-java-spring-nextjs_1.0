package com.aksi.domain.order.statemachine.stage3.adapter;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage3.dto.ExecutionParametersDTO;
import com.aksi.domain.order.statemachine.stage3.service.ExecutionParametersStepService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Адаптер для інтеграції ExecutionParametersStepService з State Machine.
 *
 * Відокремлює логіку State Machine від основної бізнес-логіки підетапу 3.1,
 * дотримуючись принципу Single Responsibility.
 *
 * Підетап: 3.1 (Параметри виконання)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ExecutionParametersStateMachineAdapter {

    private final ExecutionParametersStepService executionParametersService;

    /**
     * Завантажує параметри виконання для підетапу 3.1.
     */
    public void loadExecutionParameters(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Завантаження параметрів виконання");

        String wizardId = extractWizardId(context);
        ExecutionParametersDTO params = executionParametersService.loadExecutionParameters(wizardId);

        updateContext(context, params, null);
    }

    /**
     * Зберігає параметри виконання.
     */
    public void saveExecutionParameters(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Збереження параметрів виконання");

        String wizardId = extractWizardId(context);
        ExecutionParametersDTO currentParams = extractExecutionParameters(context);

        if (currentParams != null) {
            ExecutionParametersDTO savedParams = executionParametersService.saveExecutionParameters(wizardId, currentParams);
            updateContext(context, savedParams, null);
        }
    }

    /**
     * Оновлює тип терміновості.
     */
    public void updateExpediteType(ExpediteType expediteType, StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Оновлення типу терміновості на: {}", expediteType);

        try {
            String wizardId = extractWizardId(context);
            ExecutionParametersDTO updatedParams = executionParametersService.updateExpediteType(wizardId, expediteType);

            updateContext(context, updatedParams, null);

        } catch (Exception e) {
            log.error("Помилка оновлення типу терміновості", e);
            updateContext(context, null, "Помилка оновлення терміновості: " + e.getMessage());
        }
    }

    /**
     * Валідує готовність підетапу до завершення.
     */
    public boolean validateStepCompletion(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Валідація готовності підетапу параметрів виконання");

        String wizardId = extractWizardId(context);
        return executionParametersService.canProceedToNextStep(wizardId);
    }

    /**
     * Очищує дані підетапу.
     */
    public void clearStepData(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Очищення даних підетапу параметрів виконання");

        context.getExtendedState().getVariables().remove("executionParameters");
        context.getExtendedState().getVariables().remove("executionParametersError");
    }

    // Приватні допоміжні методи

    private String extractWizardId(StateContext<OrderState, OrderEvent> context) {
        String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");
        if (wizardId == null) {
            throw new IllegalStateException("WizardId не знайдено в контексті State Machine");
        }
        return wizardId;
    }

    private ExecutionParametersDTO extractExecutionParameters(StateContext<OrderState, OrderEvent> context) {
        Object params = context.getExtendedState().getVariables().get("executionParameters");
        return params instanceof ExecutionParametersDTO ? (ExecutionParametersDTO) params : null;
    }

    private void updateContext(StateContext<OrderState, OrderEvent> context,
                              ExecutionParametersDTO executionParams,
                              String error) {
        if (executionParams != null) {
            context.getExtendedState().getVariables().put("executionParameters", executionParams);
            context.getExtendedState().getVariables().remove("executionParametersError");
        }

        if (error != null) {
            context.getExtendedState().getVariables().put("executionParametersError", error);
        }
    }
}
