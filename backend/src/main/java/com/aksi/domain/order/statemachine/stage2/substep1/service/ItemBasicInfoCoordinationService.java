package com.aksi.domain.order.statemachine.stage2.substep1.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep1.dto.ItemBasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.dto.SubstepResultDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.enums.ItemBasicInfoState;
import com.aksi.domain.order.statemachine.stage2.substep1.service.ItemBasicInfoStateService.ItemBasicInfoContext;
import com.aksi.domain.order.statemachine.stage2.substep1.validator.ValidationResult;
import com.aksi.domain.pricing.dto.PriceListItemDTO;
import com.aksi.domain.pricing.dto.ServiceCategoryDTO;

import lombok.extern.slf4j.Slf4j;

/**
 * Координаційний сервіс для підетапу 2.1 - головний делегатор
 * Інкапсулює всю логіку роботи з основною інформацією про предмет
 */
@Service
@Slf4j
public class ItemBasicInfoCoordinationService {

    private final ItemBasicInfoValidationService validationService;
    private final ItemBasicInfoWorkflowService workflowService;
    private final ItemBasicInfoPricingOperationsService pricingOperationsService;
    private final ItemBasicInfoStateService stateService;
    private final ItemBasicInfoSessionService sessionService;

    public ItemBasicInfoCoordinationService(
            ItemBasicInfoValidationService validationService,
            ItemBasicInfoWorkflowService workflowService,
            ItemBasicInfoPricingOperationsService pricingOperationsService,
            ItemBasicInfoStateService stateService,
            ItemBasicInfoSessionService sessionService) {
        this.validationService = validationService;
        this.workflowService = workflowService;
        this.pricingOperationsService = pricingOperationsService;
        this.stateService = stateService;
        this.sessionService = sessionService;
    }

    // ========== Делегування до ValidationService ==========

    public ValidationResult validateBasicInfo(ItemBasicInfoDTO itemBasicInfo) {
        return validationService.validateBasicInfo(itemBasicInfo);
    }

    public boolean isBasicInfoComplete(ItemBasicInfoDTO itemBasicInfo) {
        return validationService.isBasicInfoComplete(itemBasicInfo);
    }

    public boolean canProceedToNextStep(ItemBasicInfoDTO itemBasicInfo) {
        return validationService.canProceedToNextStep(itemBasicInfo);
    }

    // ========== Делегування до WorkflowService ==========

    public ItemBasicInfoDTO initializeSubstep(UUID sessionId) {
        return workflowService.initializeSubstep(sessionId);
    }

    public ItemBasicInfoDTO selectServiceCategory(UUID sessionId, UUID categoryId) {
        return workflowService.selectServiceCategory(sessionId, categoryId);
    }

    public ItemBasicInfoDTO selectPriceListItem(UUID sessionId, UUID itemId) {
        return workflowService.selectPriceListItem(sessionId, itemId);
    }

    public ItemBasicInfoDTO enterQuantity(UUID sessionId, BigDecimal quantity) {
        return workflowService.enterQuantity(sessionId, quantity);
    }

    public List<ServiceCategoryDTO> getServiceCategories() {
        return workflowService.getServiceCategories();
    }

    public List<PriceListItemDTO> getItemsForCategory(UUID categoryId) {
        return workflowService.getItemsForCategory(categoryId);
    }

    public ItemBasicInfoState getCurrentState(UUID sessionId) {
        return workflowService.getCurrentState(sessionId);
    }

    public ItemBasicInfoDTO getCurrentData(UUID sessionId) {
        return workflowService.getCurrentData(sessionId);
    }

    public ItemBasicInfoDTO resetSubstep(UUID sessionId) {
        return workflowService.resetSubstep(sessionId);
    }

    // ========== Делегування до PricingOperationsService ==========

    public List<ServiceCategoryDTO> getAllActiveServiceCategories() {
        log.info("🔧 КООРДИНАЦІЯ: Запит на отримання активних категорій послуг");

        List<ServiceCategoryDTO> categories = pricingOperationsService.getAllActiveServiceCategories();

        log.info("📋 КООРДИНАЦІЯ: Отримано {} категорій від pricing операцій", categories.size());
        if (categories.isEmpty()) {
            log.error("❌ КООРДИНАЦІЯ: Pricing операції повернули порожній список! Перевірте базу даних.");
        }

        return categories;
    }

    public ServiceCategoryDTO getServiceCategoryById(UUID categoryId) {
        return pricingOperationsService.getServiceCategoryById(categoryId);
    }

    public List<PriceListItemDTO> getItemsForPricingCategory(UUID categoryId) {
        return pricingOperationsService.getItemsForCategory(categoryId);
    }

    public PriceListItemDTO getPriceListItemById(UUID itemId) {
        return pricingOperationsService.getPriceListItemById(itemId);
    }

    public PriceListItemDTO getItemByNameInCategory(UUID categoryId, String itemName) {
        return pricingOperationsService.getItemByNameInCategory(categoryId, itemName);
    }

    public boolean isCategoryActive(UUID categoryId) {
        return pricingOperationsService.isCategoryActive(categoryId);
    }

    public boolean isItemActive(UUID itemId) {
        return pricingOperationsService.isItemActive(itemId);
    }

    public boolean isItemBelongsToCategory(UUID itemId, UUID categoryId) {
        return pricingOperationsService.isItemBelongsToCategory(itemId, categoryId);
    }

    // ========== Делегування до StateService ==========

    public ItemBasicInfoContext createContext(UUID sessionId) {
        return stateService.createContext(sessionId);
    }

    public ItemBasicInfoContext getContext(UUID sessionId) {
        return stateService.getContext(sessionId);
    }

    public ItemBasicInfoContext getOrCreateContext(UUID sessionId) {
        return stateService.getOrCreateContext(sessionId);
    }

    public void updateState(UUID sessionId, ItemBasicInfoState newState) {
        stateService.updateState(sessionId, newState);
    }

    public void updateData(UUID sessionId, ItemBasicInfoDTO data) {
        stateService.updateData(sessionId, data);
    }

    public void setError(UUID sessionId, String error) {
        stateService.setError(sessionId, error);
    }

    public void clearError(UUID sessionId) {
        stateService.clearError(sessionId);
    }

    public boolean hasContext(UUID sessionId) {
        return stateService.hasContext(sessionId);
    }

    public void removeContext(UUID sessionId) {
        stateService.removeContext(sessionId);
    }

    public ItemBasicInfoDTO getData(UUID sessionId) {
        return stateService.getData(sessionId);
    }

    public boolean isCompleted(UUID sessionId) {
        return stateService.isCompleted(sessionId);
    }

    public boolean hasValidationError(UUID sessionId) {
        return stateService.hasValidationError(sessionId);
    }

    // ========== Делегування до SessionService ==========

    public ValidationResult validateAndComplete(UUID sessionId) {
        return sessionService.validateAndComplete(sessionId);
    }

    public boolean canProceedToNext(UUID sessionId) {
        return sessionService.canProceedToNext(sessionId);
    }

    public String getLastError(UUID sessionId) {
        return sessionService.getLastError(sessionId);
    }

    public SubstepResultDTO getSubstepResult(UUID sessionId) {
        return sessionService.getSubstepResult(sessionId);
    }

    public UUID initializeSession() {
        return sessionService.initializeSession();
    }

    public void finalizeSession(UUID sessionId) {
        sessionService.finalizeSession(sessionId);
    }

        // ========== Делегування ValidationService для Guards ==========

    public boolean isServiceCategorySelected(UUID sessionId) {
        ItemBasicInfoDTO data = getCurrentData(sessionId);
        return validationService.isServiceCategorySelected(data);
    }

    public boolean isItemNameSelected(UUID sessionId) {
        ItemBasicInfoDTO data = getCurrentData(sessionId);
        return validationService.isItemNameSelected(data);
    }

    public boolean isQuantityEntered(UUID sessionId) {
        ItemBasicInfoDTO data = getCurrentData(sessionId);
        return validationService.isQuantityEntered(data);
    }

    public boolean isDataValid(UUID sessionId) {
        ItemBasicInfoDTO data = getCurrentData(sessionId);
        return validationService.canProceedToNextStep(data);
    }
}
