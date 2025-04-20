package com.aksi.domain.order.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Entity representing a price modifier applied to an order item.
 */
@Entity
@Table(name = "order_item_modifiers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemModifier {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    /**
     * The order item this modifier is applied to.
     */
    @ManyToOne
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    /**
     * Name of the modifier.
     */
    @Column(nullable = false)
    private String name;

    /**
     * Description of the modifier.
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * Type of the modifier (percentage or fixed amount).
     */
    @Column(nullable = false)
    private String type;

    /**
     * Value of the modifier (percentage or fixed amount depending on type).
     */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal value;

    /**
     * The monetary impact this modifier had on the base price.
     */
    @Column(name = "price_impact", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceImpact;

    /**
     * Whether this modifier replaces the base price entirely.
     */
    @Column(name = "replaces_base_price")
    private Boolean replacesBasePrice;

    /**
     * Order of application for this modifier (sequence).
     */
    @Column(name = "application_order", nullable = false)
    private Integer applicationOrder;
}
