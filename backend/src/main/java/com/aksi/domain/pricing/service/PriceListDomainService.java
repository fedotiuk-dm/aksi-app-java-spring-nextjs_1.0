package com.aksi.domain.pricing.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.config.CacheConfig;
import com.aksi.domain.pricing.dto.PriceListItemDTO;
import com.aksi.domain.pricing.dto.ServiceCategoryDTO;
import com.aksi.domain.pricing.entity.PriceListItemEntity;
import com.aksi.domain.pricing.entity.ServiceCategoryEntity;
import com.aksi.domain.pricing.repository.PriceListItemRepository;
import com.aksi.domain.pricing.repository.ServiceCategoryRepository;
import com.aksi.exception.ResourceNotFoundException;
import com.aksi.mapper.PriceListMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Доменний сервіс для управління прайс-листом.
 * <p>
 * Надає бізнес-логіку для роботи з категоріями послуг та елементами прайс-листа.
 * Включає функціональність кешування для оптимізації продуктивності.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PriceListDomainService {

    /**
     * Репозиторій для роботи з категоріями послуг.
     */
    private final ServiceCategoryRepository serviceCategoryRepository;

    /**
     * Репозиторій для роботи з елементами прайс-листа.
     */
    private final PriceListItemRepository priceListItemRepository;

    /**
     * Маппер для конвертації між сутностями та DTO.
     */
    private final PriceListMapper priceListMapper;

    /**
     * Отримати всі категорії послуг з відсортованими позиціями.
     *
     * @return список всіх категорій послуг з відсортованими позиціями
     */
    @Transactional(readOnly = true)
    @Cacheable(CacheConfig.PRICE_LIST_CACHE)
    public List<ServiceCategoryDTO> getAllCategories() {
        log.info("Отримання всіх категорій послуг");
        List<ServiceCategoryEntity> categories =
                serviceCategoryRepository.findAllByOrderBySortOrderAsc();
        return priceListMapper.toCategoryDtoList(categories);
    }

    /**
     * Отримати категорію послуг за ідентифікатором.
     *
     * @param categoryId ідентифікатор категорії
     * @return категорія послуг з усіма позиціями
     * @throws ResourceNotFoundException якщо категорію не знайдено
     */
    @Transactional(readOnly = true)
    @Cacheable(value = CacheConfig.PRICE_LIST_CACHE, key = "#categoryId")
    public ServiceCategoryDTO getCategoryById(UUID categoryId) {
        log.info("Отримання категорії послуг за ID: {}", categoryId);
        ServiceCategoryEntity category = serviceCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Категорію послуг не знайдено"));
        return priceListMapper.toDto(category);
    }

    /**
     * Отримати категорію послуг за кодом.
     *
     * @param code код категорії
     * @return категорія послуг з усіма позиціями
     * @throws ResourceNotFoundException якщо категорію не знайдено
     */
    @Transactional(readOnly = true)
    public ServiceCategoryDTO getCategoryByCode(String code) {
        log.info("Отримання категорії послуг за кодом: {}", code);
        ServiceCategoryEntity category = serviceCategoryRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Категорію послуг не знайдено"));
        return priceListMapper.toDto(category);
    }

    /**
     * Створити нову категорію послуг.
     *
     * @param categoryDto об'єкт передачі даних категорії
     * @return створена категорія послуг
     * @throws IllegalArgumentException якщо категорія з таким кодом вже існує
     */
    @Transactional
    @CacheEvict(value = CacheConfig.PRICE_LIST_CACHE, allEntries = true)
    public ServiceCategoryDTO createServiceCategory(ServiceCategoryDTO categoryDto) {
        log.info("Створення нової категорії послуг: {}", categoryDto.getName());

        // Перевірка на дублікат коду
        serviceCategoryRepository.findByCode(categoryDto.getCode())
                .ifPresent(c -> {
                    throw new IllegalArgumentException("Категорія з таким кодом вже існує");
                });

        // Знаходимо максимальний sort_order і збільшуємо на 1
        Integer maxSortOrder = serviceCategoryRepository.findMaxSortOrder().orElse(0);

        ServiceCategoryEntity category = priceListMapper.toEntity(categoryDto);
        category.setSortOrder(maxSortOrder + 1);

        ServiceCategoryEntity savedCategory = serviceCategoryRepository.save(category);
        return priceListMapper.toDto(savedCategory);
    }

    /**
     * Оновити існуючу категорію послуг.
     *
     * @param categoryId ідентифікатор категорії
     * @param categoryDto об'єкт передачі даних категорії
     * @return оновлена категорія послуг
     * @throws ResourceNotFoundException якщо категорію не знайдено
     * @throws IllegalArgumentException якщо категорія з новим кодом вже існує
     */
    @Transactional
    @CacheEvict(value = CacheConfig.PRICE_LIST_CACHE, allEntries = true)
    public ServiceCategoryDTO updateServiceCategory(UUID categoryId, ServiceCategoryDTO categoryDto) {
        log.info("Оновлення категорії послуг з ID: {}", categoryId);

        ServiceCategoryEntity existingCategory = serviceCategoryRepository.findById(categoryId)
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

        ServiceCategoryEntity updatedCategory = serviceCategoryRepository.save(existingCategory);
        return priceListMapper.toDto(updatedCategory);
    }

    /**
     * Додати новий елемент прайс-листа до категорії.
     *
     * @param categoryId ідентифікатор категорії
     * @param itemDto об'єкт передачі даних елемента прайс-листа
     * @return створений елемент прайс-листа
     * @throws ResourceNotFoundException якщо категорію не знайдено
     * @throws IllegalArgumentException якщо елемент з такою назвою вже існує в категорії
     */
    @Transactional
    @CacheEvict(value = CacheConfig.PRICE_LIST_CACHE, allEntries = true)
    public PriceListItemDTO createPriceListItem(UUID categoryId, PriceListItemDTO itemDto) {
        log.info("Створення нового елемента прайс-листа в категорії з ID: {}", categoryId);

        // Перевіряємо, що категорія існує
        ServiceCategoryEntity category = serviceCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Категорію послуг не знайдено"));

        // Знаходимо максимальний номер в каталозі для цієї категорії
        Integer maxCatalogNumber =
                priceListItemRepository.findMaxCatalogNumberByCategory(categoryId).orElse(0);

        // Перевіряємо на дублікат назви в категорії
        priceListItemRepository.findByCategoryIdAndName(categoryId, itemDto.getName())
                .ifPresent(item -> {
                    throw new IllegalArgumentException(
                            "Елемент з такою назвою вже існує в цій категорії");
                });

        PriceListItemEntity item = priceListMapper.toEntity(itemDto);
        item.setCategory(category);
        item.setCatalogNumber(maxCatalogNumber + 1);

        PriceListItemEntity savedItem = priceListItemRepository.save(item);
        return priceListMapper.toDto(savedItem);
    }

    /**
     * Оновити існуючий елемент прайс-листа.
     *
     * @param itemId ідентифікатор елемента прайс-листа
     * @param itemDto об'єкт передачі даних елемента прайс-листа
     * @return оновлений елемент прайс-листа
     * @throws ResourceNotFoundException якщо елемент прайс-листа не знайдено
     * @throws IllegalArgumentException якщо елемент з новою назвою вже існує в категорії
     */
    @Transactional
    @CacheEvict(value = CacheConfig.PRICE_LIST_CACHE, allEntries = true)
    public PriceListItemDTO updatePriceListItem(UUID itemId, PriceListItemDTO itemDto) {
        log.info("Оновлення елемента прайс-листа з ID: {}", itemId);

        PriceListItemEntity existingItem = priceListItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Елемент прайс-листа не знайдено"));

        // Перевірка на дублікат назви, якщо вона змінюється
        if (!existingItem.getName().equals(itemDto.getName())) {
            UUID categoryId = existingItem.getCategory().getId();
            priceListItemRepository.findByCategoryIdAndName(categoryId, itemDto.getName())
                    .ifPresent(item -> {
                        throw new IllegalArgumentException(
                                "Елемент з такою назвою вже існує в цій категорії");
                    });
        }

        // Оновлюємо поля
        existingItem.setName(itemDto.getName());
        existingItem.setUnitOfMeasure(itemDto.getUnitOfMeasure());
        existingItem.setBasePrice(itemDto.getBasePrice());
        existingItem.setPriceBlack(itemDto.getPriceBlack());
        existingItem.setPriceColor(itemDto.getPriceColor());
        existingItem.setActive(itemDto.isActive());

        // Якщо потрібно змінити категорію
        if (itemDto.getCategoryId() != null &&
            !existingItem.getCategory().getId().equals(itemDto.getCategoryId())) {
            ServiceCategoryEntity newCategory = serviceCategoryRepository.findById(itemDto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Нову категорію не знайдено"));
            existingItem.setCategory(newCategory);
        }

        PriceListItemEntity updatedItem = priceListItemRepository.save(existingItem);
        return priceListMapper.toDto(updatedItem);
    }

    /**
     * Отримати елементи прайс-листа за категорією.
     *
     * @param categoryId ідентифікатор категорії
     * @return список елементів прайс-листа
     * @throws ResourceNotFoundException якщо категорію не знайдено
     */
    @Transactional(readOnly = true)
    public List<PriceListItemDTO> getItemsByCategory(UUID categoryId) {
        log.info("Отримання елементів прайс-листа за категорією: {}", categoryId);

        ServiceCategoryEntity category = serviceCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Категорію не знайдено"));

        List<PriceListItemEntity> items =
                priceListItemRepository.findAllByCategoryOrderByCatalogNumberAsc(category);
        return items.stream()
                .map(priceListMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Отримати елементи прайс-листа за кодом категорії.
     *
     * @param categoryCode код категорії
     * @return список елементів прайс-листа
     * @throws ResourceNotFoundException якщо категорію не знайдено
     */
    @Transactional(readOnly = true)
    public List<PriceListItemDTO> getItemsByCategoryCode(String categoryCode) {
        log.info("Отримання елементів прайс-листа за кодом категорії: {}", categoryCode);

        ServiceCategoryEntity category = serviceCategoryRepository.findByCode(categoryCode)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Категорію з кодом " + categoryCode + " не знайдено"));

        List<PriceListItemEntity> items =
                priceListItemRepository.findAllByCategoryOrderByCatalogNumberAsc(category);
        return items.stream()
                .map(priceListMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Отримати елемент прайс-листа за ідентифікатором.
     *
     * @param id ідентифікатор елемента
     * @return елемент прайс-листа
     * @throws ResourceNotFoundException якщо елемент не знайдено
     */
    @Transactional(readOnly = true)
    public PriceListItemDTO getItemById(UUID id) {
        log.info("Отримання елемента прайс-листа за ID: {}", id);
        PriceListItemEntity item = priceListItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Елемент прайс-листа не знайдено"));
        return priceListMapper.toDto(item);
    }

    /**
     * Отримати доступні одиниці виміру для категорії.
     *
     * @param categoryId ідентифікатор категорії
     * @return список унікальних одиниць виміру
     * @throws ResourceNotFoundException якщо категорію не знайдено
     */
    @Transactional(readOnly = true)
    public List<String> getAvailableUnitsOfMeasure(UUID categoryId) {
        log.info("Отримання доступних одиниць виміру для категорії: {}", categoryId);

        ServiceCategoryEntity category = serviceCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Категорію не знайдено"));

        List<PriceListItemEntity> items =
                priceListItemRepository.findAllByCategoryOrderByCatalogNumberAsc(category);

        return items.stream()
                .map(PriceListItemEntity::getUnitOfMeasure)
                .distinct()
                .filter(unit -> unit != null && !unit.trim().isEmpty())
                .collect(Collectors.toList());
    }

    /**
     * Отримати назви предметів за категорією для автокомпліту.
     *
     * @param categoryId ідентифікатор категорії
     * @return список назв предметів
     * @throws ResourceNotFoundException якщо категорію не знайдено
     */
    @Transactional(readOnly = true)
    @Cacheable(CacheConfig.PRICE_LIST_CACHE)
    public List<String> getItemNamesByCategory(UUID categoryId) {
        log.info("Отримання назв предметів за категорією: {}", categoryId);

        ServiceCategoryEntity category = serviceCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Категорію не знайдено"));

        List<PriceListItemEntity> items =
                priceListItemRepository.findAllByCategoryOrderByCatalogNumberAsc(category);

        return items.stream()
                .map(PriceListItemEntity::getName)
                .filter(name -> name != null && !name.trim().isEmpty())
                .collect(Collectors.toList());
    }
}
