package com.aksi.domain.order.statemachine.stage1.actions;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.branch.service.BranchLocationService;
import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Action для збереження базової інформації замовлення
 * Використовує реальний BranchLocationService для валідації філії
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SaveOrderBasicInfoAction implements Action<OrderState, OrderEvent> {

    private final BranchLocationService branchLocationService;

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");
        log.info("Збереження базової інформації замовлення для wizard: {}", wizardId);

        try {
            // Отримуємо дані з headers повідомлення
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

            // Валідуємо та зберігаємо branchId
            processBranchId(orderData, context, wizardId);

            // Зберігаємо унікальну мітку (якщо вказана)
            processUniqueTag(orderData, context, wizardId);

            // Генеруємо номер квитанції автоматично (після збереження даних філії)
            String receiptNumber = generateReceiptNumber(context);
            context.getExtendedState().getVariables().put("receiptNumber", receiptNumber);
            log.info("Згенеровано номер квитанції {} для wizard: {}", receiptNumber, wizardId);

            // Зберігаємо час створення замовлення
            LocalDateTime orderCreationTime = LocalDateTime.now();
            context.getExtendedState().getVariables().put("orderCreationTime", orderCreationTime);

            // Зберігаємо всі базові дані замовлення
            context.getExtendedState().getVariables().put("orderBasicInfo", orderData);

            log.info("Базова інформація замовлення збережена для wizard: {}", wizardId);

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

        /**
     * Обробляє та валідує branchId
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
     * Валідує та зберігає дані філії
     */
    private void validateAndSaveBranch(UUID branchId, StateContext<OrderState, OrderEvent> context, String wizardId) {
        BranchLocationDTO branch = branchLocationService.getBranchLocationById(branchId);

        if (Boolean.FALSE.equals(branch.getActive())) {
            throw new IllegalArgumentException("Філія з ID " + branchId + " не активна");
        }

        // Зберігаємо дані філії в контексті
        context.getExtendedState().getVariables().put("branchId", branchId);
        context.getExtendedState().getVariables().put("branchData", branch);
        log.info("Валідовано філію {} ({}) для wizard: {}", branchId, branch.getName(), wizardId);
    }

    /**
     * Обробляє унікальну мітку
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
     * Генерує номер квитанції автоматично
     * Формат: AKSI-[BRANCH_CODE]-YYYYMMDDHH-NNNN
     */
    private String generateReceiptNumber(StateContext<OrderState, OrderEvent> context) {
        // Отримуємо дані філії з контексту
        BranchLocationDTO branchData = (BranchLocationDTO) context.getExtendedState()
            .getVariables().get("branchData");

        // Отримуємо код філії (або 'XX' якщо код відсутній)
        String branchCode = (branchData != null && branchData.getCode() != null)
            ? branchData.getCode() : "XX";

        LocalDateTime now = LocalDateTime.now();
        String dateStr = String.format("%04d%02d%02d%02d",
            now.getYear(), now.getMonthValue(), now.getDayOfMonth(), now.getHour());

        // Генеруємо випадкове 4-значне число
        int random = (int) (Math.random() * 9000) + 1000;

        return String.format("AKSI-%s-%s-%04d", branchCode, dateStr, random);
    }
}
