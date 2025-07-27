package com.aksi.domain.item.entity;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.aksi.domain.item.entity.embeddable.PriceDetails;
import com.aksi.domain.item.enums.UnitOfMeasure;
import com.aksi.shared.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity for price list items */
@Entity
@Table(
    name = "price_list_items",
    uniqueConstraints = @UniqueConstraint(columnNames = {"category_code", "catalog_number"}),
    indexes = {
      @Index(name = "idx_price_list_active", columnList = "active"),
      @Index(name = "idx_price_list_category", columnList = "category_code")
    })
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceListItemEntity extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "category_code", referencedColumnName = "code", nullable = false)
  private ServiceCategoryEntity category;

  @Column(name = "catalog_number", nullable = false)
  private Integer catalogNumber;

  @Column(nullable = false)
  private String name;

  @Column(name = "unit_of_measure", nullable = false, length = 20)
  @Enumerated(EnumType.STRING)
  private UnitOfMeasure unitOfMeasure;

  @Embedded private PriceDetails priceDetails;

  @Column(nullable = false)
  @Builder.Default
  private Boolean active = true;
}
