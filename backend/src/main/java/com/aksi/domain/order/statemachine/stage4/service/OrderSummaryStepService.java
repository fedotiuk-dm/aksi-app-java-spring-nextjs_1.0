package com.aksi.domain.order.statemachine.stage4.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.service.OrderService;
import com.aksi.domain.order.statemachine.service.OrderWizardPersistenceService;
import com.aksi.domain.order.statemachine.stage4.dto.OrderSummaryDTO;
import com.aksi.domain.order.statemachine.stage4.mapper.OrderSummaryMapper;
import com.aksi.domain.order.statemachine.stage4.validator.OrderSummaryValidator;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Сервіс для управління підетапом 4.1 "Перегляд замовлення з детальним розрахунком".
 *
 * Відповідає за:
 * - Завантаження повного підсумку замовлення з OrderService
 * - Формування детального розрахунку вартості
 * - Валідацію даних перед переходом до наступного кроку
 * - Збереження стану через OrderWizardPersistenceService
 */
@Service
public class OrderSummaryStepService {

    private static final Logger logger = LoggerFactory.getLogger(OrderSummaryStepService.class);

    // Ключі для wizard persistence
    private static final String ORDER_SUMMARY_KEY = "orderSummary";

    // Stage та step номери для persistence
    private static final int STAGE_NUMBER = 4;
    private static final int STEP_NUMBER = 1;

    private final OrderWizardPersistenceService persistenceService;
    private final OrderService orderService;
    private final OrderSummaryValidator validator;
    private final OrderSummaryMapper mapper;
    private final ObjectMapper objectMapper;

    public OrderSummaryStepService(
            OrderWizardPersistenceService persistenceService,
            OrderService orderService,
            OrderSummaryValidator validator,
            OrderSummaryMapper mapper,
            ObjectMapper objectMapper) {
        this.persistenceService = persistenceService;
        this.orderService = orderService;
        this.validator = validator;
        this.mapper = mapper;
        this.objectMapper = objectMapper;
    }

    /**
     * Завантажує дані підетапу 4.1 "Перегляд замовлення з детальним розрахунком".
     */
    public OrderSummaryDTO loadOrderSummary(String wizardId) {
        logger.debug("Завантаження підсумку замовлення для wizard: {}", wizardId);

        try {
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            OrderSummaryDTO dto = loadSavedOrderSummary(wizardData);

            if (dto == null) {
                dto = createFromWizardData(wizardData);
            }

            if (dto == null) {
                dto = createDefaultOrderSummary();
            }

            // Оновлюємо розрахунки з актуальних даних
            updateCalculationsFromCurrentData(dto, wizardData);

            return dto;

        } catch (Exception e) {
            logger.error("Помилка завантаження підсумку замовлення для wizard {}: {}", wizardId, e.getMessage(), e);
            return createErrorOrderSummary("Помилка завантаження даних: " + e.getMessage());
        }
    }

    /**
     * Зберігає підсумок замовлення з позначкою про перегляд.
     */
    public OrderSummaryDTO saveOrderSummary(String wizardId, OrderSummaryDTO orderSummary) {
        logger.debug("Збереження підсумку замовлення для wizard: {}", wizardId);

        try {
            List<String> validationErrors = validator.validate(orderSummary);
            if (!validationErrors.isEmpty()) {
                orderSummary.clearErrors();
                validationErrors.forEach(orderSummary::addError);
                return orderSummary;
            }

            // Позначаємо як переглянуто
            orderSummary.setIsReviewed(true);

            // Оновлюємо timestamp
            orderSummary.updateTimestamp();

            // Зберігаємо дані
            persistenceService.saveWizardData(wizardId, ORDER_SUMMARY_KEY, orderSummary, STAGE_NUMBER, STEP_NUMBER);

            orderSummary.clearErrors();

            logger.info("Підсумок замовлення збережено для wizard: {}", wizardId);
            return orderSummary;

        } catch (Exception e) {
            logger.error("Помилка збереження підсумку замовлення для wizard {}: {}", wizardId, e.getMessage(), e);
            orderSummary.setError("Помилка збереження: " + e.getMessage());
            return orderSummary;
        }
    }

    /**
     * Перерахунок підсумку замовлення з актуальних даних.
     */
    public OrderSummaryDTO recalculateOrderSummary(String wizardId) {
        logger.debug("Перерахунок підсумку замовлення для wizard: {}", wizardId);

        try {
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            OrderSummaryDTO dto = createFromWizardData(wizardData);

            if (dto == null) {
                dto = createDefaultOrderSummary();
                dto.setError("Немає даних для перерахунку");
                return dto;
            }

            // Позначаємо як ще не переглянуто після перерахунку
            dto.setIsReviewed(false);

            return saveOrderSummary(wizardId, dto);

        } catch (Exception e) {
            logger.error("Помилка перерахунку підсумку замовлення для wizard {}: {}", wizardId, e.getMessage(), e);
            return createErrorOrderSummary("Помилка перерахунку: " + e.getMessage());
        }
    }

    /**
     * Перевіряє чи можна перейти до наступного кроку.
     */
    public boolean canProceedToNextStep(String wizardId) {
        try {
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            OrderSummaryDTO dto = loadSavedOrderSummary(wizardData);

            return dto != null && validator.canProceedToNext(dto);
        } catch (Exception e) {
            logger.error("Помилка перевірки готовності для wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    // Приватні методи helper

    private OrderSummaryDTO loadSavedOrderSummary(Map<String, Object> wizardData) {
        try {
            Object data = wizardData.get(ORDER_SUMMARY_KEY);
            if (data == null) return null;

            if (data instanceof OrderSummaryDTO) {
                return (OrderSummaryDTO) data;
            } else {
                return objectMapper.convertValue(data, OrderSummaryDTO.class);
            }
        } catch (Exception e) {
            logger.error("Помилка завантаження збереженого підсумку замовлення: {}", e.getMessage(), e);
            return null;
        }
    }

    private OrderSummaryDTO createFromWizardData(Map<String, Object> wizardData) {
        try {
            // Отримуємо дані з попередніх етапів wizard'а
            OrderDTO currentOrder = extractOrderFromWizardData(wizardData);
            if (currentOrder == null) {
                logger.warn("Не знайдено дані замовлення в wizard data");
                return null;
            }

            // Конвертуємо OrderDTO в OrderSummaryDTO через mapper
            return mapper.fromOrderDTO(currentOrder);

        } catch (Exception e) {
            logger.error("Помилка створення підсумку з wizard data: {}", e.getMessage(), e);
            return null;
        }
    }

    private void updateCalculationsFromCurrentData(OrderSummaryDTO dto, Map<String, Object> wizardData) {
        try {
            // Оновлюємо розрахунки з останніх даних з попередніх етапів
            OrderDTO currentOrder = extractOrderFromWizardData(wizardData);
            if (currentOrder != null) {
                mapper.updateWithCurrentOrder(dto, currentOrder);
            }

            // Перевіряємо актуальність розрахунків
            validateCalculations(dto);

        } catch (Exception e) {
            logger.error("Помилка оновлення розрахунків: {}", e.getMessage(), e);
            dto.addError("Помилка оновлення розрахунків: " + e.getMessage());
        }
    }

    private OrderDTO extractOrderFromWizardData(Map<String, Object> wizardData) {
        try {
            // Перевіряємо чи є finalizedOrder в wizard data
            Object finalizedOrderValue = wizardData.get("finalizedOrder");
            if (finalizedOrderValue instanceof Map<?, ?>) {
                // Конвертуємо Map в OrderDTO
                return objectMapper.convertValue(finalizedOrderValue, OrderDTO.class);
            }

            // Якщо немає finalizedOrder, збираємо дані з окремих етапів
            return buildOrderDTOFromStages(wizardData);

        } catch (Exception e) {
            logger.error("Помилка витягування OrderDTO з wizard data: {}", e.getMessage(), e);
            return null;
        }
    }

    private OrderDTO buildOrderDTOFromStages(Map<String, Object> wizardData) {
        try {
            OrderDTO.OrderDTOBuilder builder = OrderDTO.builder();

            // Етап 1: Базова інформація та клієнт
            extractStage1Data(wizardData, builder);

            // Етап 2: Предмети замовлення
            extractStage2Data(wizardData, builder);

            // Етап 3: Параметри виконання, знижки, оплата
            extractStage3Data(wizardData, builder);

            return builder.build();

        } catch (Exception e) {
            logger.error("Помилка збирання OrderDTO з етапів wizard'а: {}", e.getMessage(), e);
            return null;
        }
    }

    private void extractStage1Data(Map<String, Object> wizardData, OrderDTO.OrderDTOBuilder builder) {
        // Номер квитанції
        Object receiptNumber = wizardData.get("finalReceiptNumber");
        if (receiptNumber instanceof String) {
            builder.receiptNumber((String) receiptNumber);
        }

        // Унікальна мітка
        Object uniqueTag = wizardData.get("finalUniqueTag");
        if (uniqueTag instanceof String) {
            builder.tagNumber((String) uniqueTag);
        }

        // Філія
        Object branchData = wizardData.get("finalBranch");
        if (branchData instanceof Map<?, ?>) {
            try {
                BranchLocationDTO branch = objectMapper.convertValue(branchData, BranchLocationDTO.class);
                builder.branchLocation(branch);
                builder.branchLocationId(branch.getId());
            } catch (Exception e) {
                logger.warn("Не вдалося конвертувати дані філії: {}", e.getMessage());
            }
        }

        // Клієнт
        Object clientData = wizardData.get("finalSelectedClient");
        if (clientData instanceof Map<?, ?>) {
            try {
                ClientResponse client = objectMapper.convertValue(clientData, ClientResponse.class);
                builder.client(client);
                builder.clientId(client.getId());
            } catch (Exception e) {
                logger.warn("Не вдалося конвертувати дані клієнта: {}", e.getMessage());
            }
        }

        // Дата створення
        Object creationTime = wizardData.get("finalOrderCreationTime");
        if (creationTime instanceof LocalDateTime) {
            builder.createdDate((LocalDateTime) creationTime);
        }
    }

    private void extractStage2Data(Map<String, Object> wizardData, OrderDTO.OrderDTOBuilder builder) {
        // Предмети замовлення
        Object itemsData = wizardData.get("items");
        if (itemsData instanceof List<?> itemsList) {
            try {
                List<OrderItemDTO> orderItems = itemsList.stream()
                    .filter(Map.class::isInstance)
                    .map(item -> objectMapper.convertValue(item, OrderItemDTO.class))
                    .toList();
                builder.items(orderItems);

                // Розраховуємо загальну суму
                BigDecimal totalAmount = orderItems.stream()
                    .map(OrderItemDTO::getTotalPrice)
                    .filter(price -> price != null)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                builder.totalAmount(totalAmount);

            } catch (Exception e) {
                logger.warn("Не вдалося конвертувати дані предметів замовлення: {}", e.getMessage());
            }
        }
    }

    private void extractStage3Data(Map<String, Object> wizardData, OrderDTO.OrderDTOBuilder builder) {
        // Параметри виконання
        Object executionParamsData = wizardData.get("executionParameters");
        if (executionParamsData instanceof Map<?, ?> execParams) {
            Object expediteTypeValue = execParams.get("expediteType");
            if (expediteTypeValue instanceof String expediteTypeStr) {
                try {
                    ExpediteType expediteType = ExpediteType.valueOf(expediteTypeStr);
                    builder.expediteType(expediteType);
                    builder.express(!expediteType.equals(ExpediteType.STANDARD));
                } catch (IllegalArgumentException e) {
                    logger.warn("Невідомий тип терміновості: {}", expediteTypeStr);
                }
            }

            Object completionDateValue = execParams.get("expectedCompletionDate");
            if (completionDateValue instanceof LocalDateTime completionDate) {
                builder.expectedCompletionDate(completionDate);
            }
        }

        // Знижки
        Object discountData = wizardData.get("orderDiscount");
        if (discountData instanceof Map<?, ?> discountParams) {
            Object discountAmountValue = discountParams.get("discountAmount");
            if (discountAmountValue instanceof BigDecimal discountAmount) {
                builder.discountAmount(discountAmount);
            }
        }

        // Оплата
        Object paymentData = wizardData.get("orderPayment");
        if (paymentData instanceof Map<?, ?> paymentParams) {
            Object prepaymentValue = paymentParams.get("prepaymentAmount");
            if (prepaymentValue instanceof BigDecimal prepayment) {
                builder.prepaymentAmount(prepayment);
            }

                        Object finalAmountValue = paymentParams.get("finalAmount");
            if (finalAmountValue instanceof BigDecimal finalAmount) {
                builder.finalAmount(finalAmount);
            }
        }
    }

    private void validateCalculations(OrderSummaryDTO dto) {
        try {
            // Перевіряємо правильність розрахунків
            if (dto.getItems() != null && !dto.getItems().isEmpty()) {

                // Перевіряємо subtotal
                BigDecimal calculatedSubtotal = dto.getItems().stream()
                        .map(item -> item.getTotalPrice())
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                if (dto.getSubtotalAmount() != null &&
                    dto.getSubtotalAmount().compareTo(calculatedSubtotal) != 0) {
                    dto.addError("Невідповідність у розрахунку загальної суми предметів");
                }

                // Перевіряємо final amount
                BigDecimal expectedFinal = calculatedSubtotal;
                if (dto.getDiscountAmount() != null) {
                    expectedFinal = expectedFinal.subtract(dto.getDiscountAmount());
                }
                if (dto.getExpediteAmount() != null) {
                    expectedFinal = expectedFinal.add(dto.getExpediteAmount());
                }

                if (dto.getFinalAmount() != null &&
                    dto.getFinalAmount().compareTo(expectedFinal) != 0) {
                    dto.addError("Невідповідність у розрахунку фінальної суми");
                }
            }

        } catch (Exception e) {
            logger.error("Помилка валідації розрахунків: {}", e.getMessage(), e);
            dto.addError("Помилка валідації розрахунків");
        }
    }

    private OrderSummaryDTO createDefaultOrderSummary() {
        return OrderSummaryDTO.builder()
                .isLoading(false)
                .hasErrors(false)
                .isReviewed(false)
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    private OrderSummaryDTO createErrorOrderSummary(String errorMessage) {
        return OrderSummaryDTO.builder()
                .hasErrors(true)
                .errorMessage(errorMessage)
                .isLoading(false)
                .isReviewed(false)
                .lastUpdated(LocalDateTime.now())
                .build();
    }
}
