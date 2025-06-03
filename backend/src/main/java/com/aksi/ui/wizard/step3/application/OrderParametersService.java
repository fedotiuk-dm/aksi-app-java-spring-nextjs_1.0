package com.aksi.ui.wizard.step3.application;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.model.PaymentMethod;
import com.aksi.domain.order.service.OrderService;
import com.aksi.ui.wizard.dto.OrderWizardData;
import com.aksi.ui.wizard.step3.domain.OrderParametersState;
import com.aksi.ui.wizard.step3.domain.OrderParametersState.DiscountType;
import com.aksi.ui.wizard.step3.domain.OrderParametersState.UrgencyOption;
import com.aksi.ui.wizard.step3.events.OrderParametersEvents;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Application Service для координації параметрів замовлення.
 * Містить бізнес-логіку обробки параметрів, валідації та координації зі зовнішніми сервісами.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderParametersService {

    private final OrderService orderService;

    // Event handler для координації з UI
    private Consumer<OrderParametersEvents> eventHandler;

    /**
     * Встановлює event handler.
     */
    public void setEventHandler(Consumer<OrderParametersEvents> eventHandler) {
        this.eventHandler = eventHandler;
    }

    /**
     * Ініціалізує параметри замовлення.
     */
    public OrderParametersState initializeParameters(OrderWizardData wizardData) {
        try {
            log.debug("Ініціалізація параметрів замовлення для {} предметів", wizardData.getItems().size());

            publishEvent(OrderParametersEvents.loadingStarted("initialization", "Ініціалізація параметрів замовлення"));

            // Конвертуємо предмети до ItemInfo
            List<OrderParametersState.ItemInfo> items = wizardData.getItems().stream()
                .map(item -> new OrderParametersState.ItemInfo(item.getCategory(), item.getName()))
                .collect(Collectors.toList());

            // Створюємо початковий стан з базовою сумою предметів
            BigDecimal itemsTotal = wizardData.getItems().stream()
                .map(item -> item.getTotalPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            OrderParametersState initialState = OrderParametersState.createInitial(items, itemsTotal);

            // Оновлюємо загальну суму в wizard data
            wizardData.getDraftOrder().setTotalAmount(itemsTotal);
            wizardData.getDraftOrder().setFinalAmount(itemsTotal);

            // Публікуємо події
            publishEvent(OrderParametersEvents.parametersInitialized(
                initialState,
                wizardData.getDraftOrder().getReceiptNumber(),
                initialState.getTotalAmount(),
                wizardData.getItems().size()
            ));

            publishEvent(OrderParametersEvents.processingInfoUpdated(
                initialState.getProcessingInfoText(),
                initialState.getStandardProcessingDays(),
                initialState.isHasLeatherItems(),
                wizardData.getItems().size()
            ));

            publishEvent(OrderParametersEvents.loadingCompleted("initialization", true, "Параметри ініціалізовано успішно"));

            log.info("Параметри замовлення ініціалізовано успішно з сумою: {}", initialState.getTotalAmount());
            return initialState;

        } catch (Exception ex) {
            log.error("Помилка ініціалізації параметрів: {}", ex.getMessage(), ex);
            publishEvent(OrderParametersEvents.error("initialization", ex.getMessage(), ex, "INIT_ERROR"));
            throw ex;
        }
    }

    /**
     * Оновлює очікувану дату виконання.
     */
    public OrderParametersState updateExpectedDate(OrderParametersState currentState, LocalDate newDate) {
        try {
            log.debug("Оновлення дати виконання: {} -> {}", currentState.getExpectedCompletionDate(), newDate);

            LocalDate previousDate = currentState.getExpectedCompletionDate();
            OrderParametersState updatedState = currentState.withExpectedDate(newDate);

            publishEvent(OrderParametersEvents.dateChanged(
                newDate,
                previousDate,
                updatedState.getUrgencyOption(),
                updatedState.isValid()
            ));

            publishEvent(OrderParametersEvents.stateUpdated(updatedState, "expected_date_changed"));
            publishUiStateUpdate(updatedState);

            return updatedState;

        } catch (Exception ex) {
            log.error("Помилка оновлення дати: {}", ex.getMessage(), ex);
            publishEvent(OrderParametersEvents.error("update_date", ex.getMessage(), ex, "DATE_ERROR"));
            return currentState;
        }
    }

    /**
     * Оновлює терміновість виконання.
     */
    public OrderParametersState updateUrgencyOption(OrderParametersState currentState, UrgencyOption newUrgency) {
        try {
            log.debug("Оновлення терміновості: {} -> {}", currentState.getUrgencyOption(), newUrgency);

            UrgencyOption previousUrgency = currentState.getUrgencyOption();
            OrderParametersState updatedState = currentState.withUrgencyOption(newUrgency);

            publishEvent(OrderParametersEvents.urgencyChanged(
                newUrgency,
                previousUrgency,
                updatedState.getExpectedCompletionDate(),
                newUrgency.getSurchargePercent()
            ));

            publishEvent(OrderParametersEvents.stateUpdated(updatedState, "urgency_option_changed"));

            return updatedState;

        } catch (Exception ex) {
            log.error("Помилка оновлення терміновості: {}", ex.getMessage(), ex);
            publishEvent(OrderParametersEvents.error("update_urgency", ex.getMessage(), ex, "URGENCY_ERROR"));
            return currentState;
        }
    }

    /**
     * Оновлює тип знижки.
     */
    public OrderParametersState updateDiscountType(OrderParametersState currentState, DiscountType newDiscountType) {
        try {
            log.debug("Оновлення типу знижки: {} -> {}", currentState.getDiscountType(), newDiscountType);

            DiscountType previousType = currentState.getDiscountType();
            OrderParametersState updatedState = currentState.withDiscountType(newDiscountType);

            publishEvent(OrderParametersEvents.discountChanged(
                newDiscountType,
                previousType,
                updatedState.getEffectiveDiscountPercent(),
                updatedState.isShowCustomDiscountField(),
                updatedState.getDiscountWarnings()
            ));

            publishEvent(OrderParametersEvents.discountWarningUpdated(
                updatedState.getDiscountWarnings(),
                updatedState.isShowDiscountWarning(),
                newDiscountType
            ));

            publishEvent(OrderParametersEvents.stateUpdated(updatedState, "discount_type_changed"));
            publishUiStateUpdate(updatedState);

            return updatedState;

        } catch (Exception ex) {
            log.error("Помилка оновлення знижки: {}", ex.getMessage(), ex);
            publishEvent(OrderParametersEvents.error("update_discount", ex.getMessage(), ex, "DISCOUNT_ERROR"));
            return currentState;
        }
    }

    /**
     * Оновлює кастомну знижку.
     */
    public OrderParametersState updateCustomDiscountPercent(OrderParametersState currentState, BigDecimal newPercent) {
        try {
            log.debug("Оновлення кастомної знижки: {} -> {}", currentState.getCustomDiscountPercent(), newPercent);

            BigDecimal previousPercent = currentState.getCustomDiscountPercent();
            OrderParametersState updatedState = currentState.withCustomDiscountPercent(newPercent);

            publishEvent(OrderParametersEvents.customDiscountChanged(
                newPercent,
                previousPercent,
                updatedState.isValid()
            ));

            publishEvent(OrderParametersEvents.stateUpdated(updatedState, "custom_discount_changed"));
            publishUiStateUpdate(updatedState);

            return updatedState;

        } catch (Exception ex) {
            log.error("Помилка оновлення кастомної знижки: {}", ex.getMessage(), ex);
            publishEvent(OrderParametersEvents.error("update_custom_discount", ex.getMessage(), ex, "CUSTOM_DISCOUNT_ERROR"));
            return currentState;
        }
    }

    /**
     * Оновлює спосіб оплати.
     */
    public OrderParametersState updatePaymentMethod(OrderParametersState currentState, OrderParametersState.PaymentMethod newPaymentMethod) {
        try {
            log.debug("Оновлення способу оплати: {} -> {}", currentState.getPaymentMethod(), newPaymentMethod);

            OrderParametersState.PaymentMethod previousMethod = currentState.getPaymentMethod();
            OrderParametersState updatedState = currentState.withPaymentMethod(newPaymentMethod);

            publishEvent(OrderParametersEvents.paymentChanged(newPaymentMethod, previousMethod));
            publishEvent(OrderParametersEvents.stateUpdated(updatedState, "payment_method_changed"));

            publishEvent(OrderParametersEvents.financialStateChanged(
                updatedState.getTotalAmount(),
                updatedState.getPaidAmount(),
                updatedState.getDebtAmount(),
                updatedState.isFullyPaid(),
                newPaymentMethod
            ));

            return updatedState;

        } catch (Exception ex) {
            log.error("Помилка оновлення способу оплати: {}", ex.getMessage(), ex);
            publishEvent(OrderParametersEvents.error("update_payment", ex.getMessage(), ex, "PAYMENT_ERROR"));
            return currentState;
        }
    }

    /**
     * Оновлює суму оплати.
     */
    public OrderParametersState updatePaidAmount(OrderParametersState currentState, BigDecimal newPaidAmount) {
        try {
            log.debug("Оновлення суми оплати: {} -> {}", currentState.getPaidAmount(), newPaidAmount);

            BigDecimal previousAmount = currentState.getPaidAmount();
            OrderParametersState updatedState = currentState.withPaidAmount(newPaidAmount);

            publishEvent(OrderParametersEvents.paidAmountChanged(
                newPaidAmount,
                previousAmount,
                updatedState.getDebtAmount(),
                updatedState.isValid()
            ));

            publishEvent(OrderParametersEvents.financialStateChanged(
                updatedState.getTotalAmount(),
                newPaidAmount,
                updatedState.getDebtAmount(),
                updatedState.isFullyPaid(),
                updatedState.getPaymentMethod()
            ));

            publishEvent(OrderParametersEvents.stateUpdated(updatedState, "paid_amount_changed"));
            publishUiStateUpdate(updatedState);

            return updatedState;

        } catch (Exception ex) {
            log.error("Помилка оновлення суми оплати: {}", ex.getMessage(), ex);
            publishEvent(OrderParametersEvents.error("update_paid_amount", ex.getMessage(), ex, "PAID_AMOUNT_ERROR"));
            return currentState;
        }
    }

    /**
     * Оновлює примітки та вимоги.
     */
    public OrderParametersState updateNotes(OrderParametersState currentState, String orderNotes, String clientRequirements) {
        try {
            log.debug("Оновлення приміток");

            String previousOrderNotes = currentState.getOrderNotes();
            String previousClientRequirements = currentState.getClientRequirements();
            OrderParametersState updatedState = currentState.withNotes(orderNotes, clientRequirements);

            publishEvent(OrderParametersEvents.notesChanged(
                orderNotes,
                clientRequirements,
                previousOrderNotes,
                previousClientRequirements
            ));

            publishEvent(OrderParametersEvents.stateUpdated(updatedState, "notes_changed"));

            return updatedState;

        } catch (Exception ex) {
            log.error("Помилка оновлення приміток: {}", ex.getMessage(), ex);
            publishEvent(OrderParametersEvents.error("update_notes", ex.getMessage(), ex, "NOTES_ERROR"));
            return currentState;
        }
    }

    /**
     * Валідує параметри замовлення.
     */
    public OrderParametersState validateParameters(OrderParametersState currentState) {
        try {
            log.debug("Валідація параметрів замовлення");

            publishEvent(OrderParametersEvents.validated(
                currentState.isValid(),
                currentState.getValidationMessages(),
                currentState.getDiscountWarnings(),
                currentState.isCanProceedToNext()
            ));

            return currentState;

        } catch (Exception ex) {
            log.error("Помилка валідації: {}", ex.getMessage(), ex);
            publishEvent(OrderParametersEvents.error("validation", ex.getMessage(), ex, "VALIDATION_ERROR"));
            return currentState;
        }
    }

    /**
     * Підготовка до переходу на наступний етап.
     */
    public void requestProceedToNext(OrderParametersState currentState, OrderWizardData wizardData) {
        try {
            log.info("Запит переходу на наступний етап");

            if (!currentState.isValid() || !currentState.isCanProceedToNext()) {
                publishEvent(OrderParametersEvents.error("proceed_next", "Параметри не валідні", null, "VALIDATION_FAILED"));
                return;
            }

            publishEvent(OrderParametersEvents.loadingStarted("save_order", "Збереження замовлення"));

            // Оновлюємо wizardData з параметрами
            OrderWizardData updatedWizardData = updateWizardDataFromState(wizardData, currentState);

            // Зберігаємо замовлення в базу даних перед переходом до step 4
            var orderEntity = updatedWizardData.getDraftOrder();
            orderEntity.setDraft(false); // Відмічаємо, що це вже не чернетка

            var savedOrderDto = orderService.saveOrder(orderEntity);
            log.info("Order saved to database with ID: {}", savedOrderDto.getId());

            // Оновлюємо ID замовлення у wizard data
            orderEntity.setId(savedOrderDto.getId());

            publishEvent(OrderParametersEvents.loadingCompleted("save_order", true, "Замовлення збережено"));
            publishEvent(OrderParametersEvents.readyToProceed(updatedWizardData, currentState, true));

            log.info("Готовий до переходу на наступний етап, замовлення збережено з ID: {}", savedOrderDto.getId());

        } catch (Exception ex) {
            log.error("Помилка підготовки до переходу: {}", ex.getMessage(), ex);
            publishEvent(OrderParametersEvents.loadingCompleted("save_order", false, "Помилка збереження замовлення"));
            publishEvent(OrderParametersEvents.error("proceed_next", ex.getMessage(), ex, "PROCEED_ERROR"));
        }
    }

    /**
     * Запит навігації назад.
     */
    public void requestNavigateBack(OrderParametersState currentState, OrderWizardData wizardData) {
        try {
            log.info("Запит навігації назад");

            OrderWizardData updatedWizardData = updateWizardDataFromState(wizardData, currentState);
            publishEvent(OrderParametersEvents.navigateBack(updatedWizardData, currentState));

        } catch (Exception ex) {
            log.error("Помилка навігації назад: {}", ex.getMessage(), ex);
            publishEvent(OrderParametersEvents.error("navigate_back", ex.getMessage(), ex, "NAVIGATE_ERROR"));
        }
    }

    /**
     * Запит скасування.
     */
    public void requestCancel(String reason) {
        log.info("Запит скасування: {}", reason);
        publishEvent(OrderParametersEvents.cancelRequested(reason));
    }

    /**
     * Перераховує загальну вартість на основі поточних параметрів.
     */
    public OrderParametersState recalculateTotal(OrderParametersState currentState, BigDecimal baseAmount) {
        try {
            log.debug("Перерахунок загальної вартості: базова сума = {}", baseAmount);

            OrderParametersState updatedState = currentState.withBaseAmount(baseAmount);

            publishEvent(OrderParametersEvents.calculationCompleted("total_recalculation", updatedState.getTotalAmount(), "Загальна вартість перерахована"));
            publishEvent(OrderParametersEvents.financialStateChanged(
                updatedState.getTotalAmount(),
                updatedState.getPaidAmount(),
                updatedState.getDebtAmount(),
                updatedState.isFullyPaid(),
                updatedState.getPaymentMethod()
            ));
            publishEvent(OrderParametersEvents.stateUpdated(updatedState, "total_recalculated"));

            return updatedState;

        } catch (Exception ex) {
            log.error("Помилка перерахунку загальної вартості: {}", ex.getMessage(), ex);
            publishEvent(OrderParametersEvents.error("recalculate_total", ex.getMessage(), ex, "CALCULATION_ERROR"));
            return currentState;
        }
    }

    // Приватні методи

    private void publishEvent(OrderParametersEvents event) {
        if (eventHandler != null) {
            try {
                eventHandler.accept(event);
            } catch (Exception ex) {
                log.error("Помилка публікації події {}: {}", event.getClass().getSimpleName(), ex.getMessage(), ex);
            }
        }
    }

    private void publishUiStateUpdate(OrderParametersState state) {
        publishEvent(OrderParametersEvents.uiStateChanged(
            state.isCanProceedToNext(),
            state.isShowCustomDiscountField(),
            state.isShowDiscountWarning(),
            false,
            state.isValid() ? "Готово" : "Потрібна перевірка"
        ));
    }

    private OrderWizardData updateWizardDataFromState(OrderWizardData wizardData, OrderParametersState state) {
        var orderEntity = wizardData.getDraftOrder();

        // Оновлюємо дату виконання
        if (state.getExpectedCompletionDateTime() != null) {
            orderEntity.setExpectedCompletionDate(state.getExpectedCompletionDateTime());
        }

        // Оновлюємо терміновість
        if (state.getUrgencyOption() != null) {
            switch (state.getUrgencyOption()) {
                case STANDARD -> orderEntity.setExpediteType(ExpediteType.STANDARD);
                case URGENT_48H -> orderEntity.setExpediteType(ExpediteType.EXPRESS_48H);
                case URGENT_24H -> orderEntity.setExpediteType(ExpediteType.EXPRESS_24H);
            }
        }

        // Оновлюємо спосіб оплати
        if (state.getPaymentMethod() != null) {
            PaymentMethod domainPaymentMethod = switch (state.getPaymentMethod()) {
                case TERMINAL -> PaymentMethod.TERMINAL;
                case CASH -> PaymentMethod.CASH;
                case BANK_TRANSFER -> PaymentMethod.BANK_TRANSFER;
            };
            orderEntity.setPaymentMethod(domainPaymentMethod);
        }

        // Оновлюємо фінансові дані
        if (state.getTotalAmount() != null) {
            orderEntity.setTotalAmount(state.getTotalAmount());
            orderEntity.setFinalAmount(state.getTotalAmount());
        }

        if (state.getPaidAmount() != null) {
            orderEntity.setPrepaymentAmount(state.getPaidAmount());
        }

        // Оновлюємо примітки
        if (state.getOrderNotes() != null) {
            orderEntity.setCustomerNotes(state.getOrderNotes());
        }

        if (state.getClientRequirements() != null) {
            orderEntity.setAdditionalRequirements(state.getClientRequirements());
        }

        // Оновлюємо знижку
        if (state.getDiscountType() != OrderParametersState.DiscountType.NONE) {
            // TODO: Додати поля для знижки в OrderEntity або зберігати як метадані
            log.debug("Знижка застосована: {} ({}%)", state.getDiscountType(), state.getEffectiveDiscountPercent());
        }

        log.debug("WizardData оновлено з параметрами: дата={}, терміновість={}, оплата={}, сума={}",
                state.getExpectedCompletionDateTime(), state.getUrgencyOption(),
                state.getPaymentMethod(), state.getTotalAmount());

        return wizardData;
    }
}
