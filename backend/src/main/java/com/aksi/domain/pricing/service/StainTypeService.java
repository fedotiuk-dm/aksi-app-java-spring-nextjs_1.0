package com.aksi.domain.pricing.service;

import java.util.List;
import java.util.UUID;

import com.aksi.domain.pricing.dto.StainTypeDTO;
import com.aksi.domain.pricing.entity.StainTypeEntity;
import com.aksi.domain.pricing.enums.RiskLevel;

/**
 * Сервіс для роботи з типами плям.
 */
public interface StainTypeService {
    
    /**
     * Отримати всі типи плям.
     * 
     * @return список всіх типів плям
     */
    List<StainTypeDTO> getAllStainTypes();
    
    /**
     * Отримати всі активні типи плям.
     * 
     * @return список активних типів плям
     */
    List<StainTypeDTO> getActiveStainTypes();
    
    /**
     * Отримати всі активні типи плям в форматі Entity.
     * 
     * @return список активних типів плям
     */
    List<StainTypeEntity> getAllActiveStainTypes();
    
    /**
     * Отримати тип плями за ідентифікатором.
     * 
     * @param id ідентифікатор типу плями
     * @return DTO типу плями
     */
    StainTypeDTO getStainTypeById(UUID id);
    
    /**
     * Отримати тип плями за кодом.
     * 
     * @param code код типу плями
     * @return DTO типу плями
     */
    StainTypeDTO getStainTypeByCode(String code);
    
    /**
     * Створити новий тип плями.
     * 
     * @param stainTypeDTO DTO з даними нового типу плями
     * @return створений DTO типу плями
     */
    StainTypeDTO createStainType(StainTypeDTO stainTypeDTO);
    
    /**
     * Оновити існуючий тип плями.
     * 
     * @param id ідентифікатор типу плями
     * @param stainTypeDTO DTO з оновленими даними
     * @return оновлений DTO типу плями
     */
    StainTypeDTO updateStainType(UUID id, StainTypeDTO stainTypeDTO);
    
    /**
     * Видалити тип плями за ідентифікатором.
     * 
     * @param id ідентифікатор типу плями
     */
    void deleteStainType(UUID id);
    
    /**
     * Отримати типи плям за рівнем ризику.
     * 
     * @param riskLevel рівень ризику
     * @return список типів плям з вказаним рівнем ризику
     */
    List<StainTypeDTO> getStainTypesByRiskLevel(RiskLevel riskLevel);
} 