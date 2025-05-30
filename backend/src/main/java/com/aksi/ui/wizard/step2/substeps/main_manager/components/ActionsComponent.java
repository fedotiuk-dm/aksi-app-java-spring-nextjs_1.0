package com.aksi.ui.wizard.step2.substeps.main_manager.components;

import com.aksi.ui.wizard.step2.substeps.main_manager.domain.ItemsManagerState;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для кнопок дій менеджера предметів.
 * Дотримується принципу SRP - відповідає тільки за відображення та обробку кнопок.
 */
@Slf4j
public class ActionsComponent extends HorizontalLayout {

    // UI елементи
    private Button addItemButton;
    private Button continueButton;

    // Обробники подій
    private Runnable onAddItem;
    private Runnable onContinueToNext;

    public ActionsComponent() {
        initializeLayout();
        createComponents();
        setupEventHandlers();
        updateWithInitialState();
        log.debug("ActionsComponent ініціалізовано");
    }

    private void initializeLayout() {
        setSpacing(true);
        setPadding(false);
        setJustifyContentMode(JustifyContentMode.BETWEEN);
        setDefaultVerticalComponentAlignment(Alignment.CENTER);
        setWidthFull();
    }

    private void createComponents() {
        // Кнопка додавання предмета
        addItemButton = new Button("Додати предмет", VaadinIcon.PLUS.create());
        addItemButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        addItemButton.setTooltipText("Додати новий предмет до замовлення");

        // Кнопка продовження
        continueButton = new Button("Продовжити до наступного етапу", VaadinIcon.ARROW_RIGHT.create());
        continueButton.addThemeVariants(ButtonVariant.LUMO_SUCCESS);
        continueButton.setIconAfterText(true);
        continueButton.setTooltipText("Перейти до налаштувань замовлення");

        add(addItemButton, continueButton);
    }

    private void setupEventHandlers() {
        addItemButton.addClickListener(e -> {
            log.debug("Натиснуто кнопку 'Додати предмет'");
            if (onAddItem != null) {
                onAddItem.run();
            }
        });

        continueButton.addClickListener(e -> {
            log.debug("Натиснуто кнопку 'Продовжити до наступного етапу'");
            if (onContinueToNext != null) {
                onContinueToNext.run();
            }
        });
    }

    private void updateWithInitialState() {
        // Початковий стан - можна додавати предмети, але не можна продовжити
        addItemButton.setEnabled(true);
        continueButton.setEnabled(false);
        continueButton.setText("Спочатку додайте предмети");
    }

    /**
     * Оновлює стан кнопок відповідно до стану менеджера.
     */
    public void updateFromState(ItemsManagerState state) {
        log.debug("Оновлення кнопок зі стану: може продовжити={}, завантажується={}",
                 state.isReadyForNext(), state.isLoading());

        updateAddItemButton(state);
        updateContinueButton(state);
    }

    private void updateAddItemButton(ItemsManagerState state) {
        addItemButton.setEnabled(!state.isLoading());

        if (state.isLoading()) {
            addItemButton.getStyle().set("opacity", "0.6");
        } else {
            addItemButton.getStyle().remove("opacity");
        }
    }

    private void updateContinueButton(ItemsManagerState state) {
        continueButton.setEnabled(state.isReadyForNext());
        continueButton.setText(state.getContinueButtonText());

        // Змінюємо стиль залежно від стану
        if (state.isReadyForNext()) {
            continueButton.removeThemeVariants(ButtonVariant.LUMO_CONTRAST);
            continueButton.addThemeVariants(ButtonVariant.LUMO_SUCCESS);
            continueButton.getStyle().remove("opacity");
        } else {
            continueButton.removeThemeVariants(ButtonVariant.LUMO_SUCCESS);
            continueButton.addThemeVariants(ButtonVariant.LUMO_CONTRAST);
            continueButton.getStyle().set("opacity", "0.7");
        }
    }

    /**
     * Встановлює обробник додавання предмета.
     */
    public void setOnAddItem(Runnable handler) {
        this.onAddItem = handler;
    }

    /**
     * Встановлює обробник продовження до наступного етапу.
     */
    public void setOnContinueToNext(Runnable handler) {
        this.onContinueToNext = handler;
    }

    /**
     * Встановлює стан завантаження для всіх кнопок.
     */
    public void setLoading(boolean isLoading) {
        addItemButton.setEnabled(!isLoading);
        continueButton.setEnabled(!isLoading);

        String opacity = isLoading ? "0.6" : null;
        addItemButton.getStyle().set("opacity", opacity);
        continueButton.getStyle().set("opacity", opacity);

        if (isLoading) {
            continueButton.setText("Завантаження...");
        }
    }

    /**
     * Встановлює фокус на кнопку додавання предмета.
     */
    public void focusAddButton() {
        addItemButton.focus();
    }

    /**
     * Встановлює фокус на кнопку продовження.
     */
    public void focusContinueButton() {
        continueButton.focus();
    }

    /**
     * Показує індикатор успіху на кнопці продовження.
     */
    public void showContinueSuccess() {
        continueButton.removeThemeVariants(ButtonVariant.LUMO_CONTRAST);
        continueButton.addThemeVariants(ButtonVariant.LUMO_SUCCESS, ButtonVariant.LUMO_PRIMARY);
        continueButton.setIcon(VaadinIcon.CHECK.create());

        // Повертаємо звичайний стан через 2 секунди
        continueButton.getUI().ifPresent(ui ->
            ui.access(() -> {
                try {
                    Thread.sleep(2000);
                    ui.access(() -> {
                        continueButton.setIcon(VaadinIcon.ARROW_RIGHT.create());
                        continueButton.removeThemeVariants(ButtonVariant.LUMO_PRIMARY);
                    });
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            })
        );
    }

    /**
     * Показує індикатор помилки на кнопці продовження.
     */
    public void showContinueError() {
        continueButton.removeThemeVariants(ButtonVariant.LUMO_SUCCESS, ButtonVariant.LUMO_CONTRAST);
        continueButton.addThemeVariants(ButtonVariant.LUMO_ERROR);
        continueButton.setIcon(VaadinIcon.WARNING.create());

        // Повертаємо звичайний стан через 3 секунди
        continueButton.getUI().ifPresent(ui ->
            ui.access(() -> {
                try {
                    Thread.sleep(3000);
                    ui.access(() -> {
                        continueButton.setIcon(VaadinIcon.ARROW_RIGHT.create());
                        continueButton.removeThemeVariants(ButtonVariant.LUMO_ERROR);
                        continueButton.addThemeVariants(ButtonVariant.LUMO_CONTRAST);
                    });
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            })
        );
    }

    /**
     * Перевіряє чи включена кнопка додавання.
     */
    public boolean isAddItemEnabled() {
        return addItemButton.isEnabled();
    }

    /**
     * Перевіряє чи включена кнопка продовження.
     */
    public boolean isContinueEnabled() {
        return continueButton.isEnabled();
    }

    /**
     * Отримує текст кнопки продовження.
     */
    public String getContinueButtonText() {
        return continueButton.getText();
    }

    /**
     * Скидає стан кнопок до початкових значень.
     */
    public void reset() {
        log.debug("Скидання стану кнопок до початкових значень");
        updateWithInitialState();

        // Очищаємо всі стилі
        addItemButton.getStyle().remove("opacity");
        continueButton.getStyle().remove("opacity");

        // Повертаємо початкові варіанти
        continueButton.removeThemeVariants(
                ButtonVariant.LUMO_ERROR,
                ButtonVariant.LUMO_PRIMARY,
                ButtonVariant.LUMO_CONTRAST
        );
        continueButton.addThemeVariants(ButtonVariant.LUMO_SUCCESS);
        continueButton.setIcon(VaadinIcon.ARROW_RIGHT.create());
    }
}
