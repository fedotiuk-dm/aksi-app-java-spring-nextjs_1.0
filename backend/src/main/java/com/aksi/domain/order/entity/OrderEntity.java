package com.aksi.domain.order.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.aksi.domain.branch.entity.BranchLocationEntity;
import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.order.model.DiscountType;
import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.model.OrderStatusEnum;
import com.aksi.domain.order.model.PaymentMethod;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Сутність замовлення у хімчистці.
 */
@Entity
@Table(name = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "receipt_number", nullable = false, unique = true)
    private String receiptNumber;

    @Column(name = "tag_number")
    private String tagNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private ClientEntity client;

    /**
     * Відношення до елементів замовлення (у одного замовлення може бути кілька елементів).
     */
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    @Builder.Default
    private List<OrderItemEntity> items = new ArrayList<>();

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "discount_amount")
    private BigDecimal discountAmount;

    /**
     * Тип знижки.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type")
    @Builder.Default
    private DiscountType discountType = DiscountType.NO_DISCOUNT;

    /**
     * Відсоток знижки (для користувацького типу знижки).
     */
    @Column(name = "discount_percentage")
    private Integer discountPercentage;

    /**
     * Опис знижки (для користувацького типу знижки).
     */
    @Column(name = "discount_description", length = 255)
    private String discountDescription;

    @Column(name = "final_amount", nullable = false)
    private BigDecimal finalAmount;

    /**
     * Спосіб оплати.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;

    /**
     * Сума передоплати.
     */
    @Column(name = "prepayment_amount")
    private BigDecimal prepaymentAmount;

    /**
     * Сума до сплати (борг).
     */
    @Column(name = "balance_amount")
    private BigDecimal balanceAmount;

    /**
     * Пункт прийому замовлення.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_location_id", nullable = false)
    private BranchLocationEntity branchLocation;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private OrderStatusEnum status = OrderStatusEnum.DRAFT;

    @Column(name = "created_date", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    @UpdateTimestamp
    private LocalDateTime updatedDate;

    @Column(name = "expected_completion_date")
    private LocalDateTime expectedCompletionDate;

    @Column(name = "completed_date")
    private LocalDateTime completedDate;

    /**
     * Загальні примітки до замовлення.
     */
    @Column(name = "customer_notes", length = 1000)
    private String customerNotes;

    /**
     * Додаткові вимоги клієнта.
     */
    @Column(name = "additional_requirements", length = 1000)
    private String additionalRequirements;

    /**
     * Внутрішні примітки (для персоналу).
     */
    @Column(name = "internal_notes", length = 1000)
    private String internalNotes;

    /**
     * Тип термінового виконання.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "expedite_type", nullable = false)
    @Builder.Default
    private ExpediteType expediteType = ExpediteType.STANDARD;

    @Column(name = "is_draft", nullable = false)
    @Builder.Default
    private boolean draft = false;

    @Column(name = "is_printed", nullable = false)
    @Builder.Default
    private boolean isPrinted = false;

    @Column(name = "is_emailed", nullable = false)
    @Builder.Default
    private boolean isEmailed = false;

    @Column(name = "completion_comments")
    private String completionComments;

    @Column(name = "terms_accepted", nullable = false)
    @Builder.Default
    private boolean termsAccepted = false;

    @Column(name = "finalized_at")
    private LocalDateTime finalizedAt;

    /**
     * Додати новий елемент до замовлення.
     * @param item параметр item
     */
    public void addItem(OrderItemEntity item) {
        items.add(item);
        item.setOrder(this);
    }

    /**
     * Видалити елемент із замовлення.
     * @param item параметр item
     */
    public void removeItem(OrderItemEntity item) {
        items.remove(item);
        item.setOrder(null);
    }

    /**
     * Розрахувати повну суму замовлення на основі елементів.
     */
    public void recalculateTotalAmount() {
        this.totalAmount = items.stream()
                .map(OrderItemEntity::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (this.discountAmount != null) {
            this.finalAmount = this.totalAmount.subtract(this.discountAmount);
        } else {
            this.finalAmount = this.totalAmount;
        }

        if (this.prepaymentAmount != null) {
            this.balanceAmount = this.finalAmount.subtract(this.prepaymentAmount);
        } else {
            this.balanceAmount = this.finalAmount;
        }
    }
}
