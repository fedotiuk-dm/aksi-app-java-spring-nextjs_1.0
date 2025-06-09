package com.aksi.domain.order.statemachine.stage2.substep5.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.domain.order.statemachine.stage2.substep5.dto.PhotoDocumentationDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.dto.SubstepResultDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.enums.PhotoDocumentationState;
import com.aksi.domain.order.statemachine.stage2.substep5.mapper.PhotoDocumentationMapper;
import com.aksi.domain.order.statemachine.stage2.substep5.service.PhotoDocumentationStateService.PhotoDocumentationContext;
import com.aksi.domain.order.statemachine.stage2.substep5.validator.ValidationResult;

/**
 * Координаційний сервіс для підетапу 2.5: Фотодокументація.
 * Головний делегатор між усіма сервісами для роботи з фотодокументацією.
 */
@Service
public class PhotoDocumentationCoordinationService {

    private final PhotoDocumentationValidationService validationService;
    private final PhotoDocumentationSessionService sessionService;
    private final PhotoDocumentationOperationsService operationsService;
    private final PhotoDocumentationStateService stateService;
    private final PhotoDocumentationWorkflowService workflowService;
    private final PhotoDocumentationBusinessService businessService;
    private final PhotoDocumentationMapper mapper;

    public PhotoDocumentationCoordinationService(
            PhotoDocumentationValidationService validationService,
            PhotoDocumentationSessionService sessionService,
            PhotoDocumentationOperationsService operationsService,
            PhotoDocumentationStateService stateService,
            PhotoDocumentationWorkflowService workflowService,
            PhotoDocumentationBusinessService businessService,
            PhotoDocumentationMapper mapper) {
        this.validationService = validationService;
        this.sessionService = sessionService;
        this.operationsService = operationsService;
        this.stateService = stateService;
        this.workflowService = workflowService;
        this.businessService = businessService;
        this.mapper = mapper;
    }

    // ========== Делегування до ValidationService ==========

    public ValidationResult validatePhotoFile(MultipartFile file) {
        return validationService.validatePhotoFile(file);
    }

    public ValidationResult validateFullDocumentation(PhotoDocumentationDTO data) {
        return validationService.validateFullDocumentation(data);
    }

    public ValidationResult validateCanAddPhoto(PhotoDocumentationDTO data) {
        return validationService.validateCanAddPhoto(data);
    }

    public ValidationResult validateCanComplete(PhotoDocumentationDTO data) {
        return validationService.validateCanComplete(data);
    }

    public boolean needsCompression(MultipartFile file) {
        return validationService.needsCompression(file);
    }

    public long getMaxFileSizeBytes() {
        return validationService.getMaxFileSizeBytes();
    }

    // ========== Делегування до SessionService ==========

    public SubstepResultDTO initializePhotoDocumentation(UUID itemId) {
        return sessionService.initializePhotoDocumentation(itemId);
    }

    public SubstepResultDTO addPhoto(UUID sessionId, MultipartFile file) {
        return sessionService.addPhoto(sessionId, file);
    }

    public SubstepResultDTO removePhoto(UUID sessionId, UUID photoId) {
        return sessionService.removePhoto(sessionId, photoId);
    }

    public SubstepResultDTO completePhotoDocumentation(UUID sessionId) {
        return sessionService.completePhotoDocumentation(sessionId);
    }

    public SubstepResultDTO getPhotoDocumentationStatus(UUID sessionId) {
        return sessionService.getPhotoDocumentationStatus(sessionId);
    }

    // ========== Делегування до OperationsService ==========

    public String storePhotoFile(MultipartFile file) throws Exception {
        return operationsService.storePhotoFile(file);
    }

    public boolean deletePhotoFile(String fileName) {
        return operationsService.deletePhotoFile(fileName);
    }

    public String getPhotoUrl(String fileName) {
        return operationsService.getPhotoUrl(fileName);
    }

    public boolean photoFileExists(String fileName) {
        return operationsService.photoFileExists(fileName);
    }

    // ========== Делегування до StateService ==========

    public PhotoDocumentationContext createContext(UUID sessionId, UUID itemId) {
        return stateService.createContext(sessionId, itemId);
    }

    public PhotoDocumentationContext getContext(UUID sessionId) {
        return stateService.getContext(sessionId);
    }

    public boolean hasContext(UUID sessionId) {
        return stateService.hasContext(sessionId);
    }

    public void updateData(UUID sessionId, PhotoDocumentationDTO data) {
        stateService.updateData(sessionId, data);
    }

    public void updateState(UUID sessionId, PhotoDocumentationState state) {
        stateService.updateState(sessionId, state);
    }

    public void removeContext(UUID sessionId) {
        stateService.removeContext(sessionId);
    }

    // ========== Делегування до WorkflowService ==========

    public SubstepResultDTO startPhotoDocumentation(UUID itemId) {
        return workflowService.startPhotoDocumentation(itemId);
    }

    public SubstepResultDTO addPhotoToDocumentation(MultipartFile file, PhotoDocumentationDTO currentData) {
        return workflowService.addPhoto(file, currentData);
    }

    public SubstepResultDTO removePhotoFromDocumentation(UUID photoId, PhotoDocumentationDTO currentData) {
        return workflowService.removePhoto(photoId, currentData);
    }

    public SubstepResultDTO completeDocumentation(PhotoDocumentationDTO data) {
        return workflowService.completeDocumentation(data);
    }

    public SubstepResultDTO getDocumentationStatus(PhotoDocumentationDTO data) {
        return workflowService.getDocumentationStatus(data);
    }

    // ========== Інтеграційні методи з Mapper ==========

    public PhotoDocumentationDTO createPhotoDocumentationDTO(UUID itemId) {
        return mapper.createPhotoDocumentationDTO(itemId);
    }

    public SubstepResultDTO createSuccessResult(PhotoDocumentationState state, PhotoDocumentationDTO data, String message) {
        return mapper.createSuccessResult(state, data, message);
    }

    public SubstepResultDTO createErrorResult(PhotoDocumentationState state, String message, String details) {
        return mapper.createErrorResult(state, message, details);
    }

    // ========== Високорівневі методи ==========

    /**
     * Перевірка чи можна додати фотографію.
     */
    public boolean canAddPhoto(UUID sessionId, MultipartFile file) {
        return businessService.canAddPhoto(sessionId, file);
    }

    /**
     * Перевірка готовності до завершення.
     */
    public boolean canCompleteDocumentation(UUID sessionId) {
        return businessService.canCompleteDocumentation(sessionId);
    }

    // ========== Делегування для Guards ==========

    /**
     * Перевіряє чи документація валідна через sessionId для Guards
     */
    public boolean isDocumentationValid(UUID sessionId) {
        return businessService.isDocumentationValid(sessionId);
    }

    /**
     * Перевіряє чи документація готова до завершення через sessionId для Guards
     */
    public boolean isDocumentationComplete(UUID sessionId) {
        return businessService.isDocumentationComplete(sessionId);
    }

    // ========== Допоміжні методи для адаптера ==========

    /**
     * Отримання даних фотодокументації з сесії.
     */
    public PhotoDocumentationDTO getPhotoDocumentationData(UUID sessionId) {
        return businessService.getPhotoDocumentationData(sessionId);
    }

    /**
     * Закриття сесії.
     */
    public void closeSession(UUID sessionId) {
        removeContext(sessionId);
    }

    /**
     * Перевірка існування сесії.
     */
    public boolean sessionExists(UUID sessionId) {
        return businessService.sessionExists(sessionId);
    }

    /**
     * Отримання поточного стану.
     */
    public PhotoDocumentationState getCurrentState(UUID sessionId) {
        PhotoDocumentationContext context = getContext(sessionId);
        return context != null ? context.getCurrentState() : PhotoDocumentationState.ERROR;
    }
}
