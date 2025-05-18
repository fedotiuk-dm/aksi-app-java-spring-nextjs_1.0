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
} 