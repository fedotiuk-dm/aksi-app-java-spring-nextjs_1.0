package com.aksi.domain.order.statemachine.stage3.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.PaymentCalculationRequest;
import com.aksi.domain.order.dto.PaymentCalculationResponse;
import com.aksi.domain.order.model.PaymentMethod;
import com.aksi.domain.order.service.PaymentService;
import com.aksi.domain.order.statemachine.stage3.dto.OrderPaymentDTO;
import com.aksi.domain.order.statemachine.stage3.mapper.OrderPaymentMapper;
import com.aksi.domain.order.statemachine.stage3.validator.OrderPaymentValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для підетапу 3.3 "Оплата".
 *
 * Інтегрується з існуючим PaymentService для розрахунків оплати
 * та забезпечує функціональність wizard persistence.
 *
 * Примітка: У відповідності до архітектури, етап 3 відображається на одному екрані,
 * тому persistence відбувається на рівні всього етапу, а не окремих підетапів.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderPaymentStepService {

    private final OrderPaymentValidator validator;
    private final OrderPaymentMapper mapper;
    private final PaymentService paymentService;

    /**
     * Завантажує дані для підетапу 3.3 "Оплата".
     */
    public OrderPaymentDTO loadPaymentStep(UUID orderId) {
        try {
            log.debug("Завантаження даних для підетапу оплати замовлення: {}", orderId);

            // Створюємо новий DTO
            OrderPaymentDTO dto = mapper.createForNewOrder(orderId);

            // Спробуємо отримати поточні дані оплати з PaymentService
            try {
                PaymentCalculationResponse currentPayment = paymentService.getOrderPayment(orderId);
                if (currentPayment != null) {
                    mapper.updateWithPaymentResponse(dto, currentPayment);
                    log.debug("Завантажено поточні дані оплати для замовлення: {}", orderId);
                }
            } catch (Exception e) {
                log.debug("Поточні дані оплати не знайдені для замовлення: {}", orderId);
            }

            // Валідуємо дані
            List<String> errors = validator.validate(dto);
            dto.setErrors(errors);
            dto.setHasErrors(!errors.isEmpty());

            return dto;

        } catch (Exception e) {
            log.error("Помилка при завантаженні даних оплати для замовлення: {}", orderId, e);
            return mapper.createForNewOrder(orderId);
        }
    }

    /**
     * Розраховує оплату для замовлення.
     */
    public OrderPaymentDTO calculatePayment(OrderPaymentDTO dto) {
        try {
            log.debug("Розрахунок оплати для замовлення: {}", dto.getOrderId());

            // Валідуємо базові дані
            List<String> errors = validator.validate(dto);
            if (!errors.isEmpty()) {
                dto.setErrors(errors);
                dto.setHasErrors(true);
                return dto;
            }

            // Створюємо запит для PaymentService
            PaymentCalculationRequest request = mapper.toPaymentCalculationRequest(dto);
            if (request == null) {
                dto.setHasErrors(true);
                dto.setErrors(List.of("Помилка створення запиту розрахунку оплати"));
                return dto;
            }

            // Розраховуємо оплату через PaymentService
            PaymentCalculationResponse response = paymentService.calculatePayment(request);

            // Оновлюємо DTO з результатом
            mapper.updateWithPaymentResponse(dto, response);

            // Повторна валідація після розрахунку
            errors = validator.validate(dto);
            dto.setErrors(errors);
            dto.setHasErrors(!errors.isEmpty());

            log.info("Оплату розраховано для замовлення: {}", dto.getOrderId());
            return dto;

        } catch (Exception e) {
            log.error("Помилка при розрахунку оплати: {}", e.getMessage(), e);
            dto.setHasErrors(true);
            dto.setErrors(List.of("Помилка розрахунку оплати: " + e.getMessage()));
            return dto;
        }
    }

    /**
     * Застосовує оплату до замовлення.
     */
    public OrderPaymentDTO applyPayment(OrderPaymentDTO dto) {
        try {
            log.debug("Застосування оплати до замовлення: {}", dto.getOrderId());

            // Валідуємо дані перед застосуванням
            List<String> errors = validator.validate(dto);
            if (!errors.isEmpty()) {
                dto.setErrors(errors);
                dto.setHasErrors(true);
                return dto;
            }

            // Створюємо запит для PaymentService
            PaymentCalculationRequest request = mapper.toPaymentCalculationRequest(dto);
            if (request == null) {
                dto.setHasErrors(true);
                dto.setErrors(List.of("Помилка створення запиту застосування оплати"));
                return dto;
            }

            // Застосовуємо оплату через PaymentService
            PaymentCalculationResponse response = paymentService.applyPayment(request);

            // Оновлюємо DTO з результатом
            mapper.updateWithPaymentResponse(dto, response);

            dto.setLastUpdated(LocalDateTime.now());

            log.info("Оплату застосовано до замовлення: {}", dto.getOrderId());
            return dto;

        } catch (Exception e) {
            log.error("Помилка при застосуванні оплати: {}", e.getMessage(), e);
            dto.setHasErrors(true);
            dto.setErrors(List.of("Помилка застосування оплати: " + e.getMessage()));
            return dto;
        }
    }

    /**
     * Оновлює спосіб оплати.
     */
    public OrderPaymentDTO updatePaymentMethod(UUID orderId, PaymentMethod paymentMethod) {
        try {
            log.debug("Оновлення способу оплати для замовлення: {} на: {}", orderId, paymentMethod);

            // Завантажуємо поточний DTO
            OrderPaymentDTO dto = loadPaymentStep(orderId);

            // Оновлюємо спосіб оплати
            mapper.updatePaymentMethod(dto, paymentMethod);

            // Перераховуємо оплату з новим способом
            dto = calculatePayment(dto);

            log.info("Спосіб оплати оновлено для замовлення: {}", orderId);
            return dto;

        } catch (Exception e) {
            log.error("Помилка при оновленні способу оплати: {}", e.getMessage(), e);
            OrderPaymentDTO dto = mapper.createForNewOrder(orderId);
            dto.setHasErrors(true);
            dto.setErrors(List.of("Помилка оновлення способу оплати: " + e.getMessage()));
            return dto;
        }
    }

    /**
     * Оновлює суму передоплати.
     */
    public OrderPaymentDTO updatePrepaymentAmount(UUID orderId, BigDecimal prepaymentAmount) {
        try {
            log.debug("Оновлення суми передоплати для замовлення: {} на: {}", orderId, prepaymentAmount);

            // Завантажуємо поточний DTO
            OrderPaymentDTO dto = loadPaymentStep(orderId);

            // Оновлюємо суму передоплати
            mapper.updatePrepaymentAmount(dto, prepaymentAmount);

            // Перераховуємо оплату з новою сумою
            dto = calculatePayment(dto);

            log.info("Суму передоплати оновлено для замовлення: {}", orderId);
            return dto;

        } catch (Exception e) {
            log.error("Помилка при оновленні суми передоплати: {}", e.getMessage(), e);
            OrderPaymentDTO dto = mapper.createForNewOrder(orderId);
            dto.setHasErrors(true);
            dto.setErrors(List.of("Помилка оновлення суми передоплати: " + e.getMessage()));
            return dto;
        }
    }

    /**
     * Налаштовує правила передоплати.
     */
    public OrderPaymentDTO configurePrepaymentRules(UUID orderId, boolean required,
                                                   BigDecimal minAmount, boolean allowPartial) {
        try {
            log.debug("Налаштування правил передоплати для замовлення: {}", orderId);

            // Завантажуємо поточний DTO
            OrderPaymentDTO dto = loadPaymentStep(orderId);

            // Налаштовуємо правила
            mapper.configurePrepaymentRules(dto, required, minAmount, allowPartial);

            // Перевіряємо валідність після зміни правил
            List<String> errors = validator.validate(dto);
            dto.setErrors(errors);
            dto.setHasErrors(!errors.isEmpty());

            log.info("Правила передоплати налаштовано для замовлення: {}", orderId);
            return dto;

        } catch (Exception e) {
            log.error("Помилка при налаштуванні правил передоплати: {}", e.getMessage(), e);
            OrderPaymentDTO dto = mapper.createForNewOrder(orderId);
            dto.setHasErrors(true);
            dto.setErrors(List.of("Помилка налаштування правил передоплати: " + e.getMessage()));
            return dto;
        }
    }

    /**
     * Перевіряє чи можна перейти до наступного кроку.
     */
    public boolean canProceedToNextStep(OrderPaymentDTO dto) {
        try {
            return validator.canProceedToNext(dto);
        } catch (Exception e) {
            log.error("Помилка при перевірці можливості переходу до наступного кроку: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Розраховує максимальну суму передоплати.
     */
    public BigDecimal calculateMaxPrepaymentAmount(UUID orderId) {
        try {
            OrderPaymentDTO dto = loadPaymentStep(orderId);
            return dto.getFinalAmount();
        } catch (Exception e) {
            log.error("Помилка при розрахунку максимальної суми передоплати: {}", e.getMessage(), e);
            return BigDecimal.ZERO;
        }
    }

    /**
     * Перевіряє валідність суми передоплати.
     */
    public boolean isPrepaymentAmountValid(UUID orderId, BigDecimal amount) {
        try {
            OrderPaymentDTO dto = loadPaymentStep(orderId);
            dto.setPrepaymentAmount(amount);
            return dto.isPrepaymentAmountValid();
        } catch (Exception e) {
            log.error("Помилка при перевірці валідності суми передоплати: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Отримує доступні способи оплати.
     */
    public List<PaymentMethod> getAvailablePaymentMethods() {
        return List.of(
            PaymentMethod.CASH,
            PaymentMethod.TERMINAL,
            PaymentMethod.BANK_TRANSFER
        );
    }

    /**
     * Перевіряє чи спосіб оплати підтримується.
     */
    public boolean isPaymentMethodSupported(PaymentMethod paymentMethod) {
        return getAvailablePaymentMethods().contains(paymentMethod);
    }

    /**
     * Розраховує відсоток передоплати.
     */
    public BigDecimal calculatePrepaymentPercentage(BigDecimal prepaymentAmount, BigDecimal finalAmount) {
        return mapper.calculatePrepaymentPercentage(prepaymentAmount, finalAmount);
    }

    /**
     * Розраховує суму передоплати з відсотка.
     */
    public BigDecimal calculatePrepaymentFromPercentage(BigDecimal percentage, BigDecimal finalAmount) {
        return mapper.calculatePrepaymentFromPercentage(percentage, finalAmount);
    }

    /**
     * Валідує дані оплати.
     */
    public List<String> validatePaymentData(OrderPaymentDTO dto) {
        return validator.validate(dto);
    }

    /**
     * Перевіряє чи замовлення повністю оплачене.
     */
    public boolean isOrderFullyPaid(UUID orderId) {
        try {
            OrderPaymentDTO dto = loadPaymentStep(orderId);
            return dto.isFullyPaid();
        } catch (Exception e) {
            log.error("Помилка при перевірці повної оплати замовлення: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Отримує опис способу оплати.
     */
    public String getPaymentMethodDescription(PaymentMethod paymentMethod) {
        if (paymentMethod == null) {
            return "Не обрано";
        }

        switch (paymentMethod) {
            case TERMINAL:
                return "Термінал (картка)";
            case CASH:
                return "Готівка";
            case BANK_TRANSFER:
                return "На рахунок";
            default:
                return paymentMethod.toString();
        }
    }

    /**
     * Створює звіт про фінансові деталі замовлення.
     */
    public String generateFinancialSummary(OrderPaymentDTO dto) {
        if (dto == null || dto.getPaymentResponse() == null) {
            return "Фінансові дані відсутні";
        }

        PaymentCalculationResponse response = dto.getPaymentResponse();
        StringBuilder summary = new StringBuilder();

        summary.append("Фінансові деталі замовлення:\n");
        summary.append("- Загальна сума: ").append(formatAmount(response.getTotalAmount())).append(" грн\n");

        if (response.getDiscountAmount() != null && response.getDiscountAmount().compareTo(BigDecimal.ZERO) > 0) {
            summary.append("- Знижка: ").append(formatAmount(response.getDiscountAmount())).append(" грн\n");
        }

        summary.append("- До оплати: ").append(formatAmount(response.getFinalAmount())).append(" грн\n");
        summary.append("- Спосіб оплати: ").append(getPaymentMethodDescription(response.getPaymentMethod())).append("\n");

        if (response.getPrepaymentAmount() != null && response.getPrepaymentAmount().compareTo(BigDecimal.ZERO) > 0) {
            summary.append("- Передоплата: ").append(formatAmount(response.getPrepaymentAmount())).append(" грн\n");
            summary.append("- Залишок: ").append(formatAmount(response.getBalanceAmount())).append(" грн\n");
        }

        return summary.toString();
    }

    /**
     * Форматує суму для відображення.
     */
    private String formatAmount(BigDecimal amount) {
        if (amount == null) {
            return "0.00";
        }
        return amount.setScale(2, java.math.RoundingMode.HALF_UP).toString();
    }
}
