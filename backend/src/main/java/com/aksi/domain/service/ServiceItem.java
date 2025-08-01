package com.aksi.domain.service;

import java.math.BigDecimal;

import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

/**
 * Service-Item combination with pricing. Represents the price for a specific service applied to a
 * specific item.
 */
@Entity
@Table(
    name = "service_items",
    uniqueConstraints = @UniqueConstraint(columnNames = {"service_id", "item_id"}),
    indexes = {
      @Index(name = "idx_service_item_service", columnList = "service_id"),
      @Index(name = "idx_service_item_item", columnList = "item_id"),
      @Index(name = "idx_service_item_active", columnList = "active")
    })
@Getter
@Setter
public class ServiceItem extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "service_id", nullable = false)
  private Service service;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "item_id", nullable = false)
  private Item item;

  @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
  private BigDecimal basePrice;

  @Column(name = "express_price", precision = 10, scale = 2)
  private BigDecimal expressPrice;

  @Column(name = "processing_time_days")
  private Integer processingTimeDays;

  @Column(name = "express_time_hours")
  private Integer expressTimeHours;

  @Column(name = "complexity_factor", precision = 3, scale = 2)
  private BigDecimal complexityFactor = BigDecimal.ONE;

  @Column(name = "notes", columnDefinition = "TEXT")
  private String notes;

  @Column(name = "active", nullable = false)
  private boolean active;

  @Column(name = "available_for_order", nullable = false)
  private boolean availableForOrder;
}
