package com.aksi.domain.order.statemachine.stage2.substep5.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.domain.order.statemachine.stage2.substep5.dto.SubstepResultDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.enums.PhotoDocumentationState;
import com.aksi.domain.order.statemachine.stage2.substep5.service.PhotoDocumentationStateService.PhotoDocumentationContext;

/**
 * Сервіс управління сесіями фотодокументації.
 * Відповідає за координацію між станом сесії та робочим процесом.
 */
@Service
public class PhotoDocumentationSessionService {

    private final PhotoDocumentationStateService stateService;
    private final PhotoDocumentationWorkflowService workflowService;

    public PhotoDocumentationSessionService(
            PhotoDocumentationStateService stateService,
            PhotoDocumentationWorkflowService workflowService) {
        this.stateService = stateService;
        this.workflowService = workflowService;
    }

    /**
     * Ініціалізація фотодокументації для предмета.
     */
    public SubstepResultDTO initializePhotoDocumentation(UUID itemId) {
        try {
            UUID sessionId = UUID.randomUUID();

            // Початок робочого процесу
            SubstepResultDTO result = workflowService.startPhotoDocumentation(itemId);

            if (result.getSuccess()) {
                // Оновлення контексту з даними та станом
                stateService.updateData(sessionId, result.getData());
                stateService.updateState(sessionId, result.getCurrentState());

                // Оновлення результату з sessionId
                result = result.toBuilder()
                    .sessionId(sessionId)
                    .build();
            }

            return result;

        } catch (Exception e) {
            return SubstepResultDTO.builder()
                .currentState(PhotoDocumentationState.ERROR)
                .success(false)
                .message("Помилка ініціалізації фотодокументації")
                .details(e.getMessage())
                .build();
        }
    }

    /**
     * Додавання фотографії до документації.
     */
    public SubstepResultDTO addPhoto(UUID sessionId, MultipartFile file) {
        try {
            PhotoDocumentationContext context = stateService.getContext(sessionId);
            if (context == null || !context.hasData()) {
                return SubstepResultDTO.builder()
                    .currentState(PhotoDocumentationState.ERROR)
                    .success(false)
                    .message("Сесія не знайдена або не ініціалізована")
                    .build();
            }

            SubstepResultDTO result = workflowService.addPhoto(file, context.getData());

            if (result.getSuccess()) {
                // Оновлення контексту
                stateService.updateData(sessionId, result.getData());
                stateService.updateState(sessionId, result.getCurrentState());

                // Оновлення результату з sessionId
                result = result.toBuilder()
                    .sessionId(sessionId)
                    .build();
            }

            return result;

        } catch (Exception e) {
            return SubstepResultDTO.builder()
                .sessionId(sessionId)
                .currentState(PhotoDocumentationState.ERROR)
                .success(false)
                .message("Помилка додавання фотографії")
                .details(e.getMessage())
                .build();
        }
    }

    /**
     * Видалення фотографії з документації.
     */
    public SubstepResultDTO removePhoto(UUID sessionId, UUID photoId) {
        try {
            PhotoDocumentationContext context = stateService.getContext(sessionId);
            if (context == null || !context.hasData()) {
                return SubstepResultDTO.builder()
                    .currentState(PhotoDocumentationState.ERROR)
                    .success(false)
                    .message("Сесія не знайдена або не ініціалізована")
                    .build();
            }

            SubstepResultDTO result = workflowService.removePhoto(photoId, context.getData());

            if (result.getSuccess()) {
                // Оновлення контексту
                stateService.updateData(sessionId, result.getData());
                stateService.updateState(sessionId, result.getCurrentState());

                // Оновлення результату з sessionId
                result = result.toBuilder()
                    .sessionId(sessionId)
                    .build();
            }

            return result;

        } catch (Exception e) {
            return SubstepResultDTO.builder()
                .sessionId(sessionId)
                .currentState(PhotoDocumentationState.ERROR)
                .success(false)
                .message("Помилка видалення фотографії")
                .details(e.getMessage())
                .build();
        }
    }

    /**
     * Завершення фотодокументації.
     */
    public SubstepResultDTO completePhotoDocumentation(UUID sessionId) {
        try {
            PhotoDocumentationContext context = stateService.getContext(sessionId);
            if (context == null || !context.hasData()) {
                return SubstepResultDTO.builder()
                    .currentState(PhotoDocumentationState.ERROR)
                    .success(false)
                    .message("Сесія не знайдена або не ініціалізована")
                    .build();
            }

            SubstepResultDTO result = workflowService.completeDocumentation(context.getData());

            if (result.getSuccess()) {
                // Оновлення контексту
                stateService.updateData(sessionId, result.getData());
                stateService.updateState(sessionId, result.getCurrentState());

                // Оновлення результату з sessionId
                result = result.toBuilder()
                    .sessionId(sessionId)
                    .build();
            }

            return result;

        } catch (Exception e) {
            return SubstepResultDTO.builder()
                .sessionId(sessionId)
                .currentState(PhotoDocumentationState.ERROR)
                .success(false)
                .message("Помилка завершення фотодокументації")
                .details(e.getMessage())
                .build();
        }
    }

    /**
     * Отримання поточного стану фотодокументації.
     */
    public SubstepResultDTO getPhotoDocumentationStatus(UUID sessionId) {
        try {
            PhotoDocumentationContext context = stateService.getContext(sessionId);
            if (context == null) {
                return SubstepResultDTO.builder()
                    .currentState(PhotoDocumentationState.ERROR)
                    .success(false)
                    .message("Сесія не знайдена")
                    .build();
            }

            if (!context.hasData()) {
                return SubstepResultDTO.builder()
                    .sessionId(sessionId)
                    .currentState(context.getCurrentState())
                    .success(true)
                    .message("Сесія ініціалізована, але дані відсутні")
                    .build();
            }

            SubstepResultDTO result = workflowService.getDocumentationStatus(context.getData());

            // Оновлення результату з sessionId
            return result.toBuilder()
                .sessionId(sessionId)
                .build();

        } catch (Exception e) {
            return SubstepResultDTO.builder()
                .sessionId(sessionId)
                .currentState(PhotoDocumentationState.ERROR)
                .success(false)
                .message("Помилка отримання статусу")
                .details(e.getMessage())
                .build();
        }
    }
}
