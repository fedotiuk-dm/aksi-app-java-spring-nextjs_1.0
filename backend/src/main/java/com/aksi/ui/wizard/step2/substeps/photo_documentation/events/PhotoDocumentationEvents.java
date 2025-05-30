package com.aksi.ui.wizard.step2.substeps.photo_documentation.events;

import java.util.List;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.ui.wizard.step2.substeps.photo_documentation.domain.PhotoDocumentationState;

/**
 * Events для координації між компонентами фотодокументації.
 * Дотримуємось принципу інверсії залежностей (DIP).
 */
public sealed interface PhotoDocumentationEvents {

    /**
     * Подія запиту завантаження існуючих фото.
     */
    record ExistingPhotosLoadRequested(
            OrderItemDTO item
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія завершення завантаження існуючих фото.
     */
    record ExistingPhotosLoaded(
            List<PhotoDocumentationState.PhotoInfo> photos,
            boolean success
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія початку завантаження нового фото.
     */
    record PhotoUploadStarted(
            String fileName,
            String mimeType,
            long fileSize
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія успішного завантаження фото.
     */
    record PhotoUploadSucceeded(
            PhotoDocumentationState.PhotoInfo uploadedPhoto
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія помилки завантаження фото.
     */
    record PhotoUploadFailed(
            String fileName,
            String errorMessage,
            Throwable cause
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія відхилення файлу.
     */
    record PhotoUploadRejected(
            String fileName,
            String reason
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія запиту видалення фото.
     */
    record PhotoDeletionRequested(
            PhotoDocumentationState.PhotoInfo photoToDelete,
            int photoIndex
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія підтвердження видалення фото.
     */
    record PhotoDeletionConfirmed(
            PhotoDocumentationState.PhotoInfo deletedPhoto,
            int photoIndex
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія видалення фото.
     */
    record PhotoDeleted(
            PhotoDocumentationState.PhotoInfo deletedPhoto,
            int photoIndex
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія оновлення повного стану фотодокументації.
     */
    record DocumentationStateUpdated(
            PhotoDocumentationState documentationState
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія валідації фотодокументації.
     */
    record DocumentationValidationRequested(
            PhotoDocumentationState currentState
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія результату валідації фотодокументації.
     */
    record DocumentationValidationCompleted(
            boolean isValid,
            List<String> validationMessages,
            boolean canContinue
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія оновлення лічильника фото.
     */
    record PhotoCountUpdated(
            int currentCount,
            int maxCount,
            String formattedText,
            boolean maxReached
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія запиту переходу назад.
     */
    record NavigateBackRequested(
            PhotoDocumentationState currentState,
            OrderItemDTO currentItem
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія запиту завершення фотодокументації.
     */
    record DocumentationCompletionRequested(
            PhotoDocumentationState currentState,
            OrderItemDTO currentItem
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія готовності до завершення.
     */
    record ReadyToComplete(
            boolean isReady,
            String nextButtonText,
            OrderItemDTO itemWithPhotos
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія збереження стану фотодокументації.
     */
    record DocumentationStateSaved(
            OrderItemDTO itemWithPhotos,
            List<PhotoDocumentationState.PhotoInfo> savedPhotos
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія помилки в фотодокументації.
     */
    record DocumentationError(
            String errorMessage,
            Throwable cause,
            String operation
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія початку операції завантаження.
     */
    record LoadingStarted(
            String operation
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія завершення операції завантаження.
     */
    record LoadingCompleted(
            String operation
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія оновлення стану UI компонентів.
     */
    record UIStateChanged(
            boolean canUploadMore,
            boolean canNavigateBack,
            boolean canContinueToNext,
            boolean isLoading,
            String statusMessage
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія ініціалізації фотодокументації.
     */
    record DocumentationInitialized(
            PhotoDocumentationState initialState,
            OrderItemDTO currentItem
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія оновлення відображення фото.
     */
    record PhotosDisplayUpdateRequested() implements PhotoDocumentationEvents {}

    /**
     * Подія успішного завершення операції.
     */
    record OperationSucceeded(
            String operation,
            String successMessage
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія скасування фотодокументації.
     */
    record DocumentationCancelled() implements PhotoDocumentationEvents {}

    /**
     * Подія оновлення загальної статистики.
     */
    record StatisticsUpdated(
            int photosCount,
            String totalSize,
            String statusMessage
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія попередження про обмеження.
     */
    record LimitWarning(
            String warningType,
            String warningMessage
    ) implements PhotoDocumentationEvents {}

    /**
     * Подія оновлення індикатора прогресу завантаження.
     */
    record UploadProgressUpdated(
            String fileName,
            int progressPercent
    ) implements PhotoDocumentationEvents {}
}
