package com.aksi.dto.client;

import com.aksi.domain.client.entity.ClientSource;
import com.aksi.domain.client.entity.ClientStatus;
import com.aksi.domain.client.entity.LoyaltyLevel;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

/**
 * DTO для відповіді з даними клієнта
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientResponse {
    
    /**
     * Ідентифікатор клієнта
     */
    private UUID id;
    
    /**
     * Повне ім'я клієнта
     */
    private String firstName;
    
    private String lastName;
    
    /**
     * Отримати повне ім'я клієнта (прізвище + ім'я)
     * @return Повне ім'я клієнта
     */
    public String getFullName() {
        if (lastName == null && firstName == null) return "";
        if (lastName == null) return firstName;
        if (firstName == null) return lastName;
        return lastName + " " + firstName;
    }
    
    /**
     * Основний телефон
     */
    private String phone;
    
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
    private ClientSource source;
    
    /**
     * Дата народження
     */
    private LocalDate birthDate;
    
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
     * Статус клієнта
     */
    private ClientStatus status;
    
    /**
     * Бонусні бали
     */
    private Integer loyaltyPoints;
    
    /**
     * Рівень лояльності
     */
    private LoyaltyLevel loyaltyLevel;
    
    /**
     * Теги клієнта
     */
    private Set<String> tags;
    
    /**
     * Дата створення
     */
    private LocalDateTime createdAt;
    
    /**
     * Дата оновлення
     */
    private LocalDateTime updatedAt;
} 