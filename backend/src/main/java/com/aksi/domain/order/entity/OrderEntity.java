package com.aksi.domain.order.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.aksi.domain.order.enums.OrderStatus;
import com.aksi.domain.order.enums.UrgencyType;
import com.aksi.shared.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/** JPA Entity для замовлення. */
@Entity
@Table(
    name = "orders",
    indexes = {
      @Index(name = "idx_order_receipt_number", columnList = "receiptNumber", unique = true),
      @Index(name = "idx_order_unique_tag", columnList = "uniqueTag"),
      @Index(name = "idx_order_client_id", columnList = "clientId"),
      @Index(name = "idx_order_branch_id", columnList = "branchId"),
      @Index(name = "idx_order_status", columnList = "status"),
      @Index(name = "idx_order_created_at", columnList = "createdAt"),
      @Index(name = "idx_order_execution_date", columnList = "executionDate")
    })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class OrderEntity extends BaseEntity {

  @Column(name = "receipt_number", nullable = false, unique = true, length = 20)
  private String receiptNumber;

  @Column(name = "unique_tag", nullable = false, length = 50)
  private String uniqueTag;

  @Column(name = "client_id", nullable = false)
  private UUID clientId;

  @Column(name = "branch_id", nullable = false)
  private UUID branchId;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  @Builder.Default
  private OrderStatus status = OrderStatus.DRAFT;

  @OneToMany(
      mappedBy = "order",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  @Builder.Default
  private List<OrderItemEntity> items = new ArrayList<>();

  @Embedded private OrderCalculationEntity calculation;

  @Enumerated(EnumType.STRING)
  @Column(name = "urgency")
  @Builder.Default
  private UrgencyType urgency = UrgencyType.NORMAL;

  @Column(name = "execution_date")
  private LocalDateTime executionDate;

  @Embedded private DiscountEntity discount;

  @Embedded private PaymentInfoEntity payment;

  @Column(name = "notes", length = 1000)
  private String notes;

  @Column(name = "client_signature", columnDefinition = "TEXT")
  private String clientSignature;

  @Column(name = "operator_name", length = 100)
  private String operatorName;

  @Column(name = "final_notes", length = 500)
  private String finalNotes;

  @Column(name = "legal_acceptance")
  private Boolean legalAcceptance;

  @Column(name = "critical_defects_consent")
  private Boolean criticalDefectsConsent;

  // Business методи

  /** Перевіряє чи можна змінювати замовлення. */
  public boolean canBeModified() {
    return status != null && status.canModifyOrder();
  }

  /** Перевіряє чи можна додавати предмети. */
  public boolean canAddItems() {
    return status != null && status.canModifyItems();
  }

  /** Перевіряє чи готове до завершення. */
  public boolean isReadyForCompletion() {
    return status == OrderStatus.READY
        && clientSignature != null
        && legalAcceptance != null
        && legalAcceptance;
  }

  /** Перевіряє чи є згода клієнта на обробку критичних дефектів. */
  public boolean hasConsentForCriticalDefects() {
    return criticalDefectsConsent != null && criticalDefectsConsent;
  }

  /** Перевіряє чи замовлення містить предмети з критичними дефектами. */
  public boolean hasCriticalDefects() {
    return items.stream()
        .anyMatch(
            item ->
                item.getDefects() != null
                    && item.getDefects().stream()
                        .anyMatch(defect -> defect.name().contains("CRITICAL")));
  }

  /** Додає предмет до замовлення. */
  public void addItem(OrderItemEntity item) {
    if (!canAddItems()) {
      throw new IllegalStateException(
          "Неможливо додати предмет до замовлення в статусі: " + status);
    }
    items.add(item);
    item.setOrder(this);
    recalculateTotal();
  }

  /** Видаляє предмет з замовлення. */
  public void removeItem(OrderItemEntity item) {
    if (!canAddItems()) {
      throw new IllegalStateException(
          "Неможливо видалити предмет з замовлення в статусі: " + status);
    }
    items.remove(item);
    item.setOrder(null);
    recalculateTotal();
  }

  /** Змінює статус замовлення з валідацією. */
  public void changeStatus(OrderStatus newStatus) {
    if (status == null || !status.canTransitionTo(newStatus)) {
      throw new IllegalStateException(
          String.format("Неможливий перехід зі статусу %s до %s", status, newStatus));
    }
    this.status = newStatus;
  }

  /** Отримує загальну кількість предметів. */
  public int getTotalItemsCount() {
    return items.stream().mapToInt(OrderItemEntity::getQuantity).sum();
  }

  /** Отримує загальну базову вартість без надбавок та знижок. */
  public BigDecimal getBaseTotal() {
    return items.stream()
        .map(OrderItemEntity::getFinalPrice)
        .reduce(BigDecimal.ZERO, BigDecimal::add);
  }

  /** Розраховує надбавку за терміновість. */
  public BigDecimal calculateUrgencyCharge() {
    if (urgency == null || urgency == UrgencyType.NORMAL) {
      return BigDecimal.ZERO;
    }
    return urgency.calculateUrgencyCharge(getBaseTotal());
  }

  /** Розраховує суму знижки. */
  public BigDecimal calculateDiscountAmount() {
    if (discount == null || discount.getType() == null) {
      return BigDecimal.ZERO;
    }
    BigDecimal baseWithUrgency = getBaseTotal().add(calculateUrgencyCharge());
    return discount.calculateDiscountAmount(baseWithUrgency);
  }

  /** Розраховує фінальну суму замовлення. */
  public BigDecimal calculateFinalTotal() {
    BigDecimal base = getBaseTotal();
    BigDecimal urgencyCharge = calculateUrgencyCharge();
    BigDecimal discountAmount = calculateDiscountAmount();

    return base.add(urgencyCharge).subtract(discountAmount);
  }

  /** Перерахунок загальної вартості та оновлення calculation. */
  public void recalculateTotal() {
    if (calculation == null) {
      calculation = new OrderCalculationEntity();
    }

    calculation.setItemsTotal(getBaseTotal());
    calculation.setUrgencyCharge(calculateUrgencyCharge());
    calculation.setDiscountAmount(calculateDiscountAmount());
    calculation.setTotalAmount(calculateFinalTotal());
  }

  /** Перевіряє чи потрібна оплата. */
  public boolean requiresPayment() {
    return status != null && status.requiresPayment();
  }

  /** Перевіряє чи термінове замовлення. */
  public boolean isUrgent() {
    return urgency != null && urgency.isUrgent();
  }

  /** Розраховує очікувану дату готовності. */
  public LocalDateTime calculateExpectedReadyDate() {
    if (urgency == null || getCreatedAt() == null) {
      return null;
    }
    return urgency.calculateReadyDate(getCreatedAt());
  }
}
