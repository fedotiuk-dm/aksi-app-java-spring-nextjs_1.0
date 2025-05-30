package com.aksi.ui.wizard.step2.substeps.main_manager.components;

import java.math.BigDecimal;

import com.aksi.ui.wizard.step2.substeps.main_manager.domain.ItemsManagerState;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для відображення підсумкової інформації про замовлення.
 * Дотримується принципу SRP - відповідає тільки за відображення статистики.
 */
@Slf4j
public class SummaryComponent extends VerticalLayout {

    // UI елементи
    private H4 totalCostLabel;
    private Span itemsCountLabel;
    private Span statusLabel;
    private Div summaryContainer;

    public SummaryComponent() {
        initializeLayout();
        createComponents();
        updateWithInitialValues();
        log.debug("SummaryComponent ініціалізовано");
    }

    private void initializeLayout() {
        setSpacing(false);
        setPadding(false);
        setDefaultHorizontalComponentAlignment(Alignment.STRETCH);
    }

    private void createComponents() {
        summaryContainer = new Div();
        summaryContainer.addClassNames("summary-section");
        summaryContainer.getStyle()
                .set("background-color", "var(--lumo-contrast-5pct)")
                .set("padding", "var(--lumo-space-m)")
                .set("border-radius", "var(--lumo-border-radius-m)")
                .set("border", "1px solid var(--lumo-contrast-20pct)");

        // Заголовок секції
        totalCostLabel = new H4("Загальна вартість: 0.00 ₴");
        totalCostLabel.getStyle()
                .set("margin", "0 0 var(--lumo-space-s) 0")
                .set("color", "var(--lumo-primary-text-color)")
                .set("font-weight", "600");

        // Статистика
        itemsCountLabel = new Span("Кількість предметів: 0");
        itemsCountLabel.getStyle()
                .set("color", "var(--lumo-secondary-text-color)")
                .set("font-size", "var(--lumo-font-size-s)");

        statusLabel = new Span("Статус: Немає предметів");
        statusLabel.getStyle()
                .set("color", "var(--lumo-secondary-text-color)")
                .set("font-size", "var(--lumo-font-size-s)");

        // Розміщення статистики
        HorizontalLayout statsLayout = new HorizontalLayout(itemsCountLabel, statusLabel);
        statsLayout.setSpacing(true);
        statsLayout.setDefaultVerticalComponentAlignment(Alignment.CENTER);

        summaryContainer.add(totalCostLabel, statsLayout);
        add(summaryContainer);
    }

    private void updateWithInitialValues() {
        updateTotalCost(BigDecimal.ZERO, "0.00 ₴");
        updateItemsCount(0);
        updateStatus("Немає предметів");
    }

    /**
     * Оновлює відображення з новим станом менеджера.
     */
    public void updateFromState(ItemsManagerState state) {
        log.debug("Оновлення підсумку зі стану: {} предметів, {} ₴",
                 state.getItemsCount(), state.getTotalCost());

        updateTotalCost(state.getTotalCost(), state.getTotalCostFormatted());
        updateItemsCount(state.getItemsCount());
        updateStatus(state.getStatusMessage());
        updateValidationState(state.isValid(), state.getValidationMessages());
    }

    /**
     * Оновлює загальну вартість.
     */
    public void updateTotalCost(BigDecimal totalCost, String formattedCost) {
        totalCostLabel.setText("Загальна вартість: " + formattedCost);

        // Змінюємо колір в залежності від наявності суми
        if (totalCost.compareTo(BigDecimal.ZERO) > 0) {
            totalCostLabel.getStyle().set("color", "var(--lumo-success-text-color)");
        } else {
            totalCostLabel.getStyle().set("color", "var(--lumo-primary-text-color)");
        }
    }

    /**
     * Оновлює кількість предметів.
     */
    public void updateItemsCount(int count) {
        if (count == 0) {
            itemsCountLabel.setText("Немає предметів");
        } else if (count == 1) {
            itemsCountLabel.setText("1 предмет");
        } else {
            itemsCountLabel.setText(count + " предметів");
        }
    }

    /**
     * Оновлює статус.
     */
    public void updateStatus(String status) {
        statusLabel.setText("Статус: " + status);
    }

    /**
     * Оновлює стан валідації.
     */
    public void updateValidationState(boolean isValid, java.util.List<String> validationMessages) {
        if (isValid) {
            summaryContainer.getStyle().set("border-color", "var(--lumo-contrast-20pct)");
        } else {
            summaryContainer.getStyle().set("border-color", "var(--lumo-error-color)");

            // Додаємо першу помилку валідації до статусу
            if (!validationMessages.isEmpty()) {
                statusLabel.setText("Помилка: " + validationMessages.get(0));
                statusLabel.getStyle().set("color", "var(--lumo-error-text-color)");
            }
        }
    }

    /**
     * Показує індикатор завантаження.
     */
    public void showLoading(boolean isLoading) {
        if (isLoading) {
            summaryContainer.getStyle().set("opacity", "0.6");
            statusLabel.setText("Статус: Завантаження...");
        } else {
            summaryContainer.getStyle().remove("opacity");
        }
    }

    /**
     * Встановлює кастомний статус.
     */
    public void setCustomStatus(String status, String textColor) {
        statusLabel.setText("Статус: " + status);
        statusLabel.getStyle().set("color", textColor);
    }

    /**
     * Показує додаткову інформацію про предмети.
     */
    public void updateDetailedInfo(String additionalInfo) {
        if (additionalInfo != null && !additionalInfo.trim().isEmpty()) {
            Span detailSpan = new Span(additionalInfo);
            detailSpan.getStyle()
                    .set("color", "var(--lumo-secondary-text-color)")
                    .set("font-size", "var(--lumo-font-size-xs)")
                    .set("font-style", "italic");

            // Видаляємо попередню деталізацію якщо є
            if (summaryContainer.getChildren().count() > 2) {
                summaryContainer.getChildren()
                        .skip(2)
                        .forEach(summaryContainer::remove);
            }

            summaryContainer.add(detailSpan);
        }
    }

    /**
     * Скидає стан до початкових значень.
     */
    public void reset() {
        log.debug("Скидання підсумку до початкових значень");
        updateWithInitialValues();
        summaryContainer.getStyle()
                .set("border-color", "var(--lumo-contrast-20pct)")
                .remove("opacity");
        statusLabel.getStyle().set("color", "var(--lumo-secondary-text-color)");
    }

    /**
     * Встановлює акцент на підсумку.
     */
    public void setHighlighted(boolean highlighted) {
        if (highlighted) {
            summaryContainer.getStyle()
                    .set("background-color", "var(--lumo-primary-color-10pct)")
                    .set("border-color", "var(--lumo-primary-color)");
        } else {
            summaryContainer.getStyle()
                    .set("background-color", "var(--lumo-contrast-5pct)")
                    .set("border-color", "var(--lumo-contrast-20pct)");
        }
    }
}
