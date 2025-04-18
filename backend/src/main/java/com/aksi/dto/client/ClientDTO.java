package com.aksi.dto.client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO для відображення даних клієнта
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientDTO {
    
    /**
     * Ідентифікатор клієнта
     */
    private UUID id;
    
    /**
     * Ім'я клієнта
     */
    private String name;
    
    /**
     * Основний телефон
     */
    private String phone;
    
    /**
     * Додатковий телефон
     */
    private String additionalPhone;
    
    /**
     * Email
     */
    private String email;
    
    /**
     * Адреса
     */
    private String address;
    
    /**
     * Примітки
     */
    private String notes;
    
    /**
     * Джерело залучення
     */
    private String source;
    
    /**
     * Дата народження
     */
    private LocalDateTime birthDate;
    
    /**
     * Дата останнього замовлення
     */
    private LocalDateTime lastOrderDate;
    
    /**
     * Загальна сума замовлень
     */
    private BigDecimal totalSpent;
    
    /**
     * Кількість замовлень
     */
    private Integer orderCount;
    
    /**
     * Активність клієнта
     */
    private boolean active;
    
    /**
     * Бонусні бали
     */
    private Integer loyaltyPoints;
    
    /**
     * Рівень лояльності
     */
    private Integer loyaltyLevel;
    
    /**
     * Дата створення
     */
    private LocalDateTime createdAt;
    
    /**
     * Дата оновлення
     */
    private LocalDateTime updatedAt;
} 