package com.aksi.ui.wizard.step2.substeps.item_defects.domain;

import java.util.List;
import java.util.Set;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * Domain Model для стану дефектів, плям та ризиків предмета.
 * Відповідає за бізнес-логіку дефектів та валідацію.
 */
@Data
@Builder
@Slf4j
public class ItemDefectsState {

    private final String itemCategory;
    private final String itemName;

    // Плями
    private final Set<String> selectedStains;
    private final String otherStains;

    // Дефекти та ризики
    private final Set<String> selectedDefectsAndRisks;
    private final String noGuaranteeReason;
    private final String defectsNotes;

    // Доступні опції
    private final List<String> availableStainTypes;
    private final List<String> availableDefectsAndRisks;

    // Стан валідності
    private final boolean isValid;
    private final List<String> validationErrors;

    // Правила видимості
    private final boolean otherStainsVisible;
    private final boolean noGuaranteeReasonVisible;

    /**
     * Створює початковий стан дефектів для предмета.
     */
    public static ItemDefectsState createInitial(String itemCategory, String itemName) {
        log.debug("Створюється початковий стан дефектів для {} - {}", itemCategory, itemName);

        return ItemDefectsState.builder()
                .itemCategory(itemCategory)
                .itemName(itemName)
                .selectedStains(Set.of())
                .otherStains(null)
                .selectedDefectsAndRisks(Set.of())
                .noGuaranteeReason(null)
                .defectsNotes(null)
                .availableStainTypes(List.of())
                .availableDefectsAndRisks(List.of())
                .isValid(true) // За замовчуванням валідно (поля не обов'язкові)
                .validationErrors(List.of())
                .otherStainsVisible(false)
                .noGuaranteeReasonVisible(false)
                .build();
    }

    /**
     * Створює стан з оновленими дефектами.
     */
    public ItemDefectsState withDefects(
            Set<String> stains,
            String otherStains,
            Set<String> defectsAndRisks,
            String noGuaranteeReason,
            String defectsNotes) {

        log.debug("Оновлюється стан дефектів: {} плям, {} дефектів/ризиків",
                 stains.size(), defectsAndRisks.size());

        // Валідуємо нові дефекти
        var validationResult = validateDefects(stains, otherStains, defectsAndRisks, noGuaranteeReason);

        return ItemDefectsState.builder()
                .itemCategory(this.itemCategory)
                .itemName(this.itemName)
                .selectedStains(Set.copyOf(stains))
                .otherStains(otherStains)
                .selectedDefectsAndRisks(Set.copyOf(defectsAndRisks))
                .noGuaranteeReason(noGuaranteeReason)
                .defectsNotes(defectsNotes)
                .availableStainTypes(this.availableStainTypes)
                .availableDefectsAndRisks(this.availableDefectsAndRisks)
                .isValid(validationResult.isValid())
                .validationErrors(validationResult.errors())
                .otherStainsVisible(stains.contains("Інше"))
                .noGuaranteeReasonVisible(defectsAndRisks.contains("Без гарантій"))
                .build();
    }

    /**
     * Створює стан з оновленими доступними опціями.
     */
    public ItemDefectsState withAvailableOptions(
            List<String> stainTypes,
            List<String> defectsAndRisks) {

        log.debug("Оновлюються доступні опції: {} типів плям, {} дефектів/ризиків",
                 stainTypes.size(), defectsAndRisks.size());

        return ItemDefectsState.builder()
                .itemCategory(this.itemCategory)
                .itemName(this.itemName)
                .selectedStains(this.selectedStains)
                .otherStains(this.otherStains)
                .selectedDefectsAndRisks(this.selectedDefectsAndRisks)
                .noGuaranteeReason(this.noGuaranteeReason)
                .defectsNotes(this.defectsNotes)
                .availableStainTypes(List.copyOf(stainTypes))
                .availableDefectsAndRisks(List.copyOf(defectsAndRisks))
                .isValid(this.isValid)
                .validationErrors(this.validationErrors)
                .otherStainsVisible(this.otherStainsVisible)
                .noGuaranteeReasonVisible(this.noGuaranteeReasonVisible)
                .build();
    }

    /**
     * Валідує дефекти предмета.
     */
    private ValidationResult validateDefects(
            Set<String> stains,
            String otherStains,
            Set<String> defectsAndRisks,
            String noGuaranteeReason) {

        var errors = new java.util.ArrayList<String>();

        // Валідація інших плям
        if (stains.contains("Інше") && (otherStains == null || otherStains.trim().isEmpty())) {
            errors.add("Необхідно вказати тип іншої плями");
        }

        // Валідація причини відсутності гарантій
        if (defectsAndRisks.contains("Без гарантій")) {
            if (noGuaranteeReason == null || noGuaranteeReason.trim().isEmpty()) {
                errors.add("Причина відсутності гарантій є обов'язковою");
            } else if (noGuaranteeReason.trim().length() < 10) {
                errors.add("Причина відсутності гарантій повинна містити детальний опис (мінімум 10 символів)");
            }
        }

        return new ValidationResult(errors.isEmpty(), List.copyOf(errors));
    }

    /**
     * Повертає фінальний рядок плям для збереження.
     */
    public String getFinalStainsString() {
        if (selectedStains.isEmpty()) {
            return null;
        }

        return selectedStains.stream()
                .filter(stain -> !"Інше".equals(stain))
                .collect(java.util.stream.Collectors.joining(", "));
    }

    /**
     * Повертає фінальний рядок дефектів та ризиків для збереження.
     */
    public String getFinalDefectsAndRisksString() {
        if (selectedDefectsAndRisks.isEmpty()) {
            return null;
        }

        return String.join(", ", selectedDefectsAndRisks);
    }

    /**
     * Перевіряє чи є критичні помилки що блокують збереження.
     */
    public boolean hasCriticalErrors() {
        return !isValid && validationErrors.stream()
                .anyMatch(error -> error.contains("обов'язков"));
    }

    /**
     * Перевіряє чи є дефекти або плями вибрані.
     */
    public boolean hasAnyDefects() {
        return !selectedStains.isEmpty() || !selectedDefectsAndRisks.isEmpty();
    }

    /**
     * Перевіряє чи потребує увага через критичні ризики.
     */
    public boolean requiresAttention() {
        return selectedDefectsAndRisks.contains("Без гарантій") ||
               selectedDefectsAndRisks.contains("Ризики деформації") ||
               selectedDefectsAndRisks.contains("Ризики зміни кольору");
    }

    /**
     * Повертає кількість вибраних плям (включаючи інші).
     */
    public int getTotalStainsCount() {
        int count = selectedStains.size();
        if (selectedStains.contains("Інше") && otherStains != null && !otherStains.trim().isEmpty()) {
            // "Інше" вже включено в selectedStains, не додаємо додатково
            return count;
        }
        return count;
    }

    /**
     * Повертає кількість вибраних дефектів та ризиків.
     */
    public int getTotalDefectsAndRisksCount() {
        return selectedDefectsAndRisks.size();
    }

    /**
     * Результат валідації.
     */
    private record ValidationResult(boolean isValid, List<String> errors) {}
}
