package com.aksi.domain.pricing.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.pricing.dto.DefectTypeDTO;
import com.aksi.domain.pricing.entity.DefectTypeEntity;
import com.aksi.domain.pricing.entity.DefectTypeEntity.RiskLevel;
import com.aksi.domain.pricing.mapper.DefectTypeMapper;
import com.aksi.domain.pricing.repository.DefectTypeRepository;
import com.aksi.exception.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація сервісу для роботи з типами дефектів.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DefectTypeServiceImpl implements DefectTypeService {
    
    private final DefectTypeRepository defectTypeRepository;
    private final DefectTypeMapper defectTypeMapper;

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<DefectTypeDTO> getAllDefectTypes() {
        return defectTypeMapper.toDtoList(defectTypeRepository.findAll());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<DefectTypeDTO> getActiveDefectTypes() {
        return defectTypeMapper.toDtoList(defectTypeRepository.findByActiveTrue());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<DefectTypeEntity> getAllActiveDefectTypes() {
        return defectTypeRepository.findByActiveTrue();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public DefectTypeDTO getDefectTypeById(UUID id) {
        return defectTypeRepository.findById(id)
                .map(defectTypeMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Тип дефекту з ID " + id + " не знайдено"));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public DefectTypeDTO getDefectTypeByCode(String code) {
        return defectTypeRepository.findByCode(code)
                .map(defectTypeMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Тип дефекту з кодом " + code + " не знайдено"));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public DefectTypeDTO createDefectType(DefectTypeDTO defectTypeDTO) {
        if (defectTypeDTO.getId() != null && defectTypeRepository.existsById(defectTypeDTO.getId())) {
            throw new IllegalArgumentException("Тип дефекту з ID " + defectTypeDTO.getId() + " вже існує");
        }
        
        if (defectTypeRepository.existsByCode(defectTypeDTO.getCode())) {
            throw new IllegalArgumentException("Тип дефекту з кодом " + defectTypeDTO.getCode() + " вже існує");
        }
        
        DefectTypeEntity entity = defectTypeMapper.toEntity(defectTypeDTO);
        entity = defectTypeRepository.save(entity);
        
        log.info("Створено новий тип дефекту: {}", entity.getCode());
        return defectTypeMapper.toDto(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public DefectTypeDTO updateDefectType(UUID id, DefectTypeDTO defectTypeDTO) {
        DefectTypeEntity existingEntity = defectTypeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Тип дефекту з ID " + id + " не знайдено"));
        
        // Перевіряємо, чи не існує інший запис з таким же кодом
        if (!existingEntity.getCode().equals(defectTypeDTO.getCode()) && 
                defectTypeRepository.existsByCode(defectTypeDTO.getCode())) {
            throw new IllegalArgumentException("Тип дефекту з кодом " + defectTypeDTO.getCode() + " вже існує");
        }
        
        // Оновлюємо поля
        existingEntity.setCode(defectTypeDTO.getCode());
        existingEntity.setName(defectTypeDTO.getName());
        existingEntity.setDescription(defectTypeDTO.getDescription());
        existingEntity.setRiskLevel(defectTypeDTO.getRiskLevel());
        existingEntity.setActive(defectTypeDTO.isActive());
        
        existingEntity = defectTypeRepository.save(existingEntity);
        
        log.info("Оновлено тип дефекту: {}", existingEntity.getCode());
        return defectTypeMapper.toDto(existingEntity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public void deleteDefectType(UUID id) {
        if (!defectTypeRepository.existsById(id)) {
            throw new EntityNotFoundException("Тип дефекту з ID " + id + " не знайдено");
        }
        
        defectTypeRepository.deleteById(id);
        log.info("Видалено тип дефекту з ID: {}", id);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<DefectTypeDTO> getDefectTypesByRiskLevel(RiskLevel riskLevel) {
        return defectTypeMapper.toDtoList(defectTypeRepository.findByActiveTrueAndRiskLevel(riskLevel));
    }
} 