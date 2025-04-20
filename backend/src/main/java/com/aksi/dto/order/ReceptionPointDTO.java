package com.aksi.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * DTO для передачі даних про пункт прийому замовлень
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceptionPointDTO {
    
    /**
     * Ідентифікатор пункту прийому
     */
    private UUID id;
    
    /**
     * Назва пункту прийому
     */
    private String name;
    
    /**
     * Адреса пункту прийому
     */
    private String address;
    
    /**
     * Телефон пункту прийому
     */
    private String phone;
    
    /**
     * Статус активності пункту прийому
     */
    private Boolean active;
}
