package com.aksi.domain.order.statemachine.stage1.actions;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.dto.BasicOrderInfoDTO;
import com.aksi.domain.order.statemachine.stage1.enums.BasicOrderInfoEvent;
import com.aksi.domain.order.statemachine.stage1.enums.BasicOrderInfoState;
import com.aksi.domain.order.statemachine.stage1.service.BasicOrderInfoCoordinationService;

/**
 * Action для завершення базової інформації замовлення.
 * Виконує фінальну валідацію та завершує процес.
 */
@Component
public class BasicOrderInfoCompleteAction implements Action<BasicOrderInfoState, BasicOrderInfoEvent> {

    private final BasicOrderInfoCoordinationService coordinationService;

    public BasicOrderInfoCompleteAction(BasicOrderInfoCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<BasicOrderInfoState, BasicOrderInfoEvent> context) {
        try {
            String sessionId = context.getExtendedState().get("sessionId", String.class);

            if (sessionId == null) {
                context.getExtendedState().getVariables().put("error", "Сесія не знайдена");
                return;
            }

            // Отримуємо поточні дані
            BasicOrderInfoDTO currentData = coordinationService.getCurrentData(sessionId);

            if (currentData == null) {
                context.getExtendedState().getVariables().put("error", "Дані базової інформації не знайдені");
                return;
            }

            // Перевіряємо готовність до завершення
            if (!coordinationService.isReadyForCompletion(sessionId)) {
                context.getExtendedState().getVariables().put("error", "Базова інформація не готова для завершення");
                return;
            }

            // Завершуємо workflow
            boolean success = coordinationService.completeWorkflow(sessionId);

            if (success) {
                // Зберігаємо фінальні дані в контексті
                context.getExtendedState().getVariables().put("completedBasicOrderInfo", currentData);
                context.getExtendedState().getVariables().put("isCompleted", true);
            } else {
                context.getExtendedState().getVariables().put("error", "Не вдалося завершити процес");
            }

        } catch (Exception e) {
            context.getExtendedState().getVariables().put("error", "Помилка завершення: " + e.getMessage());
        }
    }
}
