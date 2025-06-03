package com.aksi.domain.order.statemachine.stage1.actions;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;

import lombok.extern.slf4j.Slf4j;

/**
 * Action для ініціалізації нового Order Wizard
 *
 * Виконується при події START_ORDER_CREATION
 * Створює базову структуру даних для wizard
 */
@Component
@Slf4j
public class InitializeOrderAction implements Action<OrderState, OrderEvent> {

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        String wizardId = UUID.randomUUID().toString();

        log.info("Ініціалізація нового Order Wizard з ID: {}", wizardId);

        // Ініціалізуємо базові дані для wizard
        Map<Object, Object> wizardVariables = context.getExtendedState().getVariables();

        // Основні змінні wizard
        wizardVariables.put("wizardId", wizardId);
        wizardVariables.put("createdAt", LocalDateTime.now());
        wizardVariables.put("currentStage", 1);
        wizardVariables.put("currentStep", 1);

        // Ініціалізуємо порожні структури для даних
        wizardVariables.put("clientData", new HashMap<>());
        Map<Object, Object> orderData = new HashMap<>();
        wizardVariables.put("orderData", orderData);
        wizardVariables.put("itemsList", new HashMap<>());
        wizardVariables.put("orderParams", new HashMap<>());

        // Генеруємо номер квитанції
        String receiptNumber = generateReceiptNumber();
        orderData.put("receiptNumber", receiptNumber);
        orderData.put("createdAt", LocalDateTime.now());

        log.info("Order Wizard ініціалізовано з номером квитанції: {}", receiptNumber);
    }

    private String generateReceiptNumber() {
        // Генеруємо номер квитанції у форматі: AKSI-YYYYMMDD-NNNN
        LocalDateTime now = LocalDateTime.now();
        String dateStr = String.format("%04d%02d%02d",
            now.getYear(), now.getMonthValue(), now.getDayOfMonth());

        // Генеруємо випадкове 4-значне число
        int random = (int) (Math.random() * 9000) + 1000;

        return String.format("AKSI-%s-%04d", dateStr, random);
    }
}
