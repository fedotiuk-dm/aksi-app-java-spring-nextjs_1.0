package com.aksi.domain.order.statemachine.stage3.mapper;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

import com.aksi.domain.order.dto.PaymentCalculationRequest;
import com.aksi.domain.order.dto.PaymentCalculationResponse;
import com.aksi.domain.order.model.PaymentMethod;
import com.aksi.domain.order.statemachine.stage3.dto.PaymentConfigurationDTO;

/**
 * Mapper для конвертації PaymentConfigurationDTO та доменних DTO
 * ЕТАП 1.3: Залежить тільки від DTO
 */
public class Stage3PaymentMapper {

    /**
     * Створює PaymentConfigurationDTO з базових параметрів
     */
    public static PaymentConfigurationDTO createFromBasicParams(
            UUID sessionId,
            UUID orderId) {
        return new PaymentConfigurationDTO(sessionId, orderId);
    }

    /**
     * Створює PaymentConfigurationDTO з доменного запиту
     */
    public static PaymentConfigurationDTO fromDomainRequest(
            UUID sessionId,
            PaymentCalculationRequest request) {
        if (request == null) {
            return new PaymentConfigurationDTO(sessionId);
        }

        PaymentConfigurationDTO dto = new PaymentConfigurationDTO(sessionId, request.getOrderId());
        dto.setPaymentRequest(request);
        return dto;
    }

    /**
     * Конвертує PaymentConfigurationDTO в доменний запит
     */
    public static PaymentCalculationRequest toDomainRequest(PaymentConfigurationDTO dto) {
        if (dto == null || !dto.hasRequiredParameters()) {
            return null;
        }

        return PaymentCalculationRequest.builder()
                .orderId(dto.getOrderId())
                .paymentMethod(dto.getPaymentMethod())
                .prepaymentAmount(dto.getPaidAmount() != null ? dto.getPaidAmount() : BigDecimal.ZERO)
                .build();
    }

    /**
     * Оновлює PaymentConfigurationDTO з доменної відповіді
     */
    public static PaymentConfigurationDTO updateWithDomainResponse(
            PaymentConfigurationDTO dto,
            PaymentCalculationResponse response) {
        if (dto == null) {
            return null;
        }

        dto.setPaymentResponse(response);

        // Автоматично встановлюємо валідність
        dto.setIsValid(response != null);

        return dto;
    }

    /**
     * Встановлює спосіб оплати
     */
    public static PaymentConfigurationDTO withPaymentMethod(
            PaymentConfigurationDTO dto,
            PaymentMethod paymentMethod) {
        if (dto == null) {
            return null;
        }

        dto.setPaymentMethod(paymentMethod);
        return dto;
    }

    /**
     * Встановлює суму передоплати
     */
    public static PaymentConfigurationDTO withPrepayment(
            PaymentConfigurationDTO dto,
            BigDecimal prepaymentAmount) {
        if (dto == null) {
            return null;
        }

        dto.setPrepaymentAmount(prepaymentAmount);
        return dto;
    }

    /**
     * Встановлює повну передоплату
     */
    public static PaymentConfigurationDTO withFullPrepayment(PaymentConfigurationDTO dto) {
        if (dto == null || dto.getTotalAmount() == null) {
            return dto;
        }

        dto.setPrepaymentAmount(dto.getTotalAmount());
        return dto;
    }

    /**
     * Скидає передоплату до нуля
     */
    public static PaymentConfigurationDTO resetPrepayment(PaymentConfigurationDTO dto) {
        if (dto == null) {
            return null;
        }

        dto.setPrepaymentAmount(BigDecimal.ZERO);
        return dto;
    }

    /**
     * Позначає конфігурацію оплати як завершену
     */
    public static PaymentConfigurationDTO markAsComplete(PaymentConfigurationDTO dto) {
        if (dto == null) {
            return null;
        }

        if (dto.isReadyForCompletion()) {
            dto.setPaymentConfigComplete(true);
        }
        return dto;
    }

    /**
     * Скидає стан завершення
     */
    public static PaymentConfigurationDTO resetCompletion(PaymentConfigurationDTO dto) {
        if (dto == null) {
            return null;
        }

        dto.setPaymentConfigComplete(false);
        return dto;
    }

    /**
     * Створює копію DTO з новим способом оплати
     */
    public static PaymentConfigurationDTO copyWithNewPaymentMethod(
            PaymentConfigurationDTO original,
            PaymentMethod paymentMethod) {
        if (original == null) {
            return null;
        }

        PaymentConfigurationDTO copy = new PaymentConfigurationDTO(
                original.getSessionId(),
                original.getOrderId());
        copy.setPaymentMethod(paymentMethod);
        copy.setTotalAmount(original.getTotalAmount());
        copy.setPrepaymentAmount(original.getPaidAmount());

        return copy;
    }

    /**
     * Розраховує відсоток передоплати
     */
    public static BigDecimal calculatePrepaymentPercentage(PaymentConfigurationDTO dto) {
        if (dto == null || dto.getTotalAmount() == null || dto.getPaidAmount() == null) {
            return BigDecimal.ZERO;
        }

        BigDecimal totalAmount = dto.getTotalAmount();
        BigDecimal paidAmount = dto.getPaidAmount();

        if (totalAmount.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        return paidAmount.multiply(BigDecimal.valueOf(100))
                        .divide(totalAmount, 2, RoundingMode.HALF_UP);
    }

    /**
     * Створює опис оплати
     */
    public static String createPaymentSummary(PaymentConfigurationDTO dto) {
        if (dto == null) {
            return "Спосіб оплати не встановлений";
        }

        StringBuilder summary = new StringBuilder();

        // Спосіб оплати
        PaymentMethod paymentMethod = dto.getPaymentMethod();
                 if (paymentMethod != null) {
             String paymentText = switch (paymentMethod) {
                 case CASH -> "Готівка";
                 case TERMINAL -> "Термінал (картка)";
                 case BANK_TRANSFER -> "Банківський переказ";
                 default -> "Спосіб оплати: " + paymentMethod;
             };
             summary.append(paymentText);
        } else {
            summary.append("Спосіб оплати не вибраний");
        }

        // Фінансова інформація
        BigDecimal totalAmount = dto.getTotalAmount();
        BigDecimal paidAmount = dto.getPaidAmount();
        BigDecimal remainingAmount = dto.getRemainingAmount();

        if (totalAmount != null) {
            summary.append(", загальна сума: ").append(totalAmount).append(" грн");
        }

        if (paidAmount != null && paidAmount.compareTo(BigDecimal.ZERO) > 0) {
            summary.append(", передоплата: ").append(paidAmount).append(" грн");

            BigDecimal percentage = calculatePrepaymentPercentage(dto);
            if (percentage.compareTo(BigDecimal.ZERO) > 0) {
                summary.append(" (").append(percentage).append("%)");
            }
        }

        if (remainingAmount != null && remainingAmount.compareTo(BigDecimal.ZERO) > 0) {
            summary.append(", до доплати: ").append(remainingAmount).append(" грн");
        } else if (dto.isFullyPaid()) {
            summary.append(", повністю сплачено");
        }

        return summary.toString();
    }

    /**
     * Перевіряє чи змінився спосіб оплати
     */
    public static boolean hasPaymentMethodChanged(
            PaymentConfigurationDTO dto,
            PaymentMethod newPaymentMethod) {
        if (dto == null) {
            return newPaymentMethod != null;
        }

        PaymentMethod currentMethod = dto.getPaymentMethod();
        return currentMethod != newPaymentMethod;
    }

    /**
     * Перевіряє чи змінилася сума передоплати
     */
    public static boolean hasPrepaymentChanged(
            PaymentConfigurationDTO dto,
            BigDecimal newPrepaymentAmount) {
        if (dto == null) {
            return newPrepaymentAmount != null && newPrepaymentAmount.compareTo(BigDecimal.ZERO) != 0;
        }

        BigDecimal currentPrepayment = dto.getPaidAmount();
        if (currentPrepayment == null) {
            currentPrepayment = BigDecimal.ZERO;
        }
        if (newPrepaymentAmount == null) {
            newPrepaymentAmount = BigDecimal.ZERO;
        }

        return currentPrepayment.compareTo(newPrepaymentAmount) != 0;
    }

    /**
     * Встановлює повідомлення валідації
     */
    public static PaymentConfigurationDTO withValidationMessage(
            PaymentConfigurationDTO dto,
            String message,
            boolean isValid) {
        if (dto == null) {
            return null;
        }

        dto.setValidationMessage(message);
        dto.setIsValid(isValid);
        return dto;
    }

    /**
     * Валідує суму передоплати
     */
    public static boolean isValidPrepaymentAmount(
            PaymentConfigurationDTO dto,
            BigDecimal prepaymentAmount) {
        if (dto == null || prepaymentAmount == null) {
            return false;
        }

        BigDecimal totalAmount = dto.getTotalAmount();

        return prepaymentAmount.compareTo(BigDecimal.ZERO) >= 0 &&
               (totalAmount == null || prepaymentAmount.compareTo(totalAmount) <= 0);
    }
}
