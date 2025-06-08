package com.aksi.domain.order.statemachine.stage3.validator;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.model.PaymentMethod;
import com.aksi.domain.order.statemachine.stage3.dto.OrderPaymentDTO;

import lombok.extern.slf4j.Slf4j;

/**
 * Валідатор для підетапу 3.3 "Оплата".
 *
 * Відповідає за перевірку:
 * - Вибору способу оплати
 * - Валідності суми передоплати
 * - Бізнес-правил для різних способів оплати
 */
@Component
@Slf4j
public class OrderPaymentValidator {

    // Константи валідації
    private static final BigDecimal MIN_PAYMENT_AMOUNT = BigDecimal.valueOf(0.01);
    private static final BigDecimal MAX_PREPAYMENT_PERCENTAGE = BigDecimal.valueOf(100);
    private static final int MIN_TERMINAL_AMOUNT = 1; // Мінімальна сума для оплати терміналом (грн)

    /**
     * Повна валідація OrderPaymentDTO.
     */
    public List<String> validate(OrderPaymentDTO dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("Дані оплати відсутні");
            return errors;
        }

        log.debug("Валідація OrderPaymentDTO для замовлення: {}", dto.getOrderId());

        // Базова валідація
        validateBasicFields(dto, errors);

        // Валідація способу оплати
        validatePaymentMethod(dto, errors);

        // Валідація суми передоплати
        validatePrepaymentAmount(dto, errors);

        // Валідація фінансових даних
        validateFinancialData(dto, errors);

        // Бізнес-правила для різних способів оплати
        validatePaymentMethodRules(dto, errors);

        log.debug("Валідація завершена з {} помилками", errors.size());
        return errors;
    }

    /**
     * Швидка валідація для можливості переходу до наступного кроку.
     */
    public boolean canProceedToNext(OrderPaymentDTO dto) {
        if (dto == null) {
            return false;
        }

        // Спосіб оплати має бути обраний
        if (dto.getPaymentMethod() == null) {
            return false;
        }

        // Фінансові дані мають бути присутні
        if (dto.getFinalAmount() == null || dto.getFinalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }

        // Сума передоплати має бути валідною (якщо введена)
        if (!dto.isPrepaymentAmountValid()) {
            return false;
        }

        return true;
    }

    /**
     * Валідація базових полів.
     */
    private void validateBasicFields(OrderPaymentDTO dto, List<String> errors) {
        if (dto.getOrderId() == null) {
            errors.add("ID замовлення обов'язковий");
        }

        if (dto.getFinalAmount() == null) {
            errors.add("Кінцева сума замовлення відсутня");
        } else if (dto.getFinalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            errors.add("Кінцева сума замовлення має бути більше нуля");
        }
    }

    /**
     * Валідація способу оплати.
     */
    private void validatePaymentMethod(OrderPaymentDTO dto, List<String> errors) {
        if (dto.getPaymentMethod() == null) {
            errors.add("Спосіб оплати обов'язковий");
            return;
        }

        // Перевіряємо чи спосіб оплати підтримується
        PaymentMethod method = dto.getPaymentMethod();
        if (method != PaymentMethod.TERMINAL &&
            method != PaymentMethod.CASH &&
            method != PaymentMethod.BANK_TRANSFER) {
            errors.add("Непідтримуваний спосіб оплати: " + method);
        }
    }

    /**
     * Валідація суми передоплати.
     */
    private void validatePrepaymentAmount(OrderPaymentDTO dto, List<String> errors) {
        BigDecimal prepaymentAmount = dto.getPrepaymentAmount();
        BigDecimal finalAmount = dto.getFinalAmount();

        if (prepaymentAmount == null) {
            // Перевіряємо чи передоплата обов'язкова
            if (dto.isPrepaymentRequired()) {
                errors.add("Передоплата обов'язкова");
            }
            return;
        }

        // Передоплата не може бути від'ємною
        if (prepaymentAmount.compareTo(BigDecimal.ZERO) < 0) {
            errors.add("Сума передоплати не може бути від'ємною");
        }

        // Передоплата не може перевищувати кінцеву суму
        if (finalAmount != null && prepaymentAmount.compareTo(finalAmount) > 0) {
            errors.add("Сума передоплати не може перевищувати загальну суму замовлення");
        }

        // Мінімальна сума передоплати
        BigDecimal minAmount = dto.getMinPrepaymentAmount();
        if (minAmount != null && prepaymentAmount.compareTo(minAmount) < 0) {
            errors.add("Мінімальна сума передоплати: " + minAmount + " грн");
        }

        // Перевірка на занадто малу суму
        if (prepaymentAmount.compareTo(MIN_PAYMENT_AMOUNT) < 0) {
            errors.add("Сума передоплати занадто мала (мінімум " + MIN_PAYMENT_AMOUNT + " грн)");
        }
    }

    /**
     * Валідація фінансових даних.
     */
    private void validateFinancialData(OrderPaymentDTO dto, List<String> errors) {
        BigDecimal totalAmount = dto.getTotalAmount();
        BigDecimal finalAmount = dto.getFinalAmount();
        BigDecimal discountAmount = dto.getDiscountAmount();

        if (totalAmount != null && totalAmount.compareTo(BigDecimal.ZERO) <= 0) {
            errors.add("Загальна сума замовлення має бути більше нуля");
        }

        if (discountAmount != null && discountAmount.compareTo(BigDecimal.ZERO) < 0) {
            errors.add("Сума знижки не може бути від'ємною");
        }

        // Перевірка узгодженості фінансових даних
        if (totalAmount != null && finalAmount != null && discountAmount != null) {
            BigDecimal expectedFinalAmount = totalAmount.subtract(discountAmount);
            if (finalAmount.compareTo(expectedFinalAmount) != 0) {
                errors.add("Невідповідність у фінансових розрахунках");
            }
        }
    }

    /**
     * Валідація бізнес-правил для різних способів оплати.
     */
    private void validatePaymentMethodRules(OrderPaymentDTO dto, List<String> errors) {
        PaymentMethod method = dto.getPaymentMethod();
        BigDecimal finalAmount = dto.getFinalAmount();

        if (method == null || finalAmount == null) {
            return;
        }

        switch (method) {
            case TERMINAL:
                validateTerminalPayment(dto, finalAmount, errors);
                break;
            case CASH:
                validateCashPayment(dto, finalAmount, errors);
                break;
            case BANK_TRANSFER:
                validateBankTransferPayment(dto, finalAmount, errors);
                break;
        }
    }

    /**
     * Валідація оплати терміналом.
     */
    private void validateTerminalPayment(OrderPaymentDTO dto, BigDecimal finalAmount, List<String> errors) {
        // Мінімальна сума для оплати терміналом
        if (finalAmount.compareTo(BigDecimal.valueOf(MIN_TERMINAL_AMOUNT)) < 0) {
            errors.add("Мінімальна сума для оплати терміналом: " + MIN_TERMINAL_AMOUNT + " грн");
        }

        // Для термінальної оплати краще уникати дрібних сум
        if (dto.getPrepaymentAmount() != null) {
            BigDecimal prepayment = dto.getPrepaymentAmount();
            BigDecimal balance = finalAmount.subtract(prepayment);

            if (balance.compareTo(BigDecimal.ZERO) > 0 &&
                balance.compareTo(BigDecimal.valueOf(MIN_TERMINAL_AMOUNT)) < 0) {
                errors.add("Залишок до доплати занадто малий для термінальної оплати");
            }
        }
    }

    /**
     * Валідація готівкової оплати.
     */
    private void validateCashPayment(OrderPaymentDTO dto, BigDecimal finalAmount, List<String> errors) {
        // Для готівки особливих обмежень немає
        // Можливо додати обмеження на максимальну суму готівкової оплати
        BigDecimal maxCashAmount = BigDecimal.valueOf(50000); // 50,000 грн

        if (finalAmount.compareTo(maxCashAmount) > 0) {
            errors.add("Сума замовлення перевищує ліміт готівкової оплати: " + maxCashAmount + " грн");
        }
    }

    /**
     * Валідація безготівкової оплати.
     */
    private void validateBankTransferPayment(OrderPaymentDTO dto, BigDecimal finalAmount, List<String> errors) {
        // Для безготівкової оплати зазвичай передоплата не потрібна
        if (dto.isPrepaymentRequired() && dto.getPrepaymentAmount() == null) {
            errors.add("Для безготівкової оплати передоплата не обов'язкова");
        }

        // Мінімальна сума для безготівкової оплати
        BigDecimal minBankTransferAmount = BigDecimal.valueOf(100);
        if (finalAmount.compareTo(minBankTransferAmount) < 0) {
            errors.add("Мінімальна сума для безготівкової оплати: " + minBankTransferAmount + " грн");
        }
    }

    /**
     * Валідація процентної ставки передоплати.
     */
    public boolean validatePrepaymentPercentage(BigDecimal percentage) {
        if (percentage == null) {
            return true; // Допустимо відсутність відсотка
        }

        return percentage.compareTo(BigDecimal.ZERO) >= 0 &&
               percentage.compareTo(MAX_PREPAYMENT_PERCENTAGE) <= 0;
    }

    /**
     * Валідація суми відносно меж.
     */
    public boolean isAmountInRange(BigDecimal amount, BigDecimal min, BigDecimal max) {
        if (amount == null) {
            return false;
        }

        boolean aboveMin = min == null || amount.compareTo(min) >= 0;
        boolean belowMax = max == null || amount.compareTo(max) <= 0;

        return aboveMin && belowMax;
    }

    /**
     * Перевіряє чи сума округлена до копійок.
     */
    public boolean isAmountProperlyRounded(BigDecimal amount) {
        if (amount == null) {
            return false;
        }

        // Перевіряємо що не більше 2 знаків після коми
        return amount.scale() <= 2;
    }
}
