package com.aksi.domain.order.statemachine.stage1.actions;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.service.Stage1CoordinationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Action для завершення всього етапу 1.
 *
 * Виконується при події FINISH_STAGE1.
 * Використовує Stage1CoordinationService для фіналізації етапу.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class FinalizeStage1Action implements Action<OrderState, OrderEvent> {

    private final Stage1CoordinationService coordinationService;

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");
        log.info("Завершення етапу 1 для wizard: {}", wizardId);

        try {
            // Фіналізуємо весь етап 1 через координаційний сервіс
            coordinationService.finalizeStage1(wizardId, context);

            // Оновлюємо статус етапу
            context.getExtendedState().getVariables().put("currentStage", 2);
            context.getExtendedState().getVariables().put("currentStep", 1);
            context.getExtendedState().getVariables().put("stage1Completed", true);

            log.info("Етап 1 успішно завершено для wizard: {}, переходимо до етапу 2", wizardId);

        } catch (Exception e) {
            log.error("Помилка при завершенні етапу 1 для wizard {}: {}", wizardId, e.getMessage(), e);
            context.getExtendedState().getVariables().put("lastError",
                "Помилка завершення етапу 1: " + e.getMessage());
            throw e;
        }
    }
}
