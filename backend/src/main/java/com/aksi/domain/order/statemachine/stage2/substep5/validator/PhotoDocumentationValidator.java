package com.aksi.domain.order.statemachine.stage2.substep5.validator;

import java.util.Objects;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.dto.OrderItemPhotoDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.dto.PhotoDocumentationDTO;

/**
 * Валідатор фотодокументації для підетапу 2.5.
 * Перевіряє бізнес-правила фотодокументації предметів.
 */
@Component
public class PhotoDocumentationValidator {

    /**
     * Валідація DTO фотодокументації.
     */
    public ValidationResult validatePhotoDocumentation(PhotoDocumentationDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO фотодокументації не може бути порожнім");
        }

        ValidationResult result = new ValidationResult();

        // Перевірка обов'язкових полів
        if (dto.getSessionId() == null) {
            result.addError("Ідентифікатор сесії обов'язковий");
        }

        if (dto.getItemId() == null) {
            result.addError("Ідентифікатор предмета обов'язковий");
        }

        // Перевірка кількості фотографій
        ValidationResult countValidation = validatePhotosCount(dto);
        result = result.merge(countValidation);

        // Перевірка стану завершення
        ValidationResult completionValidation = validateCompletionState(dto);
        result = result.merge(completionValidation);

        return result;
    }

    /**
     * Валідація кількості фотографій.
     */
    public ValidationResult validatePhotosCount(PhotoDocumentationDTO dto) {
        if (dto == null || dto.getPhotos() == null) {
            return ValidationResult.failure("Список фотографій не ініціалізований");
        }

        ValidationResult result = new ValidationResult();
        int currentCount = dto.getPhotos().size();
        int maxAllowed = Objects.requireNonNullElse(dto.getMaxPhotosAllowed(), 5);

        if (currentCount > maxAllowed) {
            result.addError(
                String.format("Кількість фото (%d) перевищує максимально дозволену (%d)",
                    currentCount, maxAllowed)
            );
        }

        if (currentCount == 0 && Boolean.TRUE.equals(dto.getDocumentationCompleted())) {
            result.addError("Неможливо завершити фотодокументацію без жодного фото");
        }

        return result;
    }

    /**
     * Валідація можливості додавання нової фотографії.
     */
    public ValidationResult validateCanAddPhoto(PhotoDocumentationDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO фотодокументації не існує");
        }

        ValidationResult result = new ValidationResult();

        if (Boolean.TRUE.equals(dto.getDocumentationCompleted())) {
            result.addError("Фотодокументація вже завершена, додавання нових фото неможливе");
        }

        int currentCount = dto.getPhotos() != null ? dto.getPhotos().size() : 0;
        int maxAllowed = Objects.requireNonNullElse(dto.getMaxPhotosAllowed(), 5);

        if (currentCount >= maxAllowed) {
            result.addError(
                String.format("Досягнуто максимальної кількості фото (%d)", maxAllowed)
            );
        }

        return result;
    }

    /**
     * Валідація фотографії перед додаванням.
     */
    public ValidationResult validatePhotoBeforeAdd(OrderItemPhotoDTO photo, UUID expectedItemId) {
        if (photo == null) {
            return ValidationResult.failure("Фотографія не може бути порожньою");
        }

        ValidationResult result = new ValidationResult();

        if (photo.getId() == null) {
            result.addError("Ідентифікатор фотографії обов'язковий");
        }

        if (photo.getItemId() == null) {
            result.addError("Ідентифікатор предмета в фотографії обов'язковий");
        } else if (!photo.getItemId().equals(expectedItemId)) {
            result.addError("Ідентифікатор предмета в фотографії не відповідає очікуваному");
        }

        if (photo.getFileUrl() == null || photo.getFileUrl().trim().isEmpty()) {
            result.addError("URL файлу фотографії обов'язковий");
        }

        return result;
    }

    /**
     * Валідація стану завершення.
     */
    public ValidationResult validateCompletionState(PhotoDocumentationDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO фотодокументації відсутнє");
        }

        ValidationResult result = new ValidationResult();

        if (Boolean.TRUE.equals(dto.getDocumentationCompleted())) {
            // Перевірки для завершеної документації
            if (dto.getCompletionTime() == null) {
                result.addError("Час завершення має бути встановлений для завершеної документації");
            }

            if (dto.getPhotos() == null || dto.getPhotos().isEmpty()) {
                result.addError("Завершена документація повинна містити принаймні одне фото");
            }
        }

        return result;
    }

    /**
     * Валідація можливості завершення фотодокументації.
     */
    public ValidationResult validateCanComplete(PhotoDocumentationDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO фотодокументації відсутнє");
        }

        ValidationResult result = new ValidationResult();

        if (Boolean.TRUE.equals(dto.getDocumentationCompleted())) {
            result.addError("Фотодокументація вже завершена");
            return result;
        }

        if (dto.getPhotos() == null || dto.getPhotos().isEmpty()) {
            result.addError("Неможливо завершити документацію без жодного фото");
        }

        return result;
    }
}
