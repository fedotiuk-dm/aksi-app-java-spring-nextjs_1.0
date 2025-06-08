package com.aksi.domain.order.statemachine.stage2.substep5.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для метаданих фотографії предмета.
 *
 * Принцип "один файл = одна відповідальність":
 * Містить тільки метадані однієї фотографії та методи для роботи з нею.
 *
 * Використовується в PhotoDocumentationDTO для управління колекцією фото.
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class PhotoMetadataDTO {

    /**
     * Унікальний ідентифікатор фотографії
     */
    @NotBlank(message = "ID фотографії не може бути порожнім")
    private String photoId;

    /**
     * Оригінальне ім'я файлу
     */
    @NotBlank(message = "Ім'я файлу не може бути порожнім")
    @Size(max = 255, message = "Ім'я файлу не може перевищувати 255 символів")
    private String fileName;

    /**
     * MIME тип файлу
     */
    @NotBlank(message = "Тип контенту не може бути порожнім")
    private String contentType;

    /**
     * Розмір файлу в байтах
     */
    @NotNull(message = "Розмір файлу повинен бути вказаний")
    @Positive(message = "Розмір файлу повинен бути додатнім")
    private Long fileSize;

    /**
     * URL мініатюри фотографії
     */
    private String thumbnailUrl;

    /**
     * URL повнорозмірної фотографії
     */
    private String fullSizeUrl;

    /**
     * Час завантаження фотографії
     */
    @Builder.Default
    private LocalDateTime uploadedAt = LocalDateTime.now();

    /**
     * Порядковий номер фотографії (для сортування)
     */
    @Builder.Default
    private Integer displayOrder = 0;

    /**
     * Опис фотографії (опціонально)
     */
    @Size(max = 500, message = "Опис фотографії не може перевищувати 500 символів")
    private String description;

    /**
     * Чи є фотографія головною (обкладинкою)
     */
    @Builder.Default
    private Boolean isPrimary = false;

    /**
     * Статус обробки фотографії
     */
    @Builder.Default
    private PhotoProcessingStatus processingStatus = PhotoProcessingStatus.UPLOADED;

    // ===== МЕТОДИ БІЗНЕС-ЛОГІКИ =====

    /**
     * Отримати розмір файлу в мегабайтах
     */
    public Double getFileSizeInMB() {
        if (fileSize == null) return 0.0;
        return fileSize / (1024.0 * 1024.0);
    }

    /**
     * Отримати форматований розмір файлу
     */
    public String getFormattedFileSize() {
        if (fileSize == null) return "0 B";

        if (fileSize < 1024) {
            return fileSize + " B";
        } else if (fileSize < 1024 * 1024) {
            return String.format("%.1f KB", fileSize / 1024.0);
        } else {
            return String.format("%.1f MB", fileSize / (1024.0 * 1024.0));
        }
    }

    /**
     * Отримати розширення файлу
     */
    public String getFileExtension() {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
    }

    /**
     * Чи є фотографія зображенням
     */
    public Boolean isImageFile() {
        if (contentType == null) return false;
        return contentType.startsWith("image/");
    }

    /**
     * Отримати короткий опис для UI
     */
    public String getDisplayName() {
        if (description != null && !description.trim().isEmpty()) {
            return description;
        }

        if (isPrimary != null && isPrimary) {
            return "Головне фото - " + fileName;
        }

        return fileName;
    }

    /**
     * Чи завершена обробка фотографії
     */
    public Boolean isProcessed() {
        return processingStatus == PhotoProcessingStatus.PROCESSED;
    }

    /**
     * Чи є помилка в обробці фотографії
     */
    public Boolean hasProcessingError() {
        return processingStatus == PhotoProcessingStatus.ERROR;
    }

    /**
     * Встановити як головну фотографію
     */
    public PhotoMetadataDTO setAsPrimary() {
        this.isPrimary = true;
        return this;
    }

    /**
     * Зняти статус головної фотографії
     */
    public PhotoMetadataDTO unsetAsPrimary() {
        this.isPrimary = false;
        return this;
    }

    /**
     * Встановити порядок відображення
     */
    public PhotoMetadataDTO setDisplayOrder(Integer order) {
        this.displayOrder = order;
        return this;
    }

    /**
     * Статус обробки фотографії
     */
    public enum PhotoProcessingStatus {
        /**
         * Завантажено, очікує обробки
         */
        UPLOADED,

        /**
         * В процесі обробки
         */
        PROCESSING,

        /**
         * Обробка завершена успішно
         */
        PROCESSED,

        /**
         * Помилка при обробці
         */
        ERROR
    }
}
