package com.aksi.dto.order;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO для передачі даних про чернетку замовлення.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDraftDto {
    private UUID id;
    
    private UUID clientId;
    
    private String clientName;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;
    
    private String draftData;
    
    private String createdBy;
    
    private boolean convertedToOrder;
    
    private UUID orderId;
    
    private String draftName;
}
