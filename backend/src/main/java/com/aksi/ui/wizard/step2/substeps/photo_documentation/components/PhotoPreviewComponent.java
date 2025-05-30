package com.aksi.ui.wizard.step2.substeps.photo_documentation.components;

import java.io.ByteArrayInputStream;
import java.util.List;

import com.aksi.ui.wizard.step2.substeps.photo_documentation.domain.PhotoDocumentationState;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.html.Image;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.server.StreamResource;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для попереднього перегляду завантажених фото.
 * Дотримується принципу Single Responsibility Principle (SRP).
 */
@Slf4j
public class PhotoPreviewComponent extends VerticalLayout {

    // UI компоненти
    private H4 previewTitle;
    private VerticalLayout photosContainer;
    private Span emptyMessage;
    private Span totalSizeLabel;

    // Callback interface
    @FunctionalInterface
    public interface PhotoDeleteHandler {
        void onPhotoDelete(PhotoDocumentationState.PhotoInfo photo, int index);
    }

    // Event handler
    private PhotoDeleteHandler onPhotoDelete;

    public PhotoPreviewComponent() {
        log.debug("Ініціалізація PhotoPreviewComponent");

        initializeLayout();
        createComponents();
        updateWithInitialState();

        log.debug("PhotoPreviewComponent ініціалізовано успішно");
    }

    private void initializeLayout() {
        setPadding(false);
        setSpacing(true);
        setWidthFull();
    }

    private void createComponents() {
        // Заголовок секції
        previewTitle = new H4("Завантажені фото");
        previewTitle.getStyle()
            .set("margin-top", "0")
            .set("margin-bottom", "var(--lumo-space-s)");

        // Лейбл загального розміру
        totalSizeLabel = new Span("Загальний розмір: 0 байт");
        totalSizeLabel.getStyle()
            .set("color", "var(--lumo-secondary-text-color)")
            .set("font-size", "var(--lumo-font-size-s)")
            .set("margin-bottom", "var(--lumo-space-s)");

        // Контейнер для фото
        photosContainer = new VerticalLayout();
        photosContainer.setPadding(false);
        photosContainer.setSpacing(true);

        // Повідомлення про порожній список
        emptyMessage = new Span("Фото ще не завантажено");
        emptyMessage.getStyle()
            .set("color", "var(--lumo-secondary-text-color)")
            .set("font-style", "italic")
            .set("text-align", "center")
            .set("padding", "var(--lumo-space-m)");

        add(previewTitle, totalSizeLabel, photosContainer);
    }

    private void updateWithInitialState() {
        showEmptyState();
    }

    /**
     * Оновлює список фото з domain state.
     */
    public void updateFromState(PhotoDocumentationState state) {
        log.debug("Оновлення попереднього перегляду: {} фото", state.getPhotosCount());

        updateTotalSize(state.getFormattedTotalSize());
        updatePhotosList(state.getUploadedPhotos());
    }

    /**
     * Оновлює список фото.
     */
    public void updatePhotosList(List<PhotoDocumentationState.PhotoInfo> photos) {
        photosContainer.removeAll();

        if (photos.isEmpty()) {
            showEmptyState();
            return;
        }

        hideEmptyState();

        for (int i = 0; i < photos.size(); i++) {
            PhotoDocumentationState.PhotoInfo photo = photos.get(i);
            HorizontalLayout photoItem = createPhotoPreviewItem(photo, i);
            photosContainer.add(photoItem);
        }

        log.debug("Оновлено список фото: {} елементів", photos.size());
    }

    /**
     * Створює елемент попереднього перегляду фото.
     */
    private HorizontalLayout createPhotoPreviewItem(PhotoDocumentationState.PhotoInfo photo, int index) {
        HorizontalLayout photoItem = new HorizontalLayout();
        photoItem.setAlignItems(FlexComponent.Alignment.CENTER);
        photoItem.setSpacing(true);
        photoItem.setPadding(true);
        photoItem.setWidthFull();
        photoItem.getStyle()
            .set("border", "1px solid var(--lumo-contrast-20pct)")
            .set("border-radius", "var(--lumo-border-radius-m)")
            .set("background", "var(--lumo-contrast-5pct)");

        // Мініатюра
        Image thumbnail = createThumbnail(photo);

        // Інформація про файл
        VerticalLayout fileInfo = createFileInfo(photo);

        // Кнопка видалення
        Button deleteButton = createDeleteButton(photo, index);

        photoItem.add(thumbnail, fileInfo, deleteButton);
        photoItem.setFlexGrow(1, fileInfo);

        return photoItem;
    }

    /**
     * Створює мініатюру фото.
     */
    private Image createThumbnail(PhotoDocumentationState.PhotoInfo photo) {
        // Створюємо StreamResource для показу зображення
        StreamResource imageResource = new StreamResource(
            photo.getFileName(),
            () -> new ByteArrayInputStream(photo.getData())
        );

        Image thumbnail = new Image(imageResource, photo.getFileName());
        thumbnail.setWidth("80px");
        thumbnail.setHeight("80px");
        thumbnail.getStyle()
            .set("object-fit", "cover")
            .set("border-radius", "var(--lumo-border-radius-s)")
            .set("border", "1px solid var(--lumo-contrast-20pct)")
            .set("flex-shrink", "0");

        return thumbnail;
    }

    /**
     * Створює інформацію про файл.
     */
    private VerticalLayout createFileInfo(PhotoDocumentationState.PhotoInfo photo) {
        VerticalLayout fileInfo = new VerticalLayout();
        fileInfo.setPadding(false);
        fileInfo.setSpacing(false);

        // Назва файлу
        Span fileName = new Span(photo.getFileName());
        fileName.getStyle()
            .set("font-weight", "bold")
            .set("color", "var(--lumo-body-text-color)")
            .set("word-break", "break-word");

        // Розмір файлу
        Span fileSize = new Span(photo.getFormattedSize());
        fileSize.getStyle()
            .set("color", "var(--lumo-secondary-text-color)")
            .set("font-size", "var(--lumo-font-size-s)");

        // MIME тип
        Span mimeType = new Span(photo.getMimeType());
        mimeType.getStyle()
            .set("color", "var(--lumo-tertiary-text-color)")
            .set("font-size", "var(--lumo-font-size-xs)")
            .set("font-style", "italic");

        fileInfo.add(fileName, fileSize, mimeType);
        return fileInfo;
    }

    /**
     * Створює кнопку видалення.
     */
    private Button createDeleteButton(PhotoDocumentationState.PhotoInfo photo, int index) {
        Button deleteButton = new Button(VaadinIcon.TRASH.create());
        deleteButton.addThemeVariants(ButtonVariant.LUMO_TERTIARY, ButtonVariant.LUMO_ERROR);
        deleteButton.setTooltipText("Видалити фото");
        deleteButton.getStyle()
            .set("flex-shrink", "0");

        deleteButton.addClickListener(e -> {
            log.debug("Запит на видалення фото: {} (індекс: {})", photo.getFileName(), index);

            if (onPhotoDelete != null) {
                onPhotoDelete.onPhotoDelete(photo, index);
            }
        });

        return deleteButton;
    }

    /**
     * Показує стан порожнього списку.
     */
    private void showEmptyState() {
        photosContainer.removeAll();
        photosContainer.add(emptyMessage);

        log.debug("Показано стан порожнього списку фото");
    }

    /**
     * Приховує стан порожнього списку.
     */
    private void hideEmptyState() {
        if (photosContainer.getComponentCount() == 1 &&
            photosContainer.getComponentAt(0) == emptyMessage) {
            photosContainer.removeAll();
        }
    }

    /**
     * Оновлює інформацію про загальний розмір.
     */
    private void updateTotalSize(String formattedTotalSize) {
        totalSizeLabel.setText("Загальний розмір: " + formattedTotalSize);
        log.debug("Оновлено загальний розмір: {}", formattedTotalSize);
    }

    /**
     * Видаляє конкретне фото за індексом.
     */
    public void removePhotoAt(int index) {
        if (index >= 0 && index < photosContainer.getComponentCount()) {
            // Перевіряємо чи не емпті стейт
            if (photosContainer.getComponentAt(0) != emptyMessage) {
                photosContainer.removeAll();
                log.debug("Видалено фото за індексом: {}", index);
            }
        }
    }

    /**
     * Додає одне фото до списку.
     */
    public void addPhoto(PhotoDocumentationState.PhotoInfo photo, int index) {
        hideEmptyState();

        HorizontalLayout photoItem = createPhotoPreviewItem(photo, index);
        photosContainer.add(photoItem);

        log.debug("Додано фото: {} (індекс: {})", photo.getFileName(), index);
    }

    /**
     * Встановлює обробник видалення фото.
     */
    public void setOnPhotoDelete(PhotoDeleteHandler handler) {
        this.onPhotoDelete = handler;
        log.debug("Встановлено обробник видалення фото");
    }

    /**
     * Встановлює заголовок секції.
     */
    public void setPreviewTitle(String title) {
        previewTitle.setText(title);
        log.debug("Оновлено заголовок попереднього перегляду: {}", title);
    }

    /**
     * Встановлює кастомне повідомлення для порожнього стану.
     */
    public void setEmptyMessage(String message) {
        emptyMessage.setText(message);
        log.debug("Оновлено повідомлення порожнього стану: {}", message);
    }

    /**
     * Показує або ховає лейбл загального розміру.
     */
    public void setTotalSizeVisible(boolean visible) {
        totalSizeLabel.setVisible(visible);
        log.debug("Лейбл загального розміру {}", visible ? "показаний" : "схований");
    }

    /**
     * Перевіряє чи список фото порожній.
     */
    public boolean isEmpty() {
        return photosContainer.getComponentCount() == 0 ||
               (photosContainer.getComponentCount() == 1 &&
                photosContainer.getComponentAt(0) == emptyMessage);
    }

    /**
     * Повертає кількість відображених фото.
     */
    public int getPhotosCount() {
        if (isEmpty()) {
            return 0;
        }
        return photosContainer.getComponentCount();
    }

    /**
     * Очищує всі фото та повертає до початкового стану.
     */
    public void clear() {
        photosContainer.removeAll();
        updateTotalSize("0 байт");
        showEmptyState();
        log.debug("Попередній перегляд очищено");
    }

    /**
     * Встановлює режим компактного відображення.
     */
    public void setCompactMode(boolean compact) {
        if (compact) {
            // Зменшуємо розмір мініатюр
            photosContainer.getChildren().forEach(component -> {
                if (component instanceof HorizontalLayout) {
                    HorizontalLayout photoItem = (HorizontalLayout) component;
                    Image thumbnail = (Image) photoItem.getComponentAt(0);
                    thumbnail.setWidth("60px");
                    thumbnail.setHeight("60px");
                }
            });
        } else {
            // Стандартний розмір мініатюр
            photosContainer.getChildren().forEach(component -> {
                if (component instanceof HorizontalLayout) {
                    HorizontalLayout photoItem = (HorizontalLayout) component;
                    Image thumbnail = (Image) photoItem.getComponentAt(0);
                    thumbnail.setWidth("80px");
                    thumbnail.setHeight("80px");
                }
            });
        }

        log.debug("Режим компактного відображення: {}", compact);
    }

    /**
     * Встановлює максимальну висоту контейнера фото.
     */
    public void setMaxHeight(String maxHeight) {
        photosContainer.getStyle().set("max-height", maxHeight);
        photosContainer.getStyle().set("overflow-y", "auto");
        log.debug("Встановлено максимальну висоту: {}", maxHeight);
    }
}
