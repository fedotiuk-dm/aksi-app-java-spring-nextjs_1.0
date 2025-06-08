package com.aksi.domain.order.statemachine.stage2.substep3.validator;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep3.dto.DefectsStainsDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Валідатор для підетапу 2.3: Забруднення, дефекти та ризики
 *
 * Відповідає за:
 * - Валідацію вибраних плям та дефектів
 * - Перевірку логічності комбінацій
 * - Валідацію обов'язкових полів
 * - Бізнес-правила "Без гарантій"
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DefectsStainsValidator {

    /**
     * Максимальна кількість плям, яку можна вибрати
     */
    private static final int MAX_STAINS_COUNT = 10;

    /**
     * Максимальна кількість дефектів, яку можна вибрати
     */
    private static final int MAX_DEFECTS_COUNT = 8;

    /**
     * Критичні комбінації плям, які потребують особливої уваги
     */
    private static final Set<Set<String>> CRITICAL_STAIN_COMBINATIONS = Set.of(
        Set.of("blood", "protein"), // Кров + білок = складне видалення
        Set.of("oil", "wine"),      // Жир + вино = ризик закріплення
        Set.of("ink", "cosmetics")  // Чорнило + косметика = хімічний конфлікт
    );

    /**
     * Дефекти, які автоматично потребують "Без гарантій"
     */
    private static final Set<String> NO_WARRANTY_DEFECTS = Set.of(
        "severely_worn",      // Сильний знос
        "structural_damage",  // Структурні пошкодження
        "color_fading",       // Вицвітання
        "fabric_degradation"  // Деградація тканини
    );

    /**
     * Основна валідація DefectsStainsDTO
     */
    public ValidationResult validate(DefectsStainsDTO defectsStains) {
        log.debug("Валідація дефектів та плям: {}", defectsStains);

        if (defectsStains == null) {
            return ValidationResult.invalid("Дані про дефекти та плями не можуть бути порожніми");
        }

        List<String> errors = new ArrayList<>();

        // Базова валідація
        validateBasicFields(defectsStains, errors);

        // Валідація кількості
        validateCounts(defectsStains, errors);

        // Валідація комбінацій
        validateCombinations(defectsStains, errors);

        // Валідація "Без гарантій"
        validateNoWarranty(defectsStains, errors);

        // Валідація кастомних плям
        validateCustomStains(defectsStains, errors);

        return errors.isEmpty()
            ? ValidationResult.valid()
            : ValidationResult.invalid(errors);
    }

    /**
     * Швидка перевірка готовності до наступного кроку
     */
    public boolean isReadyForNextStep(DefectsStainsDTO defectsStains) {
        if (defectsStains == null) {
            return false;
        }

        // Мінімальні вимоги для переходу
        boolean hasMinimalData = defectsStains.hasStains() ||
                                defectsStains.hasDefects() ||
                                defectsStains.hasRisks();

        // Якщо вибрано "Без гарантій", має бути причина
        if (Boolean.TRUE.equals(defectsStains.getNoWarranty())) {
            return defectsStains.getNoWarrantyReason() != null &&
                   !defectsStains.getNoWarrantyReason().trim().isEmpty();
        }

        return hasMinimalData;
    }

    /**
     * Перевіряє чи є критичні комбінації плям
     */
    public boolean hasCriticalStainCombinations(Set<String> selectedStains) {
        if (selectedStains == null || selectedStains.size() < 2) {
            return false;
        }

        return CRITICAL_STAIN_COMBINATIONS.stream()
                .anyMatch(criticalCombo -> selectedStains.containsAll(criticalCombo));
    }

    /**
     * Перевіряє чи потребують дефекти автоматичного "Без гарантій"
     */
    public boolean requiresNoWarranty(Set<String> selectedDefects) {
        if (selectedDefects == null || selectedDefects.isEmpty()) {
            return false;
        }

        return selectedDefects.stream()
                .anyMatch(NO_WARRANTY_DEFECTS::contains);
    }

    /**
     * Отримує рекомендації на основі вибраних проблем
     */
    public List<String> getRecommendations(DefectsStainsDTO defectsStains) {
        List<String> recommendations = new ArrayList<>();

        if (defectsStains == null) {
            return recommendations;
        }

        // Рекомендації для плям
        if (hasCriticalStainCombinations(defectsStains.getSelectedStains())) {
            recommendations.add("Критична комбінація плям - потребує спеціальної обробки");
        }

        // Рекомендації для дефектів
        if (requiresNoWarranty(defectsStains.getSelectedDefects())) {
            recommendations.add("Обрані дефекти потребують режиму 'Без гарантій'");
        }

        // Рекомендації для великої кількості проблем
        if (defectsStains.getTotalIssuesCount() > 5) {
            recommendations.add("Велика кількість проблем - рекомендується детальна консультація");
        }

        return recommendations;
    }

    /**
     * Отримує попередження про ризики
     */
    public List<String> getRiskWarnings(DefectsStainsDTO defectsStains) {
        List<String> warnings = new ArrayList<>();

        if (defectsStains == null) {
            return warnings;
        }

        // Попередження про критичні комбінації
        if (hasCriticalStainCombinations(defectsStains.getSelectedStains())) {
            warnings.add("УВАГА: Критична комбінація плям може ускладнити видалення");
        }

        // Попередження про дефекти
        if (requiresNoWarranty(defectsStains.getSelectedDefects())) {
            warnings.add("УВАГА: Обрані дефекти виключають можливість гарантії");
        }

        // Попередження про ризики
        if (defectsStains.getSelectedRisks().contains("color_change_risk")) {
            warnings.add("РИЗИК: Можлива зміна кольору під час обробки");
        }

        if (defectsStains.getSelectedRisks().contains("deformation_risk")) {
            warnings.add("РИЗИК: Можлива деформація під час обробки");
        }

        return warnings;
    }

    /**
     * Валідація базових полів
     */
    private void validateBasicFields(DefectsStainsDTO defectsStains, List<String> errors) {
        // Перевірка, що хоча б щось вибрано або зазначено відсутність проблем
        if (!defectsStains.hasStains() &&
            !defectsStains.hasDefects() &&
            !defectsStains.hasRisks() &&
            !Boolean.TRUE.equals(defectsStains.getNoWarranty())) {

            errors.add("Необхідно вибрати хоча б одну пляму, дефект або ризик, або зазначити 'Без гарантій'");
        }
    }

    /**
     * Валідація кількості вибраних елементів
     */
    private void validateCounts(DefectsStainsDTO defectsStains, List<String> errors) {
        if (defectsStains.getSelectedStains().size() > MAX_STAINS_COUNT) {
            errors.add(String.format("Максимальна кількість плям: %d", MAX_STAINS_COUNT));
        }

        if (defectsStains.getSelectedDefects().size() > MAX_DEFECTS_COUNT) {
            errors.add(String.format("Максимальна кількість дефектів: %d", MAX_DEFECTS_COUNT));
        }
    }

    /**
     * Валідація комбінацій
     */
    private void validateCombinations(DefectsStainsDTO defectsStains, List<String> errors) {
        // Перевірка критичних комбінацій плям
        if (hasCriticalStainCombinations(defectsStains.getSelectedStains())) {
            errors.add("Обрана критична комбінація плям потребує спеціального підходу");
        }
    }

    /**
     * Валідація "Без гарантій"
     */
    private void validateNoWarranty(DefectsStainsDTO defectsStains, List<String> errors) {
        if (Boolean.TRUE.equals(defectsStains.getNoWarranty())) {
            // Якщо вибрано "Без гарантій", повинна бути причина
            if (defectsStains.getNoWarrantyReason() == null ||
                defectsStains.getNoWarrantyReason().trim().isEmpty()) {
                errors.add("При виборі 'Без гарантій' необхідно вказати причину");
            }

            // Перевірка довжини причини
            if (defectsStains.getNoWarrantyReason() != null &&
                defectsStains.getNoWarrantyReason().length() < 10) {
                errors.add("Причина 'Без гарантій' повинна містити мінімум 10 символів");
            }
        }

        // Автоматична перевірка чи потрібно "Без гарантій"
        if (!Boolean.TRUE.equals(defectsStains.getNoWarranty()) &&
            requiresNoWarranty(defectsStains.getSelectedDefects())) {
            errors.add("Обрані дефекти вимагають режиму 'Без гарантій'");
        }
    }

    /**
     * Валідація кастомних плям
     */
    private void validateCustomStains(DefectsStainsDTO defectsStains, List<String> errors) {
        if (defectsStains.getCustomStain() != null && !defectsStains.getCustomStain().trim().isEmpty()) {
            if (defectsStains.getCustomStain().length() < 3) {
                errors.add("Опис кастомної плями повинен містити мінімум 3 символи");
            }

            if (defectsStains.getCustomStain().length() > 100) {
                errors.add("Опис кастомної плями не повинен перевищувати 100 символів");
            }
        }
    }

    /**
     * Результат валідації
     */
    public static class ValidationResult {
        private final boolean valid;
        private final List<String> errors;

        private ValidationResult(boolean valid, List<String> errors) {
            this.valid = valid;
            this.errors = errors != null ? new ArrayList<>(errors) : new ArrayList<>();
        }

        public static ValidationResult valid() {
            return new ValidationResult(true, List.of());
        }

        public static ValidationResult invalid(String error) {
            return new ValidationResult(false, List.of(error));
        }

        public static ValidationResult invalid(List<String> errors) {
            return new ValidationResult(false, errors);
        }

        public boolean isValid() {
            return valid;
        }

        public List<String> getErrors() {
            return new ArrayList<>(errors);
        }
    }
}
