package com.aksi.service.file;

import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.exception.FileValidationException;

import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для валідації файлів перед збереженням.
 */
@Service
@Slf4j
public class FileValidationService {

    // Максимальний розмір файлу - 5MB
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    // Дозволені MIME типи для фото
    private static final Set<String> ALLOWED_PHOTO_MIME_TYPES = Set.of(
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    );

    // Дозволені розширення файлів
    private static final Set<String> ALLOWED_PHOTO_EXTENSIONS = Set.of(
        "jpg", "jpeg", "png", "webp"
    );

    /**
     * Валідує файл фотографії.
     *
     * @param file файл для валідації
     * @throws FileValidationException якщо файл не пройшов валідацію
     */
    public void validatePhotoFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new FileValidationException("Файл не може бути пустим");
        }

        // Перевірка розміру файлу
        if (file.getSize() > MAX_FILE_SIZE) {
            long fileSizeMB = file.getSize() / (1024 * 1024);
            throw new FileValidationException(
                String.format("Розмір файлу %dMB перевищує максимально дозволений %dMB",
                    fileSizeMB, MAX_FILE_SIZE / (1024 * 1024)));
        }

        // Перевірка MIME типу
        String mimeType = file.getContentType();
        if (mimeType == null || !ALLOWED_PHOTO_MIME_TYPES.contains(mimeType.toLowerCase())) {
            throw new FileValidationException(
                String.format("Тип файлу %s не підтримується. Дозволені формати: %s",
                    mimeType, String.join(", ", ALLOWED_PHOTO_MIME_TYPES)));
        }

        // Перевірка розширення файлу
        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null) {
            String extension = getFileExtension(originalFilename).toLowerCase();
            if (!ALLOWED_PHOTO_EXTENSIONS.contains(extension)) {
                throw new FileValidationException(
                    String.format("Розширення файлу .%s не підтримується. Дозволені розширення: %s",
                        extension, String.join(", ", ALLOWED_PHOTO_EXTENSIONS)));
            }
        }

        log.debug("Файл {} успішно пройшов валідацію", originalFilename);
    }

    /**
     * Отримує розширення файлу з назви.
     *
     * @param filename назва файлу
     * @return розширення файлу без крапки
     */
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex > 0 && lastDotIndex < filename.length() - 1) {
            return filename.substring(lastDotIndex + 1);
        }
        return "";
    }

    /**
     * Перевіряє кількість фото для предмета.
     *
     * @param currentPhotoCount поточна кількість фото
     * @param maxPhotosPerItem максимальна кількість фото на предмет
     * @throws FileValidationException якщо перевищено ліміт
     */
    public void validatePhotoCount(int currentPhotoCount, int maxPhotosPerItem) {
        if (currentPhotoCount >= maxPhotosPerItem) {
            throw new FileValidationException(
                String.format("Перевищено максимальну кількість фото (%d) для предмета", maxPhotosPerItem));
        }
    }
}
