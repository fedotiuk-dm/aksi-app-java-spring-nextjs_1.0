package com.aksi.domain.order.statemachine.stage2.substep5.actions;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep5.enums.PhotoDocumentationEvent;
import com.aksi.domain.order.statemachine.stage2.substep5.enums.PhotoDocumentationState;
import com.aksi.domain.order.statemachine.stage2.substep5.service.PhotoDocumentationCoordinationService;

/**
 * Action для завершення фотодокументації.
 * Використовує тільки CoordinationService.
 */
@Component
public class CompleteDocumentationAction implements Action<PhotoDocumentationState, PhotoDocumentationEvent> {

    private final PhotoDocumentationCoordinationService coordinationService;

    public CompleteDocumentationAction(PhotoDocumentationCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<PhotoDocumentationState, PhotoDocumentationEvent> context) {
        Object sessionId = context.getExtendedState().getVariables().get("sessionId");

        if (sessionId != null) {
            try {
                UUID sessionUuid = UUID.fromString(sessionId.toString());
                var result = coordinationService.completePhotoDocumentation(sessionUuid);

                // Оновлюємо стан
                context.getExtendedState().getVariables().put("currentState", result.getCurrentState());
                context.getExtendedState().getVariables().put("completed", true);
                context.getExtendedState().getVariables().put("finalData", result.getData());

            } catch (Exception e) {
                context.getExtendedState().getVariables().put("error", e.getMessage());
            }
        }
    }
}
