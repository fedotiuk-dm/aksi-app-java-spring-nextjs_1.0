package com.aksi.ui.wizard.step2.substeps.item_info.components;

import java.util.function.Consumer;

import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.IntegerField;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для введення кількості та відображення інформації про ціни.
 * Відповідає принципу єдиної відповідальності (SRP).
 */
@Slf4j
public class QuantityAndPriceComponent extends VerticalLayout {

    // UI компоненти
    private IntegerField quantityField;
    private Span unitOfMeasureSpan;
    private Span unitPriceSpan;
    private Span totalPriceSpan;

    private Consumer<Integer> onQuantityChanged;

    public QuantityAndPriceComponent() {
        initializeLayout();
        createComponents();
        setupEventHandlers();

        log.debug("QuantityAndPriceComponent ініціалізовано");
    }

    private void initializeLayout() {
        setPadding(false);
        setSpacing(true);
        setWidthFull();
    }

    private void createComponents() {
        // Поле кількості
        quantityField = new IntegerField("Кількість");
        quantityField.setValue(1);
        quantityField.setMin(1);
        quantityField.setMax(999);
        quantityField.setRequired(true);
        quantityField.setStepButtonsVisible(true);
        quantityField.setWidthFull();
        quantityField.setHelperText("Від 1 до 999");

        // Секція інформації про ціни
        VerticalLayout priceInfoLayout = createPriceInfoSection();

        add(quantityField, priceInfoLayout);
    }

    private VerticalLayout createPriceInfoSection() {
        VerticalLayout layout = new VerticalLayout();
        layout.setPadding(false);
        layout.setSpacing(false);
        layout.setWidthFull();

        H4 infoTitle = new H4("Інформація про послугу");
        infoTitle.getStyle().set("margin", "var(--lumo-space-s) 0 var(--lumo-space-xs) 0");

        unitOfMeasureSpan = new Span("Одиниця виміру: —");
        unitOfMeasureSpan.getStyle().set("font-weight", "500");

        unitPriceSpan = new Span("Ціна за одиницю: —");
        unitPriceSpan.getStyle()
                .set("font-weight", "500")
                .set("color", "var(--lumo-primary-color)");

        totalPriceSpan = new Span("Загальна вартість: —");
        totalPriceSpan.getStyle()
                .set("font-weight", "600")
                .set("font-size", "var(--lumo-font-size-l)")
                .set("color", "var(--lumo-success-color)");

        layout.add(infoTitle, unitOfMeasureSpan, unitPriceSpan, totalPriceSpan);
        return layout;
    }

    private void setupEventHandlers() {
        quantityField.addValueChangeListener(event -> {
            Integer newQuantity = event.getValue();

            if (newQuantity != null && newQuantity > 0) {
                log.debug("Змінено кількість: {}", newQuantity);
                notifyQuantityChanged(newQuantity);
            } else {
                log.debug("Некоректне значення кількості: {}", newQuantity);
            }
        });
    }

    private void notifyQuantityChanged(Integer quantity) {
        if (onQuantityChanged != null && quantity != null) {
            onQuantityChanged.accept(quantity);
        }
    }

    /**
     * Встановлює кількість.
     */
    public void setQuantity(Integer quantity) {
        if (quantity != null && quantity > 0 && quantity <= 999) {
            quantityField.setValue(quantity);
            log.debug("Встановлено кількість: {}", quantity);
        } else {
            log.warn("Некоректне значення кількості: {}", quantity);
        }
    }

    /**
     * Повертає поточну кількість.
     */
    public Integer getQuantity() {
        return quantityField.getValue();
    }

    /**
     * Оновлює інформацію про ціни.
     */
    public void updatePriceInfo(String unitOfMeasure, String formattedUnitPrice, String formattedTotalPrice) {
        if (unitOfMeasure != null && !unitOfMeasure.trim().isEmpty()) {
            unitOfMeasureSpan.setText("Одиниця виміру: " + unitOfMeasure);
        } else {
            unitOfMeasureSpan.setText("Одиниця виміру: —");
        }

        if (formattedUnitPrice != null && !formattedUnitPrice.trim().isEmpty()) {
            unitPriceSpan.setText("Ціна за одиницю: " + formattedUnitPrice);
        } else {
            unitPriceSpan.setText("Ціна за одиницю: —");
        }

        if (formattedTotalPrice != null && !formattedTotalPrice.trim().isEmpty()) {
            totalPriceSpan.setText("Загальна вартість: " + formattedTotalPrice);
        } else {
            totalPriceSpan.setText("Загальна вартість: —");
        }

        log.debug("Оновлено інформацію про ціни: {} | {} | {}",
                 unitOfMeasure, formattedUnitPrice, formattedTotalPrice);
    }

    /**
     * Очищає інформацію про ціни.
     */
    public void clearPriceInfo() {
        unitOfMeasureSpan.setText("Одиниця виміру: —");
        unitPriceSpan.setText("Ціна за одиницю: —");
        totalPriceSpan.setText("Загальна вартість: —");

        log.debug("Очищено інформацію про ціни");
    }

    /**
     * Встановлює обробник зміни кількості.
     */
    public void setOnQuantityChanged(Consumer<Integer> handler) {
        this.onQuantityChanged = handler;
    }

    /**
     * Встановлює фокус на поле кількості.
     */
    public void focus() {
        quantityField.focus();
    }

    /**
     * Встановлює стан доступності компонента.
     */
    public void setEnabled(boolean enabled) {
        quantityField.setEnabled(enabled);

        // Візуальне відображення стану
        setOpacity(enabled ? 1.0 : 0.6);
    }

    /**
     * Встановлює стан валідності компонента.
     */
    public void setInvalid(boolean invalid) {
        quantityField.setInvalid(invalid);

        if (invalid) {
            quantityField.setErrorMessage("Кількість повинна бути від 1 до 999");
        } else {
            quantityField.setErrorMessage(null);
        }
    }

    /**
     * Встановлює текст підказки.
     */
    public void setHelperText(String helperText) {
        quantityField.setHelperText(helperText);
    }

    /**
     * Перевіряє валідність кількості.
     */
    public boolean isQuantityValid() {
        Integer quantity = quantityField.getValue();
        return quantity != null && quantity > 0 && quantity <= 999;
    }

    /**
     * Повертає інформацію про кількість.
     */
    public QuantityInfo getQuantityInfo() {
        Integer quantity = quantityField.getValue();
        return new QuantityInfo(
                quantity,
                isQuantityValid(),
                quantity != null
        );
    }

    private void setOpacity(double opacity) {
        getStyle().set("opacity", String.valueOf(opacity));
    }

    /**
     * Інформація про кількість.
     */
    public static class QuantityInfo {
        private final Integer quantity;
        private final boolean isValid;
        private final boolean hasValue;

        public QuantityInfo(Integer quantity, boolean isValid, boolean hasValue) {
            this.quantity = quantity;
            this.isValid = isValid;
            this.hasValue = hasValue;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public boolean isValid() {
            return isValid;
        }

        public boolean hasValue() {
            return hasValue;
        }
    }
}
