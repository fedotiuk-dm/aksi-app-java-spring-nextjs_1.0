package com.aksi.domain.client.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для відповіді з пагінацією для клієнтів, дотримуючись принципів DDD.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientPageResponse {
    /**
     * Список клієнтів на поточній сторінці
     */
    private List<ClientResponse> content;
    
    /**
     * Загальна кількість клієнтів
     */
    private long totalElements;
    
    /**
     * Загальна кількість сторінок
     */
    private int totalPages;
    
    /**
     * Номер поточної сторінки (з нуля)
     */
    private int pageNumber;
    
    /**
     * Розмір сторінки
     */
    private int pageSize;
    
    /**
     * Чи є попередня сторінка
     */
    private boolean hasPrevious;
    
    /**
     * Чи є наступна сторінка
     */
    private boolean hasNext;
}
