package com.aksi.domain.order.statemachine.stage4.validator;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage4.dto.LegalAspectsDTO;

/**
 * Валідатор для підетапу 4.2 "Юридічні аспекти".
 *
 * Перевіряє коректність прийняття умов послуг та цифрового підпису.
 */
@Component
public class LegalAspectsValidator {

    /**
     * Валідує LegalAspectsDTO для збереження.
     */
    public List<String> validate(LegalAspectsDTO legalAspects) {
        List<String> errors = new ArrayList<>();

        if (legalAspects == null) {
            errors.add("Дані юридичних аспектів не можуть бути null");
            return errors;
        }

        // Перевіряємо базову інформацію
        validateBasicInfo(legalAspects, errors);

        // Перевіряємо прийняття умов
        validateTermsAcceptance(legalAspects, errors);

        // Перевіряємо підпис якщо він є
        validateSignature(legalAspects, errors);

        return errors;
    }

    /**
     * Перевіряє чи можна перейти до наступного кроку.
     */
    public boolean canProceedToNext(LegalAspectsDTO legalAspects) {
        if (legalAspects == null) {
            return false;
        }

        // Має бути готовим для завершення
        if (!legalAspects.isReadyForCompletion()) {
            return false;
        }

        // Не має бути помилок
        if (Boolean.TRUE.equals(legalAspects.getHasErrors())) {
            return false;
        }

        // Основна валідація має пройти без помилок
        List<String> validationErrors = validate(legalAspects);
        return validationErrors.isEmpty();
    }

    private void validateBasicInfo(LegalAspectsDTO legalAspects, List<String> errors) {
        if (legalAspects.getOrderId() == null) {
            errors.add("ID замовлення є обов'язковим");
        }

        // TODO: Додати валідацію формату ID замовлення
        // TODO: Перевірити чи існує замовлення в базі даних
    }

    private void validateTermsAcceptance(LegalAspectsDTO legalAspects, List<String> errors) {
        if (!Boolean.TRUE.equals(legalAspects.getTermsAccepted())) {
            errors.add("Прийняття умов надання послуг є обов'язковим");
        }

        // TODO: Додати валідацію часу прийняття умов
        // TODO: Перевірити актуальність версії умов послуг
    }

    private void validateSignature(LegalAspectsDTO legalAspects, List<String> errors) {
        if (legalAspects.getSignatureData() != null) {
            // Перевіряємо формат підпису
            if (legalAspects.getSignatureData().trim().isEmpty()) {
                errors.add("Дані підпису не можуть бути порожніми");
            }

            // TODO: Додати валідацію формату base64
            // TODO: Перевірити розмір підпису (мін/макс)
            // TODO: Валідувати структуру підпису SVG/Canvas data
            if (!isValidBase64Format(legalAspects.getSignatureData())) {
                errors.add("Неправильний формат даних підпису");
            }
        }

        // Якщо підпис завершений, має бути і дані підпису
        if (Boolean.TRUE.equals(legalAspects.getSignatureCompleted())) {
            if (legalAspects.getSignatureData() == null ||
                legalAspects.getSignatureData().trim().isEmpty()) {
                errors.add("Дані підпису відсутні при завершеному підписанні");
            }
        }
    }

    private boolean isValidBase64Format(String data) {
        if (data == null || data.trim().isEmpty()) {
            return false;
        }

        try {
            // TODO: Реалізувати детальну валідацію base64 формату
            // Базова перевірка довжини та символів
            String cleaned = data.trim();

            // Перевіряємо чи містить тільки допустимі символи base64
            return cleaned.matches("^[A-Za-z0-9+/]*={0,2}$") && cleaned.length() > 10;

        } catch (Exception e) {
            return false;
        }
    }
}

// TODO: Додати валідацію версії умов послуг
// TODO: Інтегрувати з сервісом перевірки актуальності правових документів
// TODO: Додати перевірку цілісності підпису
// TODO: Розглянути додавання валідації метаданих підпису
