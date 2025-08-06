package com.aksi.domain.user;

import java.util.UUID;

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
 * Many-to-many relationship between users and branches. Allows users to work at multiple branches.
 */
@Entity
@Table(
    name = "user_branch_assignments",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "branch_id"}),
    indexes = {
      @Index(name = "idx_assignment_user", columnList = "user_id"),
      @Index(name = "idx_assignment_branch", columnList = "branch_id"),
      @Index(name = "idx_assignment_primary", columnList = "is_primary")
    })
@Getter
@Setter
public class UserBranchAssignmentEntity extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private UserEntity userEntityEntity;

  @Column(name = "branch_id", nullable = false)
  private UUID branchId;

  @Column(name = "is_primary", nullable = false)
  private boolean primary;

  @Column(name = "active", nullable = false)
  private boolean active = true;
}
