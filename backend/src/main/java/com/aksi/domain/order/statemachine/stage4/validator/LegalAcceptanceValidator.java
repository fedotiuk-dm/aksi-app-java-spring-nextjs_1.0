package com.aksi.domain.order.statemachine.stage4.validator;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage4.dto.LegalAcceptanceDTO;

/**
 * Валідатор для юридичного прийняття Stage4.
 * Перевіряє прийняття умов та валідність цифрового підпису.
 */
@Component
public class LegalAcceptanceValidator {

    /**
     * Валідує дані юридичного прийняття.
     *
     * @param legalDTO DTO юридичного прийняття
     * @return результат валідації
     */
    public ValidationResult validate(LegalAcceptanceDTO legalDTO) {
        if (legalDTO == null) {
            return ValidationResult.withError("Дані юридичного прийняття відсутні");
        }

        ValidationResult result = new ValidationResult();

        // Перевірка базових полів
        validateBasicFields(legalDTO, result);

        // Перевірка запиту на підпис
        validateSignatureRequest(legalDTO, result);

        // Перевірка процесу прийняття умов
        validateAcceptanceProcess(legalDTO, result);

        return result;
    }

    /**
     * Валідує базові поля DTO.
     *
     * @param legalDTO DTO юридичного прийняття
     * @param result результат валідації
     */
    private void validateBasicFields(LegalAcceptanceDTO legalDTO, ValidationResult result) {
        if (legalDTO.getSessionId() == null) {
            result.addError("ID сесії обов'язковий");
        }

        if (legalDTO.getCurrentState() == null) {
            result.addError("Поточний стан обов'язковий");
        }
    }

    /**
     * Валідує запит на підпис клієнта.
     *
     * @param legalDTO DTO юридичного прийняття
     * @param result результат валідації
     */
    private void validateSignatureRequest(LegalAcceptanceDTO legalDTO, ValidationResult result) {
        if (legalDTO.getSignatureRequest() == null) {
            result.addError("Запит на підпис відсутній");
            return;
        }

        var signatureRequest = legalDTO.getSignatureRequest();

        if (signatureRequest.getOrderId() == null) {
            result.addError("ID замовлення в запиті на підпис відсутній");
        }

        if (signatureRequest.getSignatureType() == null || signatureRequest.getSignatureType().trim().isEmpty()) {
            result.addError("Тип підпису не вказаний");
        }

        // Перевірка підпису якщо він має бути присутній
        if (legalDTO.getSignatureCaptured()) {
            if (signatureRequest.getSignatureData() == null || signatureRequest.getSignatureData().trim().isEmpty()) {
                result.addError("Дані підпису відсутні, хоча підпис позначений як збережений");
            } else {
                validateSignatureData(signatureRequest.getSignatureData(), result);
            }

            if (!signatureRequest.getTermsAccepted()) {
                result.addError("Умови не прийняті, хоча підпис збережений");
            }
        }
    }

    /**
     * Валідує процес прийняття умов.
     *
     * @param legalDTO DTO юридичного прийняття
     * @param result результат валідації
     */
    private void validateAcceptanceProcess(LegalAcceptanceDTO legalDTO, ValidationResult result) {
        if (legalDTO.getLegalConfirmed()) {
            if (!legalDTO.getTermsRead()) {
                result.addError("Юридичне оформлення підтверджено, але умови не прочитані");
            }

            if (!legalDTO.getSignatureCaptured()) {
                result.addError("Юридичне оформлення підтверджено, але підпис не збережений");
            }

            if (legalDTO.getAcceptanceTimestamp() == null) {
                result.addWarning("Час прийняття умов не зафіксований");
            }
        }

        if (legalDTO.getHasValidationErrors()) {
            result.addError("Є невирішені помилки валідації: " +
                legalDTO.getValidationMessage());
        }
    }

    /**
     * Валідує дані підпису.
     *
     * @param signatureData дані підпису в base64
     * @param result результат валідації
     */
    private void validateSignatureData(String signatureData, ValidationResult result) {
        if (signatureData.length() < 100) {
            result.addWarning("Дані підпису здаються занадто короткими");
        }

        // Базова перевірка формату base64
        if (!signatureData.matches("^[A-Za-z0-9+/]*={0,2}$")) {
            result.addError("Дані підпису не відповідають формату base64");
        }
    }
}
