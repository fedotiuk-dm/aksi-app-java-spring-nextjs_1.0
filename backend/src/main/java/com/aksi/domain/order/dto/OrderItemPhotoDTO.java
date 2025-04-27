package com.aksi.domain.order.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для фотографії предмета замовлення.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemPhotoDTO {
    
    /**
     * Унікальний ідентифікатор фотографії.
     */
    private UUID id;
    
    /**
     * Ідентифікатор предмета замовлення.
     */
    private UUID itemId;
    
    /**
     * URL для доступу до фотографії.
     */
    private String fileUrl;
    
    /**
     * URL для доступу до мініатюри фотографії.
     */
    private String thumbnailUrl;
    
    /**
     * JSON з анотаціями (маркуванням проблемних місць).
     */
    private String annotations;
    
    /**
     * Текстовий опис до фотографії.
     */
    private String description;
    
    /**
     * Дата і час створення фотографії.
     */
    private LocalDateTime createdAt;
}
