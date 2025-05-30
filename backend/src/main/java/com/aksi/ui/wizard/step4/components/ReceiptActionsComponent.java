package com.aksi.ui.wizard.step4.components;

import java.io.ByteArrayInputStream;

import com.aksi.ui.wizard.step4.domain.ConfirmationState;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.html.Anchor;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.server.StreamResource;

import lombok.extern.slf4j.Slf4j;

/**
 * Компонент для дій з квитанцією (генерація, відправка email, завантаження).
 * Відповідальність: керування операціями з квитанцією та відображення їх статусу.
 */
@Slf4j
public class ReceiptActionsComponent extends VerticalLayout {

    // UI компоненти
    private Button generateReceiptButton;
    private Button emailReceiptButton;
    private Div receiptStatusPanel;
    private Div downloadSection;
    private Div progressIndicator;

    // Callbacks
    private Runnable onGenerateReceipt;
    private Runnable onEmailReceipt;

    // Поточний стан
    private ConfirmationState currentState;

    public ReceiptActionsComponent() {
        initializeComponent();
        createComponents();
        initializeLayout();
        setupEventHandlers();
        log.debug("ReceiptActionsComponent ініціалізовано");
    }

    private void initializeComponent() {
        setPadding(false);
        setSpacing(true);
        setDefaultHorizontalComponentAlignment(Alignment.STRETCH);
        addClassName("receipt-actions-component");
    }

    private void createComponents() {
        H4 sectionTitle = new H4("Формування квитанції");
        sectionTitle.getStyle().set("margin-top", "0");

        // Статусна панель
        receiptStatusPanel = createReceiptStatusPanel();

        // Кнопки дій
        HorizontalLayout actionsLayout = createActionsLayout();

        // Індикатор прогресу
        progressIndicator = createProgressIndicator();

        // Секція завантаження
        downloadSection = createDownloadSection();

        add(sectionTitle, receiptStatusPanel, actionsLayout, progressIndicator, downloadSection);
    }

    private void initializeLayout() {
        getStyle()
                .set("background", "var(--lumo-contrast-5pct)")
                .set("padding", "var(--lumo-space-m)")
                .set("border-radius", "var(--lumo-border-radius-m)")
                .set("border", "1px solid var(--lumo-contrast-20pct)");
    }

    private Div createReceiptStatusPanel() {
        Div panel = new Div();
        panel.addClassName("receipt-status-panel");
        panel.getStyle()
                .set("background", "var(--lumo-base-color)")
                .set("padding", "var(--lumo-space-s)")
                .set("border-radius", "var(--lumo-border-radius-s)")
                .set("border", "1px solid var(--lumo-contrast-10pct)")
                .set("margin-bottom", "var(--lumo-space-m)");

        Span statusText = new Span("📄 Статус квитанції: Не згенерована");
        statusText.addClassName("status-text");
        statusText.getStyle().set("font-weight", "500");

        panel.add(statusText);
        return panel;
    }

    private HorizontalLayout createActionsLayout() {
        HorizontalLayout layout = new HorizontalLayout();
        layout.setSpacing(true);
        layout.addClassName("receipt-actions-layout");

        // Кнопка генерації
        generateReceiptButton = new Button("Згенерувати PDF квитанцію", VaadinIcon.FILE_TEXT.create());
        generateReceiptButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        generateReceiptButton.addClassName("generate-receipt-button");

        // Кнопка відправки email
        emailReceiptButton = new Button("Надіслати на email", VaadinIcon.ENVELOPE.create());
        emailReceiptButton.setEnabled(false);
        emailReceiptButton.addClassName("email-receipt-button");

        layout.add(generateReceiptButton, emailReceiptButton);
        return layout;
    }

    private Div createProgressIndicator() {
        Div indicator = new Div();
        indicator.addClassName("progress-indicator");
        indicator.setVisible(false);
        indicator.getStyle()
                .set("background", "var(--lumo-primary-color-10pct)")
                .set("padding", "var(--lumo-space-s)")
                .set("border-radius", "var(--lumo-border-radius-s)")
                .set("border-left", "3px solid var(--lumo-primary-color)")
                .set("margin-bottom", "var(--lumo-space-m)");

        return indicator;
    }

    private Div createDownloadSection() {
        Div section = new Div();
        section.addClassName("download-section");
        section.setVisible(false);
        section.getStyle()
                .set("background", "var(--lumo-success-color-10pct)")
                .set("padding", "var(--lumo-space-m)")
                .set("border-radius", "var(--lumo-border-radius-s)")
                .set("border-left", "3px solid var(--lumo-success-color)")
                .set("margin-top", "var(--lumo-space-m)");

        return section;
    }

    private void setupEventHandlers() {
        generateReceiptButton.addClickListener(event -> {
            if (onGenerateReceipt != null) {
                onGenerateReceipt.run();
            }
        });

        emailReceiptButton.addClickListener(event -> {
            if (onEmailReceipt != null) {
                onEmailReceipt.run();
            }
        });
    }

    /**
     * Оновлює компонент з поточного стану.
     */
    public void updateFromState(ConfirmationState state) {
        if (state == null) {
            log.warn("Спроба оновлення з null state");
            return;
        }

        this.currentState = state;
        updateReceiptStatus(state);
        updateButtonsState(state);
        updateDownloadSection(state);

        log.debug("ReceiptActionsComponent оновлено з стану");
    }

    private void updateReceiptStatus(ConfirmationState state) {
        Span statusText = (Span) receiptStatusPanel.getChildren()
                .filter(component -> component.hasClassName("status-text"))
                .findFirst()
                .orElse(null);

        if (statusText == null) return;

        if (state.isReceiptGenerated()) {
            statusText.setText("📄 Статус квитанції: Згенерована ✅");
            statusText.getStyle().set("color", "var(--lumo-success-text-color)");

            receiptStatusPanel.getStyle()
                    .set("background", "var(--lumo-success-color-10pct)")
                    .set("border-color", "var(--lumo-success-color-50pct)");

            // Додаємо інформацію про файл
            if (state.getReceiptFileName() != null) {
                Span fileInfo = new Span("📋 Файл: " + state.getReceiptFileName());
                fileInfo.addClassName("file-info");
                fileInfo.getStyle()
                        .set("display", "block")
                        .set("font-size", "var(--lumo-font-size-s)")
                        .set("color", "var(--lumo-secondary-text-color)")
                        .set("margin-top", "var(--lumo-space-xs)");

                // Додаємо тільки якщо ще не додано
                if (receiptStatusPanel.getChildren().noneMatch(comp -> comp.hasClassName("file-info"))) {
                    receiptStatusPanel.add(fileInfo);
                }
            }
        } else {
            statusText.setText("📄 Статус квитанції: Не згенерована");
            statusText.getStyle().set("color", "var(--lumo-secondary-text-color)");

            receiptStatusPanel.getStyle()
                    .set("background", "var(--lumo-base-color)")
                    .set("border-color", "var(--lumo-contrast-10pct)");

            // Видаляємо інформацію про файл
            receiptStatusPanel.getChildren()
                    .filter(comp -> comp.hasClassName("file-info"))
                    .findFirst()
                    .ifPresent(receiptStatusPanel::remove);
        }
    }

    private void updateButtonsState(ConfirmationState state) {
        // Генерація квитанції
        generateReceiptButton.setEnabled(!state.isLoading());

        if (state.isReceiptGenerated()) {
            generateReceiptButton.setText("Перегенерувати PDF");
            generateReceiptButton.setIcon(VaadinIcon.REFRESH.create());
        } else {
            generateReceiptButton.setText("Згенерувати PDF квитанцію");
            generateReceiptButton.setIcon(VaadinIcon.FILE_TEXT.create());
        }

        // Email кнопка
        emailReceiptButton.setEnabled(state.isCanSendEmail() && !state.isLoading());

        if (state.isEmailSent()) {
            emailReceiptButton.setText("Email надіслано ✅");
            emailReceiptButton.addThemeVariants(ButtonVariant.LUMO_SUCCESS);
        } else if (state.isCanSendEmail()) {
            emailReceiptButton.setText("Надіслати на email");
            emailReceiptButton.removeThemeVariants(ButtonVariant.LUMO_SUCCESS);
        } else {
            emailReceiptButton.setText("Email недоступний");
            emailReceiptButton.removeThemeVariants(ButtonVariant.LUMO_SUCCESS);
        }
    }

    private void updateDownloadSection(ConfirmationState state) {
        if (state.isReceiptGenerated() && state.getGeneratedReceiptBytes() != null) {
            downloadSection.setVisible(true);
            downloadSection.removeAll();

            // Заголовок секції
            Span sectionTitle = new Span("📥 Завантаження квитанції");
            sectionTitle.getStyle()
                    .set("font-weight", "bold")
                    .set("display", "block")
                    .set("margin-bottom", "var(--lumo-space-s)");

            // Створюємо StreamResource для завантаження
            StreamResource resource = new StreamResource(
                    state.getReceiptFileName(),
                    () -> new ByteArrayInputStream(state.getGeneratedReceiptBytes())
            );

            // Посилання для завантаження
            Anchor downloadLink = new Anchor(resource, "📄 Завантажити PDF квитанцію");
            downloadLink.getElement().setAttribute("download", true);
            downloadLink.addClassName("download-link");
            downloadLink.getStyle()
                    .set("font-weight", "bold")
                    .set("color", "var(--lumo-primary-text-color)")
                    .set("text-decoration", "none")
                    .set("display", "inline-block")
                    .set("padding", "var(--lumo-space-s)")
                    .set("background", "var(--lumo-primary-color-10pct)")
                    .set("border-radius", "var(--lumo-border-radius-s)")
                    .set("border", "1px solid var(--lumo-primary-color-50pct)");

            // Інформація про розмір файлу
            Span sizeInfo = new Span(String.format("Розмір: %.1f KB",
                    state.getGeneratedReceiptBytes().length / 1024.0));
            sizeInfo.getStyle()
                    .set("font-size", "var(--lumo-font-size-s)")
                    .set("color", "var(--lumo-secondary-text-color)")
                    .set("display", "block")
                    .set("margin-top", "var(--lumo-space-xs)");

            downloadSection.add(sectionTitle, downloadLink, sizeInfo);
        } else {
            downloadSection.setVisible(false);
        }
    }

    /**
     * Показує прогрес операції.
     */
    public void showProgress(String operation, String message) {
        progressIndicator.removeAll();
        progressIndicator.setVisible(true);

        Span operationSpan = new Span("⏳ " + message);
        operationSpan.getStyle()
                .set("font-weight", "500")
                .set("color", "var(--lumo-primary-text-color)");

        progressIndicator.add(operationSpan);
        log.debug("Показано прогрес операції: {}", operation);
    }

    /**
     * Приховує індикатор прогресу.
     */
    public void hideProgress() {
        progressIndicator.setVisible(false);
        log.debug("Індикатор прогресу приховано");
    }

    /**
     * Показує стан завантаження.
     */
    public void showLoading(boolean loading, String message) {
        if (loading) {
            showProgress("loading", message != null ? message : "Обробка...");
            generateReceiptButton.setEnabled(false);
            emailReceiptButton.setEnabled(false);
            addClassName("loading-state");
        } else {
            hideProgress();
            updateButtonsState(currentState != null ? currentState :
                    ConfirmationState.builder().isLoading(false).build());
            removeClassName("loading-state");
        }
    }

    /**
     * Показує стан помилки.
     */
    public void showError(boolean hasError, String errorMessage) {
        if (hasError) {
            addClassName("error-state");

            if (errorMessage != null) {
                Span errorSpan = new Span("❌ " + errorMessage);
                errorSpan.addClassName("error-message");
                errorSpan.getStyle()
                        .set("color", "var(--lumo-error-text-color)")
                        .set("font-weight", "500")
                        .set("display", "block")
                        .set("margin-top", "var(--lumo-space-s)")
                        .set("padding", "var(--lumo-space-s)")
                        .set("background", "var(--lumo-error-color-10pct)")
                        .set("border-radius", "var(--lumo-border-radius-s)");

                // Додаємо повідомлення про помилку, якщо ще не додано
                if (getChildren().noneMatch(comp -> comp.hasClassName("error-message"))) {
                    add(errorSpan);
                }
            }
        } else {
            removeClassName("error-state");
            // Видаляємо повідомлення про помилку
            getChildren()
                    .filter(comp -> comp.hasClassName("error-message"))
                    .findFirst()
                    .ifPresent(this::remove);
        }
    }

    /**
     * Встановлює компактний режим відображення.
     */
    public void setCompactMode(boolean compact) {
        if (compact) {
            addClassName("compact-mode");
            receiptStatusPanel.setVisible(false);
        } else {
            removeClassName("compact-mode");
            receiptStatusPanel.setVisible(true);
        }
        log.debug("Компактний режим встановлено: {}", compact);
    }

    /**
     * Встановлює callback для генерації квитанції.
     */
    public void setOnGenerateReceipt(Runnable callback) {
        this.onGenerateReceipt = callback;
        log.debug("Generate receipt callback встановлено");
    }

    /**
     * Встановлює callback для відправки email.
     */
    public void setOnEmailReceipt(Runnable callback) {
        this.onEmailReceipt = callback;
        log.debug("Email receipt callback встановлено");
    }

    /**
     * Перевіряє чи квитанція згенерована.
     */
    public boolean isReceiptGenerated() {
        return currentState != null && currentState.isReceiptGenerated();
    }

    /**
     * Перевіряє чи можна відправити email.
     */
    public boolean canSendEmail() {
        return currentState != null && currentState.isCanSendEmail();
    }

    // Геттери для тестування
    protected Button getGenerateReceiptButton() { return generateReceiptButton; }
    protected Button getEmailReceiptButton() { return emailReceiptButton; }
    protected Div getReceiptStatusPanel() { return receiptStatusPanel; }
    protected Div getDownloadSection() { return downloadSection; }
    protected Div getProgressIndicator() { return progressIndicator; }
}
