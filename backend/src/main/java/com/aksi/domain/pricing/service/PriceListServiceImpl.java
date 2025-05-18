package com.aksi.domain.pricing.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.pricing.dto.PriceListItemDTO;
import com.aksi.domain.pricing.entity.PriceListItemEntity;
import com.aksi.domain.pricing.entity.ServiceCategoryEntity;
import com.aksi.domain.pricing.repository.PriceListItemRepository;
import com.aksi.domain.pricing.repository.ServiceCategoryRepository;
import com.aksi.exception.EntityNotFoundException;
import com.aksi.mapper.PriceListMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація сервісу для роботи з прайс-листом послуг.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PriceListServiceImpl implements PriceListService {
    
    private final PriceListItemRepository priceListItemRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final PriceListMapper priceListMapper;
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<PriceListItemDTO> getAllActiveItems() {
        log.debug("Отримання списку всіх активних елементів прайс-листа");
        
        List<PriceListItemEntity> items = priceListItemRepository.findAllByActiveTrue();
        
        return priceListMapper.toItemDtoList(items);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<PriceListItemDTO> getItemsByCategory(UUID categoryId) {
        log.debug("Отримання елементів прайс-листа за категорією з ID: {}", categoryId);
        
        ServiceCategoryEntity category = serviceCategoryRepository.findById(categoryId)
                .orElseThrow(() -> EntityNotFoundException.withId(categoryId));
        
        List<PriceListItemEntity> items = priceListItemRepository.findAllByCategoryOrderByCatalogNumberAsc(category);
        
        return priceListMapper.toItemDtoList(items);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<PriceListItemDTO> getItemsByCategoryCode(String categoryCode) {
        log.debug("Отримання елементів прайс-листа за кодом категорії: {}", categoryCode);
        
        ServiceCategoryEntity category = serviceCategoryRepository.findByCode(categoryCode)
                .orElseThrow(() -> EntityNotFoundException.withMessage("Категорію послуг не знайдено за кодом: " + categoryCode));
        
        List<PriceListItemEntity> items = priceListItemRepository.findAllByCategoryOrderByCatalogNumberAsc(category);
        
        return priceListMapper.toItemDtoList(items);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public PriceListItemDTO getItemById(UUID id) {
        log.debug("Отримання елемента прайс-листа за ID: {}", id);
        
        PriceListItemEntity item = priceListItemRepository.findById(id)
                .orElseThrow(() -> EntityNotFoundException.withId(id));
        
        return priceListMapper.toDto(item);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<String> getAvailableUnitsOfMeasure(UUID categoryId) {
        log.debug("Отримання доступних одиниць виміру для категорії з ID: {}", categoryId);
        
        // Перевіряємо, чи існує категорія
        if (!serviceCategoryRepository.existsById(categoryId)) {
            throw EntityNotFoundException.withId(categoryId);
        }
        
        // Отримуємо всі унікальні одиниці виміру для цієї категорії
        return priceListItemRepository.findAllByCategory(
                ServiceCategoryEntity.builder().id(categoryId).build()
                ).stream()
                .map(PriceListItemEntity::getUnitOfMeasure)
                .distinct()
                .collect(Collectors.toList());
    }
}
