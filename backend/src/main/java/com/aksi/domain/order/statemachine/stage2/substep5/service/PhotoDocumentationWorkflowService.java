package com.aksi.domain.order.statemachine.stage2.substep5.service;

import java.io.IOException;
import java.util.Objects;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.domain.order.dto.OrderItemPhotoDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.dto.PhotoDocumentationDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.dto.SubstepResultDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.enums.PhotoDocumentationState;
import com.aksi.domain.order.statemachine.stage2.substep5.mapper.PhotoDocumentationMapper;
import com.aksi.domain.order.statemachine.stage2.substep5.validator.ValidationResult;

/**
 * Сервіс робочого процесу для підетапу 2.5: Фотодокументація.
 * Управляє бізнес-процесами фотодокументації.
 */
@Service
public class PhotoDocumentationWorkflowService {

    private final PhotoDocumentationValidationService validationService;
    private final PhotoDocumentationOperationsService operationsService;
    private final PhotoDocumentationMapper mapper;

    public PhotoDocumentationWorkflowService(
            PhotoDocumentationValidationService validationService,
            PhotoDocumentationOperationsService operationsService,
            PhotoDocumentationMapper mapper) {
        this.validationService = validationService;
        this.operationsService = operationsService;
        this.mapper = mapper;
    }

    /**
     * Початок фотодокументації.
     */
    public SubstepResultDTO startPhotoDocumentation(UUID itemId) {
        try {
            PhotoDocumentationDTO dto = mapper.createPhotoDocumentationDTO(itemId);

            ValidationResult validation = validationService.validateFullDocumentation(dto);
            if (!validation.isValid()) {
                return mapper.createErrorResult(
                    PhotoDocumentationState.ERROR,
                    "Помилка ініціалізації фотодокументації",
                    String.join("; ", validation.getErrors())
                );
            }

            return mapper.createSuccessResult(
                PhotoDocumentationState.UPLOADING_PHOTOS,
                dto,
                "Фотодокументація ініціалізована. Можна додавати фотографії."
            );

        } catch (Exception e) {
            return mapper.createErrorResult(
                PhotoDocumentationState.ERROR,
                "Внутрішня помилка при ініціалізації",
                e.getMessage()
            );
        }
    }

    /**
     * Додавання фотографії до документації.
     */
    public SubstepResultDTO addPhoto(MultipartFile file, PhotoDocumentationDTO dto) {
        try {
            // Валідація можливості додавання
            ValidationResult validation = validationService.validateNewPhoto(file, dto, dto.getItemId());
            if (!validation.isValid()) {
                return mapper.createErrorResult(
                    PhotoDocumentationState.ERROR,
                    "Помилка валідації фотографії",
                    String.join("; ", validation.getErrors())
                );
            }

            // Збереження файлу
            String fileName = operationsService.storePhotoFile(file);
            String originalName = operationsService.getOriginalFileName(file);

            // Створення DTO фотографії
            OrderItemPhotoDTO photoDTO = operationsService.createPhotoDTO(
                dto.getItemId(), fileName, originalName
            );

            // Додавання до документації
            PhotoDocumentationDTO updatedDto = mapper.addPhotoToDocumentation(dto, photoDTO);

            return mapper.createSuccessResult(
                PhotoDocumentationState.REVIEWING_PHOTOS,
                updatedDto,
                "Фотографія успішно додана"
            );

        } catch (IOException e) {
            return mapper.createErrorResult(
                PhotoDocumentationState.ERROR,
                "Помилка збереження файлу",
                e.getMessage()
            );
        } catch (Exception e) {
            return mapper.createErrorResult(
                PhotoDocumentationState.ERROR,
                "Внутрішня помилка при додаванні фото",
                e.getMessage()
            );
        }
    }

    /**
     * Видалення фотографії з документації.
     */
    public SubstepResultDTO removePhoto(UUID photoId, PhotoDocumentationDTO dto) {
        try {
            if (dto.getPhotos() == null) {
                return mapper.createErrorResult(
                    PhotoDocumentationState.ERROR,
                    "Список фотографій не ініціалізований",
                    null
                );
            }

            // Знаходження фотографії для видалення
            OrderItemPhotoDTO photoToRemove = dto.getPhotos().stream()
                .filter(photo -> photo.getId().equals(photoId))
                .findFirst()
                .orElse(null);

            if (photoToRemove == null) {
                return mapper.createErrorResult(
                    PhotoDocumentationState.ERROR,
                    "Фотографія не знайдена",
                    "Фотографія з ID " + photoId + " не існує"
                );
            }

            // Видалення файлу з файлової системи
            String fileName = extractFileNameFromUrl(photoToRemove.getFileUrl());
            if (fileName != null) {
                operationsService.deletePhotoFile(fileName);
            }

            // Створення оновленого DTO без цієї фотографії
            var updatedPhotos = dto.getPhotos().stream()
                .filter(photo -> !photo.getId().equals(photoId))
                .toList();

            PhotoDocumentationDTO updatedDto = dto.toBuilder()
                .photos(updatedPhotos)
                .build();

            PhotoDocumentationState newState = updatedPhotos.isEmpty() ?
                PhotoDocumentationState.UPLOADING_PHOTOS :
                PhotoDocumentationState.REVIEWING_PHOTOS;

            return mapper.createSuccessResult(
                newState,
                updatedDto,
                "Фотографія успішно видалена"
            );

        } catch (Exception e) {
            return mapper.createErrorResult(
                PhotoDocumentationState.ERROR,
                "Помилка видалення фотографії",
                e.getMessage()
            );
        }
    }

    /**
     * Завершення фотодокументації.
     */
    public SubstepResultDTO completeDocumentation(PhotoDocumentationDTO dto) {
        try {
            ValidationResult validation = validationService.validateCanComplete(dto);
            if (!validation.isValid()) {
                return mapper.createErrorResult(
                    PhotoDocumentationState.ERROR,
                    "Неможливо завершити фотодокументацію",
                    String.join("; ", validation.getErrors())
                );
            }

            PhotoDocumentationDTO completedDto = mapper.completeDocumentation(dto);

            return mapper.createSuccessResult(
                PhotoDocumentationState.COMPLETED,
                completedDto,
                "Фотодокументація успішно завершена"
            );

        } catch (Exception e) {
            return mapper.createErrorResult(
                PhotoDocumentationState.ERROR,
                "Помилка завершення фотодокументації",
                e.getMessage()
            );
        }
    }

    /**
     * Отримання стану документації.
     */
    public SubstepResultDTO getDocumentationStatus(PhotoDocumentationDTO dto) {
        if (dto == null) {
            return mapper.createErrorResult(
                PhotoDocumentationState.ERROR,
                "Дані фотодокументації відсутні",
                null
            );
        }

        PhotoDocumentationState state = determineCurrentState(dto);
        String message = generateStatusMessage(dto, state);

        return mapper.createSuccessResult(state, dto, message);
    }

    /**
     * Визначення поточного стану на основі даних.
     */
    private PhotoDocumentationState determineCurrentState(PhotoDocumentationDTO dto) {
        if (Boolean.TRUE.equals(dto.getDocumentationCompleted())) {
            return PhotoDocumentationState.COMPLETED;
        }

        if (dto.getPhotos() == null || dto.getPhotos().isEmpty()) {
            return PhotoDocumentationState.UPLOADING_PHOTOS;
        }

        return PhotoDocumentationState.REVIEWING_PHOTOS;
    }

    /**
     * Генерація повідомлення про статус.
     */
    private String generateStatusMessage(PhotoDocumentationDTO dto, PhotoDocumentationState state) {
        int photoCount = dto.getPhotos() != null ? dto.getPhotos().size() : 0;
        int maxPhotos = Objects.requireNonNullElse(dto.getMaxPhotosAllowed(), 5);

        return switch (state) {
            case UPLOADING_PHOTOS -> "Очікування завантаження фотографій";
            case REVIEWING_PHOTOS -> String.format("Завантажено %d з %d фото", photoCount, maxPhotos);
            case COMPLETED -> String.format("Фотодокументація завершена (%d фото)", photoCount);
            default -> "Невідомий стан";
        };
    }

    /**
     * Витягування імені файлу з URL.
     */
    private String extractFileNameFromUrl(String url) {
        if (url == null || url.isEmpty()) {
            return null;
        }
        int lastSlash = url.lastIndexOf('/');
        return lastSlash != -1 ? url.substring(lastSlash + 1) : url;
    }
}
