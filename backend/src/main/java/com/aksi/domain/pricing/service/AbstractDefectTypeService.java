package com.aksi.domain.pricing.service;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aksi.domain.pricing.entity.DefectTypeEntity;

/**
 * Абстрактний сервіс для роботи з типами дефектів.
 * Розширює загальний AbstractItemIssueService для більш специфічної функціональності для дефектів.
 * 
 * @param <R> тип репозиторію для DefectTypeEntity
 */
public abstract class AbstractDefectTypeService<R extends JpaRepository<DefectTypeEntity, java.util.UUID>> 
        extends AbstractItemIssueService<DefectTypeEntity, R> {
    
    protected AbstractDefectTypeService(R repository) {
        super(repository);
    }
    
    /**
     * Отримати всі активні типи дефектів.
     * 
     * @return список активних типів дефектів
     */
    public abstract List<com.aksi.domain.pricing.dto.DefectTypeDTO> getActiveDefectTypes();
    
    /**
     * Отримати типи дефектів за їх кодами.
     * 
     * @param codes коди типів дефектів
     * @return список типів дефектів
     */
    @Override
    public List<DefectTypeEntity> findByCodes(List<String> codes) {
        return repository.findAll().stream()
                .filter(entity -> entity.isActive() && codes.contains(entity.getCode()))
                .toList();
    }
    
    /**
     * Отримати типи дефектів за їх назвами.
     * 
     * @param names назви типів дефектів
     * @return список типів дефектів
     */
    @Override
    public List<DefectTypeEntity> findByNames(List<String> names) {
        return repository.findAll().stream()
                .filter(entity -> entity.isActive() && names.contains(entity.getName()))
                .toList();
    }
} 