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
 * Action для завершення підетапу 1.1 та переходу до підетапу 1.2.
 *
 * Виконується при події FINISH_CLIENT_SELECTION.
 * Використовує Stage1CoordinationService для координації переходу.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class FinishClientSelectionAction implements Action<OrderState, OrderEvent> {

    private final Stage1CoordinationService coordinationService;

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");
        log.info("Завершення підетапу 1.1 та перехід до підетапу 1.2 для wizard: {}", wizardId);

        try {
            // Завершуємо підетап 1.1 і запускаємо підетап 1.2 через координаційний сервіс
            coordinationService.finishClientSelectionAndStartOrderInfo(wizardId, context);

            // Оновлюємо поточний крок
            context.getExtendedState().getVariables().put("currentStep", 2);

            log.info("Успішно завершено підетап 1.1 та запущено підетап 1.2 для wizard: {}", wizardId);

        } catch (Exception e) {
            log.error("Помилка при переході між підетапами для wizard {}: {}", wizardId, e.getMessage(), e);
            context.getExtendedState().getVariables().put("lastError",
                "Помилка переходу між підетапами: " + e.getMessage());
            throw e;
        }
    }
}
