package com.aksi.domain.order.statemachine.stage2.substep5.guards;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.domain.order.statemachine.stage2.substep5.enums.PhotoDocumentationEvent;
import com.aksi.domain.order.statemachine.stage2.substep5.enums.PhotoDocumentationState;
import com.aksi.domain.order.statemachine.stage2.substep5.service.PhotoDocumentationCoordinationService;

/**
 * Guard для перевірки можливості додавання фотографії.
 * Використовує тільки CoordinationService.
 */
@Component
public class CanAddPhotoGuard implements Guard<PhotoDocumentationState, PhotoDocumentationEvent> {

    private final PhotoDocumentationCoordinationService coordinationService;

    public CanAddPhotoGuard(PhotoDocumentationCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public boolean evaluate(StateContext<PhotoDocumentationState, PhotoDocumentationEvent> context) {
        Object sessionId = context.getExtendedState().getVariables().get("sessionId");
        Object file = context.getExtendedState().getVariables().get("photoFile");

        if (sessionId == null) {
            return false;
        }

        if (file instanceof MultipartFile multipartFile) {
            return coordinationService.canAddPhoto(UUID.fromString(sessionId.toString()), multipartFile);
        }

        // Якщо файл не передано, перевіряємо загальну можливість додавання
        return coordinationService.canAddPhoto(UUID.fromString(sessionId.toString()), null);
    }
}
