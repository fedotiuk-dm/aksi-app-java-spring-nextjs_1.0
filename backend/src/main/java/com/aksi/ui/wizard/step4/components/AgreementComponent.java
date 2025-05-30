package com.aksi.ui.wizard.step4.components;

import java.util.function.Consumer;

import com.aksi.ui.wizard.step4.domain.ConfirmationState;
import com.vaadin.flow.component.checkbox.Checkbox;
import com.vaadin.flow.component.html.Anchor;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * Компонент для юридичних аспектів підтвердження замовлення.
 * Відповідальність: управління угодою, посилання на документи, цифровий підпис.
 */
@Slf4j
public class AgreementComponent extends VerticalLayout {

    // UI компоненти
    private Checkbox agreementCheckbox;
    private Anchor termsLink;
    private Div signatureInfo;
    private Div statusIndicator;

    // Callbacks
    private Consumer<Boolean> onAgreementChange;

    // Поточний стан
    private ConfirmationState currentState;

    public AgreementComponent() {
        initializeComponent();
        createComponents();
        initializeLayout();
        setupEventHandlers();
        log.debug("AgreementComponent ініціалізовано");
    }

    private void initializeComponent() {
        setPadding(false);
        setSpacing(true);
        setDefaultHorizontalComponentAlignment(Alignment.STRETCH);
        addClassName("agreement-component");
    }

    private void createComponents() {
        H4 sectionTitle = new H4("Юридичні аспекти");
        sectionTitle.getStyle().set("margin-top", "0");

        // Чекбокс угоди
        agreementCheckbox = new Checkbox("Я погоджуюсь з умовами надання послуг");
        agreementCheckbox.addClassName("agreement-checkbox");
        agreementCheckbox.getStyle()
                .set("font-weight", "500")
                .set("font-size", "var(--lumo-font-size-m)");

        // Посилання на документи
        termsLink = new Anchor("#", "📋 Переглянути умови надання послуг");
        termsLink.setTarget("_blank");
        termsLink.addClassName("terms-link");
        termsLink.getStyle()
                .set("display", "block")
                .set("margin-top", "var(--lumo-space-s)")
                .set("color", "var(--lumo-primary-text-color)")
                .set("text-decoration", "underline");

        // Інформація про цифровий підпис
        signatureInfo = createSignatureInfoSection();

        // Індикатор статусу
        statusIndicator = createStatusIndicator();

        add(sectionTitle, agreementCheckbox, termsLink, signatureInfo, statusIndicator);
    }

    private void initializeLayout() {
        getStyle()
                .set("background", "var(--lumo-contrast-5pct)")
                .set("padding", "var(--lumo-space-m)")
                .set("border-radius", "var(--lumo-border-radius-m)")
                .set("border", "1px solid var(--lumo-contrast-20pct)");
    }

    private Div createSignatureInfoSection() {
        Div section = new Div();
        section.addClassName("signature-info-section");
        section.getStyle()
                .set("background", "var(--lumo-primary-color-10pct)")
                .set("padding", "var(--lumo-space-s)")
                .set("border-radius", "var(--lumo-border-radius-s)")
                .set("margin-top", "var(--lumo-space-s)")
                .set("border-left", "3px solid var(--lumo-primary-color)");

        Span signatureText = new Span("✍️ Цифровий підпис буде включено до квитанції");
        signatureText.getStyle()
                .set("font-size", "var(--lumo-font-size-s)")
                .set("color", "var(--lumo-primary-text-color)");

        Span signatureDetails = new Span("Підпис фіксується автоматично при прийнятті угоди");
        signatureDetails.getStyle()
                .set("font-size", "var(--lumo-font-size-xs)")
                .set("color", "var(--lumo-secondary-text-color)")
                .set("display", "block")
                .set("margin-top", "var(--lumo-space-xs)");

        section.add(signatureText, signatureDetails);
        return section;
    }

    private Div createStatusIndicator() {
        Div indicator = new Div();
        indicator.addClassName("agreement-status-indicator");
        indicator.getStyle()
                .set("margin-top", "var(--lumo-space-m)")
                .set("padding", "var(--lumo-space-s)")
                .set("border-radius", "var(--lumo-border-radius-s)")
                .set("text-align", "center")
                .set("font-weight", "500");

        return indicator;
    }

    private void setupEventHandlers() {
        agreementCheckbox.addValueChangeListener(event -> {
            boolean isAccepted = event.getValue();
            handleAgreementChange(isAccepted);
            if (onAgreementChange != null) {
                onAgreementChange.accept(isAccepted);
            }
        });
    }

    private void handleAgreementChange(boolean isAccepted) {
        updateStatusIndicator(isAccepted);
        updateSignatureInfoVisibility(isAccepted);
        log.debug("Угода змінена на: {}", isAccepted);
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
        updateAgreementCheckbox(state);
        updateStatusIndicator(state.isAgreementAccepted());
        updateSignatureInfoVisibility(state.isAgreementAccepted());

        log.debug("AgreementComponent оновлено з стану");
    }

    private void updateAgreementCheckbox(ConfirmationState state) {
        // Встановлюємо значення без тригера подій
        agreementCheckbox.setValue(state.isAgreementAccepted());
    }

    private void updateStatusIndicator(boolean isAccepted) {
        statusIndicator.removeAll();

        if (isAccepted) {
            Span acceptedIcon = new Span("✅");
            Span acceptedText = new Span("Угоду прийнято");
            acceptedText.getStyle().set("margin-left", "var(--lumo-space-xs)");

            statusIndicator.getStyle()
                    .set("background", "var(--lumo-success-color-10pct)")
                    .set("color", "var(--lumo-success-text-color)")
                    .set("border", "1px solid var(--lumo-success-color-50pct)");

            statusIndicator.add(acceptedIcon, acceptedText);
        } else {
            Span pendingIcon = new Span("⏳");
            Span pendingText = new Span("Очікується прийняття умов");
            pendingText.getStyle().set("margin-left", "var(--lumo-space-xs)");

            statusIndicator.getStyle()
                    .set("background", "var(--lumo-contrast-10pct)")
                    .set("color", "var(--lumo-secondary-text-color)")
                    .set("border", "1px solid var(--lumo-contrast-30pct)");

            statusIndicator.add(pendingIcon, pendingText);
        }
    }

    private void updateSignatureInfoVisibility(boolean isAccepted) {
        if (isAccepted) {
            signatureInfo.getStyle()
                    .set("opacity", "1")
                    .set("background", "var(--lumo-success-color-10pct)")
                    .set("border-left-color", "var(--lumo-success-color)");
        } else {
            signatureInfo.getStyle()
                    .set("opacity", "0.7")
                    .set("background", "var(--lumo-primary-color-10pct)")
                    .set("border-left-color", "var(--lumo-primary-color)");
        }
    }

    /**
     * Встановлює callback для зміни угоди.
     */
    public void setOnAgreementChange(Consumer<Boolean> callback) {
        this.onAgreementChange = callback;
        log.debug("Agreement change callback встановлено");
    }

    /**
     * Показує стан завантаження.
     */
    public void showLoading(boolean loading) {
        agreementCheckbox.setEnabled(!loading);
        if (loading) {
            addClassName("loading-state");
        } else {
            removeClassName("loading-state");
        }
    }

    /**
     * Показує стан помилки.
     */
    public void showError(boolean hasError) {
        if (hasError) {
            addClassName("error-state");
            statusIndicator.getStyle()
                    .set("background", "var(--lumo-error-color-10pct)")
                    .set("color", "var(--lumo-error-text-color)")
                    .set("border", "1px solid var(--lumo-error-color-50pct)");
        } else {
            removeClassName("error-state");
            updateStatusIndicator(currentState != null ? currentState.isAgreementAccepted() : false);
        }
    }

    /**
     * Встановлює компактний режим відображення.
     */
    public void setCompactMode(boolean compact) {
        if (compact) {
            addClassName("compact-mode");
            signatureInfo.setVisible(false);
        } else {
            removeClassName("compact-mode");
            signatureInfo.setVisible(true);
        }
        log.debug("Компактний режим встановлено: {}", compact);
    }

    /**
     * Програмно встановлює стан угоди.
     */
    public void setAgreementAccepted(boolean accepted) {
        agreementCheckbox.setValue(accepted);
    }

    /**
     * Перевіряє чи прийнята угода.
     */
    public boolean isAgreementAccepted() {
        return agreementCheckbox.getValue();
    }

    /**
     * Встановлює URL для умов надання послуг.
     */
    public void setTermsUrl(String url) {
        if (url != null && !url.trim().isEmpty()) {
            termsLink.setHref(url);
            termsLink.setVisible(true);
        } else {
            termsLink.setVisible(false);
        }
    }

    /**
     * Показує додаткову інформацію про угоду.
     */
    public void showAgreementDetails(String details) {
        if (details != null && !details.trim().isEmpty()) {
            Span detailsSpan = new Span(details);
            detailsSpan.addClassName("agreement-details");
            detailsSpan.getStyle()
                    .set("font-size", "var(--lumo-font-size-xs)")
                    .set("color", "var(--lumo-secondary-text-color)")
                    .set("display", "block")
                    .set("margin-top", "var(--lumo-space-xs)");

            // Додаємо після чекбокса, якщо ще не додано
            if (getChildren().noneMatch(component -> component.hasClassName("agreement-details"))) {
                addComponentAtIndex(2, detailsSpan); // Після чекбокса
            }
        }
    }

    // Геттери для тестування
    protected Checkbox getAgreementCheckbox() { return agreementCheckbox; }
    protected Anchor getTermsLink() { return termsLink; }
    protected Div getSignatureInfo() { return signatureInfo; }
    protected Div getStatusIndicator() { return statusIndicator; }
}
