package com.aksi.domain.order.statemachine.stage1.actions;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.enums.Stage1Event;
import com.aksi.domain.order.statemachine.stage1.enums.Stage1State;
import com.aksi.domain.order.statemachine.stage1.service.Stage1CoordinationService;

/**
 * Action для ініціалізації Stage1.
 */
@Component
public class InitializeStage1Action implements Action<Stage1State, Stage1Event> {

    private final Stage1CoordinationService coordinationService;

    public InitializeStage1Action(Stage1CoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<Stage1State, Stage1Event> context) {
        // Отримуємо або створюємо sessionId
        String sessionId = getOrCreateSessionId(context);

        // Зберігаємо sessionId в контексті State Machine
        context.getExtendedState().getVariables().put("sessionId", sessionId);

        // Логування ініціалізації
        System.out.println("Stage1 ініціалізовано для сесії: " + sessionId);
    }

    /**
     * Отримання існуючого або створення нового sessionId.
     */
    private String getOrCreateSessionId(StateContext<Stage1State, Stage1Event> context) {
        Object sessionIdObj = context.getExtendedState().getVariables().get("sessionId");

        if (sessionIdObj instanceof String sessionId) {
            if (coordinationService.sessionExists(sessionId)) {
                return sessionId;
            }
        }

        // Створюємо нову сесію
        return coordinationService.initializeSession();
    }
}
