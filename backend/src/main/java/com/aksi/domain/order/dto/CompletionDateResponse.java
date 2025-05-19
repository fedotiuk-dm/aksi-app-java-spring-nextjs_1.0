package com.aksi.domain.order.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Відповідь з розрахованою датою завершення замовлення
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompletionDateResponse {
    
    /**
     * Розрахована дата завершення замовлення
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime expectedCompletionDate;
    
    /**
     * Стандартний час виконання (у годинах)
     */
    private Integer standardProcessingHours;
    
    /**
     * Скорочений час виконання з урахуванням терміновості (у годинах)
     */
    private Integer expeditedProcessingHours;
} 
