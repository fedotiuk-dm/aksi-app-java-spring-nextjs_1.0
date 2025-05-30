package com.aksi.ui.wizard.step2.substeps.photo_documentation.domain;

import java.util.List;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * Domain Model для стану фотодокументації предмета.
 * Відповідає за бізнес-логіку управління завантаженими фото та валідацію.
 */
@Data
@Builder
@Slf4j
public class PhotoDocumentationState {

    // Фото інформація
    private final List<PhotoInfo> uploadedPhotos;
    private final int maxPhotosAllowed;
    private final long maxFileSizeBytes;

    // Стан валідності
    private final boolean isValid;
    private final List<String> validationMessages;

    // Стан UI
    private final boolean canUploadMore;
    private final boolean canContinueToNext;
    private final boolean canNavigateBack;
    private final boolean isLoading;

    // Форматовані дані для відображення
    private final String photoCountText;
    private final String statusMessage;
    private final String nextButtonText;

    // Константи бізнес-правил
    public static final int DEFAULT_MAX_PHOTOS = 5;
    public static final int DEFAULT_MAX_FILE_SIZE_MB = 5;
    public static final long DEFAULT_MAX_FILE_SIZE_BYTES = DEFAULT_MAX_FILE_SIZE_MB * 1024L * 1024L;

    /**
     * Створює початковий стан фотодокументації.
     */
    public static PhotoDocumentationState createInitial() {
        log.debug("Створюється початковий стан фотодокументації");

        return PhotoDocumentationState.builder()
                .uploadedPhotos(List.of())
                .maxPhotosAllowed(DEFAULT_MAX_PHOTOS)
                .maxFileSizeBytes(DEFAULT_MAX_FILE_SIZE_BYTES)
                .isValid(true) // можна завершити навіть без фото
                .validationMessages(List.of())
                .canUploadMore(true)
                .canContinueToNext(true)
                .canNavigateBack(true)
                .isLoading(false)
                .photoCountText(formatPhotoCount(0, DEFAULT_MAX_PHOTOS))
                .statusMessage("Фото ще не завантажено")
                .nextButtonText("Завершити додавання предмета")
                .build();
    }

    /**
     * Створює стан після завантаження фото.
     */
    public PhotoDocumentationState withUploadedPhoto(PhotoInfo newPhoto) {
        log.debug("Додається фото: {}", newPhoto.getFileName());

        var updatedPhotos = new java.util.ArrayList<>(this.uploadedPhotos);
        updatedPhotos.add(newPhoto);

        var validationResult = validatePhotos(updatedPhotos);
        boolean canUploadMore = updatedPhotos.size() < maxPhotosAllowed;

        return PhotoDocumentationState.builder()
                .uploadedPhotos(List.copyOf(updatedPhotos))
                .maxPhotosAllowed(this.maxPhotosAllowed)
                .maxFileSizeBytes(this.maxFileSizeBytes)
                .isValid(validationResult.isValid())
                .validationMessages(validationResult.messages())
                .canUploadMore(canUploadMore)
                .canContinueToNext(true) // завжди можна продовжити
                .canNavigateBack(true)
                .isLoading(false)
                .photoCountText(formatPhotoCount(updatedPhotos.size(), maxPhotosAllowed))
                .statusMessage(createStatusMessage(updatedPhotos.size()))
                .nextButtonText(this.nextButtonText)
                .build();
    }

    /**
     * Створює стан після видалення фото.
     */
    public PhotoDocumentationState withRemovedPhoto(int photoIndex) {
        log.debug("Видаляється фото за індексом: {}", photoIndex);

        if (photoIndex < 0 || photoIndex >= uploadedPhotos.size()) {
            log.warn("Недійсний індекс фото для видалення: {}", photoIndex);
            return this;
        }

        var updatedPhotos = new java.util.ArrayList<>(this.uploadedPhotos);
        PhotoInfo removedPhoto = updatedPhotos.remove(photoIndex);
        log.debug("Видалено фото: {}", removedPhoto.getFileName());

        var validationResult = validatePhotos(updatedPhotos);
        boolean canUploadMore = updatedPhotos.size() < maxPhotosAllowed;

        return PhotoDocumentationState.builder()
                .uploadedPhotos(List.copyOf(updatedPhotos))
                .maxPhotosAllowed(this.maxPhotosAllowed)
                .maxFileSizeBytes(this.maxFileSizeBytes)
                .isValid(validationResult.isValid())
                .validationMessages(validationResult.messages())
                .canUploadMore(canUploadMore)
                .canContinueToNext(true)
                .canNavigateBack(true)
                .isLoading(false)
                .photoCountText(formatPhotoCount(updatedPhotos.size(), maxPhotosAllowed))
                .statusMessage(createStatusMessage(updatedPhotos.size()))
                .nextButtonText(this.nextButtonText)
                .build();
    }

    /**
     * Створює стан з індикатором завантаження.
     */
    public PhotoDocumentationState withLoading(boolean isLoading) {
        return PhotoDocumentationState.builder()
                .uploadedPhotos(this.uploadedPhotos)
                .maxPhotosAllowed(this.maxPhotosAllowed)
                .maxFileSizeBytes(this.maxFileSizeBytes)
                .isValid(this.isValid)
                .validationMessages(this.validationMessages)
                .canUploadMore(this.canUploadMore && !isLoading)
                .canContinueToNext(this.canContinueToNext && !isLoading)
                .canNavigateBack(this.canNavigateBack && !isLoading)
                .isLoading(isLoading)
                .photoCountText(this.photoCountText)
                .statusMessage(isLoading ? "Завантаження фото..." : this.statusMessage)
                .nextButtonText(isLoading ? "Завантаження..." : this.nextButtonText)
                .build();
    }

    /**
     * Створює стан з завантаженими фото (для ініціалізації).
     */
    public PhotoDocumentationState withLoadedPhotos(List<PhotoInfo> photos) {
        log.debug("Завантажено {} фото", photos.size());

        var validationResult = validatePhotos(photos);
        boolean canUploadMore = photos.size() < maxPhotosAllowed;

        return PhotoDocumentationState.builder()
                .uploadedPhotos(List.copyOf(photos))
                .maxPhotosAllowed(this.maxPhotosAllowed)
                .maxFileSizeBytes(this.maxFileSizeBytes)
                .isValid(validationResult.isValid())
                .validationMessages(validationResult.messages())
                .canUploadMore(canUploadMore)
                .canContinueToNext(true)
                .canNavigateBack(true)
                .isLoading(false)
                .photoCountText(formatPhotoCount(photos.size(), maxPhotosAllowed))
                .statusMessage(createStatusMessage(photos.size()))
                .nextButtonText(this.nextButtonText)
                .build();
    }

    /**
     * Валідує список фото.
     */
    private ValidationResult validatePhotos(List<PhotoInfo> photos) {
        var messages = new java.util.ArrayList<String>();

        // Перевірка на максимальну кількість
        if (photos.size() > maxPhotosAllowed) {
            messages.add(String.format("Перевищено максимальну кількість фото (%d)", maxPhotosAllowed));
        }

        // Перевірка розміру файлів
        var oversizedFiles = photos.stream()
                .filter(photo -> photo.getFileSizeBytes() > maxFileSizeBytes)
                .map(PhotoInfo::getFileName)
                .toList();

        if (!oversizedFiles.isEmpty()) {
            messages.add("Файли перевищують максимальний розмір: " + String.join(", ", oversizedFiles));
        }

        // Перевірка на дублікати назв
        var duplicateNames = findDuplicateFileNames(photos);
        if (!duplicateNames.isEmpty()) {
            messages.add("Знайдено дубльовані назви файлів: " + String.join(", ", duplicateNames));
        }

        return new ValidationResult(messages.isEmpty(), List.copyOf(messages));
    }

    /**
     * Знаходить дубльовані назви файлів.
     */
    private List<String> findDuplicateFileNames(List<PhotoInfo> photos) {
        var seen = new java.util.HashSet<String>();
        var duplicates = new java.util.HashSet<String>();

        for (PhotoInfo photo : photos) {
            if (!seen.add(photo.getFileName())) {
                duplicates.add(photo.getFileName());
            }
        }

        return List.copyOf(duplicates);
    }

    /**
     * Форматує текст лічильника фото.
     */
    private static String formatPhotoCount(int current, int max) {
        return String.format("Завантажено: %d з %d фото", current, max);
    }

    /**
     * Створює повідомлення про статус.
     */
    private String createStatusMessage(int photosCount) {
        if (photosCount == 0) {
            return "Фото ще не завантажено";
        } else if (photosCount == 1) {
            return "Завантажено 1 фото";
        } else {
            return String.format("Завантажено %d фото", photosCount);
        }
    }

    /**
     * Перевіряє чи досягнуто максимум фото.
     */
    public boolean isMaxPhotosReached() {
        return uploadedPhotos.size() >= maxPhotosAllowed;
    }

    /**
     * Перевіряє чи є завантажені фото.
     */
    public boolean hasUploadedPhotos() {
        return !uploadedPhotos.isEmpty();
    }

    /**
     * Повертає кількість завантажених фото.
     */
    public int getPhotosCount() {
        return uploadedPhotos.size();
    }

    /**
     * Повертає загальний розмір всіх файлів.
     */
    public long getTotalFilesSize() {
        return uploadedPhotos.stream()
                .mapToLong(PhotoInfo::getFileSizeBytes)
                .sum();
    }

    /**
     * Повертає форматований загальний розмір файлів.
     */
    public String getFormattedTotalSize() {
        return formatFileSize(getTotalFilesSize());
    }

    /**
     * Форматує розмір файлу.
     */
    public static String formatFileSize(long bytes) {
        if (bytes < 1024) {
            return bytes + " байт";
        } else if (bytes < 1024 * 1024) {
            return String.format("%.1f КБ", bytes / 1024.0);
        } else {
            return String.format("%.1f МБ", bytes / (1024.0 * 1024.0));
        }
    }

    /**
     * Інформація про фото для відображення в UI.
     */
    public static class PhotoInfo {
        private final String fileName;
        private final String mimeType;
        private final byte[] data;
        private final long fileSizeBytes;
        private final String formattedSize;

        public PhotoInfo(String fileName, String mimeType, byte[] data) {
            this.fileName = fileName;
            this.mimeType = mimeType;
            this.data = data != null ? data.clone() : new byte[0];
            this.fileSizeBytes = this.data.length;
            this.formattedSize = formatFileSize(this.fileSizeBytes);
        }

        // Getters
        public String getFileName() { return fileName; }
        public String getMimeType() { return mimeType; }
        public byte[] getData() { return data.clone(); }
        public long getFileSizeBytes() { return fileSizeBytes; }
        public String getFormattedSize() { return formattedSize; }

        @Override
        public String toString() {
            return String.format("PhotoInfo{fileName='%s', size=%s}", fileName, formattedSize);
        }
    }

    /**
     * Результат валідації.
     */
    private record ValidationResult(boolean isValid, List<String> messages) {}
}
