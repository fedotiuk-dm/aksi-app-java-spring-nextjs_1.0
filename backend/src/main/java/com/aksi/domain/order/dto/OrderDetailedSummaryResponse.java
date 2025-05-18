package com.aksi.domain.order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.model.ExpediteType;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для детального підсумку замовлення.
 * Містить повну інформацію про замовлення для етапу перегляду та підтвердження.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Детальний підсумок замовлення для етапу перегляду та підтвердження")
public class OrderDetailedSummaryResponse {
    
    /**
     * ID замовлення.
     */
    @Schema(description = "ID замовлення", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID id;
    
    /**
     * Номер квитанції замовлення.
     */
    @Schema(description = "Номер квитанції замовлення", example = "АК-12345")
    private String receiptNumber;
    
    /**
     * Номер мітки замовлення.
     */
    @Schema(description = "Номер мітки замовлення", example = "М-12345")
    private String tagNumber;
    
    /**
     * Детальна інформація про клієнта.
     */
    @Schema(description = "Детальна інформація про клієнта")
    private ClientResponse client;
    
    /**
     * Філія, в якій оформлено замовлення.
     */
    @Schema(description = "Філія, в якій оформлено замовлення")
    private BranchLocationDTO branchLocation;
    
    /**
     * Список предметів замовлення з детальними розрахунками.
     */
    @Schema(description = "Список предметів замовлення з детальними розрахунками")
    private List<OrderItemDetailedDTO> items;
    
    /**
     * Загальна вартість замовлення до знижок.
     */
    @Schema(description = "Загальна вартість замовлення до знижок", example = "500.00")
    private BigDecimal totalAmount;
    
    /**
     * Сума знижки.
     */
    @Schema(description = "Сума знижки", example = "50.00")
    private BigDecimal discountAmount;
    
    /**
     * Сума надбавки за терміновість.
     */
    @Schema(description = "Сума надбавки за терміновість", example = "250.00")
    private BigDecimal expediteSurchargeAmount;
    
    /**
     * Фінальна вартість замовлення з урахуванням знижок та надбавок.
     */
    @Schema(description = "Фінальна вартість замовлення з урахуванням знижок та надбавок", example = "700.00")
    private BigDecimal finalAmount;
    
    /**
     * Сума передоплати.
     */
    @Schema(description = "Сума передоплати", example = "200.00")
    private BigDecimal prepaymentAmount;
    
    /**
     * Сума до сплати при отриманні.
     */
    @Schema(description = "Сума до сплати при отриманні", example = "500.00")
    private BigDecimal balanceAmount;
    
    /**
     * Тип термінового виконання.
     */
    @Schema(description = "Тип термінового виконання", example = "EXPRESS_48H",
            enumAsRef = true)
    private ExpediteType expediteType;
    
    /**
     * Очікувана дата виконання замовлення.
     */
    @Schema(description = "Очікувана дата виконання замовлення", 
            example = "2023-05-15T14:00:00")
    private LocalDateTime expectedCompletionDate;
    
    /**
     * Дата створення замовлення.
     */
    @Schema(description = "Дата створення замовлення", 
            example = "2023-05-12T10:30:00")
    private LocalDateTime createdDate;
    
    /**
     * Примітки клієнта.
     */
    @Schema(description = "Примітки клієнта", 
            example = "Не використовувати відбілювач")
    private String customerNotes;
    
    /**
     * Тип знижки (якщо застосовується).
     */
    @Schema(description = "Тип знижки", example = "SOCIAL")
    private String discountType;
    
    /**
     * Відсоток знижки (якщо застосовується).
     */
    @Schema(description = "Відсоток знижки", example = "10")
    private Integer discountPercentage;
} 