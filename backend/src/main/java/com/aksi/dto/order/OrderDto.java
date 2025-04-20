package com.aksi.dto.order;

import com.aksi.domain.order.entity.DiscountType;
import com.aksi.domain.order.entity.OrderStatus;
import com.aksi.domain.order.entity.PaymentMethod;
import com.aksi.domain.order.entity.UrgencyType;
import com.aksi.dto.client.ClientDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Data Transfer Object for Order entity.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private UUID id;
    private String receiptNumber;
    private String uniqueTag;
    private String receptionPoint;
    private LocalDateTime createdAt;
    private LocalDate expectedCompletionDate;
    private ClientDTO client;
    private OrderStatus status;
    private UrgencyType urgencyType;
    private DiscountType discountType;
    private Integer customDiscountPercentage;
    private PaymentMethod paymentMethod;
    private BigDecimal basePrice;
    private BigDecimal totalPrice;
    private BigDecimal amountPaid;
    private BigDecimal amountDue;
    private String notes;
    private String clientRequirements;
    private String clientSignature;
    
    @Builder.Default
    private List<OrderItemDto> items = new ArrayList<>();
}
