package com.aksi.domain.order;

import java.time.Instant;

import com.aksi.api.order.dto.PaymentMethod;
import com.aksi.domain.common.BaseEntity;
import com.aksi.domain.user.UserEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Order payment entity for tracking payments associated with orders */
@Entity
@Table(
    name = "order_payments",
    indexes = {
      @Index(name = "idx_order_payment_order", columnList = "order_id"),
      @Index(name = "idx_order_payment_method", columnList = "payment_method"),
      @Index(name = "idx_order_payment_paid_at", columnList = "paid_at")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderPaymentEntity extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "order_id", nullable = false)
  private OrderEntity orderEntity;

  @Column(name = "amount", nullable = false)
  private Integer amount;

  @Enumerated(EnumType.STRING)
  @Column(name = "payment_method", nullable = false, length = 20)
  private PaymentMethod method;

  @Column(name = "paid_at", nullable = false)
  private Instant paidAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "paid_by")
  private UserEntity paidBy;

  @Column(name = "reference_number", length = 100)
  private String referenceNumber;

  @Column(name = "notes", columnDefinition = "TEXT")
  private String notes;
}
