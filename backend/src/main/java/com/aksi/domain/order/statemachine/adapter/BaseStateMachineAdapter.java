package com.aksi.domain.order.statemachine.adapter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.service.StateMachineService;
import org.springframework.util.ObjectUtils;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;

/**
 * Базовий адаптер для роботи з StateMachineService.
 * Реалізує правильний підхід з документації Spring State Machine.
 */
public abstract class BaseStateMachineAdapter {

    private static final Logger logger = LoggerFactory.getLogger(BaseStateMachineAdapter.class);

    @Autowired
    protected StateMachineService<OrderState, OrderEvent> stateMachineService;

    private StateMachine<OrderState, OrderEvent> currentStateMachine;

    /**
     * Отримує State Machine для заданого sessionId.
     * Автоматично створює нову або повертає існуючу.
     * Базується на документації Spring State Machine Event Service.
     */
    protected synchronized StateMachine<OrderState, OrderEvent> getStateMachine(String sessionId) {
        logger.debug("🔍 [BASE-ADAPTER] Запит State Machine для sessionId: {}", sessionId);

        try {
            if (currentStateMachine == null) {
                logger.info("✨ [BASE-ADAPTER] Створюємо нову State Machine для sessionId: {}", sessionId);
                currentStateMachine = stateMachineService.acquireStateMachine(sessionId);
                currentStateMachine.startReactively().block();
                logger.info("✅ [BASE-ADAPTER] State Machine створена та запущена для sessionId: {}", sessionId);
            } else if (!ObjectUtils.nullSafeEquals(currentStateMachine.getId(), sessionId)) {
                logger.info("🔄 [BASE-ADAPTER] Переключення на іншу State Machine: {} -> {}",
                    currentStateMachine.getId(), sessionId);

                // Звільняємо попередню
                stateMachineService.releaseStateMachine(currentStateMachine.getId());
                currentStateMachine.stopReactively().block();

                // Отримуємо нову
                currentStateMachine = stateMachineService.acquireStateMachine(sessionId);
                currentStateMachine.startReactively().block();

                logger.info("✅ [BASE-ADAPTER] Переключення завершено для sessionId: {}", sessionId);
            } else {
                logger.debug("♻️ [BASE-ADAPTER] Використовуємо існуючу State Machine для sessionId: {}", sessionId);
            }

            return currentStateMachine;

        } catch (Exception e) {
            logger.error("❌ [BASE-ADAPTER] Помилка при отриманні State Machine для sessionId: {}", sessionId, e);
            throw new RuntimeException("Не вдалося отримати State Machine для sessionId: " + sessionId, e);
        }
    }

    /**
     * Отримує поточний стан State Machine.
     */
    protected OrderState getCurrentState(String sessionId) {
        StateMachine<OrderState, OrderEvent> stateMachine = getStateMachine(sessionId);
        OrderState currentState = stateMachine.getState().getId();

        logger.debug("📊 [BASE-ADAPTER] Поточний стан для sessionId {}: {}", sessionId, currentState);
        return currentState;
    }

    /**
     * Надсилає подію до State Machine.
     */
    protected boolean sendEvent(String sessionId, OrderEvent event) {
        logger.info("📤 [BASE-ADAPTER] Надсилання події {} для sessionId: {}", event, sessionId);

        try {
            StateMachine<OrderState, OrderEvent> stateMachine = getStateMachine(sessionId);
            boolean result = stateMachine.sendEvent(event);

            if (result) {
                logger.info("✅ [BASE-ADAPTER] Подія {} успішно оброблена для sessionId: {}", event, sessionId);
            } else {
                logger.warn("⚠️ [BASE-ADAPTER] Подія {} не була оброблена для sessionId: {}", event, sessionId);
            }

            return result;

        } catch (Exception e) {
            logger.error("❌ [BASE-ADAPTER] Помилка при надсиланні події {} для sessionId: {}", event, sessionId, e);
            return false;
        }
    }

    /**
     * Звільняє ресурси при завершенні роботи.
     */
    protected void releaseStateMachine(String sessionId) {
        if (currentStateMachine != null && ObjectUtils.nullSafeEquals(currentStateMachine.getId(), sessionId)) {
            logger.info("🗑️ [BASE-ADAPTER] Звільнення State Machine для sessionId: {}", sessionId);

            try {
                stateMachineService.releaseStateMachine(sessionId);
                currentStateMachine.stopReactively().block();
                currentStateMachine = null;

                logger.info("✅ [BASE-ADAPTER] State Machine звільнена для sessionId: {}", sessionId);
            } catch (Exception e) {
                logger.error("❌ [BASE-ADAPTER] Помилка при звільненні State Machine для sessionId: {}", sessionId, e);
            }
        }
    }
}
