package com.aksi.domain.order.statemachine.stage1.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.branch.service.BranchLocationService;
import com.aksi.domain.branch.service.BranchValidator;
import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.service.ReceiptNumberGenerator;
import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.dto.OrderInitializationDTO;
import com.aksi.domain.order.statemachine.stage1.validator.OrderBasicInfoValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для управління етапом базової інформації замовлення (1.2).
 *
 * Відповідає за:
 * - Генерацію номеру квитанції
 * - Роботу з унікальною міткою
 * - Вибір пункту прийому замовлення
 * - Встановлення дати створення замовлення
 * - Валідацію готовності до переходу на наступний етап
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class OrderInitializationService {

    private final BranchLocationService branchLocationService;
    private final OrderBasicInfoValidator orderBasicInfoValidator;
    private final ReceiptNumberGenerator receiptNumberGenerator;
    private final BranchValidator branchValidator;

    /**
     * Ініціалізує етап базової інформації замовлення.
     */
    public void initializeOrderBasicInfo(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Ініціалізація етапу базової інформації замовлення для wizard: {}", wizardId);

        try {
            // Отримуємо обраного клієнта з попереднього етапу
            ClientResponse selectedClient = (ClientResponse) context.getExtendedState()
                .getVariables().get("finalSelectedClient");

            if (selectedClient == null) {
                throw new IllegalStateException("Клієнт не був обраний на попередньому етапі");
            }

            // Завантажуємо доступні філії
            List<BranchLocationDTO> availableBranches = branchLocationService.getActiveBranchLocations();

            // Використовуємо готові BranchLocationDTO для UI

            // Створюємо початковий DTO
            OrderInitializationDTO dto = OrderInitializationDTO.builder()
                .selectedClient(selectedClient)
                .availableBranches(availableBranches)
                .orderCreationTime(LocalDateTime.now())
                .canProceedToNext(false)
                .build();

            // Генеруємо номер квитанції
            generateReceiptNumber(dto);

            // Зберігаємо в контексті для відображення в UI
            context.getExtendedState().getVariables().put("orderInitializationData", dto);

            log.debug("Етап базової інформації замовлення ініціалізовано для wizard: {}", wizardId);

        } catch (IllegalStateException e) {
            log.error("Стан wizard {} не дозволяє ініціалізацію: {}", wizardId, e.getMessage());

            OrderInitializationDTO dto = OrderInitializationDTO.builder()
                .validationMessage("Помилка стану: " + e.getMessage())
                .canProceedToNext(false)
                .build();

            context.getExtendedState().getVariables().put("orderInitializationData", dto);
        } catch (Exception e) {
            log.error("Помилка ініціалізації етапу базової інформації для wizard {}: {}",
                wizardId, e.getMessage(), e);

            OrderInitializationDTO dto = OrderInitializationDTO.builder()
                .validationMessage("Помилка ініціалізації: " + e.getMessage())
                .canProceedToNext(false)
                .build();

            context.getExtendedState().getVariables().put("orderInitializationData", dto);
        }
    }

    /**
     * Встановлює унікальну мітку для замовлення.
     */
    public void setUniqueTag(String wizardId, String uniqueTag, StateContext<OrderState, OrderEvent> context) {
        log.debug("Встановлення унікальної мітки '{}' для wizard: {}", uniqueTag, wizardId);

        try {
            OrderInitializationDTO dto = getOrCreateOrderInitializationDTO(context);
            dto.setUniqueTag(uniqueTag);

            // Валідуємо дані з використанням OrderBasicInfoValidator
            validateAndUpdateDto(dto);

            context.getExtendedState().getVariables().put("orderInitializationData", dto);

            log.info("Унікальну мітку '{}' встановлено для wizard: {}", uniqueTag, wizardId);

        } catch (Exception e) {
            log.error("Помилка встановлення унікальної мітки для wizard {}: {}",
                wizardId, e.getMessage(), e);

            OrderInitializationDTO dto = getOrCreateOrderInitializationDTO(context);
            dto.setValidationMessage("Помилка встановлення мітки: " + e.getMessage());
            context.getExtendedState().getVariables().put("orderInitializationData", dto);
        }
    }

    /**
     * Вибирає пункт прийому замовлення.
     */
    public void selectBranch(String wizardId, String branchId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Вибір філії {} для wizard: {}", branchId, wizardId);

        try {
            // Отримуємо дані філії
            BranchLocationDTO selectedBranch = branchLocationService.getBranchLocationById(UUID.fromString(branchId));

            OrderInitializationDTO dto = getOrCreateOrderInitializationDTO(context);
            dto.setSelectedBranch(selectedBranch);

            // Перегенеруємо номер квитанції з урахуванням коду філії
            generateReceiptNumber(dto);

            // Валідуємо дані з використанням OrderBasicInfoValidator
            validateAndUpdateDto(dto);

            // Зберігаємо дані філії в контексті wizard
            context.getExtendedState().getVariables().put("orderInitializationData", dto);
            context.getExtendedState().getVariables().put("selectedBranchId", branchId);
            context.getExtendedState().getVariables().put("selectedBranch", selectedBranch);

            log.info("Філію {} обрано для wizard: {}", branchId, wizardId);

        } catch (IllegalArgumentException e) {
            log.error("Неправильний UUID філії {} для wizard {}: {}", branchId, wizardId, e.getMessage());

            OrderInitializationDTO dto = getOrCreateOrderInitializationDTO(context);
            dto.setValidationMessage("Неправильний ідентифікатор філії");
            context.getExtendedState().getVariables().put("orderInitializationData", dto);
        } catch (Exception e) {
            log.error("Помилка вибору філії {} для wizard {}: {}", branchId, wizardId, e.getMessage(), e);

            OrderInitializationDTO dto = getOrCreateOrderInitializationDTO(context);
            dto.setValidationMessage("Помилка вибору філії: " + e.getMessage());
            context.getExtendedState().getVariables().put("orderInitializationData", dto);
        }
    }

    /**
     * Регенерує номер квитанції.
     */
    public void regenerateReceiptNumber(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Регенерація номеру квитанції для wizard: {}", wizardId);

        try {
            OrderInitializationDTO dto = getOrCreateOrderInitializationDTO(context);

            // Зберігаємо попередній номер
            dto.setPreviousReceiptNumber(dto.getReceiptNumber());

            // Генеруємо новий номер
            generateReceiptNumber(dto);

            context.getExtendedState().getVariables().put("orderInitializationData", dto);

            log.info("Номер квитанції регенеровано для wizard: {} (новий: {})",
                wizardId, dto.getReceiptNumber());

        } catch (Exception e) {
            log.error("Помилка регенерації номеру квитанції для wizard {}: {}",
                wizardId, e.getMessage(), e);

            OrderInitializationDTO dto = getOrCreateOrderInitializationDTO(context);
            dto.setValidationMessage("Помилка регенерації номеру: " + e.getMessage());
            context.getExtendedState().getVariables().put("orderInitializationData", dto);
        }
    }

    /**
     * Валідує готовність етапу до завершення.
     */
    public boolean validateCanProceedToNext(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Валідація готовності етапу базової інформації замовлення для wizard: {}", wizardId);

        OrderInitializationDTO dto = getOrCreateOrderInitializationDTO(context);

        // Використовуємо централізований валідатор
        Map<String, Object> orderData = createValidationMap(dto);
        OrderBasicInfoValidator.ValidationResult validationResult = orderBasicInfoValidator.validate(orderData);

        boolean hasClient = dto.hasSelectedClient();
        boolean hasReceiptNumber = dto.hasReceiptNumber();
        boolean isValidationPassed = validationResult.isValid();

        boolean result = hasClient && hasReceiptNumber && isValidationPassed;

        log.debug("Валідація етапу базової інформації для wizard {}: client={}, receipt={}, validation={}, result={}",
            wizardId, hasClient, hasReceiptNumber, isValidationPassed, result);

        if (!result && !validationResult.isValid()) {
            dto.setValidationMessage(String.join(", ", validationResult.getErrors()));
        }

        return result;
    }

    /**
     * Фіналізує етап базової інформації замовлення.
     */
    public void finalizeOrderBasicInfo(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Фіналізація етапу базової інформації замовлення для wizard: {}", wizardId);

        OrderInitializationDTO dto = getOrCreateOrderInitializationDTO(context);

        if (!validateCanProceedToNext(wizardId, context)) {
            throw new IllegalStateException("Неможливо завершити етап - не всі обов'язкові поля заповнені");
        }

        // Зберігаємо фінальні дані в глобальних змінних wizard
        context.getExtendedState().getVariables().put("finalReceiptNumber", dto.getReceiptNumber());
        context.getExtendedState().getVariables().put("finalUniqueTag", dto.getUniqueTag());
        context.getExtendedState().getVariables().put("finalBranch", dto.getSelectedBranch());
        context.getExtendedState().getVariables().put("finalOrderCreationTime", dto.getOrderCreationTime());

        log.info("Етап базової інформації замовлення завершено для wizard: {} (квитанція: {}, мітка: {})",
            wizardId, dto.getReceiptNumber(), dto.getUniqueTag());
    }

    /**
     * Отримує або створює DTO для етапу базової інформації замовлення.
     */
    private OrderInitializationDTO getOrCreateOrderInitializationDTO(StateContext<OrderState, OrderEvent> context) {
        Object dtoObj = context.getExtendedState().getVariables().get("orderInitializationData");

        if (dtoObj instanceof OrderInitializationDTO dto) {
            return dto;
        }

        // Створюємо новий DTO якщо його немає
        return OrderInitializationDTO.builder()
            .canProceedToNext(false)
            .orderCreationTime(LocalDateTime.now())
            .build();
    }

    /**
     * Генерує номер квитанції.
     */
    private void generateReceiptNumber(OrderInitializationDTO dto) {
        String branchCode = branchValidator.getBranchCodeOrDefault(dto.getSelectedBranch(), "DEF");

        LocalDateTime now = dto.getOrderCreationTime() != null ? dto.getOrderCreationTime() : LocalDateTime.now();
        String receiptNumber = receiptNumberGenerator.generate(branchCode, now);

        dto.setReceiptNumber(receiptNumber);
        log.debug("Згенеровано номер квитанції: {}", receiptNumber);
    }

    /**
     * Валідує дані DTO і оновлює стан готовності.
     */
    private void validateAndUpdateDto(OrderInitializationDTO dto) {
        Map<String, Object> orderData = createValidationMap(dto);
        OrderBasicInfoValidator.ValidationResult validationResult = orderBasicInfoValidator.validate(orderData);

        if (validationResult.isValid()) {
            dto.setValidationMessage(null);
        } else {
            dto.setValidationMessage(String.join(", ", validationResult.getErrors()));
        }

        // Оновлюємо стан готовності
        updateCanProceedToNext(dto);
    }

    /**
     * Створює Map для валідації з даних DTO.
     */
    private Map<String, Object> createValidationMap(OrderInitializationDTO dto) {
        Map<String, Object> orderData = new HashMap<>();

        if (dto.getSelectedBranch() != null && dto.getSelectedBranch().getId() != null) {
            orderData.put("branchId", dto.getSelectedBranch().getId().toString());
        }

        if (dto.getUniqueTag() != null) {
            orderData.put("uniqueTag", dto.getUniqueTag());
        }

        return orderData;
    }

    /**
     * Оновлює стан готовності до переходу на наступний етап.
     */
    private void updateCanProceedToNext(OrderInitializationDTO dto) {
        // Використовуємо централізований валідатор для перевірки
        Map<String, Object> orderData = createValidationMap(dto);
        OrderBasicInfoValidator.ValidationResult validationResult = orderBasicInfoValidator.validate(orderData);

        boolean canProceed = dto.hasSelectedClient() &&
                           dto.hasReceiptNumber() &&
                           validationResult.isValid() &&
                           !dto.hasValidationIssues();

        dto.setCanProceedToNext(canProceed);
    }


}
