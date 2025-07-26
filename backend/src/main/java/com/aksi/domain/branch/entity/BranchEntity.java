package com.aksi.domain.branch.entity;

import java.util.HashSet;
import java.util.Set;

import com.aksi.shared.BaseEntity;
import com.aksi.shared.embedded.Address;
import com.aksi.shared.embedded.ContactInfo;
import com.aksi.shared.validation.ValidationConstants;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity representing a branch (филія) of the dry cleaning service. Contains branch information,
 * contact details, address, and working schedules.
 */
@Entity
@Table(name = "branches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BranchEntity extends BaseEntity {

  @Column(name = "name", nullable = false, length = ValidationConstants.Branch.NAME_MAX_LENGTH)
  @NotBlank(message = ValidationConstants.Messages.BRANCH_NAME_CANNOT_BE_BLANK)
  @Size(
      min = ValidationConstants.Branch.NAME_MIN_LENGTH,
      max = ValidationConstants.Branch.NAME_MAX_LENGTH,
      message = ValidationConstants.Messages.BRANCH_NAME_SIZE_MESSAGE)
  private String name;

  @Column(
      name = "receipt_prefix",
      nullable = false,
      unique = true,
      length = ValidationConstants.Branch.RECEIPT_PREFIX_MAX_LENGTH)
  @NotBlank(message = ValidationConstants.Messages.RECEIPT_PREFIX_CANNOT_BE_BLANK)
  @Pattern(
      regexp = ValidationConstants.Patterns.RECEIPT_PREFIX_PATTERN,
      message = ValidationConstants.Messages.RECEIPT_PREFIX_INVALID_FORMAT)
  @Size(
      min = ValidationConstants.Branch.RECEIPT_PREFIX_MIN_LENGTH,
      max = ValidationConstants.Branch.RECEIPT_PREFIX_MAX_LENGTH)
  private String receiptPrefix;

  @Embedded
  @AttributeOverrides({
    @AttributeOverride(name = "phone", column = @Column(name = "phone")),
    @AttributeOverride(name = "email", column = @Column(name = "email"))
  })
  @Valid
  private ContactInfo contactInfo;

  @Embedded
  @AttributeOverrides({
    @AttributeOverride(name = "street", column = @Column(name = "street")),
    @AttributeOverride(name = "city", column = @Column(name = "city")),
    @AttributeOverride(name = "region", column = @Column(name = "region")),
    @AttributeOverride(name = "postalCode", column = @Column(name = "postal_code")),
    @AttributeOverride(name = "country", column = @Column(name = "country"))
  })
  @Valid
  private Address address;

  @Column(name = "is_active", nullable = false)
  private boolean active = true;

  @OneToMany(
      mappedBy = "branch",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private Set<WorkingScheduleEntity> workingSchedules = new HashSet<>();
}
