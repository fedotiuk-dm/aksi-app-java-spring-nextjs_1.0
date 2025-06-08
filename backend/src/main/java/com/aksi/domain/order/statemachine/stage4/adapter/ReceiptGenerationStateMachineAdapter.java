package com.aksi.domain.order.statemachine.stage4.adapter;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage4.dto.ReceiptGenerationDTO;
import com.aksi.domain.order.statemachine.stage4.service.ReceiptGenerationStepService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Адаптер для підетапу 4.3 "Формування та друк квитанції".
 *
 * Підетап: 4.3 (Формування та друк квитанції)
 * Основна функціональність через базові методи сервісу.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ReceiptGenerationStateMachineAdapter {

    private final ReceiptGenerationStepService receiptGenerationStepService;

    /**
     * Завантажує дані формування квитанції.
     */
    public ReceiptGenerationDTO loadReceiptGeneration(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Завантаження даних формування квитанції");

        String wizardId = extractWizardId(context);
        return receiptGenerationStepService.loadReceiptGeneration(wizardId);
    }

    /**
     * Зберігає дані формування квитанції.
     */
    public ReceiptGenerationDTO saveReceiptGeneration(String wizardId, ReceiptGenerationDTO receiptGeneration) {
        log.debug("State Machine: Збереження даних формування квитанції");

        return receiptGenerationStepService.saveReceiptGeneration(wizardId, receiptGeneration);
    }

    /**
     * Перевіряє чи можна перейти до наступного підетапу.
     */
    public boolean canProceedToWizardCompletion(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Перевірка готовності до переходу до завершення процесу");

        String wizardId = extractWizardId(context);
        ReceiptGenerationDTO receipt = receiptGenerationStepService.loadReceiptGeneration(wizardId);
        return receipt != null;
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
