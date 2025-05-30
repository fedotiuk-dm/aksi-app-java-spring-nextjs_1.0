package com.aksi.ui.wizard.step2.substeps.item_defects.components;

import java.util.List;
import java.util.Set;
import java.util.function.BiConsumer;

import com.vaadin.flow.component.checkbox.CheckboxGroup;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextArea;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для вибору дефектів та ризиків предмета.
 * Відповідає тільки за логіку вибору дефектів та ризиків (SRP).
 */
@Slf4j
public class DefectsAndRisksSelectionComponent extends VerticalLayout {

    private CheckboxGroup<String> defectsAndRisksCheckboxGroup;
    private TextArea noGuaranteeReasonArea;

    private BiConsumer<Set<String>, String> onDefectsAndRisksChanged; // (selectedDefects, noGuaranteeReason)

    public DefectsAndRisksSelectionComponent() {
        initializeLayout();
        createComponents();
        setupEventHandlers();

        log.debug("DefectsAndRisksSelectionComponent ініціалізовано");
    }

    private void initializeLayout() {
        setPadding(false);
        setSpacing(true);
        setWidthFull();
    }

    private void createComponents() {
        H4 title = new H4("Дефекти та ризики");
        title.getStyle().set("margin-top", "0").set("margin-bottom", "var(--lumo-space-s)");

        defectsAndRisksCheckboxGroup = new CheckboxGroup<>();
        defectsAndRisksCheckboxGroup.setLabel("Виберіть дефекти та ризики");
        defectsAndRisksCheckboxGroup.getStyle().set("--lumo-checkbox-group-column-count", "2");

        noGuaranteeReasonArea = new TextArea("Причина відсутності гарантій");
        noGuaranteeReasonArea.setPlaceholder("Обов'язково вкажіть детальну причину чому немає гарантій");
        noGuaranteeReasonArea.setVisible(false);
        noGuaranteeReasonArea.setRequired(false);
        noGuaranteeReasonArea.setWidthFull();
        noGuaranteeReasonArea.setMaxLength(500);
        noGuaranteeReasonArea.setValueChangeMode(com.vaadin.flow.data.value.ValueChangeMode.EAGER);

        add(title, defectsAndRisksCheckboxGroup, noGuaranteeReasonArea);
    }

    private void setupEventHandlers() {
        // Обробка зміни вибраних дефектів та ризиків
        defectsAndRisksCheckboxGroup.addSelectionListener(e -> {
            Set<String> selectedDefects = e.getValue();
            log.debug("Змінено вибір дефектів та ризиків: {}", selectedDefects);

            updateNoGuaranteeReasonVisibility(selectedDefects);
            notifyDefectsAndRisksChange(selectedDefects);
        });

        // Обробка змін у полі причини відсутності гарантій
        noGuaranteeReasonArea.addValueChangeListener(e -> {
            String noGuaranteeReason = e.getValue();
            log.debug("Змінено причину відсутності гарантій: {}",
                     noGuaranteeReason != null ? noGuaranteeReason.length() + " символів" : "порожня");

            notifyDefectsAndRisksChange(defectsAndRisksCheckboxGroup.getValue());
        });
    }

    /**
     * Оновлює видимість поля причини відсутності гарантій.
     */
    private void updateNoGuaranteeReasonVisibility(Set<String> selectedDefects) {
        boolean shouldShowReasonField = selectedDefects.contains("Без гарантій");

        noGuaranteeReasonArea.setVisible(shouldShowReasonField);
        noGuaranteeReasonArea.setRequired(shouldShowReasonField);

        if (shouldShowReasonField) {
            noGuaranteeReasonArea.focus();
        } else {
            noGuaranteeReasonArea.clear();
        }
    }

    /**
     * Повідомляє про зміну дефектів та ризиків.
     */
    private void notifyDefectsAndRisksChange(Set<String> selectedDefects) {
        if (onDefectsAndRisksChanged != null) {
            String noGuaranteeReason = noGuaranteeReasonArea.isVisible() ? noGuaranteeReasonArea.getValue() : null;
            onDefectsAndRisksChanged.accept(selectedDefects, noGuaranteeReason);
        }
    }

    /**
     * Завантажує доступні дефекти та ризики.
     */
    public void loadDefectsAndRisks(List<String> defectsAndRisks) {
        log.debug("Завантаження {} дефектів та ризиків", defectsAndRisks.size());

        defectsAndRisksCheckboxGroup.setItems(defectsAndRisks);
    }

    /**
     * Встановлює вибрані дефекти та ризики.
     */
    public void setSelectedDefectsAndRisks(Set<String> selectedDefects, String noGuaranteeReason) {
        log.debug("Встановлення дефектів та ризиків: {} (причина: {})", selectedDefects, noGuaranteeReason);

        defectsAndRisksCheckboxGroup.setValue(selectedDefects);

        if (selectedDefects.contains("Без гарантій")) {
            noGuaranteeReasonArea.setVisible(true);
            noGuaranteeReasonArea.setRequired(true);
            if (noGuaranteeReason != null && !noGuaranteeReason.trim().isEmpty()) {
                noGuaranteeReasonArea.setValue(noGuaranteeReason);
            }
        }
    }

    /**
     * Повертає поточний вибір дефектів та ризиків.
     */
    public DefectsAndRisksSelection getDefectsAndRisksSelection() {
        DefectsAndRisksSelection selection = new DefectsAndRisksSelection();
        selection.setSelectedDefectsAndRisks(defectsAndRisksCheckboxGroup.getValue());
        selection.setNoGuaranteeReason(noGuaranteeReasonArea.isVisible() ? noGuaranteeReasonArea.getValue() : null);
        return selection;
    }

    /**
     * Встановлює обробник зміни дефектів та ризиків.
     */
    public void setOnDefectsAndRisksChanged(BiConsumer<Set<String>, String> handler) {
        this.onDefectsAndRisksChanged = handler;
    }

    /**
     * Очищує вибір дефектів та ризиків.
     */
    public void clearSelection() {
        defectsAndRisksCheckboxGroup.clear();
        noGuaranteeReasonArea.clear();
        noGuaranteeReasonArea.setVisible(false);
        noGuaranteeReasonArea.setRequired(false);
    }

    /**
     * Перевіряє чи є дефекти або ризики вибрані.
     */
    public boolean hasSelection() {
        return !defectsAndRisksCheckboxGroup.getValue().isEmpty();
    }

    /**
     * Перевіряє валідність вибору.
     */
    public boolean isSelectionValid() {
        Set<String> selected = defectsAndRisksCheckboxGroup.getValue();

        // Якщо вибрано "Без гарантій", перевіряємо причину
        if (selected.contains("Без гарантій")) {
            String reason = noGuaranteeReasonArea.getValue();
            return reason != null && !reason.trim().isEmpty() && reason.trim().length() >= 10;
        }

        return true;
    }

    /**
     * Встановлює фокус на компонент.
     */
    public void focus() {
        if (noGuaranteeReasonArea.isVisible()) {
            noGuaranteeReasonArea.focus();
        }
        // CheckboxGroup не має методу focus()
    }

    /**
     * Блокує/розблоковує компонент.
     */
    public void setEnabled(boolean enabled) {
        defectsAndRisksCheckboxGroup.setEnabled(enabled);
        noGuaranteeReasonArea.setEnabled(enabled);
        setOpacity(enabled ? 1.0 : 0.6);
    }

    /**
     * Встановлює валідність компонента.
     */
    public void setInvalid(boolean invalid) {
        if (invalid) {
            if (noGuaranteeReasonArea.isVisible()) {
                noGuaranteeReasonArea.setInvalid(true);
                noGuaranteeReasonArea.setErrorMessage("Причина відсутності гарантій є обов'язковою і повинна містити детальний опис");
            }
        } else {
            noGuaranteeReasonArea.setInvalid(false);
            noGuaranteeReasonArea.setErrorMessage(null);
        }
    }

    /**
     * Встановлює підказку для користувача.
     */
    public void setHelperText(String helperText) {
        defectsAndRisksCheckboxGroup.setHelperText(helperText);
    }

    /**
     * Повертає кількість вибраних дефектів та ризиків.
     */
    public int getSelectedCount() {
        return defectsAndRisksCheckboxGroup.getValue().size();
    }

    /**
     * Перевіряє чи вибрано критичні ризики.
     */
    public boolean hasCriticalRisks() {
        return defectsAndRisksCheckboxGroup.getValue().stream()
                .anyMatch(risk -> risk.contains("Без гарантій") ||
                                 risk.contains("Ризики деформації") ||
                                 risk.contains("Ризики зміни кольору"));
    }

    /**
     * Повертає вибрані критичні ризики.
     */
    public Set<String> getCriticalRisks() {
        return defectsAndRisksCheckboxGroup.getValue().stream()
                .filter(risk -> risk.contains("Без гарантій") ||
                               risk.contains("Ризики деформації") ||
                               risk.contains("Ризики зміни кольору"))
                .collect(java.util.stream.Collectors.toSet());
    }

    /**
     * Встановлює прозорість компонента.
     */
    private void setOpacity(double opacity) {
        getStyle().set("opacity", String.valueOf(opacity));
    }

    /**
     * Клас для передачі даних про вибір дефектів та ризиків.
     */
    @Data
    public static class DefectsAndRisksSelection {
        private Set<String> selectedDefectsAndRisks;
        private String noGuaranteeReason;

        /**
         * Перевіряє чи є вибір валідним.
         */
        public boolean isValid() {
            if (selectedDefectsAndRisks == null) {
                return true;
            }

            // Якщо вибрано "Без гарантій", перевіряємо причину
            if (selectedDefectsAndRisks.contains("Без гарантій")) {
                return noGuaranteeReason != null &&
                       !noGuaranteeReason.trim().isEmpty() &&
                       noGuaranteeReason.trim().length() >= 10;
            }

            return true;
        }

        /**
         * Повертає загальну кількість дефектів та ризиків.
         */
        public int getTotalCount() {
            return selectedDefectsAndRisks != null ? selectedDefectsAndRisks.size() : 0;
        }

        /**
         * Перевіряє чи є критичні ризики.
         */
        public boolean hasCriticalRisks() {
            if (selectedDefectsAndRisks == null) {
                return false;
            }

            return selectedDefectsAndRisks.stream()
                    .anyMatch(risk -> risk.contains("Без гарантій") ||
                                     risk.contains("Ризики деформації") ||
                                     risk.contains("Ризики зміни кольору"));
        }
    }
}
