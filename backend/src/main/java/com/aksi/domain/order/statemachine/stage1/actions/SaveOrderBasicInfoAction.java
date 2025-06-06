package com.aksi.domain.order.statemachine.stage1.actions;

import java.util.Map;
import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.service.Stage1CoordinationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Action для збереження базової інформації замовлення.
 * Використовує Stage1CoordinationService для обробки даних.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SaveOrderBasicInfoAction implements Action<OrderState, OrderEvent> {

    private final Stage1CoordinationService coordinationService;

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");
        log.info("Збереження базової інформації замовлення для wizard: {}", wizardId);

        try {
            // Визначаємо тип дії з headers повідомлення
            String actionType = (String) context.getMessageHeaders().get("actionType");

            if (actionType == null) {
                throw new IllegalArgumentException("Тип дії не вказано");
            }

            switch (actionType) {
                case "selectBranch" -> handleSelectBranch(context);
                case "setUniqueTag" -> handleSetUniqueTag(context);
                case "regenerateReceiptNumber" -> handleRegenerateReceiptNumber(context);
                case "processOrderBasicInfo" -> handleProcessOrderBasicInfo(context);
                default -> throw new IllegalArgumentException("Невідомий тип дії: " + actionType);
            }

            log.info("Базова інформація замовлення оброблена для wizard: {} (тип дії: {})", wizardId, actionType);

        } catch (IllegalArgumentException e) {
            log.error("Некоректні дані для wizard {}: {}", wizardId, e.getMessage());
            context.getExtendedState().getVariables().put("lastError",
                "Некоректні дані: " + e.getMessage());
            throw e;
        } catch (RuntimeException e) {
            log.error("Помилка збереження базової інформації замовлення для wizard {}: {}",
                wizardId, e.getMessage(), e);
            context.getExtendedState().getVariables().put("lastError",
                "Помилка збереження базової інформації: " + e.getMessage());
            throw e;
        }
    }

    private void handleSelectBranch(StateContext<OrderState, OrderEvent> context) {
        Object branchIdObj = context.getMessageHeaders().get("branchId");

        if (!(branchIdObj instanceof String branchIdStr)) {
            throw new IllegalArgumentException("ID філії не вказано або має неправильний тип");
        }

        try {
            UUID branchId = UUID.fromString(branchIdStr);
            coordinationService.getOperationsService().selectBranch(branchId, context);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Некоректний формат ID філії: " + branchIdStr);
        }
    }

    private void handleSetUniqueTag(StateContext<OrderState, OrderEvent> context) {
        Object uniqueTagObj = context.getMessageHeaders().get("uniqueTag");

        if (!(uniqueTagObj instanceof String uniqueTag)) {
            throw new IllegalArgumentException("Унікальна мітка не вказана або має неправильний тип");
        }

        coordinationService.getOperationsService().setUniqueTag(uniqueTag, context);
    }

    private void handleRegenerateReceiptNumber(StateContext<OrderState, OrderEvent> context) {
        String newReceiptNumber = coordinationService.getOperationsService().regenerateReceiptNumber(context);
        log.info("Згенеровано новий номер квитанції: {}", newReceiptNumber);
    }

    private void handleProcessOrderBasicInfo(StateContext<OrderState, OrderEvent> context) {
        Object orderBasicInfoObj = context.getMessageHeaders().get("orderBasicInfo");

        @SuppressWarnings("unchecked")
        Map<String, Object> orderData = switch (orderBasicInfoObj) {
            case Map<?, ?> orderBasicInfo -> (Map<String, Object>) orderBasicInfo;
            case null -> throw new IllegalArgumentException("Відсутні дані базової інформації замовлення");
            default -> {
                log.error("Некоректний тип базової інформації замовлення: {}", orderBasicInfoObj.getClass());
                throw new IllegalArgumentException("Некоректні дані базової інформації замовлення");
            }
        };

        // Обробляємо комплексні дані замовлення
        processComplexOrderData(orderData, context);
    }

    private void processComplexOrderData(Map<String, Object> orderData, StateContext<OrderState, OrderEvent> context) {
        // Обробляємо філію якщо вказана
        if (orderData.containsKey("branchId")) {
            Object branchIdObj = orderData.get("branchId");
            if (branchIdObj instanceof String branchIdStr) {
                try {
                    UUID branchId = UUID.fromString(branchIdStr);
                    coordinationService.getOperationsService().selectBranch(branchId, context);
                } catch (IllegalArgumentException e) {
                    log.warn("Некоректний формат ID філії в комплексних даних: {}", branchIdStr);
                }
            }
        }

        // Обробляємо унікальну мітку якщо вказана
        if (orderData.containsKey("uniqueTag")) {
            Object uniqueTagObj = orderData.get("uniqueTag");
            if (uniqueTagObj instanceof String uniqueTag) {
                coordinationService.getOperationsService().setUniqueTag(uniqueTag, context);
            }
        }

        // Перегенеровуємо номер квитанції якщо потрібно
        if (orderData.containsKey("regenerateReceiptNumber") &&
            Boolean.TRUE.equals(orderData.get("regenerateReceiptNumber"))) {
            coordinationService.getOperationsService().regenerateReceiptNumber(context);
        }
    }
}
