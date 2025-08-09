package com.aksi.domain.order;

import com.aksi.api.order.dto.FillerCondition;
import com.aksi.api.order.dto.WearLevel;
import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Item characteristics entity storing detailed information about order items */
@Entity
@Table(
    name = "item_characteristics",
    indexes = {@Index(name = "idx_item_characteristics_order_item", columnList = "order_item_id")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemCharacteristicsEntity extends BaseEntity {

  @OneToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "order_item_id", nullable = false)
  private OrderItemEntity orderItemEntity;

  @Column(name = "material", length = 100)
  private String material;

  @Column(name = "color", length = 50)
  private String color;

  @Column(name = "filler", length = 100)
  private String filler;

  @Enumerated(EnumType.STRING)
  @Column(name = "filler_condition", length = 20)
  private FillerCondition fillerCondition;

  @Enumerated(EnumType.STRING)
  @Column(name = "wear_level", length = 20)
  private WearLevel wearLevel;
}
