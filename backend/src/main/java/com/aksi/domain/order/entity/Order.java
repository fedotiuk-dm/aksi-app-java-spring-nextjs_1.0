package com.aksi.domain.order.entity;

import com.aksi.domain.client.entity.Client;
import jakarta.persistence.*;
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
 * Entity representing an order in the dry cleaning system.
 */
@Entity
@Table(name = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    /**
     * A unique receipt number for this order.
     */
    @Column(name = "receipt_number", unique = true, nullable = false)
    private String receiptNumber;

    /**
     * The unique tag associated with this order.
     */
    @Column(name = "unique_tag")
    private String uniqueTag;
    
    /**
     * The branch/office where the order was received.
     */
    @Column(name = "reception_point", nullable = false)
    private String receptionPoint;
    
    /**
     * Date and time when the order was created.
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    /**
     * Expected completion date.
     */
    @Column(name = "expected_completion_date", nullable = false)
    private LocalDate expectedCompletionDate;
    
    /**
     * The client associated with this order.
     */
    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
    
    /**
     * Current status of the order.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;
    
    /**
     * Urgency type of the order.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "urgency_type", nullable = false)
    private UrgencyType urgencyType;
    
    /**
     * Type of discount applied to the order.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    private DiscountType discountType;
    
    /**
     * Custom discount percentage, valid only when discountType is CUSTOM.
     */
    @Column(name = "custom_discount_percentage")
    private Integer customDiscountPercentage;

    /**
     * Payment method used for the order.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;
    
    /**
     * Total price before discounts and surcharges.
     */
    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;
    
    /**
     * Final total price after all discounts and surcharges.
     */
    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;
    
    /**
     * Amount already paid (prepayment).
     */
    @Column(name = "amount_paid", nullable = false, precision = 10, scale = 2)
    private BigDecimal amountPaid;
    
    /**
     * Amount remaining to be paid.
     */
    @Column(name = "amount_due", nullable = false, precision = 10, scale = 2)
    private BigDecimal amountDue;
    
    /**
     * Additional notes for the order.
     */
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    /**
     * Additional client requirements.
     */
    @Column(name = "client_requirements", columnDefinition = "TEXT")
    private String clientRequirements;
    
    /**
     * Client's signature stored as a Base64 encoded image.
     */
    @Column(name = "client_signature", columnDefinition = "TEXT")
    private String clientSignature;
    
    /**
     * The items in this order.
     */
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();
    
    /**
     * Helper method to add an item to the order.
     * 
     * @param item The item to add
     */
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
    
    /**
     * Helper method to remove an item from the order.
     * 
     * @param item The item to remove
     */
    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }
    
    /**
     * Recalculates the total amounts based on the current items.
     */
    public void recalculateAmounts() {
        // This will be implemented in the service layer
    }
}
