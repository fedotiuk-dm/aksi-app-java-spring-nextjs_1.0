package com.aksi.domain.order.statemachine.stage2.substep5.mapper;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.dto.OrderItemPhotoDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.dto.PhotoDocumentationDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.dto.SubstepResultDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.enums.PhotoDocumentationState;

/**
 * Mapper для підетапу 2.5: Фотодокументація.
 * Відповідає за прості трансформації між DTO.
 */
@Component
public class PhotoDocumentationMapper {

    /**
     * Створення нового DTO фотодокументації.
     */
    public PhotoDocumentationDTO createPhotoDocumentationDTO(UUID itemId) {
        return PhotoDocumentationDTO.builder()
                .sessionId(UUID.randomUUID())
                .itemId(itemId)
                .photos(new ArrayList<>())
                .maxPhotosAllowed(5)
                .maxFileSizeMB(5L)
                .documentationCompleted(false)
                .startTime(LocalDateTime.now())
                .build();
    }

    /**
     * Створення успішного результату.
     */
    public SubstepResultDTO createSuccessResult(PhotoDocumentationState state,
                                               PhotoDocumentationDTO data,
                                               String message) {
        return SubstepResultDTO.builder()
                .sessionId(data.getSessionId())
                .currentState(state)
                .success(true)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Створення результату з помилкою.
     */
    public SubstepResultDTO createErrorResult(PhotoDocumentationState state,
                                             String message,
                                             String details) {
        return SubstepResultDTO.builder()
                .currentState(state)
                .success(false)
                .message(message)
                .details(details)
                .timestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Додавання фотографії до документації.
     */
    public PhotoDocumentationDTO addPhotoToDocumentation(PhotoDocumentationDTO dto,
                                                        OrderItemPhotoDTO photo) {
        if (dto == null || photo == null) {
            return dto;
        }

        var photos = new ArrayList<>(dto.getPhotos());
        photos.add(photo);

        return dto.toBuilder()
                .photos(photos)
                .build();
    }

    /**
     * Завершення фотодокументації.
     */
    public PhotoDocumentationDTO completeDocumentation(PhotoDocumentationDTO dto) {
        if (dto == null) {
            return null;
        }

        return dto.toBuilder()
                .documentationCompleted(true)
                .completionTime(LocalDateTime.now())
                .build();
    }
}
