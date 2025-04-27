package com.aksi.domain.order.entity;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Елемент (предмет) замовлення у хімчистці.
 */
@Entity
@Table(name = "order_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @ToString.Exclude
    private OrderEntity order;
    
    @Column(name = "item_name", nullable = false)
    private String name;
    
    @Column(name = "description", length = 1000)
    private String description;
    
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    
    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;
    
    @Column(name = "total_price", nullable = false)
    @Builder.Default
    private BigDecimal totalPrice = BigDecimal.ZERO;
    
    @Column(name = "category")
    private String category;
    
    @Column(name = "color")
    private String color;
    
    @Column(name = "material")
    private String material;
    
    @Column(name = "unit_of_measure")
    private String unitOfMeasure;
    
    @Column(name = "defects")
    private String defects;
    
    @Column(name = "special_instructions", length = 500)
    private String specialInstructions;
    
    /**
     * Розрахувати повну вартість предмету.
     */
    public void recalculateTotalPrice() {
        if (quantity != null && unitPrice != null) {
            this.totalPrice = unitPrice.multiply(new BigDecimal(quantity));
        }
    }
}
