package com.aksi.domain.order.statemachine.stage3.service;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Координаційний сервіс для управління життєвим циклом Stage 3.
 *
 * Етап: 3 - координація та переходи між підетапами
 * Призначення: Управління життєвим циклом та координація підетапів
 *
 * Підетапи Stage 3:
 * - 3.1: Параметри виконання (дата, терміновість)
 * - 3.2: Знижки (глобальні для замовлення)
 * - 3.3: Оплата (спосіб, фінансові деталі)
 * - 3.4: Додаткова інформація (примітки, вимоги)
 *
 * Відповідальності:
 * - Ініціалізація та завершення Stage 3
 * - Координація переходів між підетапами
 * - Управління станом всього етапу
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class Stage3CoordinationService {

    /**
     * Поточний підетап Stage 3.
     */
    public enum Stage3CurrentStep {
        EXECUTION_PARAMETERS,   // 3.1: Параметри виконання
        DISCOUNTS,             // 3.2: Знижки
        PAYMENT,               // 3.3: Оплата
        ADDITIONAL_INFO        // 3.4: Додаткова інформація
    }

    /**
     * Ініціалізує весь Stage 3.
     *
     * @param orderId ID замовлення
     * @param context контекст State Machine
     */
    public void initializeStage3(UUID orderId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Ініціалізація Stage 3 для замовлення: {}", orderId);

        try {
            // Встановлюємо початковий підетап
            setCurrentStep(Stage3CurrentStep.EXECUTION_PARAMETERS, context);

            // Позначаємо Stage 3 як ініціалізований
            context.getExtendedState().getVariables().put("stage3Initialized", true);
            context.getExtendedState().getVariables().put("stage3InitializationTime", System.currentTimeMillis());

            // Очищуємо попередні помилки
            context.getExtendedState().getVariables().remove("stage3Error");

            log.info("Stage 3 ініціалізовано для замовлення: {}", orderId);

        } catch (Exception e) {
            log.error("Помилка ініціалізації Stage 3 для замовлення {}: {}", orderId, e.getMessage(), e);
            context.getExtendedState().getVariables().put("stage3Error", "Помилка ініціалізації: " + e.getMessage());
            throw e;
        }
    }

    /**
     * Завершує підетап 3.1 та переходить до 3.2.
     */
    public void finishExecutionParametersAndStartDiscounts(UUID orderId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Перехід від підетапу 3.1 до 3.2 для замовлення: {}", orderId);

        try {
            setCurrentStep(Stage3CurrentStep.DISCOUNTS, context);
            context.getExtendedState().getVariables().put("executionParametersCompleted", true);

            log.info("Перехід до підетапу знижок завершено для замовлення: {}", orderId);

        } catch (Exception e) {
            log.error("Помилка переходу до підетапу знижок для замовлення {}: {}", orderId, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Завершує підетап 3.2 та переходить до 3.3.
     */
    public void finishDiscountsAndStartPayment(UUID orderId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Перехід від підетапу 3.2 до 3.3 для замовлення: {}", orderId);

        try {
            setCurrentStep(Stage3CurrentStep.PAYMENT, context);
            context.getExtendedState().getVariables().put("discountsCompleted", true);

            log.info("Перехід до підетапу оплати завершено для замовлення: {}", orderId);

        } catch (Exception e) {
            log.error("Помилка переходу до підетапу оплати для замовлення {}: {}", orderId, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Завершує підетап 3.3 та переходить до 3.4.
     */
    public void finishPaymentAndStartAdditionalInfo(UUID orderId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Перехід від підетапу 3.3 до 3.4 для замовлення: {}", orderId);

        try {
            setCurrentStep(Stage3CurrentStep.ADDITIONAL_INFO, context);
            context.getExtendedState().getVariables().put("paymentCompleted", true);

            log.info("Перехід до підетапу додаткової інформації завершено для замовлення: {}", orderId);

        } catch (Exception e) {
            log.error("Помилка переходу до підетапу додаткової інформації для замовлення {}: {}", orderId, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Завершує весь Stage 3 та підготовує до переходу на Stage 4.
     */
    public void finalizeStage3(UUID orderId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Фіналізація Stage 3 для замовлення: {}", orderId);

        try {
            // Позначаємо завершення всіх підетапів
            context.getExtendedState().getVariables().put("additionalInfoCompleted", true);
            context.getExtendedState().getVariables().put("stage3Completed", true);
            context.getExtendedState().getVariables().put("stage3CompletionTime", System.currentTimeMillis());

            // Очищуємо поточний підетап
            context.getExtendedState().getVariables().remove("currentStage3Step");

            log.info("Stage 3 завершено для замовлення: {}", orderId);

        } catch (Exception e) {
            log.error("Помилка фіналізації Stage 3 для замовлення {}: {}", orderId, e.getMessage(), e);
            context.getExtendedState().getVariables().put("stage3Error", "Помилка фіналізації: " + e.getMessage());
            throw e;
        }
    }

    /**
     * Скидає стан всього Stage 3.
     */
    public void resetStage3State(UUID orderId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Скидання стану Stage 3 для замовлення: {}", orderId);

        try {
            // Очищуємо всі прапорці завершення
            context.getExtendedState().getVariables().remove("stage3Initialized");
            context.getExtendedState().getVariables().remove("stage3Completed");
            context.getExtendedState().getVariables().remove("executionParametersCompleted");
            context.getExtendedState().getVariables().remove("discountsCompleted");
            context.getExtendedState().getVariables().remove("paymentCompleted");
            context.getExtendedState().getVariables().remove("additionalInfoCompleted");

            // Очищуємо часові мітки
            context.getExtendedState().getVariables().remove("stage3InitializationTime");
            context.getExtendedState().getVariables().remove("stage3CompletionTime");

            // Очищуємо поточний підетап
            context.getExtendedState().getVariables().remove("currentStage3Step");

            // Очищуємо помилки
            context.getExtendedState().getVariables().remove("stage3Error");

            log.info("Стан Stage 3 скинуто для замовлення: {}", orderId);

        } catch (Exception e) {
            log.error("Помилка скидання стану Stage 3 для замовлення {}: {}", orderId, e.getMessage(), e);
            throw e;
        }
    }

    // ========== ПЕРЕВІРКИ СТАНУ ==========

    /**
     * Перевіряє чи ініціалізовано Stage 3.
     */
    public boolean isStage3Initialized(StateContext<OrderState, OrderEvent> context) {
        return Boolean.TRUE.equals(context.getExtendedState().getVariables().get("stage3Initialized"));
    }

    /**
     * Перевіряє чи завершено Stage 3.
     */
    public boolean isStage3Completed(StateContext<OrderState, OrderEvent> context) {
        return Boolean.TRUE.equals(context.getExtendedState().getVariables().get("stage3Completed"));
    }

    /**
     * Перевіряє чи завершено підетап параметрів виконання.
     */
    public boolean isExecutionParametersCompleted(StateContext<OrderState, OrderEvent> context) {
        return Boolean.TRUE.equals(context.getExtendedState().getVariables().get("executionParametersCompleted"));
    }

    /**
     * Перевіряє чи завершено підетап знижок.
     */
    public boolean isDiscountsCompleted(StateContext<OrderState, OrderEvent> context) {
        return Boolean.TRUE.equals(context.getExtendedState().getVariables().get("discountsCompleted"));
    }

    /**
     * Перевіряє чи завершено підетап оплати.
     */
    public boolean isPaymentCompleted(StateContext<OrderState, OrderEvent> context) {
        return Boolean.TRUE.equals(context.getExtendedState().getVariables().get("paymentCompleted"));
    }

    /**
     * Перевіряє чи завершено підетап додаткової інформації.
     */
    public boolean isAdditionalInfoCompleted(StateContext<OrderState, OrderEvent> context) {
        return Boolean.TRUE.equals(context.getExtendedState().getVariables().get("additionalInfoCompleted"));
    }

    /**
     * Отримує поточний підетап Stage 3.
     */
    public Stage3CurrentStep getCurrentStep(StateContext<OrderState, OrderEvent> context) {
        Object step = context.getExtendedState().getVariables().get("currentStage3Step");
        if (step instanceof Stage3CurrentStep) {
            return (Stage3CurrentStep) step;
        }
        return Stage3CurrentStep.EXECUTION_PARAMETERS; // За замовчуванням
    }

    /**
     * Встановлює поточний підетап Stage 3.
     */
    private void setCurrentStep(Stage3CurrentStep step, StateContext<OrderState, OrderEvent> context) {
        context.getExtendedState().getVariables().put("currentStage3Step", step);
        log.debug("Встановлено поточний підетап Stage 3: {}", step);
    }

    // ========== ОПЕРАЦІЇ З КОНТЕКСТОМ STATE MACHINE ==========

    /**
     * Зберегти параметри виконання в контексті State Machine.
     */
    public void saveExecutionParametersToContext(StateContext<OrderState, OrderEvent> context,
                                               com.aksi.domain.order.statemachine.stage3.dto.ExecutionParametersDTO executionParams) {
        if (executionParams == null) {
            log.warn("Спроба збереження null параметрів виконання");
            return;
        }

        context.getExtendedState().getVariables().put("stage3ExecutionParams", executionParams);
        log.debug("Параметри виконання збережено в контексті: дата {}, терміновість {}",
                 executionParams.getCompletionDate(), executionParams.getExpediteType());
    }

    /**
     * Завантажити параметри виконання з контексту State Machine.
     */
    public com.aksi.domain.order.statemachine.stage3.dto.ExecutionParametersDTO loadExecutionParametersFromContext(
            StateContext<OrderState, OrderEvent> context) {
        Object data = context.getExtendedState().getVariables().get("stage3ExecutionParams");
        if (data instanceof com.aksi.domain.order.statemachine.stage3.dto.ExecutionParametersDTO executionParamsData) {
            return executionParamsData;
        }

        log.debug("Параметри виконання не знайдено в контексті State Machine");
        return null;
    }

    /**
     * Зберегти дані знижки в контексті State Machine.
     */
    public void saveOrderDiscountToContext(StateContext<OrderState, OrderEvent> context,
                                         com.aksi.domain.order.statemachine.stage3.dto.OrderDiscountDTO discount) {
        if (discount == null) {
            log.warn("Спроба збереження null даних знижки");
            return;
        }

        context.getExtendedState().getVariables().put("stage3Discount", discount);
        log.debug("Дані знижки збережено в контексті: тип {}, відсоток {}",
                 discount.getDiscountType(), discount.getDiscountPercentage());
    }

    /**
     * Завантажити дані знижки з контексту State Machine.
     */
    public com.aksi.domain.order.statemachine.stage3.dto.OrderDiscountDTO loadOrderDiscountFromContext(
            StateContext<OrderState, OrderEvent> context) {
        Object data = context.getExtendedState().getVariables().get("stage3Discount");
        if (data instanceof com.aksi.domain.order.statemachine.stage3.dto.OrderDiscountDTO discountData) {
            return discountData;
        }

        log.debug("Дані знижки не знайдено в контексті State Machine");
        return null;
    }

    /**
     * Зберегти дані оплати в контексті State Machine.
     */
    public void saveOrderPaymentToContext(StateContext<OrderState, OrderEvent> context,
                                        com.aksi.domain.order.statemachine.stage3.dto.OrderPaymentDTO payment) {
        if (payment == null) {
            log.warn("Спроба збереження null даних оплати");
            return;
        }

        context.getExtendedState().getVariables().put("stage3Payment", payment);
        log.debug("Дані оплати збережено в контексті: спосіб {}, сплачено {}, борг {}",
                 payment.getPaymentMethod(), payment.getPrepaymentAmount(), payment.getBalanceAmount());
    }

    /**
     * Завантажити дані оплати з контексту State Machine.
     */
    public com.aksi.domain.order.statemachine.stage3.dto.OrderPaymentDTO loadOrderPaymentFromContext(
            StateContext<OrderState, OrderEvent> context) {
        Object data = context.getExtendedState().getVariables().get("stage3Payment");
        if (data instanceof com.aksi.domain.order.statemachine.stage3.dto.OrderPaymentDTO paymentData) {
            return paymentData;
        }

        log.debug("Дані оплати не знайдено в контексті State Machine");
        return null;
    }

    /**
     * Зберегти додаткові примітки в контексті State Machine.
     */
    public void saveAdditionalNotesToContext(StateContext<OrderState, OrderEvent> context,
                                           com.aksi.domain.order.statemachine.stage3.dto.OrderAdditionalInfoDTO additionalInfo) {
        if (additionalInfo == null) {
            log.warn("Спроба збереження null додаткової інформації");
            return;
        }

        context.getExtendedState().getVariables().put("stage3AdditionalInfo", additionalInfo);
        log.debug("Додаткова інформація збережено в контексті: {} символів загалом",
                 additionalInfo.getTotalCharacterCount());
    }

    /**
     * Завантажити додаткові примітки з контексту State Machine.
     */
    public com.aksi.domain.order.statemachine.stage3.dto.OrderAdditionalInfoDTO loadAdditionalNotesFromContext(
            StateContext<OrderState, OrderEvent> context) {
        Object data = context.getExtendedState().getVariables().get("stage3AdditionalInfo");
        if (data instanceof com.aksi.domain.order.statemachine.stage3.dto.OrderAdditionalInfoDTO additionalInfoData) {
            return additionalInfoData;
        }

        log.debug("Додаткова інформація не знайдено в контексті State Machine");
        return null;
    }

    /**
     * Перевірити завершеність етапу 3 через контекст State Machine.
     */
    public boolean isStage3CompleteFromContext(StateContext<OrderState, OrderEvent> context) {
        var executionParams = loadExecutionParametersFromContext(context);
        var discount = loadOrderDiscountFromContext(context);
        var payment = loadOrderPaymentFromContext(context);
        var additionalInfo = loadAdditionalNotesFromContext(context);

        boolean complete = executionParams != null && executionParams.getCompletionDate() != null &&
                          discount != null &&
                          payment != null && payment.getPaymentMethod() != null && payment.getTotalAmount() != null &&
                          additionalInfo != null;

        log.debug("Перевірка завершеності етапу 3 через контекст: {}", complete);
        return complete;
    }

    /**
     * Очистити дані етапу 3 з контексту State Machine.
     */
    public void clearStage3DataFromContext(StateContext<OrderState, OrderEvent> context) {
        context.getExtendedState().getVariables().remove("stage3ExecutionParams");
        context.getExtendedState().getVariables().remove("stage3Discount");
        context.getExtendedState().getVariables().remove("stage3Payment");
        context.getExtendedState().getVariables().remove("stage3AdditionalInfo");

        // Очищуємо також прапорці стану
        context.getExtendedState().getVariables().remove("stage3Initialized");
        context.getExtendedState().getVariables().remove("stage3Completed");
        context.getExtendedState().getVariables().remove("executionParametersCompleted");
        context.getExtendedState().getVariables().remove("discountsCompleted");
        context.getExtendedState().getVariables().remove("paymentCompleted");
        context.getExtendedState().getVariables().remove("additionalInfoCompleted");
        context.getExtendedState().getVariables().remove("currentStage3Step");

        log.debug("Дані етапу 3 очищено з контексту State Machine");
    }
}
