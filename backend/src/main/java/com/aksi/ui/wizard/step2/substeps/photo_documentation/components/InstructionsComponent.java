package com.aksi.ui.wizard.step2.substeps.photo_documentation.components;

import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для відображення інструкцій щодо фотодокументації.
 * Дотримується принципу Single Responsibility Principle (SRP).
 */
@Slf4j
public class InstructionsComponent extends VerticalLayout {

    private Div instructionsPanel;
    private H4 instructionsTitle;

    public InstructionsComponent() {
        log.debug("Ініціалізація InstructionsComponent");

        initializeLayout();
        createComponents();

        log.debug("InstructionsComponent ініціалізовано успішно");
    }

    private void initializeLayout() {
        setPadding(false);
        setSpacing(false);
        setWidthFull();
    }

    private void createComponents() {
        // Основна панель інструкцій
        instructionsPanel = new Div();
        instructionsPanel.getStyle()
            .set("background", "var(--lumo-primary-color-10pct)")
            .set("padding", "var(--lumo-space-m)")
            .set("border-radius", "var(--lumo-border-radius-m)")
            .set("border-left", "4px solid var(--lumo-primary-color)")
            .set("margin-bottom", "var(--lumo-space-m)");

        // Заголовок
        instructionsTitle = new H4("Інструкції щодо фотодокументації");
        instructionsTitle.getStyle()
            .set("margin-top", "0")
            .set("margin-bottom", "var(--lumo-space-s)")
            .set("color", "var(--lumo-primary-text-color)");

        // Контейнер інструкцій
        Div instructionsList = createInstructionsList();

        instructionsPanel.add(instructionsTitle, instructionsList);
        add(instructionsPanel);
    }

    private Div createInstructionsList() {
        Div instructionsList = new Div();

        instructionsList.add(
            createInstructionItem("📷", "Зробіть фото предмета з різних ракурсів"),
            createInstructionItem("🔍", "Сфокусуйтеся на дефектах і забрудненнях"),
            createInstructionItem("📐", "Максимум 5 фото на предмет"),
            createInstructionItem("💾", "Розмір кожного фото до 5 МБ"),
            createInstructionItem("✨", "Фото автоматично стискуються для оптимального зберігання")
        );

        return instructionsList;
    }

    private Div createInstructionItem(String icon, String text) {
        Div item = new Div();
        item.getStyle()
            .set("margin-bottom", "var(--lumo-space-xs)")
            .set("display", "flex")
            .set("align-items", "center");

        Span iconSpan = new Span(icon);
        iconSpan.getStyle()
            .set("margin-right", "var(--lumo-space-s)")
            .set("font-size", "1.2em")
            .set("flex-shrink", "0");

        Span textSpan = new Span(text);
        textSpan.getStyle()
            .set("color", "var(--lumo-body-text-color)")
            .set("line-height", "1.4");

        item.add(iconSpan, textSpan);
        return item;
    }

    /**
     * Оновлює максимальну кількість фото в інструкціях.
     */
    public void updateMaxPhotos(int maxPhotos) {
        log.debug("Оновлення максимальної кількості фото: {}", maxPhotos);

        // Знаходимо та оновлюємо відповідну інструкцію
        instructionsPanel.removeAll();
        instructionsPanel.add(instructionsTitle, createUpdatedInstructionsList(maxPhotos));
    }

    /**
     * Оновлює максимальний розмір файлу в інструкціях.
     */
    public void updateMaxFileSize(int maxFileSizeMB) {
        log.debug("Оновлення максимального розміру файлу: {} МБ", maxFileSizeMB);

        // Знаходимо та оновлюємо відповідну інструкцію
        instructionsPanel.removeAll();
        instructionsPanel.add(instructionsTitle, createUpdatedInstructionsList(5, maxFileSizeMB));
    }

    /**
     * Оновлює обидва параметри одночасно.
     */
    public void updateInstructions(int maxPhotos, int maxFileSizeMB) {
        log.debug("Оновлення інструкцій: {} фото, {} МБ", maxPhotos, maxFileSizeMB);

        instructionsPanel.removeAll();
        instructionsPanel.add(instructionsTitle, createUpdatedInstructionsList(maxPhotos, maxFileSizeMB));
    }

    private Div createUpdatedInstructionsList(int maxPhotos) {
        return createUpdatedInstructionsList(maxPhotos, 5);
    }

    private Div createUpdatedInstructionsList(int maxPhotos, int maxFileSizeMB) {
        Div instructionsList = new Div();

        instructionsList.add(
            createInstructionItem("📷", "Зробіть фото предмета з різних ракурсів"),
            createInstructionItem("🔍", "Сфокусуйтеся на дефектах і забрудненнях"),
            createInstructionItem("📐", String.format("Максимум %d фото на предмет", maxPhotos)),
            createInstructionItem("💾", String.format("Розмір кожного фото до %d МБ", maxFileSizeMB)),
            createInstructionItem("✨", "Фото автоматично стискуються для оптимального зберігання")
        );

        return instructionsList;
    }

    /**
     * Показує або ховає компонент.
     */
    public void setVisible(boolean visible) {
        super.setVisible(visible);
        log.debug("Компонент інструкцій {}", visible ? "показаний" : "схований");
    }

    /**
     * Встановлює кастомний стиль панелі.
     */
    public void setCustomStyle(String backgroundColor, String borderColor) {
        instructionsPanel.getStyle()
            .set("background", backgroundColor)
            .set("border-left", "4px solid " + borderColor);

        log.debug("Застосовано кастомний стиль: фон={}, рамка={}", backgroundColor, borderColor);
    }

    /**
     * Додає додаткову інструкцію.
     */
    public void addCustomInstruction(String icon, String text) {
        log.debug("Додавання кастомної інструкції: {}", text);

        Div currentInstructions = (Div) instructionsPanel.getChildren()
                .filter(component -> component instanceof Div)
                .findFirst()
                .orElse(null);

        if (currentInstructions != null) {
            currentInstructions.add(createInstructionItem(icon, text));
        }
    }

    /**
     * Встановлює заголовок інструкцій.
     */
    public void setInstructionsTitle(String title) {
        instructionsTitle.setText(title);
        log.debug("Оновлено заголовок інструкцій: {}", title);
    }

    /**
     * Встановлює режим компактного відображення.
     */
    public void setCompactMode(boolean compact) {
        if (compact) {
            instructionsPanel.getStyle()
                .set("padding", "var(--lumo-space-s)")
                .set("margin-bottom", "var(--lumo-space-s)");

            instructionsTitle.getStyle()
                .set("font-size", "1.1em")
                .set("margin-bottom", "var(--lumo-space-xs)");
        } else {
            instructionsPanel.getStyle()
                .set("padding", "var(--lumo-space-m)")
                .set("margin-bottom", "var(--lumo-space-m)");

            instructionsTitle.getStyle()
                .remove("font-size")
                .set("margin-bottom", "var(--lumo-space-s)");
        }

        log.debug("Режим компактного відображення: {}", compact);
    }

    /**
     * Виділяє важливу інструкцію.
     */
    public void highlightImportantInstructions() {
        instructionsPanel.getStyle()
            .set("background", "var(--lumo-warning-color-10pct)")
            .set("border-left", "4px solid var(--lumo-warning-color)");

        instructionsTitle.getStyle()
            .set("color", "var(--lumo-warning-text-color)");

        log.debug("Виділено важливі інструкції");
    }

    /**
     * Повертає стандартний стиль.
     */
    public void resetToDefaultStyle() {
        instructionsPanel.getStyle()
            .set("background", "var(--lumo-primary-color-10pct)")
            .set("border-left", "4px solid var(--lumo-primary-color)");

        instructionsTitle.getStyle()
            .set("color", "var(--lumo-primary-text-color)");

        log.debug("Повернено стандартний стиль");
    }
}
