package com.aksi.domain.order.statemachine.stage2.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для підетапу 2.5 "Фотодокументація".
 *
 * Містить дані для роботи з фотографіями предмета:
 * - Список завантажених фото
 * - Можливість додавання/видалення фото
 * - Попередній перегляд
 * - Обмеження розміру та кількості
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO для підетапу фотодокументації предмета")
public class ItemPhotoDTO {

    // === Фотографії ===
    @Schema(description = "Список завантажених фотографій")
    @Builder.Default
    private List<PhotoInfo> uploadedPhotos = new ArrayList<>();

    @Schema(description = "Загальна кількість фотографій")
    @Builder.Default
    private Integer totalPhotos = 0;

    @Schema(description = "Максимальна кількість фотографій (за замовчуванням 5)")
    @Builder.Default
    private Integer maxPhotos = 5;

    @Schema(description = "Максимальний розмір одного файлу у MB (за замовчуванням 5MB)")
    @Builder.Default
    private Integer maxFileSizeMB = 5;

    // === Стан завантаження ===
    @Schema(description = "Чи йде процес завантаження")
    @Builder.Default
    private Boolean isUploading = false;

    @Schema(description = "Прогрес завантаження (0-100%)")
    @Builder.Default
    private Integer uploadProgress = 0;

    @Schema(description = "Файл який зараз завантажується")
    private String currentUploadingFile;

    // === Налаштування інтерфейсу ===
    @Schema(description = "Показувати прев'ю фотографій")
    @Builder.Default
    private Boolean showPreviews = true;

    @Schema(description = "Показувати кнопку камери (для мобільних пристроїв)")
    @Builder.Default
    private Boolean showCameraButton = true;

    @Schema(description = "Показувати кнопку завантаження з галереї")
    @Builder.Default
    private Boolean showUploadButton = true;

    @Schema(description = "Можливість стиснення зображень")
    @Builder.Default
    private Boolean compressionEnabled = true;

    @Schema(description = "Якість стиснення (1-100%)")
    @Builder.Default
    private Integer compressionQuality = 80;

    // === Стан UI ===
    @Schema(description = "Чи завантажуються дані")
    @Builder.Default
    private Boolean isLoading = false;

    @Schema(description = "Чи є помилки")
    @Builder.Default
    private Boolean hasErrors = false;

    @Schema(description = "Повідомлення про помилку")
    private String errorMessage;

    @Schema(description = "Валідаційні повідомлення")
    @Builder.Default
    private List<String> validationMessages = new ArrayList<>();

    // === Статистика ===
    @Schema(description = "Загальний розмір всіх фотографій у MB")
    @Builder.Default
    private Double totalSizeMB = 0.0;

    @Schema(description = "Чи завершено фотодокументацію")
    @Builder.Default
    private Boolean isCompleted = false;

    @Schema(description = "Чи фотографії обов'язкові для цього предмета")
    @Builder.Default
    private Boolean photosRequired = false;

    // === Вкладений клас для інформації про фото ===
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Інформація про окрему фотографію")
    public static class PhotoInfo {

        @Schema(description = "Унікальний ідентифікатор фото")
        private String id;

        @Schema(description = "Оригінальна назва файлу")
        private String originalFileName;

        @Schema(description = "URL для перегляду фото")
        private String fileUrl;

        @Schema(description = "URL для мініатюри")
        private String thumbnailUrl;

        @Schema(description = "Розмір файлу у байтах")
        private Long fileSizeBytes;

        @Schema(description = "Розмір файлу у MB")
        private Double fileSizeMB;

        @Schema(description = "MIME тип файлу")
        private String mimeType;

        @Schema(description = "Ширина зображення у пікселях")
        private Integer width;

        @Schema(description = "Висота зображення у пікселях")
        private Integer height;

        @Schema(description = "Опис або анотація до фото")
        private String description;

        @Schema(description = "Дата завантаження")
        private LocalDateTime uploadedAt;

        @Schema(description = "Статус обробки фото")
        @Builder.Default
        private PhotoStatus status = PhotoStatus.UPLOADED;

        /**
         * Формує рядок з розміром файлу для відображення.
         */
        public String getFileSizeDisplay() {
            if (fileSizeMB != null && fileSizeMB > 0) {
                return String.format("%.1f MB", fileSizeMB);
            } else if (fileSizeBytes != null) {
                if (fileSizeBytes < 1024) {
                    return fileSizeBytes + " B";
                } else if (fileSizeBytes < 1024 * 1024) {
                    return String.format("%.1f KB", fileSizeBytes / 1024.0);
                } else {
                    return String.format("%.1f MB", fileSizeBytes / (1024.0 * 1024.0));
                }
            }
            return "N/A";
        }

        /**
         * Формує рядок з розмірами зображення для відображення.
         */
        public String getDimensionsDisplay() {
            if (width != null && height != null) {
                return width + " × " + height + " px";
            }
            return "N/A";
        }

        /**
         * Перевіряє, чи файл є зображенням.
         */
        public boolean isImage() {
            return mimeType != null && mimeType.startsWith("image/");
        }

        /**
         * Перевіряє, чи фото успішно завантажене.
         */
        public boolean isUploaded() {
            return status == PhotoStatus.UPLOADED;
        }
    }

    // === Enum для статусу фото ===
    @Schema(description = "Статус обробки фотографії")
    public enum PhotoStatus {
        UPLOADING,      // Завантажується
        UPLOADED,       // Завантажено
        PROCESSING,     // Обробляється
        COMPRESSED,     // Стиснено
        ERROR,          // Помилка
        DELETED         // Видалено
    }

    // === Допоміжні методи ===

    /**
     * Перевіряє, чи можна додати ще фотографії.
     */
    public boolean canAddMorePhotos() {
        return totalPhotos < maxPhotos && !isUploading;
    }

    /**
     * Перевіряє, чи є фотографії.
     */
    public boolean hasPhotos() {
        return totalPhotos > 0 && !uploadedPhotos.isEmpty();
    }

    /**
     * Отримує кількість доступних слотів для нових фото.
     */
    public int getAvailableSlots() {
        return Math.max(0, maxPhotos - totalPhotos);
    }

    /**
     * Формує текст для відображення прогресу.
     */
    public String getProgressText() {
        return String.format("%d / %d фото", totalPhotos, maxPhotos);
    }

    /**
     * Перевіряє, чи розмір загальних фото не перевищує ліміт.
     */
    public boolean isTotalSizeValid() {
        // Максимум 25MB для всіх фото разом
        return totalSizeMB <= (maxFileSizeMB * maxPhotos);
    }

    /**
     * Перевіряє, чи підетап готовий до завершення.
     */
    public boolean isReadyToComplete() {
        // Якщо фото обов'язкові - має бути хоча б одне
        if (photosRequired && totalPhotos == 0) {
            return false;
        }

        // Не повинно бути фото в процесі завантаження або помилок
        return !isUploading && !hasErrors;
    }

    /**
     * Отримує відсоток прогресу заповнення підетапу (0-100).
     */
    public int getCompletionPercentage() {
        if (photosRequired) {
            // Якщо фото обов'язкові - прогрес залежить від кількості
            return totalPhotos > 0 ? 100 : 0;
        } else {
            // Якщо фото необов'язкові - завжди 100% (можна без фото)
            return 100;
        }
    }

    /**
     * Додає нове фото до списку.
     */
    public void addPhoto(PhotoInfo photo) {
        if (uploadedPhotos == null) {
            uploadedPhotos = new ArrayList<>();
        }
        uploadedPhotos.add(photo);
        updateTotalPhotos();
        updateTotalSize();
    }

    /**
     * Видаляє фото зі списку.
     */
    public void removePhoto(String photoId) {
        if (uploadedPhotos != null) {
            uploadedPhotos.removeIf(photo -> photoId.equals(photo.getId()));
            updateTotalPhotos();
            updateTotalSize();
        }
    }

    /**
     * Оновлює загальну кількість фото.
     */
    public void updateTotalPhotos() {
        this.totalPhotos = uploadedPhotos != null ? uploadedPhotos.size() : 0;
    }

    /**
     * Оновлює загальний розмір фото.
     */
    public void updateTotalSize() {
        if (uploadedPhotos != null) {
            this.totalSizeMB = uploadedPhotos.stream()
                .mapToDouble(photo -> {
                    Double size = photo.getFileSizeMB();
                    return size != null ? size : 0.0;
                })
                .sum();
        } else {
            this.totalSizeMB = 0.0;
        }
    }

    /**
     * Очищує всі помилки.
     */
    public void clearErrors() {
        this.hasErrors = false;
        this.errorMessage = null;
        if (validationMessages != null) {
            validationMessages.clear();
        }
    }

    /**
     * Додає повідомлення про помилку.
     */
    public void addError(String message) {
        this.hasErrors = true;
        if (this.errorMessage == null) {
            this.errorMessage = message;
        }
        if (validationMessages == null) {
            validationMessages = new ArrayList<>();
        }
        if (!validationMessages.contains(message)) {
            validationMessages.add(message);
        }
    }

    /**
     * Встановлює стан завантаження.
     */
    public void setUploadingState(boolean uploading, String fileName, int progress) {
        this.isUploading = uploading;
        this.currentUploadingFile = fileName;
        this.uploadProgress = Math.max(0, Math.min(100, progress));
    }

    /**
     * Створює підсумок фотодокументації для відображення.
     */
    public String getPhotoSummary() {
        if (totalPhotos == 0) {
            return "Фото не додані";
        }

        StringBuilder summary = new StringBuilder();
        summary.append(String.format("%d фото", totalPhotos));

        if (totalSizeMB > 0) {
            summary.append(String.format(" (%.1f MB)", totalSizeMB));
        }

        return summary.toString();
    }
}
