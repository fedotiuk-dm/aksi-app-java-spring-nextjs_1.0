package com.aksi.domain.order.statemachine.stage3.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.aksi.domain.order.dto.PaymentCalculationRequest;
import com.aksi.domain.order.dto.PaymentCalculationResponse;
import com.aksi.domain.order.model.PaymentMethod;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для підетапу 3.3 "Оплата".
 *
 * Використовує композицію з існуючими DTO для роботи з оплатою:
 * - PaymentCalculationRequest для вхідних параметрів
 * - PaymentCalculationResponse для результатів розрахунків
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderPaymentDTO {

    /**
     * ID замовлення.
     */
    private UUID orderId;

    /**
     * Запит на розрахунок оплати.
     * Містить спосіб оплати та суму передоплати.
     */
    private PaymentCalculationRequest paymentRequest;

    /**
     * Відповідь з розрахунком оплати.
     * Містить всі фінансові деталі.
     */
    private PaymentCalculationResponse paymentResponse;

    /**
     * Обраний спосіб оплати.
     */
    private PaymentMethod paymentMethod;

    /**
     * Сума передоплати введена користувачем.
     */
    private BigDecimal prepaymentAmount;

    /**
     * Мінімальна дозволена сума передоплати.
     */
    @Builder.Default
    private BigDecimal minPrepaymentAmount = BigDecimal.ZERO;

    /**
     * Максимальна дозволена сума передоплати (дорівнює finalAmount).
     */
    private BigDecimal maxPrepaymentAmount;

    /**
     * Чи дозволена часткова передоплата.
     */
    @Builder.Default
    private boolean allowPartialPrepayment = true;

    /**
     * Чи обов'язкова передоплата.
     */
    @Builder.Default
    private boolean prepaymentRequired = false;

    /**
     * Помилки валідації.
     */
    private List<String> errors;

    /**
     * Чи є помилки.
     */
    @Builder.Default
    private boolean hasErrors = false;

    /**
     * Час останнього оновлення.
     */
    private LocalDateTime lastUpdated;

    // Utility методи для отримання даних з композиційних DTO

    /**
     * Отримує загальну суму замовлення.
     */
    public BigDecimal getTotalAmount() {
        return paymentResponse != null ? paymentResponse.getTotalAmount() : null;
    }

    /**
     * Отримує суму знижки.
     */
    public BigDecimal getDiscountAmount() {
        return paymentResponse != null ? paymentResponse.getDiscountAmount() : null;
    }

    /**
     * Отримує кінцеву суму до оплати.
     */
    public BigDecimal getFinalAmount() {
        return paymentResponse != null ? paymentResponse.getFinalAmount() : null;
    }

    /**
     * Отримує розраховану суму боргу.
     */
    public BigDecimal getBalanceAmount() {
        return paymentResponse != null ? paymentResponse.getBalanceAmount() : null;
    }

    /**
     * Перевіряє чи сума передоплати валідна.
     */
    public boolean isPrepaymentAmountValid() {
        if (prepaymentAmount == null) {
            return !prepaymentRequired;
        }

        BigDecimal finalAmount = getFinalAmount();
        if (finalAmount == null) {
            return false;
        }

        return prepaymentAmount.compareTo(minPrepaymentAmount) >= 0 &&
               prepaymentAmount.compareTo(finalAmount) <= 0;
    }

    /**
     * Перевіряє чи замовлення повністю оплачене.
     */
    public boolean isFullyPaid() {
        BigDecimal balance = getBalanceAmount();
        return balance != null && balance.compareTo(BigDecimal.ZERO) == 0;
    }

    /**
     * Перевіряє чи є передоплата.
     */
    public boolean hasPrepayment() {
        return prepaymentAmount != null && prepaymentAmount.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Отримує відсоток передоплати від загальної суми.
     */
    public BigDecimal getPrepaymentPercentage() {
        BigDecimal finalAmount = getFinalAmount();
        if (finalAmount == null || finalAmount.compareTo(BigDecimal.ZERO) == 0 ||
            prepaymentAmount == null || prepaymentAmount.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        return prepaymentAmount
                .multiply(BigDecimal.valueOf(100))
                .divide(finalAmount, 2, java.math.RoundingMode.HALF_UP);
    }

    /**
     * Отримує текстовий опис способу оплати.
     */
    public String getPaymentMethodDescription() {
        if (paymentMethod == null) {
            return "Не обрано";
        }

        return switch (paymentMethod) {
            case TERMINAL -> "Термінал (картка)";
            case CASH -> "Готівка";
            case BANK_TRANSFER -> "На рахунок";
            default -> paymentMethod.toString();
        };
    }

    /**
     * Оновлює максимальну суму передоплати на основі кінцевої суми.
     */
    public void updateMaxPrepaymentAmount() {
        BigDecimal finalAmount = getFinalAmount();
        if (finalAmount != null) {
            this.maxPrepaymentAmount = finalAmount;
        }
    }

    /**
     * Перевіряє чи потрібно оновити розрахунки.
     */
    public boolean needsRecalculation() {
        if (paymentRequest == null || paymentResponse == null) {
            return true;
        }

        // Перевіряємо чи збігаються дані запиту з поточними налаштуваннями
        return !paymentRequest.getPaymentMethod().equals(paymentMethod) ||
               (paymentRequest.getPrepaymentAmount() != null &&
                !paymentRequest.getPrepaymentAmount().equals(prepaymentAmount)) ||
               (paymentRequest.getPrepaymentAmount() == null && prepaymentAmount != null);
    }
}
