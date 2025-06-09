package com.aksi.domain.order.statemachine.stage1.actions;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.dto.ClientSelectionDTO;
import com.aksi.domain.order.statemachine.stage1.enums.Stage1Event;
import com.aksi.domain.order.statemachine.stage1.enums.Stage1State;
import com.aksi.domain.order.statemachine.stage1.service.Stage1CoordinationService;

/**
 * Action для обробки вибору клієнта.
 */
@Component
public class ClientSelectedAction implements Action<Stage1State, Stage1Event> {

    private final Stage1CoordinationService coordinationService;

    public ClientSelectedAction(Stage1CoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<Stage1State, Stage1Event> context) {
        String sessionId = getSessionId(context);
        ClientSelectionDTO clientSelection = getClientSelection(context);

        if (sessionId != null && clientSelection != null) {
            // Зберігаємо вибір клієнта в сесію
            coordinationService.setClientSelectionInSession(sessionId, clientSelection);

            // Логування
            System.out.println("Клієнт обраний для сесії: " + sessionId +
                             ", режим: " + clientSelection.getMode());
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
