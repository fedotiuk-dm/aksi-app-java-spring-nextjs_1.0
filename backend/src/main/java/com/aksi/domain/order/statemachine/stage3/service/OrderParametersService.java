package com.aksi.domain.order.statemachine.stage3.service;

import java.util.List;
import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Service;

import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Координуючий сервіс для етапу 3 - загальні параметри замовлення.
 *
 * Об'єднує роботу всіх підсервісів етапу 3:
 * - ExecutionParametersStepService (дата виконання, терміновість)
 * - OrderDiscountStepService (знижки)
 * - OrderPaymentStepService (оплата)
 * - OrderAdditionalInfoStepService (додаткова інформація)
 *
 * Інтегровано з реальними сервісами stage3.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderParametersService {

    private final ExecutionParametersStepService executionParametersService;
    private final OrderDiscountStepService discountService;
    private final OrderPaymentStepService paymentService;
    private final OrderAdditionalInfoStepService additionalInfoService;

        /**
     * Завантажує поточні параметри замовлення.
     */
    public void loadOrderParameters(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.info("Завантаження параметрів замовлення для wizard: {}", wizardId);

        try {
            // Завантажуємо параметри виконання
            var executionParams = executionParametersService.loadExecutionParameters(wizardId);
            context.getExtendedState().getVariables().put("executionParameters", executionParams);

            // Завантажуємо інформацію про знижки (потрібен список категорій)
            @SuppressWarnings("unchecked")
            List<String> categories = (List<String>) context.getExtendedState().getVariables().get("orderItemCategories");
            var discountData = discountService.loadDiscountStep(wizardId, categories);
            context.getExtendedState().getVariables().put("discountData", discountData);

            // Завантажуємо дані оплати
            UUID wizardUUID = UUID.fromString(wizardId);
            var paymentData = paymentService.loadPaymentStep(wizardUUID);
            context.getExtendedState().getVariables().put("paymentData", paymentData);

            // Завантажуємо додаткову інформацію
            var additionalInfo = additionalInfoService.loadAdditionalInfoStep(wizardId);
            context.getExtendedState().getVariables().put("additionalInfo", additionalInfo);

        } catch (Exception e) {
            log.error("Помилка завантаження параметрів замовлення для wizard: {}", wizardId, e);
            throw e;
        }
    }

    /**
     * Розраховує автоматичну дату виконання на основі предметів.
     */
    public void calculateEstimatedDeliveryDate(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.info("Розрахунок дати виконання для wizard: {}", wizardId);

        try {
            var executionParams = executionParametersService.loadExecutionParameters(wizardId);
            context.getExtendedState().getVariables().put("executionParameters", executionParams);

        } catch (Exception e) {
            log.error("Помилка розрахунку дати виконання для wizard: {}", wizardId, e);
            context.getExtendedState().getVariables().put("executionParametersError", e.getMessage());
        }
    }

    /**
     * Ініціалізує значення за замовчуванням для всіх підсервісів етапу 3.
     */
    public void initializeDefaultParameters(StateContext<OrderState, OrderEvent> context) {
        log.info("Ініціалізація значень за замовчуванням для етапу 3");

        try {
            String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");

            // Завантажуємо початкові дані для всіх підкроків
            var executionParams = executionParametersService.loadExecutionParameters(wizardId);
            context.getExtendedState().getVariables().put("executionParameters", executionParams);

            var discountData = discountService.loadDiscountStep(wizardId, java.util.Collections.emptyList());
            context.getExtendedState().getVariables().put("discountData", discountData);

            UUID wizardUUID = UUID.fromString(wizardId);
            var paymentData = paymentService.loadPaymentStep(wizardUUID);
            context.getExtendedState().getVariables().put("paymentData", paymentData);

            var additionalInfo = additionalInfoService.loadAdditionalInfoStep(wizardId);
            context.getExtendedState().getVariables().put("additionalInfo", additionalInfo);

            context.getExtendedState().getVariables().put("stage3Initialized", true);

        } catch (Exception e) {
            log.error("Помилка ініціалізації етапу 3: {}", e.getMessage(), e);
            context.getExtendedState().getVariables().put("stage3InitializationError", e.getMessage());
        }
    }

    /**
     * Зберігає параметри виконання (дата та терміновість).
     */
    public void saveExecutionParameters(String wizardId, Object deliveryDateObj, Object expediteTypeObj,
                                      StateContext<OrderState, OrderEvent> context) {
        log.info("Збереження параметрів виконання для wizard: {}", wizardId);

        try {
            // Отримуємо поточні параметри виконання
            var executionParams = executionParametersService.loadExecutionParameters(wizardId);

            // Оновлюємо тип терміновості якщо передано
            if (expediteTypeObj instanceof ExpediteType) {
                var expediteType = (ExpediteType) expediteTypeObj;
                var updatedParams = executionParametersService.updateExpediteType(wizardId, expediteType);
                context.getExtendedState().getVariables().put("executionParameters", updatedParams);
            } else {
                // Просто зберігаємо поточні параметри
                var savedParams = executionParametersService.saveExecutionParameters(wizardId, executionParams);
                context.getExtendedState().getVariables().put("executionParameters", savedParams);
            }

        } catch (Exception e) {
            log.error("Помилка збереження параметрів виконання для wizard: {}", wizardId, e);
            context.getExtendedState().getVariables().put("executionParametersError", e.getMessage());
        }
    }

    /**
     * Перераховує вартість з урахуванням терміновості.
     */
    public void recalculateWithExpediteCharges(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.info("Перерахунок з урахуванням терміновості для wizard: {}", wizardId);

        try {
            // Завантажуємо поточні параметри виконання
            var executionParams = executionParametersService.loadExecutionParameters(wizardId);

            // Якщо є тип терміновості, перерахунок відбувається автоматично в сервісі
            context.getExtendedState().getVariables().put("executionParameters", executionParams);
            context.getExtendedState().getVariables().put("expediteChargesCalculated", true);

        } catch (Exception e) {
            log.error("Помилка перерахунку терміновості для wizard: {}", wizardId, e);
            context.getExtendedState().getVariables().put("expediteChargesError", e.getMessage());
        }
    }

    /**
     * Валідує можливість застосування знижки на основі категорій предметів.
     */
    public boolean validateDiscountEligibility(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.info("Валідація можливості знижки для wizard: {}", wizardId);

        try {
            // Отримуємо категорії з контексту
            @SuppressWarnings("unchecked")
            List<String> categories = (List<String>) context.getExtendedState().getVariables().get("orderItemCategories");

            if (categories == null) {
                categories = java.util.Collections.emptyList();
            }

            // Завантажуємо дані знижки з валідацією категорій
            var discountData = discountService.loadDiscountStep(wizardId, categories);
            context.getExtendedState().getVariables().put("discountData", discountData);

            // Перевіряємо чи можна застосувати знижку
            return discountService.canProceedToNextStep(wizardId);

        } catch (Exception e) {
            log.error("Помилка валідації знижки для wizard: {}", wizardId, e);
            return false;
        }
    }

    /**
     * Застосовує знижку до замовлення через OrderDiscountStepService.
     */
    public void applyDiscount(String wizardId, Object discountTypeObj, Object customDiscountObj,
                            StateContext<OrderState, OrderEvent> context) {
        log.info("Застосування знижки для wizard: {}", wizardId);

        try {
            // Отримуємо дані знижки з контексту
            Object discountDataObj = context.getExtendedState().getVariables().get("discountData");

            if (discountDataObj != null) {
                var discountData = (com.aksi.domain.order.statemachine.stage3.dto.OrderDiscountDTO) discountDataObj;

                // Оновлюємо тип знижки якщо переданий
                if (discountTypeObj instanceof String) {
                    String discountTypeStr = (String) discountTypeObj;
                    try {
                        com.aksi.domain.order.model.DiscountType discountType =
                            com.aksi.domain.order.model.DiscountType.valueOf(discountTypeStr);
                        discountData.setDiscountType(discountType);
                    } catch (IllegalArgumentException e) {
                        log.warn("Невідомий тип знижки: {}", discountTypeStr);
                    }
                }

                // Застосовуємо знижку через сервіс
                var updatedDiscountData = discountService.applyDiscount(wizardId, discountData);

                // Оновлюємо контекст
                context.getExtendedState().getVariables().put("discountData", updatedDiscountData);
                context.getExtendedState().getVariables().put("discountApplied", !updatedDiscountData.getHasErrors());

            } else {
                log.warn("Дані знижки не знайдені в контексті для wizard: {}", wizardId);
                context.getExtendedState().getVariables().put("discountApplied", false);
            }

        } catch (Exception e) {
            log.error("Помилка застосування знижки для wizard: {}", wizardId, e);
            context.getExtendedState().getVariables().put("discountApplied", false);
            context.getExtendedState().getVariables().put("discountError", e.getMessage());
        }
    }

    /**
     * Перераховує загальну вартість з урахуванням знижки.
     */
    public void recalculateTotalWithDiscount(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.info("Перерахунок з урахуванням знижки для wizard: {}", wizardId);

        try {
            // Отримуємо дані знижки з контексту
            Object discountDataObj = context.getExtendedState().getVariables().get("discountData");

            if (discountDataObj != null) {
                var discountData = (com.aksi.domain.order.statemachine.stage3.dto.OrderDiscountDTO) discountDataObj;

                // Реалізовуємо актуальні дані знижки (вони автоматично оновлюються при застосуванні)
                context.getExtendedState().getVariables().put("discountData", discountData);
                context.getExtendedState().getVariables().put("totalRecalculatedWithDiscount", true);

                // Додатково зберігаємо суми для зручності
                if (discountData.getFinalAmount() != null) {
                    context.getExtendedState().getVariables().put("finalOrderAmount", discountData.getFinalAmount());
                }
                if (discountData.getDiscountAmount() != null) {
                    context.getExtendedState().getVariables().put("appliedDiscountAmount", discountData.getDiscountAmount());
                }

            } else {
                log.warn("Дані знижки не знайдені для перерахунку wizard: {}", wizardId);
                context.getExtendedState().getVariables().put("totalRecalculatedWithDiscount", false);
            }

        } catch (Exception e) {
            log.error("Помилка перерахунку з знижкою для wizard: {}", wizardId, e);
            context.getExtendedState().getVariables().put("totalRecalculatedWithDiscount", false);
            context.getExtendedState().getVariables().put("recalculationError", e.getMessage());
        }
    }

    /**
     * Зберігає спосіб оплати через OrderPaymentStepService.
     */
    public void savePaymentMethod(String wizardId, Object paymentMethodObj, StateContext<OrderState, OrderEvent> context) {
        log.info("Збереження способу оплати для wizard: {}", wizardId);

        try {
            UUID wizardUUID = UUID.fromString(wizardId);

            // Конвертуємо об'єкт у PaymentMethod
            if (paymentMethodObj instanceof String) {
                String paymentMethodStr = (String) paymentMethodObj;
                try {
                    com.aksi.domain.order.model.PaymentMethod paymentMethod =
                        com.aksi.domain.order.model.PaymentMethod.valueOf(paymentMethodStr);

                    // Оновлюємо спосіб оплати через сервіс
                    var updatedPaymentData = paymentService.updatePaymentMethod(wizardUUID, paymentMethod);

                    // Оновлюємо контекст
                    context.getExtendedState().getVariables().put("paymentData", updatedPaymentData);
                    context.getExtendedState().getVariables().put("paymentMethodSaved", !updatedPaymentData.isHasErrors());

                } catch (IllegalArgumentException e) {
                    log.warn("Невідомий спосіб оплати: {}", paymentMethodStr);
                    context.getExtendedState().getVariables().put("paymentMethodSaved", false);
                }
            } else {
                log.warn("Неочікуваний тип способу оплати: {}", paymentMethodObj != null ? paymentMethodObj.getClass() : "null");
                context.getExtendedState().getVariables().put("paymentMethodSaved", false);
            }

        } catch (Exception e) {
            log.error("Помилка збереження способу оплати для wizard: {}", wizardId, e);
            context.getExtendedState().getVariables().put("paymentMethodSaved", false);
            context.getExtendedState().getVariables().put("paymentMethodError", e.getMessage());
        }
    }

    /**
     * Розраховує суми оплати через OrderPaymentStepService.
     */
    public void calculatePaymentAmounts(String wizardId, Object paidAmountObj, StateContext<OrderState, OrderEvent> context) {
        log.info("Розрахунок сум оплати для wizard: {}", wizardId);

        try {
            UUID wizardUUID = UUID.fromString(wizardId);

            // Конвертуємо суму передоплати
            java.math.BigDecimal prepaymentAmount = null;
            if (paidAmountObj instanceof Number) {
                prepaymentAmount = new java.math.BigDecimal(paidAmountObj.toString());
            } else if (paidAmountObj instanceof String) {
                try {
                    prepaymentAmount = new java.math.BigDecimal((String) paidAmountObj);
                } catch (NumberFormatException e) {
                    log.warn("Неможливо конвертувати суму передоплати: {}", paidAmountObj);
                }
            }

            if (prepaymentAmount != null) {
                // Оновлюємо суму передоплати через сервіс
                var updatedPaymentData = paymentService.updatePrepaymentAmount(wizardUUID, prepaymentAmount);

                // Оновлюємо контекст
                context.getExtendedState().getVariables().put("paymentData", updatedPaymentData);
                context.getExtendedState().getVariables().put("paymentAmountsCalculated", !updatedPaymentData.isHasErrors());

            } else {
                log.warn("Некоректна сума передоплати для wizard: {}", wizardId);
                context.getExtendedState().getVariables().put("paymentAmountsCalculated", false);
            }

        } catch (Exception e) {
            log.error("Помилка розрахунку сум оплати для wizard: {}", wizardId, e);
            context.getExtendedState().getVariables().put("paymentAmountsCalculated", false);
            context.getExtendedState().getVariables().put("paymentAmountsError", e.getMessage());
        }
    }

    /**
     * Валідує фінансові дані через OrderPaymentStepService.
     */
    public void validatePaymentData(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.info("Валідація фінансових даних для wizard: {}", wizardId);

        try {
            // Отримуємо дані оплати з контексту
            Object paymentDataObj = context.getExtendedState().getVariables().get("paymentData");

            if (paymentDataObj != null) {
                var paymentData = (com.aksi.domain.order.statemachine.stage3.dto.OrderPaymentDTO) paymentDataObj;

                // Виконуємо валідацію через сервіс
                var validationErrors = paymentService.validatePaymentData(paymentData);
                boolean isValid = validationErrors.isEmpty();

                // Оновлюємо контекст
                context.getExtendedState().getVariables().put("paymentDataValidated", isValid);
                if (!isValid) {
                    context.getExtendedState().getVariables().put("paymentValidationErrors", validationErrors);
                }

            } else {
                log.warn("Дані оплати не знайдені для валідації wizard: {}", wizardId);
                context.getExtendedState().getVariables().put("paymentDataValidated", false);
            }

        } catch (Exception e) {
            log.error("Помилка валідації фінансових даних для wizard: {}", wizardId, e);
            context.getExtendedState().getVariables().put("paymentDataValidated", false);
            context.getExtendedState().getVariables().put("paymentValidationError", e.getMessage());
        }
    }

    /**
     * Зберігає додаткову інформацію замовлення через OrderAdditionalInfoStepService.
     */
    public void saveAdditionalInfo(String wizardId, Object notesObj, Object clientRequirementsObj,
                                 StateContext<OrderState, OrderEvent> context) {
        log.info("Збереження додаткової інформації для wizard: {}", wizardId);

        try {
            // Конвертуємо об'єкти у рядки
            String notes = notesObj != null ? notesObj.toString() : null;
            String clientRequirements = clientRequirementsObj != null ? clientRequirementsObj.toString() : null;

            // Завантажуємо поточні дані додаткової інформації
            var additionalInfoData = additionalInfoService.loadAdditionalInfoStep(wizardId);

            // Оновлюємо дані
            if (notes != null && !notes.trim().isEmpty()) {
                additionalInfoData = additionalInfoService.updateOrderNotes(wizardId, notes);
            }

            if (clientRequirements != null && !clientRequirements.trim().isEmpty()) {
                additionalInfoData = additionalInfoService.updateCustomerRequirements(wizardId, clientRequirements);
            }

            // Зберігаємо оновлені дані
            additionalInfoData = additionalInfoService.saveAdditionalInfoStep(wizardId, additionalInfoData);

            // Оновлюємо контекст
            context.getExtendedState().getVariables().put("additionalInfo", additionalInfoData);
            context.getExtendedState().getVariables().put("additionalInfoSaved", !additionalInfoData.getHasErrors());

        } catch (Exception e) {
            log.error("Помилка збереження додаткової інформації для wizard: {}", wizardId, e);
            context.getExtendedState().getVariables().put("additionalInfoSaved", false);
            context.getExtendedState().getVariables().put("additionalInfoError", e.getMessage());
        }
    }

    /**
     * Валідує завершення етапу 3.
     */
    public boolean validateStage3Completion(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.info("Валідація завершення етапу 3 для wizard: {}", wizardId);

        try {
            // Базова валідація наявності збережених даних
            boolean validExecution = executionParametersService.canProceedToNextStep(wizardId);
            boolean validDiscount = discountService.canProceedToNextStep(wizardId);
            boolean validPayment = true; // За замовчуванням валідне
            boolean validAdditionalInfo = additionalInfoService.canProceedToNextStep(wizardId);

            // Додаткова перевірка даних оплати якщо є в контексті
            Object paymentDataObj = context.getExtendedState().getVariables().get("paymentData");
            if (paymentDataObj != null) {
                var paymentData = (com.aksi.domain.order.statemachine.stage3.dto.OrderPaymentDTO) paymentDataObj;
                validPayment = !paymentData.isHasErrors();
            }

            boolean isValid = validExecution && validDiscount && validPayment && validAdditionalInfo;

            log.info("Результат валідації етапу 3 для wizard {}: {}", wizardId, isValid);
            return isValid;

        } catch (Exception e) {
            log.error("Помилка валідації етапу 3 для wizard: {}", wizardId, e);
            return false;
        }
    }

    /**
     * Виконує фінальний перерахунок всіх сум перед переходом до етапу 4.
     */
    public void performFinalCalculations(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.info("Виконання фінальних розрахунків для wizard: {}", wizardId);

        try {
            // Завантажуємо та оновлюємо всі дані для фінального розрахунку
            var executionParams = executionParametersService.loadExecutionParameters(wizardId);
            context.getExtendedState().getVariables().put("executionParameters", executionParams);

            @SuppressWarnings("unchecked")
            List<String> categories = (List<String>) context.getExtendedState().getVariables().get("orderItemCategories");
            if (categories == null) {
                categories = java.util.Collections.emptyList();
            }

            var discountData = discountService.loadDiscountStep(wizardId, categories);
            context.getExtendedState().getVariables().put("discountData", discountData);

            UUID wizardUUID = UUID.fromString(wizardId);
            var paymentData = paymentService.loadPaymentStep(wizardUUID);
            context.getExtendedState().getVariables().put("paymentData", paymentData);

            var additionalInfo = additionalInfoService.loadAdditionalInfoStep(wizardId);
            context.getExtendedState().getVariables().put("additionalInfo", additionalInfo);

                        // Перевіряємо що всі дані валідні
            boolean allDataValid = !executionParams.getHasErrors() &&
                                 !discountData.getHasErrors() &&
                                 !paymentData.isHasErrors() &&
                                 !additionalInfo.getHasErrors();

            context.getExtendedState().getVariables().put("finalCalculationsCompleted", allDataValid);
            context.getExtendedState().getVariables().put("allStage3DataValid", allDataValid);

        } catch (Exception e) {
            log.error("Помилка фінальних розрахунків для wizard: {}", wizardId, e);
            context.getExtendedState().getVariables().put("finalCalculationsCompleted", false);
            context.getExtendedState().getVariables().put("finalCalculationsError", e.getMessage());
        }
    }

    /**
     * Фіналізує етап 3.
     */
    public void finalizeStage3(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.info("Фіналізація етапу 3 для wizard: {}", wizardId);

        try {
            // Встановлюємо статус завершення етапу 3
            context.getExtendedState().getVariables().put("stage3Completed", true);
            context.getExtendedState().getVariables().put("stage3CompletionTime", System.currentTimeMillis());

        } catch (Exception e) {
            log.error("Помилка фіналізації етапу 3 для wizard: {}", wizardId, e);
            throw e;
        }
    }

    /**
     * Підготовує дані для етапу 4.
     */
    public void prepareForStage4(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.info("Підготовка даних для етапу 4 для wizard: {}", wizardId);

        try {
            // Встановлюємо прапор готовності до етапу 4
            context.getExtendedState().getVariables().put("readyForStage4", true);

        } catch (Exception e) {
            log.error("Помилка підготовки до етапу 4 для wizard: {}", wizardId, e);
            throw e;
        }
    }
}
