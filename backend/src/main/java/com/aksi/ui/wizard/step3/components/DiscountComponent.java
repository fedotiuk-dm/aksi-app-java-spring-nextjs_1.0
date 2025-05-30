package com.aksi.ui.wizard.step3.components;

import java.math.BigDecimal;
import java.util.function.Consumer;

import com.aksi.ui.wizard.step3.domain.OrderParametersState;
import com.aksi.ui.wizard.step3.domain.OrderParametersState.DiscountType;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.radiobutton.RadioButtonGroup;
import com.vaadin.flow.component.textfield.NumberField;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для управління знижками.
 * Відповідає за SRP - тільки тип знижки та кастомні відсотки.
 */
@Slf4j
public class DiscountComponent extends VerticalLayout {

    // UI елементи
    private RadioButtonGroup<DiscountType> discountTypeGroup;
    private NumberField customDiscountField;
    private Div discountWarningPanel;

    // Event handlers
    private Consumer<DiscountType> onDiscountTypeChanged;
    private Consumer<BigDecimal> onCustomDiscountChanged;

    // Стан
    private OrderParametersState currentState;

    public DiscountComponent() {
        initializeLayout();
        createComponents();
        setupEventHandlers();

        log.debug("DiscountComponent ініціалізовано");
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
        H4 sectionTitle = new H4("3.2. Знижки (глобальні для замовлення)");
        sectionTitle.getStyle().set("margin-top", "0");

        // Тип знижки
        discountTypeGroup = new RadioButtonGroup<>();
        discountTypeGroup.setLabel("Тип знижки");
        discountTypeGroup.setItems(DiscountType.values());
        discountTypeGroup.setValue(DiscountType.NONE);

        // Поле для користувацької знижки
        customDiscountField = new NumberField("Відсоток знижки");
        customDiscountField.setMin(0);
        customDiscountField.setMax(50);
        customDiscountField.setSuffixComponent(new Span("%"));
        customDiscountField.setVisible(false);
        customDiscountField.setPlaceholder("0-50");
        customDiscountField.setHelperText("Максимум 50%");

        // Попередження про обмеження знижок
        discountWarningPanel = new Div();

        add(sectionTitle, discountTypeGroup, customDiscountField, discountWarningPanel);
    }

    private void setupEventHandlers() {
        discountTypeGroup.addValueChangeListener(e -> {
            DiscountType newType = e.getValue();
            if (newType != null && onDiscountTypeChanged != null) {
                onDiscountTypeChanged.accept(newType);
            }
        });

        customDiscountField.addValueChangeListener(e -> {
            Double value = e.getValue();
            if (value != null && onCustomDiscountChanged != null) {
                BigDecimal percent = BigDecimal.valueOf(value);
                onCustomDiscountChanged.accept(percent);
            }
        });
    }

    /**
     * Оновлює компонент з поточного domain state.
     */
    public void updateFromState(OrderParametersState state) {
        this.currentState = state;

        if (state != null) {
            // Оновлюємо тип знижки без тригера події
            discountTypeGroup.setValue(state.getDiscountType());

            // Оновлюємо кастомне поле
            updateCustomDiscountField(state);

            // Оновлюємо попередження
            updateDiscountWarnings(state);

            // Оновлюємо валідацію
            updateValidationStyles(state);

            log.debug("Компонент оновлено з стану: тип={}, кастомний відсоток={}",
                    state.getDiscountType(), state.getCustomDiscountPercent());
        }
    }

    private void updateCustomDiscountField(OrderParametersState state) {
        customDiscountField.setVisible(state.isShowCustomDiscountField());

        if (state.getDiscountType() == DiscountType.CUSTOM) {
            customDiscountField.setValue(state.getCustomDiscountPercent().doubleValue());
        }
    }

    private void updateDiscountWarnings(OrderParametersState state) {
        discountWarningPanel.removeAll();

        if (state.isShowDiscountWarning() && !state.getDiscountWarnings().isEmpty()) {
            for (String warning : state.getDiscountWarnings()) {
                Span warningSpan = createWarningSpan(warning);
                discountWarningPanel.add(warningSpan);
            }
        }
    }

    private Span createWarningSpan(String warning) {
        Span warningSpan = new Span("⚠️ " + warning);
        warningSpan.getStyle()
            .set("color", "var(--lumo-warning-text-color)")
            .set("font-size", "var(--lumo-font-size-s)")
            .set("padding", "var(--lumo-space-xs)")
            .set("background", "var(--lumo-warning-color-10pct)")
            .set("border-radius", "var(--lumo-border-radius-s)")
            .set("display", "block")
            .set("margin-top", "var(--lumo-space-xs)");
        return warningSpan;
    }

    private void updateValidationStyles(OrderParametersState state) {
        // Валідація кастомної знижки
        if (state.getDiscountType() == DiscountType.CUSTOM) {
            boolean isValid = state.getCustomDiscountPercent() != null &&
                            state.getCustomDiscountPercent().compareTo(BigDecimal.ZERO) >= 0 &&
                            state.getCustomDiscountPercent().compareTo(BigDecimal.valueOf(50)) <= 0;

            customDiscountField.setInvalid(!isValid);
            if (!isValid) {
                customDiscountField.setErrorMessage("Відсоток повинен бути від 0 до 50");
            } else {
                customDiscountField.setErrorMessage(null);
            }
        } else {
            customDiscountField.setInvalid(false);
            customDiscountField.setErrorMessage(null);
        }

        // Підсвічування активної знижки
        if (state.hasDiscount()) {
            discountTypeGroup.getStyle().set("background", "var(--lumo-success-color-10pct)");
        } else {
            discountTypeGroup.getStyle().remove("background");
        }
    }

    /**
     * Додає додаткове попередження.
     */
    public void showAdditionalWarning(String message) {
        Span additionalWarning = createWarningSpan(message);
        discountWarningPanel.add(additionalWarning);
        log.debug("Додано додаткове попередження: {}", message);
    }

    /**
     * Очищає всі попередження.
     */
    public void clearWarnings() {
        discountWarningPanel.removeAll();
        log.debug("Попередження очищено");
    }

    /**
     * Увімкнути/вимкнути вибір типу знижки.
     */
    public void setDiscountTypeEnabled(boolean enabled) {
        discountTypeGroup.setEnabled(enabled);
        log.debug("Вибір типу знижки: {}", enabled ? "увімкнено" : "вимкнено");
    }

    /**
     * Увімкнути/вимкнути поле кастомної знижки.
     */
    public void setCustomDiscountEnabled(boolean enabled) {
        customDiscountField.setEnabled(enabled);
        log.debug("Поле кастомної знижки: {}", enabled ? "увімкнено" : "вимкнено");
    }

    /**
     * Встановити діапазон для кастомної знижки.
     */
    public void setCustomDiscountRange(double min, double max) {
        customDiscountField.setMin(min);
        customDiscountField.setMax(max);
        customDiscountField.setHelperText(String.format("%.0f-%.0f%%", min, max));
        log.debug("Встановлено діапазон кастомної знижки: {}-{}", min, max);
    }

    /**
     * Встановлює значення без тригера події.
     */
    public void setDiscountTypeQuiet(DiscountType discountType) {
        // Тимчасово зберігаємо поточний handler
        Consumer<DiscountType> tempHandler = this.onDiscountTypeChanged;
        this.onDiscountTypeChanged = null;

        discountTypeGroup.setValue(discountType);

        // Повертаємо handler
        this.onDiscountTypeChanged = tempHandler;
    }

    /**
     * Отримати поточний вибраний тип знижки.
     */
    public DiscountType getSelectedDiscountType() {
        return discountTypeGroup.getValue();
    }

    /**
     * Отримати поточний відсоток кастомної знижки.
     */
    public BigDecimal getCustomDiscountPercent() {
        Double value = customDiscountField.getValue();
        return value != null ? BigDecimal.valueOf(value) : BigDecimal.ZERO;
    }

    /**
     * Отримати ефективний відсоток знижки.
     */
    public BigDecimal getEffectiveDiscountPercent() {
        DiscountType type = getSelectedDiscountType();
        if (type == DiscountType.CUSTOM) {
            return getCustomDiscountPercent();
        } else if (type != null) {
            return BigDecimal.valueOf(type.getDefaultPercent());
        }
        return BigDecimal.ZERO;
    }

    /**
     * Перевірити чи компонент валідний.
     */
    public boolean isValid() {
        DiscountType selectedType = getSelectedDiscountType();
        if (selectedType == null) {
            return false;
        }

        if (selectedType == DiscountType.CUSTOM) {
            return !customDiscountField.isInvalid() &&
                   getCustomDiscountPercent().compareTo(BigDecimal.ZERO) >= 0 &&
                   getCustomDiscountPercent().compareTo(BigDecimal.valueOf(50)) <= 0;
        }

        return true;
    }

    /**
     * Показати інформацію про активну знижку.
     */
    public void showDiscountInfo() {
        if (currentState != null && currentState.hasDiscount()) {
            BigDecimal percent = currentState.getEffectiveDiscountPercent();
            String info = String.format("Активна знижка: %.0f%%", percent.doubleValue());

            Span infoSpan = new Span("ℹ️ " + info);
            infoSpan.getStyle()
                .set("color", "var(--lumo-success-text-color)")
                .set("font-size", "var(--lumo-font-size-s)")
                .set("font-weight", "500");

            discountWarningPanel.add(infoSpan);
            log.debug("Показано інформацію про знижку: {}", info);
        }
    }

    // Event handlers setters

    public void setOnDiscountTypeChanged(Consumer<DiscountType> handler) {
        this.onDiscountTypeChanged = handler;
    }

    public void setOnCustomDiscountChanged(Consumer<BigDecimal> handler) {
        this.onCustomDiscountChanged = handler;
    }

    // Геттери для тестування

    protected RadioButtonGroup<DiscountType> getDiscountTypeGroup() {
        return discountTypeGroup;
    }

    protected NumberField getCustomDiscountField() {
        return customDiscountField;
    }

    protected Div getDiscountWarningPanel() {
        return discountWarningPanel;
    }
}
