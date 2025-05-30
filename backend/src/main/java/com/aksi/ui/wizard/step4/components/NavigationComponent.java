package com.aksi.ui.wizard.step4.components;

import com.aksi.ui.wizard.step4.domain.ConfirmationState;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * Компонент для навігації та завершення замовлення.
 * Відповідальність: навігаційні дії (назад, скасувати, завершити).
 */
@Slf4j
public class NavigationComponent extends HorizontalLayout {

    // UI компоненти
    private Button cancelButton;
    private Button previousButton;
    private Button completeOrderButton;

    // Callbacks
    private Runnable onCancel;
    private Runnable onPrevious;
    private Runnable onComplete;

    // Поточний стан
    private ConfirmationState currentState;

    public NavigationComponent() {
        initializeComponent();
        createComponents();
        initializeLayout();
        setupEventHandlers();
        log.debug("NavigationComponent ініціалізовано");
    }

    private void initializeComponent() {
        setJustifyContentMode(JustifyContentMode.BETWEEN);
        setWidthFull();
        setSpacing(true);
        addClassName("navigation-component");
    }

    private void createComponents() {
        // Кнопка скасування (зліва)
        cancelButton = new Button("Скасувати", VaadinIcon.CLOSE.create());
        cancelButton.addThemeVariants(ButtonVariant.LUMO_TERTIARY);
        cancelButton.addClassName("cancel-button");
        cancelButton.getStyle()
                .set("color", "var(--lumo-error-text-color)");

        // Кнопка "Назад" (справа)
        previousButton = new Button("Назад до параметрів", VaadinIcon.ARROW_LEFT.create());
        previousButton.addThemeVariants(ButtonVariant.LUMO_TERTIARY);
        previousButton.addClassName("previous-button");

        // Кнопка завершення (справа)
        completeOrderButton = new Button("Завершити замовлення", VaadinIcon.CHECK_CIRCLE.create());
        completeOrderButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY, ButtonVariant.LUMO_SUCCESS);
        completeOrderButton.addClassName("complete-order-button");
        completeOrderButton.setEnabled(false); // Спочатку вимкнена

        // Група правих кнопок
        HorizontalLayout rightButtons = new HorizontalLayout(previousButton, completeOrderButton);
        rightButtons.setSpacing(true);
        rightButtons.addClassName("right-buttons-group");

        add(cancelButton, rightButtons);
    }

    private void initializeLayout() {
        getStyle()
                .set("padding", "var(--lumo-space-m)")
                .set("border-top", "1px solid var(--lumo-contrast-20pct)")
                .set("background", "var(--lumo-base-color)")
                .set("margin-top", "var(--lumo-space-l)");
    }

    private void setupEventHandlers() {
        cancelButton.addClickListener(event -> {
            if (onCancel != null) {
                onCancel.run();
            }
        });

        previousButton.addClickListener(event -> {
            if (onPrevious != null) {
                onPrevious.run();
            }
        });

        completeOrderButton.addClickListener(event -> {
            if (onComplete != null) {
                onComplete.run();
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
        updateButtonsState(state);
        updateButtonsText(state);

        log.debug("NavigationComponent оновлено з стану");
    }

    private void updateButtonsState(ConfirmationState state) {
        // Кнопка скасування - завжди доступна, якщо не завантаження
        cancelButton.setEnabled(!state.isLoading() && !state.isOrderCompleted());

        // Кнопка "Назад" - доступна, якщо не завантаження і не завершено
        previousButton.setEnabled(!state.isLoading() && !state.isOrderCompleted());

        // Кнопка завершення - доступна тільки коли можна завершити
        completeOrderButton.setEnabled(state.isCanCompleteOrder() && !state.isLoading());
    }

    private void updateButtonsText(ConfirmationState state) {
        if (state.isOrderCompleted()) {
            completeOrderButton.setText("Замовлення завершено ✅");
            completeOrderButton.setIcon(VaadinIcon.CHECK.create());
            completeOrderButton.removeThemeVariants(ButtonVariant.LUMO_SUCCESS);
            completeOrderButton.addThemeVariants(ButtonVariant.LUMO_CONTRAST);

            cancelButton.setText("Закрити");
            cancelButton.setIcon(VaadinIcon.SIGN_OUT.create());

            previousButton.setVisible(false);
        } else if (state.isLoading()) {
            completeOrderButton.setText("Обробка...");
            completeOrderButton.setIcon(VaadinIcon.SPINNER.create());
        } else {
            completeOrderButton.setText("Завершити замовлення");
            completeOrderButton.setIcon(VaadinIcon.CHECK_CIRCLE.create());

            if (state.isCanCompleteOrder()) {
                completeOrderButton.removeThemeVariants(ButtonVariant.LUMO_CONTRAST);
                completeOrderButton.addThemeVariants(ButtonVariant.LUMO_SUCCESS);
            } else {
                completeOrderButton.removeThemeVariants(ButtonVariant.LUMO_SUCCESS);
                completeOrderButton.addThemeVariants(ButtonVariant.LUMO_CONTRAST);
            }
        }
    }

    /**
     * Показує стан завантаження.
     */
    public void showLoading(boolean loading, String operation) {
        if (loading) {
            addClassName("loading-state");
            cancelButton.setEnabled(false);
            previousButton.setEnabled(false);
            completeOrderButton.setEnabled(false);

            if (operation != null) {
                switch (operation) {
                    case "order_completion" -> {
                        completeOrderButton.setText("Завершення замовлення...");
                        completeOrderButton.setIcon(VaadinIcon.SPINNER.create());
                    }
                    case "receipt_generation" -> {
                        completeOrderButton.setText("Генерація квитанції...");
                        completeOrderButton.setIcon(VaadinIcon.SPINNER.create());
                    }
                    default -> {
                        completeOrderButton.setText("Обробка...");
                        completeOrderButton.setIcon(VaadinIcon.SPINNER.create());
                    }
                }
            }
        } else {
            removeClassName("loading-state");
            updateFromState(currentState != null ? currentState :
                    ConfirmationState.builder().isLoading(false).build());
        }
    }

    /**
     * Показує стан помилки.
     */
    public void showError(boolean hasError) {
        if (hasError) {
            addClassName("error-state");
            completeOrderButton.removeThemeVariants(ButtonVariant.LUMO_SUCCESS);
            completeOrderButton.addThemeVariants(ButtonVariant.LUMO_ERROR);
            completeOrderButton.setText("Спробувати знову");
            completeOrderButton.setIcon(VaadinIcon.REFRESH.create());
        } else {
            removeClassName("error-state");
            updateButtonsText(currentState != null ? currentState :
                    ConfirmationState.builder().build());
        }
    }

    /**
     * Показує анімацію успіху.
     */
    public void showSuccess() {
        completeOrderButton.setText("Успішно завершено! ✅");
        completeOrderButton.setIcon(VaadinIcon.CHECK.create());
        completeOrderButton.removeThemeVariants(ButtonVariant.LUMO_PRIMARY);
        completeOrderButton.addThemeVariants(ButtonVariant.LUMO_SUCCESS);

        // Тимчасова анімація
        completeOrderButton.getStyle().set("animation", "pulse 0.5s ease-in-out");

        // Видаляємо анімацію через 1 секунду
        completeOrderButton.getElement().executeJs(
                "setTimeout(() => { this.style.animation = ''; }, 1000);"
        );
    }

    /**
     * Встановлює компактний режим відображення.
     */
    public void setCompactMode(boolean compact) {
        if (compact) {
            addClassName("compact-mode");
            // В компактному режимі ховаємо текст кнопок, залишаємо тільки іконки
            cancelButton.setText("");
            previousButton.setText("");
            completeOrderButton.setText("Завершити");
        } else {
            removeClassName("compact-mode");
            // Відновлюємо повний текст
            cancelButton.setText("Скасувати");
            previousButton.setText("Назад до параметрів");
            updateButtonsText(currentState != null ? currentState :
                    ConfirmationState.builder().build());
        }
        log.debug("Компактний режим встановлено: {}", compact);
    }

    /**
     * Встановлює callback для скасування.
     */
    public void setOnCancel(Runnable callback) {
        this.onCancel = callback;
        log.debug("Cancel callback встановлено");
    }

    /**
     * Встановлює callback для переходу назад.
     */
    public void setOnPrevious(Runnable callback) {
        this.onPrevious = callback;
        log.debug("Previous callback встановлено");
    }

    /**
     * Встановлює callback для завершення.
     */
    public void setOnComplete(Runnable callback) {
        this.onComplete = callback;
        log.debug("Complete callback встановлено");
    }

    /**
     * Програмно активує кнопку завершення.
     */
    public void triggerComplete() {
        if (completeOrderButton.isEnabled() && onComplete != null) {
            onComplete.run();
        }
    }

    /**
     * Перевіряє чи можна завершити замовлення.
     */
    public boolean canComplete() {
        return completeOrderButton.isEnabled();
    }

    /**
     * Встановлює кастомний текст для кнопки завершення.
     */
    public void setCompleteButtonText(String text) {
        completeOrderButton.setText(text);
    }

    /**
     * Встановлює іконку для кнопки завершення.
     */
    public void setCompleteButtonIcon(VaadinIcon icon) {
        completeOrderButton.setIcon(icon.create());
    }

    /**
     * Увімкнути/вимкнути кнопку завершення.
     */
    public void setCompleteButtonEnabled(boolean enabled) {
        completeOrderButton.setEnabled(enabled);
    }

    /**
     * Показує підказку для кнопки завершення.
     */
    public void setCompleteButtonTooltip(String tooltip) {
        completeOrderButton.getElement().setAttribute("title", tooltip);
    }

    // Геттери для тестування
    protected Button getCancelButton() { return cancelButton; }
    protected Button getPreviousButton() { return previousButton; }
    protected Button getCompleteOrderButton() { return completeOrderButton; }
}
