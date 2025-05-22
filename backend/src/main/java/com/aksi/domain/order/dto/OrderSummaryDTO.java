package com.aksi.domain.order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.aksi.domain.order.model.OrderStatusEnum;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для короткої інформації про замовлення.
 * Використовується для відображення історії замовлень клієнта.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderSummaryDTO {

    /**
     * Ідентифікатор замовлення.
     */
    private UUID id;

    /**
     * Номер квитанції.
     */
    private String receiptNumber;

    /**
     * Статус замовлення.
     */
    private OrderStatusEnum status;

    /**
     * Загальна сума замовлення.
     */
    private BigDecimal totalAmount;

    /**
     * Дата створення замовлення.
     */
    private LocalDateTime createdAt;

    /**
     * Дата виконання замовлення.
     */
    private LocalDateTime completionDate;

    /**
     * Кількість предметів у замовленні.
     */
    private Integer itemCount;
}
