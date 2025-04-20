package com.aksi.dto.order;

import com.aksi.domain.order.entity.DiscountType;
import com.aksi.domain.order.entity.PaymentMethod;
import com.aksi.domain.order.entity.UrgencyType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Request DTO for creating a new order.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreateRequest {
    /**
     * Client ID for the order.
     */
    @NotNull(message = "Client ID is required")
    private UUID clientId;
    
    /**
     * Optional unique tag for the order.
     */
    private String uniqueTag;
    
    /**
     * Reception point or branch where the order was received.
     */
    @NotBlank(message = "Reception point is required")
    private String receptionPoint;
    
    /**
     * Expected completion date for the order.
     */
    @NotNull(message = "Expected completion date is required")
    private LocalDate expectedCompletionDate;
    
    /**
     * Urgency type of the order.
     */
    @NotNull(message = "Urgency type is required")
    private UrgencyType urgencyType;
    
    /**
     * Discount type applied to the order.
     */
    @NotNull(message = "Discount type is required")
    private DiscountType discountType;
    
    /**
     * Custom discount percentage (only used when discountType is CUSTOM).
     */
    private Integer customDiscountPercentage;
    
    /**
     * Payment method for the order.
     */
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
    
    /**
     * Amount already paid (prepayment).
     */
    @NotNull(message = "Amount paid is required")
    @PositiveOrZero(message = "Amount paid must be zero or positive")
    private BigDecimal amountPaid;
    
    /**
     * Additional notes for the order.
     */
    private String notes;
    
    /**
     * Additional client requirements.
     */
    private String clientRequirements;
}
