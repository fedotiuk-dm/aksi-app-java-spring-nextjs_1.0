package com.aksi.ui.wizard.step3.events;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.aksi.ui.wizard.dto.OrderWizardData;
import com.aksi.ui.wizard.step3.domain.OrderParametersState;
import com.aksi.ui.wizard.step3.domain.OrderParametersState.DiscountType;
import com.aksi.ui.wizard.step3.domain.OrderParametersState.PaymentMethod;
import com.aksi.ui.wizard.step3.domain.OrderParametersState.UrgencyOption;

/**
 * Events для Order Parameters компонентів з використанням Sealed Interface.
 * Забезпечує type-safe event handling з pattern matching.
 */
public sealed interface OrderParametersEvents
    permits OrderParametersEvents.ParametersInitialized,
            OrderParametersEvents.ParametersStateUpdated,
            OrderParametersEvents.ExpectedDateChanged,
            OrderParametersEvents.UrgencyOptionChanged,
            OrderParametersEvents.DiscountTypeChanged,
            OrderParametersEvents.CustomDiscountChanged,
            OrderParametersEvents.PaymentMethodChanged,
            OrderParametersEvents.PaidAmountChanged,
            OrderParametersEvents.NotesChanged,
            OrderParametersEvents.ParametersValidated,
            OrderParametersEvents.ReadyToProceed,
            OrderParametersEvents.NavigateBackRequested,
            OrderParametersEvents.CancelRequested,
            OrderParametersEvents.ParametersError,
            OrderParametersEvents.CalculationCompleted,
            OrderParametersEvents.LoadingStarted,
            OrderParametersEvents.LoadingCompleted,
            OrderParametersEvents.FinancialStateChanged,
            OrderParametersEvents.DiscountWarningUpdated,
            OrderParametersEvents.ProcessingInfoUpdated,
            OrderParametersEvents.UIStateChanged {

    /**
     * Подія ініціалізації параметрів замовлення.
     */
    record ParametersInitialized(
        OrderParametersState initialState,
        String wizardDataId,
        BigDecimal totalAmount,
        int itemsCount
    ) implements OrderParametersEvents {}

    /**
     * Подія оновлення стану параметрів.
     */
    record ParametersStateUpdated(
        OrderParametersState parametersState,
        String changeReason
    ) implements OrderParametersEvents {}

    /**
     * Подія зміни очікуваної дати виконання.
     */
    record ExpectedDateChanged(
        LocalDate newDate,
        LocalDate previousDate,
        UrgencyOption calculatedUrgency,
        boolean isValidDate
    ) implements OrderParametersEvents {}

    /**
     * Подія зміни терміновості виконання.
     */
    record UrgencyOptionChanged(
        UrgencyOption newUrgency,
        UrgencyOption previousUrgency,
        LocalDate calculatedDate,
        int surchargePercent
    ) implements OrderParametersEvents {}

    /**
     * Подія зміни типу знижки.
     */
    record DiscountTypeChanged(
        DiscountType newDiscountType,
        DiscountType previousDiscountType,
        BigDecimal effectivePercent,
        boolean showCustomField,
        List<String> warnings
    ) implements OrderParametersEvents {}

    /**
     * Подія зміни кастомної знижки.
     */
    record CustomDiscountChanged(
        BigDecimal newPercent,
        BigDecimal previousPercent,
        boolean isValidPercent
    ) implements OrderParametersEvents {}

    /**
     * Подія зміни способу оплати.
     */
    record PaymentMethodChanged(
        PaymentMethod newPaymentMethod,
        PaymentMethod previousPaymentMethod
    ) implements OrderParametersEvents {}

    /**
     * Подія зміни суми оплати.
     */
    record PaidAmountChanged(
        BigDecimal newPaidAmount,
        BigDecimal previousPaidAmount,
        BigDecimal calculatedDebt,
        boolean isValidAmount
    ) implements OrderParametersEvents {}

    /**
     * Подія зміни приміток та вимог.
     */
    record NotesChanged(
        String newOrderNotes,
        String newClientRequirements,
        String previousOrderNotes,
        String previousClientRequirements
    ) implements OrderParametersEvents {}

    /**
     * Подія завершення валідації параметрів.
     */
    record ParametersValidated(
        boolean isValid,
        List<String> validationMessages,
        List<String> warnings,
        boolean canProceed
    ) implements OrderParametersEvents {}

    /**
     * Подія готовності до переходу на наступний етап.
     */
    record ReadyToProceed(
        OrderWizardData updatedWizardData,
        OrderParametersState finalState,
        boolean isReady
    ) implements OrderParametersEvents {}

    /**
     * Подія запиту навігації назад.
     */
    record NavigateBackRequested(
        OrderWizardData currentWizardData,
        OrderParametersState currentState
    ) implements OrderParametersEvents {}

    /**
     * Подія запиту скасування.
     */
    record CancelRequested(
        String cancelReason
    ) implements OrderParametersEvents {}

    /**
     * Подія помилки в параметрах замовлення.
     */
    record ParametersError(
        String operation,
        String errorMessage,
        Exception exception,
        String errorCode
    ) implements OrderParametersEvents {}

    /**
     * Подія завершення розрахунків.
     */
    record CalculationCompleted(
        String calculationType,
        BigDecimal result,
        String details
    ) implements OrderParametersEvents {}

    /**
     * Подія початку операції.
     */
    record LoadingStarted(
        String operation,
        String description
    ) implements OrderParametersEvents {}

    /**
     * Подія завершення операції.
     */
    record LoadingCompleted(
        String operation,
        boolean success,
        String message
    ) implements OrderParametersEvents {}

    /**
     * Подія зміни фінансового стану.
     */
    record FinancialStateChanged(
        BigDecimal totalAmount,
        BigDecimal paidAmount,
        BigDecimal debtAmount,
        boolean isFullyPaid,
        PaymentMethod paymentMethod
    ) implements OrderParametersEvents {}

    /**
     * Подія оновлення попереджень про знижки.
     */
    record DiscountWarningUpdated(
        List<String> warnings,
        boolean showWarning,
        DiscountType currentDiscountType
    ) implements OrderParametersEvents {}

    /**
     * Подія оновлення інформації про обробку.
     */
    record ProcessingInfoUpdated(
        String processingInfoText,
        int processingDays,
        boolean hasLeatherItems,
        int itemsCount
    ) implements OrderParametersEvents {}

    /**
     * Подія зміни UI стану.
     */
    record UIStateChanged(
        boolean canProceedToNext,
        boolean showCustomDiscountField,
        boolean showDiscountWarning,
        boolean isLoading,
        String statusMessage
    ) implements OrderParametersEvents {}

    // Допоміжні методи для створення подій

    static ParametersInitialized parametersInitialized(OrderParametersState state, String wizardId, BigDecimal total, int count) {
        return new ParametersInitialized(state, wizardId, total, count);
    }

    static ParametersStateUpdated stateUpdated(OrderParametersState state, String reason) {
        return new ParametersStateUpdated(state, reason);
    }

    static ExpectedDateChanged dateChanged(LocalDate newDate, LocalDate oldDate, UrgencyOption urgency, boolean valid) {
        return new ExpectedDateChanged(newDate, oldDate, urgency, valid);
    }

    static UrgencyOptionChanged urgencyChanged(UrgencyOption newUrgency, UrgencyOption oldUrgency, LocalDate date, int surcharge) {
        return new UrgencyOptionChanged(newUrgency, oldUrgency, date, surcharge);
    }

    static DiscountTypeChanged discountChanged(DiscountType newType, DiscountType oldType, BigDecimal percent, boolean showField, List<String> warnings) {
        return new DiscountTypeChanged(newType, oldType, percent, showField, warnings);
    }

    static CustomDiscountChanged customDiscountChanged(BigDecimal newPercent, BigDecimal oldPercent, boolean valid) {
        return new CustomDiscountChanged(newPercent, oldPercent, valid);
    }

    static PaymentMethodChanged paymentChanged(PaymentMethod newMethod, PaymentMethod oldMethod) {
        return new PaymentMethodChanged(newMethod, oldMethod);
    }

    static PaidAmountChanged paidAmountChanged(BigDecimal newAmount, BigDecimal oldAmount, BigDecimal debt, boolean valid) {
        return new PaidAmountChanged(newAmount, oldAmount, debt, valid);
    }

    static NotesChanged notesChanged(String newOrderNotes, String newClientReq, String oldOrderNotes, String oldClientReq) {
        return new NotesChanged(newOrderNotes, newClientReq, oldOrderNotes, oldClientReq);
    }

    static ParametersValidated validated(boolean valid, List<String> messages, List<String> warnings, boolean canProceed) {
        return new ParametersValidated(valid, messages, warnings, canProceed);
    }

    static ReadyToProceed readyToProceed(OrderWizardData wizardData, OrderParametersState state, boolean ready) {
        return new ReadyToProceed(wizardData, state, ready);
    }

    static NavigateBackRequested navigateBack(OrderWizardData wizardData, OrderParametersState state) {
        return new NavigateBackRequested(wizardData, state);
    }

    static CancelRequested cancelRequested(String reason) {
        return new CancelRequested(reason);
    }

    static ParametersError error(String operation, String message, Exception ex, String code) {
        return new ParametersError(operation, message, ex, code);
    }

    static CalculationCompleted calculationCompleted(String type, BigDecimal result, String details) {
        return new CalculationCompleted(type, result, details);
    }

    static LoadingStarted loadingStarted(String operation, String description) {
        return new LoadingStarted(operation, description);
    }

    static LoadingCompleted loadingCompleted(String operation, boolean success, String message) {
        return new LoadingCompleted(operation, success, message);
    }

    static FinancialStateChanged financialStateChanged(BigDecimal total, BigDecimal paid, BigDecimal debt, boolean fullPaid, PaymentMethod method) {
        return new FinancialStateChanged(total, paid, debt, fullPaid, method);
    }

    static DiscountWarningUpdated discountWarningUpdated(List<String> warnings, boolean show, DiscountType type) {
        return new DiscountWarningUpdated(warnings, show, type);
    }

    static ProcessingInfoUpdated processingInfoUpdated(String text, int days, boolean hasLeather, int count) {
        return new ProcessingInfoUpdated(text, days, hasLeather, count);
    }

    static UIStateChanged uiStateChanged(boolean canProceed, boolean showCustomField, boolean showWarning, boolean loading, String status) {
        return new UIStateChanged(canProceed, showCustomField, showWarning, loading, status);
    }
}
