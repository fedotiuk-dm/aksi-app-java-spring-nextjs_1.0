package com.aksi.dto.catalog;

import com.aksi.domain.order.entity.StainType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для попереджень і ризиків, пов'язаних з комбінаціями матеріалів і забруднень.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialWarningDto {
    
    /**
     * Матеріал, для якого виникає попередження.
     */
    private String material;
    
    /**
     * Тип забруднення, який викликає ризик.
     * Може бути null, якщо попередження стосується лише матеріалу.
     */
    private StainType stainType;
    
    /**
     * Тип попередження (COLOR_CHANGE, DEFORMATION, NO_WARRANTY, MATERIAL_DAMAGE).
     */
    private String warningType;
    
    /**
     * Текст попередження, який буде показано користувачу.
     */
    private String warningMessage;
    
    /**
     * Серйозність попередження (INFO, WARNING, DANGER).
     */
    private String severity;
    
    /**
     * Чи вимагає це попередження підтвердження від користувача.
     */
    private boolean requiresConfirmation;
}
