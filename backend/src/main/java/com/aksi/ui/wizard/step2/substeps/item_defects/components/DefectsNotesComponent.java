package com.aksi.ui.wizard.step2.substeps.item_defects.components;

import java.util.function.Consumer;

import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextArea;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для примітки до дефектів предмета.
 * Відповідає тільки за логіку введення примітки (SRP).
 */
@Slf4j
public class DefectsNotesComponent extends VerticalLayout {

    private TextArea defectsNotesArea;
    private Consumer<String> onNotesChanged;

    public DefectsNotesComponent() {
        initializeLayout();
        createComponents();
        setupEventHandlers();

        log.debug("DefectsNotesComponent ініціалізовано");
    }

    private void initializeLayout() {
        setPadding(false);
        setSpacing(true);
        setWidthFull();
    }

    private void createComponents() {
        H4 title = new H4("Додаткові примітки");
        title.getStyle().set("margin-top", "0").set("margin-bottom", "var(--lumo-space-s)");

        defectsNotesArea = new TextArea("Примітки щодо дефектів");
        defectsNotesArea.setPlaceholder("Додаткові деталі щодо виявлених дефектів та особливостей предмета");
        defectsNotesArea.setWidthFull();
        defectsNotesArea.setMaxLength(1000);
        defectsNotesArea.setValueChangeMode(com.vaadin.flow.data.value.ValueChangeMode.EAGER);

        // Встановлюємо висоту для зручності введення
        defectsNotesArea.setMinHeight("120px");
        defectsNotesArea.setMaxHeight("200px");

        add(title, defectsNotesArea);
    }

    private void setupEventHandlers() {
        defectsNotesArea.addValueChangeListener(e -> {
            String notes = e.getValue();
            log.debug("Змінено примітку до дефектів: {}",
                     notes != null ? notes.length() + " символів" : "порожня");

            if (onNotesChanged != null) {
                onNotesChanged.accept(notes);
            }
        });
    }

    /**
     * Встановлює примітку.
     */
    public void setNotes(String notes) {
        log.debug("Встановлення примітки: {}",
                 notes != null ? notes.length() + " символів" : "порожня");
        defectsNotesArea.setValue(notes != null ? notes : "");
    }

    /**
     * Повертає поточну примітку.
     */
    public String getNotes() {
        String notes = defectsNotesArea.getValue();
        return notes != null && !notes.trim().isEmpty() ? notes.trim() : null;
    }

    /**
     * Встановлює обробник зміни примітки.
     */
    public void setOnNotesChanged(Consumer<String> handler) {
        this.onNotesChanged = handler;
    }

    /**
     * Очищує примітку.
     */
    public void clearNotes() {
        defectsNotesArea.clear();
    }

    /**
     * Перевіряє чи є примітка заповнена.
     */
    public boolean hasNotes() {
        String notes = defectsNotesArea.getValue();
        return notes != null && !notes.trim().isEmpty();
    }

    /**
     * Встановлює фокус на компонент.
     */
    public void focus() {
        defectsNotesArea.focus();
    }

    /**
     * Блокує/розблоковує компонент.
     */
    public void setEnabled(boolean enabled) {
        defectsNotesArea.setEnabled(enabled);
        setOpacity(enabled ? 1.0 : 0.6);
    }

    /**
     * Встановлює валідність компонента.
     */
    public void setInvalid(boolean invalid) {
        defectsNotesArea.setInvalid(invalid);
        if (invalid) {
            defectsNotesArea.setErrorMessage("Примітка містить неприпустимі символи");
        } else {
            defectsNotesArea.setErrorMessage(null);
        }
    }

    /**
     * Встановлює підказку для користувача.
     */
    public void setHelperText(String helperText) {
        defectsNotesArea.setHelperText(helperText);
    }

    /**
     * Повертає довжину примітки.
     */
    public int getNotesLength() {
        String notes = defectsNotesArea.getValue();
        return notes != null ? notes.length() : 0;
    }

    /**
     * Встановлює максимальну довжину примітки.
     */
    public void setMaxLength(int maxLength) {
        defectsNotesArea.setMaxLength(maxLength);
    }

    /**
     * Встановлює плейсхолдер.
     */
    public void setPlaceholder(String placeholder) {
        defectsNotesArea.setPlaceholder(placeholder);
    }

    /**
     * Встановлює мітку поля.
     */
    public void setLabel(String label) {
        defectsNotesArea.setLabel(label);
    }

    /**
     * Встановлює обов'язковість поля.
     */
    public void setRequired(boolean required) {
        defectsNotesArea.setRequired(required);
        defectsNotesArea.setRequiredIndicatorVisible(required);
    }

    /**
     * Встановлює прозорість компонента.
     */
    private void setOpacity(double opacity) {
        getStyle().set("opacity", String.valueOf(opacity));
    }

    /**
     * Перевіряє чи перевищено максимальну довжину.
     */
    public boolean isMaxLengthExceeded() {
        return getNotesLength() > defectsNotesArea.getMaxLength();
    }

    /**
     * Повертає залишкову кількість символів.
     */
    public int getRemainingCharacters() {
        return defectsNotesArea.getMaxLength() - getNotesLength();
    }

    /**
     * Встановлює лічильник символів.
     */
    public void setCharacterCounterVisible(boolean visible) {
        if (visible) {
            defectsNotesArea.setHelperText(String.format("Залишилось символів: %d з %d",
                    getRemainingCharacters(), defectsNotesArea.getMaxLength()));
        }
    }
}
