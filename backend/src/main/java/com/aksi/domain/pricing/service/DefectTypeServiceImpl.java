package com.aksi.domain.pricing.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.pricing.dto.DefectTypeDTO;
import com.aksi.domain.pricing.entity.DefectTypeEntity;
import com.aksi.domain.pricing.enums.RiskLevel;
import com.aksi.domain.pricing.mapper.DefectTypeMapper;
import com.aksi.domain.pricing.repository.DefectTypeRepository;
import com.aksi.exception.EntityNotFoundException;

import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація сервісу для роботи з типами дефектів.
 * Успадковується від AbstractDefectTypeService для використання спільної логіки.
 */
@Service
@Slf4j
public class DefectTypeServiceImpl extends AbstractDefectTypeService<DefectTypeRepository> implements DefectTypeService {

    private final DefectTypeMapper defectTypeMapper;

    /**
     * Конструктор з параметрами.
     *
     * @param defectTypeRepository репозиторій для роботи з типами дефектів
     * @param defectTypeMapper мапер для конвертації між Entity та DTO
     */
    public DefectTypeServiceImpl(DefectTypeRepository defectTypeRepository, DefectTypeMapper defectTypeMapper) {
        super(defectTypeRepository);
        this.defectTypeMapper = defectTypeMapper;
    }

    /**
     * {@inheritDoc}.
     */
    @Override
    @Transactional(readOnly = true)
    public List<DefectTypeDTO> getAllDefectTypes() {
        return defectTypeMapper.toDtoList(repository.findAll());
    }

    /**
     * {@inheritDoc}.
     */
    @Override
    @Transactional(readOnly = true)
    public List<DefectTypeDTO> getActiveDefectTypes() {
        return defectTypeMapper.toDtoList(repository.findByActiveTrue());
    }

    /**
     * {@inheritDoc}.
     */
    @Override
    @Transactional(readOnly = true)
    public List<DefectTypeEntity> getAllActiveDefectTypes() {
        return repository.findByActiveTrue();
    }

    /**
     * {@inheritDoc}.
     */
    @Override
    @Transactional(readOnly = true)
    public DefectTypeDTO getDefectTypeById(UUID id) {
        return repository.findById(id)
                .map(defectTypeMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Тип дефекту з ID " + id + " не знайдено"));
    }

    /**
     * {@inheritDoc}.
     */
    @Override
    @Transactional(readOnly = true)
    public DefectTypeDTO getDefectTypeByCode(String code) {
        return repository.findByCode(code)
                .map(defectTypeMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Тип дефекту з кодом " + code + " не знайдено"));
    }

    /**
     * {@inheritDoc}.
     */
    @Override
    @Transactional
    public DefectTypeDTO createDefectType(DefectTypeDTO defectTypeDTO) {
        if (defectTypeDTO.getId() != null && repository.existsById(defectTypeDTO.getId())) {
            throw new IllegalArgumentException("Тип дефекту з ID " + defectTypeDTO.getId() + " вже існує");
        }

        if (repository.existsByCode(defectTypeDTO.getCode())) {
            throw new IllegalArgumentException("Тип дефекту з кодом " + defectTypeDTO.getCode() + " вже існує");
        }

        DefectTypeEntity entity = defectTypeMapper.toEntity(defectTypeDTO);
        entity = repository.save(entity);

        log.info("Створено новий тип дефекту: {}", entity.getCode());
        return defectTypeMapper.toDto(entity);
    }

    /**
     * {@inheritDoc}.
     */
    @Override
    @Transactional
    public DefectTypeDTO updateDefectType(UUID id, DefectTypeDTO defectTypeDTO) {
        DefectTypeEntity existingEntity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Тип дефекту з ID " + id + " не знайдено"));

        // Перевіряємо, чи не існує інший запис з таким же кодом
        if (!existingEntity.getCode().equals(defectTypeDTO.getCode()) &&
                repository.existsByCode(defectTypeDTO.getCode())) {
            throw new IllegalArgumentException("Тип дефекту з кодом " + defectTypeDTO.getCode() + " вже існує");
        }

        // Оновлюємо поля
        existingEntity.setCode(defectTypeDTO.getCode());
        existingEntity.setName(defectTypeDTO.getName());
        existingEntity.setDescription(defectTypeDTO.getDescription());
        existingEntity.setRiskLevel(defectTypeDTO.getRiskLevel());
        existingEntity.setActive(defectTypeDTO.isActive());

        existingEntity = repository.save(existingEntity);

        log.info("Оновлено тип дефекту: {}", existingEntity.getCode());
        return defectTypeMapper.toDto(existingEntity);
    }

    /**
     * {@inheritDoc}.
     */
    @Override
    @Transactional
    public void deleteDefectType(UUID id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Тип дефекту з ID " + id + " не знайдено");
        }

        repository.deleteById(id);
        log.info("Видалено тип дефекту з ID: {}", id);
    }

    /**
     * {@inheritDoc}.
     */
    @Override
    @Transactional(readOnly = true)
    public List<DefectTypeDTO> getDefectTypesByRiskLevel(RiskLevel riskLevel) {
        return defectTypeMapper.toDtoList(repository.findByActiveTrueAndRiskLevel(riskLevel));
    }
}
