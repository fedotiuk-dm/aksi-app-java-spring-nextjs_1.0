package com.aksi.domain.item.entity;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.aksi.domain.item.enums.ServiceCategoryCode;
import com.aksi.shared.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity for service categories in dry cleaning business */
@Entity
@Table(name = "service_categories")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceCategoryEntity extends BaseEntity {

  @Column(unique = true, nullable = false, length = 50)
  private String code;

  @Column(nullable = false)
  private String name;

  @Column(name = "standard_days", nullable = false)
  private Integer standardDays;

  @Column(name = "display_order")
  private Integer displayOrder;

  @Column(nullable = false)
  @Builder.Default
  private Boolean active = true;

  // Bidirectional relationship for easier querying
  @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
  @Builder.Default
  private List<PriceListItemEntity> priceListItems = new ArrayList<>();

  /**
   * Get the service category code as enum
   *
   * @return ServiceCategoryCode enum or null if code is invalid
   */
  public ServiceCategoryCode getCodeAsEnum() {
    try {
      return code != null ? ServiceCategoryCode.fromCode(code) : null;
    } catch (IllegalArgumentException e) {
      return null;
    }
  }

  /**
   * Set the code from enum
   *
   * @param categoryCode the category code enum
   */
  public void setCodeFromEnum(ServiceCategoryCode categoryCode) {
    this.code = categoryCode != null ? categoryCode.getCode() : null;
  }
}
