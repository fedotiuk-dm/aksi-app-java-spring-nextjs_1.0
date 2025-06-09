package com.aksi.domain.order.statemachine.stage2.substep5.actions;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep5.enums.PhotoDocumentationEvent;
import com.aksi.domain.order.statemachine.stage2.substep5.enums.PhotoDocumentationState;
import com.aksi.domain.order.statemachine.stage2.substep5.service.PhotoDocumentationCoordinationService;

/**
 * Action для ініціалізації фотодокументації.
 * Використовує тільки CoordinationService.
 */
@Component
public class InitializePhotoDocumentationAction implements Action<PhotoDocumentationState, PhotoDocumentationEvent> {

    private final PhotoDocumentationCoordinationService coordinationService;

    public InitializePhotoDocumentationAction(PhotoDocumentationCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<PhotoDocumentationState, PhotoDocumentationEvent> context) {
        Object itemId = context.getExtendedState().getVariables().get("itemId");

        if (itemId != null) {
            try {
                UUID itemUuid = UUID.fromString(itemId.toString());
                var result = coordinationService.initializePhotoDocumentation(itemUuid);

                // Зберігаємо sessionId для подальших операцій
                context.getExtendedState().getVariables().put("sessionId", result.getSessionId());
                context.getExtendedState().getVariables().put("currentState", result.getCurrentState());

            } catch (Exception e) {
                context.getExtendedState().getVariables().put("error", e.getMessage());
            }
        }
    }
}
