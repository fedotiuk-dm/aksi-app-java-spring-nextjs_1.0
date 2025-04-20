package com.aksi.domain.order.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Entity representing a stain on an order item.
 */
@Entity
@Table(name = "order_item_stains")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemStain {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    /**
     * The order item this stain is on.
     */
    @ManyToOne
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    /**
     * Type of the stain.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StainType type;

    /**
     * Description of the stain (for OTHER type or additional information).
     */
    @Column(columnDefinition = "TEXT")
    private String stainDescription;
    

}
