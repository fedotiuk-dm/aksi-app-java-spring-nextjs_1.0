package com.aksi.domain.client.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Сутність переваг клієнта.
 * Зберігає налаштування та вподобання клієнта у форматі ключ-значення.
 */
@Entity
@Table(name = "client_preferences")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientPreferenceEntity {
    
    /**
     * Унікальний ідентифікатор переваги.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    /**
     * Ключ переваги (наприклад, "preferred_delivery_day").
     */
    @Column(name = "preference_key", nullable = false)
    private String key;
    
    /**
     * Значення переваги.
     */
    @Column(name = "preference_value")
    private String value;
    
    /**
     * Клієнт, якому належать ці переваги.
     */
    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private ClientEntity client;
    
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
