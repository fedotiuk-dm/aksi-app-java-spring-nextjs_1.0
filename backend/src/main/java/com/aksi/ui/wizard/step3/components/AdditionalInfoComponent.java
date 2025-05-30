package com.aksi.ui.wizard.step3.components;

import java.util.function.BiConsumer;

import com.aksi.ui.wizard.step3.domain.OrderParametersState;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextArea;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для додаткової інформації про замовлення.
 * Відповідає за SRP - тільки примітки та вимоги клієнта.
 */
@Slf4j
public class AdditionalInfoComponent extends VerticalLayout {

    // UI елементи
    private TextArea orderNotesArea;
    private TextArea clientRequirementsArea;

    // Event handlers
    private BiConsumer<String, String> onNotesChanged;

    // Стан
    private OrderParametersState currentState;

    public AdditionalInfoComponent() {
        initializeLayout();
        createComponents();
        setupEventHandlers();

        log.debug("AdditionalInfoComponent ініціалізовано");
    }

    private void initializeLayout() {
        setPadding(false);
        setSpacing(true);
        getStyle()
            .set("background", "var(--lumo-contrast-5pct)")
            .set("padding", "var(--lumo-space-m)")
            .set("border-radius", "var(--lumo-border-radius-m)");
    }

    private void createComponents() {
        H4 sectionTitle = new H4("3.4. Додаткова інформація");
        sectionTitle.getStyle().set("margin-top", "0");

        // Примітки до замовлення
        orderNotesArea = new TextArea("Примітки до замовлення");
        orderNotesArea.setPlaceholder("Загальні примітки або особливості обробки...");
        orderNotesArea.setMaxLength(500);
        orderNotesArea.setHelperText("Максимум 500 символів");
        orderNotesArea.setWidthFull();

        // Вимоги клієнта
        clientRequirementsArea = new TextArea("Додаткові вимоги клієнта");
        clientRequirementsArea.setPlaceholder("Особливі побажання клієнта...");
        clientRequirementsArea.setMaxLength(300);
        clientRequirementsArea.setHelperText("Максимум 300 символів");
        clientRequirementsArea.setWidthFull();

        add(sectionTitle, orderNotesArea, clientRequirementsArea);
    }

    private void setupEventHandlers() {
        // Обробник для приміток
        orderNotesArea.addValueChangeListener(e -> triggerNotesChangedEvent());

        // Обробник для вимог
        clientRequirementsArea.addValueChangeListener(e -> triggerNotesChangedEvent());
    }

    private void triggerNotesChangedEvent() {
        if (onNotesChanged != null) {
            String orderNotes = orderNotesArea.getValue();
            String clientRequirements = clientRequirementsArea.getValue();
            onNotesChanged.accept(orderNotes, clientRequirements);
        }
    }

    /**
     * Оновлює компонент з поточного domain state.
     */
    public void updateFromState(OrderParametersState state) {
        this.currentState = state;

        if (state != null) {
            // Оновлюємо значення без тригера подій
            orderNotesArea.setValue(state.getOrderNotes() != null ? state.getOrderNotes() : "");
            clientRequirementsArea.setValue(state.getClientRequirements() != null ? state.getClientRequirements() : "");

            // Оновлюємо індикатори символів
            updateCharacterCounters(state);

            log.debug("Компонент оновлено з стану: примітки={} символів, вимоги={} символів",
                    state.getOrderNotes() != null ? state.getOrderNotes().length() : 0,
                    state.getClientRequirements() != null ? state.getClientRequirements().length() : 0);
        }
    }

    private void updateCharacterCounters(OrderParametersState state) {
        // Оновлення лічильника для приміток
        String orderNotes = state.getOrderNotes() != null ? state.getOrderNotes() : "";
        int orderNotesLength = orderNotes.length();
        String orderNotesHelper = String.format("%d/500 символів", orderNotesLength);
        if (orderNotesLength > 400) {
            orderNotesHelper += " (майже досягнуто ліміт)";
        }
        orderNotesArea.setHelperText(orderNotesHelper);

        // Оновлення лічильника для вимог
        String clientRequirements = state.getClientRequirements() != null ? state.getClientRequirements() : "";
        int clientRequirementsLength = clientRequirements.length();
        String clientRequirementsHelper = String.format("%d/300 символів", clientRequirementsLength);
        if (clientRequirementsLength > 250) {
            clientRequirementsHelper += " (майже досягнуто ліміт)";
        }
        clientRequirementsArea.setHelperText(clientRequirementsHelper);
    }

    /**
     * Встановлює фокус на поле приміток.
     */
    public void focusOrderNotes() {
        orderNotesArea.focus();
        log.debug("Фокус встановлено на примітки замовлення");
    }

    /**
     * Встановлює фокус на поле вимог клієнта.
     */
    public void focusClientRequirements() {
        clientRequirementsArea.focus();
        log.debug("Фокус встановлено на вимоги клієнта");
    }

    /**
     * Очищає всі поля.
     */
    public void clearAll() {
        orderNotesArea.clear();
        clientRequirementsArea.clear();
        log.debug("Всі поля очищено");
    }

    /**
     * Увімкнути/вимкнути редагування приміток.
     */
    public void setOrderNotesEnabled(boolean enabled) {
        orderNotesArea.setEnabled(enabled);
        log.debug("Редагування приміток: {}", enabled ? "увімкнено" : "вимкнено");
    }

    /**
     * Увімкнути/вимкнути редагування вимог клієнта.
     */
    public void setClientRequirementsEnabled(boolean enabled) {
        clientRequirementsArea.setEnabled(enabled);
        log.debug("Редагування вимог клієнта: {}", enabled ? "увімкнено" : "вимкнено");
    }

    /**
     * Встановлює текст-підказку для приміток.
     */
    public void setOrderNotesPlaceholder(String placeholder) {
        orderNotesArea.setPlaceholder(placeholder);
        log.debug("Встановлено підказку для приміток: {}", placeholder);
    }

    /**
     * Встановлює текст-підказку для вимог клієнта.
     */
    public void setClientRequirementsPlaceholder(String placeholder) {
        clientRequirementsArea.setPlaceholder(placeholder);
        log.debug("Встановлено підказку для вимог клієнта: {}", placeholder);
    }

    /**
     * Встановлює максимальну кількість символів для приміток.
     */
    public void setOrderNotesMaxLength(int maxLength) {
        orderNotesArea.setMaxLength(maxLength);
        log.debug("Встановлено максимальну довжину приміток: {}", maxLength);
    }

    /**
     * Встановлює максимальну кількість символів для вимог клієнта.
     */
    public void setClientRequirementsMaxLength(int maxLength) {
        clientRequirementsArea.setMaxLength(maxLength);
        log.debug("Встановлено максимальну довжину вимог клієнта: {}", maxLength);
    }

    /**
     * Додає попередньо встановлений текст до приміток.
     */
    public void appendToOrderNotes(String text) {
        String current = orderNotesArea.getValue();
        String newText = current.isEmpty() ? text : current + "\n" + text;
        orderNotesArea.setValue(newText);
        log.debug("Додано текст до приміток: {}", text);
    }

    /**
     * Додає попередньо встановлений текст до вимог клієнта.
     */
    public void appendToClientRequirements(String text) {
        String current = clientRequirementsArea.getValue();
        String newText = current.isEmpty() ? text : current + "\n" + text;
        clientRequirementsArea.setValue(newText);
        log.debug("Додано текст до вимог клієнта: {}", text);
    }

    /**
     * Отримати поточні примітки замовлення.
     */
    public String getOrderNotes() {
        return orderNotesArea.getValue();
    }

    /**
     * Отримати поточні вимоги клієнта.
     */
    public String getClientRequirements() {
        return clientRequirementsArea.getValue();
    }

    /**
     * Перевіряє чи є будь-який текст в полях.
     */
    public boolean hasAnyText() {
        return !getOrderNotes().trim().isEmpty() || !getClientRequirements().trim().isEmpty();
    }

    /**
     * Отримати загальну кількість символів.
     */
    public int getTotalCharacterCount() {
        return getOrderNotes().length() + getClientRequirements().length();
    }

    /**
     * Перевірити чи компонент валідний.
     */
    public boolean isValid() {
        return getOrderNotes().length() <= 500 && getClientRequirements().length() <= 300;
    }

    // Event handlers setters

    public void setOnNotesChanged(BiConsumer<String, String> handler) {
        this.onNotesChanged = handler;
    }

    // Геттери для тестування

    protected TextArea getOrderNotesArea() {
        return orderNotesArea;
    }

    protected TextArea getClientRequirementsArea() {
        return clientRequirementsArea;
    }
}
