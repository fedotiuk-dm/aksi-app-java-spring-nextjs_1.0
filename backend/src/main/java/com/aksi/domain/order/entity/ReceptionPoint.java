package com.aksi.domain.order.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Сутність пункту прийому замовлень (філії)
 */
@Entity
@Table(name = "reception_points")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceptionPoint {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    /**
     * Назва пункту прийому
     */
    @Column(name = "name", nullable = false)
    private String name;
    
    /**
     * Адреса пункту прийому
     */
    @Column(name = "address")
    private String address;
    
    /**
     * Телефон пункту прийому
     */
    @Column(name = "phone")
    private String phone;
    
    /**
     * Статус активності пункту прийому
     */
    @Column(name = "active", nullable = false)
    @Builder.Default
    private Boolean active = true;
    
    /**
     * Дата створення запису
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    /**
     * Дата оновлення запису
     */
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
