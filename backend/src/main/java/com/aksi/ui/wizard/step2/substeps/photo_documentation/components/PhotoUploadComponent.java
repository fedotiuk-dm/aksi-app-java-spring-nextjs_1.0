package com.aksi.ui.wizard.step2.substeps.photo_documentation.components;

import java.io.InputStream;

import com.aksi.ui.wizard.step2.substeps.photo_documentation.domain.PhotoDocumentationState;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.upload.Upload;
import com.vaadin.flow.component.upload.receivers.MemoryBuffer;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для завантаження фото.
 * Дотримується принципу Single Responsibility Principle (SRP).
 */
@Slf4j
public class PhotoUploadComponent extends VerticalLayout {

    // UI компоненти
    private H4 uploadTitle;
    private Span photoCountLabel;
    private Upload photoUpload;
    private MemoryBuffer uploadBuffer;
    private Span statusMessage;
    private Span limitWarning;

    // Callback interfaces
    @FunctionalInterface
    public interface PhotoUploadStartHandler {
        void onUploadStart(String fileName, String mimeType, long fileSize);
    }

    @FunctionalInterface
    public interface PhotoUploadSuccessHandler {
        void onUploadSuccess(String fileName, String mimeType, InputStream inputStream);
    }

    @FunctionalInterface
    public interface PhotoUploadErrorHandler {
        void onUploadError(String fileName, String errorMessage);
    }

    @FunctionalInterface
    public interface PhotoUploadRejectedHandler {
        void onUploadRejected(String fileName, String reason);
    }

    // Event handlers
    private PhotoUploadStartHandler onUploadStart;
    private PhotoUploadSuccessHandler onUploadSuccess;
    private PhotoUploadErrorHandler onUploadError;
    private PhotoUploadRejectedHandler onUploadRejected;

    public PhotoUploadComponent() {
        log.debug("Ініціалізація PhotoUploadComponent");

        initializeLayout();
        createComponents();
        setupEventHandlers();
        updateWithInitialState();

        log.debug("PhotoUploadComponent ініціалізовано успішно");
    }

    private void initializeLayout() {
        setPadding(false);
        setSpacing(true);
        setWidthFull();
    }

    private void createComponents() {
        // Заголовок секції
        uploadTitle = new H4("Завантаження фото");
        uploadTitle.getStyle()
            .set("margin-top", "0")
            .set("margin-bottom", "var(--lumo-space-s)");

        // Лічильник фото
        photoCountLabel = new Span("Завантажено: 0 з 5 фото");
        photoCountLabel.getStyle()
            .set("font-weight", "bold")
            .set("color", "var(--lumo-secondary-text-color)")
            .set("margin-bottom", "var(--lumo-space-s)");

        // Upload компонент
        createUploadComponent();

        // Статус повідомлення
        statusMessage = new Span("");
        statusMessage.getStyle()
            .set("color", "var(--lumo-secondary-text-color)")
            .set("font-style", "italic")
            .set("display", "none");

        // Попередження про обмеження
        limitWarning = new Span("");
        limitWarning.getStyle()
            .set("color", "var(--lumo-error-text-color)")
            .set("font-weight", "bold")
            .set("display", "none");

        add(uploadTitle, photoCountLabel, photoUpload, statusMessage, limitWarning);
    }

    private void createUploadComponent() {
        uploadBuffer = new MemoryBuffer();
        photoUpload = new Upload(uploadBuffer);

        // Налаштування Upload
        photoUpload.setAcceptedFileTypes("image/*");
        photoUpload.setMaxFileSize((int) PhotoDocumentationState.DEFAULT_MAX_FILE_SIZE_BYTES);
        photoUpload.setMaxFiles(1); // по одному файлу за раз

        // Кастомізація UI
        photoUpload.setDropLabel(new Span("Перетягніть фото сюди або"));
        photoUpload.setUploadButton(new Button("Завантажити фото", VaadinIcon.CAMERA.create()));

        // Стилізація
        photoUpload.getStyle()
            .set("width", "100%")
            .set("min-height", "120px");
    }

    private void setupEventHandlers() {
        // Початок завантаження
        photoUpload.addStartedListener(event -> {
            log.debug("Початок завантаження файлу: {}", event.getFileName());

            showStatus("Завантаження " + event.getFileName() + "...");
            hideWarning();

            if (onUploadStart != null) {
                onUploadStart.onUploadStart(
                    event.getFileName(),
                    event.getMIMEType(),
                    event.getContentLength()
                );
            }
        });

        // Успішне завантаження
        photoUpload.addSucceededListener(event -> {
            log.debug("Успішно завантажено файл: {}", event.getFileName());

            hideStatus();

            if (onUploadSuccess != null) {
                onUploadSuccess.onUploadSuccess(
                    event.getFileName(),
                    event.getMIMEType(),
                    uploadBuffer.getInputStream()
                );
            }
        });

        // Помилка завантаження
        photoUpload.addFailedListener(event -> {
            String errorMessage = event.getReason().getMessage();
            log.error("Помилка завантаження файлу {}: {}", event.getFileName(), errorMessage);

            showStatus("Помилка завантаження: " + errorMessage);

            if (onUploadError != null) {
                onUploadError.onUploadError(event.getFileName(), errorMessage);
            }
        });

        // Відхилення файлу
        photoUpload.addFileRejectedListener(event -> {
            String reason = event.getErrorMessage();
            log.warn("Файл відхилено {}: {}", event.getFileName(), reason);

            showWarning("Файл відхилено: " + reason);

            if (onUploadRejected != null) {
                onUploadRejected.onUploadRejected(event.getFileName(), reason);
            }
        });
    }

    private void updateWithInitialState() {
        updatePhotoCount(0, PhotoDocumentationState.DEFAULT_MAX_PHOTOS);
        setUploadEnabled(true);
    }

    /**
     * Оновлює лічильник фото.
     */
    public void updatePhotoCount(int current, int max) {
        String countText = String.format("Завантажено: %d з %d фото", current, max);
        photoCountLabel.setText(countText);

        // Оновлюємо кольори залежно від стану
        if (current >= max) {
            photoCountLabel.getStyle().set("color", "var(--lumo-error-text-color)");
            showWarning(String.format("Досягнуто максимум фото (%d)", max));
        } else if (current > max * 0.8) {
            photoCountLabel.getStyle().set("color", "var(--lumo-warning-text-color)");
        } else {
            photoCountLabel.getStyle().set("color", "var(--lumo-secondary-text-color)");
            hideWarning();
        }

        log.debug("Оновлено лічильник фото: {}/{}", current, max);
    }

    /**
     * Встановлює чи можна завантажувати ще фото.
     */
    public void setUploadEnabled(boolean enabled) {
        photoUpload.setVisible(enabled);

        if (!enabled) {
            showWarning("Досягнуто максимум фото");
        }

        log.debug("Завантаження фото {}", enabled ? "увімкнено" : "вимкнено");
    }

    /**
     * Оновлює стан з domain state.
     */
    public void updateFromState(PhotoDocumentationState state) {
        updatePhotoCount(state.getPhotosCount(), state.getMaxPhotosAllowed());
        setUploadEnabled(state.isCanUploadMore() && !state.isLoading());

        if (state.isLoading()) {
            showStatus(state.getStatusMessage());
        } else {
            hideStatus();
        }

        log.debug("Оновлено стан компонента завантаження з domain state");
    }

    /**
     * Показує статусне повідомлення.
     */
    private void showStatus(String message) {
        statusMessage.setText(message);
        statusMessage.getStyle().set("display", "block");
    }

    /**
     * Приховує статусне повідомлення.
     */
    private void hideStatus() {
        statusMessage.getStyle().set("display", "none");
    }

    /**
     * Показує попередження.
     */
    private void showWarning(String warning) {
        limitWarning.setText(warning);
        limitWarning.getStyle().set("display", "block");
    }

    /**
     * Приховує попередження.
     */
    private void hideWarning() {
        limitWarning.getStyle().set("display", "none");
    }

    /**
     * Встановлює максимальний розмір файлу.
     */
    public void setMaxFileSize(long maxFileSizeBytes) {
        photoUpload.setMaxFileSize((int) maxFileSizeBytes);
        log.debug("Встановлено максимальний розмір файлу: {} байт", maxFileSizeBytes);
    }

    /**
     * Встановлює обробник початку завантаження.
     */
    public void setOnUploadStart(PhotoUploadStartHandler handler) {
        this.onUploadStart = handler;
        log.debug("Встановлено обробник початку завантаження");
    }

    /**
     * Встановлює обробник успішного завантаження.
     */
    public void setOnUploadSuccess(PhotoUploadSuccessHandler handler) {
        this.onUploadSuccess = handler;
        log.debug("Встановлено обробник успішного завантаження");
    }

    /**
     * Встановлює обробник помилки завантаження.
     */
    public void setOnUploadError(PhotoUploadErrorHandler handler) {
        this.onUploadError = handler;
        log.debug("Встановлено обробник помилки завантаження");
    }

    /**
     * Встановлює обробник відхилення файлу.
     */
    public void setOnUploadRejected(PhotoUploadRejectedHandler handler) {
        this.onUploadRejected = handler;
        log.debug("Встановлено обробник відхилення файлу");
    }

    /**
     * Очищує всі статуси та попередження.
     */
    public void clearAllMessages() {
        hideStatus();
        hideWarning();
        log.debug("Очищено всі повідомлення");
    }

    /**
     * Встановлює заголовок секції.
     */
    public void setUploadTitle(String title) {
        uploadTitle.setText(title);
        log.debug("Оновлено заголовок завантаження: {}", title);
    }

    /**
     * Встановлює кастомний текст для кнопки завантаження.
     */
    public void setUploadButtonText(String text) {
        Button uploadButton = new Button(text, VaadinIcon.CAMERA.create());
        photoUpload.setUploadButton(uploadButton);
        log.debug("Оновлено текст кнопки завантаження: {}", text);
    }

    /**
     * Встановлює кастомний текст для області перетягування.
     */
    public void setDropLabelText(String text) {
        photoUpload.setDropLabel(new Span(text));
        log.debug("Оновлено текст області перетягування: {}", text);
    }

    /**
     * Перевіряє чи увімкнений компонент завантаження.
     */
    public boolean isUploadEnabled() {
        return photoUpload.isVisible();
    }

    /**
     * Примусово перериває поточне завантаження.
     */
    public void interruptUpload() {
        photoUpload.interruptUpload();
        hideStatus();
        log.debug("Завантаження перервано");
    }

    /**
     * Очищує компонент до початкового стану.
     */
    public void reset() {
        clearAllMessages();
        updateWithInitialState();
        setMaxFileSize(PhotoDocumentationState.DEFAULT_MAX_FILE_SIZE_BYTES);
        log.debug("Компонент завантаження скинуто до початкового стану");
    }
}
