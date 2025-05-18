package com.aksi.domain.pricing.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.pricing.dto.StainTypeDTO;
import com.aksi.domain.pricing.entity.StainTypeEntity;
import com.aksi.domain.pricing.entity.StainTypeEntity.RiskLevel;
import com.aksi.domain.pricing.mapper.StainTypeMapper;
import com.aksi.domain.pricing.repository.StainTypeRepository;
import com.aksi.exception.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація сервісу для роботи з типами плям.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class StainTypeServiceImpl implements StainTypeService {
    
    private final StainTypeRepository stainTypeRepository;
    private final StainTypeMapper stainTypeMapper;

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<StainTypeDTO> getAllStainTypes() {
        return stainTypeMapper.toDtoList(stainTypeRepository.findAll());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<StainTypeDTO> getActiveStainTypes() {
        return stainTypeMapper.toDtoList(stainTypeRepository.findByActiveTrue());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<StainTypeEntity> getAllActiveStainTypes() {
        return stainTypeRepository.findByActiveTrue();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public StainTypeDTO getStainTypeById(UUID id) {
        return stainTypeRepository.findById(id)
                .map(stainTypeMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Тип плями з ID " + id + " не знайдено"));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public StainTypeDTO getStainTypeByCode(String code) {
        return stainTypeRepository.findByCode(code)
                .map(stainTypeMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Тип плями з кодом " + code + " не знайдено"));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public StainTypeDTO createStainType(StainTypeDTO stainTypeDTO) {
        if (stainTypeDTO.getId() != null && stainTypeRepository.existsById(stainTypeDTO.getId())) {
            throw new IllegalArgumentException("Тип плями з ID " + stainTypeDTO.getId() + " вже існує");
        }
        
        if (stainTypeRepository.existsByCode(stainTypeDTO.getCode())) {
            throw new IllegalArgumentException("Тип плями з кодом " + stainTypeDTO.getCode() + " вже існує");
        }
        
        StainTypeEntity entity = stainTypeMapper.toEntity(stainTypeDTO);
        entity = stainTypeRepository.save(entity);
        
        log.info("Створено новий тип плями: {}", entity.getCode());
        return stainTypeMapper.toDto(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public StainTypeDTO updateStainType(UUID id, StainTypeDTO stainTypeDTO) {
        StainTypeEntity existingEntity = stainTypeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Тип плями з ID " + id + " не знайдено"));
        
        // Перевіряємо, чи не існує інший запис з таким же кодом
        if (!existingEntity.getCode().equals(stainTypeDTO.getCode()) && 
                stainTypeRepository.existsByCode(stainTypeDTO.getCode())) {
            throw new IllegalArgumentException("Тип плями з кодом " + stainTypeDTO.getCode() + " вже існує");
        }
        
        // Оновлюємо поля
        existingEntity.setCode(stainTypeDTO.getCode());
        existingEntity.setName(stainTypeDTO.getName());
        existingEntity.setDescription(stainTypeDTO.getDescription());
        existingEntity.setRiskLevel(stainTypeDTO.getRiskLevel());
        existingEntity.setActive(stainTypeDTO.isActive());
        
        existingEntity = stainTypeRepository.save(existingEntity);
        
        log.info("Оновлено тип плями: {}", existingEntity.getCode());
        return stainTypeMapper.toDto(existingEntity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public void deleteStainType(UUID id) {
        if (!stainTypeRepository.existsById(id)) {
            throw new EntityNotFoundException("Тип плями з ID " + id + " не знайдено");
        }
        
        stainTypeRepository.deleteById(id);
        log.info("Видалено тип плями з ID: {}", id);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<StainTypeDTO> getStainTypesByRiskLevel(RiskLevel riskLevel) {
        return stainTypeMapper.toDtoList(stainTypeRepository.findByActiveTrueAndRiskLevel(riskLevel));
    }
} 