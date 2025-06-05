package com.aksi.domain.order.statemachine.stage4.mapper;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.dto.receipt.ReceiptBranchInfoDTO;
import com.aksi.domain.order.dto.receipt.ReceiptClientInfoDTO;
import com.aksi.domain.order.dto.receipt.ReceiptDTO;
import com.aksi.domain.order.dto.receipt.ReceiptFinancialInfoDTO;
import com.aksi.domain.order.dto.receipt.ReceiptItemDTO;
import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.model.PaymentMethod;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Mapper для конвертації wizard data в ReceiptDTO.
 */
@Component
public class ReceiptGenerationMapper {

    private static final Logger logger = LoggerFactory.getLogger(ReceiptGenerationMapper.class);

    private final ObjectMapper objectMapper;

    public ReceiptGenerationMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * Створює ReceiptDTO з wizard data.
     */
    public ReceiptDTO createReceiptDTOFromWizardData(Map<String, Object> wizardData) {
        try {
            // Спочатку спробуємо створити OrderDTO з wizard data
            OrderDTO orderDTO = extractOrderDTOFromWizardData(wizardData);

            if (orderDTO != null) {
                return convertOrderDTOToReceiptDTO(orderDTO, wizardData);
            }

            // Якщо OrderDTO не вдалося створити, збираємо ReceiptDTO напряму
            return buildReceiptDTODirectly(wizardData);

        } catch (Exception e) {
            logger.error("Помилка створення ReceiptDTO з wizard data: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Конвертує OrderDTO в ReceiptDTO.
     */
    public ReceiptDTO convertOrderDTOToReceiptDTO(OrderDTO orderDTO, Map<String, Object> wizardData) {
        try {
            ReceiptDTO.ReceiptDTOBuilder builder = ReceiptDTO.builder()
                    .orderId(orderDTO.getId())
                    .receiptNumber(orderDTO.getReceiptNumber())
                    .tagNumber(orderDTO.getTagNumber())
                    .createdDate(orderDTO.getCreatedDate())
                    .expectedCompletionDate(orderDTO.getExpectedCompletionDate())
                    .expediteType(orderDTO.getExpediteType());

            // Конвертуємо інформацію про клієнта
            if (orderDTO.getClient() != null) {
                builder.clientInfo(convertClientToReceiptClientInfo(orderDTO.getClient()));
            }

            // Конвертуємо інформацію про філію
            if (orderDTO.getBranchLocation() != null) {
                builder.branchInfo(convertBranchToReceiptBranchInfo(orderDTO.getBranchLocation()));
            }

            // Конвертуємо предмети
            if (orderDTO.getItems() != null && !orderDTO.getItems().isEmpty()) {
                List<ReceiptItemDTO> receiptItems = orderDTO.getItems().stream()
                        .map(this::convertOrderItemToReceiptItem)
                        .collect(Collectors.toList());
                builder.items(receiptItems);
            }

            // Конвертуємо фінансову інформацію
            ReceiptFinancialInfoDTO financialInfo = ReceiptFinancialInfoDTO.builder()
                    .totalAmount(orderDTO.getTotalAmount())
                    .discountAmount(orderDTO.getDiscountAmount())
                    .finalAmount(orderDTO.getFinalAmount())
                    .prepaymentAmount(orderDTO.getPrepaymentAmount())
                    .balanceAmount(orderDTO.getBalanceAmount())
                    .build();
            builder.financialInfo(financialInfo);

            // Додаткові поля з wizard data
            extractAdditionalFieldsFromWizardData(builder, wizardData);

            return builder.build();

        } catch (Exception e) {
            logger.error("Помилка конвертації OrderDTO в ReceiptDTO: {}", e.getMessage(), e);
            return null;
        }
    }

    private OrderDTO extractOrderDTOFromWizardData(Map<String, Object> wizardData) {
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

    private OrderDTO buildOrderDTOFromStages(Map<String, Object> wizardData) {
        try {
            OrderDTO.OrderDTOBuilder builder = OrderDTO.builder();

            // Stage 1: Базова інформація
            extractStage1DataForReceipt(wizardData, builder);

            // Stage 2: Предмети
            extractStage2DataForReceipt(wizardData, builder);

            // Stage 3: Параметри виконання та фінанси
            extractStage3DataForReceipt(wizardData, builder);

            return builder.build();

        } catch (Exception e) {
            logger.error("Помилка збирання OrderDTO з етапів: {}", e.getMessage(), e);
            return null;
        }
    }

    private ReceiptDTO buildReceiptDTODirectly(Map<String, Object> wizardData) {
        try {
            ReceiptDTO.ReceiptDTOBuilder builder = ReceiptDTO.builder();

            // Базова інформація
            Object receiptNumber = wizardData.get("finalReceiptNumber");
            if (receiptNumber instanceof String) {
                builder.receiptNumber((String) receiptNumber);
            }

            Object uniqueTag = wizardData.get("finalUniqueTag");
            if (uniqueTag instanceof String) {
                builder.tagNumber((String) uniqueTag);
            }

            // Додаткові поля
            extractAdditionalFieldsFromWizardData(builder, wizardData);

            return builder.build();

        } catch (Exception e) {
            logger.error("Помилка прямого збирання ReceiptDTO: {}", e.getMessage(), e);
            return null;
        }
    }

    private void extractStage1DataForReceipt(Map<String, Object> wizardData, OrderDTO.OrderDTOBuilder builder) {
        // Аналогічно до OrderSummaryStepService
        Object receiptNumber = wizardData.get("finalReceiptNumber");
        if (receiptNumber instanceof String) {
            builder.receiptNumber((String) receiptNumber);
        }

        Object uniqueTag = wizardData.get("finalUniqueTag");
        if (uniqueTag instanceof String) {
            builder.tagNumber((String) uniqueTag);
        }

        // Клієнт та філія
        Object clientData = wizardData.get("finalSelectedClient");
        if (clientData instanceof Map<?, ?>) {
            try {
                ClientResponse client = objectMapper.convertValue(clientData, ClientResponse.class);
                builder.client(client);
            } catch (Exception e) {
                logger.warn("Не вдалося конвертувати дані клієнта: {}", e.getMessage());
            }
        }

        Object branchData = wizardData.get("finalBranch");
        if (branchData instanceof Map<?, ?>) {
            try {
                BranchLocationDTO branch = objectMapper.convertValue(branchData, BranchLocationDTO.class);
                builder.branchLocation(branch);
            } catch (Exception e) {
                logger.warn("Не вдалося конвертувати дані філії: {}", e.getMessage());
            }
        }
    }

    private void extractStage2DataForReceipt(Map<String, Object> wizardData, OrderDTO.OrderDTOBuilder builder) {
        Object itemsData = wizardData.get("items");
        if (itemsData instanceof List<?> itemsList) {
            try {
                List<OrderItemDTO> orderItems = itemsList.stream()
                        .filter(Map.class::isInstance)
                        .map(item -> objectMapper.convertValue(item, OrderItemDTO.class))
                        .toList();
                builder.items(orderItems);
            } catch (Exception e) {
                logger.warn("Не вдалося конвертувати предмети: {}", e.getMessage());
            }
        }
    }

    private void extractStage3DataForReceipt(Map<String, Object> wizardData, OrderDTO.OrderDTOBuilder builder) {
        // Параметри виконання
        Object executionParamsData = wizardData.get("executionParameters");
        if (executionParamsData instanceof Map<?, ?> execParams) {
            Object expediteTypeValue = execParams.get("expediteType");
            if (expediteTypeValue instanceof String expediteTypeStr) {
                try {
                    ExpediteType expediteType = ExpediteType.valueOf(expediteTypeStr);
                    builder.expediteType(expediteType);
                } catch (IllegalArgumentException e) {
                    logger.warn("Невідомий тип терміновості: {}", expediteTypeStr);
                }
            }
        }

        // Фінансова інформація
        extractFinancialDataForReceipt(wizardData, builder);
    }

    private void extractFinancialDataForReceipt(Map<String, Object> wizardData, OrderDTO.OrderDTOBuilder builder) {
        // З етапу знижок
        Object discountData = wizardData.get("orderDiscount");
        if (discountData instanceof Map<?, ?> discountParams) {
            Object discountAmountValue = discountParams.get("discountAmount");
            if (discountAmountValue instanceof Number) {
                builder.discountAmount(BigDecimal.valueOf(((Number) discountAmountValue).doubleValue()));
            }
        }

        // З етапу оплати
        Object paymentData = wizardData.get("orderPayment");
        if (paymentData instanceof Map<?, ?> paymentParams) {
            Object finalAmountValue = paymentParams.get("finalAmount");
            if (finalAmountValue instanceof Number) {
                builder.finalAmount(BigDecimal.valueOf(((Number) finalAmountValue).doubleValue()));
            }

            Object prepaymentValue = paymentParams.get("prepaymentAmount");
            if (prepaymentValue instanceof Number) {
                builder.prepaymentAmount(BigDecimal.valueOf(((Number) prepaymentValue).doubleValue()));
            }
        }
    }

    private void extractAdditionalFieldsFromWizardData(ReceiptDTO.ReceiptDTOBuilder builder, Map<String, Object> wizardData) {
        // Юридичні аспекти
        Object legalAspectsData = wizardData.get("legalAspects");
        if (legalAspectsData instanceof Map<?, ?> legalAspects) {
            Object termsAccepted = legalAspects.get("termsAccepted");
            if (termsAccepted instanceof Boolean) {
                builder.termsAccepted((Boolean) termsAccepted);
            }

            Object signatureData = legalAspects.get("signatureData");
            if (signatureData instanceof String) {
                builder.customerSignatureData((String) signatureData);
            }
        }

        // Спосіб оплати
        Object paymentData = wizardData.get("orderPayment");
        if (paymentData instanceof Map<?, ?> paymentParams) {
            Object paymentMethodValue = paymentParams.get("paymentMethod");
            if (paymentMethodValue instanceof String paymentMethodStr) {
                try {
                    PaymentMethod paymentMethod = PaymentMethod.valueOf(paymentMethodStr);
                    builder.paymentMethod(paymentMethod);
                } catch (IllegalArgumentException e) {
                    logger.warn("Невідомий спосіб оплати: {}", paymentMethodStr);
                }
            }
        }

        // Додаткові примітки
        Object additionalInfoData = wizardData.get("orderAdditionalInfo");
        if (additionalInfoData instanceof Map<?, ?> additionalInfo) {
            Object notes = additionalInfo.get("customerNotes");
            if (notes instanceof String) {
                builder.additionalNotes((String) notes);
            }
        }
    }

    private ReceiptClientInfoDTO convertClientToReceiptClientInfo(ClientResponse client) {
        return ReceiptClientInfoDTO.builder()
                .firstName(client.getFirstName())
                .lastName(client.getLastName())
                .phone(client.getPhone())
                .email(client.getEmail())
                .address(client.getAddress())
                .build();
    }

    private ReceiptBranchInfoDTO convertBranchToReceiptBranchInfo(BranchLocationDTO branch) {
        return ReceiptBranchInfoDTO.builder()
                .branchName(branch.getName())
                .address(branch.getAddress())
                .phone(branch.getPhone())
                .build();
    }

    private ReceiptItemDTO convertOrderItemToReceiptItem(OrderItemDTO orderItem) {
        return ReceiptItemDTO.builder()
                .name(orderItem.getName())
                .serviceCategory(orderItem.getCategory())
                .quantity(orderItem.getQuantity() != null ? BigDecimal.valueOf(orderItem.getQuantity()) : BigDecimal.ZERO)
                .unitOfMeasure(orderItem.getUnitOfMeasure())
                .color(orderItem.getColor())
                .material(orderItem.getMaterial())
                .basePrice(orderItem.getUnitPrice())
                .finalPrice(orderItem.getTotalPrice())
                .filler(orderItem.getFillerType())
                .stains(orderItem.getStains() != null ? List.of(orderItem.getStains().split(",\\s*")) : List.of())
                .defects(orderItem.getDefects() != null ? List.of(orderItem.getDefects().split(",\\s*")) : List.of())
                .notes(orderItem.getSpecialInstructions())
                .build();
    }
}
