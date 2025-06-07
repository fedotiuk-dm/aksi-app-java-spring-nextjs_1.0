package com.aksi.domain.order.statemachine.stage2.substep3.dto;

import java.util.List;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для підетапу 2.3: Забруднення, дефекти та ризики
 *
 * Містить інформацію про:
 * - Вибрані плями (мультивибір)
 * - Вибрані дефекти та ризики (мультивибір)
 * - Примітки щодо дефектів
 * - Автоматичні рекомендації та попередження
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class DefectsStainsDTO {

    /**
     * Вибрані типи плям (коди з БД)
     * Приклад: ["fat", "blood", "protein", "wine", "coffee"]
     */
    @Builder.Default
    private Set<String> selectedStains = Set.of();

    /**
     * Кастомний тип плями (якщо вибрано "Інше")
     */
    private String customStain;

    /**
     * Вибрані типи дефектів (коди з БД)
     * Приклад: ["wear", "torn", "missing_hardware", "damaged_hardware"]
     */
    @Builder.Default
    private Set<String> selectedDefects = Set.of();

    /**
     * Вибрані ризики (коди з БД)
     * Приклад: ["color_change_risk", "deformation_risk"]
     */
    @Builder.Default
    private Set<String> selectedRisks = Set.of();

    /**
     * Примітки щодо дефектів (вільний текст)
     */
    private String defectNotes;

    /**
     * Чи вибрана опція "Без гарантій"
     */
    @Builder.Default
    private Boolean noWarranty = false;

    /**
     * Обов'язкове пояснення причин "Без гарантій"
     */
    private String noWarrantyReason;

    /**
     * Автоматично рекомендовані модифікатори цін
     * (генеруються на основі вибраних плям/дефектів)
     */
    @Builder.Default
    private List<String> recommendedModifiers = List.of();

    /**
     * Попередження про ризики
     * (генеруються на основі комбінації плям/дефектів/матеріалу)
     */
    @Builder.Default
    private List<String> riskWarnings = List.of();

    /**
     * Додаткові рекомендації по обробці
     */
    @Builder.Default
    private List<String> processingRecommendations = List.of();

    /**
     * Чи пройшла валідація
     */
    @Builder.Default
    private Boolean isValid = false;

    /**
     * Список помилок валідації
     */
    @Builder.Default
    private List<String> validationErrors = List.of();

    /**
     * Перевіряє чи є вибрані плями
     */
    public boolean hasStains() {
        return !selectedStains.isEmpty() || (customStain != null && !customStain.trim().isEmpty());
    }

    /**
     * Перевіряє чи є вибрані дефекти
     */
    public boolean hasDefects() {
        return !selectedDefects.isEmpty();
    }

    /**
     * Перевіряє чи є вибрані ризики
     */
    public boolean hasRisks() {
        return !selectedRisks.isEmpty();
    }

    /**
     * Перевіряє чи є критичні проблеми (високий рівень ризику)
     */
    public boolean hasCriticalIssues() {
        return !riskWarnings.isEmpty() &&
               riskWarnings.stream().anyMatch(warning ->
                   warning.toLowerCase().contains("високий") ||
                   warning.toLowerCase().contains("критичний"));
    }

    /**
     * Перевіряє чи потрібні спеціальні методи обробки
     */
    public boolean requiresSpecialTreatment() {
        return !recommendedModifiers.isEmpty() ||
               !processingRecommendations.isEmpty();
    }

    /**
     * Перевіряє чи заповнені всі обов'язкові поля
     */
    public boolean isComplete() {
        // Якщо вибрано "Без гарантій", повинна бути вказана причина
        if (Boolean.TRUE.equals(noWarranty)) {
            return noWarrantyReason != null && !noWarrantyReason.trim().isEmpty();
        }

        // Інакше достатньо хоча б однієї вибраної плями або дефекту,
        // або зазначення що проблем немає
        return hasStains() || hasDefects() || hasRisks();
    }

    /**
     * Повертає загальну кількість вибраних проблем
     */
    public int getTotalIssuesCount() {
        int count = selectedStains.size() + selectedDefects.size() + selectedRisks.size();
        if (customStain != null && !customStain.trim().isEmpty()) {
            count++;
        }
        return count;
    }

    /**
     * Генерує короткий опис вибраних проблем
     */
    public String getIssuesSummary() {
        if (getTotalIssuesCount() == 0) {
            return "Без особливих проблем";
        }

        StringBuilder summary = new StringBuilder();

        if (!selectedStains.isEmpty()) {
            summary.append("Плями: ").append(selectedStains.size()).append("; ");
        }

        if (!selectedDefects.isEmpty()) {
            summary.append("Дефекти: ").append(selectedDefects.size()).append("; ");
        }

        if (!selectedRisks.isEmpty()) {
            summary.append("Ризики: ").append(selectedRisks.size()).append("; ");
        }

        if (Boolean.TRUE.equals(noWarranty)) {
            summary.append("БЕЗ ГАРАНТІЙ");
        }

        return summary.toString().trim();
    }
}
