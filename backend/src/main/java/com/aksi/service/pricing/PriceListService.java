package com.aksi.service.pricing;

import com.aksi.config.CacheConfig;
import com.aksi.domain.pricing.entity.PriceListItem;
import com.aksi.domain.pricing.entity.ServiceCategory;
import com.aksi.domain.pricing.repository.PriceListItemRepository;
import com.aksi.domain.pricing.repository.ServiceCategoryRepository;
import com.aksi.dto.pricing.PriceListItemDto;
import com.aksi.dto.pricing.ServiceCategoryDto;
import com.aksi.exception.ResourceNotFoundException;
import com.aksi.mapper.PriceListMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PriceListService {

    private final ServiceCategoryRepository serviceCategoryRepository;
    private final PriceListItemRepository priceListItemRepository;
    private final PriceListMapper priceListMapper;

    /**
     * Отримати всі категорії послуг з відсортованими позиціями
     */
    @Transactional(readOnly = true)
    @Cacheable(CacheConfig.PRICE_LIST_CACHE)
    public List<ServiceCategoryDto> getAllCategories() {
        log.info("Отримання всіх категорій послуг");
        List<ServiceCategory> categories = serviceCategoryRepository.findAllByOrderBySortOrderAsc();
        return priceListMapper.toCategoryDtoList(categories);
    }

    /**
     * Отримати категорію послуг за ідентифікатором
     */
    @Transactional(readOnly = true)
    @Cacheable(value = CacheConfig.PRICE_LIST_CACHE, key = "#categoryId")
    public ServiceCategoryDto getCategoryById(UUID categoryId) {
        log.info("Отримання категорії послуг за ID: {}", categoryId);
        ServiceCategory category = serviceCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Категорію послуг не знайдено"));
        return priceListMapper.toDto(category);
    }

    /**
     * Отримати категорію послуг за кодом
     */
    @Transactional(readOnly = true)
    public ServiceCategoryDto getCategoryByCode(String code) {
        log.info("Отримання категорії послуг за кодом: {}", code);
        ServiceCategory category = serviceCategoryRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Категорію послуг не знайдено"));
        return priceListMapper.toDto(category);
    }
    
    /**
     * Створити нову категорію послуг
     */
    @Transactional
    @CacheEvict(value = CacheConfig.PRICE_LIST_CACHE, allEntries = true)
    public ServiceCategoryDto createServiceCategory(ServiceCategoryDto categoryDto) {
        log.info("Створення нової категорії послуг: {}", categoryDto.getName());
        
        // Перевірка на дублікат коду
        serviceCategoryRepository.findByCode(categoryDto.getCode())
                .ifPresent(c -> {
                    throw new IllegalArgumentException("Категорія з таким кодом вже існує");
                });
        
        // Знаходимо максимальний sort_order і збільшуємо на 1
        Integer maxSortOrder = serviceCategoryRepository.findMaxSortOrder().orElse(0);
        
        ServiceCategory category = priceListMapper.toEntity(categoryDto);
        category.setSortOrder(maxSortOrder + 1);
        
        ServiceCategory savedCategory = serviceCategoryRepository.save(category);
        return priceListMapper.toDto(savedCategory);
    }
    
    /**
     * Оновити існуючу категорію послуг
     */
    @Transactional
    @CacheEvict(value = CacheConfig.PRICE_LIST_CACHE, allEntries = true)
    public ServiceCategoryDto updateServiceCategory(UUID categoryId, ServiceCategoryDto categoryDto) {
        log.info("Оновлення категорії послуг з ID: {}", categoryId);
        
        ServiceCategory existingCategory = serviceCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Категорію послуг не знайдено"));
        
        // Перевірка на дублікат коду, якщо він змінюється
        if (!existingCategory.getCode().equals(categoryDto.getCode())) {
            serviceCategoryRepository.findByCode(categoryDto.getCode())
                    .ifPresent(c -> {
                        throw new IllegalArgumentException("Категорія з таким кодом вже існує");
                    });
        }
        
        // Оновлюємо поля
        existingCategory.setName(categoryDto.getName());
        existingCategory.setCode(categoryDto.getCode());
        // Встановлюємо поле active напряму, оскільки Lombok генерує isActive() та setActive()
        existingCategory.setActive(categoryDto.isActive());
        
        if (categoryDto.getSortOrder() != null) {
            existingCategory.setSortOrder(categoryDto.getSortOrder());
        }
        
        ServiceCategory updatedCategory = serviceCategoryRepository.save(existingCategory);
        return priceListMapper.toDto(updatedCategory);
    }
    
    /**
     * Додати новий елемент прайс-листа до категорії
     */
    @Transactional
    @CacheEvict(value = CacheConfig.PRICE_LIST_CACHE, allEntries = true)
    public PriceListItemDto createPriceListItem(UUID categoryId, PriceListItemDto itemDto) {
        log.info("Створення нового елемента прайс-листа в категорії з ID: {}", categoryId);
        
        // Перевіряємо, що категорія існує
        ServiceCategory category = serviceCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Категорію послуг не знайдено"));
        
        // Знаходимо максимальний номер в каталозі для цієї категорії
        Integer maxCatalogNumber = priceListItemRepository.findMaxCatalogNumberByCategory(categoryId).orElse(0);
        
        // Перевіряємо на дублікат назви в категорії
        priceListItemRepository.findByCategoryIdAndName(categoryId, itemDto.getName())
                .ifPresent(item -> {
                    throw new IllegalArgumentException("Елемент з такою назвою вже існує в цій категорії");
                });
        
        PriceListItem item = priceListMapper.toEntity(itemDto);
        item.setCategory(category);
        item.setCatalogNumber(maxCatalogNumber + 1);
        
        PriceListItem savedItem = priceListItemRepository.save(item);
        return priceListMapper.toDto(savedItem);
    }
    
    /**
     * Оновити існуючий елемент прайс-листа
     */
    @Transactional
    @CacheEvict(value = CacheConfig.PRICE_LIST_CACHE, allEntries = true)
    public PriceListItemDto updatePriceListItem(UUID itemId, PriceListItemDto itemDto) {
        log.info("Оновлення елемента прайс-листа з ID: {}", itemId);
        
        PriceListItem existingItem = priceListItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Елемент прайс-листа не знайдено"));
        
        // Перевірка на дублікат назви, якщо вона змінюється
        if (!existingItem.getName().equals(itemDto.getName())) {
            priceListItemRepository.findByCategoryIdAndName(existingItem.getCategory().getId(), itemDto.getName())
                    .ifPresent(item -> {
                        throw new IllegalArgumentException("Елемент з такою назвою вже існує в цій категорії");
                    });
        }
        
        // Оновлюємо поля
        existingItem.setName(itemDto.getName());
        existingItem.setUnitOfMeasure(itemDto.getUnitOfMeasure());
        existingItem.setBasePrice(itemDto.getBasePrice());
        existingItem.setPriceBlack(itemDto.getPriceBlack());
        existingItem.setPriceColor(itemDto.getPriceColor());
        existingItem.setActive(itemDto.getIsActive());
        
        // Якщо потрібно змінити категорію
        if (itemDto.getCategoryId() != null && !existingItem.getCategory().getId().equals(itemDto.getCategoryId())) {
            ServiceCategory newCategory = serviceCategoryRepository.findById(itemDto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Нову категорію не знайдено"));
            existingItem.setCategory(newCategory);
            
            // Перевіряємо на дублікат назви в новій категорії
            priceListItemRepository.findByCategoryIdAndName(itemDto.getCategoryId(), itemDto.getName())
                    .ifPresent(item -> {
                        throw new IllegalArgumentException("Елемент з такою назвою вже існує в новій категорії");
                    });
            
            // Знаходимо максимальний номер в каталогі для нової категорії
            Integer maxCatalogNumber = priceListItemRepository.findMaxCatalogNumberByCategory(itemDto.getCategoryId()).orElse(0);
            existingItem.setCatalogNumber(maxCatalogNumber + 1);
        }
        
        PriceListItem updatedItem = priceListItemRepository.save(existingItem);
        return priceListMapper.toDto(updatedItem);
    }
}
