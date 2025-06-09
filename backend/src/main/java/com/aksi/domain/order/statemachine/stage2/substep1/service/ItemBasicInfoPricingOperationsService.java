package com.aksi.domain.order.statemachine.stage2.substep1.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.pricing.dto.PriceListItemDTO;
import com.aksi.domain.pricing.dto.ServiceCategoryDTO;
import com.aksi.domain.pricing.service.PriceListService;
import com.aksi.domain.pricing.service.ServiceCategoryService;

/**
 * Операційний сервіс для роботи з pricing domain (підетап 2.1)
 * Тонка обгортка над доменними сервісами ціноутворення
 */
@Service
public class ItemBasicInfoPricingOperationsService {

    private final ServiceCategoryService serviceCategoryService;
    private final PriceListService priceListService;

    public ItemBasicInfoPricingOperationsService(
            ServiceCategoryService serviceCategoryService,
            PriceListService priceListService) {
        this.serviceCategoryService = serviceCategoryService;
        this.priceListService = priceListService;
    }

    /**
     * Отримує список всіх активних категорій послуг
     */
    public List<ServiceCategoryDTO> getAllActiveServiceCategories() {
        return serviceCategoryService.getAllActiveCategories();
    }

    /**
     * Отримує категорію послуги за ідентифікатором
     */
    public ServiceCategoryDTO getServiceCategoryById(UUID categoryId) {
        return serviceCategoryService.getCategoryById(categoryId);
    }

    /**
     * Отримує список предметів для категорії
     */
    public List<PriceListItemDTO> getItemsForCategory(UUID categoryId) {
        return priceListService.getItemsByCategory(categoryId);
    }

    /**
     * Отримує предмет з прайс-листа за ідентифікатором
     */
    public PriceListItemDTO getPriceListItemById(UUID itemId) {
        return priceListService.getItemById(itemId);
    }

    /**
     * Пошук предмета за назвою в межах категорії
     */
    public PriceListItemDTO getItemByNameInCategory(UUID categoryId, String itemName) {
        return priceListService.getItemByNameAndCategory(itemName, categoryId);
    }

    /**
     * Перевіряє чи категорія активна
     */
    public boolean isCategoryActive(UUID categoryId) {
        ServiceCategoryDTO category = serviceCategoryService.getCategoryById(categoryId);
        return category != null && category.isActive();
    }

    /**
     * Перевіряє чи предмет активний
     */
    public boolean isItemActive(UUID itemId) {
        PriceListItemDTO item = priceListService.getItemById(itemId);
        return item != null && item.isActive();
    }

    /**
     * Перевіряє чи предмет належить до категорії
     */
    public boolean isItemBelongsToCategory(UUID itemId, UUID categoryId) {
        PriceListItemDTO item = priceListService.getItemById(itemId);
        return item != null && categoryId.equals(item.getCategoryId());
    }
}
