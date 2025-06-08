package com.aksi.domain.order.statemachine.stage4.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage4.dto.OrderSummaryDTO;

import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для валідації даних OrderSummary.
 * Винесена валідаційна логіка з DTO для дотримання SRP та DDD принципів.
 */
@Slf4j
@Service
public class OrderSummaryValidationService {

    /**
     * Валідувати повноту та коректність даних замовлення.
     */
    public OrderSummaryValidationResult validateOrderSummary(OrderSummaryDTO summary) {
        List<String> errors = new ArrayList<>();

        // Валідація обов'язкових полів
        if (summary.getClient() == null) {
            errors.add("Відсутня інформація про клієнта");
        }

        if (summary.getItems() == null || summary.getItems().isEmpty()) {
            errors.add("Замовлення не містить предметів");
        }

        if (summary.getFinalAmount() == null) {
            errors.add("Відсутня фінальна сума замовлення");
        } else if (summary.getFinalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            errors.add("Фінальна сума замовлення повинна бути більше нуля");
        }

        // Валідація фінансових розрахунків
        validateFinancialCalculations(summary, errors);

        // Валідація знижок
        validateDiscounts(summary, errors);

        // Валідація термінових надбавок
        validateExpediteCharges(summary, errors);

        boolean isValid = errors.isEmpty();
        log.debug("Валідація замовлення {}: {}", summary.getReceiptNumber(),
                 isValid ? "успішна" : "невдала (" + errors.size() + " помилок)");

        return new OrderSummaryValidationResult(isValid, errors);
    }

    /**
     * Валідувати фінансові розрахунки.
     */
    private void validateFinancialCalculations(OrderSummaryDTO summary, List<String> errors) {
        if (summary.getSubtotalAmount() != null && summary.getFinalAmount() != null) {
            BigDecimal expectedFinal = summary.getSubtotalAmount();

            // Додаємо надбавку за терміновість
            if (summary.getExpediteAmount() != null) {
                expectedFinal = expectedFinal.add(summary.getExpediteAmount());
            }

            // Віднімаємо знижку
            if (summary.getDiscountAmount() != null) {
                expectedFinal = expectedFinal.subtract(summary.getDiscountAmount());
            }

            // Перевіряємо розбіжність (дозволяємо 0.01 похибку через округлення)
            BigDecimal difference = summary.getFinalAmount().subtract(expectedFinal).abs();
            if (difference.compareTo(BigDecimal.valueOf(0.01)) > 0) {
                errors.add("Невідповідність у фінальних розрахунках");
            }
        }

        // Валідація передоплати та боргу
        if (summary.getPrepaymentAmount() != null && summary.getBalanceAmount() != null
            && summary.getFinalAmount() != null) {
            BigDecimal totalPaid = summary.getPrepaymentAmount().add(summary.getBalanceAmount());
            if (!totalPaid.equals(summary.getFinalAmount())) {
                errors.add("Сума передоплати та боргу не відповідає фінальній сумі");
            }
        }
    }

    /**
     * Валідувати знижки.
     */
    private void validateDiscounts(OrderSummaryDTO summary, List<String> errors) {
        if (summary.hasDiscount()) {
            if (summary.getDiscountAmount() == null || summary.getDiscountAmount().compareTo(BigDecimal.ZERO) <= 0) {
                errors.add("Некоректна сума знижки");
            }

            if (summary.getDiscountType() == null) {
                errors.add("Не вказано тип знижки");
            }

            // Перевірка відсотків знижки
            if (summary.getDiscountPercentage() != null) {
                if (summary.getDiscountPercentage() < 0 || summary.getDiscountPercentage() > 100) {
                    errors.add("Відсоток знижки повинен бути від 0 до 100");
                }
            }
        }
    }

    /**
     * Валідувати надбавки за терміновість.
     */
    private void validateExpediteCharges(OrderSummaryDTO summary, List<String> errors) {
        if (summary.hasExpediteCharge()) {
            if (summary.getExpediteAmount() == null || summary.getExpediteAmount().compareTo(BigDecimal.ZERO) <= 0) {
                errors.add("Некоректна сума надбавки за терміновість");
            }

            if (summary.getExpediteType() == null) {
                errors.add("Не вказано тип терміновості");
            }

            // Перевірка відсотків терміновості
            if (summary.getExpeditePercentage() != null) {
                if (summary.getExpeditePercentage() < 0 || summary.getExpeditePercentage() > 200) {
                    errors.add("Відсоток надбавки за терміновість повинен бути від 0 до 200");
                }
            }
        }
    }

    /**
     * Перевірити готовність до переходу на наступний етап.
     */
    public boolean canProceedToNextStep(OrderSummaryDTO summary) {
        OrderSummaryValidationResult result = validateOrderSummary(summary);
        return result.isValid();
    }

    /**
     * Результат валідації.
     */
    public record OrderSummaryValidationResult(
        boolean isValid,
        List<String> errors
    ) {}
}
