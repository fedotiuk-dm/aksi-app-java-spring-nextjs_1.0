package com.aksi.domain.order.statemachine.stage2.substep1.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep1.dto.ItemBasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.enums.ItemBasicInfoState;
import com.aksi.domain.order.statemachine.stage2.substep1.mapper.ItemBasicInfoMapper;
import com.aksi.domain.order.statemachine.stage2.substep1.service.ItemBasicInfoStateService.ItemBasicInfoContext;
import com.aksi.domain.pricing.dto.PriceListItemDTO;
import com.aksi.domain.pricing.dto.ServiceCategoryDTO;

/**
 * Workflow сервіс для управління бізнес-логікою підетапу 2.1
 */
@Service
public class ItemBasicInfoWorkflowService {

    private final ItemBasicInfoStateService stateService;
    private final ItemBasicInfoMapper mapper;
    private final ItemBasicInfoPricingOperationsService pricingOperationsService;

    public ItemBasicInfoWorkflowService(
            ItemBasicInfoStateService stateService,
            ItemBasicInfoMapper mapper,
            ItemBasicInfoPricingOperationsService pricingOperationsService) {
        this.stateService = stateService;
        this.mapper = mapper;
        this.pricingOperationsService = pricingOperationsService;
    }

    /**
     * Ініціалізує новий підетап для сесії
     */
    public ItemBasicInfoDTO initializeSubstep(UUID sessionId) {
        ItemBasicInfoContext context = stateService.createContext(sessionId);

        ItemBasicInfoDTO initialData = mapper.createEmpty();
        context.setData(initialData);
        context.setCurrentState(ItemBasicInfoState.SELECTING_SERVICE_CATEGORY);

        return initialData;
    }

    /**
     * Обробляє вибір категорії послуги
     */
    public ItemBasicInfoDTO selectServiceCategory(UUID sessionId, UUID categoryId) {
        ItemBasicInfoContext context = stateService.getOrCreateContext(sessionId);

        // Отримуємо категорію
        ServiceCategoryDTO category = pricingOperationsService.getServiceCategoryById(categoryId);
        if (category == null) {
            stateService.setError(sessionId, "Категорія послуги не знайдена");
            return context.getData();
        }

        // Оновлюємо дані
        ItemBasicInfoDTO currentData = context.getData();
        if (currentData == null) {
            currentData = mapper.createEmpty();
        }

        ItemBasicInfoDTO updatedData = mapper.withServiceCategory(currentData, category);
        context.setData(updatedData);
        context.setCurrentState(ItemBasicInfoState.SELECTING_ITEM_NAME);
        stateService.clearError(sessionId);

        return updatedData;
    }

    /**
     * Обробляє вибір предмета з прайс-листа
     */
    public ItemBasicInfoDTO selectPriceListItem(UUID sessionId, UUID itemId) {
        ItemBasicInfoContext context = stateService.getOrCreateContext(sessionId);

        // Отримуємо предмет
        PriceListItemDTO item = pricingOperationsService.getPriceListItemById(itemId);
        if (item == null) {
            stateService.setError(sessionId, "Предмет не знайдений в прайс-листі");
            return context.getData();
        }

        // Перевіряємо відповідність категорії
        ItemBasicInfoDTO currentData = context.getData();
        if (currentData == null || currentData.getServiceCategory() == null) {
            stateService.setError(sessionId, "Спочатку оберіть категорію послуги");
            return currentData;
        }

        if (!currentData.getServiceCategory().getId().equals(item.getCategoryId())) {
            stateService.setError(sessionId, "Вибраний предмет не відповідає обраній категорії");
            return currentData;
        }

        // Оновлюємо дані
        ItemBasicInfoDTO updatedData = mapper.withPriceListItem(currentData, item);
        context.setData(updatedData);
        context.setCurrentState(ItemBasicInfoState.ENTERING_QUANTITY);
        stateService.clearError(sessionId);

        return updatedData;
    }

    /**
     * Обробляє введення кількості
     */
    public ItemBasicInfoDTO enterQuantity(UUID sessionId, BigDecimal quantity) {
        ItemBasicInfoContext context = stateService.getOrCreateContext(sessionId);

        ItemBasicInfoDTO currentData = context.getData();
        if (currentData == null) {
            stateService.setError(sessionId, "Дані не ініціалізовані");
            return null;
        }

        if (currentData.getPriceListItem() == null) {
            stateService.setError(sessionId, "Спочатку оберіть предмет");
            return currentData;
        }

        // Оновлюємо дані
        ItemBasicInfoDTO updatedData = mapper.withQuantity(currentData, quantity);
        context.setData(updatedData);

        // Переходимо до валідації якщо всі дані заповнені
        if (updatedData.isComplete()) {
            context.setCurrentState(ItemBasicInfoState.VALIDATING);
        }

        stateService.clearError(sessionId);
        return updatedData;
    }

    /**
     * Отримує список категорій послуг
     */
    public List<ServiceCategoryDTO> getServiceCategories() {
        return pricingOperationsService.getAllActiveServiceCategories();
    }

    /**
     * Отримує список предметів для категорії
     */
    public List<PriceListItemDTO> getItemsForCategory(UUID categoryId) {
        return pricingOperationsService.getItemsForCategory(categoryId);
    }

    /**
     * Отримує поточний стан підетапу
     */
    public ItemBasicInfoState getCurrentState(UUID sessionId) {
        return stateService.getCurrentState(sessionId);
    }

    /**
     * Отримує поточні дані підетапу
     */
    public ItemBasicInfoDTO getCurrentData(UUID sessionId) {
        return stateService.getData(sessionId);
    }

    /**
     * Скидає підетап до початкового стану
     */
    public ItemBasicInfoDTO resetSubstep(UUID sessionId) {
        stateService.removeContext(sessionId);
        return initializeSubstep(sessionId);
    }
}
