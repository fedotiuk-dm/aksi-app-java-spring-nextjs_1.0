package com.aksi.domain.order.statemachine.stage1.actions;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.dto.ClientSelectionDTO;
import com.aksi.domain.order.statemachine.stage1.enums.Stage1Event;
import com.aksi.domain.order.statemachine.stage1.enums.Stage1State;
import com.aksi.domain.order.statemachine.stage1.service.Stage1CoordinationService;

/**
 * Action для завершення Stage1.
 */
@Component
public class CompleteStage1Action implements Action<Stage1State, Stage1Event> {

    private final Stage1CoordinationService coordinationService;

    public CompleteStage1Action(Stage1CoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<Stage1State, Stage1Event> context) {
        String sessionId = getSessionId(context);
        ClientSelectionDTO clientSelection = getClientSelection(context);

        if (sessionId != null) {
            // Перевіряємо готовність до завершення
            if (coordinationService.isStage1Ready(clientSelection)) {
                // Завершуємо сесію
                coordinationService.completeSession(sessionId);

                // Позначаємо в контексті що Stage1 завершено
                context.getExtendedState().getVariables().put("stage1Completed", true);

                // Логування
                System.out.println("Stage1 завершено для сесії: " + sessionId);
            } else {
                // Помилка - Stage1 не готовий до завершення
                System.err.println("Помилка: Stage1 не готовий до завершення для сесії: " + sessionId);
                context.getExtendedState().getVariables().put("stage1Error", "Stage1 не готовий до завершення");
            }
        } else {
            System.err.println("Помилка: sessionId відсутній в контексті");
            context.getExtendedState().getVariables().put("stage1Error", "sessionId відсутній");
        }
    }

    /**
     * Отримання sessionId з контексту.
     */
    private String getSessionId(StateContext<Stage1State, Stage1Event> context) {
        Object sessionIdObj = context.getExtendedState().getVariables().get("sessionId");
        return sessionIdObj instanceof String ? (String) sessionIdObj : null;
    }

    /**
     * Отримання ClientSelectionDTO з контексту.
     */
    private ClientSelectionDTO getClientSelection(StateContext<Stage1State, Stage1Event> context) {
        Object clientSelectionObj = context.getExtendedState().getVariables().get("clientSelection");
        return clientSelectionObj instanceof ClientSelectionDTO ? (ClientSelectionDTO) clientSelectionObj : null;
    }
}
