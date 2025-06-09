package com.aksi.domain.order.statemachine.stage2.substep5.service;

import java.util.Objects;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.domain.order.dto.OrderItemPhotoDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.dto.PhotoDocumentationDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.validator.PhotoDocumentationValidator;
import com.aksi.domain.order.statemachine.stage2.substep5.validator.PhotoFileValidator;
import com.aksi.domain.order.statemachine.stage2.substep5.validator.ValidationResult;

/**
 * Сервіс валідації для підетапу 2.5: Фотодокументація.
 * Консолідує всі валідатори в єдиний інтерфейс.
 */
@Service
public class PhotoDocumentationValidationService {

    private final PhotoDocumentationValidator documentationValidator;
    private final PhotoFileValidator fileValidator;

    public PhotoDocumentationValidationService(
            PhotoDocumentationValidator documentationValidator,
            PhotoFileValidator fileValidator) {
        this.documentationValidator = documentationValidator;
        this.fileValidator = fileValidator;
    }

    /**
     * Повна валідація фотодокументації.
     */
    public ValidationResult validateFullDocumentation(PhotoDocumentationDTO dto) {
        return documentationValidator.validatePhotoDocumentation(dto);
    }

    /**
     * Валідація файлу фотографії.
     */
    public ValidationResult validatePhotoFile(MultipartFile file) {
        return fileValidator.validatePhotoFile(file);
    }

    /**
     * Валідація можливості додавання нової фотографії.
     */
    public ValidationResult validateCanAddPhoto(PhotoDocumentationDTO dto) {
        ValidationResult docValidation = documentationValidator.validateCanAddPhoto(dto);

        if (dto != null && dto.getPhotos() != null) {
            int currentCount = dto.getPhotos().size();
            int maxAllowed = Objects.requireNonNullElse(dto.getMaxPhotosAllowed(), 5);
            ValidationResult countValidation = fileValidator.validatePhotosCount(currentCount, maxAllowed);
            docValidation = docValidation.merge(countValidation);
        }

        return docValidation;
    }

    /**
     * Валідація нової фотографії перед додаванням.
     */
    public ValidationResult validateNewPhoto(MultipartFile file, PhotoDocumentationDTO dto, UUID expectedItemId) {
        // Валідація файлу
        ValidationResult fileValidation = validatePhotoFile(file);

        // Валідація можливості додавання
        ValidationResult addValidation = validateCanAddPhoto(dto);

        return fileValidation.merge(addValidation);
    }

    /**
     * Валідація фотографії перед додаванням до DTO.
     */
    public ValidationResult validatePhotoBeforeAdd(OrderItemPhotoDTO photo, UUID expectedItemId) {
        return documentationValidator.validatePhotoBeforeAdd(photo, expectedItemId);
    }

    /**
     * Валідація можливості завершення фотодокументації.
     */
    public ValidationResult validateCanComplete(PhotoDocumentationDTO dto) {
        return documentationValidator.validateCanComplete(dto);
    }

    /**
     * Валідація кількості фотографій.
     */
    public ValidationResult validatePhotosCount(PhotoDocumentationDTO dto) {
        return documentationValidator.validatePhotosCount(dto);
    }

    /**
     * Перевірка чи потрібно стиснення файлу.
     */
    public boolean needsCompression(MultipartFile file) {
        return fileValidator.needsCompression(file);
    }

    /**
     * Отримання максимального розміру файлу.
     */
    public long getMaxFileSizeBytes() {
        return fileValidator.getMaxFileSizeBytes();
    }
}
