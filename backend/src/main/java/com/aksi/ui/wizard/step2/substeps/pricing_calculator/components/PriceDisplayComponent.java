package com.aksi.ui.wizard.step2.substeps.pricing_calculator.components;

import java.math.BigDecimal;

import com.aksi.ui.wizard.step2.substeps.pricing_calculator.domain.PriceCalculationState;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для відображення інформації про ціни.
 * Відповідає тільки за презентацію цін (SRP).
 */
@Slf4j
public class PriceDisplayComponent extends VerticalLayout {

    private Span basePriceLabel;
    private Span finalPriceLabel;
    private Span priceDifferenceLabel;
    private Button recalculateButton;

    private Runnable onRecalculateRequested;

    public PriceDisplayComponent() {
        initializeLayout();
        createComponents();

        log.debug("PriceDisplayComponent ініціалізовано");
    }

    private void initializeLayout() {
        setPadding(false);
        setSpacing(true);
        setWidthFull();
    }

    private void createComponents() {
        H4 title = new H4("Розрахунок ціни");
        title.getStyle().set("margin-top", "0").set("margin-bottom", "var(--lumo-space-s)");

        // Панель з цінами
        Div pricePanel = createPricePanel();

        // Кнопка перерахунку
        recalculateButton = new Button("Перерахувати", VaadinIcon.REFRESH.create());
        recalculateButton.addThemeVariants(ButtonVariant.LUMO_SMALL);
        recalculateButton.addClickListener(e -> handleRecalculate());
        recalculateButton.setEnabled(false);

        add(title, pricePanel, recalculateButton);
    }

    private Div createPricePanel() {
        Div panel = new Div();
        panel.getStyle()
            .set("background", "var(--lumo-contrast-5pct)")
            .set("padding", "var(--lumo-space-m)")
            .set("border-radius", "var(--lumo-border-radius-m)")
            .set("border", "1px solid var(--lumo-contrast-20pct)");

        // Базова ціна
        HorizontalLayout basePriceLayout = createPriceRow("Базова ціна:");
        basePriceLabel = createPriceSpan("0.00 ₴", "var(--lumo-secondary-text-color)");
        basePriceLayout.add(basePriceLabel);

        // Фінальна ціна
        HorizontalLayout finalPriceLayout = createPriceRow("Фінальна ціна:");
        finalPriceLabel = createPriceSpan("0.00 ₴", "var(--lumo-primary-text-color)");
        finalPriceLabel.getStyle()
            .set("font-weight", "bold")
            .set("font-size", "var(--lumo-font-size-l)");
        finalPriceLayout.add(finalPriceLabel);

        // Різниця в ціні
        HorizontalLayout differenceLayout = createPriceRow("Різниця:");
        priceDifferenceLabel = createPriceSpan("0.00 ₴", "var(--lumo-secondary-text-color)");
        differenceLayout.add(priceDifferenceLabel);

        panel.add(basePriceLayout, finalPriceLayout, differenceLayout);
        return panel;
    }

    private HorizontalLayout createPriceRow(String labelText) {
        HorizontalLayout layout = new HorizontalLayout();
        layout.setJustifyContentMode(JustifyContentMode.BETWEEN);
        layout.setWidthFull();
        layout.setPadding(false);
        layout.setSpacing(true);

        Span label = new Span(labelText);
        label.getStyle().set("font-weight", "500");
        layout.add(label);

        return layout;
    }

    private Span createPriceSpan(String text, String color) {
        Span span = new Span(text);
        span.getStyle()
            .set("color", color)
            .set("white-space", "nowrap");
        return span;
    }

    /**
     * Оновлює відображення цін на основі стану розрахунку.
     */
    public void updatePrices(PriceCalculationState calculationState) {
        if (calculationState == null) {
            log.warn("Спроба оновлення з null станом розрахунку");
            return;
        }

        log.debug("Оновлення відображення цін: базова={}, фінальна={}",
                 calculationState.getBasePrice(), calculationState.getFinalPrice());

        // Базова ціна
        basePriceLabel.setText(formatPrice(calculationState.getBasePrice()));

        // Фінальна ціна
        finalPriceLabel.setText(formatPrice(calculationState.getFinalPrice()));

        // Різниця
        BigDecimal difference = calculationState.getPriceDifference();
        String differenceText = formatPriceDifference(difference);
        String differenceColor = getDifferenceColor(difference);

        priceDifferenceLabel.setText(differenceText);
        priceDifferenceLabel.getStyle().set("color", differenceColor);

        // Активуємо кнопку перерахунку якщо є модифікатори
        recalculateButton.setEnabled(calculationState.hasModifiers());
    }

    /**
     * Встановлює обробник події перерахунку.
     */
    public void setOnRecalculateRequested(Runnable handler) {
        this.onRecalculateRequested = handler;
    }

    /**
     * Форматує ціну для відображення.
     */
    private String formatPrice(BigDecimal price) {
        if (price == null) {
            return "0.00 ₴";
        }
        return String.format("%.2f ₴", price.doubleValue());
    }

    /**
     * Форматує різницю в ціні з відповідним знаком.
     */
    private String formatPriceDifference(BigDecimal difference) {
        if (difference == null || difference.compareTo(BigDecimal.ZERO) == 0) {
            return "0.00 ₴";
        }

        String sign = difference.compareTo(BigDecimal.ZERO) > 0 ? "+" : "";
        return String.format("%s%.2f ₴", sign, difference.doubleValue());
    }

    /**
     * Визначає колір для відображення різниці в ціні.
     */
    private String getDifferenceColor(BigDecimal difference) {
        if (difference == null || difference.compareTo(BigDecimal.ZERO) == 0) {
            return "var(--lumo-secondary-text-color)";
        }

        return difference.compareTo(BigDecimal.ZERO) > 0
            ? "var(--lumo-success-text-color)"
            : "var(--lumo-error-text-color)";
    }

    /**
     * Обробляє натискання кнопки перерахунку.
     */
    private void handleRecalculate() {
        if (onRecalculateRequested != null) {
            log.debug("Запит перерахунку цін");
            onRecalculateRequested.run();
        }
    }

    /**
     * Блокує/розблоковує компонент.
     */
    public void setEnabled(boolean enabled) {
        recalculateButton.setEnabled(enabled);
        setOpacity(enabled ? 1.0 : 0.6);
    }

    /**
     * Встановлює прозорість компонента.
     */
    private void setOpacity(double opacity) {
        getStyle().set("opacity", String.valueOf(opacity));
    }
}
