package com.aksi.domain.pricing.service;

import java.util.List;
import java.util.UUID;

import com.aksi.domain.pricing.dto.DefectTypeDTO;
import com.aksi.domain.pricing.entity.DefectTypeEntity;
import com.aksi.domain.pricing.enums.RiskLevel;

/**
 * Сервіс для роботи з типами дефектів.
 */
public interface DefectTypeService {
    
    /**
     * Отримати всі типи дефектів.
     * 
     * @return список всіх типів дефектів
     */
    List<DefectTypeDTO> getAllDefectTypes();
    
    /**
     * Отримати всі активні типи дефектів.
     * 
     * @return список активних типів дефектів
     */
    List<DefectTypeDTO> getActiveDefectTypes();
    
    /**
     * Отримати всі активні типи дефектів в форматі Entity.
     * 
     * @return список активних типів дефектів
     */
    List<DefectTypeEntity> getAllActiveDefectTypes();
    
    /**
     * Отримати тип дефекту за ідентифікатором.
     * 
     * @param id ідентифікатор типу дефекту
     * @return DTO типу дефекту
     */
    DefectTypeDTO getDefectTypeById(UUID id);
    
    /**
     * Отримати тип дефекту за кодом.
     * 
     * @param code код типу дефекту
     * @return DTO типу дефекту
     */
    DefectTypeDTO getDefectTypeByCode(String code);
    
    /**
     * Створити новий тип дефекту.
     * 
     * @param defectTypeDTO DTO з даними нового типу дефекту
     * @return створений DTO типу дефекту
     */
    DefectTypeDTO createDefectType(DefectTypeDTO defectTypeDTO);
    
    /**
     * Оновити існуючий тип дефекту.
     * 
     * @param id ідентифікатор типу дефекту
     * @param defectTypeDTO DTO з оновленими даними
     * @return оновлений DTO типу дефекту
     */
    DefectTypeDTO updateDefectType(UUID id, DefectTypeDTO defectTypeDTO);
    
    /**
     * Видалити тип дефекту за ідентифікатором.
     * 
     * @param id ідентифікатор типу дефекту
     */
    void deleteDefectType(UUID id);
    
    /**
     * Отримати типи дефектів за рівнем ризику.
     * 
     * @param riskLevel рівень ризику
     * @return список типів дефектів з вказаним рівнем ризику
     */
    List<DefectTypeDTO> getDefectTypesByRiskLevel(RiskLevel riskLevel);
} 