package com.aksi.domain.catalog;

import java.util.HashSet;
import java.util.Set;

import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/** Service entity representing types of cleaning services. */
@Entity
@Table(
    name = "services",
    indexes = {
      @Index(name = "idx_service_code", columnList = "code", unique = true),
      @Index(name = "idx_service_category", columnList = "category"),
      @Index(name = "idx_service_active", columnList = "active")
    })
@Getter
@Setter
@ToString(exclude = "serviceItems")
public class ServiceCatalog extends BaseEntity {

  @Column(name = "code", nullable = false, unique = true, length = 20)
  private String code;

  @Column(name = "name", nullable = false, length = 100)
  private String name;

  @Column(name = "description", columnDefinition = "TEXT")
  private String description;

  @Column(name = "category", nullable = false, length = 50)
  @Enumerated(EnumType.STRING)
  private ServiceCategoryType category;

  @Column(name = "processing_time_days", nullable = false)
  private Integer processingTimeDays;

  @Column(name = "express_available", nullable = false)
  private boolean expressAvailable;

  @Column(name = "express_time_hours")
  private Integer expressTimeHours;

  @Column(name = "active", nullable = false)
  private boolean active;

  @Column(name = "sort_order")
  private Integer sortOrder;

  @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<ServiceItem> serviceItems = new HashSet<>();
}
