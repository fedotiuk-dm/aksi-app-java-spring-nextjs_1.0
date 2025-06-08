package com.aksi.domain.order.statemachine.stage2.substep5.dto;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для фотодокументації предмета (Підетап 2.5).
 *
 * Принцип "один файл = одна відповідальність":
 * Містить тільки дані та валідацію для управління фотографіями предмета.
 *
 * Бізнес-правила фотодокументації:
 * - Максимум 5 фото на предмет
 * - Розмір файлу до 5MB
 * - Підтримка форматів: JPEG, PNG, WebP
 * - Можливість пропуску кроку з причиною
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class PhotoDocumentationDTO {

    /**
     * Список завантажених фотографій
     */
    @Builder.Default
    private List<PhotoMetadataDTO> photos = new ArrayList<>();

    /**
     * Чи пропущений крок фотодокументації
     */
    @Builder.Default
    private Boolean photosSkipped = false;

    /**
     * Причина пропуску фотодокументації
     */
    @Size(max = 200, message = "Причина пропуску не може перевищувати 200 символів")
    private String skipReason;

    /**
     * Максимальна кількість фото на предмет
     */
    @Min(value = 1, message = "Мінімальна кількість фото - 1")
    @Max(value = 10, message = "Максимальна кількість фото - 10")
    @Builder.Default
    private Integer maxPhotos = 5;

    /**
     * Максимальний розмір файлу в байтах (5MB)
     */
    @Builder.Default
    private Long maxFileSize = 5 * 1024 * 1024L;

    /**
     * Підтримувані формати файлів
     */
    @Builder.Default
    private List<String> supportedFormats = List.of("image/jpeg", "image/jpg", "image/png", "image/webp");

    /**
     * Чи валідні дані фотодокументації
     */
    @Builder.Default
    private Boolean isValid = true;

    /**
     * Список помилок валідації
     */
    @Builder.Default
    private List<String> validationErrors = new ArrayList<>();

    /**
     * Попередження користувачу
     */
    @Builder.Default
    private List<String> warnings = new ArrayList<>();

    // ===== МЕТОДИ БІЗНЕС-ЛОГІКИ =====

    /**
     * Чи є завантажені фотографії
     */
    public Boolean hasPhotos() {
        return photos != null && !photos.isEmpty();
    }

    /**
     * Кількість завантажених фото
     */
    public Integer getPhotosCount() {
        return photos != null ? photos.size() : 0;
    }

    /**
     * Чи можна додати ще фото
     */
    public Boolean canAddMorePhotos() {
        return getPhotosCount() < maxPhotos;
    }

    /**
     * Скільки ще фото можна додати
     */
    public Integer getRemainingPhotoSlots() {
        return Math.max(0, maxPhotos - getPhotosCount());
    }

    /**
     * Чи досягнуто ліміт фотографій
     */
    public Boolean isPhotoLimitReached() {
        return getPhotosCount() >= maxPhotos;
    }

    /**
     * Валідація фотодокументації
     */
    public Boolean isComplete() {
        // Крок вважається завершеним якщо:
        // 1. Є хоча б одне фото, АБО
        // 2. Фото пропущені з вказанням причини
        return hasPhotos() || (photosSkipped != null && photosSkipped &&
                              skipReason != null && !skipReason.trim().isEmpty());
    }

    /**
     * Чи є крок обов'язковим
     */
    public Boolean isRequired() {
        // Фотодокументація не є обов'язковою
        return false;
    }

    /**
     * Загальний розмір всіх фото в байтах
     */
    public Long getTotalSize() {
        if (photos == null) return 0L;
        return photos.stream()
                .mapToLong(photo -> photo.getFileSize() != null ? photo.getFileSize() : 0L)
                .sum();
    }

    /**
     * Додати фотографію до списку
     */
    public PhotoDocumentationDTO addPhoto(PhotoMetadataDTO photo) {
        if (photo == null) return this;

        if (photos == null) {
            photos = new ArrayList<>();
        }

        if (canAddMorePhotos()) {
            photos.add(photo);
            // Скидаємо прапор пропуску якщо додали фото
            photosSkipped = false;
            skipReason = null;
        }

        return this;
    }

    /**
     * Видалити фотографію за ID
     */
    public PhotoDocumentationDTO removePhoto(String photoId) {
        if (photos != null && photoId != null) {
            photos.removeIf(photo -> photoId.equals(photo.getPhotoId()));
        }
        return this;
    }

    /**
     * Знайти фотографію за ID
     */
    public PhotoMetadataDTO findPhotoById(String photoId) {
        if (photos == null || photoId == null) return null;
        return photos.stream()
                .filter(photo -> photoId.equals(photo.getPhotoId()))
                .findFirst()
                .orElse(null);
    }

    /**
     * Пропустити фотодокументацію з причиною
     */
    public PhotoDocumentationDTO skipWithReason(String reason) {
        this.photosSkipped = true;
        this.skipReason = reason;
        // Очищуємо фото якщо пропускаємо крок
        if (this.photos != null) {
            this.photos.clear();
        }
        return this;
    }

    /**
     * Скасувати пропуск фотодокументації
     */
    public PhotoDocumentationDTO cancelSkip() {
        this.photosSkipped = false;
        this.skipReason = null;
        return this;
    }

    /**
     * Отримати статус кроку як текст
     */
    public String getStatusText() {
        if (photosSkipped != null && photosSkipped) {
            return "Пропущено: " + (skipReason != null ? skipReason : "без причини");
        }

        int count = getPhotosCount();
        if (count == 0) {
            return "Фото не додані";
        } else if (count == 1) {
            return "Додано 1 фото";
        } else {
            return String.format("Додано %d фото", count);
        }
    }

    /**
     * Отримати рекомендації для користувача
     */
    public List<String> getRecommendations() {
        List<String> recommendations = new ArrayList<>();

        if (!hasPhotos() && !photosSkipped) {
            recommendations.add("Додайте фотографії для кращого документування стану предмета");
        }

        if (hasPhotos() && getPhotosCount() < 3) {
            recommendations.add("Рекомендується додати ще кілька фото з різних ракурсів");
        }

        return recommendations;
    }

    /**
     * Перевірити чи підтримується формат файлу
     */
    public Boolean isSupportedFormat(String contentType) {
        return contentType != null && supportedFormats.contains(contentType.toLowerCase());
    }

    /**
     * Перевірити чи допустимий розмір файлу
     */
    public Boolean isValidFileSize(Long fileSize) {
        return fileSize != null && fileSize > 0 && fileSize <= maxFileSize;
    }
}
