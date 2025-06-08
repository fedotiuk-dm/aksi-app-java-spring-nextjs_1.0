package com.aksi.domain.order.statemachine.stage2.substep5.validator;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.domain.order.statemachine.stage2.substep5.dto.PhotoDocumentationDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.dto.PhotoMetadataDTO;

import lombok.extern.slf4j.Slf4j;

/**
 * Валідатор для фотодокументації підетапу 2.5.
 *
 * Принцип "один файл = одна відповідальність":
 * Тільки валідація фотографій та фотодокументації.
 *
 * Валідації:
 * - Технічні параметри файлів (розмір, формат)
 * - Бізнес-правила фотодокументації
 * - Завершеність процесу документування
 */
@Slf4j
@Component
public class PhotosValidator {

    /**
     * Валідувати завантажений файл фотографії
     */
    public ValidationResult validatePhotoFile(MultipartFile file, PhotoDocumentationDTO currentPhotos) {
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        if (file == null || file.isEmpty()) {
            errors.add("Файл не може бути порожнім");
            return ValidationResult.invalid(errors, warnings);
        }

        // Перевірка MIME типу
        String contentType = file.getContentType();
        if (!currentPhotos.isSupportedFormat(contentType)) {
            errors.add(String.format("Формат файлу %s не підтримується. Дозволені: %s",
                contentType, String.join(", ", currentPhotos.getSupportedFormats())));
        }

        // Перевірка розміру файлу
        if (!currentPhotos.isValidFileSize(file.getSize())) {
            errors.add(String.format("Розмір файлу %.1f MB перевищує максимально дозволений %.1f MB",
                file.getSize() / (1024.0 * 1024.0),
                currentPhotos.getMaxFileSize() / (1024.0 * 1024.0)));
        }

        // Перевірка ліміту кількості фото
        if (!currentPhotos.canAddMorePhotos()) {
            errors.add(String.format("Досягнуто максимальну кількість фото (%d)",
                currentPhotos.getMaxPhotos()));
        }

        // Попередження про розмір
        if (file.getSize() > 2 * 1024 * 1024) { // Більше 2MB
            warnings.add("Великий розмір файлу може уповільнити завантаження");
        }

        if (errors.isEmpty()) {
            log.debug("Файл {} пройшов валідацію", file.getOriginalFilename());
            return ValidationResult.valid(warnings);
        } else {
            log.warn("Файл {} не пройшов валідацію: {}", file.getOriginalFilename(), String.join(", ", errors));
            return ValidationResult.invalid(errors, warnings);
        }
    }

    /**
     * Валідувати метадані фотографії
     */
    public ValidationResult validatePhotoMetadata(PhotoMetadataDTO photoMetadata) {
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        if (photoMetadata == null) {
            errors.add("Метадані фотографії не можуть бути null");
            return ValidationResult.invalid(errors, warnings);
        }

        // Перевірка обов'язкових полів
        if (photoMetadata.getPhotoId() == null || photoMetadata.getPhotoId().trim().isEmpty()) {
            errors.add("ID фотографії не може бути порожнім");
        }

        if (photoMetadata.getFileName() == null || photoMetadata.getFileName().trim().isEmpty()) {
            errors.add("Ім'я файлу не може бути порожнім");
        }

        if (photoMetadata.getContentType() == null || photoMetadata.getContentType().trim().isEmpty()) {
            errors.add("Тип контенту не може бути порожнім");
        }

        if (photoMetadata.getFileSize() == null || photoMetadata.getFileSize() <= 0) {
            errors.add("Розмір файлу повинен бути більше нуля");
        }

        if (photoMetadata.getFullSizeUrl() == null || photoMetadata.getFullSizeUrl().trim().isEmpty()) {
            errors.add("URL файлу не може бути порожнім");
        }

        // Попередження про відсутність мініатюри
        if (photoMetadata.getThumbnailUrl() == null) {
            warnings.add("Мініатюра не створена");
        }

        if (errors.isEmpty()) {
            log.debug("Метадані фото {} пройшли валідацію", photoMetadata.getPhotoId());
            return ValidationResult.valid(warnings);
        } else {
            log.warn("Метадані фото {} не пройшли валідацію: {}",
                photoMetadata.getPhotoId(), String.join(", ", errors));
            return ValidationResult.invalid(errors, warnings);
        }
    }

    /**
     * Валідувати завершеність фотодокументації
     */
    public ValidationResult validatePhotosCompletion(PhotoDocumentationDTO photosData) {
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        if (photosData == null) {
            errors.add("Дані фотодокументації відсутні");
            return ValidationResult.invalid(errors, warnings);
        }

        // Перевірка завершеності через бізнес-логіку DTO
        if (!photosData.isComplete()) {
            if (!photosData.hasPhotos() && !photosData.getPhotosSkipped()) {
                errors.add("Додайте фотографії або вкажіть причину пропуску");
            } else if (photosData.getPhotosSkipped() &&
                      (photosData.getSkipReason() == null || photosData.getSkipReason().trim().isEmpty())) {
                errors.add("Вкажіть причину пропуску фотодокументації");
            }
        }

        // Попередження якщо немає фото
        if (!photosData.hasPhotos() && !photosData.getPhotosSkipped()) {
            warnings.add("Рекомендується додати фотографії для кращого документування");
        }

        // Попередження якщо мало фото
        if (photosData.hasPhotos() && photosData.getPhotosCount() < 2) {
            warnings.add("Рекомендується додати кілька фото з різних ракурсів");
        }

        if (errors.isEmpty()) {
            log.debug("Фотодокументація пройшла валідацію завершеності");
            return ValidationResult.valid(warnings);
        } else {
            log.warn("Фотодокументація не пройшла валідацію завершеності: {}",
                String.join(", ", errors));
            return ValidationResult.invalid(errors, warnings);
        }
    }

    /**
     * Валідувати причину пропуску
     */
    public ValidationResult validateSkipReason(String skipReason) {
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        if (skipReason == null || skipReason.trim().isEmpty()) {
            errors.add("Причина пропуску не може бути порожньою");
        } else if (skipReason.trim().length() < 5) {
            errors.add("Причина пропуску занадто коротка (мінімум 5 символів)");
        } else if (skipReason.length() > 200) {
            errors.add("Причина пропуску занадто довга (максимум 200 символів)");
        }

        if (errors.isEmpty()) {
            log.debug("Причина пропуску пройшла валідацію");
            return ValidationResult.valid(warnings);
        } else {
            log.warn("Причина пропуску не пройшла валідацію: {}", String.join(", ", errors));
            return ValidationResult.invalid(errors, warnings);
        }
    }

    /**
     * Результат валідації
     */
    public static class ValidationResult {
        private final boolean valid;
        private final List<String> errors;
        private final List<String> warnings;

        private ValidationResult(boolean valid, List<String> errors, List<String> warnings) {
            this.valid = valid;
            this.errors = errors != null ? errors : new ArrayList<>();
            this.warnings = warnings != null ? warnings : new ArrayList<>();
        }

        public static ValidationResult valid(List<String> warnings) {
            return new ValidationResult(true, new ArrayList<>(), warnings);
        }

        public static ValidationResult invalid(List<String> errors, List<String> warnings) {
            return new ValidationResult(false, errors, warnings);
        }

        // Getters
        public boolean isValid() { return valid; }
        public List<String> getErrors() { return errors; }
        public List<String> getWarnings() { return warnings; }

        public boolean hasErrors() { return !errors.isEmpty(); }
        public boolean hasWarnings() { return !warnings.isEmpty(); }
    }
}
