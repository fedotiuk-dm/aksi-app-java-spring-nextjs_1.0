package com.aksi.domain.order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.model.OrderStatusEnum;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для замовлення.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {

    private UUID id;

    @NotBlank(message = "Номер квитанції обов'язковий")
    private String receiptNumber;

    private String tagNumber;

    @NotNull(message = "Клієнт обов'язковий")
    private ClientResponse client;

    /**
     * ID клієнта для зручного доступу з фронтенду.
     * Значення дублює client.id, але дозволяє спростити маппінг на фронтенді.
     */
    private UUID clientId;

    @Valid
    @Builder.Default
    private List<OrderItemDTO> items = new ArrayList<>();

    private BigDecimal totalAmount;

    private BigDecimal discountAmount;

    private BigDecimal finalAmount;

    private BigDecimal prepaymentAmount;

    private BigDecimal balanceAmount;

    @NotNull(message = "Філія обов'язкова")
    private BranchLocationDTO branchLocation;

    /**
     * ID філії для зручного доступу з фронтенду.
     * Значення дублює branchLocation.id, але дозволяє спростити маппінг на фронтенді.
     */
    private UUID branchLocationId;

    @NotNull(message = "Статус обов'язковий")
    private OrderStatusEnum status;

    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;

    private LocalDateTime expectedCompletionDate;

    private LocalDateTime completedDate;

    @Size(max = 1000, message = "Примітки клієнта не можуть перевищувати 1000 символів")
    private String customerNotes;

    @Size(max = 1000, message = "Внутрішні примітки не можуть перевищувати 1000 символів")
    private String internalNotes;

    /**
     * Тип термінового виконання.
     */
    @Builder.Default
    private ExpediteType expediteType = ExpediteType.STANDARD;

    private boolean isPrinted;
    private boolean isEmailed;
    private String completionComments;
    private boolean termsAccepted;
    private LocalDateTime finalizedAt;

    private boolean express;
    private boolean draft;
}
