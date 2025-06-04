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
import com.aksi.domain.order.statemachine.stage1.dto.ClientSelectionDTO;
import com.aksi.domain.order.statemachine.stage1.dto.OrderInitializationDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Головний сервіс-фасад для управління Stage 1 Order Wizard.
 *
 * Координує роботу між двома етапами:
 * - 1.1: Вибір/створення клієнта (ClientSelectionService)
 * - 1.2: Базова інформація замовлення (OrderInitializationService)
 *
 * Забезпечує єдиний інтерфейс для взаємодії з Actions та Guards.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class Stage1WizardService {

    private final ClientSelectionService clientSelectionService;
    private final OrderInitializationService orderInitializationService;
    private final BranchLocationService branchLocationService;
    private final ReceiptNumberGenerator receiptNumberGenerator;
    private final BranchValidator branchValidator;

    // ========== ЕТАП 1.1: ВИБІР КЛІЄНТА ==========

    /**
     * Ініціалізує весь Stage 1 з етапу вибору клієнта.
     */
    public void initializeStage1(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.info("Ініціалізація Stage 1 для wizard: {}", wizardId);

        clientSelectionService.initializeClientSelection(wizardId, context);

        // Ініціалізуємо додаткові структури для wizard
        Map<Object, Object> wizardVariables = context.getExtendedState().getVariables();
        wizardVariables.put("clientData", new HashMap<>());
        wizardVariables.put("orderData", new HashMap<>());
        wizardVariables.put("itemsList", new HashMap<>());
        wizardVariables.put("orderParams", new HashMap<>());

        // Завантажуємо активні філії
        try {
            List<BranchLocationDTO> activeBranches = branchLocationService.getActiveBranchLocations();
            wizardVariables.put("branches", activeBranches);
            log.info("Завантажено {} активних філій до wizard data", activeBranches.size());
        } catch (Exception e) {
            log.error("Помилка завантаження активних філій для wizard {}: {}", wizardId, e.getMessage());
            wizardVariables.put("branches", List.of());
        }

        log.info("Stage 1 ініціалізовано для wizard: {}", wizardId);
    }

    /**
     * Обробляє базову інформацію замовлення (для SaveOrderBasicInfoAction).
     */
    public void processOrderBasicInfo(String wizardId, Map<String, Object> orderData,
                                     StateContext<OrderState, OrderEvent> context) {
        log.info("Обробка базової інформації замовлення для wizard: {}", wizardId);

        // Валідуємо та зберігаємо branchId
        processBranchId(orderData, context, wizardId);

        // Зберігаємо унікальну мітку (якщо вказана)
        processUniqueTag(orderData, context, wizardId);

        // Генеруємо номер квитанції автоматично (після збереження даних філії)
        BranchLocationDTO branchData = (BranchLocationDTO) context.getExtendedState()
            .getVariables().get("branchData");
        String branchCode = branchValidator.getBranchCodeOrDefault(branchData, "DEF");
        String receiptNumber = receiptNumberGenerator.generate(branchCode);
        context.getExtendedState().getVariables().put("receiptNumber", receiptNumber);
        log.info("Згенеровано номер квитанції {} для wizard: {}", receiptNumber, wizardId);

        // Зберігаємо час створення замовлення
        LocalDateTime orderCreationTime = LocalDateTime.now();
        context.getExtendedState().getVariables().put("orderCreationTime", orderCreationTime);

        // Зберігаємо всі базові дані замовлення
        context.getExtendedState().getVariables().put("orderBasicInfo", orderData);
    }

    /**
     * Обробляє та валідує branchId.
     */
    private void processBranchId(Map<String, Object> orderData, StateContext<OrderState, OrderEvent> context, String wizardId) {
        Object branchIdObj = orderData.get("branchId");

        switch (branchIdObj) {
            case null -> { /* branchId не обов'язковий */ }
            case String branchIdStr -> {
                UUID branchId = UUID.fromString(branchIdStr);
                validateAndSaveBranch(branchId, context, wizardId);
            }
            case UUID branchIdUuid -> {
                validateAndSaveBranch(branchIdUuid, context, wizardId);
            }
            default -> throw new IllegalArgumentException("Некоректний формат branchId: " + branchIdObj.getClass());
        }
    }

    /**
     * Валідує та зберігає дані філії.
     */
    private void validateAndSaveBranch(UUID branchId, StateContext<OrderState, OrderEvent> context, String wizardId) {
        // Використовуємо централізований валідатор
        BranchLocationDTO branch = branchValidator.validateAndGet(branchId);

        // Зберігаємо дані філії в контексті
        context.getExtendedState().getVariables().put("branchId", branchId);
        context.getExtendedState().getVariables().put("branchData", branch);
        log.info("Валідовано філію {} ({}) для wizard: {}", branchId, branch.getName(), wizardId);
    }

    /**
     * Обробляє унікальну мітку.
     */
    private void processUniqueTag(Map<String, Object> orderData, StateContext<OrderState, OrderEvent> context, String wizardId) {
        Object uniqueTagObj = orderData.get("uniqueTag");

        if (uniqueTagObj instanceof String uniqueTag && !uniqueTag.trim().isEmpty()) {
            context.getExtendedState().getVariables().put("uniqueTag", uniqueTag.trim());
            log.info("Збережено унікальну мітку для wizard: {}", wizardId);
        } else if (uniqueTagObj != null && !(uniqueTagObj instanceof String)) {
            log.warn("Некоректний тип uniqueTag: {}", uniqueTagObj.getClass());
        }
    }



    /**
     * Виконує пошук клієнтів.
     */
    public void searchClients(String wizardId, String searchQuery, StateContext<OrderState, OrderEvent> context) {
        log.debug("Пошук клієнтів в Stage 1 для wizard: {}", wizardId);

        clientSelectionService.searchClients(wizardId, searchQuery, context);
    }

    /**
     * Вибирає клієнта зі списку.
     */
    public void selectClient(String wizardId, String clientId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Вибір клієнта в Stage 1 для wizard: {}", wizardId);

        clientSelectionService.selectClient(wizardId, clientId, context);
    }

    /**
     * Переключає на створення нового клієнта.
     */
    public void switchToCreateNewClient(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Переключення на створення нового клієнта в Stage 1 для wizard: {}", wizardId);

        clientSelectionService.switchToCreateNewClient(wizardId, context);
    }

    /**
     * Зберігає дані нового клієнта.
     */
    public void saveNewClientData(String wizardId, ClientResponse newClientData,
                                  StateContext<OrderState, OrderEvent> context) {
        log.debug("Збереження даних нового клієнта в Stage 1 для wizard: {}", wizardId);

        clientSelectionService.saveNewClientData(wizardId, newClientData, context);
    }

    /**
     * Завершує етап вибору клієнта та переходить до базової інформації замовлення.
     */
    public void finishClientSelectionAndStartOrderInfo(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.info("Завершення етапу вибору клієнта та початок базової інформації замовлення для wizard: {}", wizardId);

        // Фіналізуємо вибір клієнта
        clientSelectionService.finalizeClientSelection(wizardId, context);

        // Ініціалізуємо етап базової інформації замовлення
        orderInitializationService.initializeOrderBasicInfo(wizardId, context);

        log.info("Перехід від вибору клієнта до базової інформації замовлення завершено для wizard: {}", wizardId);
    }

    // ========== ЕТАП 1.2: БАЗОВА ІНФОРМАЦІЯ ЗАМОВЛЕННЯ ==========

    /**
     * Встановлює унікальну мітку для замовлення.
     */
    public void setUniqueTag(String wizardId, String uniqueTag, StateContext<OrderState, OrderEvent> context) {
        log.debug("Встановлення унікальної мітки в Stage 1 для wizard: {}", wizardId);

        orderInitializationService.setUniqueTag(wizardId, uniqueTag, context);
    }

    /**
     * Вибирає пункт прийому замовлення.
     */
    public void selectBranch(String wizardId, String branchId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Вибір філії в Stage 1 для wizard: {}", wizardId);

        orderInitializationService.selectBranch(wizardId, branchId, context);
    }

    /**
     * Регенерує номер квитанції.
     */
    public void regenerateReceiptNumber(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Регенерація номеру квитанції в Stage 1 для wizard: {}", wizardId);

        orderInitializationService.regenerateReceiptNumber(wizardId, context);
    }

    /**
     * Завершує весь Stage 1.
     */
    public void finalizeStage1(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.info("Фіналізація Stage 1 для wizard: {}", wizardId);

        // Фіналізуємо базову інформацію замовлення
        orderInitializationService.finalizeOrderBasicInfo(wizardId, context);

        // Очищуємо тимчасові дані етапів
        context.getExtendedState().getVariables().remove("clientSelectionData");
        context.getExtendedState().getVariables().remove("orderInitializationData");

        log.info("Stage 1 завершено для wizard: {}", wizardId);
    }

    // ========== ВАЛІДАЦІЇ ТА ПЕРЕВІРКИ СТАНУ ==========

    /**
     * Перевіряє, чи можна завершити етап вибору клієнта.
     */
    public boolean canFinishClientSelection(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Перевірка можливості завершення етапу вибору клієнта для wizard: {}", wizardId);

        return clientSelectionService.validateCanProceedToNext(wizardId, context);
    }

    /**
     * Перевіряє, чи можна завершити весь Stage 1.
     */
    public boolean canFinishStage1(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Перевірка можливості завершення Stage 1 для wizard: {}", wizardId);

        return orderInitializationService.validateCanProceedToNext(wizardId, context);
    }

    /**
     * Перевіряє, чи завершено етап вибору клієнта.
     */
    public boolean isClientSelectionCompleted(String wizardId, StateContext<OrderState, OrderEvent> context) {
        Object finalClient = context.getExtendedState().getVariables().get("finalSelectedClient");
        return finalClient != null;
    }

    /**
     * Перевіряє, чи ініціалізовано етап базової інформації замовлення.
     */
    public boolean isOrderInfoInitialized(String wizardId, StateContext<OrderState, OrderEvent> context) {
        Object orderInitData = context.getExtendedState().getVariables().get("orderInitializationData");
        return orderInitData instanceof OrderInitializationDTO;
    }

    // ========== ОТРИМАННЯ ДАНИХ ДЛЯ UI ==========

    /**
     * Отримує дані етапу вибору клієнта для відображення в UI.
     */
    public ClientSelectionDTO getClientSelectionData(StateContext<OrderState, OrderEvent> context) {
        Object data = context.getExtendedState().getVariables().get("clientSelectionData");

        if (data instanceof ClientSelectionDTO dto) {
            return dto;
        }

        // Повертаємо порожній DTO якщо дані відсутні
        return ClientSelectionDTO.builder()
            .mode(ClientSelectionDTO.ClientSelectionMode.SEARCH_EXISTING)
            .canProceedToNext(false)
            .build();
    }

    /**
     * Отримує дані етапу базової інформації замовлення для відображення в UI.
     */
    public OrderInitializationDTO getOrderInitializationData(StateContext<OrderState, OrderEvent> context) {
        Object data = context.getExtendedState().getVariables().get("orderInitializationData");

        if (data instanceof OrderInitializationDTO dto) {
            return dto;
        }

        // Повертаємо порожній DTO якщо дані відсутні
        return OrderInitializationDTO.builder()
            .canProceedToNext(false)
            .build();
    }

    /**
     * Отримує поточний етап Stage 1 для відображення в UI.
     */
    public Stage1CurrentStep getCurrentStep(StateContext<OrderState, OrderEvent> context) {
        if (!isClientSelectionCompleted("", context)) {
            return Stage1CurrentStep.CLIENT_SELECTION;
        } else if (isOrderInfoInitialized("", context)) {
            return Stage1CurrentStep.ORDER_INITIALIZATION;
        } else {
            return Stage1CurrentStep.CLIENT_SELECTION;
        }
    }

    /**
     * Перелічення етапів Stage 1.
     */
    public enum Stage1CurrentStep {
        CLIENT_SELECTION("Вибір клієнта"),
        ORDER_INITIALIZATION("Базова інформація замовлення");

        private final String description;

        Stage1CurrentStep(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }
}
