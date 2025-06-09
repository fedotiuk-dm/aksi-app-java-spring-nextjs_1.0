package com.aksi.domain.order.statemachine.stage2.substep4.service;

import java.util.UUID;
import java.util.function.Supplier;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage2.substep4.dto.PriceDiscountDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.SubstepResultDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountEvent;
import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountState;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Універсальний процесор подій для підетапу 2.4.
 * Відповідає за валідацію подій, переходи станів та обробку помилок.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PriceDiscountEventProcessor {

    private final PriceDiscountStateService stateService;
    private final PriceDiscountResultFactory resultFactory;

    /**
     * Універсальна обробка подій з валідацією та переходами станів.
     */
    public SubstepResultDTO processEvent(UUID sessionId, PriceDiscountEvent event,
                                       Supplier<String> businessLogic) {
        try {
            // Отримання поточного стану та даних
            PriceDiscountState currentState = stateService.getCurrentState(sessionId);
            PriceDiscountDTO currentData = stateService.getData(sessionId);

            // Ініціалізація стану для системних подій
            if (currentState == null && event.isSystemEvent()) {
                currentState = PriceDiscountState.INITIAL;
                stateService.updateState(sessionId, currentState);
            }

            // Валідація події для поточного стану
            if (currentState != null && !event.isValidForState(currentState)) {
                String errorMessage = String.format("Подія %s не дозволена для стану %s",
                    event.getDisplayName(), currentState.getDisplayName());
                log.warn("Event validation failed: {}", errorMessage);
                return resultFactory.createErrorResult(sessionId, currentState, currentData, errorMessage);
            }

            // Валідація даних для поточного стану
            if (shouldValidateData(event, currentState, currentData)) {
                if (currentState != null && !currentState.isValidForData(currentData)) {
                    String errorMessage = "Дані не валідні для поточного стану: " + currentState.getRequiredData();
                    log.warn("Data validation failed: {}", errorMessage);
                    return resultFactory.createErrorResult(sessionId, currentState, currentData, errorMessage);
                }
            }

            // Виконання бізнес-логіки
            String result = businessLogic.get();
            log.debug("Business logic executed successfully: {}", result);

            // Перехід до цільового стану
            PriceDiscountState targetState = event.getTargetState();
            if (targetState != null && !targetState.equals(currentState)) {
                stateService.updateState(sessionId, targetState);
                log.debug("State transition: {} -> {}", currentState, targetState);
            }

            // Створення успішного результату
            PriceDiscountState finalState = stateService.getCurrentState(sessionId);
            PriceDiscountDTO updatedData = stateService.getData(sessionId);

            return resultFactory.createSuccessResult(sessionId, finalState, updatedData, result);

        } catch (Exception e) {
            log.error("Error processing event {}: {}", event.getDisplayName(), e.getMessage(), e);
            return handleEventError(sessionId, event, e);
        }
    }

    /**
     * Обробка помилок при виконанні подій.
     */
    public SubstepResultDTO handleEventError(UUID sessionId, PriceDiscountEvent event, Exception exception) {
        try {
            PriceDiscountState currentState = stateService.getCurrentState(sessionId);
            PriceDiscountDTO currentData = stateService.getData(sessionId);

            String errorMessage = "Помилка при обробці події " + event.getDisplayName() + ": " + exception.getMessage();

            // Оновлюємо дані з інформацією про помилку
            if (currentData != null) {
                PriceDiscountDTO errorData = currentData.toBuilder()
                    .hasCalculationErrors(true)
                    .errorMessage(errorMessage)
                    .build();
                stateService.updateData(sessionId, errorData);
            }

            return resultFactory.createErrorResult(sessionId, currentState, currentData, errorMessage);

        } catch (Exception nestedError) {
            log.error("Critical error in error handling: {}", nestedError.getMessage(), nestedError);
            return resultFactory.createCriticalErrorResult(sessionId, exception.getMessage());
        }
    }

    /**
     * Перевірка валідності поточного стану сесії.
     */
    public boolean isSessionStateValid(UUID sessionId) {
        try {
            PriceDiscountState currentState = stateService.getCurrentState(sessionId);
            PriceDiscountDTO data = stateService.getData(sessionId);

            return currentState != null &&
                   (currentState.isInitial() || currentState.isValidForData(data));
        } catch (Exception e) {
            log.error("Error validating session state: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Отримання можливих подій для поточного стану.
     */
    public java.util.List<PriceDiscountEvent> getAvailableEvents(UUID sessionId) {
        PriceDiscountState currentState = stateService.getCurrentState(sessionId);
        return currentState != null ?
            PriceDiscountEvent.getValidEventsForState(currentState) :
            java.util.List.of();
    }

    // === PRIVATE МЕТОДИ ===

    /**
     * Визначає, чи потрібно валідувати дані для цієї події.
     */
    private boolean shouldValidateData(PriceDiscountEvent event, PriceDiscountState currentState,
                                     PriceDiscountDTO currentData) {
        return !event.isSystemEvent() &&
               currentState != null &&
               currentData != null &&
               !currentState.isInitial();
    }
}
