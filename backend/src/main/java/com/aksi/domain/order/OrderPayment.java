package com.aksi.domain.order;

import java.time.Instant;

import com.aksi.domain.common.BaseEntity;
import com.aksi.domain.user.User;

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
public class OrderPayment extends BaseEntity {

  public enum PaymentMethod {
    CASH,
    TERMINAL,
    BANK_TRANSFER
  }

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "order_id", nullable = false)
  private Order order;

  @Column(name = "amount", nullable = false)
  private Integer amount;

  @Enumerated(EnumType.STRING)
  @Column(name = "payment_method", nullable = false, length = 20)
  private PaymentMethod method;

  @Column(name = "paid_at", nullable = false)
  private Instant paidAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "paid_by")
  private User paidBy;

  @Column(name = "reference_number", length = 100)
  private String referenceNumber;

  @Column(name = "notes", columnDefinition = "TEXT")
  private String notes;

  // Convenience constructor
  public OrderPayment(Order order, Integer amount, PaymentMethod method, User paidBy) {
    this.order = order;
    this.amount = amount;
    this.method = method;
    this.paidBy = paidBy;
    this.paidAt = Instant.now();
  }

  // Business methods
  public boolean isCashPayment() {
    return method == PaymentMethod.CASH;
  }

  public boolean isCardPayment() {
    return method == PaymentMethod.TERMINAL;
  }

  public boolean isBankTransfer() {
    return method == PaymentMethod.BANK_TRANSFER;
  }

  public String getDisplayName() {
    return switch (method) {
      case CASH -> "Готівка";
      case TERMINAL -> "Картка (термінал)";
      case BANK_TRANSFER -> "Банківський переказ";
    };
  }

  public String getFormattedAmount() {
    if (amount == null) return "0.00 грн";
    return String.format("%.2f грн", amount / 100.0);
  }

  public boolean requiresReference() {
    return method == PaymentMethod.TERMINAL || method == PaymentMethod.BANK_TRANSFER;
  }
}