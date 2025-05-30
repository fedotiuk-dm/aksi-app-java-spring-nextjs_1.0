package com.aksi.ui.wizard.step2.substeps.photo_documentation.components;

import com.aksi.ui.wizard.step2.substeps.photo_documentation.domain.PhotoDocumentationState;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для навігації в фотодокументації.
 * Дотримується принципу Single Responsibility Principle (SRP).
 */
@Slf4j
public class NavigationComponent extends HorizontalLayout {

    // UI компоненти
    private Button cancelButton;
    private Button previousButton;
    private Button nextButton;

    // Callback interfaces
    @FunctionalInterface
    public interface NavigationHandler {
        void onNavigationAction();
    }

    // Event handlers
    private NavigationHandler onCancel;
    private NavigationHandler onPrevious;
    private NavigationHandler onNext;

    public NavigationComponent() {
        log.debug("Ініціалізація NavigationComponent");

        initializeLayout();
        createComponents();
        setupEventHandlers();
        updateWithInitialState();

        log.debug("NavigationComponent ініціалізовано успішно");
    }

    private void initializeLayout() {
        setJustifyContentMode(JustifyContentMode.BETWEEN);
        setAlignItems(Alignment.CENTER);
        setWidthFull();
        setPadding(true);
        setSpacing(true);

        getStyle()
            .set("border-top", "1px solid var(--lumo-contrast-20pct)")
            .set("background", "var(--lumo-contrast-5pct)")
            .set("margin-top", "var(--lumo-space-m)");
    }

    private void createComponents() {
        // Кнопка скасування (ліворуч)
        cancelButton = new Button("Скасувати");
        cancelButton.addThemeVariants(ButtonVariant.LUMO_TERTIARY);
        cancelButton.setIcon(VaadinIcon.CLOSE.create());

        // Кнопки навігації (праворуч)
        previousButton = new Button("Назад до розрахунку");
        previousButton.addThemeVariants(ButtonVariant.LUMO_TERTIARY);
        previousButton.setIcon(VaadinIcon.ARROW_LEFT.create());

        nextButton = new Button("Завершити додавання предмета");
        nextButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY, ButtonVariant.LUMO_SUCCESS);
        nextButton.setIcon(VaadinIcon.CHECK.create());

        // Групуємо праві кнопки
        HorizontalLayout rightButtons = new HorizontalLayout(previousButton, nextButton);
        rightButtons.setSpacing(true);

        add(cancelButton, rightButtons);
    }

    private void setupEventHandlers() {
        cancelButton.addClickListener(e -> {
            log.debug("Натиснуто кнопку скасування");
            if (onCancel != null) {
                onCancel.onNavigationAction();
            }
        });

        previousButton.addClickListener(e -> {
            log.debug("Натиснуто кнопку назад");
            if (onPrevious != null) {
                onPrevious.onNavigationAction();
            }
        });

        nextButton.addClickListener(e -> {
            log.debug("Натиснуто кнопку завершення");
            if (onNext != null) {
                onNext.onNavigationAction();
            }
        });
    }

    private void updateWithInitialState() {
        setCancelEnabled(true);
        setPreviousEnabled(true);
        setNextEnabled(true);
        setNextButtonText("Завершити додавання предмета");
    }

    /**
     * Оновлює стан навігації з domain state.
     */
    public void updateFromState(PhotoDocumentationState state) {
        setPreviousEnabled(state.isCanNavigateBack() && !state.isLoading());
        setNextEnabled(state.isCanContinueToNext() && !state.isLoading());
        setNextButtonText(state.getNextButtonText());

        // Під час завантаження всі кнопки заблоковані крім скасування
        if (state.isLoading()) {
            setLoadingState(true);
        } else {
            setLoadingState(false);
        }

        log.debug("Оновлено стан навігації з domain state");
    }

    /**
     * Встановлює стан завантаження.
     */
    public void setLoadingState(boolean isLoading) {
        if (isLoading) {
            previousButton.setEnabled(false);
            nextButton.setEnabled(false);
            nextButton.setText("Завантаження...");
            nextButton.setIcon(VaadinIcon.SPINNER.create());
        } else {
            // Стан буде оновлений через updateFromState
        }

        log.debug("Стан завантаження: {}", isLoading);
    }

    /**
     * Встановлює чи увімкнена кнопка скасування.
     */
    public void setCancelEnabled(boolean enabled) {
        cancelButton.setEnabled(enabled);
        log.debug("Кнопка скасування {}", enabled ? "увімкнена" : "вимкнена");
    }

    /**
     * Встановлює чи увімкнена кнопка назад.
     */
    public void setPreviousEnabled(boolean enabled) {
        previousButton.setEnabled(enabled);
        log.debug("Кнопка назад {}", enabled ? "увімкнена" : "вимкнена");
    }

    /**
     * Встановлює чи увімкнена кнопка завершення.
     */
    public void setNextEnabled(boolean enabled) {
        nextButton.setEnabled(enabled);
        log.debug("Кнопка завершення {}", enabled ? "увімкнена" : "вимкнена");
    }

    /**
     * Встановлює текст кнопки завершення.
     */
    public void setNextButtonText(String text) {
        nextButton.setText(text);
        log.debug("Оновлено текст кнопки завершення: {}", text);
    }

    /**
     * Встановлює обробник скасування.
     */
    public void setOnCancel(NavigationHandler handler) {
        this.onCancel = handler;
        log.debug("Встановлено обробник скасування");
    }

    /**
     * Встановлює обробник переходу назад.
     */
    public void setOnPrevious(NavigationHandler handler) {
        this.onPrevious = handler;
        log.debug("Встановлено обробник переходу назад");
    }

    /**
     * Встановлює обробник завершення.
     */
    public void setOnNext(NavigationHandler handler) {
        this.onNext = handler;
        log.debug("Встановлено обробник завершення");
    }

    /**
     * Встановлює кастомний текст для кнопки скасування.
     */
    public void setCancelButtonText(String text) {
        cancelButton.setText(text);
        log.debug("Оновлено текст кнопки скасування: {}", text);
    }

    /**
     * Встановлює кастомний текст для кнопки назад.
     */
    public void setPreviousButtonText(String text) {
        previousButton.setText(text);
        log.debug("Оновлено текст кнопки назад: {}", text);
    }

    /**
     * Показує індикатор успіху на кнопці завершення.
     */
    public void showNextSuccess() {
        nextButton.removeThemeVariants(ButtonVariant.LUMO_PRIMARY);
        nextButton.addThemeVariants(ButtonVariant.LUMO_SUCCESS);
        nextButton.setIcon(VaadinIcon.CHECK_CIRCLE.create());
        nextButton.setText("Завершено ✓");

        // Повертаємо стандартний вигляд через 2 секунди
        new java.util.Timer().schedule(new java.util.TimerTask() {
            @Override
            public void run() {
                getUI().ifPresent(ui -> ui.access(() -> {
                    nextButton.removeThemeVariants(ButtonVariant.LUMO_SUCCESS);
                    nextButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
                    nextButton.setIcon(VaadinIcon.CHECK.create());
                    nextButton.setText("Завершити додавання предмета");
                }));
            }
        }, 2000);

        log.debug("Показано індикатор успіху");
    }

    /**
     * Показує індикатор помилки на кнопці завершення.
     */
    public void showNextError() {
        nextButton.removeThemeVariants(ButtonVariant.LUMO_PRIMARY, ButtonVariant.LUMO_SUCCESS);
        nextButton.addThemeVariants(ButtonVariant.LUMO_ERROR);
        nextButton.setIcon(VaadinIcon.EXCLAMATION_CIRCLE.create());
        nextButton.setText("Помилка");

        // Повертаємо стандартний вигляд через 3 секунди
        new java.util.Timer().schedule(new java.util.TimerTask() {
            @Override
            public void run() {
                getUI().ifPresent(ui -> ui.access(() -> {
                    nextButton.removeThemeVariants(ButtonVariant.LUMO_ERROR);
                    nextButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
                    nextButton.setIcon(VaadinIcon.CHECK.create());
                    nextButton.setText("Завершити додавання предмета");
                }));
            }
        }, 3000);

        log.debug("Показано індикатор помилки");
    }

    /**
     * Фокусує кнопку завершення.
     */
    public void focusNextButton() {
        nextButton.focus();
        log.debug("Сфокусовано кнопку завершення");
    }

    /**
     * Фокусує кнопку назад.
     */
    public void focusPreviousButton() {
        previousButton.focus();
        log.debug("Сфокусовано кнопку назад");
    }

    /**
     * Перевіряє чи увімкнена кнопка завершення.
     */
    public boolean isNextEnabled() {
        return nextButton.isEnabled();
    }

    /**
     * Перевіряє чи увімкнена кнопка назад.
     */
    public boolean isPreviousEnabled() {
        return previousButton.isEnabled();
    }

    /**
     * Перевіряє чи увімкнена кнопка скасування.
     */
    public boolean isCancelEnabled() {
        return cancelButton.isEnabled();
    }

    /**
     * Ховає кнопку скасування.
     */
    public void hideCancelButton() {
        cancelButton.setVisible(false);
        log.debug("Сховано кнопку скасування");
    }

    /**
     * Показує кнопку скасування.
     */
    public void showCancelButton() {
        cancelButton.setVisible(true);
        log.debug("Показано кнопку скасування");
    }

    /**
     * Встановлює компактний режим (менші відступи).
     */
    public void setCompactMode(boolean compact) {
        if (compact) {
            setPadding(false);
            setSpacing(false);
            getStyle().set("margin-top", "var(--lumo-space-s)");
        } else {
            setPadding(true);
            setSpacing(true);
            getStyle().set("margin-top", "var(--lumo-space-m)");
        }

        log.debug("Компактний режим: {}", compact);
    }

    /**
     * Скидає компонент до початкового стану.
     */
    public void reset() {
        updateWithInitialState();
        showCancelButton();
        setCompactMode(false);
        log.debug("Навігацію скинуто до початкового стану");
    }
}
