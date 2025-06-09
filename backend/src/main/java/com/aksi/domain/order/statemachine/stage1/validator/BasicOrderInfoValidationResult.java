package com.aksi.domain.order.statemachine.stage1.validator;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Результат валідації базової інформації замовлення в етапі 1.3.
 * Містить інформацію про успішність валідації, помилки та попередження.
 */
public class BasicOrderInfoValidationResult {

    private final boolean valid;
    private final List<String> errors;
    private final List<String> warnings;
    private final String summary;

    private BasicOrderInfoValidationResult(boolean valid, List<String> errors,
                                         List<String> warnings, String summary) {
        this.valid = valid;
        this.errors = new ArrayList<>(errors);
        this.warnings = new ArrayList<>(warnings);
        this.summary = summary;
    }

    // Factory методи для створення результатів

    /**
     * Створює успішний результат валідації.
     */
    public static BasicOrderInfoValidationResult success() {
        return new BasicOrderInfoValidationResult(true, Collections.emptyList(),
                                                 Collections.emptyList(), "Валідація пройшла успішно");
    }

    /**
     * Створює успішний результат з попередженнями.
     */
    public static BasicOrderInfoValidationResult successWithWarnings(List<String> warnings) {
        return new BasicOrderInfoValidationResult(true, Collections.emptyList(),
                                                 warnings, "Валідація пройшла з попередженнями");
    }

    /**
     * Створює неуспішний результат з одною помилкою.
     */
    public static BasicOrderInfoValidationResult failure(String error) {
        List<String> errors = new ArrayList<>();
        errors.add(error);
        return new BasicOrderInfoValidationResult(false, errors, Collections.emptyList(),
                                                 "Валідація не пройшла");
    }

    /**
     * Створює неуспішний результат з кількома помилками.
     */
    public static BasicOrderInfoValidationResult failure(List<String> errors) {
        return new BasicOrderInfoValidationResult(false, errors, Collections.emptyList(),
                                                 "Валідація не пройшла");
    }

    /**
     * Створює неуспішний результат з помилками та попередженнями.
     */
    public static BasicOrderInfoValidationResult failure(List<String> errors, List<String> warnings) {
        return new BasicOrderInfoValidationResult(false, errors, warnings,
                                                 "Валідація не пройшла");
    }

    // Методи для комбінування результатів

    /**
     * Об'єднує поточний результат з іншим.
     */
    public BasicOrderInfoValidationResult combine(BasicOrderInfoValidationResult other) {
        if (other == null) return this;

        List<String> combinedErrors = new ArrayList<>(this.errors);
        combinedErrors.addAll(other.errors);

        List<String> combinedWarnings = new ArrayList<>(this.warnings);
        combinedWarnings.addAll(other.warnings);

        boolean combinedValid = this.valid && other.valid;
        String combinedSummary = combinedValid ? "Валідація пройшла успішно" : "Валідація не пройшла";

        return new BasicOrderInfoValidationResult(combinedValid, combinedErrors,
                                                 combinedWarnings, combinedSummary);
    }

    /**
     * Додає попередження до поточного результату.
     */
    public BasicOrderInfoValidationResult addWarning(String warning) {
        List<String> newWarnings = new ArrayList<>(this.warnings);
        newWarnings.add(warning);
        return new BasicOrderInfoValidationResult(this.valid, this.errors,
                                                 newWarnings, this.summary);
    }

    /**
     * Додає помилку до поточного результату.
     */
    public BasicOrderInfoValidationResult addError(String error) {
        List<String> newErrors = new ArrayList<>(this.errors);
        newErrors.add(error);
        return new BasicOrderInfoValidationResult(false, newErrors,
                                                 this.warnings, "Валідація не пройшла");
    }

    // Допоміжні методи

    /**
     * Перевіряє, чи результат валідний.
     */
    public boolean isValid() {
        return valid;
    }

    /**
     * Перевіряє, чи результат містить помилки.
     */
    public boolean hasErrors() {
        return !errors.isEmpty();
    }

    /**
     * Перевіряє, чи результат містить попередження.
     */
    public boolean hasWarnings() {
        return !warnings.isEmpty();
    }

    /**
     * Отримує всі помилки як один рядок.
     */
    public String getAllErrorsAsString() {
        return String.join("; ", errors);
    }

    /**
     * Отримує всі попередження як один рядок.
     */
    public String getAllWarningsAsString() {
        return String.join("; ", warnings);
    }

    /**
     * Отримує повний звіт про валідацію.
     */
    public String getFullReport() {
        StringBuilder report = new StringBuilder();
        report.append("Статус: ").append(summary).append("\n");

        if (hasErrors()) {
            report.append("Помилки: ").append(getAllErrorsAsString()).append("\n");
        }

        if (hasWarnings()) {
            report.append("Попередження: ").append(getAllWarningsAsString()).append("\n");
        }

        return report.toString();
    }

    // Геттери

    public List<String> getErrors() {
        return Collections.unmodifiableList(errors);
    }

    public List<String> getWarnings() {
        return Collections.unmodifiableList(warnings);
    }

    public String getSummary() {
        return summary;
    }

    @Override
    public String toString() {
        return "BasicOrderInfoValidationResult{" +
                "valid=" + valid +
                ", errorsCount=" + errors.size() +
                ", warningsCount=" + warnings.size() +
                ", summary='" + summary + '\'' +
                '}';
    }
}
