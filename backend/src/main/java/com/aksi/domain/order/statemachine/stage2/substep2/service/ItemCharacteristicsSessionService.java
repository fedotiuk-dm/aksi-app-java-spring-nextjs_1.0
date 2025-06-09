package com.aksi.domain.order.statemachine.stage2.substep2.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.validator.ValidationResult;

/**
 * Сервіс сесії для підетапу 2.2 "Характеристики предмета".
 * Містить бізнес-логіку для роботи з сесіями та управління жизненним циклом.
 */
@Service
public class ItemCharacteristicsSessionService {

    private final ItemCharacteristicsValidationService validationService;
    private final ItemCharacteristicsWorkflowService workflowService;
    private final ItemCharacteristicsStateService stateService;
    private final ItemCharacteristicsOperationsService operationsService;

    public ItemCharacteristicsSessionService(
            final ItemCharacteristicsValidationService validationService,
            final ItemCharacteristicsWorkflowService workflowService,
            final ItemCharacteristicsStateService stateService,
            final ItemCharacteristicsOperationsService operationsService) {
        this.validationService = validationService;
        this.workflowService = workflowService;
        this.stateService = stateService;
        this.operationsService = operationsService;
    }

    /**
     * Ініціалізація підетапу характеристик
     */
    public ItemCharacteristicsDTO initializeSubstep(final UUID sessionId, final UUID itemId) {
        return workflowService.initializeCharacteristics(sessionId, null, itemId);
    }

    /**
     * Отримання доступних матеріалів для сесії
     */
    public List<String> getAvailableMaterials(final UUID sessionId) {
        // Для характеристик поки що повертаємо всі матеріали
        // В майбутньому можна буде фільтрувати за категорією предмета з сесії
        return operationsService.getAvailableMaterials(null);
    }

    /**
     * Вибір матеріалу з валідацією
     */
    public ValidationResult selectMaterial(final UUID sessionId, final UUID materialId) {
        // Для спрощення поки що використовуємо materialId як materialName
        // В реальній реалізації потрібно буде мапити ID в назву через lookup таблицю
        String materialName = "MaterialID_" + materialId.toString().substring(0, 8);

        // Валідуємо
        ValidationResult validation = validationService.validateMaterial(materialName);
        if (!validation.isValid()) {
            return validation;
        }

        // Оновлюємо дані
        workflowService.updateMaterial(sessionId, materialName);
        return ValidationResult.success();
    }

    /**
     * Вибір кольору з валідацією
     */
    public ValidationResult selectColor(final UUID sessionId, final String color) {
        ValidationResult validation = validationService.validateColor(color);
        if (!validation.isValid()) {
            return validation;
        }

        workflowService.updateColor(sessionId, color);
        return ValidationResult.success();
    }

    /**
     * Вибір наповнювача з валідацією
     */
    public ValidationResult selectFiller(final UUID sessionId, final String fillerType, final Boolean isFillerDamaged) {
        ValidationResult validation = validationService.validateFiller(fillerType);
        if (!validation.isValid()) {
            return validation;
        }

        // Додаємо інформацію про пошкодження до типу наповнювача
        String fullFillerInfo = fillerType;
        if (Boolean.TRUE.equals(isFillerDamaged)) {
            fullFillerInfo += " (пошкоджений)";
        }

        workflowService.updateFiller(sessionId, fullFillerInfo);
        return ValidationResult.success();
    }

    /**
     * Вибір ступеня зносу з валідацією
     */
    public ValidationResult selectWearLevel(final UUID sessionId, final Integer wearPercentage) {
        String wearDegree = wearPercentage + "%";
        ValidationResult validation = validationService.validateWearDegree(wearDegree);
        if (!validation.isValid()) {
            return validation;
        }

        workflowService.updateWearDegree(sessionId, wearDegree);
        return ValidationResult.success();
    }

    /**
     * Валідація всіх характеристик для сесії
     */
    public ValidationResult validateCharacteristics(final UUID sessionId) {
        ItemCharacteristicsDTO data = workflowService.getCurrentData(sessionId);
        if (data == null) {
            return ValidationResult.failure("Дані характеристик не знайдено");
        }

        return validationService.validateAllCharacteristics(data);
    }

    /**
     * Завершення підетапу з поверненням результату
     */
    public Map<String, Object> completeSubstep(final UUID sessionId) {
        ItemCharacteristicsDTO data = workflowService.getCurrentData(sessionId);

        // Валідація перед завершенням
        ValidationResult validation = validationService.validateReadinessForNextStep(data);
        if (!validation.isValid()) {
            throw new IllegalStateException("Характеристики не готові до завершення: " + validation.getErrors());
        }

        // Завершуємо через workflow
        ItemCharacteristicsDTO completedData = workflowService.completeCharacteristics(sessionId, null, null);

        // Формуємо результат
        Map<String, Object> result = new HashMap<>();
        result.put("characteristics", completedData);
        result.put("success", true);
        result.put("message", "Характеристики предмета успішно збережені");

        return result;
    }

    /**
     * Отримання поточних характеристик для сесії
     */
    public ItemCharacteristicsDTO getCurrentCharacteristics(final UUID sessionId) {
        return workflowService.getCurrentData(sessionId);
    }

    /**
     * Скасування підетапу - видаляє сесію
     */
    public void cancelSubstep(final UUID sessionId) {
        stateService.removeContext(sessionId);
    }

    /**
     * Перевіряє чи характеристики валідні через sessionId для Guards
     */
    public boolean isCharacteristicsValid(final UUID sessionId) {
        final ItemCharacteristicsDTO data = workflowService.getCurrentData(sessionId);
        return data != null && validationService.isBasicDataValid(data);
    }

    /**
     * Перевіряє чи характеристики готові до завершення через sessionId для Guards
     */
    public boolean isCharacteristicsComplete(final UUID sessionId) {
        final ItemCharacteristicsDTO data = workflowService.getCurrentData(sessionId);
        if (data == null) {
            return false;
        }
        final ValidationResult validation = validationService.validateReadinessForNextStep(data);
        return validation.isValid();
    }

    // ========== Додаткові методи для отримання довідкових даних ==========

    /**
     * Отримання всіх доступних кольорів
     */
    public List<String> getAllColors() {
        return operationsService.getAllColors();
    }

    /**
     * Отримання всіх типів наповнювачів
     */
    public List<String> getAllFillerTypes() {
        return operationsService.getAllFillerTypes();
    }

    /**
     * Отримання всіх ступенів зносу
     */
    public List<String> getAllWearDegrees() {
        return operationsService.getAllWearDegrees();
    }
}
