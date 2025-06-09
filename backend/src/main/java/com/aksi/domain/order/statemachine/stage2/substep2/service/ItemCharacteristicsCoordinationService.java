package com.aksi.domain.order.statemachine.stage2.substep2.service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.OrderItemAddRequest;
import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.ItemCharacteristicsState;
import com.aksi.domain.order.statemachine.stage2.substep2.mapper.ItemCharacteristicsMapper;
import com.aksi.domain.order.statemachine.stage2.substep2.service.ItemCharacteristicsStateService.ItemCharacteristicsContext;
import com.aksi.domain.order.statemachine.stage2.substep2.validator.ValidationResult;

/**
 * Координаційний сервіс для підетапу 2.2 "Характеристики предмета".
 * Головний делегатор між усіма сервісами для роботи з характеристиками предмета.
 */
@Service
public class ItemCharacteristicsCoordinationService {

    private final ItemCharacteristicsValidationService validationService;
    private final ItemCharacteristicsSessionService sessionService;
    private final ItemCharacteristicsWorkflowService workflowService;
    private final ItemCharacteristicsStateService stateService;
    private final ItemCharacteristicsOperationsService operationsService;
    private final ItemCharacteristicsMapper mapper;

    public ItemCharacteristicsCoordinationService(
            final ItemCharacteristicsValidationService validationService,
            final ItemCharacteristicsSessionService sessionService,
            final ItemCharacteristicsWorkflowService workflowService,
            final ItemCharacteristicsStateService stateService,
            final ItemCharacteristicsOperationsService operationsService,
            final ItemCharacteristicsMapper mapper) {
        this.validationService = validationService;
        this.sessionService = sessionService;
        this.workflowService = workflowService;
        this.stateService = stateService;
        this.operationsService = operationsService;
        this.mapper = mapper;
    }

    // ========== Делегування до ValidationService ==========

    public ValidationResult validateAllCharacteristics(final ItemCharacteristicsDTO dto) {
        return validationService.validateAllCharacteristics(dto);
    }

    public ValidationResult validateReadinessForNextStep(final ItemCharacteristicsDTO dto) {
        return validationService.validateReadinessForNextStep(dto);
    }

    public boolean isBasicDataValid(final ItemCharacteristicsDTO dto) {
        return validationService.isBasicDataValid(dto);
    }

    public ValidationResult validateMaterial(final String material) {
        return validationService.validateMaterial(material);
    }

    public ValidationResult validateColor(final String color) {
        return validationService.validateColor(color);
    }

    public ValidationResult validateFiller(final String filler) {
        return validationService.validateFiller(filler);
    }

    public ValidationResult validateWearDegree(final String wearDegree) {
        return validationService.validateWearDegree(wearDegree);
    }

    // ========== Делегування до SessionService ==========

    public ItemCharacteristicsDTO initializeSubstep(final UUID sessionId, final UUID itemId) {
        return sessionService.initializeSubstep(sessionId, itemId);
    }

    public List<String> getAvailableMaterials(final UUID sessionId) {
        return sessionService.getAvailableMaterials(sessionId);
    }

    public ValidationResult selectMaterial(final UUID sessionId, final UUID materialId) {
        return sessionService.selectMaterial(sessionId, materialId);
    }

    public ValidationResult selectColor(final UUID sessionId, final String color) {
        return sessionService.selectColor(sessionId, color);
    }

    public ValidationResult selectFiller(final UUID sessionId, final String fillerType, final Boolean isFillerDamaged) {
        return sessionService.selectFiller(sessionId, fillerType, isFillerDamaged);
    }

    public ValidationResult selectWearLevel(final UUID sessionId, final Integer wearPercentage) {
        return sessionService.selectWearLevel(sessionId, wearPercentage);
    }

    public ValidationResult validateCharacteristics(final UUID sessionId) {
        return sessionService.validateCharacteristics(sessionId);
    }

    public Map<String, Object> completeSubstep(final UUID sessionId) {
        return sessionService.completeSubstep(sessionId);
    }

    public ItemCharacteristicsDTO getCurrentCharacteristics(final UUID sessionId) {
        return sessionService.getCurrentCharacteristics(sessionId);
    }

    public void cancelSubstep(final UUID sessionId) {
        sessionService.cancelSubstep(sessionId);
    }

    // ========== Делегування до WorkflowService ==========

    public ItemCharacteristicsDTO initializeCharacteristics(final UUID sessionId, final UUID orderId, final UUID itemId) {
        return workflowService.initializeCharacteristics(sessionId, orderId, itemId);
    }

    public ItemCharacteristicsDTO updateMaterial(final UUID sessionId, final String material) {
        return workflowService.updateMaterial(sessionId, material);
    }

    public ItemCharacteristicsDTO updateColor(final UUID sessionId, final String color) {
        return workflowService.updateColor(sessionId, color);
    }

    public ItemCharacteristicsDTO updateFiller(final UUID sessionId, final String fillerType) {
        return workflowService.updateFiller(sessionId, fillerType);
    }

    public ItemCharacteristicsDTO updateWearDegree(final UUID sessionId, final String wearDegree) {
        return workflowService.updateWearDegree(sessionId, wearDegree);
    }

    public ItemCharacteristicsDTO completeCharacteristics(final UUID sessionId, final UUID orderId, final UUID itemId) {
        return workflowService.completeCharacteristics(sessionId, orderId, itemId);
    }

    public ItemCharacteristicsDTO getCurrentData(final UUID sessionId) {
        return workflowService.getCurrentData(sessionId);
    }

    // ========== Делегування до StateService ==========

    public ItemCharacteristicsContext createContext(final UUID sessionId) {
        return stateService.createContext(sessionId);
    }

    public ItemCharacteristicsContext getContext(final UUID sessionId) {
        return stateService.getContext(sessionId);
    }

    public boolean hasContext(final UUID sessionId) {
        return stateService.hasContext(sessionId);
    }

    public void updateState(final UUID sessionId, final ItemCharacteristicsState newState) {
        stateService.updateState(sessionId, newState);
    }

    public void updateData(final UUID sessionId, final ItemCharacteristicsDTO data) {
        stateService.updateData(sessionId, data);
    }

    public void setError(final UUID sessionId, final String errorMessage) {
        stateService.setError(sessionId, errorMessage);
    }

    public void clearError(final UUID sessionId) {
        stateService.clearError(sessionId);
    }

    public void removeContext(final UUID sessionId) {
        stateService.removeContext(sessionId);
    }

    public ItemCharacteristicsState getCurrentState(final UUID sessionId) {
        return stateService.getCurrentState(sessionId);
    }

    public boolean hasError(final UUID sessionId) {
        return stateService.hasError(sessionId);
    }

    public String getErrorMessage(final UUID sessionId) {
        return stateService.getErrorMessage(sessionId);
    }

    public boolean hasActiveSession(final UUID sessionId) {
        return stateService.hasActiveSession(sessionId);
    }

    public void terminateSession(final UUID sessionId) {
        stateService.terminateSession(sessionId);
    }

    // ========== Делегування до OperationsService ==========

    public OrderItemDTO getCurrentOrderItem(final UUID orderId, final UUID itemId) {
        return operationsService.getCurrentOrderItem(orderId, itemId);
    }

    public List<OrderItemDTO> getAllOrderItems(final UUID orderId) {
        return operationsService.getAllOrderItems(orderId);
    }

    public OrderItemDTO updateOrderItem(final UUID orderId, final UUID itemId, final OrderItemDTO itemDTO) {
        return operationsService.updateOrderItem(orderId, itemId, itemDTO);
    }

    public OrderItemDTO addOrderItem(final UUID orderId, final OrderItemDTO itemDTO) {
        return operationsService.addOrderItem(orderId, itemDTO);
    }

    public void deleteOrderItem(final UUID orderId, final UUID itemId) {
        operationsService.deleteOrderItem(orderId, itemId);
    }

    public boolean orderItemExists(final UUID orderId, final UUID itemId) {
        return operationsService.orderItemExists(orderId, itemId);
    }

    // ========== Інтеграційні методи з Mapper ==========

    public OrderItemAddRequest convertToOrderItemAddRequest(final ItemCharacteristicsDTO characteristicsData) {
        return mapper.toOrderItemAddRequest(characteristicsData);
    }

    // ========== Делегування ValidationService для Guards ==========

    /**
     * Перевіряє чи характеристики валідні через sessionId для Guards
     */
    public boolean isCharacteristicsValid(final UUID sessionId) {
        return sessionService.isCharacteristicsValid(sessionId);
    }

    /**
     * Перевіряє чи характеристики готові до завершення через sessionId для Guards
     */
    public boolean isCharacteristicsComplete(final UUID sessionId) {
        return sessionService.isCharacteristicsComplete(sessionId);
    }

    // ========== Делегування довідкових даних ==========

    public List<String> getAllColors() {
        return sessionService.getAllColors();
    }

    public List<String> getAllFillerTypes() {
        return sessionService.getAllFillerTypes();
    }

    public List<String> getAllWearDegrees() {
        return sessionService.getAllWearDegrees();
    }
}
