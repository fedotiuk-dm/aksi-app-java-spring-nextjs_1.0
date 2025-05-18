package com.aksi.domain.pricing.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aksi.domain.pricing.entity.DefectTypeEntity;
import com.aksi.domain.pricing.enums.RiskLevel;

/**
 * Репозиторій для роботи з типами дефектів.
 */
@Repository
public interface DefectTypeRepository extends JpaRepository<DefectTypeEntity, UUID> {
    
    /**
     * Знайти тип дефекту за кодом.
     * 
     * @param code код типу дефекту
     * @return тип дефекту або пустий Optional
     */
    Optional<DefectTypeEntity> findByCode(String code);
    
    /**
     * Знайти всі активні типи дефектів.
     * 
     * @return список активних типів дефектів
     */
    List<DefectTypeEntity> findByActiveTrue();
    
    /**
     * Перевірити існування типу дефекту за кодом.
     * 
     * @param code код типу дефекту
     * @return true, якщо тип дефекту існує
     */
    boolean existsByCode(String code);
    
    /**
     * Знайти активні типи дефектів за рівнем ризику.
     * 
     * @param riskLevel Рівень ризику
     * @return Список активних типів дефектів з вказаним рівнем ризику
     */
    List<DefectTypeEntity> findByActiveTrueAndRiskLevel(RiskLevel riskLevel);
} 