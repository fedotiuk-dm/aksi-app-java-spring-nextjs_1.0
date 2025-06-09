package com.aksi.domain.order.statemachine.stage2.substep1.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep1.dto.ItemBasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.dto.SubstepResultDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.enums.ItemBasicInfoState;
import com.aksi.domain.order.statemachine.stage2.substep1.mapper.ItemBasicInfoMapper;
import com.aksi.domain.order.statemachine.stage2.substep1.validator.ValidationResult;

/**
 * Сервіс для управління життєвим циклом сесії підетапу 2.1
 */
@Service
public class ItemBasicInfoSessionService {

    private final ItemBasicInfoValidationService validationService;
    private final ItemBasicInfoStateService stateService;
    private final ItemBasicInfoMapper mapper;

    public ItemBasicInfoSessionService(
            ItemBasicInfoValidationService validationService,
            ItemBasicInfoStateService stateService,
            ItemBasicInfoMapper mapper) {
        this.validationService = validationService;
        this.stateService = stateService;
        this.mapper = mapper;
    }

    /**
     * Валідує поточні дані та завершує підетап якщо все корректно
     */
    public ValidationResult validateAndComplete(UUID sessionId) {
        ItemBasicInfoDTO currentData = stateService.getData(sessionId);

        if (currentData == null) {
            stateService.setError(sessionId, "Дані не ініціалізовані");
            return ValidationResult.failure("Дані не ініціалізовані");
        }

        // Проводимо валідацію
        ValidationResult validationResult = validationService.validateBasicInfo(currentData);

        if (validationResult.isValid()) {
            // Позначаємо як валідний та завершений
            ItemBasicInfoDTO validData = mapper.markAsValid(currentData);
            stateService.updateData(sessionId, validData);
            stateService.updateState(sessionId, ItemBasicInfoState.COMPLETED);
            stateService.clearError(sessionId);
        } else {
            // Позначаємо як невалідний
            ItemBasicInfoDTO invalidData = mapper.markAsInvalid(currentData);
            stateService.updateData(sessionId, invalidData);
            stateService.setError(sessionId, "Помилки валідації: " + String.join(", ", validationResult.getErrors()));
        }

        return validationResult;
    }

    /**
     * Перевіряє чи можна перейти до наступного підетапу
     */
    public boolean canProceedToNext(UUID sessionId) {
        ItemBasicInfoDTO data = stateService.getData(sessionId);
        return validationService.canProceedToNextStep(data);
    }

    /**
     * Отримує останню помилку для сесії
     */
    public String getLastError(UUID sessionId) {
        var context = stateService.getContext(sessionId);
        return context != null ? context.getLastError() : null;
    }

    /**
     * Отримує детальну інформацію про результат підетапу
     */
    public SubstepResultDTO getSubstepResult(UUID sessionId) {
        ItemBasicInfoDTO data = stateService.getData(sessionId);
        ItemBasicInfoState state = stateService.getCurrentState(sessionId);
        String error = getLastError(sessionId);
        boolean canProceed = canProceedToNext(sessionId);

        return new SubstepResultDTO(data, state, error, canProceed);
    }

    /**
     * Ініціалізує нову сесію підетапу
     */
    public UUID initializeSession() {
        UUID sessionId = UUID.randomUUID();
        stateService.createContext(sessionId);
        return sessionId;
    }

    /**
     * Завершує сесію підетапу
     */
    public void finalizeSession(UUID sessionId) {
        stateService.removeContext(sessionId);
    }
}
