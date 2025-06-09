package com.aksi.domain.order.statemachine.stage2.substep5.validator;

import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

/**
 * Валідатор файлів фотографій для підетапу 2.5.
 * Перевіряє розмір, тип та інші характеристики файлів.
 */
@Component
public class PhotoFileValidator {

    private static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/webp"
    );
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
        ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"
    );

    /**
     * Валідація файлу фотографії.
     */
    public ValidationResult validatePhotoFile(MultipartFile file) {
        if (file == null) {
            return ValidationResult.failure("Файл не може бути порожнім");
        }

        ValidationResult result = new ValidationResult();

        // Перевірка розміру файлу
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            result.addError("Розмір файлу перевищує максимально дозволений (5MB)");
        }

        if (file.isEmpty()) {
            result.addError("Файл порожній");
        }

        // Перевірка типу контенту
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            result.addError("Непідтримуваний тип файлу. Дозволені: JPEG, PNG, GIF, BMP, WebP");
        }

        // Перевірка розширення файлу
        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null) {
            String extension = getFileExtension(originalFilename);
            if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
                result.addError("Непідтримуване розширення файлу: " + extension);
            }
        } else {
            result.addError("Невідоме ім'я файлу");
        }

        // Попередження про великий розмір
        if (file.getSize() > 2 * 1024 * 1024) { // 2MB
            result.addWarning("Файл великого розміру буде автоматично стиснутий");
        }

        return result;
    }

    /**
     * Перевірка кількості файлів.
     */
    public ValidationResult validatePhotosCount(int currentCount, int maxAllowed) {
        if (currentCount >= maxAllowed) {
            return ValidationResult.failure(
                String.format("Досягнуто максимальної кількості фото (%d)", maxAllowed)
            );
        }

        ValidationResult result = new ValidationResult();

        if (currentCount > maxAllowed * 0.8) { // 80% від максимуму
            result.addWarning(
                String.format("Залишилось місця для %d фото", maxAllowed - currentCount)
            );
        }

        return result;
    }

    /**
     * Отримання розширення файлу.
     */
    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "";
        }

        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "";
        }

        return filename.substring(lastDotIndex);
    }

    /**
     * Перевірка чи потрібно стиснення.
     */
    public boolean needsCompression(MultipartFile file) {
        return file != null && file.getSize() > 1024 * 1024; // 1MB
    }

    /**
     * Отримання максимального розміру файлу в байтах.
     */
    public long getMaxFileSizeBytes() {
        return MAX_FILE_SIZE_BYTES;
    }

    /**
     * Отримання дозволених типів контенту.
     */
    public Set<String> getAllowedContentTypes() {
        return Set.copyOf(ALLOWED_CONTENT_TYPES);
    }
}
