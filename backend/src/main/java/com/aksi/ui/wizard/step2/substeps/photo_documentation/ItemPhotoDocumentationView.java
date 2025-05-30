package com.aksi.ui.wizard.step2.substeps.photo_documentation;

import java.util.function.Consumer;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.ui.wizard.step2.substeps.photo_documentation.application.PhotoDocumentationService;
import com.aksi.ui.wizard.step2.substeps.photo_documentation.components.InstructionsComponent;
import com.aksi.ui.wizard.step2.substeps.photo_documentation.components.NavigationComponent;
import com.aksi.ui.wizard.step2.substeps.photo_documentation.components.PhotoPreviewComponent;
import com.aksi.ui.wizard.step2.substeps.photo_documentation.components.PhotoUploadComponent;
import com.aksi.ui.wizard.step2.substeps.photo_documentation.domain.PhotoDocumentationState;
import com.aksi.ui.wizard.step2.substeps.photo_documentation.events.PhotoDocumentationEvents;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.notification.NotificationVariant;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * Підетап 2.5: Фотодокументація предмета (рефакторинований).
 * Event-driven координатор з використанням DDD + SOLID принципів.
 */
@Slf4j
public class ItemPhotoDocumentationView extends VerticalLayout {

    // Application Service та callbacks
    private final PhotoDocumentationService documentationService;
    private final Consumer<OrderItemDTO> onNext;
    private final Consumer<OrderItemDTO> onPrevious;
    private final Runnable onCancel;

    // UI компоненти
    private H3 title;
    private Span subtitle;
    private InstructionsComponent instructions;
    private PhotoUploadComponent photoUpload;
    private PhotoPreviewComponent photoPreview;
    private NavigationComponent navigation;

    // Поточний стан
    private PhotoDocumentationState currentState;
    private OrderItemDTO currentItem;

    public ItemPhotoDocumentationView(
            Consumer<OrderItemDTO> onNext,
            Consumer<OrderItemDTO> onPrevious,
            Runnable onCancel,
            OrderItemDTO existingItem) {

        this.onNext = onNext;
        this.onPrevious = onPrevious;
        this.onCancel = onCancel;
        this.currentItem = existingItem != null ? existingItem : OrderItemDTO.builder().build();

        // Ініціалізуємо сервіс
        this.documentationService = new PhotoDocumentationService();

        initializeComponents();
        initializeLayout();
        setupEventHandlers();
        initializeData();

        log.info("ItemPhotoDocumentationView ініціалізовано для предмета: {}",
                this.currentItem.getName());
    }

    private void initializeComponents() {
        // Заголовок та підзаголовок
        title = new H3("Фотодокументація предмета");
        title.getStyle().set("margin-top", "0");

        subtitle = new Span(String.format("Предмет: %s",
                currentItem.getName() != null ? currentItem.getName() : "Не вказано"));
        subtitle.getStyle().set("color", "var(--lumo-secondary-text-color)");

        // Компоненти
        instructions = new InstructionsComponent();
        photoUpload = new PhotoUploadComponent();
        photoPreview = new PhotoPreviewComponent();
        navigation = new NavigationComponent();
    }

    private void initializeLayout() {
        setSizeFull();
        setPadding(true);
        setSpacing(true);
        setDefaultHorizontalComponentAlignment(Alignment.STRETCH);

        add(title, subtitle, instructions, photoUpload, photoPreview, navigation);
    }

    private void setupEventHandlers() {
        // Налаштовуємо обробник подій для Application Service
        documentationService.setEventHandler(this::handleDocumentationEvent);

        // Налаштовуємо обробники для UI компонентів
        setupPhotoUploadHandlers();
        setupPhotoPreviewHandlers();
        setupNavigationHandlers();
    }

    private void setupPhotoUploadHandlers() {
        photoUpload.setOnUploadStart((fileName, mimeType, fileSize) -> {
            currentState = documentationService.startPhotoUpload(currentState, fileName, mimeType, fileSize);
        });

        photoUpload.setOnUploadSuccess((fileName, mimeType, inputStream) -> {
            currentState = documentationService.completePhotoUpload(currentState, fileName, mimeType, inputStream);
        });

        photoUpload.setOnUploadError((fileName, errorMessage) -> {
            showErrorNotification("Помилка завантаження: " + errorMessage);
        });

        photoUpload.setOnUploadRejected((fileName, reason) -> {
            showErrorNotification("Файл відхилено: " + reason);
        });
    }

    private void setupPhotoPreviewHandlers() {
        photoPreview.setOnPhotoDelete((photo, index) -> {
            documentationService.requestPhotoDeletion(photo, index);
            currentState = documentationService.deletePhoto(currentState, index);
        });
    }

    private void setupNavigationHandlers() {
        navigation.setOnCancel(() -> {
            log.debug("Скасування фотодокументації");
            onCancel.run();
        });

        navigation.setOnPrevious(() -> {
            documentationService.requestNavigateBack(currentState, currentItem);
        });

        navigation.setOnNext(() -> {
            documentationService.requestCompletionDocumentation(currentState, currentItem);
        });
    }

    private void initializeData() {
        currentState = documentationService.initializeDocumentation(currentItem);
    }

    /**
     * Централізований обробник подій з Application Service.
     */
    private void handleDocumentationEvent(PhotoDocumentationEvents event) {
        try {
            switch (event) {
                case PhotoDocumentationEvents.DocumentationInitialized initialized ->
                    handleDocumentationInitialized(initialized);
                case PhotoDocumentationEvents.DocumentationStateUpdated stateUpdated ->
                    handleStateUpdated(stateUpdated);
                case PhotoDocumentationEvents.ExistingPhotosLoaded photosLoaded ->
                    handlePhotosLoaded(photosLoaded);
                case PhotoDocumentationEvents.PhotoUploadSucceeded uploadSucceeded ->
                    handlePhotoUploadSucceeded(uploadSucceeded);
                case PhotoDocumentationEvents.PhotoUploadFailed uploadFailed ->
                    handlePhotoUploadFailed(uploadFailed);
                case PhotoDocumentationEvents.PhotoUploadRejected uploadRejected ->
                    handlePhotoUploadRejected(uploadRejected);
                case PhotoDocumentationEvents.PhotoDeleted photoDeleted ->
                    handlePhotoDeleted(photoDeleted);
                case PhotoDocumentationEvents.PhotoCountUpdated countUpdated ->
                    handlePhotoCountUpdated(countUpdated);
                case PhotoDocumentationEvents.UIStateChanged uiStateChanged ->
                    handleUIStateChanged(uiStateChanged);
                case PhotoDocumentationEvents.DocumentationValidationCompleted validationCompleted ->
                    handleValidationCompleted(validationCompleted);
                case PhotoDocumentationEvents.NavigateBackRequested navigateBackRequested ->
                    handleNavigateBackRequested(navigateBackRequested);
                case PhotoDocumentationEvents.ReadyToComplete readyToComplete ->
                    handleReadyToComplete(readyToComplete);
                case PhotoDocumentationEvents.DocumentationError error ->
                    handleDocumentationError(error);
                case PhotoDocumentationEvents.OperationSucceeded operationSucceeded ->
                    handleOperationSucceeded(operationSucceeded);
                case PhotoDocumentationEvents.LoadingStarted loadingStarted ->
                    handleLoadingStarted(loadingStarted);
                case PhotoDocumentationEvents.LoadingCompleted loadingCompleted ->
                    handleLoadingCompleted(loadingCompleted);
                case PhotoDocumentationEvents.StatisticsUpdated statisticsUpdated ->
                    handleStatisticsUpdated(statisticsUpdated);
                case PhotoDocumentationEvents.LimitWarning limitWarning ->
                    handleLimitWarning(limitWarning);
                default -> log.debug("Необроблена подія: {}", event.getClass().getSimpleName());
            }
        } catch (Exception ex) {
            log.error("Помилка обробки події {}: {}", event.getClass().getSimpleName(), ex.getMessage(), ex);
            showErrorNotification("Системна помилка: " + ex.getMessage());
        }
    }

    private void handleDocumentationInitialized(PhotoDocumentationEvents.DocumentationInitialized initialized) {
        currentState = initialized.initialState();
        updateAllComponentsFromState();
        log.debug("Фотодокументацію ініціалізовано");
    }

    private void handleStateUpdated(PhotoDocumentationEvents.DocumentationStateUpdated stateUpdated) {
        currentState = stateUpdated.documentationState();
        updateAllComponentsFromState();
    }

    private void handlePhotosLoaded(PhotoDocumentationEvents.ExistingPhotosLoaded photosLoaded) {
        if (photosLoaded.success()) {
            log.debug("Завантажено {} існуючих фото", photosLoaded.photos().size());
        } else {
            showErrorNotification("Помилка завантаження існуючих фото");
        }
    }

    private void handlePhotoUploadSucceeded(PhotoDocumentationEvents.PhotoUploadSucceeded uploadSucceeded) {
        showSuccessNotification("Фото успішно завантажено: " + uploadSucceeded.uploadedPhoto().getFileName());
    }

    private void handlePhotoUploadFailed(PhotoDocumentationEvents.PhotoUploadFailed uploadFailed) {
        showErrorNotification("Помилка завантаження " + uploadFailed.fileName() + ": " + uploadFailed.errorMessage());
    }

    private void handlePhotoUploadRejected(PhotoDocumentationEvents.PhotoUploadRejected uploadRejected) {
        showErrorNotification("Файл відхилено " + uploadRejected.fileName() + ": " + uploadRejected.reason());
    }

    private void handlePhotoDeleted(PhotoDocumentationEvents.PhotoDeleted photoDeleted) {
        showSuccessNotification("Фото видалено: " + photoDeleted.deletedPhoto().getFileName());
    }

    private void handlePhotoCountUpdated(PhotoDocumentationEvents.PhotoCountUpdated countUpdated) {
        photoUpload.updatePhotoCount(countUpdated.currentCount(), countUpdated.maxCount());

        if (countUpdated.maxReached()) {
            instructions.highlightImportantInstructions();
        } else {
            instructions.resetToDefaultStyle();
        }
    }

    private void handleUIStateChanged(PhotoDocumentationEvents.UIStateChanged uiStateChanged) {
        photoUpload.setUploadEnabled(uiStateChanged.canUploadMore());
        navigation.setPreviousEnabled(uiStateChanged.canNavigateBack());
        navigation.setNextEnabled(uiStateChanged.canContinueToNext());

        if (uiStateChanged.isLoading()) {
            navigation.setLoadingState(true);
        }
    }

    private void handleValidationCompleted(PhotoDocumentationEvents.DocumentationValidationCompleted validationCompleted) {
        if (!validationCompleted.isValid()) {
            showValidationErrors(validationCompleted.validationMessages());
        }
    }

    private void handleNavigateBackRequested(PhotoDocumentationEvents.NavigateBackRequested navigateBackRequested) {
        log.debug("Перехід назад з фотодокументації");
        onPrevious.accept(navigateBackRequested.currentItem());
    }

    private void handleReadyToComplete(PhotoDocumentationEvents.ReadyToComplete readyToComplete) {
        if (readyToComplete.isReady()) {
            log.debug("Завершення фотодокументації");
            navigation.showNextSuccess();
            onNext.accept(readyToComplete.itemWithPhotos());
        }
    }

    private void handleDocumentationError(PhotoDocumentationEvents.DocumentationError error) {
        log.error("Помилка фотодокументації в операції {}: {}", error.operation(), error.errorMessage());
        showErrorNotification("Помилка: " + error.errorMessage());
        navigation.showNextError();
    }

    private void handleOperationSucceeded(PhotoDocumentationEvents.OperationSucceeded operationSucceeded) {
        showSuccessNotification(operationSucceeded.successMessage());
    }

    private void handleLoadingStarted(PhotoDocumentationEvents.LoadingStarted loadingStarted) {
        log.debug("Початок операції: {}", loadingStarted.operation());
    }

    private void handleLoadingCompleted(PhotoDocumentationEvents.LoadingCompleted loadingCompleted) {
        log.debug("Завершення операції: {}", loadingCompleted.operation());
    }

    private void handleStatisticsUpdated(PhotoDocumentationEvents.StatisticsUpdated statisticsUpdated) {
        log.debug("Статистика оновлена: {} фото, {}",
                statisticsUpdated.photosCount(), statisticsUpdated.totalSize());
    }

    private void handleLimitWarning(PhotoDocumentationEvents.LimitWarning limitWarning) {
        showErrorNotification("Попередження: " + limitWarning.warningMessage());

        if ("max_photos".equals(limitWarning.warningType())) {
            instructions.highlightImportantInstructions();
        }
    }

    /**
     * Оновлює всі UI компоненти з поточного domain state.
     */
    private void updateAllComponentsFromState() {
        if (currentState != null) {
            photoUpload.updateFromState(currentState);
            photoPreview.updateFromState(currentState);
            navigation.updateFromState(currentState);
        }
    }

    /**
     * Показує помилки валідації.
     */
    private void showValidationErrors(java.util.List<String> errors) {
        String errorMessage = "Помилки валідації:\n" + String.join("\n", errors);
        showErrorNotification(errorMessage);
    }

    /**
     * Показує повідомлення про успіх.
     */
    private void showSuccessNotification(String message) {
        Notification.show(message, 3000, Notification.Position.TOP_CENTER)
                .addThemeVariants(NotificationVariant.LUMO_SUCCESS);
    }

    /**
     * Показує повідомлення про помилку.
     */
    private void showErrorNotification(String message) {
        Notification.show(message, 5000, Notification.Position.TOP_CENTER)
                .addThemeVariants(NotificationVariant.LUMO_ERROR);
    }

    // Публічні методи для зовнішнього використання

    /**
     * Оновлює відображення після зовнішніх змін.
     */
    public void refreshView() {
        currentState = documentationService.validateDocumentationState(currentState);
    }

    /**
     * Повертає поточний стан фотодокументації.
     */
    public PhotoDocumentationState getCurrentState() {
        return currentState;
    }

    /**
     * Перевіряє чи готовий до завершення.
     */
    public boolean isReadyToComplete() {
        return currentState != null && currentState.isCanContinueToNext();
    }

    /**
     * Повертає кількість завантажених фото.
     */
    public int getUploadedPhotosCount() {
        return currentState != null ? currentState.getPhotosCount() : 0;
    }

    /**
     * Перевіряє чи є завантажені фото.
     */
    public boolean hasPhotos() {
        return currentState != null && currentState.hasUploadedPhotos();
    }

    /**
     * Встановлює підзаголовок з інформацією про предмет.
     */
    public void updateItemInfo(String itemName) {
        subtitle.setText(String.format("Предмет: %s", itemName != null ? itemName : "Не вказано"));
        log.debug("Оновлено інформацію про предмет: {}", itemName);
    }

    /**
     * Встановлює компактний режим відображення.
     */
    public void setCompactMode(boolean compact) {
        instructions.setCompactMode(compact);
        photoPreview.setCompactMode(compact);
        navigation.setCompactMode(compact);
        log.debug("Встановлено компактний режим: {}", compact);
    }
}
