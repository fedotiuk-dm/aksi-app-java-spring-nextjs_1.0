package com.aksi.domain.order;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.aksi.domain.branch.BranchEntity;
import com.aksi.domain.common.BaseEntity;
import com.aksi.domain.customer.CustomerEntity;
import com.aksi.domain.user.UserEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Order entity representing a dry cleaning service order */
@Entity
@Table(
    name = "orders",
    indexes = {
      @Index(name = "idx_order_number", columnList = "order_number"),
      @Index(name = "idx_order_customer", columnList = "customer_id"),
      @Index(name = "idx_order_branch", columnList = "branch_id"),
      @Index(name = "idx_order_status", columnList = "status"),
      @Index(name = "idx_order_created_at", columnList = "created_at"),
      @Index(name = "idx_order_expected_completion", columnList = "expected_completion_date"),
      @Index(name = "idx_order_unique_label", columnList = "unique_label")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderEntity extends BaseEntity {

  @Column(name = "order_number", nullable = false, unique = true, length = 50)
  private String orderNumber;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "customer_id", nullable = false)
  private CustomerEntity customerEntity;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "branch_id", nullable = false)
  private BranchEntity branchEntity;

  @Column(name = "unique_label", length = 100)
  private String uniqueLabel;

  @Column(name = "status", nullable = false, length = 20)
  private String status = "PENDING";

  @OneToMany(
      mappedBy = "orderEntity",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private List<OrderItemEntity> items = new ArrayList<>();

  @OneToMany(
      mappedBy = "orderEntity",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private List<OrderPaymentEntity> payments = new ArrayList<>();

  @Column(name = "notes", columnDefinition = "TEXT")
  private String notes;

  @Column(name = "customer_signature", columnDefinition = "TEXT")
  private String customerSignature;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "created_by")
  private UserEntity createdBy;

  @Column(name = "expected_completion_date", nullable = false)
  private Instant expectedCompletionDate;

  @Column(name = "actual_completion_date")
  private Instant actualCompletionDate;

  @Column(name = "terms_accepted", nullable = false)
  private boolean termsAccepted = false;

  // Pricing snapshot fields
  @Column(name = "items_subtotal", nullable = false)
  private Integer itemsSubtotal = 0;

  @Column(name = "urgency_amount", nullable = false)
  private Integer urgencyAmount = 0;

  @Column(name = "discount_amount", nullable = false)
  private Integer discountAmount = 0;

  @Column(name = "discount_applicable_amount", nullable = false)
  private Integer discountApplicableAmount = 0;

  @Column(name = "total_amount", nullable = false)
  private Integer totalAmount = 0;
}
