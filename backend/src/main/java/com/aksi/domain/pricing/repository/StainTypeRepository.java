package com.aksi.domain.pricing.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aksi.domain.pricing.entity.StainTypeEntity;
import com.aksi.domain.pricing.enums.RiskLevel;

/**
 * Репозиторій для роботи з типами плям.
 */
@Repository
public interface StainTypeRepository extends JpaRepository<StainTypeEntity, UUID> {
    
    /**
     * Знайти тип плями за кодом.
     * 
     * @param code код типу плями
     * @return тип плями або пустий Optional
     */
    Optional<StainTypeEntity> findByCode(String code);
    
    /**
     * Знайти всі активні типи плям.
     * 
     * @return список активних типів плям
     */
    List<StainTypeEntity> findByActiveTrue();
    
    /**
     * Перевірити існування типу плями за кодом.
     * 
     * @param code код типу плями
     * @return true, якщо тип плями існує
     */
    boolean existsByCode(String code);
    
    /**
     * Знайти активні типи плям за рівнем ризику.
     * 
     * @param riskLevel Рівень ризику
     * @return Список активних типів плям з вказаним рівнем ризику
     */
    List<StainTypeEntity> findByActiveTrueAndRiskLevel(RiskLevel riskLevel);
} 
