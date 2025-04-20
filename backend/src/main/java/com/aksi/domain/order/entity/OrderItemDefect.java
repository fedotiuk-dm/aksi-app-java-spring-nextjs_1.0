package com.aksi.domain.order.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Entity representing a defect on an order item.
 */
@Entity
@Table(name = "order_item_defects")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDefect {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    /**
     * The order item this defect is on.
     */
    @ManyToOne
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    /**
     * Type of the defect.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DefectType type;

    /**
     * Description of the defect (for OTHER type or additional information).
     */
    @Column(columnDefinition = "TEXT")
    private String description;
}
