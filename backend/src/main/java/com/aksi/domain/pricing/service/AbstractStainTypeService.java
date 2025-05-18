package com.aksi.domain.pricing.service;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aksi.domain.pricing.entity.StainTypeEntity;

/**
 * Абстрактний сервіс для роботи з типами плям.
 * Розширює загальний AbstractItemIssueService для більш специфічної функціональності для плям.
 * 
 * @param <R> тип репозиторію для StainTypeEntity
 */
public abstract class AbstractStainTypeService<R extends JpaRepository<StainTypeEntity, java.util.UUID>> 
        extends AbstractItemIssueService<StainTypeEntity, R> {
    
    protected AbstractStainTypeService(R repository) {
        super(repository);
    }
    
    /**
     * Отримати всі активні типи плям.
     * 
     * @return список активних типів плям
     */
    public abstract List<com.aksi.domain.pricing.dto.StainTypeDTO> getActiveStainTypes();
    
    /**
     * Отримати типи плям за їх кодами.
     * 
     * @param codes коди типів плям
     * @return список типів плям
     */
    @Override
    public List<StainTypeEntity> findByCodes(List<String> codes) {
        return repository.findAll().stream()
                .filter(entity -> entity.isActive() && codes.contains(entity.getCode()))
                .toList();
    }
    
    /**
     * Отримати типи плям за їх назвами.
     * 
     * @param names назви типів плям
     * @return список типів плям
     */
    @Override
    public List<StainTypeEntity> findByNames(List<String> names) {
        return repository.findAll().stream()
                .filter(entity -> entity.isActive() && names.contains(entity.getName()))
                .toList();
    }
} 