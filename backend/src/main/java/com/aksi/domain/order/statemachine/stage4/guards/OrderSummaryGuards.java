package com.aksi.domain.order.statemachine.stage4.guards;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage4.dto.OrderSummaryDTO;
import com.aksi.domain.order.statemachine.stage4.service.OrderSummaryStepService;
import com.aksi.domain.order.statemachine.stage4.validator.OrderSummaryValidator;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Guards для підетапу 4.1 "Перегляд замовлення з детальним розрахунком".
 *
 * Відповідає за перевірки переходів між станами state machine
 * для перегляду та підтвердження підсумку замовлення.
 */
@Component
public class OrderSummaryGuards {

    private static final Logger logger = LoggerFactory.getLogger(OrderSummaryGuards.class);

    private static final String WIZARD_ID_KEY = "wizardId";
    private static final String ORDER_SUMMARY_KEY = "orderSummary";

    private final OrderSummaryStepService orderSummaryService;
    private final OrderSummaryValidator validator;
    private final ObjectMapper objectMapper;

    public OrderSummaryGuards(
            OrderSummaryStepService orderSummaryService,
            OrderSummaryValidator validator,
            ObjectMapper objectMapper) {
        this.orderSummaryService = orderSummaryService;
        this.validator = validator;
        this.objectMapper = objectMapper;
    }

    /**
     * Перевіряє чи можна перейти до етапу 4.1 (перегляд замовлення).
     */
    public Guard<OrderState, OrderEvent> canProceedToOrderSummaryStep() {
        return context -> {
            try {
                String wizardId = getWizardId(context);
                if (wizardId == null) {
                    logger.warn("WizardId відсутній для переходу до перегляду замовлення");
                    return false;
                }

                // Перевіряємо чи завершений попередній етап (етап 3 - параметри замовлення)
                boolean previousStageComplete = checkPreviousStageCompletion(context, wizardId);

                if (!previousStageComplete) {
                    logger.debug("Попередній етап не завершений для wizard: {}", wizardId);
                    return false;
                }

                logger.debug("Дозволено перехід до перегляду замовлення для wizard: {}", wizardId);
                return true;

            } catch (Exception e) {
                logger.error("Помилка перевірки переходу до перегляду замовлення: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи можна перейти з етапу 4.1 до наступного етапу.
     */
    public Guard<OrderState, OrderEvent> canProceedFromOrderSummaryStep() {
        return context -> {
            try {
                String wizardId = getWizardId(context);
                if (wizardId == null) {
                    logger.warn("WizardId відсутній для переходу з перегляду замовлення");
                    return false;
                }

                // Перевіряємо через сервіс
                boolean canProceed = orderSummaryService.canProceedToNextStep(wizardId);

                if (!canProceed) {
                    logger.debug("Перегляд замовлення не готовий для переходу, wizard: {}", wizardId);
                    return false;
                }

                logger.debug("Дозволено перехід з перегляду замовлення для wizard: {}", wizardId);
                return true;

            } catch (Exception e) {
                logger.error("Помилка перевірки переходу з перегляду замовлення: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи можна повернутися назад з етапу 4.1.
     */
    public Guard<OrderState, OrderEvent> canGoBackFromOrderSummaryStep() {
        return context -> {
            try {
                String wizardId = getWizardId(context);
                if (wizardId == null) {
                    return false;
                }

                // Дозволяємо повернутися назад для редагування попередніх етапів
                logger.debug("Дозволено повернення назад з перегляду замовлення для wizard: {}", wizardId);
                return true;

            } catch (Exception e) {
                logger.error("Помилка перевірки можливості повернення з перегляду замовлення: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи валідні дані підсумку замовлення.
     */
    public Guard<OrderState, OrderEvent> isOrderSummaryDataValid() {
        return context -> {
            try {
                OrderSummaryDTO dto = getOrderSummaryFromContext(context);
                if (dto == null) {
                    logger.debug("Дані підсумку замовлення відсутні");
                    return false;
                }

                boolean isValid = dto.isValid();

                if (!isValid) {
                    logger.debug("Дані підсумку замовлення невалідні");
                    return false;
                }

                logger.debug("Дані підсумку замовлення валідні");
                return true;

            } catch (Exception e) {
                logger.error("Помилка валідації даних підсумку замовлення: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи переглянуто підсумок замовлення.
     */
    public Guard<OrderState, OrderEvent> isOrderSummaryReviewed() {
        return context -> {
            try {
                OrderSummaryDTO dto = getOrderSummaryFromContext(context);
                if (dto == null) {
                    logger.debug("Дані підсумку замовлення відсутні");
                    return false;
                }

                boolean isReviewed = Boolean.TRUE.equals(dto.getIsReviewed());

                if (!isReviewed) {
                    logger.debug("Підсумок замовлення не переглянуто");
                    return false;
                }

                logger.debug("Підсумок замовлення переглянуто");
                return true;

            } catch (Exception e) {
                logger.error("Помилка перевірки перегляду підсумку замовлення: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи є предмети у замовленні.
     */
    public Guard<OrderState, OrderEvent> hasOrderItems() {
        return context -> {
            try {
                OrderSummaryDTO dto = getOrderSummaryFromContext(context);
                if (dto == null) {
                    return false;
                }

                boolean hasItems = dto.getItems() != null && !dto.getItems().isEmpty();

                if (!hasItems) {
                    logger.debug("Замовлення не містить предметів");
                }

                return hasItems;

            } catch (Exception e) {
                logger.error("Помилка перевірки наявності предметів: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи є клієнт у замовленні.
     */
    public Guard<OrderState, OrderEvent> hasValidClient() {
        return context -> {
            try {
                OrderSummaryDTO dto = getOrderSummaryFromContext(context);
                if (dto == null) {
                    return false;
                }

                boolean hasClient = dto.getClient() != null &&
                                  dto.getClient().getFirstName() != null &&
                                  dto.getClient().getLastName() != null &&
                                  dto.getClient().getPhone() != null;

                if (!hasClient) {
                    logger.debug("Дані клієнта неповні");
                }

                return hasClient;

            } catch (Exception e) {
                logger.error("Помилка перевірки даних клієнта: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи є знижки у замовленні.
     */
    public Guard<OrderState, OrderEvent> hasDiscountApplied() {
        return context -> {
            try {
                OrderSummaryDTO dto = getOrderSummaryFromContext(context);
                if (dto == null) {
                    return false;
                }

                boolean hasDiscount = dto.hasDiscount();
                logger.debug("Знижка застосована: {}", hasDiscount);
                return hasDiscount;

            } catch (Exception e) {
                logger.error("Помилка перевірки знижки: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи є надбавка за терміновість у замовленні.
     */
    public Guard<OrderState, OrderEvent> hasExpediteChargeApplied() {
        return context -> {
            try {
                OrderSummaryDTO dto = getOrderSummaryFromContext(context);
                if (dto == null) {
                    return false;
                }

                boolean hasExpediteCharge = dto.hasExpediteCharge();
                logger.debug("Надбавка за терміновість застосована: {}", hasExpediteCharge);
                return hasExpediteCharge;

            } catch (Exception e) {
                logger.error("Помилка перевірки надбавки за терміновість: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи є борг для сплати.
     */
    public Guard<OrderState, OrderEvent> hasBalanceAmount() {
        return context -> {
            try {
                OrderSummaryDTO dto = getOrderSummaryFromContext(context);
                if (dto == null) {
                    return false;
                }

                boolean hasBalance = dto.hasBalanceAmount();
                logger.debug("Є борг для сплати: {}", hasBalance);
                return hasBalance;

            } catch (Exception e) {
                logger.error("Помилка перевірки балансу: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи завершений етап перегляду замовлення.
     */
    public Guard<OrderState, OrderEvent> isOrderSummaryStepComplete() {
        return context -> {
            try {
                String wizardId = getWizardId(context);
                if (wizardId == null) {
                    return false;
                }

                // Комбінована перевірка: дані валідні та переглянуті
                return orderSummaryService.canProceedToNextStep(wizardId);

            } catch (Exception e) {
                logger.error("Помилка перевірки завершеності етапу перегляду замовлення: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи потрібно показати попередження про ризики.
     */
    public Guard<OrderState, OrderEvent> shouldShowRiskWarning() {
        return context -> {
            try {
                OrderSummaryDTO dto = getOrderSummaryFromContext(context);
                if (dto == null) {
                    return false;
                }

                // Перевіряємо чи є предмети з ризиками або "без гарантій"
                boolean hasRiskyItems = dto.getItems() != null &&
                    dto.getItems().stream().anyMatch(item ->
                        (item.getDefectsAndRisks() != null && !item.getDefectsAndRisks().trim().isEmpty()) ||
                        (item.getNoGuaranteeReason() != null && !item.getNoGuaranteeReason().trim().isEmpty())
                    );

                if (hasRiskyItems) {
                    logger.debug("Знайдено предмети з ризиками - показуємо попередження");
                }

                return hasRiskyItems;

            } catch (Exception e) {
                logger.error("Помилка перевірки ризиків: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    // Приватні helper методи

    private String getWizardId(StateContext<OrderState, OrderEvent> context) {
        return (String) context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
    }

    private OrderSummaryDTO getOrderSummaryFromContext(StateContext<OrderState, OrderEvent> context) {
        try {
            Object data = context.getExtendedState().getVariables().get(ORDER_SUMMARY_KEY);
            if (data == null) {
                return null;
            }

            if (data instanceof OrderSummaryDTO) {
                return (OrderSummaryDTO) data;
            } else {
                return objectMapper.convertValue(data, OrderSummaryDTO.class);
            }
        } catch (Exception e) {
            logger.error("Помилка отримання OrderSummaryDTO з контексту: {}", e.getMessage(), e);
            return null;
        }
    }

    private boolean checkPreviousStageCompletion(StateContext<OrderState, OrderEvent> context, String wizardId) {
        try {
            // TODO: Інтегрувати з реальною логікою перевірки завершеності stage 3
            // TODO: Перевірити чи завершений підетап 3.1 (параметри виконання)
            // TODO: Перевірити чи завершений підетап 3.2 (знижки)
            // TODO: Перевірити чи завершений підетап 3.3 (оплата)
            // TODO: Перевірити чи завершений підетап 3.4 (додаткова інформація)
            // Тут буде логіка перевірки завершеності попереднього етапу (stage 3)
            // Поки що повертаємо true, реальна логіка буде додана при інтеграції з state machine
            return true;

        } catch (Exception e) {
            logger.error("Помилка перевірки завершеності попереднього етапу для wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }
}
