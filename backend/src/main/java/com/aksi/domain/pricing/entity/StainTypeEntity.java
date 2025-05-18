package com.aksi.domain.pricing.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity для зберігання типів плям.
 * Використовується для рекомендацій модифікаторів цін та відображення 
 * у інтерфейсі замовлення.
 */
@Entity
@Table(name = "stain_types")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StainTypeEntity {

    /**
     * Рівень ризику.
     */
    public enum RiskLevel {
        LOW, MEDIUM, HIGH
    }
    
    /**
     * Унікальний ідентифікатор.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    /**
     * Код типу плями.
     */
    @Column(nullable = false, unique = true)
    private String code;
    
    /**
     * Назва типу плями.
     */
    @Column(nullable = false)
    private String name;
    
    /**
     * Опис типу плями.
     */
    @Column
    private String description;
    
    /**
     * Рівень ризику.
     */
    @Column(name = "risk_level")
    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;
    
    /**
     * Чи активний запис.
     */
    @Column
    private boolean active;
    
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