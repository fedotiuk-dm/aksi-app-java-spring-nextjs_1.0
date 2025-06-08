package com.aksi.domain.order.statemachine.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.statemachine.OrderState;
import com.fasterxml.jackson.annotation.JsonFormat;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для контексту Order Wizard.
 * Містить всі дані сесії wizard для передачі між етапами.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Контекст Order Wizard з усіма даними сесії")
public class WizardContextDTO {

    // Основна інформація сесії
    @Schema(description = "Унікальний ідентифікатор wizard", example = "wizard-123e4567-e89b-12d3-a456-426614174000")
    private String wizardId;

    @Schema(description = "Поточний стан wizard", example = "CLIENT_SELECTION")
    private OrderState currentState;

    @Schema(description = "Час створення сесії")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @Schema(description = "Час останнього оновлення")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    // Етап 1: Дані клієнта та базової інформації
    @Schema(description = "Дані вибраного клієнта")
    private ClientResponse selectedClient;

    @Schema(description = "Дані вибраної філії")
    private BranchLocationDTO selectedBranch;

    @Schema(description = "Номер квитанції", example = "AKSI-K1-2024120114-1234")
    private String receiptNumber;

    @Schema(description = "Унікальна мітка", example = "AKSI-TAG-001")
    private String uniqueTag;

    @Schema(description = "Час створення замовлення")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime orderCreationTime;

    // Етап 2: Дані предметів
    @Schema(description = "Список предметів в замовленні")
    private List<OrderItemContextDTO> orderItems;

    @Schema(description = "Загальна кількість предметів", example = "5")
    private Integer totalItemsCount;

    @Schema(description = "Загальна вартість предметів", example = "1250.75")
    private BigDecimal totalItemsPrice;

    // Етап 3: Параметри виконання та оплати
    @Schema(description = "Дата виконання замовлення")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate executionDate;

    @Schema(description = "Тип терміновості", example = "NORMAL")
    private String urgencyType;

    @Schema(description = "Додаткова плата за терміновість", example = "125.50")
    private BigDecimal urgencySurcharge;

    @Schema(description = "Тип знижки", example = "EVERCARD")
    private String discountType;

    @Schema(description = "Сума знижки", example = "75.25")
    private BigDecimal discountAmount;

    @Schema(description = "Спосіб оплати", example = "TERMINAL")
    private String paymentMethod;

    @Schema(description = "Сплачено (передоплата)", example = "500.00")
    private BigDecimal paidAmount;

    @Schema(description = "Залишок до сплати", example = "675.50")
    private BigDecimal remainingAmount;

    @Schema(description = "Загальна вартість замовлення", example = "1175.50")
    private BigDecimal totalOrderPrice;

    // Етап 4: Додаткова інформація та завершення
    @Schema(description = "Примітки до замовлення")
    private String orderNotes;

    @Schema(description = "Додаткові вимоги клієнта")
    private String additionalRequirements;

    @Schema(description = "Згода з умовами", example = "true")
    private Boolean termsAccepted;

    @Schema(description = "Цифровий підпис клієнта (Base64)")
    private String digitalSignature;

    @Schema(description = "Чи згенерована квитанція", example = "false")
    private Boolean receiptGenerated;

    @Schema(description = "Посилання на PDF квитанцію")
    private String receiptPdfUrl;

    // Службові поля
    @Schema(description = "Додаткові дані (ключ-значення)")
    private Map<String, Object> extendedData;

    @Schema(description = "Історія переходів")
    private List<StateTransitionHistoryDTO> transitionHistory;

    /**
     * DTO для предмета в контексті wizard.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Предмет в контексті Order Wizard")
    public static class OrderItemContextDTO {

        @Schema(description = "Тимчасовий ID предмета в wizard", example = "item-1")
        private String tempItemId;

        @Schema(description = "ID предмета в БД після збереження")
        private UUID actualItemId;

        @Schema(description = "Назва предмета", example = "Пальто чоловіче")
        private String itemName;

        @Schema(description = "Категорія", example = "CLOTHING_CLEANING")
        private String category;

        @Schema(description = "Кількість", example = "1")
        private Integer quantity;

        @Schema(description = "Одиниця виміру", example = "ШТ")
        private String unit;

        @Schema(description = "Матеріал", example = "WOOL")
        private String material;

        @Schema(description = "Колір", example = "Чорний")
        private String color;

        @Schema(description = "Базова ціна", example = "150.00")
        private BigDecimal basePrice;

        @Schema(description = "Фінальна ціна з модифікаторами", example = "180.00")
        private BigDecimal finalPrice;

        @Schema(description = "Список застосованих модифікаторів")
        private List<String> appliedModifiers;

        @Schema(description = "Фото предметів")
        private List<String> photoUrls;
    }

    /**
     * DTO для історії переходів.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Запис історії переходів між станами")
    public static class StateTransitionHistoryDTO {

        @Schema(description = "Попередній стан", example = "CLIENT_SELECTION")
        private OrderState fromState;

        @Schema(description = "Новий стан", example = "ORDER_INITIALIZATION")
        private OrderState toState;

        @Schema(description = "Подія переходу", example = "SELECT_CLIENT")
        private String event;

        @Schema(description = "Час переходу")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime transitionTime;

        @Schema(description = "Дані, передані з переходом")
        private Map<String, Object> transitionData;
    }
}
