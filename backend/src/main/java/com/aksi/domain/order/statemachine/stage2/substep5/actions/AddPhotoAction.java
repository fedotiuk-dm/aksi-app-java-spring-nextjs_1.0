package com.aksi.domain.order.statemachine.stage2.substep5.actions;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.domain.order.statemachine.stage2.substep5.enums.PhotoDocumentationEvent;
import com.aksi.domain.order.statemachine.stage2.substep5.enums.PhotoDocumentationState;
import com.aksi.domain.order.statemachine.stage2.substep5.service.PhotoDocumentationCoordinationService;

/**
 * Action для додавання фотографії.
 * Використовує тільки CoordinationService.
 */
@Component
public class AddPhotoAction implements Action<PhotoDocumentationState, PhotoDocumentationEvent> {

    private final PhotoDocumentationCoordinationService coordinationService;

    public AddPhotoAction(PhotoDocumentationCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<PhotoDocumentationState, PhotoDocumentationEvent> context) {
        Object sessionId = context.getExtendedState().getVariables().get("sessionId");
        Object file = context.getExtendedState().getVariables().get("photoFile");

        if (sessionId != null && file instanceof MultipartFile) {
            try {
                UUID sessionUuid = UUID.fromString(sessionId.toString());
                var result = coordinationService.addPhoto(sessionUuid, (MultipartFile) file);

                // Оновлюємо стан
                context.getExtendedState().getVariables().put("currentState", result.getCurrentState());
                context.getExtendedState().getVariables().put("photoCount", result.getData().getPhotos().size());

            } catch (Exception e) {
                context.getExtendedState().getVariables().put("error", e.getMessage());
            }
        }
    }
}
