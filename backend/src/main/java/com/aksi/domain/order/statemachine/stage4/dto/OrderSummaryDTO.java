package com.aksi.domain.order.statemachine.stage4.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.model.DiscountType;
import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.model.PaymentMethod;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для підетапу 4.1 - Перегляд замовлення з детальним розрахунком.
 *
 * Містить повний підсумок замовлення з деталізацією розрахунків з реальних даних OrderDTO.
 * Використовує готові DTO з domain layer та не містить хардкодженних значень.
 *
 * ✅ Рефакторинг архітектури:
 *    - DTO містить тільки дані (Transport Object) - дотримання SRP
 *    - Презентаційна логіка винесена в OrderSummaryPresentationService
 *    - Валюта винесена в CurrencyConfiguration (app.currency.*)
 *    - Форматування через CurrencyFormattingService з DI
 *
 * @see com.aksi.domain.order.statemachine.stage4.service.OrderSummaryPresentationService
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderSummaryDTO {

    // === Базова інформація замовлення ===

    /**
     * Номер квитанції.
     */
    private String receiptNumber;

    /**
     * Унікальна мітка.
     */
    private String tagNumber;

    /**
     * Інформація про клієнта (з реального ClientResponse).
     */
    private ClientResponse client;

    /**
     * Пункт прийому замовлення (з реального BranchLocationDTO).
     */
    private BranchLocationDTO branchLocation;

    /**
     * Дата створення замовлення.
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdDate;

    /**
     * Очікувана дата виконання.
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime expectedCompletionDate;

    // === Предмети замовлення ===

    /**
     * Список предметів з реальних OrderItemDTO.
     */
    @Builder.Default
    private List<OrderItemDTO> items = new ArrayList<>();

    // === Розрахунки вартості ===

    /**
     * Загальна вартість предметів (до знижок і надбавок).
     */
    private BigDecimal subtotalAmount;

    /**
     * Тип знижки (з реального DiscountType enum).
     */
    @Builder.Default
    private DiscountType discountType = DiscountType.NO_DISCOUNT;

    /**
     * Сума знижки.
     */
    private BigDecimal discountAmount;

    /**
     * Відсоток знижки.
     */
    private Integer discountPercentage;

    /**
     * Опис знижки.
     */
    private String discountDescription;

    /**
     * Тип термінового виконання (з реального ExpediteType enum).
     */
    @Builder.Default
    private ExpediteType expediteType = ExpediteType.STANDARD;

    /**
     * Сума надбавки за термінове виконання.
     */
    private BigDecimal expediteAmount;

    /**
     * Відсоток надбавки за термінове виконання.
     */
    private Integer expeditePercentage;

    /**
     * Фінальна сума (з урахуванням знижок і надбавок).
     */
    private BigDecimal finalAmount;

    // === Оплата ===

    /**
     * Спосіб оплати (з реального PaymentMethod enum).
     */
    private PaymentMethod paymentMethod;

    /**
     * Сума передоплати.
     */
    private BigDecimal prepaymentAmount;

    /**
     * Сума до сплати (борг).
     */
    private BigDecimal balanceAmount;

    // === Додаткова інформація ===

    /**
     * Загальні примітки до замовлення.
     */
    private String customerNotes;

    /**
     * Додаткові вимоги клієнта.
     */
    private String additionalRequirements;

    /**
     * Внутрішні примітки (для персоналу).
     */
    private String internalNotes;

    // === Стан та валідація ===

    /**
     * Чи завершено перегляд.
     */
    @Builder.Default
    private Boolean isReviewed = false;

    /**
     * Чи є помилки у даних.
     */
    @Builder.Default
    private Boolean hasErrors = false;

    /**
     * Чи відбувається завантаження.
     */
    @Builder.Default
    private Boolean isLoading = false;

    /**
     * Повідомлення про помилку.
     */
    private String errorMessage;

    /**
     * Список помилок валідації.
     */
    @Builder.Default
    private List<String> errorMessages = new ArrayList<>();

    /**
     * Час останнього оновлення.
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastUpdated;

    // === Утиліти ===

    /**
     * Кількість предметів у замовленні.
     */
    public int getItemsCount() {
        return items != null ? items.size() : 0;
    }

    /**
     * Загальна кількість одиниць товару.
     */
    public int getTotalQuantity() {
        if (items == null) {
            return 0;
        }
        return items.stream()
                   .mapToInt(OrderItemDTO::getQuantity)
                   .sum();
    }

    /**
     * Перевіряє, чи застосовується знижка.
     */
    public boolean hasDiscount() {
        return discountType != null && discountType != DiscountType.NO_DISCOUNT
               && discountAmount != null && discountAmount.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Перевіряє, чи є надбавка за термінове виконання.
     */
    public boolean hasExpediteCharge() {
        return expediteType != null && expediteType != ExpediteType.STANDARD
               && expediteAmount != null && expediteAmount.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Перевіряє, чи є борг для сплати.
     */
    public boolean hasBalanceAmount() {
        return balanceAmount != null && balanceAmount.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Перевіряє, чи є передоплата.
     */
    public boolean hasPrepayment() {
        return prepaymentAmount != null && prepaymentAmount.compareTo(BigDecimal.ZERO) > 0;
    }



    /**
     * Очищає помилки.
     */
    public void clearErrors() {
        this.hasErrors = false;
        this.errorMessage = null;
        if (this.errorMessages != null) {
            this.errorMessages.clear();
        }
    }

    /**
     * Додає помилку до списку.
     */
    public void addError(String error) {
        this.hasErrors = true;
        if (this.errorMessages == null) {
            this.errorMessages = new ArrayList<>();
        }
        this.errorMessages.add(error);
    }

    /**
     * Встановлює загальну помилку.
     */
    public void setError(String error) {
        this.hasErrors = true;
        this.errorMessage = error;
    }

    /**
     * Перевіряє валідність даних для переходу далі.
     *
     * Примітка: Детальна валідація винесена в OrderSummaryValidationService.
     * Цей метод залишений для зворотної сумісності з простою перевіркою.
     */
    public boolean isValid() {
        return !hasErrors && items != null && !items.isEmpty()
               && finalAmount != null && client != null;
    }

    /**
     * Оновлює timestamp.
     */
    public void updateTimestamp() {
        this.lastUpdated = LocalDateTime.now();
    }

    // Примітка: Методи форматування винесені в OrderSummaryPresentationService
    // для дотримання принципу Single Responsibility
}
