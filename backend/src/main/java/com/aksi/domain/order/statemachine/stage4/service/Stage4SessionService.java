package com.aksi.domain.order.statemachine.stage4.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage4.dto.LegalAcceptanceDTO;
import com.aksi.domain.order.statemachine.stage4.dto.OrderCompletionDTO;
import com.aksi.domain.order.statemachine.stage4.dto.OrderConfirmationDTO;
import com.aksi.domain.order.statemachine.stage4.dto.ReceiptConfigurationDTO;
import com.aksi.domain.order.statemachine.stage4.enums.Stage4State;
import com.aksi.domain.order.statemachine.stage4.service.Stage4StateService.Stage4Context;

/**
 * Сервіс для управління життєвим циклом сесії Stage4.
 * Обробляє створення, оновлення та отримання контексту сесії.
 */
@Service
public class Stage4SessionService {

    private final Stage4StateService stateService;

    public Stage4SessionService(Stage4StateService stateService) {
        this.stateService = stateService;
    }

    /**
     * Створює нову сесію Stage4.
     *
     * @param orderId ID замовлення
     * @return ID створеної сесії
     */
    public UUID createSession(UUID orderId) {
        UUID sessionId = UUID.randomUUID();
        Stage4Context context = new Stage4Context();
        context.setOrderId(orderId);
        context.setCurrentState(Stage4State.STAGE4_INITIALIZED);

        stateService.saveContext(sessionId, context);
        return sessionId;
    }

    /**
     * Оновлює контекст сесії з новими даними підтвердження замовлення.
     *
     * @param sessionId ID сесії
     * @param orderConfirmation дані підтвердження замовлення
     */
    public void updateOrderConfirmation(UUID sessionId, OrderConfirmationDTO orderConfirmation) {
        Optional<Stage4Context> contextOpt = stateService.getContext(sessionId);
        if (contextOpt.isPresent()) {
            Stage4Context context = contextOpt.get();
            context.setOrderConfirmation(orderConfirmation);
            context.setCurrentState(orderConfirmation.getCurrentState());
            stateService.saveContext(sessionId, context);
        }
    }

    /**
     * Оновлює контекст сесії з новими даними юридичного прийняття.
     *
     * @param sessionId ID сесії
     * @param legalAcceptance дані юридичного прийняття
     */
    public void updateLegalAcceptance(UUID sessionId, LegalAcceptanceDTO legalAcceptance) {
        Optional<Stage4Context> contextOpt = stateService.getContext(sessionId);
        if (contextOpt.isPresent()) {
            Stage4Context context = contextOpt.get();
            context.setLegalAcceptance(legalAcceptance);
            context.setCurrentState(legalAcceptance.getCurrentState());
            stateService.saveContext(sessionId, context);
        }
    }

    /**
     * Оновлює контекст сесії з новими даними конфігурації квитанції.
     *
     * @param sessionId ID сесії
     * @param receiptConfiguration дані конфігурації квитанції
     */
    public void updateReceiptConfiguration(UUID sessionId, ReceiptConfigurationDTO receiptConfiguration) {
        Optional<Stage4Context> contextOpt = stateService.getContext(sessionId);
        if (contextOpt.isPresent()) {
            Stage4Context context = contextOpt.get();
            context.setReceiptConfiguration(receiptConfiguration);
            context.setCurrentState(receiptConfiguration.getCurrentState());
            stateService.saveContext(sessionId, context);
        }
    }

    /**
     * Оновлює контекст сесії з новими даними завершення замовлення.
     *
     * @param sessionId ID сесії
     * @param orderCompletion дані завершення замовлення
     */
    public void updateOrderCompletion(UUID sessionId, OrderCompletionDTO orderCompletion) {
        Optional<Stage4Context> contextOpt = stateService.getContext(sessionId);
        if (contextOpt.isPresent()) {
            Stage4Context context = contextOpt.get();
            context.setOrderCompletion(orderCompletion);
            context.setCurrentState(orderCompletion.getCurrentState());
            stateService.saveContext(sessionId, context);
        }
    }

    /**
     * Отримує поточний контекст сесії.
     *
     * @param sessionId ID сесії
     * @return контекст сесії або Optional.empty()
     */
    public Optional<Stage4Context> getSessionContext(UUID sessionId) {
        return stateService.getContext(sessionId);
    }

    /**
     * Перевіряє чи існує сесія.
     *
     * @param sessionId ID сесії
     * @return true якщо сесія існує
     */
    public boolean sessionExists(UUID sessionId) {
        return stateService.getContext(sessionId).isPresent();
    }

    /**
     * Закриває сесію та очищає контекст.
     *
     * @param sessionId ID сесії
     */
    public void closeSession(UUID sessionId) {
        stateService.clearContext(sessionId);
    }

    /**
     * Отримує поточний стан сесії.
     *
     * @param sessionId ID сесії
     * @return поточний стан або null
     */
    public Stage4State getCurrentState(UUID sessionId) {
        return stateService.getContext(sessionId)
                .map(Stage4Context::getCurrentState)
                .orElse(null);
    }

    /**
     * Отримує ID замовлення для сесії.
     *
     * @param sessionId ID сесії
     * @return ID замовлення або null
     */
    public UUID getOrderId(UUID sessionId) {
        return stateService.getContext(sessionId)
                .map(Stage4Context::getOrderId)
                .orElse(null);
    }
}
