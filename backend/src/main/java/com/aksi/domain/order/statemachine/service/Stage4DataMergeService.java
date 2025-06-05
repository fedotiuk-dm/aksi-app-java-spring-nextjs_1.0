package com.aksi.domain.order.statemachine.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.dto.TempOrderItemDTO;
import com.aksi.domain.order.statemachine.stage4.dto.OrderSummaryDTO;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для керування даними етапу 4 Order Wizard (Підтвердження та завершення).
 * Відповідає за підготовку фінального підсумку замовлення та формування квитанції.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class Stage4DataMergeService {

    private static final String ORDER_SUMMARY_KEY = "stage4OrderSummary";
    private static final String TERMS_ACCEPTED_KEY = "stage4TermsAccepted";
    private static final String DIGITAL_SIGNATURE_KEY = "stage4DigitalSignature";
    private static final String RECEIPT_GENERATED_KEY = "stage4ReceiptGenerated";

    private final ObjectMapper objectMapper;

    /**
     * === ПІДЕТАП 4.1: ПІДСУМОК ЗАМОВЛЕННЯ ===
     */

    /**
     * Зберегти підсумок замовлення.
     */
    public void saveOrderSummary(Map<String, Object> contextVariables, OrderSummaryDTO orderSummary) {
        if (orderSummary == null) {
            log.warn("Спроба збереження null підсумку замовлення");
            return;
        }

        contextVariables.put(ORDER_SUMMARY_KEY, orderSummary);

                log.debug("Підсумок замовлення збережено: {} предметів, загальна сума {}",
                 orderSummary.getItemsCount(), orderSummary.getFinalAmount());
    }

    /**
     * Завантажити підсумок замовлення.
     */
    public OrderSummaryDTO loadOrderSummary(Map<String, Object> contextVariables) {
        Object data = contextVariables.get(ORDER_SUMMARY_KEY);
        if (data == null) {
            log.debug("Підсумок замовлення не знайдено в контексті");
            return null;
        }

        try {
            if (data instanceof OrderSummaryDTO orderSummaryData) {
                return orderSummaryData;
            }
            return objectMapper.convertValue(data, OrderSummaryDTO.class);
        } catch (Exception e) {
            log.error("Помилка конвертації підсумку замовлення: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * === ПІДЕТАП 4.2: ЮРИДИЧНІ АСПЕКТИ ===
     */

    /**
     * Зберегти стан прийняття умов.
     */
    public void saveTermsAcceptance(Map<String, Object> contextVariables, Boolean termsAccepted) {
        contextVariables.put(TERMS_ACCEPTED_KEY, termsAccepted);

        log.debug("Стан прийняття умов збережено: {}", termsAccepted);
    }

    /**
     * Завантажити стан прийняття умов.
     */
    public Boolean loadTermsAcceptance(Map<String, Object> contextVariables) {
        Object data = contextVariables.get(TERMS_ACCEPTED_KEY);
        return data instanceof Boolean accepted ? accepted : false;
    }

    /**
     * Зберегти цифровий підпис.
     */
    public void saveDigitalSignature(Map<String, Object> contextVariables, String digitalSignature) {
        contextVariables.put(DIGITAL_SIGNATURE_KEY, digitalSignature);

        log.debug("Цифровий підпис збережено: {} символів",
                 digitalSignature != null ? digitalSignature.length() : 0);
    }

    /**
     * Завантажити цифровий підпис.
     */
    public String loadDigitalSignature(Map<String, Object> contextVariables) {
        Object data = contextVariables.get(DIGITAL_SIGNATURE_KEY);
        return data instanceof String signature ? signature : null;
    }

    /**
     * === ПІДЕТАП 4.3: ФОРМУВАННЯ КВИТАНЦІЇ ===
     */

    /**
     * Зберегти стан генерації квитанції.
     */
    public void saveReceiptGenerated(Map<String, Object> contextVariables, Boolean receiptGenerated) {
        contextVariables.put(RECEIPT_GENERATED_KEY, receiptGenerated);

        log.debug("Стан генерації квитанції збережено: {}", receiptGenerated);
    }

    /**
     * Завантажити стан генерації квитанції.
     */
    public Boolean loadReceiptGenerated(Map<String, Object> contextVariables) {
        Object data = contextVariables.get(RECEIPT_GENERATED_KEY);
        return data instanceof Boolean generated ? generated : false;
    }

    /**
     * === ВАЛІДАЦІЯ ЕТАПУ 4 ===
     */

    /**
     * Перевірити завершеність етапу 4.
     */
    public boolean isStage4Complete(Map<String, Object> contextVariables) {
        OrderSummaryDTO orderSummary = loadOrderSummary(contextVariables);
        Boolean termsAccepted = loadTermsAcceptance(contextVariables);
        String digitalSignature = loadDigitalSignature(contextVariables);
        Boolean receiptGenerated = loadReceiptGenerated(contextVariables);

        boolean complete = orderSummary != null &&
                          termsAccepted != null && termsAccepted &&
                          digitalSignature != null && !digitalSignature.trim().isEmpty() &&
                          receiptGenerated != null && receiptGenerated;

        log.debug("Перевірка завершеності етапу 4: {}", complete);
        return complete;
    }

    /**
     * Валідувати підсумок замовлення.
     */
    public Stage4ValidationResult validateOrderSummary(Map<String, Object> contextVariables) {
        OrderSummaryDTO orderSummary = loadOrderSummary(contextVariables);

        if (orderSummary == null) {
            return new Stage4ValidationResult(false, "Підсумок замовлення не згенеровано", 0);
        }

        if (orderSummary.getItemsCount() <= 0) {
            return new Stage4ValidationResult(false, "Немає предметів в замовленні", 10);
        }

        if (orderSummary.getFinalAmount() == null || orderSummary.getFinalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return new Stage4ValidationResult(false, "Загальна сума замовлення некоректна", 20);
        }

        return new Stage4ValidationResult(true, null, 40);
    }

    /**
     * Валідувати юридичні аспекти.
     */
    public Stage4ValidationResult validateLegalAspects(Map<String, Object> contextVariables) {
        Boolean termsAccepted = loadTermsAcceptance(contextVariables);
        String digitalSignature = loadDigitalSignature(contextVariables);

        if (termsAccepted == null || !termsAccepted) {
            return new Stage4ValidationResult(false, "Умови надання послуг не прийняті", 40);
        }

        if (digitalSignature == null || digitalSignature.trim().isEmpty()) {
            return new Stage4ValidationResult(false, "Цифровий підпис не проставлений", 60);
        }

        return new Stage4ValidationResult(true, null, 80);
    }

    /**
     * Валідувати формування квитанції.
     */
    public Stage4ValidationResult validateReceiptGeneration(Map<String, Object> contextVariables) {
        Boolean receiptGenerated = loadReceiptGenerated(contextVariables);

        if (receiptGenerated == null || !receiptGenerated) {
            return new Stage4ValidationResult(false, "Квитанція не згенерована", 80);
        }

        return new Stage4ValidationResult(true, null, 100);
    }

    /**
     * Загальна валідація етапу 4.
     */
    public Stage4ValidationResult validateStage4(Map<String, Object> contextVariables) {
        // Перевіряємо підсумок замовлення
        Stage4ValidationResult summaryValidation = validateOrderSummary(contextVariables);
        if (!summaryValidation.isValid()) {
            return summaryValidation;
        }

        // Перевіряємо юридичні аспекти
        Stage4ValidationResult legalValidation = validateLegalAspects(contextVariables);
        if (!legalValidation.isValid()) {
            return legalValidation;
        }

        // Перевіряємо генерацію квитанції
        return validateReceiptGeneration(contextVariables);
    }

    /**
     * === ЗЛИВАННЯ ДАНИХ В ЕТАПІ 4 ===
     */

    /**
     * Створити підсумок замовлення на основі даних з попередніх етапів.
     */
    public OrderSummaryDTO createOrderSummary(
            Map<String, Object> contextVariables,
            Stage1DataMergeService stage1Service,
            Stage2DataMergeService stage2Service,
            Stage3DataMergeService stage3Service) {

        try {
            OrderSummaryDTO orderSummary = OrderSummaryDTO.builder().build();

            // Отримуємо дані з етапу 1
            var clientSelection = stage1Service.loadClientSelection(contextVariables);
            var orderInit = stage1Service.loadOrderInitialization(contextVariables);

                        if (clientSelection != null && clientSelection.hasSelectedClient()) {
                orderSummary.setClient(clientSelection.getSelectedClient());
            }

            if (orderInit != null) {
                orderSummary.setReceiptNumber(orderInit.getReceiptNumber());
                orderSummary.setTagNumber(orderInit.getUniqueTag());
                orderSummary.setBranchLocation(orderInit.getSelectedBranch());
            }

            // Отримуємо дані з етапу 2
            var items = stage2Service.loadItems(contextVariables);
            var itemsStats = stage2Service.getItemsStatistics(contextVariables);

            // Встановлюємо кількість предметів та загальну суму
            if (items != null && !items.isEmpty()) {
                log.debug("Завантажено {} предметів з етапу 2", items.size());
                // Конвертуємо TempOrderItemDTO в OrderItemDTO
                List<OrderItemDTO> convertedItems = convertTempItemsToOrderItems(items);
                orderSummary.setItems(convertedItems);
                log.debug("Сконвертовано {} предметів з TempOrderItemDTO в OrderItemDTO", convertedItems.size());
            }
            orderSummary.setSubtotalAmount(itemsStats.totalAmount());

            // Отримуємо дані з етапу 3
            var executionParams = stage3Service.loadExecutionParameters(contextVariables);
            var discount = stage3Service.loadOrderDiscount(contextVariables);
            var payment = stage3Service.loadOrderPayment(contextVariables);

            if (executionParams != null) {
                orderSummary.setExpectedCompletionDate(executionParams.getCompletionDate().atTime(14, 0));
                orderSummary.setExpediteType(executionParams.getExpediteType());
                orderSummary.setExpeditePercentage(executionParams.getExpeditePercentage().intValue());
            }

            if (discount != null) {
                orderSummary.setDiscountType(discount.getDiscountType());
                orderSummary.setDiscountAmount(discount.getDiscountAmount());
                orderSummary.setDiscountPercentage(discount.getDiscountPercentage());
            }

            if (payment != null) {
                orderSummary.setPaymentMethod(payment.getPaymentMethod());
                orderSummary.setFinalAmount(payment.getFinalAmount());
                orderSummary.setPrepaymentAmount(payment.getPrepaymentAmount());
                orderSummary.setBalanceAmount(payment.getBalanceAmount());
            }

            log.debug("Підсумок замовлення створено успішно");
            return orderSummary;

        } catch (Exception e) {
            log.error("Помилка створення підсумку замовлення: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * === ОЧИЩЕННЯ ДАНИХ ===
     */

    /**
     * Очистити всі дані етапу 4.
     */
    public void clearStage4Data(Map<String, Object> contextVariables) {
        contextVariables.remove(ORDER_SUMMARY_KEY);
        contextVariables.remove(TERMS_ACCEPTED_KEY);
        contextVariables.remove(DIGITAL_SIGNATURE_KEY);
        contextVariables.remove(RECEIPT_GENERATED_KEY);

        log.info("Дані етапу 4 очищено");
    }

    /**
     * Очистити тільки підпис (для повторного підписання).
     */
    public void clearDigitalSignature(Map<String, Object> contextVariables) {
        contextVariables.remove(DIGITAL_SIGNATURE_KEY);

        log.info("Цифровий підпис очищено");
    }

    /**
     * === КОНВЕРТАЦІЯ ДАНИХ ===
     */

    /**
     * Конвертує список TempOrderItemDTO в OrderItemDTO.
     */
    private List<OrderItemDTO> convertTempItemsToOrderItems(List<TempOrderItemDTO> tempItems) {
        if (tempItems == null || tempItems.isEmpty()) {
            return List.of();
        }

        return tempItems.stream()
                .filter(tempItem -> tempItem != null && tempItem.isReadyForOrder())
                .map(this::convertTempItemToOrderItem)
                .collect(Collectors.toList());
    }

    /**
     * Конвертує одну TempOrderItemDTO в OrderItemDTO.
     */
    private OrderItemDTO convertTempItemToOrderItem(TempOrderItemDTO tempItem) {
        return OrderItemDTO.builder()
                // Основна інформація
                .name(tempItem.getName())
                .description(tempItem.getDescription())
                .quantity(tempItem.getQuantity())
                .unitPrice(tempItem.getUnitPrice())
                .totalPrice(tempItem.getTotalPrice())

                // Характеристики предмета
                .category(tempItem.getCategory())
                .color(tempItem.getColor())
                .material(tempItem.getMaterial())
                .unitOfMeasure(tempItem.getUnitOfMeasure())

                // Додаткові характеристики
                .fillerType(tempItem.getFillerType())
                .fillerCompressed(tempItem.getFillerCompressed())
                .wearDegree(tempItem.getWearDegree())

                // Забруднення та дефекти
                .stains(tempItem.getStains())
                .otherStains(tempItem.getOtherStains())
                .defects(tempItem.getDefects())
                .defectsAndRisks(tempItem.getDefectsAndRisks())
                .defectsNotes(tempItem.getDefectsNotes())
                .noGuaranteeReason(tempItem.getNoGuaranteeReason())

                // Спеціальні інструкції
                .specialInstructions(tempItem.getSpecialInstructions())
                .build();
    }

    /**
     * === ДОПОМІЖНІ КЛАСИ ===
     */

    /**
     * Результат валідації даних етапу 4.
     */
    public record Stage4ValidationResult(
        boolean isValid,
        String errorMessage,
        int completionPercentage
    ) {}
}
