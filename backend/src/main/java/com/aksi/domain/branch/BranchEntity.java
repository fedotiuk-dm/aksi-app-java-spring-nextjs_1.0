package com.aksi.domain.branch;

import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Branch entity representing dry cleaning service locations */
@Entity
@Table(
    name = "branches",
    indexes = {
      @Index(name = "idx_branch_name", columnList = "name"),
      @Index(name = "idx_branch_active", columnList = "active"),
      @Index(name = "idx_branch_sort_order", columnList = "sort_order")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BranchEntity extends BaseEntity {

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "address", nullable = false, columnDefinition = "TEXT")
  private String address;

  @Column(name = "phone", nullable = false, length = 20)
  private String phone;

  @Column(name = "email", length = 255)
  private String email;

  @Column(name = "working_hours", length = 255)
  private String workingHours;

  @Column(name = "active", nullable = false)
  private boolean active = true;

  @Column(name = "description", columnDefinition = "TEXT")
  private String description;

  @Column(name = "sort_order", nullable = false)
  private Integer sortOrder = 0;
}
