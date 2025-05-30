package com.aksi.ui.wizard.step3.components;

import java.math.BigDecimal;
import java.util.function.Consumer;

import com.aksi.ui.wizard.step3.domain.OrderParametersState;
import com.aksi.ui.wizard.step3.domain.OrderParametersState.PaymentMethod;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.radiobutton.RadioButtonGroup;
import com.vaadin.flow.component.textfield.NumberField;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для управління оплатою та фінансами.
 * Відповідає за SRP - тільки спосіб оплати та суми.
 */
@Slf4j
public class PaymentComponent extends VerticalLayout {

    // UI елементи
    private RadioButtonGroup<PaymentMethod> paymentMethodGroup;
    private NumberField totalAmountField;
    private NumberField paidAmountField;
    private NumberField debtAmountField;

    // Event handlers
    private Consumer<PaymentMethod> onPaymentMethodChanged;
    private Consumer<BigDecimal> onPaidAmountChanged;

    // Стан
    private OrderParametersState currentState;

    public PaymentComponent() {
        initializeLayout();
        createComponents();
        setupEventHandlers();

        log.debug("PaymentComponent ініціалізовано");
    }

    private void initializeLayout() {
        setPadding(false);
        setSpacing(true);
        getStyle()
            .set("background", "var(--lumo-contrast-5pct)")
            .set("padding", "var(--lumo-space-m)")
            .set("border-radius", "var(--lumo-border-radius-m)");
    }

    private void createComponents() {
        H4 sectionTitle = new H4("3.3. Оплата");
        sectionTitle.getStyle().set("margin-top", "0");

        // Спосіб оплати
        paymentMethodGroup = new RadioButtonGroup<>();
        paymentMethodGroup.setLabel("Спосіб оплати");
        paymentMethodGroup.setItems(PaymentMethod.values());
        paymentMethodGroup.setValue(PaymentMethod.TERMINAL);

        // Фінансові поля
        HorizontalLayout financialLayout = createFinancialLayout();

        add(sectionTitle, paymentMethodGroup, financialLayout);
    }

    private HorizontalLayout createFinancialLayout() {
        HorizontalLayout layout = new HorizontalLayout();
        layout.setWidthFull();
        layout.setSpacing(true);

        // Загальна вартість
        totalAmountField = new NumberField("Загальна вартість");
        totalAmountField.setReadOnly(true);
        totalAmountField.setPrefixComponent(new Span("₴"));
        totalAmountField.setStepButtonsVisible(false);

        // Сплачено
        paidAmountField = new NumberField("Сплачено (передоплата)");
        paidAmountField.setMin(0);
        paidAmountField.setValue(0.0);
        paidAmountField.setPrefixComponent(new Span("₴"));
        paidAmountField.setPlaceholder("0.00");
        paidAmountField.setHelperText("Введіть суму передоплати");

        // Борг
        debtAmountField = new NumberField("Борг");
        debtAmountField.setReadOnly(true);
        debtAmountField.setPrefixComponent(new Span("₴"));
        debtAmountField.setStepButtonsVisible(false);

        layout.add(totalAmountField, paidAmountField, debtAmountField);
        return layout;
    }

    private void setupEventHandlers() {
        paymentMethodGroup.addValueChangeListener(e -> {
            PaymentMethod newMethod = e.getValue();
            if (newMethod != null && onPaymentMethodChanged != null) {
                onPaymentMethodChanged.accept(newMethod);
            }
        });

        paidAmountField.addValueChangeListener(e -> {
            Double value = e.getValue();
            if (value != null && onPaidAmountChanged != null) {
                BigDecimal amount = BigDecimal.valueOf(value);
                onPaidAmountChanged.accept(amount);
            }
        });
    }

    /**
     * Оновлює компонент з поточного domain state.
     */
    public void updateFromState(OrderParametersState state) {
        this.currentState = state;

        if (state != null) {
            // Оновлюємо спосіб оплати без тригера події
            paymentMethodGroup.setValue(state.getPaymentMethod());

            // Оновлюємо фінансові поля
            updateFinancialFields(state);

            // Оновлюємо валідацію
            updateValidationStyles(state);

            log.debug("Компонент оновлено з стану: спосіб={}, загальна сума={}, сплачено={}",
                    state.getPaymentMethod(), state.getTotalAmount(), state.getPaidAmount());
        }
    }

    private void updateFinancialFields(OrderParametersState state) {
        // Загальна вартість
        if (state.getTotalAmount() != null) {
            totalAmountField.setValue(state.getTotalAmount().doubleValue());
        }

        // Сплачено
        if (state.getPaidAmount() != null) {
            paidAmountField.setValue(state.getPaidAmount().doubleValue());
        }

        // Борг (розраховується автоматично)
        if (state.getDebtAmount() != null) {
            debtAmountField.setValue(state.getDebtAmount().doubleValue());
        }

        // Оновлюємо максимум для поля "Сплачено"
        if (state.getTotalAmount() != null) {
            paidAmountField.setMax(state.getTotalAmount().doubleValue());
        }
    }

    private void updateValidationStyles(OrderParametersState state) {
        // Валідація суми сплачено
        boolean isPaidAmountValid = state.getPaidAmount() != null &&
                                  state.getPaidAmount().compareTo(BigDecimal.ZERO) >= 0 &&
                                  state.getPaidAmount().compareTo(state.getTotalAmount()) <= 0;

        paidAmountField.setInvalid(!isPaidAmountValid);
        if (!isPaidAmountValid) {
            paidAmountField.setErrorMessage("Сума не може перевищувати загальну вартість");
        } else {
            paidAmountField.setErrorMessage(null);
        }

        // Кольорове кодування боргу
        updateDebtStyling(state);

        // Підсвічування способу оплати
        updatePaymentMethodStyling(state);
    }

    private void updateDebtStyling(OrderParametersState state) {
        if (state.isFullyPaid()) {
            debtAmountField.getStyle().set("color", "var(--lumo-success-text-color)");
            debtAmountField.getStyle().set("font-weight", "bold");
        } else if (state.getDebtAmount().compareTo(state.getTotalAmount()) == 0) {
            // Борг дорівнює повній сумі (не сплачено нічого)
            debtAmountField.getStyle().set("color", "var(--lumo-error-text-color)");
            debtAmountField.getStyle().set("font-weight", "normal");
        } else {
            // Часткова оплата
            debtAmountField.getStyle().set("color", "var(--lumo-warning-text-color)");
            debtAmountField.getStyle().set("font-weight", "normal");
        }
    }

    private void updatePaymentMethodStyling(OrderParametersState state) {
        switch (state.getPaymentMethod()) {
            case TERMINAL:
                paymentMethodGroup.getStyle().set("background", "var(--lumo-primary-color-10pct)");
                break;
            case CASH:
                paymentMethodGroup.getStyle().set("background", "var(--lumo-success-color-10pct)");
                break;
            case BANK_TRANSFER:
                paymentMethodGroup.getStyle().set("background", "var(--lumo-contrast-10pct)");
                break;
            default:
                paymentMethodGroup.getStyle().remove("background");
        }
    }

    /**
     * Встановлює загальну суму замовлення.
     */
    public void setTotalAmount(BigDecimal totalAmount) {
        if (totalAmount != null) {
            totalAmountField.setValue(totalAmount.doubleValue());
            paidAmountField.setMax(totalAmount.doubleValue());
            log.debug("Встановлено загальну суму: {}", totalAmount);
        }
    }

    /**
     * Встановлює мінімальну суму передоплати.
     */
    public void setMinPaidAmount(BigDecimal minAmount) {
        if (minAmount != null) {
            paidAmountField.setMin(minAmount.doubleValue());
            log.debug("Встановлено мінімальну передоплату: {}", minAmount);
        }
    }

    /**
     * Увімкнути/вимкнути спосіб оплати.
     */
    public void setPaymentMethodEnabled(boolean enabled) {
        paymentMethodGroup.setEnabled(enabled);
        log.debug("Спосіб оплати: {}", enabled ? "увімкнено" : "вимкнено");
    }

    /**
     * Увімкнути/вимкнути поле передоплати.
     */
    public void setPaidAmountEnabled(boolean enabled) {
        paidAmountField.setEnabled(enabled);
        log.debug("Поле передоплати: {}", enabled ? "увімкнено" : "вимкнено");
    }

    /**
     * Показати інформацію про фінансовий стан.
     */
    public void showFinancialSummary() {
        if (currentState != null) {
            String summary;
            if (currentState.isFullyPaid()) {
                summary = "✅ Замовлення повністю оплачено";
            } else if (currentState.getPaidAmount().compareTo(BigDecimal.ZERO) == 0) {
                summary = "❌ Оплата при отриманні: " + formatAmount(currentState.getTotalAmount());
            } else {
                summary = "⚠️ Частково оплачено. Залишок: " + formatAmount(currentState.getDebtAmount());
            }

            Span summarySpan = new Span(summary);
            summarySpan.getStyle()
                .set("font-size", "var(--lumo-font-size-s)")
                .set("margin-top", "var(--lumo-space-xs)")
                .set("font-weight", "500");

            add(summarySpan);
            log.debug("Показано фінансову інформацію: {}", summary);
        }
    }

    /**
     * Очистити додаткову інформацію.
     */
    public void clearAdditionalInfo() {
        // Видаляємо всі Span з додатковою інформацією
        getChildren()
            .filter(component -> component instanceof Span)
            .filter(component -> component.getElement().getText().contains("✅") ||
                               component.getElement().getText().contains("❌") ||
                               component.getElement().getText().contains("⚠️"))
            .forEach(this::remove);
    }

    /**
     * Отримати поточний спосіб оплати.
     */
    public PaymentMethod getSelectedPaymentMethod() {
        return paymentMethodGroup.getValue();
    }

    /**
     * Отримати поточну суму передоплати.
     */
    public BigDecimal getPaidAmount() {
        Double value = paidAmountField.getValue();
        return value != null ? BigDecimal.valueOf(value) : BigDecimal.ZERO;
    }

    /**
     * Отримати загальну суму.
     */
    public BigDecimal getTotalAmount() {
        Double value = totalAmountField.getValue();
        return value != null ? BigDecimal.valueOf(value) : BigDecimal.ZERO;
    }

    /**
     * Отримати суму боргу.
     */
    public BigDecimal getDebtAmount() {
        Double value = debtAmountField.getValue();
        return value != null ? BigDecimal.valueOf(value) : BigDecimal.ZERO;
    }

    /**
     * Перевірити чи компонент валідний.
     */
    public boolean isValid() {
        return !paidAmountField.isInvalid() &&
               getSelectedPaymentMethod() != null &&
               getPaidAmount().compareTo(BigDecimal.ZERO) >= 0 &&
               getPaidAmount().compareTo(getTotalAmount()) <= 0;
    }

    private String formatAmount(BigDecimal amount) {
        return String.format("₴%.2f", amount.doubleValue());
    }

    // Event handlers setters

    public void setOnPaymentMethodChanged(Consumer<PaymentMethod> handler) {
        this.onPaymentMethodChanged = handler;
    }

    public void setOnPaidAmountChanged(Consumer<BigDecimal> handler) {
        this.onPaidAmountChanged = handler;
    }

    // Геттери для тестування

    protected RadioButtonGroup<PaymentMethod> getPaymentMethodGroup() {
        return paymentMethodGroup;
    }

    protected NumberField getTotalAmountField() {
        return totalAmountField;
    }

    protected NumberField getPaidAmountField() {
        return paidAmountField;
    }

    protected NumberField getDebtAmountField() {
        return debtAmountField;
    }
}
