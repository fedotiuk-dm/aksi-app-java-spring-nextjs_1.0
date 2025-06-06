package com.aksi.domain.order.statemachine.stage4.adapter;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage4.dto.WizardCompletionDTO;
import com.aksi.domain.order.statemachine.stage4.service.WizardCompletionStepService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Адаптер для підетапу 4.4 "Завершення процесу".
 *
 * Підетап: 4.4 (Завершення процесу)
 * Основна функціональність через базові методи сервісу.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class WizardCompletionStateMachineAdapter {

    private final WizardCompletionStepService wizardCompletionStepService;

    /**
     * Завантажує дані завершення процесу.
     */
    public WizardCompletionDTO loadWizardCompletion(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Завантаження даних завершення процесу");

        String wizardId = extractWizardId(context);
        return wizardCompletionStepService.loadWizardCompletion(wizardId);
    }

    /**
     * Зберігає дані завершення процесу.
     */
    public WizardCompletionDTO saveWizardCompletion(String wizardId, WizardCompletionDTO wizardCompletion) {
        log.debug("State Machine: Збереження даних завершення процесу");

        return wizardCompletionStepService.saveWizardCompletion(wizardId, wizardCompletion);
    }

    /**
     * Валідує завершення всього процесу.
     */
    public boolean validateWizardCompletion(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Валідація завершення процесу");

        String wizardId = extractWizardId(context);
        WizardCompletionDTO completion = wizardCompletionStepService.loadWizardCompletion(wizardId);
        return completion != null;
    }

    /**
     * Отримує wizardId з контексту State Machine.
     */
    private String extractWizardId(StateContext<OrderState, OrderEvent> context) {
        Object wizardIdObj = context.getExtendedState().getVariables().get("wizardId");
        if (wizardIdObj instanceof String) {
            return (String) wizardIdObj;
        }
        throw new IllegalStateException("WizardId не знайдено в контексті State Machine");
    }
}
