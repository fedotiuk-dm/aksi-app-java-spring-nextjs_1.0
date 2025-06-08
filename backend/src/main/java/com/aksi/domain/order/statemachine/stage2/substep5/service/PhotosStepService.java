package com.aksi.domain.order.statemachine.stage2.substep5.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.domain.order.statemachine.stage2.substep5.dto.PhotoDocumentationDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.dto.PhotoMetadataDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.dto.PhotoMetadataDTO.PhotoProcessingStatus;
import com.aksi.service.file.FileStorageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для підетапу 2.5: Фотодокументація.
 *
 * Принцип "один файл = одна відповідальність":
 * Координує роботу з фотографіями предмета через готові доменні сервіси.
 *
 * Використовує:
 * - FileStorageService (готовий доменний сервіс)
 * - PhotoDocumentationDTO (бізнес-логіка фото)
 * - PhotoMetadataDTO (метадані фото)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PhotosStepService {

    private final FileStorageService fileStorageService; // Готовий доменний сервіс

    /**
     * Завантажити фотографію для предмета
     */
    public PhotoDocumentationDTO uploadPhoto(String wizardId, MultipartFile file, PhotoDocumentationDTO currentPhotos) {
        log.debug("Завантаження фото для wizard: {} файл: {}", wizardId, file.getOriginalFilename());

        try {
            // Валідація файлу через бізнес-логіку DTO
            if (!validatePhoto(file, currentPhotos)) {
                log.warn("Валідація фото не пройшла для wizard: {}", wizardId);
                return currentPhotos.toBuilder()
                    .isValid(false)
                    .build();
            }

            // Генеруємо унікальний ID для фото
            String photoId = generatePhotoId();

            // Зберігаємо файл через готовий сервіс
            String storedFileName = fileStorageService.storeFile(file);
            log.debug("Файл збережено: {}", storedFileName);

            // Отримуємо URL для файлу
            String fullSizeUrl = fileStorageService.getFileUrl(storedFileName);

            // Створюємо метадані фото
            PhotoMetadataDTO photoMetadata = PhotoMetadataDTO.builder()
                .photoId(photoId)
                .fileName(file.getOriginalFilename())
                .contentType(file.getContentType())
                .fileSize(file.getSize())
                .fullSizeUrl(fullSizeUrl)
                .uploadedAt(LocalDateTime.now())
                .displayOrder(currentPhotos.getPhotosCount())
                .processingStatus(PhotoProcessingStatus.PROCESSED) // Поки без окремої генерації мініатюр
                .build();

            // TODO: В майбутньому можна додати генерацію мініатюр через окремий сервіс
            log.debug("Фото оброблено без генерації мініатюри");

            // Додаємо фото до колекції через бізнес-логіку DTO
            PhotoDocumentationDTO updatedPhotos = currentPhotos.addPhoto(photoMetadata);

            log.info("Фото успішно завантажено для wizard: {} ID: {}", wizardId, photoId);
            return updatedPhotos;

        } catch (Exception e) {
            log.error("Помилка завантаження фото для wizard: {}", wizardId, e);
            return currentPhotos.toBuilder()
                .isValid(false)
                .validationErrors(java.util.List.of("Помилка завантаження фото: " + e.getMessage()))
                .build();
        }
    }

    /**
     * Видалити фотографію
     */
    public PhotoDocumentationDTO deletePhoto(String wizardId, String photoId, PhotoDocumentationDTO currentPhotos) {
        log.debug("Видалення фото {} для wizard: {}", photoId, wizardId);

        try {
            // Знаходимо фото через бізнес-логіку DTO
            PhotoMetadataDTO photoToDelete = currentPhotos.findPhotoById(photoId);
            if (photoToDelete == null) {
                log.warn("Фото з ID {} не знайдено для wizard: {}", photoId, wizardId);
                return currentPhotos;
            }

            // Видаляємо файли через готовий сервіс
            // Витягуємо ім'я файлу з URL (зберігається як /files/filename)
            try {
                String fullSizeUrl = photoToDelete.getFullSizeUrl();
                if (fullSizeUrl != null && fullSizeUrl.startsWith("/files/")) {
                    String fileName = fullSizeUrl.substring("/files/".length());
                    boolean deleted = fileStorageService.deleteFile(fileName);
                    if (!deleted) {
                        log.warn("Не вдалося видалити файл {} для фото {}", fileName, photoId);
                    }
                }

                String thumbnailUrl = photoToDelete.getThumbnailUrl();
                if (thumbnailUrl != null && thumbnailUrl.startsWith("/files/")) {
                    String thumbnailFileName = thumbnailUrl.substring("/files/".length());
                    fileStorageService.deleteFile(thumbnailFileName);
                }
            } catch (Exception e) {
                log.warn("Не вдалося видалити файли для фото {}: {}", photoId, e.getMessage());
                // Продовжуємо видалення з метаданих
            }

            // Видаляємо з колекції через бізнес-логіку DTO
            PhotoDocumentationDTO updatedPhotos = currentPhotos.removePhoto(photoId);

            log.info("Фото {} успішно видалено для wizard: {}", photoId, wizardId);
            return updatedPhotos;

        } catch (Exception e) {
            log.error("Помилка видалення фото {} для wizard: {}", photoId, wizardId, e);
            return currentPhotos;
        }
    }

    /**
     * Пропустити фотодокументацію з причиною
     */
    public PhotoDocumentationDTO skipPhotos(String wizardId, String reason, PhotoDocumentationDTO currentPhotos) {
        log.debug("Пропуск фотодокументації для wizard: {} причина: {}", wizardId, reason);

        // Використовуємо бізнес-логіку DTO для пропуску
        PhotoDocumentationDTO updatedPhotos = currentPhotos.skipWithReason(reason);

        log.info("Фотодокументація пропущена для wizard: {} причина: {}", wizardId, reason);
        return updatedPhotos;
    }

    /**
     * Скасувати пропуск фотодокументації
     */
    public PhotoDocumentationDTO cancelSkip(String wizardId, PhotoDocumentationDTO currentPhotos) {
        log.debug("Скасування пропуску фотодокументації для wizard: {}", wizardId);

        // Використовуємо бізнес-логіку DTO для скасування пропуску
        PhotoDocumentationDTO updatedPhotos = currentPhotos.cancelSkip();

        log.info("Пропуск фотодокументації скасовано для wizard: {}", wizardId);
        return updatedPhotos;
    }

    /**
     * Встановити фото як головне
     */
    public PhotoDocumentationDTO setPrimaryPhoto(String wizardId, String photoId, PhotoDocumentationDTO currentPhotos) {
        log.debug("Встановлення головного фото {} для wizard: {}", photoId, wizardId);

        // Скидаємо статус головного з усіх фото
        currentPhotos.getPhotos().forEach(photo -> photo.unsetAsPrimary());

        // Встановлюємо нове головне фото
        PhotoMetadataDTO primaryPhoto = currentPhotos.findPhotoById(photoId);
        if (primaryPhoto != null) {
            primaryPhoto.setAsPrimary();
            log.info("Фото {} встановлено як головне для wizard: {}", photoId, wizardId);
        } else {
            log.warn("Фото з ID {} не знайдено для wizard: {}", photoId, wizardId);
        }

        return currentPhotos;
    }

    /**
     * Валідація перед завершенням кроку
     */
    public Boolean validateStep(PhotoDocumentationDTO photos) {
        // Використовуємо готову бізнес-логіку DTO
        return photos.isComplete();
    }

    // ===== ПРИВАТНІ МЕТОДИ =====

    /**
     * Валідація фотографії
     */
    private Boolean validatePhoto(MultipartFile file, PhotoDocumentationDTO currentPhotos) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        // Перевірка ліміту фото через бізнес-логіку DTO
        if (!currentPhotos.canAddMorePhotos()) {
            return false;
        }

        // Перевірка розміру файлу через бізнес-логіку DTO
        if (!currentPhotos.isValidFileSize(file.getSize())) {
            return false;
        }

        // Перевірка формату файлу через бізнес-логіку DTO
        if (!currentPhotos.isSupportedFormat(file.getContentType())) {
            return false;
        }

        return true;
    }

    /**
     * Генерація унікального ID для фотографії
     */
    private String generatePhotoId() {
        return "photo_" + UUID.randomUUID().toString().replace("-", "");
    }
}
