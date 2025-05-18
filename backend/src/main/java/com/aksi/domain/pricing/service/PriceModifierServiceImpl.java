package com.aksi.domain.pricing.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.entity.PriceModifierEntity;
import com.aksi.domain.pricing.entity.PriceModifierEntity.ModifierCategory;
import com.aksi.domain.pricing.mapper.PriceModifierMapper;
import com.aksi.domain.pricing.repository.PriceModifierRepository;
import com.aksi.domain.pricing.repository.ServiceCategoryRepository;
import com.aksi.exception.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація сервісу для роботи з модифікаторами цін.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PriceModifierServiceImpl implements PriceModifierService {
    
    private final PriceModifierRepository modifierRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final PriceModifierMapper modifierMapper;
    
    /**
     * Мапа для конвертації кодів категорій послуг у категорії модифікаторів.
     */
    private static final Map<String, ModifierCategory> SERVICE_CATEGORY_TO_MODIFIER_CATEGORY = Map.of(
        // Textile categories
        "CLOTHING", ModifierCategory.TEXTILE,
        "IRONING", ModifierCategory.TEXTILE,
        "PADDING", ModifierCategory.TEXTILE,
        "DYEING", ModifierCategory.TEXTILE,
        "LAUNDRY", ModifierCategory.TEXTILE,
        
        // Leather categories
        "LEATHER", ModifierCategory.LEATHER,
        "FUR", ModifierCategory.LEATHER,
        
        // All others are treated as general (although they apply to both but with specific factors)
        "ADDITIONAL_SERVICES", ModifierCategory.GENERAL
    );
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<PriceModifierDTO> getAllActiveModifiers() {
        log.debug("Отримання всіх активних модифікаторів цін");
        return modifierRepository.findByActiveTrue().stream()
                .map(modifierMapper::toDto)
                .collect(Collectors.toList());
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public PriceModifierDTO getModifierById(UUID id) {
        log.debug("Отримання модифікатора за ID: {}", id);
        return modifierRepository.findById(id)
                .map(modifierMapper::toDto)
                .orElse(null);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public PriceModifierDTO getModifierByCode(String code) {
        log.debug("Отримання модифікатора за кодом: {}", code);
        return modifierRepository.findByCode(code)
                .map(modifierMapper::toDto)
                .orElse(null);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<PriceModifierDTO> getModifiersForServiceCategory(String categoryCode) {
        log.debug("Отримання модифікаторів для категорії послуг: {}", categoryCode);
        
        // Отримуємо модифікатор-категорію для коду категорії послуг 
        ModifierCategory modifierCategory = SERVICE_CATEGORY_TO_MODIFIER_CATEGORY.getOrDefault(
                categoryCode, ModifierCategory.GENERAL);
        
        // Отримуємо модифікатори для цієї категорії
        return modifierRepository.findModifiersForServiceCategory(modifierCategory).stream()
                .map(modifierMapper::toDto)
                .collect(Collectors.toList());
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public PriceModifierDTO createModifier(PriceModifierDTO modifierDTO) {
        log.debug("Створення нового модифікатора: {}", modifierDTO);
        
        // Перевіряємо, чи не існує вже модифікатор з таким кодом
        Optional<PriceModifierEntity> existingModifier = modifierRepository.findByCode(modifierDTO.getCode());
        if (existingModifier.isPresent()) {
            log.warn("Модифікатор з кодом {} вже існує", modifierDTO.getCode());
            throw new IllegalArgumentException("Модифікатор з кодом " + modifierDTO.getCode() + " вже існує");
        }
        
        // Створюємо новий модифікатор
        PriceModifierEntity entity = modifierMapper.toEntity(modifierDTO);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        
        // Зберігаємо і повертаємо
        PriceModifierEntity savedEntity = modifierRepository.save(entity);
        return modifierMapper.toDto(savedEntity);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public PriceModifierDTO updateModifier(UUID id, PriceModifierDTO modifierDTO) {
        log.debug("Оновлення модифікатора з ID {}: {}", id, modifierDTO);
        
        // Знаходимо існуючий модифікатор
        PriceModifierEntity existingEntity = modifierRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Модифікатор з ID " + id + " не знайдено"));
        
        // Перевіряємо унікальність коду, якщо він змінюється
        if (!existingEntity.getCode().equals(modifierDTO.getCode())) {
            Optional<PriceModifierEntity> entityWithSameCode = modifierRepository.findByCode(modifierDTO.getCode());
            if (entityWithSameCode.isPresent()) {
                log.warn("Модифікатор з кодом {} вже існує", modifierDTO.getCode());
                throw new IllegalArgumentException("Модифікатор з кодом " + modifierDTO.getCode() + " вже існує");
            }
        }
        
        // Оновлюємо поля
        existingEntity.setCode(modifierDTO.getCode());
        existingEntity.setName(modifierDTO.getName());
        existingEntity.setDescription(modifierDTO.getDescription());
        existingEntity.setModifierType(modifierDTO.getModifierType());
        existingEntity.setCategory(modifierDTO.getCategory());
        existingEntity.setValue(modifierDTO.getValue());
        existingEntity.setMinValue(modifierDTO.getMinValue());
        existingEntity.setMaxValue(modifierDTO.getMaxValue());
        existingEntity.setActive(modifierDTO.isActive());
        existingEntity.setSortOrder(modifierDTO.getSortOrder());
        existingEntity.setUpdatedAt(LocalDateTime.now());
        
        // Зберігаємо і повертаємо
        PriceModifierEntity updatedEntity = modifierRepository.save(existingEntity);
        return modifierMapper.toDto(updatedEntity);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public void deactivateModifier(UUID id) {
        log.debug("Деактивація модифікатора з ID: {}", id);
        
        // Знаходимо існуючий модифікатор
        PriceModifierEntity existingEntity = modifierRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Модифікатор з ID " + id + " не знайдено"));
        
        // Деактивуємо (soft delete)
        existingEntity.setActive(false);
        existingEntity.setUpdatedAt(LocalDateTime.now());
        
        modifierRepository.save(existingEntity);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<PriceModifierDTO> getModifiersByCategory(ModifierCategory category) {
        log.debug("Отримання модифікаторів за категорією: {}", category);
        return modifierRepository.findByActiveTrueAndCategory(category).stream()
                .map(modifierMapper::toDto)
                .collect(Collectors.toList());
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<PriceModifierDTO> getModifiersByCodes(List<String> codes) {
        if (codes == null || codes.isEmpty()) {
            return Collections.emptyList();
        }
        
        log.debug("Отримання модифікаторів за кодами: {}", codes);
        return modifierRepository.findByCodeInAndActiveTrue(codes).stream()
                .map(modifierMapper::toDto)
                .collect(Collectors.toList());
    }
} 