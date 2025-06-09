package com.aksi.domain.order.statemachine.stage2.substep5.guards;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep5.enums.PhotoDocumentationEvent;
import com.aksi.domain.order.statemachine.stage2.substep5.enums.PhotoDocumentationState;
import com.aksi.domain.order.statemachine.stage2.substep5.service.PhotoDocumentationCoordinationService;

/**
 * Guard для перевірки готовності завершення фотодокументації.
 * Використовує тільки CoordinationService.
 */
@Component
public class DocumentationCompleteGuard implements Guard<PhotoDocumentationState, PhotoDocumentationEvent> {

    private final PhotoDocumentationCoordinationService coordinationService;

    public DocumentationCompleteGuard(PhotoDocumentationCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public boolean evaluate(StateContext<PhotoDocumentationState, PhotoDocumentationEvent> context) {
        Object sessionId = context.getExtendedState().getVariables().get("sessionId");

        if (sessionId == null) {
            return false;
        }

        return coordinationService.canCompleteDocumentation(UUID.fromString(sessionId.toString()));
    }
}
