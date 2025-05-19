package com.aksi.domain.pricing.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.aksi.domain.pricing.enums.RiskLevel;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Базовий абстрактний клас для сутностей, що представляють типи проблем з речами
 * (дефекти, плями тощо). Містить спільні властивості та функціональність.
 * 
 * ПРИМІТКА ПРО РЕФАКТОРИНГ: Це базовий клас для майбутнього рефакторингу.
 * Повний рефакторинг вимагає також оновлення:
 * 1. DTO класів для обох типів сутностей
 * 2. Мапперів для обох типів сутностей 
 * 3. Всіх сервісів і контролерів, де використовується enum RiskLevel
 * 
 * ПЛАН РЕФАКТОРИНГУ:
 * 1. Винести RiskLevel в окремий enum клас в пакеті com.aksi.domain.pricing.enums
 * 2. Оновити DTO класи для використання нового enum
 * 3. Оновити мапери для коректної конвертації між DTO і Entity
 * 4. Оновити всі імпорти в сервісах і контролерах
 */
@MappedSuperclass
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class AbstractItemIssueEntity {

    /**
     * Унікальний ідентифікатор.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    /**
     * Унікальний код типу проблеми.
     */
    @Column(nullable = false, unique = true)
    private String code;
    
    /**
     * Назва типу проблеми.
     */
    @Column(nullable = false)
    private String name;
    
    /**
     * Опис типу проблеми.
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
