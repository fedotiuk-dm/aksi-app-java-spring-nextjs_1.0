package com.aksi.domain.order.statemachine.stage2.validator;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.aksi.domain.order.statemachine.stage2.dto.ItemStainDefectDTO;
import com.aksi.domain.pricing.dto.DefectTypeDTO;
import com.aksi.domain.pricing.dto.StainTypeDTO;
import com.aksi.domain.pricing.service.DefectTypeService;
import com.aksi.domain.pricing.service.StainTypeService;

/**
 * Валідатор для підетапу 2.3 "Забруднення, дефекти та ризики".
 *
 * Перевіряє:
 * - Валідність вибраних типів плям проти активних записів з БД
 * - Валідність вибраних типів дефектів проти активних записів з БД
 * - Обов'язковість опису для власної плями (коли вибрано "OTHER")
 * - Обов'язковість причини для "Без гарантій" (коли вибрано "NO_GUARANTEE")
 * - Довжину полів та захист від ін'єкцій
 * - Спеціальні бізнес-правила
 */
@Component
public class ItemStainDefectValidator {

    private static final Logger logger = LoggerFactory.getLogger(ItemStainDefectValidator.class);

    // Максимальні довжини полів
    private static final int MAX_DEFECT_NOTES_LENGTH = 500;
    private static final int MAX_CUSTOM_DESCRIPTION_LENGTH = 100;
    private static final int MAX_NO_GUARANTEE_REASON_LENGTH = 200;

    // Коди для спеціальних типів (мають бути узгоджені з БД)
    private static final String OTHER_STAIN_CODE = "OTHER";
    private static final String NO_GUARANTEE_CODE = "NO_GUARANTEE";

    // Паттерни для перевірки безпеки
    private static final String[] DANGEROUS_PATTERNS = {
        "<script", "</script>", "javascript:", "onload=", "onerror=",
        "SELECT ", "INSERT ", "UPDATE ", "DELETE ", "DROP ", "CREATE "
    };

    private final StainTypeService stainTypeService;
    private final DefectTypeService defectTypeService;

    public ItemStainDefectValidator(
            StainTypeService stainTypeService,
            DefectTypeService defectTypeService) {
        this.stainTypeService = stainTypeService;
        this.defectTypeService = defectTypeService;
    }

    /**
     * Валідує дані плям та дефектів.
     *
     * @param data дані для валідації
     * @return список помилок валідації (порожній, якщо все валідно)
     */
    public List<String> validate(ItemStainDefectDTO data) {
        List<String> errors = new ArrayList<>();

        if (data == null) {
            errors.add("Дані плям та дефектів не можуть бути null");
            return errors;
        }

        // Валідуємо плями
        validateStains(data, errors);

        // Валідуємо дефекти та ризики
        validateDefectsAndRisks(data, errors);

        // Валідуємо примітки та додаткові поля
        validateAdditionalFields(data, errors);

        // Перевіряємо безпеку
        validateSecurity(data, errors);

        return errors;
    }

    /**
     * Перевіряє базову валідність без детальних помилок.
     * Використовується для швидкої перевірки можливості переходу до наступного кроку.
     *
     * @param data дані для перевірки
     * @return true, якщо базова валідація пройшла
     */
    public boolean isBasicValidationPassed(ItemStainDefectDTO data) {
        if (data == null) {
            return false;
        }

        // Перевіряємо обов'язкові поля для спеціальних випадків
        if (data.hasCustomStain()) {
            if (!StringUtils.hasText(data.getCustomStainDescription())) {
                return false;
            }
        }

        if (data.hasNoGuarantee()) {
            if (!StringUtils.hasText(data.getNoGuaranteeReason())) {
                return false;
            }
        }

        // Перевіряємо довжину полів
        if (data.getCustomStainDescription() != null &&
            data.getCustomStainDescription().length() > MAX_CUSTOM_DESCRIPTION_LENGTH) {
            return false;
        }

        if (data.getNoGuaranteeReason() != null &&
            data.getNoGuaranteeReason().length() > MAX_NO_GUARANTEE_REASON_LENGTH) {
            return false;
        }

        if (data.getDefectNotes() != null &&
            data.getDefectNotes().length() > MAX_DEFECT_NOTES_LENGTH) {
            return false;
        }

        return true;
    }

    /**
     * Валідує вибрані плями.
     */
    private void validateStains(ItemStainDefectDTO data, List<String> errors) {
        Set<String> selectedStains = data.getSelectedStains();

        if (selectedStains != null && !selectedStains.isEmpty()) {
            // Завантажуємо актуальні типи плям з БД
            List<StainTypeDTO> availableStains = data.getAvailableStains();
            if (availableStains == null || availableStains.isEmpty()) {
                errors.add("Не вдалося завантажити доступні типи плям з БД");
                return;
            }

            // Перевіряємо кожну вибрану пляму
            for (String stainCode : selectedStains) {
                if (!isValidStainCode(stainCode, availableStains)) {
                    errors.add("Невідомий тип плями: " + stainCode);
                }
            }

            // Перевіряємо обов'язковість опису для власної плями
            if (selectedStains.contains(OTHER_STAIN_CODE)) {
                if (!StringUtils.hasText(data.getCustomStainDescription())) {
                    errors.add("Опис власної плями є обов'язковим при виборі 'Інше'");
                } else if (data.getCustomStainDescription().length() > MAX_CUSTOM_DESCRIPTION_LENGTH) {
                    errors.add("Опис власної плями не може перевищувати " + MAX_CUSTOM_DESCRIPTION_LENGTH + " символів");
                }
            }
        }
    }

    /**
     * Валідує вибрані дефекти та ризики.
     */
    private void validateDefectsAndRisks(ItemStainDefectDTO data, List<String> errors) {
        Set<String> selectedDefects = data.getSelectedDefectsAndRisks();

        if (selectedDefects != null && !selectedDefects.isEmpty()) {
            // Завантажуємо актуальні типи дефектів з БД
            List<DefectTypeDTO> availableDefects = data.getAvailableDefectsAndRisks();
            if (availableDefects == null || availableDefects.isEmpty()) {
                errors.add("Не вдалося завантажити доступні типи дефектів з БД");
                return;
            }

            // Перевіряємо кожен вибраний дефект
            for (String defectCode : selectedDefects) {
                if (!isValidDefectCode(defectCode, availableDefects)) {
                    errors.add("Невідомий тип дефекту або ризику: " + defectCode);
                }
            }

            // Перевіряємо обов'язковість причини для "Без гарантій"
            if (selectedDefects.contains(NO_GUARANTEE_CODE)) {
                if (!StringUtils.hasText(data.getNoGuaranteeReason())) {
                    errors.add("Причина відсутності гарантій є обов'язковою при виборі 'Без гарантій'");
                } else if (data.getNoGuaranteeReason().length() > MAX_NO_GUARANTEE_REASON_LENGTH) {
                    errors.add("Причина відсутності гарантій не може перевищувати " + MAX_NO_GUARANTEE_REASON_LENGTH + " символів");
                }
            }
        }
    }

    /**
     * Валідує додаткові поля (примітки тощо).
     */
    private void validateAdditionalFields(ItemStainDefectDTO data, List<String> errors) {
        // Перевіряємо примітки щодо дефектів
        if (StringUtils.hasText(data.getDefectNotes())) {
            if (data.getDefectNotes().length() > MAX_DEFECT_NOTES_LENGTH) {
                errors.add("Примітки щодо дефектів не можуть перевищувати " + MAX_DEFECT_NOTES_LENGTH + " символів");
            }
        }

        // Перевіряємо довжину опису власної плями (якщо є)
        if (StringUtils.hasText(data.getCustomStainDescription()) &&
            data.getCustomStainDescription().length() > MAX_CUSTOM_DESCRIPTION_LENGTH) {
            errors.add("Опис власної плями не може перевищувати " + MAX_CUSTOM_DESCRIPTION_LENGTH + " символів");
        }

        // Перевіряємо довжину причини для "Без гарантій" (якщо є)
        if (StringUtils.hasText(data.getNoGuaranteeReason()) &&
            data.getNoGuaranteeReason().length() > MAX_NO_GUARANTEE_REASON_LENGTH) {
            errors.add("Причина відсутності гарантій не може перевищувати " + MAX_NO_GUARANTEE_REASON_LENGTH + " символів");
        }
    }

    /**
     * Перевіряє безпеку введених даних (захист від ін'єкцій).
     */
    private void validateSecurity(ItemStainDefectDTO data, List<String> errors) {
        // Перевіряємо опис власної плями
        if (StringUtils.hasText(data.getCustomStainDescription())) {
            if (containsDangerousContent(data.getCustomStainDescription())) {
                errors.add("Опис власної плями містить недозволений вміст");
            }
        }

        // Перевіряємо примітки щодо дефектів
        if (StringUtils.hasText(data.getDefectNotes())) {
            if (containsDangerousContent(data.getDefectNotes())) {
                errors.add("Примітки щодо дефектів містять недозволений вміст");
            }
        }

        // Перевіряємо причину для "Без гарантій"
        if (StringUtils.hasText(data.getNoGuaranteeReason())) {
            if (containsDangerousContent(data.getNoGuaranteeReason())) {
                errors.add("Причина відсутності гарантій містить недозволений вміст");
            }
        }
    }

    /**
     * Перевіряє, чи є код плями валідним відносно доступних типів з БД.
     */
    private boolean isValidStainCode(String code, List<StainTypeDTO> availableStains) {
        if (!StringUtils.hasText(code)) {
            return false;
        }

        return availableStains.stream()
                .anyMatch(stain -> code.equals(stain.getCode()) && stain.isActive());
    }

    /**
     * Перевіряє, чи є код дефекту валідним відносно доступних типів з БД.
     */
    private boolean isValidDefectCode(String code, List<DefectTypeDTO> availableDefects) {
        if (!StringUtils.hasText(code)) {
            return false;
        }

        return availableDefects.stream()
                .anyMatch(defect -> code.equals(defect.getCode()) && defect.isActive());
    }

    /**
     * Перевіряє, чи містить рядок небезпечний вміст.
     */
    private boolean containsDangerousContent(String input) {
        if (!StringUtils.hasText(input)) {
            return false;
        }

        String lowerInput = input.toLowerCase();
        for (String pattern : DANGEROUS_PATTERNS) {
            if (lowerInput.contains(pattern.toLowerCase())) {
                return true;
            }
        }

        return false;
    }

    /**
     * Перевіряє, чи є критичні ризики у вибраних дефектах.
     * Використовує riskLevel з Entity для більш точного визначення.
     *
     * @param data дані для перевірки
     * @return true, якщо є критичні ризики
     */
    public boolean hasCriticalRisks(ItemStainDefectDTO data) {
        if (data == null || data.getSelectedDefectsAndRisks() == null ||
            data.getAvailableDefectsAndRisks() == null) {
            return false;
        }

        // Перевіряємо кожен вибраний дефект на критичний рівень ризику
        for (String defectCode : data.getSelectedDefectsAndRisks()) {
            DefectTypeDTO defect = data.findDefectByCode(defectCode);
            if (defect != null && isHighRisk(defect)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Визначає, чи має дефект високий рівень ризику.
     */
    private boolean isHighRisk(DefectTypeDTO defect) {
        // Перевіряємо riskLevel з Entity
        if (defect.getRiskLevel() != null) {
            return "HIGH".equals(defect.getRiskLevel().toString());
        }

        // Fallback на основі коду для відомих критичних ризиків
        String code = defect.getCode();
        return "COLOR_CHANGE_RISK".equals(code) ||
               "DEFORMATION_RISK".equals(code) ||
               "NO_GUARANTEE".equals(code);
    }

    /**
     * Отримує список критичних ризиків з вибраних дефектів.
     *
     * @param data дані для аналізу
     * @return список назв критичних ризиків
     */
    public List<String> getCriticalRiskNames(ItemStainDefectDTO data) {
        List<String> criticalRisks = new ArrayList<>();

        if (data == null || data.getSelectedDefectsAndRisks() == null ||
            data.getAvailableDefectsAndRisks() == null) {
            return criticalRisks;
        }

        for (String defectCode : data.getSelectedDefectsAndRisks()) {
            DefectTypeDTO defect = data.findDefectByCode(defectCode);
            if (defect != null && isHighRisk(defect)) {
                criticalRisks.add(defect.getName());
            }
        }

        return criticalRisks;
    }
}
