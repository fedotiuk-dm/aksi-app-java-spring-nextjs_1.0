package com.aksi.ui.wizard.step2.substeps.pricing_calculator.components;

import java.math.BigDecimal;
import java.util.List;

import com.aksi.domain.pricing.dto.CalculationDetailsDTO;
import com.vaadin.flow.component.details.Details;
import com.vaadin.flow.component.html.H5;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для відображення деталей розрахунку ціни.
 * Відповідає тільки за презентацію деталей розрахунку (SRP).
 */
@Slf4j
public class CalculationDetailsComponent extends VerticalLayout {

    private Details calculationDetailsPanel;
    private VerticalLayout calculationStepsLayout;

    public CalculationDetailsComponent() {
        initializeLayout();
        createComponents();

        log.debug("CalculationDetailsComponent ініціалізовано");
    }

    private void initializeLayout() {
        setPadding(false);
        setSpacing(false);
        setWidthFull();
    }

    private void createComponents() {
        calculationStepsLayout = new VerticalLayout();
        calculationStepsLayout.setPadding(false);
        calculationStepsLayout.setSpacing(true);

        calculationDetailsPanel = new Details("Деталі розрахунку", calculationStepsLayout);
        calculationDetailsPanel.setOpened(false);
        calculationDetailsPanel.setWidthFull();

        add(calculationDetailsPanel);
    }

    /**
     * Оновлює відображення деталей розрахунку.
     */
    public void updateCalculationDetails(List<CalculationDetailsDTO> calculationDetails) {
        log.debug("Оновлення деталей розрахунку: {} кроків",
                 calculationDetails != null ? calculationDetails.size() : 0);

        calculationStepsLayout.removeAll();

        if (calculationDetails == null || calculationDetails.isEmpty()) {
            calculationStepsLayout.add(new Span("Деталі розрахунку недоступні"));
            calculationDetailsPanel.setOpened(false);
            return;
        }

        // Показуємо панель якщо є дані
        calculationDetailsPanel.setOpened(true);

        for (CalculationDetailsDTO detail : calculationDetails) {
            VerticalLayout stepLayout = createCalculationStep(detail);
            calculationStepsLayout.add(stepLayout);
        }
    }

    /**
     * Створює візуальне представлення одного кроку розрахунку.
     */
    private VerticalLayout createCalculationStep(CalculationDetailsDTO detail) {
        VerticalLayout stepLayout = new VerticalLayout();
        stepLayout.setPadding(false);
        stepLayout.setSpacing(false);
        stepLayout.getStyle()
            .set("border-left", "3px solid var(--lumo-primary-color)")
            .set("padding-left", "var(--lumo-space-s)")
            .set("margin-bottom", "var(--lumo-space-s)")
            .set("background", "var(--lumo-contrast-5pct)")
            .set("border-radius", "var(--lumo-border-radius-s)")
            .set("padding", "var(--lumo-space-s)");

        // Заголовок кроку
        H5 stepTitle = new H5(String.format("Крок %d: %s",
                detail.getStep(),
                detail.getStepName() != null ? detail.getStepName() : ""));
        stepTitle.getStyle().set("margin", "0 0 var(--lumo-space-xs) 0");

        // Опис кроку
        if (detail.getDescription() != null && !detail.getDescription().trim().isEmpty()) {
            Span stepDescription = new Span(detail.getDescription());
            stepDescription.getStyle()
                .set("color", "var(--lumo-secondary-text-color)")
                .set("font-size", "var(--lumo-font-size-s)");
            stepLayout.add(stepDescription);
        }

        // Ряд з цінами
        HorizontalLayout priceRow = createPriceRow(detail);
        if (priceRow.getComponentCount() > 0) {
            stepLayout.add(priceRow);
        }

        stepLayout.add(stepTitle);
        return stepLayout;
    }

    /**
     * Створює ряд з відображенням цін для кроку.
     */
    private HorizontalLayout createPriceRow(CalculationDetailsDTO detail) {
        HorizontalLayout priceRow = new HorizontalLayout();
        priceRow.setSpacing(true);
        priceRow.setAlignItems(Alignment.CENTER);
        priceRow.getStyle().set("margin-top", "var(--lumo-space-xs)");

        // Ціна до
        if (detail.getPriceBefore() != null) {
            Span priceBefore = new Span(formatPrice(detail.getPriceBefore()));
            priceBefore.getStyle().set("color", "var(--lumo-secondary-text-color)");
            priceRow.add(priceBefore);
        }

        // Зміна ціни
        if (detail.getPriceDifference() != null && detail.getPriceDifference().compareTo(BigDecimal.ZERO) != 0) {
            String sign = detail.getPriceDifference().compareTo(BigDecimal.ZERO) > 0 ? "+" : "";
            Span priceDiff = new Span(String.format("%s%s", sign, formatPrice(detail.getPriceDifference())));

            String color = detail.getPriceDifference().compareTo(BigDecimal.ZERO) > 0
                ? "var(--lumo-success-text-color)"
                : "var(--lumo-error-text-color)";
            priceDiff.getStyle()
                .set("color", color)
                .set("font-weight", "500");

            if (priceRow.getComponentCount() > 0) {
                priceRow.add(new Span("→"));
            }
            priceRow.add(priceDiff);
        }

        // Ціна після
        if (detail.getPriceAfter() != null) {
            Span priceAfter = new Span(String.format("= %s", formatPrice(detail.getPriceAfter())));
            priceAfter.getStyle()
                .set("font-weight", "bold")
                .set("color", "var(--lumo-primary-text-color)");

            if (priceRow.getComponentCount() > 0) {
                priceRow.add(new Span("→"));
            }
            priceRow.add(priceAfter);
        }

        return priceRow;
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
     * Встановлює чи панель має бути розгорнута.
     */
    public void setExpanded(boolean expanded) {
        calculationDetailsPanel.setOpened(expanded);
    }

    /**
     * Перевіряє чи панель розгорнута.
     */
    public boolean isExpanded() {
        return calculationDetailsPanel.isOpened();
    }

    /**
     * Очищає всі деталі розрахунку.
     */
    public void clearDetails() {
        calculationStepsLayout.removeAll();
        calculationDetailsPanel.setOpened(false);
        log.debug("Деталі розрахунку очищено");
    }

    /**
     * Блокує/розблоковує компонент.
     */
    public void setEnabled(boolean enabled) {
        calculationDetailsPanel.setEnabled(enabled);
        setOpacity(enabled ? 1.0 : 0.6);
    }

    /**
     * Встановлює прозорість компонента.
     */
    private void setOpacity(double opacity) {
        getStyle().set("opacity", String.valueOf(opacity));
    }
}
