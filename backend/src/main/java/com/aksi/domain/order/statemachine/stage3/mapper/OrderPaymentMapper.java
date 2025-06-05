package com.aksi.domain.order.statemachine.stage3.mapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.dto.PaymentCalculationRequest;
import com.aksi.domain.order.dto.PaymentCalculationResponse;
import com.aksi.domain.order.model.PaymentMethod;
import com.aksi.domain.order.statemachine.stage3.dto.OrderPaymentDTO;

import lombok.extern.slf4j.Slf4j;

/**
 * Mapper для підетапу 3.3 "Оплата".
 *
 * Відповідає за конвертацію між:
 * - OrderPaymentDTO та OrderDTO
 * - Створення PaymentCalculationRequest
 * - Обробка PaymentCalculationResponse
 */
@Component
@Slf4j
public class OrderPaymentMapper {

    /**
     * Створює OrderPaymentDTO з OrderDTO.
     */
    public OrderPaymentDTO fromOrderDTO(OrderDTO orderDTO) {
        if (orderDTO == null) {
            return createEmptyDTO(null);
        }

        log.debug("Конвертація OrderDTO в OrderPaymentDTO");

        // Створюємо базовий PaymentCalculationRequest
        PaymentCalculationRequest paymentRequest = createDefaultPaymentRequest(orderDTO.getId());

        // Створюємо PaymentCalculationResponse з даних OrderDTO
        PaymentCalculationResponse paymentResponse = null;
        if (orderDTO.getFinalAmount() != null) {
            paymentResponse = PaymentCalculationResponse.builder()
                    .orderId(orderDTO.getId())
                    .paymentMethod(PaymentMethod.CASH) // За замовчуванням
                    .totalAmount(orderDTO.getTotalAmount())
                    .discountAmount(orderDTO.getDiscountAmount())
                    .finalAmount(orderDTO.getFinalAmount())
                    .prepaymentAmount(orderDTO.getPrepaymentAmount() != null ? orderDTO.getPrepaymentAmount() : BigDecimal.ZERO)
                    .balanceAmount(orderDTO.getBalanceAmount() != null ? orderDTO.getBalanceAmount() : orderDTO.getFinalAmount())
                    .build();
        }

        OrderPaymentDTO dto = OrderPaymentDTO.builder()
                .orderId(orderDTO.getId())
                .paymentRequest(paymentRequest)
                .paymentResponse(paymentResponse)
                .paymentMethod(PaymentMethod.CASH) // За замовчуванням
                .prepaymentAmount(orderDTO.getPrepaymentAmount())
                .minPrepaymentAmount(BigDecimal.ZERO)
                .allowPartialPrepayment(true)
                .prepaymentRequired(false)
                .lastUpdated(LocalDateTime.now())
                .build();

        // Оновлюємо максимальну суму передоплати
        dto.updateMaxPrepaymentAmount();

        return dto;
    }

    /**
     * Створює OrderPaymentDTO для нового замовлення.
     */
    public OrderPaymentDTO createForNewOrder(UUID orderId) {
        return createEmptyDTO(orderId);
    }

    /**
     * Оновлює OrderPaymentDTO з PaymentCalculationResponse.
     */
    public void updateWithPaymentResponse(OrderPaymentDTO dto, PaymentCalculationResponse response) {
        if (dto == null || response == null) {
            return;
        }

        log.debug("Оновлення OrderPaymentDTO з PaymentCalculationResponse");

        dto.setPaymentResponse(response);

        // Оновлюємо поля для зручності доступу
        if (response.getPaymentMethod() != null) {
            dto.setPaymentMethod(response.getPaymentMethod());
        }

        if (response.getPrepaymentAmount() != null) {
            dto.setPrepaymentAmount(response.getPrepaymentAmount());
        }

        // Оновлюємо максимальну суму передоплати
        dto.updateMaxPrepaymentAmount();

        dto.setLastUpdated(LocalDateTime.now());
    }

    /**
     * Створює PaymentCalculationRequest з OrderPaymentDTO.
     */
    public PaymentCalculationRequest toPaymentCalculationRequest(OrderPaymentDTO dto) {
        if (dto == null || dto.getOrderId() == null) {
            return null;
        }

        return PaymentCalculationRequest.builder()
                .orderId(dto.getOrderId())
                .paymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : PaymentMethod.CASH)
                .prepaymentAmount(dto.getPrepaymentAmount())
                .build();
    }

    /**
     * Оновлює OrderDTO з OrderPaymentDTO.
     */
    public void updateOrderDTO(OrderDTO orderDTO, OrderPaymentDTO paymentDTO) {
        if (orderDTO == null || paymentDTO == null) {
            return;
        }

        log.debug("Оновлення OrderDTO з OrderPaymentDTO");

        // Оновлюємо фінансові дані якщо є paymentResponse
        if (paymentDTO.getPaymentResponse() != null) {
            PaymentCalculationResponse response = paymentDTO.getPaymentResponse();

            if (response.getTotalAmount() != null) {
                orderDTO.setTotalAmount(response.getTotalAmount());
            }

            if (response.getDiscountAmount() != null) {
                orderDTO.setDiscountAmount(response.getDiscountAmount());
            }

            if (response.getFinalAmount() != null) {
                orderDTO.setFinalAmount(response.getFinalAmount());
            }

            if (response.getPrepaymentAmount() != null) {
                orderDTO.setPrepaymentAmount(response.getPrepaymentAmount());
            }

            if (response.getBalanceAmount() != null) {
                orderDTO.setBalanceAmount(response.getBalanceAmount());
            }
        }

        // Оновлюємо спосіб оплати якщо він обраний
        if (paymentDTO.getPaymentMethod() != null) {
            // Примітка: OrderDTO не має поля paymentMethod, воно зберігається в OrderEntity
            // Тому цей метод буде використовуватися в сервісі для оновлення entity
        }
    }

    /**
     * Оновлює спосіб оплати в OrderPaymentDTO.
     */
    public void updatePaymentMethod(OrderPaymentDTO dto, PaymentMethod paymentMethod) {
        if (dto == null) {
            return;
        }

        log.debug("Оновлення способу оплати на: {}", paymentMethod);

        dto.setPaymentMethod(paymentMethod);

        // Оновлюємо paymentRequest
        if (dto.getPaymentRequest() != null) {
            dto.getPaymentRequest().setPaymentMethod(paymentMethod);
        } else {
            dto.setPaymentRequest(createDefaultPaymentRequest(dto.getOrderId(), paymentMethod));
        }

        // Скидаємо paymentResponse щоб перерахувати
        dto.setPaymentResponse(null);

        dto.setLastUpdated(LocalDateTime.now());
    }

    /**
     * Оновлює суму передоплати в OrderPaymentDTO.
     */
    public void updatePrepaymentAmount(OrderPaymentDTO dto, BigDecimal prepaymentAmount) {
        if (dto == null) {
            return;
        }

        log.debug("Оновлення суми передоплати на: {}", prepaymentAmount);

        dto.setPrepaymentAmount(prepaymentAmount);

        // Оновлюємо paymentRequest
        if (dto.getPaymentRequest() != null) {
            dto.getPaymentRequest().setPrepaymentAmount(prepaymentAmount);
        } else {
            PaymentCalculationRequest request = createDefaultPaymentRequest(dto.getOrderId());
            request.setPrepaymentAmount(prepaymentAmount);
            dto.setPaymentRequest(request);
        }

        // Скидаємо paymentResponse щоб перерахувати
        dto.setPaymentResponse(null);

        dto.setLastUpdated(LocalDateTime.now());
    }

    /**
     * Налаштовує правила передоплати.
     */
    public void configurePrepaymentRules(OrderPaymentDTO dto, boolean required,
                                        BigDecimal minAmount, boolean allowPartial) {
        if (dto == null) {
            return;
        }

        log.debug("Налаштування правил передоплати: required={}, min={}, allowPartial={}",
                 required, minAmount, allowPartial);

        dto.setPrepaymentRequired(required);
        dto.setMinPrepaymentAmount(minAmount != null ? minAmount : BigDecimal.ZERO);
        dto.setAllowPartialPrepayment(allowPartial);

        dto.setLastUpdated(LocalDateTime.now());
    }

    /**
     * Створює порожній DTO з базовими налаштуваннями.
     */
    private OrderPaymentDTO createEmptyDTO(UUID orderId) {
        PaymentCalculationRequest defaultRequest = createDefaultPaymentRequest(orderId);

        return OrderPaymentDTO.builder()
                .orderId(orderId)
                .paymentRequest(defaultRequest)
                .paymentMethod(PaymentMethod.CASH) // За замовчуванням готівка
                .minPrepaymentAmount(BigDecimal.ZERO)
                .allowPartialPrepayment(true)
                .prepaymentRequired(false)
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    /**
     * Створює базовий PaymentCalculationRequest.
     */
    private PaymentCalculationRequest createDefaultPaymentRequest(UUID orderId) {
        return createDefaultPaymentRequest(orderId, PaymentMethod.CASH);
    }

    /**
     * Створює PaymentCalculationRequest з вказаним способом оплати.
     */
    private PaymentCalculationRequest createDefaultPaymentRequest(UUID orderId, PaymentMethod paymentMethod) {
        return PaymentCalculationRequest.builder()
                .orderId(orderId)
                .paymentMethod(paymentMethod != null ? paymentMethod : PaymentMethod.CASH)
                .prepaymentAmount(BigDecimal.ZERO)
                .build();
    }

    /**
     * Перевіряє чи потрібно оновити розрахунки.
     */
    public boolean needsRecalculation(OrderPaymentDTO dto) {
        if (dto == null) {
            return false;
        }

        return dto.needsRecalculation();
    }

    /**
     * Розраховує відсоток передоплати.
     */
    public BigDecimal calculatePrepaymentPercentage(BigDecimal prepaymentAmount, BigDecimal finalAmount) {
        if (prepaymentAmount == null || finalAmount == null ||
            finalAmount.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        return prepaymentAmount
                .multiply(BigDecimal.valueOf(100))
                .divide(finalAmount, 2, java.math.RoundingMode.HALF_UP);
    }

    /**
     * Розраховує суму передоплати з відсотка.
     */
    public BigDecimal calculatePrepaymentFromPercentage(BigDecimal percentage, BigDecimal finalAmount) {
        if (percentage == null || finalAmount == null ||
            percentage.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        return finalAmount
                .multiply(percentage)
                .divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
    }
}
