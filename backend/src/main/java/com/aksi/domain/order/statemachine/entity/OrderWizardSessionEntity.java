package com.aksi.domain.order.statemachine.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.aksi.domain.branch.entity.BranchLocationEntity;
import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.user.entity.UserEntity;

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
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Entity для збереження активних Order Wizard сесій
 * Зберігає поточний стан wizard та основні дані
 */
@Entity
@Table(name = "order_wizard_sessions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"stateData", "client", "branch", "user"})
@ToString(exclude = {"stateData", "client", "branch", "user"})
public class OrderWizardSessionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @Size(max = 255)
    @Column(name = "wizard_id", nullable = false, unique = true)
    private String wizardId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "current_state", nullable = false, length = 50)
    private OrderState currentState;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private ClientEntity client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private BranchLocationEntity branch;

    @Size(max = 50)
    @Column(name = "receipt_number", length = 50)
    private String receiptNumber;

    @Size(max = 100)
    @Column(name = "unique_tag", length = 100)
    private String uniqueTag;

    @Column(name = "order_creation_time")
    private LocalDateTime orderCreationTime;

    @NotNull
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @NotNull
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @NotNull
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @NotNull
    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @OneToMany(mappedBy = "wizardSession", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<OrderWizardStateDataEntity> stateData = new ArrayList<>();

    /**
     * Перевіряє чи сесія ще активна (не закінчилася)
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    /**
     * Оновлює час закінчення сесії (продовжує її)
     */
    public void extendSession(int hours) {
        this.expiresAt = LocalDateTime.now().plusHours(hours);
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Деактивує сесію
     */
    public void deactivate() {
        this.isActive = false;
        this.updatedAt = LocalDateTime.now();
    }
}
