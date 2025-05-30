package com.aksi.ui.wizard.step2.substeps.photo_documentation.application;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.function.Consumer;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.ui.wizard.step2.substeps.photo_documentation.domain.PhotoDocumentationState;
import com.aksi.ui.wizard.step2.substeps.photo_documentation.events.PhotoDocumentationEvents;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Application Service для координації управління фотодокументацією.
 * Відповідає за координацію між доменом, інфраструктурою та UI.
 */
@RequiredArgsConstructor
@Slf4j
public class PhotoDocumentationService {

    // Event handlers
    private Consumer<PhotoDocumentationEvents> eventHandler;

    /**
     * Встановлює обробник подій.
     */
    public void setEventHandler(Consumer<PhotoDocumentationEvents> handler) {
        this.eventHandler = handler;
    }

    /**
     * Ініціалізує фотодокументацію для предмета.
     */
    public PhotoDocumentationState initializeDocumentation(OrderItemDTO item) {
        log.debug("Ініціалізація фотодокументації для предмета: {}", item.getName());

        try {
            // Створюємо початковий стан
            PhotoDocumentationState initialState = PhotoDocumentationState.createInitial();

            publishEvent(new PhotoDocumentationEvents.DocumentationInitialized(initialState, item));

            // Завантажуємо існуючі фото
            loadExistingPhotos(initialState, item);

            return initialState;

        } catch (Exception ex) {
            log.error("Помилка ініціалізації фотодокументації: {}", ex.getMessage(), ex);
            publishEvent(new PhotoDocumentationEvents.DocumentationError(
                    "Помилка ініціалізації: " + ex.getMessage(),
                    ex,
                    "initialization"
            ));

            return PhotoDocumentationState.createInitial();
        }
    }

    /**
     * Завантажує існуючі фото для предмета.
     */
    public PhotoDocumentationState loadExistingPhotos(PhotoDocumentationState currentState, OrderItemDTO item) {
        log.debug("Завантаження існуючих фото для предмета: {}", item.getName());

        try {
            publishEvent(new PhotoDocumentationEvents.LoadingStarted("Завантаження існуючих фото"));
            publishEvent(new PhotoDocumentationEvents.ExistingPhotosLoadRequested(item));

            // TODO: В майбутньому тут буде інтеграція з файловим сервісом або базою даних
            // Поки що повертаємо порожній список
            var existingPhotos = java.util.List.<PhotoDocumentationState.PhotoInfo>of();

            publishEvent(new PhotoDocumentationEvents.ExistingPhotosLoaded(existingPhotos, true));

            // Оновлюємо стан з завантаженими фото
            PhotoDocumentationState newState = currentState.withLoadedPhotos(existingPhotos);
            publishEvent(new PhotoDocumentationEvents.DocumentationStateUpdated(newState));

            // Оновлюємо статистику
            updateStatistics(newState);

            // Валідуємо стан
            validateDocumentationState(newState);

            publishEvent(new PhotoDocumentationEvents.LoadingCompleted("Завантаження існуючих фото"));

            return newState;

        } catch (Exception ex) {
            log.error("Помилка завантаження існуючих фото: {}", ex.getMessage(), ex);
            publishEvent(new PhotoDocumentationEvents.DocumentationError(
                    "Помилка завантаження: " + ex.getMessage(),
                    ex,
                    "loading_existing_photos"
            ));

            publishEvent(new PhotoDocumentationEvents.LoadingCompleted("Завантаження існуючих фото"));
            return currentState;
        }
    }

    /**
     * Обробляє початок завантаження нового фото.
     */
    public PhotoDocumentationState startPhotoUpload(PhotoDocumentationState currentState, String fileName, String mimeType, long fileSize) {
        log.debug("Початок завантаження фото: {} ({})", fileName, PhotoDocumentationState.formatFileSize(fileSize));

        try {
            // Перевіряємо обмеження перед завантаженням
            if (currentState.isMaxPhotosReached()) {
                String errorMessage = String.format("Досягнуто максимум фото (%d)", currentState.getMaxPhotosAllowed());
                publishEvent(new PhotoDocumentationEvents.PhotoUploadRejected(fileName, errorMessage));
                publishEvent(new PhotoDocumentationEvents.LimitWarning("max_photos", errorMessage));
                return currentState;
            }

            if (fileSize > currentState.getMaxFileSizeBytes()) {
                String errorMessage = String.format("Файл перевищує максимальний розмір (%s)",
                        PhotoDocumentationState.formatFileSize(currentState.getMaxFileSizeBytes()));
                publishEvent(new PhotoDocumentationEvents.PhotoUploadRejected(fileName, errorMessage));
                publishEvent(new PhotoDocumentationEvents.LimitWarning("file_size", errorMessage));
                return currentState;
            }

            publishEvent(new PhotoDocumentationEvents.PhotoUploadStarted(fileName, mimeType, fileSize));

            // Показуємо індикатор завантаження
            PhotoDocumentationState loadingState = currentState.withLoading(true);
            publishEvent(new PhotoDocumentationEvents.DocumentationStateUpdated(loadingState));
            publishEvent(new PhotoDocumentationEvents.UploadProgressUpdated(fileName, 0));

            return loadingState;

        } catch (Exception ex) {
            log.error("Помилка початку завантаження фото: {}", ex.getMessage(), ex);
            publishEvent(new PhotoDocumentationEvents.PhotoUploadFailed(fileName, ex.getMessage(), ex));
            return currentState;
        }
    }

    /**
     * Обробляє успішне завантаження фото.
     */
    public PhotoDocumentationState completePhotoUpload(PhotoDocumentationState currentState, String fileName, String mimeType, InputStream inputStream) {
        log.debug("Завершення завантаження фото: {}", fileName);

        try {
            publishEvent(new PhotoDocumentationEvents.UploadProgressUpdated(fileName, 50));

            // Читаємо дані файлу
            byte[] fileData = readInputStreamToByteArray(inputStream);
            publishEvent(new PhotoDocumentationEvents.UploadProgressUpdated(fileName, 80));

            // Створюємо PhotoInfo
            var photoInfo = new PhotoDocumentationState.PhotoInfo(fileName, mimeType, fileData);
            publishEvent(new PhotoDocumentationEvents.UploadProgressUpdated(fileName, 100));

            publishEvent(new PhotoDocumentationEvents.PhotoUploadSucceeded(photoInfo));

            // Додаємо фото до стану
            PhotoDocumentationState newState = currentState.withUploadedPhoto(photoInfo).withLoading(false);
            publishEvent(new PhotoDocumentationEvents.DocumentationStateUpdated(newState));

            // Оновлюємо відображення
            publishEvent(new PhotoDocumentationEvents.PhotosDisplayUpdateRequested());

            // Оновлюємо статистику
            updateStatistics(newState);

            // Валідуємо стан
            validateDocumentationState(newState);

            // Повідомляємо про успіх
            publishEvent(new PhotoDocumentationEvents.OperationSucceeded(
                    "photo_upload",
                    "Фото успішно завантажено: " + fileName
            ));

            log.info("Завантажено фото: {} ({} байт)", fileName, fileData.length);

            return newState;

        } catch (Exception ex) {
            log.error("Помилка завершення завантаження фото: {}", ex.getMessage(), ex);
            publishEvent(new PhotoDocumentationEvents.PhotoUploadFailed(fileName, ex.getMessage(), ex));

            return currentState.withLoading(false);
        }
    }

    /**
     * Обробляє запит на видалення фото.
     */
    public void requestPhotoDeletion(PhotoDocumentationState.PhotoInfo photo, int photoIndex) {
        log.debug("Запит на видалення фото: {} (індекс: {})", photo.getFileName(), photoIndex);
        publishEvent(new PhotoDocumentationEvents.PhotoDeletionRequested(photo, photoIndex));
    }

    /**
     * Обробляє підтверджене видалення фото.
     */
    public PhotoDocumentationState deletePhoto(PhotoDocumentationState currentState, int photoIndex) {
        log.debug("Видалення фото за індексом: {}", photoIndex);

        try {
            if (photoIndex < 0 || photoIndex >= currentState.getUploadedPhotos().size()) {
                log.warn("Недійсний індекс фото для видалення: {}", photoIndex);
                return currentState;
            }

            var photoToDelete = currentState.getUploadedPhotos().get(photoIndex);
            publishEvent(new PhotoDocumentationEvents.PhotoDeletionConfirmed(photoToDelete, photoIndex));

            // Видаляємо фото зі стану
            PhotoDocumentationState newState = currentState.withRemovedPhoto(photoIndex);
            publishEvent(new PhotoDocumentationEvents.DocumentationStateUpdated(newState));

            publishEvent(new PhotoDocumentationEvents.PhotoDeleted(photoToDelete, photoIndex));

            // Оновлюємо відображення
            publishEvent(new PhotoDocumentationEvents.PhotosDisplayUpdateRequested());

            // Оновлюємо статистику
            updateStatistics(newState);

            // Валідуємо стан
            validateDocumentationState(newState);

            // Повідомляємо про успіх
            publishEvent(new PhotoDocumentationEvents.OperationSucceeded(
                    "photo_deletion",
                    "Фото видалено: " + photoToDelete.getFileName()
            ));

            log.info("Видалено фото: {}", photoToDelete.getFileName());

            return newState;

        } catch (Exception ex) {
            log.error("Помилка видалення фото: {}", ex.getMessage(), ex);
            publishEvent(new PhotoDocumentationEvents.DocumentationError(
                    "Помилка видалення фото: " + ex.getMessage(),
                    ex,
                    "delete_photo"
            ));
            return currentState;
        }
    }

    /**
     * Обробляє запит на перехід назад.
     */
    public void requestNavigateBack(PhotoDocumentationState currentState, OrderItemDTO currentItem) {
        log.debug("Запит на перехід назад з фотодокументації");

        try {
            publishEvent(new PhotoDocumentationEvents.NavigateBackRequested(currentState, currentItem));

            // Зберігаємо поточний стан
            saveDocumentationState(currentState, currentItem);

        } catch (Exception ex) {
            log.error("Помилка при переході назад: {}", ex.getMessage(), ex);
            publishEvent(new PhotoDocumentationEvents.DocumentationError(
                    "Помилка при переході назад: " + ex.getMessage(),
                    ex,
                    "navigate_back"
            ));
        }
    }

    /**
     * Обробляє запит на завершення фотодокументації.
     */
    public void requestCompletionDocumentation(PhotoDocumentationState currentState, OrderItemDTO currentItem) {
        log.debug("Запит на завершення фотодокументації");

        try {
            publishEvent(new PhotoDocumentationEvents.DocumentationCompletionRequested(currentState, currentItem));

            // Валідуємо перед завершенням
            if (!currentState.isValid()) {
                publishEvent(new PhotoDocumentationEvents.DocumentationError(
                        "Не можна завершити: " + String.join(", ", currentState.getValidationMessages()),
                        null,
                        "completion_validation"
                ));
                return;
            }

            // Зберігаємо стан
            saveDocumentationState(currentState, currentItem);

            // Повідомляємо про готовність
            publishEvent(new PhotoDocumentationEvents.ReadyToComplete(
                    true,
                    currentState.getNextButtonText(),
                    currentItem
            ));

        } catch (Exception ex) {
            log.error("Помилка при завершенні фотодокументації: {}", ex.getMessage(), ex);
            publishEvent(new PhotoDocumentationEvents.DocumentationError(
                    "Помилка при завершенні: " + ex.getMessage(),
                    ex,
                    "completion"
            ));
        }
    }

    /**
     * Валідує поточний стан фотодокументації.
     */
    public PhotoDocumentationState validateDocumentationState(PhotoDocumentationState currentState) {
        log.debug("Валідація стану фотодокументації");

        try {
            publishEvent(new PhotoDocumentationEvents.DocumentationValidationRequested(currentState));

            // Валідація відбувається автоматично в domain model
            publishEvent(new PhotoDocumentationEvents.DocumentationValidationCompleted(
                    currentState.isValid(),
                    currentState.getValidationMessages(),
                    currentState.isCanContinueToNext()
            ));

            // Оновлюємо стан UI
            updateUIState(currentState);

            return currentState;

        } catch (Exception ex) {
            log.error("Помилка валідації стану фотодокументації: {}", ex.getMessage(), ex);
            publishEvent(new PhotoDocumentationEvents.DocumentationError(
                    "Помилка валідації: " + ex.getMessage(),
                    ex,
                    "validation"
            ));
            return currentState;
        }
    }

    /**
     * Зберігає стан фотодокументації.
     */
    private void saveDocumentationState(PhotoDocumentationState state, OrderItemDTO item) {
        log.debug("Збереження стану фотодокументації: {} фото", state.getPhotosCount());

        try {
            // TODO: В майбутньому тут буде збереження фото у файловий сервіс або базу даних
            // 1. Зберігати фото на диск/хмарне сховище
            // 2. Зберігати посилання на фото в OrderItemDTO
            // 3. Стискати зображення для оптимізації

            publishEvent(new PhotoDocumentationEvents.DocumentationStateSaved(item, state.getUploadedPhotos()));

            log.info("Збережено стан фотодокументації: {} фото для предмета {}",
                    state.getPhotosCount(), item.getName());

        } catch (Exception ex) {
            log.error("Помилка збереження стану фотодокументації: {}", ex.getMessage(), ex);
            publishEvent(new PhotoDocumentationEvents.DocumentationError(
                    "Помилка збереження: " + ex.getMessage(),
                    ex,
                    "save_state"
            ));
        }
    }

    /**
     * Оновлює статистику фотодокументації.
     */
    private void updateStatistics(PhotoDocumentationState state) {
        publishEvent(new PhotoDocumentationEvents.StatisticsUpdated(
                state.getPhotosCount(),
                state.getFormattedTotalSize(),
                state.getStatusMessage()
        ));

        publishEvent(new PhotoDocumentationEvents.PhotoCountUpdated(
                state.getPhotosCount(),
                state.getMaxPhotosAllowed(),
                state.getPhotoCountText(),
                state.isMaxPhotosReached()
        ));
    }

    /**
     * Оновлює стан UI компонентів.
     */
    private void updateUIState(PhotoDocumentationState state) {
        publishEvent(new PhotoDocumentationEvents.UIStateChanged(
                state.isCanUploadMore(),
                state.isCanNavigateBack(),
                state.isCanContinueToNext(),
                state.isLoading(),
                state.getStatusMessage()
        ));
    }

    /**
     * Читає InputStream у byte array.
     */
    private byte[] readInputStreamToByteArray(InputStream inputStream) throws Exception {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[1024];
            int length;
            while ((length = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, length);
            }
            return outputStream.toByteArray();
        }
    }

    /**
     * Публікує подію, якщо є обробник.
     */
    private void publishEvent(PhotoDocumentationEvents event) {
        if (eventHandler != null) {
            try {
                eventHandler.accept(event);
            } catch (Exception ex) {
                log.error("Помилка обробки події {}: {}", event.getClass().getSimpleName(), ex.getMessage(), ex);
            }
        }
    }
}
