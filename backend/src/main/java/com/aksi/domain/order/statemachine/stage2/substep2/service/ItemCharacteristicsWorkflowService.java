package com.aksi.domain.order.statemachine.stage2.substep2.service;

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
 * Сервіс бізнес-логіки для робочого процесу характеристик предмета
 */
@Service
public class ItemCharacteristicsWorkflowService {

    private final ItemCharacteristicsStateService stateService;
    private final ItemCharacteristicsValidationService validationService;
    private final ItemCharacteristicsOperationsService operationsService;
    private final ItemCharacteristicsMapper mapper;

    public ItemCharacteristicsWorkflowService(
            ItemCharacteristicsStateService stateService,
            ItemCharacteristicsValidationService validationService,
            ItemCharacteristicsOperationsService operationsService,
            ItemCharacteristicsMapper mapper) {
        this.stateService = stateService;
        this.validationService = validationService;
        this.operationsService = operationsService;
        this.mapper = mapper;
    }

    /**
     * Ініціалізує підетап характеристик для вказаного предмета.
     */
    public ItemCharacteristicsDTO initializeCharacteristics(final UUID sessionId, final UUID orderId, final UUID itemId) {
        // Створюємо контекст
        final ItemCharacteristicsContext context = stateService.createContext(sessionId);

        // Отримуємо дані предмета з замовлення
        final OrderItemDTO orderItem = operationsService.getCurrentOrderItem(orderId, itemId);
        if (orderItem == null) {
            context.setErrorMessage("Предмет не знайдено в замовленні");
            stateService.updateState(sessionId, ItemCharacteristicsState.ERROR);
            return context.getData();
        }

        // Створюємо DTO на основі даних предмета
        final OrderItemAddRequest itemRequest = convertToAddRequest(orderItem);
        final ItemCharacteristicsDTO dto = mapper.fromOrderItemAddRequest(itemRequest);

        // Оновлюємо контекст
        context.setData(dto);
        stateService.updateState(sessionId, ItemCharacteristicsState.SELECTING_MATERIAL);

        return dto;
    }

    /**
     * Оновлює матеріал предмета.
     */
    public ItemCharacteristicsDTO updateMaterial(final UUID sessionId, final String material) {
        final ItemCharacteristicsContext context = stateService.getContext(sessionId);
        if (context == null) {
            throw new IllegalStateException("Контекст сесії не знайдено");
        }

        // Валідуємо матеріал
        final ValidationResult validationResult = validationService.validateMaterial(material);
        if (!validationResult.isValid()) {
            context.setErrorMessage(validationResult.getFirstError());
            return context.getData();
        }

        // Конвертуємо в OrderItemAddRequest для mapper
        final OrderItemAddRequest currentRequest = mapper.toOrderItemAddRequest(context.getData());
        final OrderItemAddRequest updatedRequest = mapper.updateWithMaterial(currentRequest, material);
        final ItemCharacteristicsDTO updatedDto = mapper.fromOrderItemAddRequest(updatedRequest);

        context.setData(updatedDto);
        context.clearError();

        // Оновлюємо стан якщо всі поля матеріалу заповнені
        if (updatedDto.isMaterialSelectionCompleted()) {
            stateService.updateState(sessionId, ItemCharacteristicsState.SELECTING_COLOR);
        }

        return updatedDto;
    }

    /**
     * Оновлює колір предмета.
     */
    public ItemCharacteristicsDTO updateColor(final UUID sessionId, final String color) {
        final ItemCharacteristicsContext context = stateService.getContext(sessionId);
        if (context == null) {
            throw new IllegalStateException("Контекст сесії не знайдено");
        }

        // Валідуємо колір
        final ValidationResult validationResult = validationService.validateColor(color);
        if (!validationResult.isValid()) {
            context.setErrorMessage(validationResult.getFirstError());
            return context.getData();
        }

        // Конвертуємо в OrderItemAddRequest для mapper
        final OrderItemAddRequest currentRequest = mapper.toOrderItemAddRequest(context.getData());
        final OrderItemAddRequest updatedRequest = mapper.updateWithColor(currentRequest, color);
        final ItemCharacteristicsDTO updatedDto = mapper.fromOrderItemAddRequest(updatedRequest);

        context.setData(updatedDto);
        context.clearError();

        // Оновлюємо стан якщо всі поля кольору заповнені
        if (updatedDto.isColorSelectionCompleted()) {
            stateService.updateState(sessionId, ItemCharacteristicsState.SELECTING_FILLER);
        }

        return updatedDto;
    }

    /**
     * Оновлює наповнювач предмета.
     */
    public ItemCharacteristicsDTO updateFiller(final UUID sessionId, final String fillerType) {
        final ItemCharacteristicsContext context = stateService.getContext(sessionId);
        if (context == null) {
            throw new IllegalStateException("Контекст сесії не знайдено");
        }

        // Валідуємо наповнювач якщо він вказаний
        if (fillerType != null && !fillerType.trim().isEmpty()) {
            final ValidationResult validationResult = validationService.validateFiller(fillerType);
            if (!validationResult.isValid()) {
                context.setErrorMessage(validationResult.getFirstError());
                return context.getData();
            }
        }

        // Конвертуємо в OrderItemAddRequest для mapper
        final OrderItemAddRequest currentRequest = mapper.toOrderItemAddRequest(context.getData());
        final OrderItemAddRequest updatedRequest = mapper.updateWithFiller(currentRequest, fillerType, false);
        final ItemCharacteristicsDTO updatedDto = mapper.fromOrderItemAddRequest(updatedRequest);

        context.setData(updatedDto);
        context.clearError();

        // Оновлюємо стан якщо секція наповнювача завершена
        if (updatedDto.isFillerSelectionCompleted()) {
            stateService.updateState(sessionId, ItemCharacteristicsState.SELECTING_WEAR_DEGREE);
        }

        return updatedDto;
    }

    /**
     * Оновлює ступінь зносу предмета.
     */
    public ItemCharacteristicsDTO updateWearDegree(final UUID sessionId, final String wearDegree) {
        final ItemCharacteristicsContext context = stateService.getContext(sessionId);
        if (context == null) {
            throw new IllegalStateException("Контекст сесії не знайдено");
        }

        // Валідуємо ступінь зносу
        final ValidationResult validationResult = validationService.validateWearDegree(wearDegree);
        if (!validationResult.isValid()) {
            context.setErrorMessage(validationResult.getFirstError());
            return context.getData();
        }

        // Конвертуємо в OrderItemAddRequest для mapper
        final OrderItemAddRequest currentRequest = mapper.toOrderItemAddRequest(context.getData());
        final OrderItemAddRequest updatedRequest = mapper.updateWithWearDegree(currentRequest, wearDegree);
        final ItemCharacteristicsDTO updatedDto = mapper.fromOrderItemAddRequest(updatedRequest);

        context.setData(updatedDto);
        context.clearError();

        // Оновлюємо стан якщо всі поля ступеня зносу заповнені
        if (updatedDto.isWearDegreeSelectionCompleted()) {
            stateService.updateState(sessionId, ItemCharacteristicsState.COMPLETED);
        }

        return updatedDto;
    }

    /**
     * Завершує підетап характеристик та зберігає зміни.
     */
    public ItemCharacteristicsDTO completeCharacteristics(final UUID sessionId, final UUID orderId, final UUID itemId) {
        final ItemCharacteristicsContext context = stateService.getContext(sessionId);
        if (context == null) {
            throw new IllegalStateException("Контекст сесії не знайдено");
        }

        // Валідуємо готовність до завершення
        final ValidationResult validationResult = validationService.validateReadinessForNextStep(context.getData());
        if (!validationResult.isValid()) {
            context.setErrorMessage(validationResult.getFirstError());
            stateService.updateState(sessionId, ItemCharacteristicsState.ERROR);
            return context.getData();
        }

        // Конвертуємо DTO назад в OrderItemDTO та зберігаємо
        final OrderItemAddRequest updatedRequest = mapper.toOrderItemAddRequest(context.getData());
        final OrderItemDTO updatedItem = convertToItemDTO(updatedRequest);
        operationsService.updateOrderItem(orderId, itemId, updatedItem);

        // Завершуємо підетап
        stateService.updateState(sessionId, ItemCharacteristicsState.COMPLETED);

        return context.getData();
    }

    /**
     * Отримує поточні дані характеристик.
     */
    public ItemCharacteristicsDTO getCurrentData(final UUID sessionId) {
        final ItemCharacteristicsContext context = stateService.getContext(sessionId);
        return context != null ? context.getData() : new ItemCharacteristicsDTO();
    }



    // Приватні методи для конвертації

    private OrderItemAddRequest convertToAddRequest(final OrderItemDTO orderItem) {
        final OrderItemAddRequest request = new OrderItemAddRequest();
        request.setMaterial(orderItem.getMaterial());
        request.setColor(orderItem.getColor());
        request.setFillerType(orderItem.getFillerType());
        request.setWearDegree(orderItem.getWearDegree());
        // Додаткові поля за потреби
        return request;
    }

    private OrderItemDTO convertToItemDTO(final OrderItemAddRequest request) {
        final OrderItemDTO dto = new OrderItemDTO();
        dto.setMaterial(request.getMaterial());
        dto.setColor(request.getColor());
        dto.setFillerType(request.getFillerType());
        dto.setWearDegree(request.getWearDegree());
        // Додаткові поля за потреби
        return dto;
    }
}
