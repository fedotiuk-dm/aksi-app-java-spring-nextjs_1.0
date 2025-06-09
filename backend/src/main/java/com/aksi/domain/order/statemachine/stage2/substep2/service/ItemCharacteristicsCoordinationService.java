package com.aksi.domain.order.statemachine.stage2.substep2.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.ItemCharacteristicsState;
import com.aksi.domain.order.statemachine.stage2.substep2.validator.ValidationResult;

/**
 * Координаційний сервіс для підетапу характеристик предмета - чистий делегатор
 */
@Service
public class ItemCharacteristicsCoordinationService {

    private final ItemCharacteristicsWorkflowService workflowService;
    private final ItemCharacteristicsValidationService validationService;
    private final ItemCharacteristicsOperationsService operationsService;
    private final ItemCharacteristicsStateService stateService;

    public ItemCharacteristicsCoordinationService(
            ItemCharacteristicsWorkflowService workflowService,
            ItemCharacteristicsValidationService validationService,
            ItemCharacteristicsOperationsService operationsService,
            ItemCharacteristicsStateService stateService) {
        this.workflowService = workflowService;
        this.validationService = validationService;
        this.operationsService = operationsService;
        this.stateService = stateService;
    }

    /**
     * Початок підетапу
     */
    public ItemCharacteristicsDTO startSubstep(UUID sessionId, String categoryCode) {
        return workflowService.startSubstep(sessionId, categoryCode);
    }

    /**
     * Вибір матеріалу
     */
    public ItemCharacteristicsDTO selectMaterial(UUID sessionId, String material) {
        return workflowService.selectMaterial(sessionId, material);
    }

    /**
     * Вибір кольору
     */
    public ItemCharacteristicsDTO selectColor(UUID sessionId, String color) {
        return workflowService.selectColor(sessionId, color);
    }

    /**
     * Завершення підетапу
     */
    public ItemCharacteristicsDTO completeSubstep(UUID sessionId) {
        return workflowService.completeSubstep(sessionId);
    }

    /**
     * Отримання поточних даних
     */
    public ItemCharacteristicsDTO getCurrentData(UUID sessionId) {
        return workflowService.getCurrentData(sessionId);
    }

    /**
     * Отримання поточного стану
     */
    public ItemCharacteristicsState getCurrentState(UUID sessionId) {
        return workflowService.getCurrentState(sessionId);
    }

    /**
     * Валідація матеріалу
     */
    public ValidationResult validateMaterial(String material) {
        return validationService.validateMaterial(material);
    }

    /**
     * Валідація кольору
     */
    public ValidationResult validateColor(String color) {
        return validationService.validateColor(color);
    }

    /**
     * Валідація повноти
     */
    public ValidationResult validateCompleteness(ItemCharacteristicsDTO dto) {
        return validationService.validateCompleteness(dto);
    }

    /**
     * Отримання списку матеріалів
     */
    public List<String> getAvailableMaterials(UUID sessionId) {
        return workflowService.getAvailableMaterials(sessionId);
    }

    /**
     * Отримання списку кольорів
     */
    public List<String> getAvailableColors() {
        return workflowService.getAvailableColors();
    }

    /**
     * Отримання списку наповнювачів
     */
    public List<String> getAvailableFillers() {
        return operationsService.getAllFillerTypes();
    }

    /**
     * Отримання списку ступенів зносу
     */
    public List<String> getAvailableWearDegrees() {
        return operationsService.getAllWearDegrees();
    }

    /**
     * Перевірка чи потрібна секція наповнювача
     */
    public boolean shouldShowFillerSection(String categoryCode) {
        return operationsService.shouldShowFillerSection(categoryCode);
    }

    /**
     * Встановлення стану сесії
     */
    public void setCurrentState(UUID sessionId, ItemCharacteristicsState state) {
        stateService.setCurrentState(sessionId, state);
    }

    /**
     * Оновлення даних характеристик
     */
    public void updateCharacteristicsData(UUID sessionId, ItemCharacteristicsDTO data) {
        stateService.updateCharacteristicsData(sessionId, data);
    }

    /**
     * Скидання контексту сесії
     */
    public void resetContext(UUID sessionId) {
        stateService.resetContext(sessionId);
    }

    /**
     * Видалення контексту сесії
     */
    public void removeContext(UUID sessionId) {
        stateService.removeContext(sessionId);
    }

    /**
     * Перевірка існування контексту
     */
    public boolean hasContext(UUID sessionId) {
        return stateService.hasContext(sessionId);
    }

    /**
     * Ініціалізація контексту з категорією
     */
    public void initializeContext(UUID sessionId, String categoryCode) {
        stateService.initializeContext(sessionId, categoryCode);
    }
}
