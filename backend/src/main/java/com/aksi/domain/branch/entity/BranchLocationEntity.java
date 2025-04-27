package com.aksi.domain.branch.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Сутність пункту прийому замовлень (філії).
 */
@Entity
@Table(name = "branch_locations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchLocationEntity {

    /**
     * Унікальний ідентифікатор пункту прийому.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * Назва пункту прийому.
     */
    @NotBlank(message = "Назва пункту прийому не може бути порожньою")
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * Адреса пункту прийому.
     */
    @NotBlank(message = "Адреса пункту прийому не може бути порожньою")
    @Column(name = "address", nullable = false)
    private String address;

    /**
     * Контактний телефон пункту прийому.
     */
    @Pattern(regexp = "^\\+?[0-9\\s-()]{10,15}$", message = "Неправильний формат телефону")
    @Column(name = "phone")
    private String phone;

    /**
     * Код пункту прийому (для формування номерів замовлень).
     */
    @NotBlank(message = "Код пункту прийому не може бути порожнім")
    @Column(name = "code", nullable = false, unique = true)
    private String code;

    /**
     * Статус активності пункту прийому.
     */
    @Column(name = "active", nullable = false)
    @Builder.Default
    private Boolean active = true;

    /**
     * Дата та час створення запису.
     */
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /**
     * Дата та час останнього оновлення запису.
     */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
