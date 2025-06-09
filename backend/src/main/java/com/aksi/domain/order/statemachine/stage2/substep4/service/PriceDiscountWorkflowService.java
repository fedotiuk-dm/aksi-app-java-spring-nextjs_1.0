package com.aksi.domain.order.statemachine.stage2.substep4.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep1.dto.ItemBasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.dto.StainsDefectsDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.PriceDiscountDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.SubstepResultDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountEvent;
import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountState;
import com.aksi.domain.order.statemachine.stage2.substep4.mapper.PriceDiscountMapper;
import com.aksi.domain.pricing.dto.PriceCalculationRequestDTO;
import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Спрощений сервіс для управління потоком бізнес-логіки підетапу 2.4.
 * Фокусується тільки на бізнес-операціях, делегуючи обробку подій та створення результатів.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PriceDiscountWorkflowService {

    private final PriceDiscountOperationsService operationsService;
    private final PriceDiscountStateService stateService;
    private final PriceDiscountEventProcessor eventProcessor;
    private final PriceDiscountResultFactory resultFactory;

    /**
     * Ініціалізація підетапу з базовими даними з попередніх підетапів.
     */
    public SubstepResultDTO initializeSubstep(UUID sessionId,
                                            ItemBasicInfoDTO basicInfo,
                                            ItemCharacteristicsDTO characteristics,
                                            StainsDefectsDTO stainsDefects) {
        log.info("Ініціалізація підетапу 2.4 для сесії: {}", sessionId);

        return eventProcessor.processEvent(sessionId, PriceDiscountEvent.INITIALIZE, () -> {
            // Створюємо початкові дані
            PriceDiscountDTO initialData = PriceDiscountMapper.createPriceDiscountDTO(
                basicInfo, characteristics, stainsDefects);

            // Ініціалізуємо контекст
            stateService.initializeContext(sessionId, initialData);

            return "Підетап ініціалізовано успішно";
        });
    }

    /**
     * Розрахунок базової ціни на основі вибраного предмета.
     */
    public SubstepResultDTO calculateBasePrice(UUID sessionId) {
        log.info("Розрахунок базової ціни для сесії: {}", sessionId);

        return eventProcessor.processEvent(sessionId, PriceDiscountEvent.CALCULATE_BASE_PRICE, () -> {
            PriceDiscountDTO currentData = stateService.getData(sessionId);

            // Виконуємо розрахунок
            PriceCalculationRequestDTO request = currentData.getCalculationRequest();
            PriceCalculationResponseDTO response = operationsService.calculatePrice(request);

            // Оновлюємо дані
            PriceDiscountDTO updatedData = currentData.toBuilder()
                .calculationResponse(response)
                .build();
            stateService.updateData(sessionId, updatedData);

            log.debug("Базова ціна розрахована: {}", response.getFinalTotalPrice());
            return "Базова ціна розрахована: " + response.getFinalTotalPrice();
        });
    }

    /**
     * Додавання модифікатора до розрахунку.
     */
    public SubstepResultDTO addModifier(UUID sessionId, String modifierId) {
        log.info("Додавання модифікатора {} для сесії: {}", modifierId, sessionId);

        return eventProcessor.processEvent(sessionId, PriceDiscountEvent.ADD_MODIFIER, () -> {
            PriceDiscountDTO currentData = stateService.getData(sessionId);

            // Додаємо до вибраних модифікаторів
            List<String> updatedModifiers = currentData.getSelectedModifierIds();
            if (!updatedModifiers.contains(modifierId)) {
                updatedModifiers.add(modifierId);

                PriceDiscountDTO updatedData = currentData.toBuilder()
                    .selectedModifierIds(updatedModifiers)
                    .build();
                stateService.updateData(sessionId, updatedData);
            }

            log.debug("Модифікатор додано: {}", modifierId);
            return "Модифікатор додано: " + modifierId;
        });
    }

    /**
     * Видалення модифікатора з розрахунку.
     */
    public SubstepResultDTO removeModifier(UUID sessionId, String modifierId) {
        log.info("Видалення модифікатора {} для сесії: {}", modifierId, sessionId);

        return eventProcessor.processEvent(sessionId, PriceDiscountEvent.REMOVE_MODIFIER, () -> {
            PriceDiscountDTO currentData = stateService.getData(sessionId);

            // Видаляємо з вибраних
            List<String> updatedModifiers = currentData.getSelectedModifierIds();
            updatedModifiers.remove(modifierId);

            PriceDiscountDTO updatedData = currentData.toBuilder()
                .selectedModifierIds(updatedModifiers)
                .build();
            stateService.updateData(sessionId, updatedData);

            log.debug("Модифікатор видалено: {}", modifierId);
            return "Модифікатор видалено";
        });
    }

    /**
     * Розрахунок фінальної ціни з урахуванням модифікаторів.
     */
    public SubstepResultDTO calculateFinalPrice(UUID sessionId) {
        log.info("Розрахунок фінальної ціни для сесії: {}", sessionId);

        return eventProcessor.processEvent(sessionId, PriceDiscountEvent.CALCULATE_FINAL_PRICE, () -> {
            PriceDiscountDTO currentData = stateService.getData(sessionId);

            // Оновлюємо запит з модифікаторами
            PriceCalculationRequestDTO updatedRequest = PriceDiscountMapper.updateCalculationRequest(
                currentData.getCalculationRequest(),
                currentData.getSelectedModifierIds(),
                currentData.getRangeModifierValues(),
                currentData.getFixedModifierQuantities()
            );

            // Виконуємо розрахунок
            PriceCalculationResponseDTO response = operationsService.calculatePrice(updatedRequest);

            // Оновлюємо дані
            PriceDiscountDTO updatedData = currentData.toBuilder()
                .calculationRequest(updatedRequest)
                .calculationResponse(response)
                .calculationCompleted(true)
                .build();

            stateService.updateData(sessionId, updatedData);

            log.debug("Фінальна ціна розрахована: {}", response.getFinalTotalPrice());
            return "Фінальна ціна розрахована: " + response.getFinalTotalPrice();
        });
    }

    /**
     * Підтвердження розрахунку та завершення підетапу.
     */
    public SubstepResultDTO confirmCalculation(UUID sessionId) {
        log.info("Підтвердження розрахунку для сесії: {}", sessionId);

        return eventProcessor.processEvent(sessionId, PriceDiscountEvent.CONFIRM_CALCULATION, () -> {
            log.info("Підетап 2.4 завершено успішно");
            return "Підетап завершено успішно";
        });
    }

    /**
     * Скидання розрахунку.
     */
    public SubstepResultDTO resetCalculation(UUID sessionId) {
        log.info("Скидання розрахунку для сесії: {}", sessionId);

        return eventProcessor.processEvent(sessionId, PriceDiscountEvent.RESET_CALCULATION, () -> {
            // Видаляємо контекст
            stateService.removeContext(sessionId);
            return "Розрахунок скинуто";
        });
    }

    /**
     * Обробка помилки.
     */
    public SubstepResultDTO handleError(UUID sessionId, String errorMessage) {
        log.error("Обробка помилки для сесії {}: {}", sessionId, errorMessage);

        return eventProcessor.processEvent(sessionId, PriceDiscountEvent.HANDLE_ERROR, () -> {
            PriceDiscountDTO currentData = stateService.getData(sessionId);
            if (currentData != null) {
                PriceDiscountDTO errorData = currentData.toBuilder()
                    .hasCalculationErrors(true)
                    .errorMessage(errorMessage)
                    .build();
                stateService.updateData(sessionId, errorData);
            }
            return "Помилка оброблена: " + errorMessage;
        });
    }

    // === ДЕЛЕГОВАНІ МЕТОДИ ===

    /**
     * Отримання поточного стану підетапу.
     */
    public SubstepResultDTO getCurrentState(UUID sessionId) {
        PriceDiscountState currentState = stateService.getCurrentState(sessionId);
        PriceDiscountDTO data = stateService.getData(sessionId);

        return resultFactory.createInfoResult(sessionId, currentState, data,
            "Поточний стан: " + (currentState != null ? currentState.getDisplayName() : "невідомий"));
    }

    /**
     * Отримання доступних подій для поточного стану.
     */
    public List<PriceDiscountEvent> getAvailableEvents(UUID sessionId) {
        return eventProcessor.getAvailableEvents(sessionId);
    }

    /**
     * Перевірка валідності поточного стану.
     */
    public boolean isCurrentStateValid(UUID sessionId) {
        return eventProcessor.isSessionStateValid(sessionId);
    }
}
