package com.aksi.dto.client;

import com.aksi.domain.client.entity.ClientSource;
import com.aksi.domain.client.entity.ClientStatus;
import com.aksi.domain.client.entity.LoyaltyLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO для запиту на пошук клієнтів
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientSearchRequest {
    
    /**
     * Пошуковий запит
     */
    private String search;
    
    /**
     * Статус клієнта
     */
    private ClientStatus status;
    
    /**
     * Рівень лояльності
     */
    private LoyaltyLevel loyaltyLevel;
    
    /**
     * Джерело залучення
     */
    private ClientSource source;
    
    /**
     * Теги для фільтрації
     */
    private List<String> tags;
    
    /**
     * Номер сторінки
     */
    @Builder.Default
    private Integer page = 0;
    
    /**
     * Розмір сторінки
     */
    @Builder.Default
    private Integer size = 20;
    
    /**
     * Поле для сортування
     */
    @Builder.Default
    private String sortBy = "createdAt";
    
    /**
     * Напрямок сортування (asc/desc)
     */
    @Builder.Default
    private String sortDirection = "desc";
} 