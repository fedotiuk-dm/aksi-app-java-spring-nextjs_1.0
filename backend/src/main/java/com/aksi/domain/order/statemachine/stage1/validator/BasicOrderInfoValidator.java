package com.aksi.domain.order.statemachine.stage1.validator;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.dto.BasicOrderInfoDTO;

/**
 * Валідатор для BasicOrderInfoDTO в етапі 1.3.
 * Перевіряє всі поля базової інформації замовлення.
 */
@Component
public class BasicOrderInfoValidator {

    // Регулярні вирази для валідації
    private static final Pattern RECEIPT_NUMBER_PATTERN = Pattern.compile("^AKSI-[A-Z0-9]{1,10}-\\d{8}-\\d{6}-\\d{3}$");
    private static final Pattern UNIQUE_TAG_PATTERN = Pattern.compile("^[A-Za-z0-9-_]{3,20}$");

    // Константи для валідації
    private static final int MIN_TAG_LENGTH = 3;
    private static final int MAX_TAG_LENGTH = 20;

    /**
     * Комплексна валідація BasicOrderInfoDTO.
     */
    public BasicOrderInfoValidationResult validate(BasicOrderInfoDTO dto) {
        if (dto == null) {
            return BasicOrderInfoValidationResult.failure("BasicOrderInfoDTO не може бути null");
        }

        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        // Валідація номера квитанції
        BasicOrderInfoValidationResult receiptResult = validateReceiptNumber(dto.getReceiptNumber());
        errors.addAll(receiptResult.getErrors());
        warnings.addAll(receiptResult.getWarnings());

        // Валідація унікальної мітки
        BasicOrderInfoValidationResult tagResult = validateUniqueTag(dto.getUniqueTag());
        errors.addAll(tagResult.getErrors());
        warnings.addAll(tagResult.getWarnings());

        // Валідація вибраної філії
        BasicOrderInfoValidationResult branchResult = validateSelectedBranch(dto);
        errors.addAll(branchResult.getErrors());
        warnings.addAll(branchResult.getWarnings());

        // Валідація дати створення
        BasicOrderInfoValidationResult dateResult = validateCreationDate(dto.getCreationDate());
        errors.addAll(dateResult.getErrors());
        warnings.addAll(dateResult.getWarnings());

        // Валідація стану завершення
        BasicOrderInfoValidationResult completionResult = validateCompletionFlags(dto);
        errors.addAll(completionResult.getErrors());
        warnings.addAll(completionResult.getWarnings());

        // Формування результату
        if (errors.isEmpty()) {
            return warnings.isEmpty()
                ? BasicOrderInfoValidationResult.success()
                : BasicOrderInfoValidationResult.successWithWarnings(warnings);
        } else {
            return BasicOrderInfoValidationResult.failure(errors, warnings);
        }
    }

    /**
     * Валідація номера квитанції.
     */
    public BasicOrderInfoValidationResult validateReceiptNumber(String receiptNumber) {
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        if (receiptNumber == null || receiptNumber.trim().isEmpty()) {
            errors.add("Номер квитанції є обов'язковим");
            return BasicOrderInfoValidationResult.failure(errors);
        }

        String trimmedNumber = receiptNumber.trim();

        // Перевірка формату AKSI-[BRANCH_CODE]-YYYYMMDD-HHMMSS-ХХХ
        if (!RECEIPT_NUMBER_PATTERN.matcher(trimmedNumber).matches()) {
            errors.add("Номер квитанції повинен мати формат AKSI-[BRANCH_CODE]-YYYYMMDD-HHMMSS-ХХХ");
        }

        // Перевірка на дублювання спеціальних символів
        if (trimmedNumber.chars().filter(ch -> ch == '-').count() > 1) {
            errors.add("Номер квитанції містить занадто багато тире");
        }

        return errors.isEmpty()
            ? BasicOrderInfoValidationResult.success()
            : BasicOrderInfoValidationResult.failure(errors, warnings);
    }

    /**
     * Валідація унікальної мітки.
     */
    public BasicOrderInfoValidationResult validateUniqueTag(String uniqueTag) {
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        if (uniqueTag == null || uniqueTag.trim().isEmpty()) {
            errors.add("Унікальна мітка є обов'язковою");
            return BasicOrderInfoValidationResult.failure(errors);
        }

        String trimmedTag = uniqueTag.trim();

        // Перевірка довжини
        if (trimmedTag.length() < MIN_TAG_LENGTH) {
            errors.add("Унікальна мітка повинна містити мінімум " + MIN_TAG_LENGTH + " символи");
        }

        if (trimmedTag.length() > MAX_TAG_LENGTH) {
            errors.add("Унікальна мітка повинна містити максимум " + MAX_TAG_LENGTH + " символів");
        }

        // Перевірка формату
        if (!UNIQUE_TAG_PATTERN.matcher(trimmedTag).matches()) {
            errors.add("Унікальна мітка може містити тільки латинські літери, цифри, тире та підкреслення");
        }

        // Попередження для коротких міток
        if (trimmedTag.length() <= 5) {
            warnings.add("Рекомендується використовувати мітку довжиною більше 5 символів для кращої унікальності");
        }

        // Попередження для міток з тільки цифрами
        if (trimmedTag.matches("^\\d+$")) {
            warnings.add("Рекомендується додати літери до мітки для кращого розпізнавання");
        }

        return errors.isEmpty()
            ? (warnings.isEmpty() ? BasicOrderInfoValidationResult.success()
                                  : BasicOrderInfoValidationResult.successWithWarnings(warnings))
            : BasicOrderInfoValidationResult.failure(errors, warnings);
    }

    /**
     * Валідація вибраної філії.
     */
    public BasicOrderInfoValidationResult validateSelectedBranch(BasicOrderInfoDTO dto) {
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        if (dto.getSelectedBranchId() == null) {
            errors.add("Необхідно вибрати філію");
        }

        if (dto.getSelectedBranch() == null) {
            warnings.add("Відсутні деталі вибраної філії");
        } else {
            // Перевірка узгодженості ID філії
            if (dto.getSelectedBranchId() != null &&
                !dto.getSelectedBranchId().equals(dto.getSelectedBranch().getId())) {
                errors.add("ID вибраної філії не співпадає з даними філії");
            }

            // Перевірка обов'язкових полів філії
            if (dto.getSelectedBranch().getName() == null ||
                dto.getSelectedBranch().getName().trim().isEmpty()) {
                warnings.add("Відсутня назва філії");
            }

            if (dto.getSelectedBranch().getAddress() == null ||
                dto.getSelectedBranch().getAddress().trim().isEmpty()) {
                warnings.add("Відсутня адреса філії");
            }
        }

        return errors.isEmpty()
            ? (warnings.isEmpty() ? BasicOrderInfoValidationResult.success()
                                  : BasicOrderInfoValidationResult.successWithWarnings(warnings))
            : BasicOrderInfoValidationResult.failure(errors, warnings);
    }

    /**
     * Валідація дати створення.
     */
    public BasicOrderInfoValidationResult validateCreationDate(LocalDateTime creationDate) {
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        if (creationDate == null) {
            errors.add("Дата створення замовлення є обов'язковою");
            return BasicOrderInfoValidationResult.failure(errors);
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDate today = LocalDate.now();

        // Перевірка на майбутню дату
        if (creationDate.isAfter(now)) {
            errors.add("Дата створення не може бути у майбутньому");
        }

        // Перевірка на занадто стару дату
        if (creationDate.isBefore(now.minusDays(1))) {
            warnings.add("Дата створення старша за 1 день - перевірте правильність");
        }

        // Перевірка на інший день
        if (!creationDate.toLocalDate().equals(today)) {
            warnings.add("Дата створення не збігається з поточним днем");
        }

        return errors.isEmpty()
            ? (warnings.isEmpty() ? BasicOrderInfoValidationResult.success()
                                  : BasicOrderInfoValidationResult.successWithWarnings(warnings))
            : BasicOrderInfoValidationResult.failure(errors, warnings);
    }

    /**
     * Валідація прапорців завершення.
     */
    public BasicOrderInfoValidationResult validateCompletionFlags(BasicOrderInfoDTO dto) {
        List<String> warnings = new ArrayList<>();

        // Логічна перевірка узгодженості прапорців
        boolean allStepsCompleted = dto.isReceiptNumberGenerated() &&
                                   dto.isUniqueTagEntered() &&
                                   dto.isBranchSelected() &&
                                   dto.isCreationDateSet();

        if (!allStepsCompleted) {
            List<String> missingSteps = new ArrayList<>();
            if (!dto.isReceiptNumberGenerated()) missingSteps.add("генерація номера квитанції");
            if (!dto.isUniqueTagEntered()) missingSteps.add("введення унікальної мітки");
            if (!dto.isBranchSelected()) missingSteps.add("вибір філії");
            if (!dto.isCreationDateSet()) missingSteps.add("встановлення дати створення");

            warnings.add("Не завершені етапи: " + String.join(", ", missingSteps));
        }

        return warnings.isEmpty()
            ? BasicOrderInfoValidationResult.success()
            : BasicOrderInfoValidationResult.successWithWarnings(warnings);
    }

    /**
     * Швидка перевірка чи об'єкт готовий для завершення етапу.
     */
    public boolean isReadyForCompletion(BasicOrderInfoDTO dto) {
        if (dto == null) return false;

        BasicOrderInfoValidationResult result = validate(dto);
        return result.isValid() &&
               dto.isReceiptNumberGenerated() &&
               dto.isUniqueTagEntered() &&
               dto.isBranchSelected() &&
               dto.isCreationDateSet();
    }

    /**
     * Перевірка критичних полів для продовження роботи.
     */
    public boolean hasCriticalErrors(BasicOrderInfoDTO dto) {
        if (dto == null) return true;

        return dto.getReceiptNumber() == null || dto.getReceiptNumber().trim().isEmpty() ||
               dto.getUniqueTag() == null || dto.getUniqueTag().trim().isEmpty() ||
               dto.getSelectedBranchId() == null ||
               dto.getCreationDate() == null;
    }
}
