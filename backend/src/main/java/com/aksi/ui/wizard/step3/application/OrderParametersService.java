package com.aksi.ui.wizard.step3.application;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import com.aksi.ui.wizard.dto.OrderWizardData;
import com.aksi.ui.wizard.step3.domain.OrderParametersState;
import com.aksi.ui.wizard.step3.domain.OrderParametersState.DiscountType;
import com.aksi.ui.wizard.step3.domain.OrderParametersState.ItemInfo;
import com.aksi.ui.wizard.step3.domain.OrderParametersState.PaymentMethod;
import com.aksi.ui.wizard.step3.domain.OrderParametersState.UrgencyOption;
import com.aksi.ui.wizard.step3.events.OrderParametersEvents;

import lombok.extern.slf4j.Slf4j;

/**
 * Application Service для управління параметрами замовлення.
 * Координує domain логіку та публікує події для UI.
 */
@Slf4j
public class OrderParametersService {

    private Consumer<OrderParametersEvents> eventHandler;

    /**
     * Встановлює обробник подій.
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
            List<ItemInfo> items = wizardData.getItems().stream()
                .map(item -> new ItemInfo(item.getCategory(), item.getName()))
                .collect(Collectors.toList());

            // Створюємо початковий стан
            OrderParametersState initialState = OrderParametersState.createInitial(items, wizardData.getTotalAmount());

            // Публікуємо події
            publishEvent(OrderParametersEvents.parametersInitialized(
                initialState,
                wizardData.getDraftOrder().getReceiptNumber(),
                wizardData.getTotalAmount(),
                wizardData.getItems().size()
            ));

            publishEvent(OrderParametersEvents.processingInfoUpdated(
                initialState.getProcessingInfoText(),
                initialState.getStandardProcessingDays(),
                initialState.isHasLeatherItems(),
                wizardData.getItems().size()
            ));

            publishEvent(OrderParametersEvents.loadingCompleted("initialization", true, "Параметри ініціалізовано успішно"));

            log.info("Параметри замовлення ініціалізовано успішно");
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
    public OrderParametersState updatePaymentMethod(OrderParametersState currentState, PaymentMethod newPaymentMethod) {
        try {
            log.debug("Оновлення способу оплати: {} -> {}", currentState.getPaymentMethod(), newPaymentMethod);

            PaymentMethod previousMethod = currentState.getPaymentMethod();
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

            // Оновлюємо wizardData з параметрами
            OrderWizardData updatedWizardData = updateWizardDataFromState(wizardData, currentState);

            publishEvent(OrderParametersEvents.readyToProceed(updatedWizardData, currentState, true));

            log.info("Готовий до переходу на наступний етап");

        } catch (Exception ex) {
            log.error("Помилка підготовки до переходу: {}", ex.getMessage(), ex);
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
        // Оновлюємо дату виконання
        if (state.getExpectedCompletionDateTime() != null) {
            wizardData.getDraftOrder().setExpectedCompletionDate(state.getExpectedCompletionDateTime());
        }

        // TODO: Додати оновлення інших параметрів в OrderWizardData
        // - терміновість
        // - знижки
        // - спосіб оплати
        // - примітки

        return wizardData;
    }
}
