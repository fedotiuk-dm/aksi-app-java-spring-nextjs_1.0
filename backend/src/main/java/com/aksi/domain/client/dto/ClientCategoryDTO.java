package com.aksi.domain.client.dto;

import com.aksi.domain.client.entity.ClientCategoryEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для передачі інформації про категорію клієнта.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientCategoryDTO {
    
    /**
     * Назва категорії (код).
     */
    private String code;
    
    /**
     * Назва категорії для відображення.
     */
    private String displayName;
    
    /**
     * Конвертує enum категорії клієнта в DTO.
     *
     * @param category enum категорії
     * @return DTO категорії
     */
    public static ClientCategoryDTO fromEntity(ClientCategoryEntity category) {
        if (category == null) {
            return null;
        }
        
        return new ClientCategoryDTO(
            category.name(),
            category.getDisplayName()
        );
    }
}
