package com.aksi.domain.order.statemachine.stage2.substep5.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.domain.order.statemachine.stage2.substep5.dto.PhotoDocumentationDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.service.PhotoDocumentationStateService.PhotoDocumentationContext;
import com.aksi.domain.order.statemachine.stage2.substep5.validator.ValidationResult;

/**
 * Бізнес-сервіс для підетапу 2.5: Фотодокументація.
 * Містить високорівневі методи з бізнес-логікою.
 */
@Service
public class PhotoDocumentationBusinessService {

    private final PhotoDocumentationValidationService validationService;
    private final PhotoDocumentationStateService stateService;

    public PhotoDocumentationBusinessService(
            PhotoDocumentationValidationService validationService,
            PhotoDocumentationStateService stateService) {
        this.validationService = validationService;
        this.stateService = stateService;
    }

    /**
     * Перевірка чи можна додати фотографію.
     */
    public boolean canAddPhoto(UUID sessionId, MultipartFile file) {
        PhotoDocumentationContext context = stateService.getContext(sessionId);
        if (context == null || !context.hasData()) {
            return false;
        }

        ValidationResult fileValidation = validationService.validatePhotoFile(file);
        if (!fileValidation.isValid()) {
            return false;
        }

        ValidationResult addValidation = validationService.validateCanAddPhoto(context.getData());
        return addValidation.isValid();
    }

    /**
     * Перевірка готовності до завершення.
     */
    public boolean canCompleteDocumentation(UUID sessionId) {
        PhotoDocumentationContext context = stateService.getContext(sessionId);
        if (context == null || !context.hasData()) {
            return false;
        }

        ValidationResult validation = validationService.validateCanComplete(context.getData());
        return validation.isValid();
    }

    /**
     * Перевіряє чи документація валідна через sessionId для Guards
     */
    public boolean isDocumentationValid(UUID sessionId) {
        PhotoDocumentationContext context = stateService.getContext(sessionId);
        if (context == null || !context.hasData()) {
            return false;
        }

        ValidationResult validation = validationService.validateFullDocumentation(context.getData());
        return validation.isValid();
    }

    /**
     * Перевіряє чи документація готова до завершення через sessionId для Guards
     */
    public boolean isDocumentationComplete(UUID sessionId) {
        return canCompleteDocumentation(sessionId);
    }

    /**
     * Отримання даних фотодокументації з сесії.
     */
    public PhotoDocumentationDTO getPhotoDocumentationData(UUID sessionId) {
        PhotoDocumentationContext context = stateService.getContext(sessionId);
        return context != null ? context.getData() : null;
    }

    /**
     * Перевірка існування сесії.
     */
    public boolean sessionExists(UUID sessionId) {
        return stateService.hasContext(sessionId);
    }
}
