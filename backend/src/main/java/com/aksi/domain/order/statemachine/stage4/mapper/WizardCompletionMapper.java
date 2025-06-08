package com.aksi.domain.order.statemachine.stage4.mapper;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.statemachine.stage4.dto.WizardCompletionDTO;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Mapper для створення WizardCompletionDTO з wizard data.
 */
@Component
public class WizardCompletionMapper {

    private static final Logger logger = LoggerFactory.getLogger(WizardCompletionMapper.class);

    private final ObjectMapper objectMapper;

    public WizardCompletionMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * Створює WizardCompletionDTO з wizard data.
     */
    public WizardCompletionDTO createFromWizardData(Map<String, Object> wizardData) {
        try {
            WizardCompletionDTO.WizardCompletionDTOBuilder builder = WizardCompletionDTO.builder();

            // Базова інформація про замовлення
            extractBasicOrderInfo(wizardData, builder);

            // Інформація про клієнта
            extractClientInfo(wizardData, builder);

            // Фінансова інформація
            extractFinancialInfo(wizardData, builder);

            // Параметри виконання
            extractExecutionParams(wizardData, builder);

            // Додаткова інформація
            extractAdditionalInfo(wizardData, builder);

            return builder.build();

        } catch (Exception e) {
            logger.error("Помилка створення WizardCompletionDTO з wizard data: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Витягує CreateOrderRequest з wizard data для створення замовлення.
     */
    public com.aksi.domain.order.dto.CreateOrderRequest extractCreateOrderRequestFromWizardData(Map<String, Object> wizardData) {
        try {
            // Створюємо builder для CreateOrderRequest
            com.aksi.domain.order.dto.CreateOrderRequest.CreateOrderRequestBuilder builder =
                com.aksi.domain.order.dto.CreateOrderRequest.builder();

            // Базова інформація
            Object uniqueTag = wizardData.get("finalUniqueTag");
            if (uniqueTag instanceof String) {
                builder.tagNumber((String) uniqueTag);
            }

            // Клієнт
            Object clientData = wizardData.get("finalSelectedClient");
            if (clientData instanceof Map<?, ?> clientMap) {
                Object clientId = clientMap.get("id");
                if (clientId instanceof String) {
                    builder.clientId(java.util.UUID.fromString((String) clientId));
                }
            }

            // Філія
            Object branchData = wizardData.get("finalBranch");
            if (branchData instanceof Map<?, ?> branchMap) {
                Object branchId = branchMap.get("id");
                if (branchId instanceof String) {
                    builder.branchLocationId(java.util.UUID.fromString((String) branchId));
                }
            }

            // Предмети
            Object itemsData = wizardData.get("items");
            if (itemsData instanceof List<?> itemsList) {
                try {
                    List<com.aksi.domain.order.dto.OrderItemDTO> orderItems = itemsList.stream()
                            .filter(Map.class::isInstance)
                            .map(item -> objectMapper.convertValue(item, com.aksi.domain.order.dto.OrderItemDTO.class))
                            .toList();
                    builder.items(orderItems);
                } catch (Exception e) {
                    logger.warn("Не вдалося конвертувати предмети для CreateOrderRequest: {}", e.getMessage());
                }
            }

            // Параметри виконання
            Object executionParamsData = wizardData.get("executionParameters");
            if (executionParamsData instanceof Map<?, ?> execParams) {
                Object expediteTypeValue = execParams.get("expediteType");
                if (expediteTypeValue instanceof String expediteTypeStr) {
                    try {
                        com.aksi.domain.order.model.ExpediteType expediteType =
                            com.aksi.domain.order.model.ExpediteType.valueOf(expediteTypeStr);
                        builder.expediteType(expediteType);
                    } catch (IllegalArgumentException e) {
                        logger.warn("Невідомий тип терміновості: {}", expediteTypeStr);
                    }
                }

                Object completionDate = execParams.get("expectedCompletionDate");
                if (completionDate != null) {
                    try {
                        builder.expectedCompletionDate(objectMapper.convertValue(completionDate, java.time.LocalDateTime.class));
                    } catch (Exception e) {
                        logger.warn("Не вдалося конвертувати дату завершення: {}", e.getMessage());
                    }
                }
            }

            // Фінансова інформація
            Object paymentData = wizardData.get("orderPayment");
            if (paymentData instanceof Map<?, ?> paymentParams) {
                Object prepaymentValue = paymentParams.get("prepaymentAmount");
                if (prepaymentValue instanceof Number) {
                    builder.prepaymentAmount(java.math.BigDecimal.valueOf(((Number) prepaymentValue).doubleValue()));
                }

                Object discountValue = paymentParams.get("discountAmount");
                if (discountValue instanceof Number) {
                    builder.discountAmount(java.math.BigDecimal.valueOf(((Number) discountValue).doubleValue()));
                }
            }

            // Примітки
            Object customerNotes = wizardData.get("customerNotes");
            if (customerNotes instanceof String) {
                builder.customerNotes((String) customerNotes);
            }

            Object internalNotes = wizardData.get("internalNotes");
            if (internalNotes instanceof String) {
                builder.internalNotes((String) internalNotes);
            }

            // Не чернетка, а реальне замовлення
            builder.draft(false);

            return builder.build();

        } catch (Exception e) {
            logger.error("Помилка витягування CreateOrderRequest: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Витягує OrderDTO з wizard data (аналогічно до ReceiptGenerationMapper).
     */
    public OrderDTO extractOrderDTOFromWizardData(Map<String, Object> wizardData) {
        try {
            // Спробуємо отримати finalizedOrder
            Object finalizedOrderValue = wizardData.get("finalizedOrder");
            if (finalizedOrderValue instanceof Map<?, ?>) {
                return objectMapper.convertValue(finalizedOrderValue, OrderDTO.class);
            }

            // Якщо немає finalizedOrder, збираємо з окремих етапів
            return buildOrderDTOFromStages(wizardData);

        } catch (Exception e) {
            logger.error("Помилка витягування OrderDTO: {}", e.getMessage(), e);
            return null;
        }
    }

    private void extractBasicOrderInfo(Map<String, Object> wizardData, WizardCompletionDTO.WizardCompletionDTOBuilder builder) {
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

        // Дата створення
        Object createdDate = wizardData.get("orderCreatedDate");
        if (createdDate != null) {
            try {
                builder.orderCreatedDate(objectMapper.convertValue(createdDate, java.time.LocalDateTime.class));
            } catch (Exception e) {
                logger.warn("Не вдалося конвертувати дату створення: {}", e.getMessage());
            }
        }
    }

    private void extractClientInfo(Map<String, Object> wizardData, WizardCompletionDTO.WizardCompletionDTOBuilder builder) {
        Object clientData = wizardData.get("finalSelectedClient");
        if (clientData instanceof Map<?, ?>) {
            try {
                ClientResponse client = objectMapper.convertValue(clientData, ClientResponse.class);

                // Формуємо повне ім'я
                String fullName = formatClientName(client.getFirstName(), client.getLastName());
                builder.clientName(fullName);
                builder.clientPhone(client.getPhone());

            } catch (Exception e) {
                logger.warn("Не вдалося конвертувати дані клієнта: {}", e.getMessage());
            }
        }
    }

    private void extractFinancialInfo(Map<String, Object> wizardData, WizardCompletionDTO.WizardCompletionDTOBuilder builder) {
        // З етапу оплати
        Object paymentData = wizardData.get("orderPayment");
        if (paymentData instanceof Map<?, ?> paymentParams) {
            Object finalAmountValue = paymentParams.get("finalAmount");
            if (finalAmountValue instanceof Number) {
                builder.finalAmount(((Number) finalAmountValue).doubleValue());
            }

            Object prepaymentValue = paymentParams.get("prepaymentAmount");
            if (prepaymentValue instanceof Number) {
                builder.prepaymentAmount(((Number) prepaymentValue).doubleValue());
            }

            Object balanceValue = paymentParams.get("balanceAmount");
            if (balanceValue instanceof Number) {
                builder.balanceAmount(((Number) balanceValue).doubleValue());
            }
        }
    }

    private void extractExecutionParams(Map<String, Object> wizardData, WizardCompletionDTO.WizardCompletionDTOBuilder builder) {
        Object executionParamsData = wizardData.get("executionParameters");
        if (executionParamsData instanceof Map<?, ?> execParams) {
            // Тип терміновості
            Object expediteTypeValue = execParams.get("expediteType");
            if (expediteTypeValue instanceof String expediteTypeStr) {
                try {
                    ExpediteType expediteType = ExpediteType.valueOf(expediteTypeStr);
                    builder.expediteType(expediteType);
                } catch (IllegalArgumentException e) {
                    logger.warn("Невідомий тип терміновості: {}", expediteTypeStr);
                }
            }

            // Дата завершення
            Object completionDate = execParams.get("expectedCompletionDate");
            if (completionDate != null) {
                try {
                    builder.expectedCompletionDate(objectMapper.convertValue(completionDate, java.time.LocalDateTime.class));
                } catch (Exception e) {
                    logger.warn("Не вдалося конвертувати дату завершення: {}", e.getMessage());
                }
            }
        }
    }

    private void extractAdditionalInfo(Map<String, Object> wizardData, WizardCompletionDTO.WizardCompletionDTOBuilder builder) {
        // Інформація про філію
        Object branchData = wizardData.get("finalBranch");
        if (branchData instanceof Map<?, ?> branch) {
            Object branchName = branch.get("name");
            if (branchName instanceof String) {
                builder.branchName((String) branchName);
            }
        }

        // Кількість предметів
        Object itemsData = wizardData.get("items");
        if (itemsData instanceof List<?> items) {
            builder.totalItemsCount(items.size());
        }

        // Оператор (якщо є в контексті)
        Object operatorData = wizardData.get("operatorInfo");
        if (operatorData instanceof Map<?, ?> operator) {
            Object operatorName = operator.get("name");
            if (operatorName instanceof String) {
                builder.operatorName((String) operatorName);
            }
        }
    }

    private OrderDTO buildOrderDTOFromStages(Map<String, Object> wizardData) {
        try {
            OrderDTO.OrderDTOBuilder builder = OrderDTO.builder();

            // Базова інформація
            Object receiptNumber = wizardData.get("finalReceiptNumber");
            if (receiptNumber instanceof String) {
                builder.receiptNumber((String) receiptNumber);
            }

            Object uniqueTag = wizardData.get("finalUniqueTag");
            if (uniqueTag instanceof String) {
                builder.tagNumber((String) uniqueTag);
            }

            // Клієнт
            Object clientData = wizardData.get("finalSelectedClient");
            if (clientData instanceof Map<?, ?>) {
                try {
                    ClientResponse client = objectMapper.convertValue(clientData, ClientResponse.class);
                    builder.client(client);
                } catch (Exception e) {
                    logger.warn("Не вдалося конвертувати дані клієнта для OrderDTO: {}", e.getMessage());
                }
            }

            // Предмети
            Object itemsData = wizardData.get("items");
            if (itemsData instanceof List<?> itemsList) {
                try {
                    List<com.aksi.domain.order.dto.OrderItemDTO> orderItems = itemsList.stream()
                            .filter(Map.class::isInstance)
                            .map(item -> objectMapper.convertValue(item, com.aksi.domain.order.dto.OrderItemDTO.class))
                            .toList();
                    builder.items(orderItems);
                } catch (Exception e) {
                    logger.warn("Не вдалося конвертувати предмети для OrderDTO: {}", e.getMessage());
                }
            }

            // Фінансова інформація
            Object paymentData = wizardData.get("orderPayment");
            if (paymentData instanceof Map<?, ?> paymentParams) {
                Object finalAmountValue = paymentParams.get("finalAmount");
                if (finalAmountValue instanceof Number) {
                    builder.finalAmount(java.math.BigDecimal.valueOf(((Number) finalAmountValue).doubleValue()));
                }
            }

            return builder.build();

        } catch (Exception e) {
            logger.error("Помилка збирання OrderDTO з етапів: {}", e.getMessage(), e);
            return null;
        }
    }

    private String formatClientName(String firstName, String lastName) {
        if (firstName != null && lastName != null) {
            return String.format("%s %s", lastName, firstName);
        } else if (lastName != null) {
            return lastName;
        } else if (firstName != null) {
            return firstName;
        }
        return "Клієнт";
    }
}
