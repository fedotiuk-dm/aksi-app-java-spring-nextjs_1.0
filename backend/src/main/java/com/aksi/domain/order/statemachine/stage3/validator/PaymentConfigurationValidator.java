package com.aksi.domain.order.statemachine.stage3.validator;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.model.PaymentMethod;
import com.aksi.domain.order.statemachine.stage3.dto.PaymentConfigurationDTO;

/**
 * Validator для конфігурації оплати Stage3 (підетап 3.3)
 * ЕТАП 2.2: Залежать тільки від DTO + ValidationResult
 */
@Component
public class PaymentConfigurationValidator {

    /**
     * Валідує базові параметри оплати
     */
    public ValidationResult validateBasicParams(PaymentConfigurationDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO конфігурації оплати не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        // Валідація sessionId
        if (dto.getSessionId() == null) {
            result.addError("Session ID обов'язковий");
        }

        // Валідація orderId
        if (dto.getOrderId() == null) {
            result.addError("Order ID обов'язковий для конфігурації оплати");
        }

        return result;
    }

    /**
     * Валідує спосіб оплати
     */
    public ValidationResult validatePaymentMethod(PaymentConfigurationDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO конфігурації оплати не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        PaymentMethod paymentMethod = dto.getPaymentMethod();
        if (paymentMethod == null) {
            result.addError("Спосіб оплати обов'язковий");
        }

        return result;
    }

    /**
     * Валідує суми оплати
     */
    public ValidationResult validatePaymentAmounts(PaymentConfigurationDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO конфігурації оплати не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        BigDecimal totalAmount = dto.getTotalAmount();
        BigDecimal paidAmount = dto.getPaidAmount();
        BigDecimal remainingAmount = dto.getRemainingAmount();

        // Валідація загальної суми
        if (totalAmount != null) {
            if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
                result.addError("Загальна сума не може бути від'ємною");
            } else if (totalAmount.compareTo(BigDecimal.ZERO) == 0) {
                result.addWarning("Загальна сума дорівнює нулю");
            }
        } else {
            result.addError("Загальна сума обов'язкова");
        }

        // Валідація сплаченої суми
        if (paidAmount != null) {
            if (paidAmount.compareTo(BigDecimal.ZERO) < 0) {
                result.addError("Сплачена сума не може бути від'ємною");
            }

            if (totalAmount != null && paidAmount.compareTo(totalAmount) > 0) {
                result.addError("Сплачена сума не може перевищувати загальну суму");
            }
        }

        // Валідація залишку
        if (remainingAmount != null) {
            if (remainingAmount.compareTo(BigDecimal.ZERO) < 0) {
                result.addError("Залишок до сплати не може бути від'ємним");
            }

            // Перевірка математичної коректності
            if (totalAmount != null && paidAmount != null) {
                BigDecimal calculatedRemaining = totalAmount.subtract(paidAmount);
                if (remainingAmount.compareTo(calculatedRemaining) != 0) {
                    result.addError("Залишок не відповідає розрахунку (загальна сума - сплачено)");
                }
            }
        }

        return result;
    }

    /**
     * Валідує передоплату
     */
    public ValidationResult validatePrepayment(PaymentConfigurationDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO конфігурації оплати не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        BigDecimal prepaymentAmount = dto.getPrepaymentAmount();
        BigDecimal totalAmount = dto.getTotalAmount();

        if (prepaymentAmount != null) {
            if (prepaymentAmount.compareTo(BigDecimal.ZERO) < 0) {
                result.addError("Сума передоплати не може бути від'ємною");
            }

            if (totalAmount != null) {
                if (prepaymentAmount.compareTo(totalAmount) > 0) {
                    result.addError("Передоплата не може перевищувати загальну суму");
                } else if (prepaymentAmount.equals(totalAmount)) {
                    result.addWarning("Замовлення буде повністю сплачене авансом");
                } else if (prepaymentAmount.compareTo(BigDecimal.ZERO) == 0) {
                    result.addWarning("Передоплата не вказана");
                }

                // Перевірка відсотка передоплати
                BigDecimal percentage = prepaymentAmount.multiply(BigDecimal.valueOf(100))
                                                      .divide(totalAmount, 2, RoundingMode.HALF_UP);
                if (percentage.compareTo(BigDecimal.valueOf(10)) < 0 && prepaymentAmount.compareTo(BigDecimal.ZERO) > 0) {
                    result.addWarning("Передоплата менше 10% від загальної суми");
                }
            }
        }

        return result;
    }

    /**
     * Валідує готовність до завершення
     */
    public ValidationResult validateReadinessForCompletion(PaymentConfigurationDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO конфігурації оплати не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        // Перевіряємо всі аспекти
        result.merge(validateBasicParams(dto));
        result.merge(validatePaymentMethod(dto));
        result.merge(validatePaymentAmounts(dto));
        result.merge(validatePrepayment(dto));

        // Додаткові перевірки готовності
        if (result.isValid()) {
            if (!dto.hasRequiredParameters()) {
                result.addError("Не всі обов'язкові параметри встановлені");
            }

            // Перевірка що розрахунок оплати виконаний
            if (dto.getPaymentResponse() == null) {
                result.addWarning("Оплата не була розрахована доменним сервісом");
            }
        }

        return result;
    }

    /**
     * Валідує цілісність даних
     */
    public ValidationResult validateDataIntegrity(PaymentConfigurationDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO конфігурації оплати не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        // Перевірка узгодженості між запитом та відповіддю
        if (dto.getPaymentRequest() != null && dto.getPaymentResponse() != null) {
            if (!dto.getPaymentRequest().getOrderId().equals(dto.getOrderId())) {
                result.addError("Order ID в запиті не відповідає Order ID в DTO");
            }

            if (dto.getPaymentRequest().getPaymentMethod() != dto.getPaymentMethod()) {
                result.addError("Спосіб оплати в запиті не відповідає способу в DTO");
            }
        }

        // Перевірка логічності стану
        if (Boolean.TRUE.equals(dto.isPaymentConfigComplete()) && !dto.isReadyForCompletion()) {
            result.addError("Конфігурація помічена як завершена, але не готова до завершення");
        }

        // Перевірка узгодженості сплаченої суми та передоплати
        BigDecimal paidAmount = dto.getPaidAmount();
        BigDecimal prepaymentAmount = dto.getPrepaymentAmount();

        if (paidAmount != null && prepaymentAmount != null && !paidAmount.equals(prepaymentAmount)) {
            result.addWarning("Сплачена сума не відповідає передоплаті - можливо була доплата");
        }

        return result;
    }

    /**
     * Комплексна валідація всіх аспектів
     */
    public ValidationResult validateAll(PaymentConfigurationDTO dto) {
        ValidationResult result = ValidationResult.success();

        // Базова валідація
        result.merge(validateBasicParams(dto));

        // Якщо базова валідація провалилася, не продовжуємо
        if (!result.isValid()) {
            return result;
        }

        // Валідація окремих аспектів
        result.merge(validatePaymentMethod(dto));
        result.merge(validatePaymentAmounts(dto));
        result.merge(validatePrepayment(dto));
        result.merge(validateDataIntegrity(dto));

        // Фінальна перевірка готовності
        if (result.isValid()) {
            ValidationResult readinessValidation = validateReadinessForCompletion(dto);
            result.merge(readinessValidation);
        }

        return result;
    }

    /**
     * Швидка валідація для мінімальних вимог
     */
    public ValidationResult validateMinimal(PaymentConfigurationDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO конфігурації оплати не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        if (dto.getSessionId() == null) {
            result.addError("Session ID обов'язковий");
        }

        if (dto.getOrderId() == null) {
            result.addError("Order ID обов'язковий");
        }

        if (dto.getPaymentMethod() == null) {
            result.addError("Спосіб оплати обов'язковий");
        }

        return result;
    }

    /**
     * Валідація для конкретного стану
     */
    public ValidationResult validateForState(PaymentConfigurationDTO dto, String stateName) {
        if (dto == null) {
            return ValidationResult.failure("DTO конфігурації оплати не може бути null");
        }

        ValidationResult result = switch (stateName) {
            case "PAYMENT_INITIALIZED" -> validateBasicParams(dto);
            case "PAYMENT_METHOD_SELECTED" -> validateMinimal(dto);
            case "AMOUNTS_CALCULATED" -> validateAll(dto);
            default -> {
                ValidationResult defaultResult = validateAll(dto);
                defaultResult.addWarning("Невідомий стан: " + stateName + ", виконана повна валідація");
                yield defaultResult;
            }
        };

        return result;
    }

    /**
     * Спеціальна валідація для повної оплати
     */
    public ValidationResult validateFullPayment(PaymentConfigurationDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO конфігурації оплати не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        if (!dto.isFullyPaid()) {
            result.addError("Цей метод валідації призначений тільки для повністю сплачених замовлень");
            return result;
        }

        BigDecimal totalAmount = dto.getTotalAmount();
        BigDecimal paidAmount = dto.getPaidAmount();
        BigDecimal remainingAmount = dto.getRemainingAmount();

        if (totalAmount != null && paidAmount != null) {
            if (!totalAmount.equals(paidAmount)) {
                result.addError("При повній оплаті сплачена сума повинна дорівнювати загальній сумі");
            }
        }

        if (remainingAmount != null && remainingAmount.compareTo(BigDecimal.ZERO) != 0) {
            result.addError("При повній оплаті залишок повинен дорівнювати нулю");
        }

        return result;
    }

    /**
     * Спеціальна валідація для часткової оплати
     */
    public ValidationResult validatePartialPayment(PaymentConfigurationDTO dto) {
        if (dto == null) {
            return ValidationResult.failure("DTO конфігурації оплати не може бути null");
        }

        ValidationResult result = ValidationResult.success();

        BigDecimal totalAmount = dto.getTotalAmount();
        BigDecimal paidAmount = dto.getPaidAmount();
        BigDecimal remainingAmount = dto.getRemainingAmount();

        if (totalAmount != null && paidAmount != null) {
            if (paidAmount.compareTo(BigDecimal.ZERO) == 0) {
                result.addWarning("Сума сплачена не вказана - замовлення без передоплати");
            } else if (paidAmount.equals(totalAmount)) {
                result.addWarning("Замовлення сплачене повністю - використайте validateFullPayment");
            } else if (paidAmount.compareTo(totalAmount) > 0) {
                result.addError("Сплачена сума перевищує загальну суму");
            }
        }

        if (remainingAmount != null && remainingAmount.compareTo(BigDecimal.ZERO) <= 0) {
            result.addWarning("Залишок до сплати менше або дорівнює нулю");
        }

        return result;
    }
}
