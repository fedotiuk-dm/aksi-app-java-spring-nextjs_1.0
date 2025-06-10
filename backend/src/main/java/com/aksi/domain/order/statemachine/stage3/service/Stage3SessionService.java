package com.aksi.domain.order.statemachine.stage3.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage3.dto.AdditionalInfoDTO;
import com.aksi.domain.order.statemachine.stage3.dto.DiscountConfigurationDTO;
import com.aksi.domain.order.statemachine.stage3.dto.ExecutionParamsDTO;
import com.aksi.domain.order.statemachine.stage3.dto.PaymentConfigurationDTO;
import com.aksi.domain.order.statemachine.stage3.enums.Stage3State;
import com.aksi.domain.order.statemachine.stage3.service.Stage3StateService.Stage3Context;

/**
 * Сервіс управління життєвим циклом сесій Stage3.
 *
 * ЕТАП 4.3: Session Service (lifecycle management)
 * Дозволені імпорти: ТІЛЬКИ StateService + DTO + енуми + Spring аннотації
 * Заборонено: Operations Services, Validators, Actions, Guards, Config
 */
@Service
public class Stage3SessionService {

    private final Stage3StateService stateService;

    public Stage3SessionService(Stage3StateService stateService) {
        this.stateService = stateService;
    }

    /**
     * Створює нову сесію Stage3
     */
    public UUID createSession(UUID orderId) {
        UUID sessionId = UUID.randomUUID();
        stateService.createContext(sessionId);
        return sessionId;
    }

    /**
     * Ініціалізує Stage3 для існуючої сесії
     */
    public void initializeStage3(UUID sessionId) {
        Stage3Context context = stateService.getContext(sessionId);
        if (context != null) {
            context.setCurrentState(Stage3State.EXECUTION_PARAMS_INIT);
        }
    }

    /**
     * Закриває сесію
     */
    public void closeSession(UUID sessionId) {
        stateService.removeContext(sessionId);
    }

    /**
     * Перевіряє чи існує сесія
     */
    public boolean sessionExists(UUID sessionId) {
        return stateService.hasContext(sessionId);
    }

    /**
     * Отримує контекст сесії
     */
    public Stage3Context getSessionContext(UUID sessionId) {
        return stateService.getContext(sessionId);
    }

    /**
     * Оновлює параметри виконання в сесії
     */
    public void updateExecutionParams(UUID sessionId, ExecutionParamsDTO executionParams) {
        Stage3Context context = stateService.getContext(sessionId);
        if (context != null) {
            context.setExecutionParams(executionParams);
        }
    }

    /**
     * Оновлює конфігурацію знижки в сесії
     */
    public void updateDiscountConfig(UUID sessionId, DiscountConfigurationDTO discountConfig) {
        stateService.updateDiscountConfiguration(sessionId, discountConfig);
    }

    /**
     * Оновлює конфігурацію оплати в сесії
     */
    public void updatePaymentConfig(UUID sessionId, PaymentConfigurationDTO paymentConfig) {
        stateService.updatePaymentConfiguration(sessionId, paymentConfig);
    }

    /**
     * Оновлює додаткову інформацію в сесії
     */
    public void updateAdditionalInfo(UUID sessionId, AdditionalInfoDTO additionalInfo) {
        Stage3Context context = stateService.getContext(sessionId);
        if (context != null) {
            context.setAdditionalInfo(additionalInfo);
        }
    }

    /**
     * Отримує стан сесії
     */
    public Stage3State getSessionState(UUID sessionId) {
        Stage3Context context = stateService.getContext(sessionId);
        return context != null ? context.getCurrentState() : null;
    }

    /**
     * Встановлює стан сесії
     */
    public void setSessionState(UUID sessionId, Stage3State state) {
        Stage3Context context = stateService.getContext(sessionId);
        if (context != null) {
            context.setCurrentState(state);
        }
    }

    /**
     * Перевіряє готовність до завершення
     */
    public boolean isReadyToComplete(UUID sessionId) {
        return stateService.isReadyForCompletion(sessionId);
    }

    /**
     * Скидає всі дані сесії
     */
    public void resetSession(UUID sessionId) {
        stateService.clearContextData(sessionId);
    }

    /**
     * Перевіряє валідність сесії
     */
    public boolean isSessionValid(UUID sessionId) {
        Stage3Context context = stateService.getContext(sessionId);
        return context != null && context.isValid();
    }

    /**
     * Отримує прогрес виконання сесії
     */
    public int getSessionProgress(UUID sessionId) {
        Stage3Context context = stateService.getContext(sessionId);
        if (context == null) {
            return 0;
        }

        int completedSubsteps = 0;
        if (context.getExecutionParams() != null) completedSubsteps++;
        if (context.getDiscountConfiguration() != null) completedSubsteps++;
        if (context.getPaymentConfiguration() != null) completedSubsteps++;
        if (context.getAdditionalInfo() != null) completedSubsteps++;

        return (completedSubsteps * 100) / 4;
    }
}
