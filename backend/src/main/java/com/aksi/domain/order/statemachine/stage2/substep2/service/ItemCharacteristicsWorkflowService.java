package com.aksi.domain.order.statemachine.stage2.substep2.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.ItemCharacteristicsState;
import com.aksi.domain.order.statemachine.stage2.substep2.mapper.ItemCharacteristicsMapper;
import com.aksi.domain.order.statemachine.stage2.substep2.validator.ValidationResult;

/**
 * Сервіс бізнес-логіки для робочого процесу характеристик предмета
 */
@Service
public class ItemCharacteristicsWorkflowService {

    private final ItemCharacteristicsStateService stateService;
    private final ItemCharacteristicsValidationService validationService;
    private final ItemCharacteristicsOperationsService operationsService;

    public ItemCharacteristicsWorkflowService(
            ItemCharacteristicsStateService stateService,
            ItemCharacteristicsValidationService validationService,
            ItemCharacteristicsOperationsService operationsService) {
        this.stateService = stateService;
        this.validationService = validationService;
        this.operationsService = operationsService;
    }

    /**
     * Початок підетапу характеристик
     */
    public ItemCharacteristicsDTO startSubstep(UUID sessionId, String categoryCode) {
        stateService.initializeContext(sessionId, categoryCode);
        stateService.setCurrentState(sessionId, ItemCharacteristicsState.SELECTING_MATERIAL);

        ItemCharacteristicsDTO dto = ItemCharacteristicsMapper.createForCategory(categoryCode);
        stateService.updateCharacteristicsData(sessionId, dto);

        return dto;
    }

    /**
     * Обробка вибору матеріалу
     */
    public ItemCharacteristicsDTO selectMaterial(UUID sessionId, String material) {
        ValidationResult validation = validationService.validateMaterial(material);
        if (!validation.isValid()) {
            throw new IllegalArgumentException("Невірний матеріал: " + validation.getFirstError());
        }

        ItemCharacteristicsDTO current = stateService.getCharacteristicsData(sessionId);
        ItemCharacteristicsDTO updated = current.toBuilder()
                .material(material)
                .build();

        stateService.updateCharacteristicsData(sessionId, updated);
        stateService.setCurrentState(sessionId, ItemCharacteristicsState.SELECTING_COLOR);

        return updated;
    }

    /**
     * Обробка вибору кольору
     */
    public ItemCharacteristicsDTO selectColor(UUID sessionId, String color) {
        ValidationResult validation = validationService.validateColor(color);
        if (!validation.isValid()) {
            throw new IllegalArgumentException("Невірний колір: " + validation.getFirstError());
        }

        ItemCharacteristicsDTO current = stateService.getCharacteristicsData(sessionId);
        ItemCharacteristicsDTO updated = current.toBuilder()
                .color(color)
                .build();

        stateService.updateCharacteristicsData(sessionId, updated);

        if (Boolean.TRUE.equals(updated.getShowFillerSection())) {
            stateService.setCurrentState(sessionId, ItemCharacteristicsState.SELECTING_FILLER);
        } else {
            stateService.setCurrentState(sessionId, ItemCharacteristicsState.SELECTING_WEAR_DEGREE);
        }

        return updated;
    }

    /**
     * Завершення підетапу
     */
    public ItemCharacteristicsDTO completeSubstep(UUID sessionId) {
        ItemCharacteristicsDTO current = stateService.getCharacteristicsData(sessionId);

        ValidationResult validation = validationService.validateForNext(current);
        if (!validation.isValid()) {
            stateService.setCurrentState(sessionId, ItemCharacteristicsState.ERROR);
            throw new IllegalStateException("Дані не пройшли валідацію: " + validation.getFirstError());
        }

        stateService.setCurrentState(sessionId, ItemCharacteristicsState.COMPLETED);
        return current;
    }

    /**
     * Отримання поточних даних
     */
    public ItemCharacteristicsDTO getCurrentData(UUID sessionId) {
        return stateService.getCharacteristicsData(sessionId);
    }

    /**
     * Отримання поточного стану
     */
    public ItemCharacteristicsState getCurrentState(UUID sessionId) {
        return stateService.getCurrentState(sessionId);
    }

    /**
     * Отримання списку матеріалів
     */
    public List<String> getAvailableMaterials(UUID sessionId) {
        String categoryCode = stateService.getCategoryCode(sessionId);
        return operationsService.getMaterialsByCategory(categoryCode);
    }

    /**
     * Отримання списку кольорів
     */
    public List<String> getAvailableColors() {
        return operationsService.getAllColors();
    }
}
