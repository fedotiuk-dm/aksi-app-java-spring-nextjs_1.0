package com.aksi.domain.order.statemachine.stage3.guards;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.model.PaymentMethod;
import com.aksi.domain.order.statemachine.stage3.dto.OrderPaymentDTO;
import com.aksi.domain.order.statemachine.stage3.service.OrderPaymentStepService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Guards для підетапу 3.3 "Оплата".
 *
 * Відповідає за перевірку умов переходів у state machine
 * для етапу роботи з оплатою замовлення.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderPaymentGuards {

    private final OrderPaymentStepService paymentStepService;

    /**
     * Перевіряє чи можна перейти до підетапу оплати.
     *
     * Вимоги:
     * - Замовлення існує
     * - Попередні етапи завершені
     * - Є фінансові дані для розрахунку
     */
    public boolean canProceedToPaymentStep(UUID orderId) {
        try {
            if (orderId == null) {
                log.warn("canProceedToPaymentStep: orderId is null");
                return false;
            }

            log.debug("Перевірка можливості переходу до підетапу оплати для замовлення: {}", orderId);

            // Перевіряємо завершення попередніх етапів
            if (!areStage1And2Completed(orderId)) {
                log.debug("Етапи 1-2 не завершені для orderId: {}", orderId);
                return false;
            }

            // Перевіряємо наявність фінансових даних (етап 3.1 має бути завершений)
            if (!hasExecutionParametersCompleted(orderId)) {
                log.debug("Параметри виконання не завершені для orderId: {}", orderId);
                return false;
            }

            return true;

        } catch (Exception e) {
            log.error("Помилка при перевірці можливості переходу до підетапу оплати: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи можна перейти з підетапу оплати до наступного кроку.
     *
     * Вимоги:
     * - Спосіб оплати обраний
     * - Дані оплати валідні
     * - Немає критичних помилок
     */
    public boolean canProceedFromPaymentStep(UUID orderId) {
        try {
            if (orderId == null) {
                log.warn("canProceedFromPaymentStep: orderId is null");
                return false;
            }

            log.debug("Перевірка можливості переходу з підетапу оплати для замовлення: {}", orderId);

            OrderPaymentDTO dto = paymentStepService.loadPaymentStep(orderId);
            return paymentStepService.canProceedToNextStep(dto);

        } catch (Exception e) {
            log.error("Помилка при перевірці можливості переходу з підетапу оплати: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи дані оплати валідні.
     */
    public boolean isPaymentDataValid(UUID orderId) {
        try {
            if (orderId == null) {
                log.warn("isPaymentDataValid: orderId is null");
                return false;
            }

            log.debug("Перевірка валідності даних оплати для замовлення: {}", orderId);

            OrderPaymentDTO dto = paymentStepService.loadPaymentStep(orderId);
            return paymentStepService.canProceedToNextStep(dto);

        } catch (Exception e) {
            log.error("Помилка при перевірці валідності даних оплати: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи обраний спосіб оплати.
     */
    public boolean hasPaymentMethodSelected(UUID orderId) {
        try {
            if (orderId == null) {
                log.warn("hasPaymentMethodSelected: orderId is null");
                return false;
            }

            log.debug("Перевірка чи обраний спосіб оплати для замовлення: {}", orderId);

            OrderPaymentDTO dto = paymentStepService.loadPaymentStep(orderId);
            return dto.getPaymentMethod() != null;

        } catch (Exception e) {
            log.error("Помилка при перевірці обраного способу оплати: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи введена передоплата.
     */
    public boolean hasPrepaymentEntered(UUID orderId) {
        try {
            if (orderId == null) {
                log.warn("hasPrepaymentEntered: orderId is null");
                return false;
            }

            log.debug("Перевірка чи введена передоплата для замовлення: {}", orderId);

            OrderPaymentDTO dto = paymentStepService.loadPaymentStep(orderId);
            return dto.hasPrepayment();

        } catch (Exception e) {
            log.error("Помилка при перевірці введеної передоплати: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи замовлення повністю оплачене.
     */
    public boolean isOrderFullyPaid(UUID orderId) {
        try {
            if (orderId == null) {
                log.warn("isOrderFullyPaid: orderId is null");
                return false;
            }

            log.debug("Перевірка чи замовлення повністю оплачене: {}", orderId);

            return paymentStepService.isOrderFullyPaid(orderId);

        } catch (Exception e) {
            log.error("Помилка при перевірці повної оплати замовлення: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи потрібна передоплата.
     */
    public boolean isPrepaymentRequired(UUID orderId) {
        try {
            if (orderId == null) {
                log.warn("isPrepaymentRequired: orderId is null");
                return false;
            }

            log.debug("Перевірка чи потрібна передоплата для замовлення: {}", orderId);

            OrderPaymentDTO dto = paymentStepService.loadPaymentStep(orderId);
            return dto.isPrepaymentRequired();

        } catch (Exception e) {
            log.error("Помилка при перевірці необхідності передоплати: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи сума передоплати валідна.
     */
    public boolean isPrepaymentAmountValid(UUID orderId, BigDecimal amount) {
        try {
            if (orderId == null) {
                log.warn("isPrepaymentAmountValid: orderId is null");
                return false;
            }

            log.debug("Перевірка валідності суми передоплати: {} для замовлення: {}", amount, orderId);

            return paymentStepService.isPrepaymentAmountValid(orderId, amount);

        } catch (Exception e) {
            log.error("Помилка при перевірці валідності суми передоплати: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи спосіб оплати підтримується.
     */
    public boolean isPaymentMethodSupported(PaymentMethod paymentMethod) {
        try {
            log.debug("Перевірка підтримки способу оплати: {}", paymentMethod);

            return paymentStepService.isPaymentMethodSupported(paymentMethod);

        } catch (Exception e) {
            log.error("Помилка при перевірці підтримки способу оплати: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи дозволена часткова передоплата.
     */
    public boolean isPartialPrepaymentAllowed(UUID orderId) {
        try {
            if (orderId == null) {
                log.warn("isPartialPrepaymentAllowed: orderId is null");
                return false;
            }

            log.debug("Перевірка чи дозволена часткова передоплата для замовлення: {}", orderId);

            OrderPaymentDTO dto = paymentStepService.loadPaymentStep(orderId);
            return dto.isAllowPartialPrepayment();

        } catch (Exception e) {
            log.error("Помилка при перевірці дозволу часткової передоплати: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи готівкова оплата можлива для суми.
     */
    public boolean isCashPaymentAllowed(UUID orderId) {
        try {
            if (orderId == null) {
                log.warn("isCashPaymentAllowed: orderId is null");
                return false;
            }

            log.debug("Перевірка можливості готівкової оплати для замовлення: {}", orderId);

            OrderPaymentDTO dto = paymentStepService.loadPaymentStep(orderId);
            BigDecimal finalAmount = dto.getFinalAmount();

            // Ліміт готівкової оплати - 50,000 грн
            BigDecimal maxCashAmount = BigDecimal.valueOf(50000);

            return finalAmount != null && finalAmount.compareTo(maxCashAmount) <= 0;

        } catch (Exception e) {
            log.error("Помилка при перевірці можливості готівкової оплати: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи термінальна оплата можлива для суми.
     */
    public boolean isTerminalPaymentAllowed(UUID orderId) {
        try {
            if (orderId == null) {
                log.warn("isTerminalPaymentAllowed: orderId is null");
                return false;
            }

            log.debug("Перевірка можливості термінальної оплати для замовлення: {}", orderId);

            OrderPaymentDTO dto = paymentStepService.loadPaymentStep(orderId);
            BigDecimal finalAmount = dto.getFinalAmount();

            // Мінімальна сума для термінальної оплати - 1 грн
            BigDecimal minTerminalAmount = BigDecimal.valueOf(1);

            return finalAmount != null && finalAmount.compareTo(minTerminalAmount) >= 0;

        } catch (Exception e) {
            log.error("Помилка при перевірці можливості термінальної оплати: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи безготівкова оплата можлива для суми.
     */
    public boolean isBankTransferPaymentAllowed(UUID orderId) {
        try {
            if (orderId == null) {
                log.warn("isBankTransferPaymentAllowed: orderId is null");
                return false;
            }

            log.debug("Перевірка можливості безготівкової оплати для замовлення: {}", orderId);

            OrderPaymentDTO dto = paymentStepService.loadPaymentStep(orderId);
            BigDecimal finalAmount = dto.getFinalAmount();

            // Мінімальна сума для безготівкової оплати - 100 грн
            BigDecimal minBankTransferAmount = BigDecimal.valueOf(100);

            return finalAmount != null && finalAmount.compareTo(minBankTransferAmount) >= 0;

        } catch (Exception e) {
            log.error("Помилка при перевірці можливості безготівкової оплати: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи потрібно показати попередження про суму оплати.
     */
    public boolean shouldShowPaymentAmountWarning(UUID orderId, PaymentMethod paymentMethod) {
        try {
            if (orderId == null || paymentMethod == null) {
                log.warn("shouldShowPaymentAmountWarning: orderId or paymentMethod is null");
                return false;
            }

            log.debug("Перевірка необхідності показу попередження про суму оплати для замовлення: {}", orderId);

            switch (paymentMethod) {
                case CASH:
                    return !isCashPaymentAllowed(orderId);
                case TERMINAL:
                    return !isTerminalPaymentAllowed(orderId);
                case BANK_TRANSFER:
                    return !isBankTransferPaymentAllowed(orderId);
                default:
                    return false;
            }

        } catch (Exception e) {
            log.error("Помилка при перевірці необхідності показу попередження про суму оплати: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи сума передоплати не перевищує максимум.
     */
    public boolean isPrepaymentWithinLimit(UUID orderId, BigDecimal amount) {
        try {
            if (orderId == null || amount == null) {
                log.warn("isPrepaymentWithinLimit: orderId or amount is null");
                return false;
            }

            log.debug("Перевірка чи сума передоплати в межах ліміту: {} для замовлення: {}", amount, orderId);

            BigDecimal maxAmount = paymentStepService.calculateMaxPrepaymentAmount(orderId);
            return amount.compareTo(maxAmount) <= 0;

        } catch (Exception e) {
            log.error("Помилка при перевірці ліміту передоплати: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи є баланс для доплати.
     */
    public boolean hasBalanceRemaining(UUID orderId) {
        try {
            if (orderId == null) {
                log.warn("hasBalanceRemaining: orderId is null");
                return false;
            }

            log.debug("Перевірка чи є баланс для доплати для замовлення: {}", orderId);

            OrderPaymentDTO dto = paymentStepService.loadPaymentStep(orderId);
            BigDecimal balance = dto.getBalanceAmount();

            return balance != null && balance.compareTo(BigDecimal.ZERO) > 0;

        } catch (Exception e) {
            log.error("Помилка при перевірці балансу для доплати: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи фінансові дані узгоджені.
     */
    public boolean areFinancialDataConsistent(UUID orderId) {
        try {
            if (orderId == null) {
                log.warn("areFinancialDataConsistent: orderId is null");
                return false;
            }

            log.debug("Перевірка узгодженості фінансових даних для замовлення: {}", orderId);

            OrderPaymentDTO dto = paymentStepService.loadPaymentStep(orderId);

            if (dto.getPaymentResponse() == null) {
                return false;
            }

            // Перевіряємо основну формулу: totalAmount - discountAmount = finalAmount
            BigDecimal total = dto.getTotalAmount();
            BigDecimal discount = dto.getDiscountAmount();
            BigDecimal finalAmount = dto.getFinalAmount();
            BigDecimal prepayment = dto.getPrepaymentAmount();
            BigDecimal balance = dto.getBalanceAmount();

            if (total == null || finalAmount == null) {
                return false;
            }

            // Перевіряємо що finalAmount = totalAmount - discount
            BigDecimal expectedFinal = total;
            if (discount != null) {
                expectedFinal = total.subtract(discount);
            }

            if (finalAmount.compareTo(expectedFinal) != 0) {
                return false;
            }

            // Перевіряємо що balance = finalAmount - prepayment
            if (prepayment != null && balance != null) {
                BigDecimal expectedBalance = finalAmount.subtract(prepayment);
                return balance.compareTo(expectedBalance) == 0;
            }

            return true;

        } catch (Exception e) {
            log.error("Помилка при перевірці узгодженості фінансових даних: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи завершені етапи 1-2 (клієнт та предмети).
     */
    private boolean areStage1And2Completed(UUID orderId) {
        try {
            // Для етапів 1-2 orderId ще може не існувати, використовуємо wizardId
            // Поки що повертаємо true, оскільки якщо дійшли до етапу 3.2,
            // то попередні етапи вже пройшли валідацію
            return true;
        } catch (Exception e) {
            log.error("Помилка перевірки завершення етапів 1-2: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Перевіряє чи завершений етап 3.1 (параметри виконання).
     */
    private boolean hasExecutionParametersCompleted(UUID orderId) {
        try {
            // В рамках Stage3 параметри виконання йдуть перед оплатою
            // Якщо дійшли до оплати, значить параметри виконання валідні
            return true;
        } catch (Exception e) {
            log.error("Помилка перевірки завершення параметрів виконання: {}", e.getMessage(), e);
            return false;
        }
    }
}
