package com.aksi.domain.order.statemachine.stage1.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Service;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.branch.service.BranchLocationService;
import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSelectionDTO;
import com.aksi.domain.order.statemachine.stage1.dto.OrderInitializationDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Консолідований сервіс управління станом для всього першого етапу Order Wizard.
 *
 * Етап: 1 (загальний) - управління станом
 * Підетапи: 1.1 (вибір клієнта), 1.2 (базова інформація замовлення)
 *
 * Відповідальності:
 * - Управління DTO підетапу 1.1 (ClientSelectionDTO)
 * - Управління DTO підетапу 1.2 (OrderInitializationDTO)
 * - Ініціалізація початкових даних
 * - Оновлення стану в контексті State Machine
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class Stage1StateService {

    private static final String CLIENT_SELECTION_DATA_KEY = "clientSelectionData";
    private static final String ORDER_INITIALIZATION_DATA_KEY = "orderInitializationData";

    private final BranchLocationService branchLocationService;

    // ========== Підетап 1.1: Управління станом вибору клієнта ==========

    /**
     * Ініціалізує стан підетапу 1.1 "Вибір клієнта".
     */
    public void initializeClientSelection(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Ініціалізація стану підетапу 1.1 для wizard: {}", wizardId);

        ClientSelectionDTO dto = ClientSelectionDTO.builder()
            .mode(ClientSelectionDTO.ClientSelectionMode.SEARCH_EXISTING)
            .canProceedToNext(false)
            .build();

        updateClientSelectionDTO(context, dto);

        log.debug("Стан підетапу 1.1 ініціалізовано для wizard: {}", wizardId);
    }

    /**
     * Отримує або створює DTO підетапу 1.1.
     */
    public ClientSelectionDTO getOrCreateClientSelectionDTO(StateContext<OrderState, OrderEvent> context) {
        Object dtoObj = context.getExtendedState().getVariables().get(CLIENT_SELECTION_DATA_KEY);

        if (dtoObj instanceof ClientSelectionDTO) {
            return (ClientSelectionDTO) dtoObj;
        }

        // Створюємо новий DTO якщо його немає
        ClientSelectionDTO dto = ClientSelectionDTO.builder()
            .mode(ClientSelectionDTO.ClientSelectionMode.SEARCH_EXISTING)
            .canProceedToNext(false)
            .build();

        updateClientSelectionDTO(context, dto);
        return dto;
    }

    /**
     * Оновлює DTO підетапу 1.1 в контексті.
     */
    public void updateClientSelectionDTO(StateContext<OrderState, OrderEvent> context, ClientSelectionDTO dto) {
        context.getExtendedState().getVariables().put(CLIENT_SELECTION_DATA_KEY, dto);
    }

    // ========== Підетап 1.2: Управління станом базової інформації замовлення ==========

    /**
     * Ініціалізує стан підетапу 1.2 "Базова інформація замовлення".
     */
    public void initializeOrderBasicInfo(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Ініціалізація стану підетапу 1.2 для wizard: {}", wizardId);

        // Отримуємо клієнта з попереднього підетапу
        ClientResponse selectedClient = (ClientResponse) context.getExtendedState()
            .getVariables().get("finalSelectedClient");

        // Завантажуємо доступні філії
        List<BranchLocationDTO> availableBranches = loadAvailableBranches(wizardId);

        OrderInitializationDTO dto = OrderInitializationDTO.builder()
            .selectedClient(selectedClient)
            .availableBranches(availableBranches)
            .orderCreationTime(LocalDateTime.now())
            .canProceedToNext(false)
            .build();

        updateOrderInitializationDTO(context, dto);

        log.debug("Стан підетапу 1.2 ініціалізовано для wizard: {}", wizardId);
    }

    /**
     * Отримує або створює DTO підетапу 1.2.
     */
    public OrderInitializationDTO getOrCreateOrderInitializationDTO(StateContext<OrderState, OrderEvent> context) {
        Object dtoObj = context.getExtendedState().getVariables().get(ORDER_INITIALIZATION_DATA_KEY);

        if (dtoObj instanceof OrderInitializationDTO) {
            return (OrderInitializationDTO) dtoObj;
        }

        // Створюємо новий DTO якщо його немає
        OrderInitializationDTO dto = OrderInitializationDTO.builder()
            .orderCreationTime(LocalDateTime.now())
            .canProceedToNext(false)
            .build();

        updateOrderInitializationDTO(context, dto);
        return dto;
    }

    /**
     * Оновлює DTO підетапу 1.2 в контексті.
     */
    public void updateOrderInitializationDTO(StateContext<OrderState, OrderEvent> context, OrderInitializationDTO dto) {
        context.getExtendedState().getVariables().put(ORDER_INITIALIZATION_DATA_KEY, dto);
    }

    // ========== Загальні методи управління станом ==========

    /**
     * Очищає стан всього етапу 1.
     */
    public void clearStage1State(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Очищення стану етапу 1 для wizard: {}", wizardId);

        // Очищаємо DTO
        context.getExtendedState().getVariables().remove(CLIENT_SELECTION_DATA_KEY);
        context.getExtendedState().getVariables().remove(ORDER_INITIALIZATION_DATA_KEY);

        // Очищаємо допоміжні змінні
        context.getExtendedState().getVariables().remove("selectedClientId");
        context.getExtendedState().getVariables().remove("selectedClient");
        context.getExtendedState().getVariables().remove("finalSelectedClient");
        context.getExtendedState().getVariables().remove("selectedBranchId");
        context.getExtendedState().getVariables().remove("selectedBranch");
        context.getExtendedState().getVariables().remove("finalReceiptNumber");
        context.getExtendedState().getVariables().remove("finalUniqueTag");
        context.getExtendedState().getVariables().remove("finalBranch");
        context.getExtendedState().getVariables().remove("finalOrderCreationTime");

        log.debug("Стан етапу 1 очищено для wizard: {}", wizardId);
    }

    /**
     * Перевіряє чи завершено підетап 1.1.
     */
    public boolean isClientSelectionCompleted(StateContext<OrderState, OrderEvent> context) {
        Object finalClient = context.getExtendedState().getVariables().get("finalSelectedClient");
        return finalClient != null;
    }

    /**
     * Перевіряє чи ініціалізовано підетап 1.2.
     */
    public boolean isOrderInfoInitialized(StateContext<OrderState, OrderEvent> context) {
        Object orderInitData = context.getExtendedState().getVariables().get(ORDER_INITIALIZATION_DATA_KEY);
        return orderInitData instanceof OrderInitializationDTO;
    }

    // ========== Допоміжні методи ==========

    private List<BranchLocationDTO> loadAvailableBranches(String wizardId) {
        try {
            List<BranchLocationDTO> branches = branchLocationService.getActiveBranchLocations();
            log.debug("Завантажено {} активних філій для wizard: {}", branches.size(), wizardId);
            return branches;
        } catch (Exception e) {
            log.error("Помилка завантаження філій для wizard {}: {}", wizardId, e.getMessage());
            return List.of();
        }
    }
}
