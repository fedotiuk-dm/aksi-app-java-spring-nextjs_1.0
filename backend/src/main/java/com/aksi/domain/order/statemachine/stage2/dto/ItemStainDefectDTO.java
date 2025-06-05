package com.aksi.domain.order.statemachine.stage2.dto;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.aksi.domain.pricing.dto.DefectTypeDTO;
import com.aksi.domain.pricing.dto.StainTypeDTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для підетапу 2.3 "Забруднення, дефекти та ризики".
 *
 * Містить інформацію про:
 * - Доступні та вибрані типи плям з БД
 * - Доступні та вибрані типи дефектів та ризиків з БД
 * - Додаткові описи та примітки
 * - Спеціальну обробку для "Інше" та "Без гарантій"
 * - UI стан та налаштування
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Дані для підетапу забруднень, дефектів та ризиків")
public class ItemStainDefectDTO {

    // === Доступні опції з БД ===

    @Schema(description = "Доступні типи плям з БД")
    @Builder.Default
    private List<StainTypeDTO> availableStains = new ArrayList<>();

    @Schema(description = "Доступні типи дефектів та ризиків з БД")
    @Builder.Default
    private List<DefectTypeDTO> availableDefectsAndRisks = new ArrayList<>();

    // === Вибрані користувачем значення ===

    @Schema(description = "Вибрані типи плям (коди)")
    @Builder.Default
    private Set<String> selectedStains = new HashSet<>();

    @Schema(description = "Опис для власної плями (коли вибрано 'Інше')")
    private String customStainDescription;

    @Schema(description = "Вибрані типи дефектів та ризиків (коди)")
    @Builder.Default
    private Set<String> selectedDefectsAndRisks = new HashSet<>();

    @Schema(description = "Загальні примітки щодо дефектів")
    private String defectNotes;

    @Schema(description = "Причина 'Без гарантій' (обов'язкова при виборі цієї опції)")
    private String noGuaranteeReason;

    // === UI налаштування та стан ===

    @Schema(description = "Показувати поле для опису власної плями")
    @Builder.Default
    private Boolean showCustomStainField = false;

    @Schema(description = "Показувати поле для причини 'Без гарантій'")
    @Builder.Default
    private Boolean showNoGuaranteeReasonField = false;

    @Schema(description = "Чи має критичні ризики")
    @Builder.Default
    private Boolean hasCriticalRisks = false;

    // === Стан валідації ===

    @Schema(description = "Чи є помилки валідації")
    @Builder.Default
    private Boolean hasErrors = false;

    @Schema(description = "Повідомлення про помилку")
    private String errorMessage;

    // === Методи для роботи з плямами ===

    /**
     * Перевіряє, чи вибрано "Інше" серед плям.
     */
    public boolean hasCustomStain() {
        return selectedStains != null && selectedStains.contains("OTHER");
    }

    /**
     * Перевіряє, чи вибрано "Без гарантій" серед дефектів.
     */
    public boolean hasNoGuarantee() {
        return selectedDefectsAndRisks != null && selectedDefectsAndRisks.contains("NO_GUARANTEE");
    }

    /**
     * Перевіряє, чи є критичні ризики серед вибраних дефектів.
     */
    public boolean checkCriticalRisks() {
        if (selectedDefectsAndRisks == null) {
            return false;
        }

        return selectedDefectsAndRisks.contains("COLOR_CHANGE_RISK") ||
               selectedDefectsAndRisks.contains("DEFORMATION_RISK") ||
               selectedDefectsAndRisks.contains("NO_GUARANTEE");
    }

    // === Методи валідації ===

    /**
     * Перевіряє базову валідність даних.
     */
    public boolean isBasicValid() {
        // Перевірка обов'язкових полів для спеціальних випадків
        if (hasCustomStain() && (customStainDescription == null || customStainDescription.trim().isEmpty())) {
            return false;
        }

        if (hasNoGuarantee() && (noGuaranteeReason == null || noGuaranteeReason.trim().isEmpty())) {
            return false;
        }

        return !hasErrors;
    }

    /**
     * Перевіряє, чи заповнені доступні опції.
     */
    public boolean hasAvailableOptions() {
        return (availableStains != null && !availableStains.isEmpty()) ||
               (availableDefectsAndRisks != null && !availableDefectsAndRisks.isEmpty());
    }

    /**
     * Розраховує відсоток заповнення.
     */
    public int getCompletionPercentage() {
        int totalFields = 2; // плями + дефекти
        int filledFields = 0;

        if (selectedStains != null && !selectedStains.isEmpty()) {
            filledFields++;
        }

        if (selectedDefectsAndRisks != null && !selectedDefectsAndRisks.isEmpty()) {
            filledFields++;
        }

        return (filledFields * 100) / totalFields;
    }

    // === Методи очищення ===

    /**
     * Очищає помилки валідації.
     */
    public void clearErrors() {
        this.hasErrors = false;
        this.errorMessage = null;
    }

    /**
     * Встановлює помилку валідації.
     */
    public void setValidationError(String message) {
        this.hasErrors = true;
        this.errorMessage = message;
    }

    // === Методи для резюме ===

    /**
     * Генерує текстове резюме вибраних плям.
     */
    public String getStainsSummary() {
        if (selectedStains == null || selectedStains.isEmpty()) {
            return "Плями не вказані";
        }

        List<String> stainNames = new ArrayList<>();

        // Знаходимо назви вибраних плям
        if (availableStains != null) {
            for (String code : selectedStains) {
                availableStains.stream()
                    .filter(stain -> code.equals(stain.getCode()))
                    .findFirst()
                    .ifPresent(stain -> stainNames.add(stain.getName()));
            }
        }

        // Додаємо опис для власної плями
        if (hasCustomStain() && customStainDescription != null && !customStainDescription.trim().isEmpty()) {
            stainNames.add("Інше: " + customStainDescription);
        }

        return stainNames.isEmpty() ? "Плями не вказані" : String.join(", ", stainNames);
    }

    /**
     * Генерує текстове резюме вибраних дефектів та ризиків.
     */
    public String getDefectsSummary() {
        if (selectedDefectsAndRisks == null || selectedDefectsAndRisks.isEmpty()) {
            return "Дефекти та ризики не вказані";
        }

        List<String> defectNames = new ArrayList<>();

        // Знаходимо назви вибраних дефектів
        if (availableDefectsAndRisks != null) {
            for (String code : selectedDefectsAndRisks) {
                availableDefectsAndRisks.stream()
                    .filter(defect -> code.equals(defect.getCode()))
                    .findFirst()
                    .ifPresent(defect -> defectNames.add(defect.getName()));
            }
        }

        // Додаємо примітки
        if (defectNotes != null && !defectNotes.trim().isEmpty()) {
            defectNames.add("Примітки: " + defectNotes);
        }

        // Додаємо причину для "Без гарантій"
        if (hasNoGuarantee() && noGuaranteeReason != null && !noGuaranteeReason.trim().isEmpty()) {
            defectNames.add("Причина відсутності гарантій: " + noGuaranteeReason);
        }

        return defectNames.isEmpty() ? "Дефекти та ризики не вказані" : String.join(", ", defectNames);
    }

    /**
     * Генерує повне резюме підетапу.
     */
    public String getFullSummary() {
        List<String> summaryParts = new ArrayList<>();

        String stainsSummary = getStainsSummary();
        if (!"Плями не вказані".equals(stainsSummary)) {
            summaryParts.add("Плями: " + stainsSummary);
        }

        String defectsSummary = getDefectsSummary();
        if (!"Дефекти та ризики не вказані".equals(defectsSummary)) {
            summaryParts.add("Дефекти: " + defectsSummary);
        }

        if (hasCriticalRisks) {
            summaryParts.add("⚠️ УВАГА: Виявлено критичні ризики!");
        }

        return summaryParts.isEmpty() ? "Підетап не заповнений" : String.join("; ", summaryParts);
    }

    // === Допоміжні методи ===

    /**
     * Знаходить StainTypeDTO за кодом.
     */
    public StainTypeDTO findStainByCode(String code) {
        if (availableStains == null || code == null) {
            return null;
        }

        return availableStains.stream()
            .filter(stain -> code.equals(stain.getCode()))
            .findFirst()
            .orElse(null);
    }

    /**
     * Знаходить DefectTypeDTO за кодом.
     */
    public DefectTypeDTO findDefectByCode(String code) {
        if (availableDefectsAndRisks == null || code == null) {
            return null;
        }

        return availableDefectsAndRisks.stream()
            .filter(defect -> code.equals(defect.getCode()))
            .findFirst()
            .orElse(null);
    }
}
