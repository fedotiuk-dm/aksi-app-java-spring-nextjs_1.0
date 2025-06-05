package com.aksi.domain.order.statemachine.stage2.validator;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.domain.order.statemachine.stage2.dto.ItemPhotoDTO;
import com.aksi.domain.order.statemachine.stage2.dto.ItemPhotoDTO.PhotoInfo;

/**
 * Валідатор для підетапу 2.5 "Фотодокументація".
 *
 * Перевіряє:
 * - Кількість фотографій (максимум 5)
 * - Розмір файлів (максимум 5MB на файл, 25MB загалом)
 * - Типи файлів (тільки зображення)
 * - Якість зображень
 * - Цілісність даних
 */
@Component
public class ItemPhotoValidator {

    private static final Logger logger = LoggerFactory.getLogger(ItemPhotoValidator.class);

    // Константи для валідації
    private static final int MAX_PHOTOS = 5;
    private static final int MAX_FILE_SIZE_MB = 5;
    private static final int MAX_TOTAL_SIZE_MB = 25;
    private static final long MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    // Підтримувані MIME типи зображень
    private static final List<String> SUPPORTED_IMAGE_TYPES = List.of(
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/webp"
    );

    // Підтримувані розширення файлів
    private static final List<String> SUPPORTED_EXTENSIONS = List.of(
        ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"
    );

    /**
     * Основна валідація ItemPhotoDTO.
     */
    public boolean validate(ItemPhotoDTO photoData) {
        if (photoData == null) {
            logger.warn("ItemPhotoDTO є null");
            return false;
        }

        List<String> errors = new ArrayList<>();

        try {
            // Валідація базових параметрів
            validateBasicParameters(photoData, errors);

            // Валідація списку фотографій
            validatePhotoList(photoData, errors);

            // Валідація загального розміру
            validateTotalSize(photoData, errors);

            // Валідація окремих фотографій
            validateIndividualPhotos(photoData, errors);

            // Якщо є помилки - додаємо їх до DTO
            if (!errors.isEmpty()) {
                photoData.clearErrors();
                errors.forEach(photoData::addError);
                logger.debug("Валідація не пройдена. Помилки: {}", errors);
                return false;
            }

            // Очищуємо помилки при успішній валідації
            photoData.clearErrors();
            logger.debug("Валідація ItemPhotoDTO пройдена успішно");
            return true;

        } catch (Exception e) {
            logger.error("Помилка валідації ItemPhotoDTO: {}", e.getMessage(), e);
            photoData.addError("Помилка валідації: " + e.getMessage());
            return false;
        }
    }

    /**
     * Валідація файлу фотографії перед завантаженням.
     */
    public boolean validatePhotoFile(MultipartFile file, int maxFileSizeMB) {
        if (file == null || file.isEmpty()) {
            logger.warn("Файл є порожнім або null");
            return false;
        }

        try {
            // Перевірка розміру файлу
            long maxSizeBytes = maxFileSizeMB == MAX_FILE_SIZE_MB ? MAX_FILE_SIZE_BYTES : (long) maxFileSizeMB * 1024 * 1024;
            if (file.getSize() > maxSizeBytes) {
                logger.warn("Файл {} перевищує максимальний розмір {}MB: {}MB",
                    file.getOriginalFilename(), maxFileSizeMB, file.getSize() / (1024.0 * 1024.0));
                return false;
            }

            // Перевірка MIME типу
            String contentType = file.getContentType();
            if (contentType == null || !SUPPORTED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
                logger.warn("Непідтримуваний MIME тип файлу {}: {}", file.getOriginalFilename(), contentType);
                return false;
            }

            // Перевірка розширення файлу
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || !hasValidExtension(originalFilename)) {
                logger.warn("Непідтримуване розширення файлу: {}", originalFilename);
                return false;
            }

            logger.debug("Файл {} пройшов валідацію", originalFilename);
            return true;

        } catch (Exception e) {
            logger.error("Помилка валідації файлу {}: {}", file.getOriginalFilename(), e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє, чи можна додати ще одне фото.
     */
    public boolean canAddPhoto(ItemPhotoDTO photoData) {
        if (photoData == null) {
            return false;
        }

        // Перевірка кількості
        if (photoData.getTotalPhotos() >= photoData.getMaxPhotos()) {
            logger.debug("Досягнуто максимальну кількість фото: {}", photoData.getMaxPhotos());
            return false;
        }

        // Перевірка стану завантаження
        if (Boolean.TRUE.equals(photoData.getIsUploading())) {
            logger.debug("Вже йде процес завантаження");
            return false;
        }

        return true;
    }

    /**
     * Валідує готовність підетапу до завершення.
     */
    public boolean validateCompletionReadiness(ItemPhotoDTO photoData) {
        if (photoData == null) {
            logger.warn("ItemPhotoDTO є null при валідації готовності");
            return false;
        }

        try {
            // Якщо фото обов'язкові - має бути хоча б одне
            if (Boolean.TRUE.equals(photoData.getPhotosRequired()) && photoData.getTotalPhotos() == 0) {
                logger.debug("Фото обов'язкові, але не завантажено жодного");
                return false;
            }

            // Не повинно бути процесу завантаження
            if (Boolean.TRUE.equals(photoData.getIsUploading())) {
                logger.debug("Йде процес завантаження, підетап не готовий");
                return false;
            }

            // Не повинно бути помилок
            if (Boolean.TRUE.equals(photoData.getHasErrors())) {
                logger.debug("Є помилки, підетап не готовий");
                return false;
            }

            // Базова валідація даних
            if (!validate(photoData)) {
                logger.debug("Базова валідація не пройдена");
                return false;
            }

            logger.debug("Підетап готовий до завершення");
            return true;

        } catch (Exception e) {
            logger.error("Помилка валідації готовності: {}", e.getMessage(), e);
            return false;
        }
    }

    // === Приватні допоміжні методи ===

    /**
     * Валідація базових параметрів.
     */
    private void validateBasicParameters(ItemPhotoDTO photoData, List<String> errors) {
        if (photoData.getMaxPhotos() == null || photoData.getMaxPhotos() <= 0) {
            errors.add("Некоректне максимальне число фото");
        } else if (photoData.getMaxPhotos() > MAX_PHOTOS) {
            errors.add(String.format("Максимальне число фото не може перевищувати %d", MAX_PHOTOS));
        }

        if (photoData.getMaxFileSizeMB() == null || photoData.getMaxFileSizeMB() <= 0) {
            errors.add("Некоректний максимальний розмір файлу");
        } else if (photoData.getMaxFileSizeMB() > MAX_FILE_SIZE_MB) {
            errors.add(String.format("Максимальний розмір файлу не може перевищувати %dMB", MAX_FILE_SIZE_MB));
        }

        if (photoData.getTotalPhotos() == null || photoData.getTotalPhotos() < 0) {
            errors.add("Некоректна загальна кількість фото");
        }

        if (photoData.getTotalSizeMB() == null || photoData.getTotalSizeMB() < 0) {
            errors.add("Некоректний загальний розмір фото");
        }
    }

    /**
     * Валідація списку фотографій.
     */
    private void validatePhotoList(ItemPhotoDTO photoData, List<String> errors) {
        List<PhotoInfo> photos = photoData.getUploadedPhotos();

        if (photos == null) {
            return; // Порожній список допустимий
        }

        if (photos.size() != photoData.getTotalPhotos()) {
            errors.add("Розбіжність між кількістю фото в списку та загальною кількістю");
        }

        if (photos.size() > photoData.getMaxPhotos()) {
            errors.add(String.format("Кількість фото (%d) перевищує максимум (%d)",
                photos.size(), photoData.getMaxPhotos()));
        }
    }

    /**
     * Валідація загального розміру фото.
     */
    private void validateTotalSize(ItemPhotoDTO photoData, List<String> errors) {
        if (photoData.getTotalSizeMB() > MAX_TOTAL_SIZE_MB) {
            errors.add(String.format("Загальний розмір фото (%.1fMB) перевищує максимум (%dMB)",
                photoData.getTotalSizeMB(), MAX_TOTAL_SIZE_MB));
        }
    }

    /**
     * Валідація окремих фотографій.
     */
    private void validateIndividualPhotos(ItemPhotoDTO photoData, List<String> errors) {
        List<PhotoInfo> photos = photoData.getUploadedPhotos();

        if (photos == null || photos.isEmpty()) {
            return;
        }

        for (int i = 0; i < photos.size(); i++) {
            PhotoInfo photo = photos.get(i);
            String prefix = String.format("Фото #%d: ", i + 1);

            validateSinglePhoto(photo, prefix, errors, photoData.getMaxFileSizeMB());
        }
    }

    /**
     * Валідація окремого фото.
     */
    private void validateSinglePhoto(PhotoInfo photo, String prefix, List<String> errors, int maxFileSizeMB) {
        if (photo == null) {
            errors.add(prefix + "Дані фото відсутні");
            return;
        }

        // Перевірка ID
        if (photo.getId() == null || photo.getId().trim().isEmpty()) {
            errors.add(prefix + "Відсутній ID фото");
        }

        // Перевірка імені файлу
        if (photo.getOriginalFileName() == null || photo.getOriginalFileName().trim().isEmpty()) {
            errors.add(prefix + "Відсутня назва файлу");
        }

        // Перевірка URL
        if (photo.getFileUrl() == null || photo.getFileUrl().trim().isEmpty()) {
            errors.add(prefix + "Відсутній URL файлу");
        }

        // Перевірка розміру файлу
        if (photo.getFileSizeMB() != null && photo.getFileSizeMB() > maxFileSizeMB) {
            errors.add(String.format("%sРозмір файлу (%.1fMB) перевищує максимум (%dMB)",
                prefix, photo.getFileSizeMB(), maxFileSizeMB));
        }

        // Перевірка MIME типу
        if (photo.getMimeType() != null && !SUPPORTED_IMAGE_TYPES.contains(photo.getMimeType().toLowerCase())) {
            errors.add(prefix + "Непідтримуваний тип файлу: " + photo.getMimeType());
        }

        // Перевірка статусу
        if (photo.getStatus() == null) {
            errors.add(prefix + "Відсутній статус фото");
        }

        // Перевірка розмірів зображення (якщо вказані)
        if (photo.getWidth() != null && photo.getWidth() <= 0) {
            errors.add(prefix + "Некоректна ширина зображення");
        }

        if (photo.getHeight() != null && photo.getHeight() <= 0) {
            errors.add(prefix + "Некоректна висота зображення");
        }
    }

    /**
     * Перевіряє, чи має файл підтримуване розширення.
     */
    private boolean hasValidExtension(String filename) {
        if (filename == null || filename.trim().isEmpty()) {
            return false;
        }

        String lowerFilename = filename.toLowerCase();
        return SUPPORTED_EXTENSIONS.stream()
            .anyMatch(lowerFilename::endsWith);
    }
}
