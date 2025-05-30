package com.aksi.ui.wizard.step3.components;

import com.aksi.ui.wizard.step3.domain.OrderParametersState;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для навігації параметрів замовлення.
 * Відповідає за SRP - тільки кнопки навігації та їх стани.
 */
@Slf4j
public class ParametersNavigationComponent extends HorizontalLayout {

    // UI елементи
    private Button cancelButton;
    private Button previousButton;
    private Button nextButton;

    // Event handlers
    private Runnable onCancel;
    private Runnable onPrevious;
    private Runnable onNext;

    // Стан
    private OrderParametersState currentState;

    public ParametersNavigationComponent() {
        initializeLayout();
        createComponents();
        setupEventHandlers();

        log.debug("ParametersNavigationComponent ініціалізовано");
    }

    private void initializeLayout() {
        setJustifyContentMode(JustifyContentMode.BETWEEN);
        setWidthFull();
        setPadding(true);
        setSpacing(true);
    }

    private void createComponents() {
        // Кнопка скасування
        cancelButton = new Button("Скасувати");
        cancelButton.setIcon(VaadinIcon.CLOSE.create());
        cancelButton.addThemeVariants(ButtonVariant.LUMO_TERTIARY);

        // Кнопка "Назад"
        previousButton = new Button("Назад до предметів");
        previousButton.setIcon(VaadinIcon.ARROW_LEFT.create());
        previousButton.addThemeVariants(ButtonVariant.LUMO_TERTIARY);

        // Кнопка "Далі"
        nextButton = new Button("Далі до підтвердження");
        nextButton.setIcon(VaadinIcon.ARROW_RIGHT.create());
        nextButton.setIconAfterText(true);
        nextButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);

        // Компонуємо кнопки
        HorizontalLayout rightButtons = new HorizontalLayout(previousButton, nextButton);
        rightButtons.setSpacing(true);

        add(cancelButton, rightButtons);
    }

    private void setupEventHandlers() {
        cancelButton.addClickListener(e -> {
            if (onCancel != null) {
                onCancel.run();
            }
        });

        previousButton.addClickListener(e -> {
            if (onPrevious != null) {
                onPrevious.run();
            }
        });

        nextButton.addClickListener(e -> {
            if (onNext != null) {
                onNext.run();
            }
        });
    }

    /**
     * Оновлює компонент з поточного domain state.
     */
    public void updateFromState(OrderParametersState state) {
        this.currentState = state;

        if (state != null) {
            // Оновлюємо доступність кнопок
            updateButtonsAvailability(state);

            // Оновлюємо стилі кнопок
            updateButtonsStyles(state);

            // Оновлюємо тексти кнопок
            updateButtonsTexts(state);

            log.debug("Компонент навігації оновлено з стану: валідний={}, можна продовжити={}",
                    state.isValid(), state.isCanProceedToNext());
        }
    }

    private void updateButtonsAvailability(OrderParametersState state) {
        // Кнопка "Назад" завжди доступна
        previousButton.setEnabled(true);

        // Кнопка "Далі" доступна тільки якщо параметри валідні
        nextButton.setEnabled(state.isValid() && state.isCanProceedToNext());

        // Кнопка "Скасувати" завжди доступна
        cancelButton.setEnabled(true);
    }

    private void updateButtonsStyles(OrderParametersState state) {
        // Стиль кнопки "Далі" залежить від валідності
        if (state.isValid() && state.isCanProceedToNext()) {
            nextButton.removeThemeVariants(ButtonVariant.LUMO_ERROR);
            nextButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY, ButtonVariant.LUMO_SUCCESS);
        } else {
            nextButton.removeThemeVariants(ButtonVariant.LUMO_SUCCESS);
            if (!state.isValid()) {
                nextButton.addThemeVariants(ButtonVariant.LUMO_ERROR);
            }
        }

        // Індикатор завантаження для кнопки "Далі"
        // (можна розширити для показу стану завантаження)
    }

    private void updateButtonsTexts(OrderParametersState state) {
        // Базові тексти кнопок
        if (state.isValid() && state.isCanProceedToNext()) {
            nextButton.setText("Далі до підтвердження ✓");
        } else if (!state.isValid()) {
            nextButton.setText("Перевірте дані");
        } else {
            nextButton.setText("Далі до підтвердження");
        }

        // Додаткова інформація в tooltip
        updateButtonTooltips(state);
    }

    private void updateButtonTooltips(OrderParametersState state) {
        if (!state.isValid()) {
            String tooltip = "Не всі параметри заповнені правильно:\n" +
                           String.join("\n", state.getValidationMessages());
            nextButton.getElement().setProperty("title", tooltip);
        } else {
            nextButton.getElement().removeProperty("title");
        }

        // Tooltip для попередніх дій
        previousButton.getElement().setProperty("title", "Повернутися до управління предметами");
        cancelButton.getElement().setProperty("title", "Скасувати створення замовлення");
    }

    /**
     * Показує стан завантаження для кнопки "Далі".
     */
    public void showNextLoading(boolean loading) {
        if (loading) {
            nextButton.setText("Збереження...");
            nextButton.setEnabled(false);
            nextButton.setIcon(VaadinIcon.SPINNER.create());
        } else {
            updateFromState(currentState); // Відновлюємо нормальний стан
        }
        log.debug("Стан завантаження кнопки 'Далі': {}", loading);
    }

    /**
     * Показує успішний стан кнопки "Далі".
     */
    public void showNextSuccess() {
        nextButton.setText("Успішно збережено ✓");
        nextButton.setIcon(VaadinIcon.CHECK.create());
        nextButton.addThemeVariants(ButtonVariant.LUMO_SUCCESS);
        log.debug("Показано успішний стан кнопки 'Далі'");
    }

    /**
     * Показує помилку для кнопки "Далі".
     */
    public void showNextError() {
        nextButton.setText("Помилка збереження");
        nextButton.setIcon(VaadinIcon.EXCLAMATION.create());
        nextButton.addThemeVariants(ButtonVariant.LUMO_ERROR);
        nextButton.setEnabled(true);
        log.debug("Показано помилку кнопки 'Далі'");
    }

    /**
     * Встановлює доступність кнопки "Назад".
     */
    public void setPreviousEnabled(boolean enabled) {
        previousButton.setEnabled(enabled);
        log.debug("Кнопка 'Назад': {}", enabled ? "увімкнена" : "вимкнена");
    }

    /**
     * Встановлює доступність кнопки "Далі".
     */
    public void setNextEnabled(boolean enabled) {
        nextButton.setEnabled(enabled);
        log.debug("Кнопка 'Далі': {}", enabled ? "увімкнена" : "вимкнена");
    }

    /**
     * Встановлює доступність кнопки "Скасувати".
     */
    public void setCancelEnabled(boolean enabled) {
        cancelButton.setEnabled(enabled);
        log.debug("Кнопка 'Скасувати': {}", enabled ? "увімкнена" : "вимкнена");
    }

    /**
     * Встановлює компактний режим відображення.
     */
    public void setCompactMode(boolean compact) {
        if (compact) {
            // Зменшуємо тексти кнопок для компактного режиму
            cancelButton.setText("✕");
            previousButton.setText("‹ Назад");
            nextButton.setText("Далі ›");
        } else {
            // Повертаємо повні тексти
            updateButtonsTexts(currentState);
        }
        log.debug("Компактний режим: {}", compact);
    }

    /**
     * Скидає всі стани кнопок до початкових.
     */
    public void resetButtonStates() {
        nextButton.removeThemeVariants(ButtonVariant.LUMO_SUCCESS, ButtonVariant.LUMO_ERROR);
        nextButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        nextButton.setIcon(VaadinIcon.ARROW_RIGHT.create());
        nextButton.setIconAfterText(true);

        if (currentState != null) {
            updateFromState(currentState);
        }
        log.debug("Стани кнопок скинуто");
    }

    /**
     * Підсвічує кнопку "Далі" для привернення уваги.
     */
    public void highlightNextButton() {
        nextButton.getStyle().set("animation", "pulse 1s infinite");
        log.debug("Кнопка 'Далі' підсвічена");
    }

    /**
     * Прибирає підсвічування кнопки "Далі".
     */
    public void removeNextButtonHighlight() {
        nextButton.getStyle().remove("animation");
        log.debug("Підсвічування кнопки 'Далі' прибране");
    }

    // Event handlers setters

    public void setOnCancel(Runnable handler) {
        this.onCancel = handler;
    }

    public void setOnPrevious(Runnable handler) {
        this.onPrevious = handler;
    }

    public void setOnNext(Runnable handler) {
        this.onNext = handler;
    }

    // Геттери для тестування

    protected Button getCancelButton() {
        return cancelButton;
    }

    protected Button getPreviousButton() {
        return previousButton;
    }

    protected Button getNextButton() {
        return nextButton;
    }
}
