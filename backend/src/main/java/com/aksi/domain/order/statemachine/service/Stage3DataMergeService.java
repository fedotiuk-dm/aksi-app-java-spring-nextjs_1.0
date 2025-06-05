package com.aksi.domain.order.statemachine.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage3.dto.ExecutionParametersDTO;
import com.aksi.domain.order.statemachine.stage3.dto.OrderDiscountDTO;
import com.aksi.domain.order.statemachine.stage3.dto.OrderPaymentDTO;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для керування даними етапу 3 Order Wizard (Загальні параметри замовлення).
 * Відповідає за збереження та валідацію даних:
 * - Підетап 3.1: Параметри виконання
 * - Підетап 3.2: Знижки
 * - Підетап 3.3: Оплата
 * - Підетап 3.4: Додаткова інформація
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class Stage3DataMergeService {

    private static final String EXECUTION_PARAMS_KEY = "stage3ExecutionParams";
    private static final String DISCOUNT_KEY = "stage3Discount";
    private static final String PAYMENT_KEY = "stage3Payment";
    private static final String ADDITIONAL_NOTES_KEY = "stage3AdditionalNotes";

    private final ObjectMapper objectMapper;

    /**
     * === ПІДЕТАП 3.1: ПАРАМЕТРИ ВИКОНАННЯ ===
     */

    /**
     * Зберегти параметри виконання.
     */
    public void saveExecutionParameters(Map<String, Object> contextVariables, ExecutionParametersDTO executionParams) {
        if (executionParams == null) {
            log.warn("Спроба збереження null параметрів виконання");
            return;
        }

        contextVariables.put(EXECUTION_PARAMS_KEY, executionParams);

        log.debug("Параметри виконання збережено: дата {}, терміновість {}",
                 executionParams.getCompletionDate(), executionParams.getExpediteType());
    }

    /**
     * Завантажити параметри виконання.
     */
    public ExecutionParametersDTO loadExecutionParameters(Map<String, Object> contextVariables) {
        Object data = contextVariables.get(EXECUTION_PARAMS_KEY);
        if (data == null) {
            log.debug("Параметри виконання не знайдено в контексті");
            return null;
        }

        try {
            if (data instanceof ExecutionParametersDTO executionParamsData) {
                return executionParamsData;
            }
            return objectMapper.convertValue(data, ExecutionParametersDTO.class);
        } catch (Exception e) {
            log.error("Помилка конвертації параметрів виконання: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * === ПІДЕТАП 3.2: ЗНИЖКИ ===
     */

    /**
     * Зберегти дані знижки.
     */
    public void saveOrderDiscount(Map<String, Object> contextVariables, OrderDiscountDTO discount) {
        if (discount == null) {
            log.warn("Спроба збереження null даних знижки");
            return;
        }

        contextVariables.put(DISCOUNT_KEY, discount);

                log.debug("Дані знижки збережено: тип {}, відсоток {}",
                 discount.getDiscountType(), discount.getDiscountPercentage());
    }

    /**
     * Завантажити дані знижки.
     */
    public OrderDiscountDTO loadOrderDiscount(Map<String, Object> contextVariables) {
        Object data = contextVariables.get(DISCOUNT_KEY);
        if (data == null) {
            log.debug("Дані знижки не знайдено в контексті");
            return null;
        }

        try {
            if (data instanceof OrderDiscountDTO discountData) {
                return discountData;
            }
            return objectMapper.convertValue(data, OrderDiscountDTO.class);
        } catch (Exception e) {
            log.error("Помилка конвертації даних знижки: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * === ПІДЕТАП 3.3: ОПЛАТА ===
     */

    /**
     * Зберегти дані оплати.
     */
    public void saveOrderPayment(Map<String, Object> contextVariables, OrderPaymentDTO payment) {
        if (payment == null) {
            log.warn("Спроба збереження null даних оплати");
            return;
        }

        contextVariables.put(PAYMENT_KEY, payment);

        log.debug("Дані оплати збережено: спосіб {}, сплачено {}, борг {}",
                 payment.getPaymentMethod(), payment.getPrepaymentAmount(), payment.getBalanceAmount());
    }

    /**
     * Завантажити дані оплати.
     */
    public OrderPaymentDTO loadOrderPayment(Map<String, Object> contextVariables) {
        Object data = contextVariables.get(PAYMENT_KEY);
        if (data == null) {
            log.debug("Дані оплати не знайдено в контексті");
            return null;
        }

        try {
            if (data instanceof OrderPaymentDTO paymentData) {
                return paymentData;
            }
            return objectMapper.convertValue(data, OrderPaymentDTO.class);
        } catch (Exception e) {
            log.error("Помилка конвертації даних оплати: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * === ПІДЕТАП 3.4: ДОДАТКОВА ІНФОРМАЦІЯ ===
     */

    /**
     * Зберегти додаткові примітки.
     */
    public void saveAdditionalNotes(Map<String, Object> contextVariables, String additionalNotes) {
        contextVariables.put(ADDITIONAL_NOTES_KEY, additionalNotes);

        log.debug("Додаткові примітки збережено: {} символів",
                 additionalNotes != null ? additionalNotes.length() : 0);
    }

    /**
     * Завантажити додаткові примітки.
     */
    public String loadAdditionalNotes(Map<String, Object> contextVariables) {
        Object data = contextVariables.get(ADDITIONAL_NOTES_KEY);
        return data instanceof String notes ? notes : null;
    }

    /**
     * === ВАЛІДАЦІЯ ЕТАПУ 3 ===
     */

    /**
     * Перевірити завершеність етапу 3.
     */
    public boolean isStage3Complete(Map<String, Object> contextVariables) {
        ExecutionParametersDTO executionParams = loadExecutionParameters(contextVariables);
        OrderDiscountDTO discount = loadOrderDiscount(contextVariables);
        OrderPaymentDTO payment = loadOrderPayment(contextVariables);

                boolean complete = executionParams != null && executionParams.getCompletionDate() != null &&
                          discount != null &&
                          payment != null && payment.getPaymentMethod() != null && payment.getTotalAmount() != null;

        log.debug("Перевірка завершеності етапу 3: {}", complete);
        return complete;
    }

    /**
     * Валідувати параметри виконання.
     */
    public Stage3ValidationResult validateExecutionParameters(Map<String, Object> contextVariables) {
        ExecutionParametersDTO executionParams = loadExecutionParameters(contextVariables);

        if (executionParams == null) {
            return new Stage3ValidationResult(false, "Параметри виконання не знайдено", 0);
        }

        if (executionParams.getCompletionDate() == null) {
            return new Stage3ValidationResult(false, "Дата виконання не вказана", 15);
        }

        if (executionParams.getHasErrors() != null && executionParams.getHasErrors()) {
            return new Stage3ValidationResult(false, executionParams.getErrorMessage(), 15);
        }

        return new Stage3ValidationResult(true, null, 25);
    }

    /**
     * Валідувати знижки.
     */
    public Stage3ValidationResult validateDiscount(Map<String, Object> contextVariables) {
        OrderDiscountDTO discount = loadOrderDiscount(contextVariables);

        if (discount == null) {
            return new Stage3ValidationResult(false, "Дані знижки не знайдено", 25);
        }

        if (discount.getHasErrors() != null && discount.getHasErrors()) {
            return new Stage3ValidationResult(false, "Помилки в налаштуванні знижки", 35);
        }

        return new Stage3ValidationResult(true, null, 50);
    }

    /**
     * Валідувати оплату.
     */
    public Stage3ValidationResult validatePayment(Map<String, Object> contextVariables) {
        OrderPaymentDTO payment = loadOrderPayment(contextVariables);

        if (payment == null) {
            return new Stage3ValidationResult(false, "Дані оплати не знайдено", 50);
        }

        if (payment.getPaymentMethod() == null) {
            return new Stage3ValidationResult(false, "Спосіб оплати не обраний", 60);
        }

        if (payment.getTotalAmount() == null) {
            return new Stage3ValidationResult(false, "Загальна сума не розрахована", 70);
        }

        if (payment.isHasErrors()) {
            return new Stage3ValidationResult(false, "Помилки в налаштуванні оплати", 75);
        }

        return new Stage3ValidationResult(true, null, 100);
    }

    /**
     * Загальна валідація етапу 3.
     */
    public Stage3ValidationResult validateStage3(Map<String, Object> contextVariables) {
        // Перевіряємо параметри виконання
        Stage3ValidationResult executionValidation = validateExecutionParameters(contextVariables);
        if (!executionValidation.isValid()) {
            return executionValidation;
        }

        // Перевіряємо знижки
        Stage3ValidationResult discountValidation = validateDiscount(contextVariables);
        if (!discountValidation.isValid()) {
            return discountValidation;
        }

        // Перевіряємо оплату
        return validatePayment(contextVariables);
    }

    /**
     * === РОЗРАХУНКИ ===
     */

    /**
     * Розрахувати фінальну суму з урахуванням знижки та терміновості.
     */
    public BigDecimal calculateFinalAmount(Map<String, Object> contextVariables, BigDecimal baseAmount) {
        if (baseAmount == null || baseAmount.compareTo(BigDecimal.ZERO) <= 0) {
            log.warn("Некоректна базова сума для розрахунку: {}", baseAmount);
            return BigDecimal.ZERO;
        }

        BigDecimal finalAmount = baseAmount;

        // Застосовуємо терміновість
        ExecutionParametersDTO executionParams = loadExecutionParameters(contextVariables);
        if (executionParams != null && executionParams.isExpedited()) {
            BigDecimal expeditePercentage = executionParams.getExpeditePercentage();
            if (expeditePercentage != null && expeditePercentage.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal multiplier = expeditePercentage.divide(BigDecimal.valueOf(100), RoundingMode.HALF_UP)
                        .add(BigDecimal.ONE);
                finalAmount = finalAmount.multiply(multiplier);
                log.debug("Застосовано коефіцієнт терміновості: {}%", expeditePercentage);
            }
        }

        // Застосовуємо знижку
        OrderDiscountDTO discount = loadOrderDiscount(contextVariables);
        if (discount != null && discount.hasActiveDiscount()) {
            BigDecimal discountPercentage = BigDecimal.valueOf(discount.getDiscountPercentage());
            BigDecimal discountAmount = finalAmount.multiply(discountPercentage)
                .divide(BigDecimal.valueOf(100), RoundingMode.HALF_UP);
            finalAmount = finalAmount.subtract(discountAmount);
            log.debug("Застосовано знижку {}%: -{}", discountPercentage, discountAmount);
        }

        log.debug("Фінальна сума розрахована: {} -> {}", baseAmount, finalAmount);
        return finalAmount;
    }

    /**
     * Розрахувати борг.
     */
    public BigDecimal calculateDebt(Map<String, Object> contextVariables, BigDecimal totalAmount) {
        OrderPaymentDTO payment = loadOrderPayment(contextVariables);
        if (payment == null || payment.getPrepaymentAmount() == null) {
            return totalAmount;
        }

        BigDecimal debt = totalAmount.subtract(payment.getPrepaymentAmount());
        return debt.max(BigDecimal.ZERO); // Борг не може бути від'ємним
    }

    /**
     * === ЗЛИВАННЯ ДАНИХ В ЕТАПІ 3 ===
     */

    /**
     * Злити дані з етапу 2 (загальна сума) в етап 3.
     */
    public OrderPaymentDTO mergeStage2AmountToPayment(
            Map<String, Object> contextVariables,
            BigDecimal itemsAmount,
            OrderPaymentDTO payment) {

        if (itemsAmount == null || itemsAmount.compareTo(BigDecimal.ZERO) <= 0) {
            log.warn("Некоректна сума предметів для зливання: {}", itemsAmount);
            return payment;
        }

        if (payment == null) {
            payment = OrderPaymentDTO.builder().build();
        }

        // Розраховуємо фінальну суму з урахуванням знижок та терміновості
        BigDecimal finalAmount = calculateFinalAmount(contextVariables, itemsAmount);

        // Правильно використовуємо композиційну архітектуру OrderPaymentDTO
        // Створюємо або оновлюємо PaymentCalculationResponse з розрахованими сумами
        payment.setPaymentResponse(createPaymentCalculationResponse(
                itemsAmount,    // базова сума
                finalAmount,    // фінальна сума після знижок та терміновості
                payment.getPrepaymentAmount()  // передоплата
        ));

        // Оновлюємо максимальну суму передоплати
        payment.setMaxPrepaymentAmount(finalAmount);

        // Ініціалізуємо передоплату якщо не вказана
        if (payment.getPrepaymentAmount() == null) {
            payment.setPrepaymentAmount(BigDecimal.ZERO);
        }

        log.debug("Дані суми злиті в оплату: базова {}, фінальна {}, борг {}",
                 itemsAmount, finalAmount,
                 finalAmount.subtract(payment.getPrepaymentAmount()));

        return payment;
    }

    /**
     * Створити PaymentCalculationResponse для композиційної архітектури.
     */
    private com.aksi.domain.order.dto.PaymentCalculationResponse createPaymentCalculationResponse(
            BigDecimal subtotalAmount,
            BigDecimal finalAmount,
            BigDecimal prepaymentAmount) {

        BigDecimal discountAmount = subtotalAmount.subtract(finalAmount);
        BigDecimal balanceAmount = finalAmount;

        if (prepaymentAmount != null && prepaymentAmount.compareTo(BigDecimal.ZERO) > 0) {
            balanceAmount = finalAmount.subtract(prepaymentAmount);
            // Борг не може бути від'ємним
            balanceAmount = balanceAmount.max(BigDecimal.ZERO);
        }

        return com.aksi.domain.order.dto.PaymentCalculationResponse.builder()
                .totalAmount(subtotalAmount)
                .discountAmount(discountAmount.max(BigDecimal.ZERO))
                .finalAmount(finalAmount)
                .prepaymentAmount(prepaymentAmount != null ? prepaymentAmount : BigDecimal.ZERO)
                .balanceAmount(balanceAmount)
                .build();
    }

    /**
     * === ОЧИЩЕННЯ ДАНИХ ===
     */

    /**
     * Очистити всі дані етапу 3.
     */
    public void clearStage3Data(Map<String, Object> contextVariables) {
        contextVariables.remove(EXECUTION_PARAMS_KEY);
        contextVariables.remove(DISCOUNT_KEY);
        contextVariables.remove(PAYMENT_KEY);
        contextVariables.remove(ADDITIONAL_NOTES_KEY);

        log.info("Дані етапу 3 очищено");
    }

    /**
     * Очистити тільки дані оплати (для перерахунку).
     */
    public void clearPaymentData(Map<String, Object> contextVariables) {
        contextVariables.remove(PAYMENT_KEY);

        log.info("Дані оплати очищено");
    }

    /**
     * === ДОПОМІЖНІ КЛАСИ ===
     */

    /**
     * Результат валідації даних етапу 3.
     */
    public record Stage3ValidationResult(
        boolean isValid,
        String errorMessage,
        int completionPercentage
    ) {}
}
