package com.aksi.domain.order.statemachine.stage3.validator;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage3.dto.OrderAdditionalInfoDTO;

import lombok.extern.slf4j.Slf4j;

/**
 * Валідатор для підетапу 3.4 "Додаткова інформація".
 *
 * Перевіряє правильність заповнення примітки та додаткових вимог клієнта.
 * Для цього підетапу валідація досить проста, оскільки всі поля є необов'язковими.
 */
@Component
@Slf4j
public class OrderAdditionalInfoValidator {

    // Константи для обмежень
    private static final int MAX_NOTES_LENGTH = 2000;
    private static final int MAX_REQUIREMENTS_LENGTH = 1000;
    private static final int MAX_CRITICAL_INFO_LENGTH = 500;
    private static final int MAX_CONFIRMATION_REASON_LENGTH = 300;
    private static final int MAX_TOTAL_CHARACTER_COUNT = 3000;

    /**
     * Валідує дані додаткової інформації.
     */
    public List<String> validate(OrderAdditionalInfoDTO dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("Дані додаткової інформації не можуть бути порожніми");
            return errors;
        }

        log.debug("Валідація додаткової інформації для замовлення: {}", dto.getOrderId());

        // Валідуємо orderId
        validateOrderId(dto, errors);

        // Валідуємо примітки до замовлення
        validateOrderNotes(dto, errors);

        // Валідуємо вимоги клієнта
        validateCustomerRequirements(dto, errors);

        // Валідуємо критичну інформацію
        validateCriticalInfo(dto, errors);

        // Валідуємо підтвердження
        validateAdditionalConfirmation(dto, errors);

        // Валідуємо загальну довжину
        validateTotalLength(dto, errors);

        if (errors.isEmpty()) {
            log.debug("Валідація додаткової інформації пройшла успішно");
        } else {
            log.warn("Валідація додаткової інформації не пройдена: {}", errors);
        }

        return errors;
    }

    /**
     * Перевіряє чи можна перейти до наступного кроку.
     */
    public boolean canProceedToNext(OrderAdditionalInfoDTO dto) {
        if (dto == null) {
            return false;
        }

        List<String> errors = validate(dto);
        return errors.isEmpty();
    }

    /**
     * Перевіряє чи є критичні помилки що блокують збереження.
     */
    public boolean hasCriticalErrors(OrderAdditionalInfoDTO dto) {
        if (dto == null) {
            return true;
        }

        // Для цього підетапу критичних помилок немає, оскільки всі поля необов'язкові
        // Перевіряємо тільки базові обмеження
        return dto.getOrderId() == null ||
               exceedsMaxLength(dto.getOrderNotes(), MAX_NOTES_LENGTH) ||
               exceedsMaxLength(dto.getCustomerRequirements(), MAX_REQUIREMENTS_LENGTH);
    }

    // Приватні методи валідації

    private void validateOrderId(OrderAdditionalInfoDTO dto, List<String> errors) {
        if (dto.getOrderId() == null) {
            errors.add("ID замовлення обов'язковий");
        }
    }

    private void validateOrderNotes(OrderAdditionalInfoDTO dto, List<String> errors) {
        String notes = dto.getOrderNotes();

        if (notes != null) {
            // Перевіряємо довжину
            if (notes.length() > MAX_NOTES_LENGTH) {
                errors.add(String.format("Примітки до замовлення не можуть перевищувати %d символів (поточна довжина: %d)",
                                        MAX_NOTES_LENGTH, notes.length()));
            }

            // Перевіряємо чи не складається тільки з пробілів
            if (notes.trim().isEmpty() && notes.length() > 0) {
                errors.add("Примітки до замовлення не можуть складатися тільки з пробілів");
            }

            // Перевіряємо на недопустимі символи (основні контрольні символи)
            if (containsControlCharacters(notes)) {
                errors.add("Примітки до замовлення містять недопустимі символи");
            }
        }
    }

    private void validateCustomerRequirements(OrderAdditionalInfoDTO dto, List<String> errors) {
        String requirements = dto.getCustomerRequirements();

        if (requirements != null) {
            // Перевіряємо довжину
            if (requirements.length() > MAX_REQUIREMENTS_LENGTH) {
                errors.add(String.format("Вимоги клієнта не можуть перевищувати %d символів (поточна довжина: %d)",
                                        MAX_REQUIREMENTS_LENGTH, requirements.length()));
            }

            // Перевіряємо чи не складається тільки з пробілів
            if (requirements.trim().isEmpty() && requirements.length() > 0) {
                errors.add("Вимоги клієнта не можуть складатися тільки з пробілів");
            }

            // Перевіряємо на недопустимі символи
            if (containsControlCharacters(requirements)) {
                errors.add("Вимоги клієнта містять недопустимі символи");
            }
        }
    }

    private void validateCriticalInfo(OrderAdditionalInfoDTO dto, List<String> errors) {
        if (Boolean.TRUE.equals(dto.getHasCriticalInfo())) {
            String criticalInfo = dto.getCriticalInfoText();

            if (criticalInfo == null || criticalInfo.trim().isEmpty()) {
                errors.add("При позначенні критичної інформації необхідно вказати її текст");
            } else {
                if (criticalInfo.length() > MAX_CRITICAL_INFO_LENGTH) {
                    errors.add(String.format("Критична інформація не може перевищувати %d символів (поточна довжина: %d)",
                                            MAX_CRITICAL_INFO_LENGTH, criticalInfo.length()));
                }

                if (containsControlCharacters(criticalInfo)) {
                    errors.add("Критична інформація містить недопустимі символи");
                }
            }
        }
    }

    private void validateAdditionalConfirmation(OrderAdditionalInfoDTO dto, List<String> errors) {
        if (Boolean.TRUE.equals(dto.getRequiresAdditionalConfirmation())) {
            String reason = dto.getConfirmationReason();

            if (reason == null || reason.trim().isEmpty()) {
                errors.add("При позначенні необхідності додаткового підтвердження необхідно вказати причину");
            } else {
                if (reason.length() > MAX_CONFIRMATION_REASON_LENGTH) {
                    errors.add(String.format("Причина додаткового підтвердження не може перевищувати %d символів (поточна довжина: %d)",
                                            MAX_CONFIRMATION_REASON_LENGTH, reason.length()));
                }

                if (containsControlCharacters(reason)) {
                    errors.add("Причина додаткового підтвердження містить недопустимі символи");
                }
            }
        }
    }

    private void validateTotalLength(OrderAdditionalInfoDTO dto, List<String> errors) {
        Integer totalCount = dto.getTotalCharacterCount();

        if (totalCount > MAX_TOTAL_CHARACTER_COUNT) {
            errors.add(String.format("Загальна кількість символів у всіх полях не може перевищувати %d (поточна: %d)",
                                    MAX_TOTAL_CHARACTER_COUNT, totalCount));
        }
    }

    // Допоміжні методи

    private boolean exceedsMaxLength(String text, int maxLength) {
        return text != null && text.length() > maxLength;
    }

    private boolean containsControlCharacters(String text) {
        if (text == null) {
            return false;
        }

        for (char c : text.toCharArray()) {
            // Дозволяємо тільки звичайні символи, пробіли, переводи рядків та табуляції
            if (Character.isISOControl(c) && c != '\n' && c != '\r' && c != '\t') {
                return true;
            }
        }

        return false;
    }

    // Геттери для констант (для використання в UI)

    public static int getMaxNotesLength() {
        return MAX_NOTES_LENGTH;
    }

    public static int getMaxRequirementsLength() {
        return MAX_REQUIREMENTS_LENGTH;
    }

    public static int getMaxCriticalInfoLength() {
        return MAX_CRITICAL_INFO_LENGTH;
    }

    public static int getMaxConfirmationReasonLength() {
        return MAX_CONFIRMATION_REASON_LENGTH;
    }

    public static int getMaxTotalCharacterCount() {
        return MAX_TOTAL_CHARACTER_COUNT;
    }
}
