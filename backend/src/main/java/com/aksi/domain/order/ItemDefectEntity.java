package com.aksi.domain.order;

import com.aksi.api.order.dto.DefectType;
import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Item defect entity for tracking defects on order items */
@Entity
@Table(
    name = "item_defects",
    indexes = {
      @Index(name = "idx_item_defect_order_item", columnList = "order_item_id"),
      @Index(name = "idx_item_defect_type", columnList = "defect_type")
    })
@Getter
@Setter
@NoArgsConstructor
public class ItemDefectEntity extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "order_item_id", nullable = false)
  private OrderItemEntity orderItemEntity;

  @Enumerated(EnumType.STRING)
  @Column(name = "defect_type", nullable = false, length = 30)
  private DefectType type;

  @Column(name = "description", columnDefinition = "TEXT")
  private String description;
}
