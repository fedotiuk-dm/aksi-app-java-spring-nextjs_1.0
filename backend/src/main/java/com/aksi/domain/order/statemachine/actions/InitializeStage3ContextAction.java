package com.aksi.domain.order.statemachine.actions;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage3.service.Stage3CoordinationService;

/**
 * Action для ініціалізації Stage3 контекстів з sessionId від головного Order Wizard.
 * Виконується при переході в стан EXECUTION_PARAMS.
 *
 * Забезпечує що sessionId від головного Order Wizard буде використаний
 * для ініціалізації всіх Stage3 сервісів.
 */
@Component
public class InitializeStage3ContextAction implements Action<OrderState, OrderEvent> {

    private static final Logger logger = LoggerFactory.getLogger(InitializeStage3ContextAction.class);

    private final Stage3CoordinationService stage3CoordinationService;

    public InitializeStage3ContextAction(final Stage3CoordinationService stage3CoordinationService) {
        this.stage3CoordinationService = stage3CoordinationService;
    }

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        logger.info("🔥🔥🔥 InitializeStage3ContextAction.execute() ВИКЛИКАНО! 🔥🔥🔥");

        try {
            // Отримуємо sessionId з ExtendedState головного StateMachine
            String sessionId = extractSessionId(context);

            if (sessionId == null) {
                logger.error("❌ SessionId відсутній в ExtendedState головного StateMachine!");
                return;
            }

            logger.info("📥 SessionId з головного StateMachine: {}", sessionId);

            // Ініціалізуємо Stage3 сервіс
            initializeStage3Services(sessionId);

            logger.info("🎉 InitializeStage3ContextAction завершено успішно для sessionId: {}", sessionId);

        } catch (Exception e) {
            logger.error("💥 Загальна помилка в InitializeStage3ContextAction: {}", e.getMessage(), e);
        }
    }

    /**
     * Витягує sessionId з ExtendedState контексту
     */
    private String extractSessionId(StateContext<OrderState, OrderEvent> context) {
        String sessionId = context.getExtendedState().get("sessionId", String.class);
        UUID sessionIdUUID = context.getExtendedState().get("sessionIdUUID", UUID.class);

        logger.info("📥 SessionId з головного StateMachine: String={}, UUID={}", sessionId, sessionIdUUID);

        if (sessionId == null && sessionIdUUID != null) {
            sessionId = sessionIdUUID.toString();
            logger.info("🔄 Converted UUID to String: {}", sessionId);
        }

        return sessionId;
    }

    /**
     * Ініціалізує Stage3 сервіс
     */
    private void initializeStage3Services(String sessionId) {
        UUID sessionUUID = UUID.fromString(sessionId);

        // Ініціалізуємо Stage3 сервіс
        logger.info("🔧 Ініціалізація Stage3CoordinationService з sessionId: {}", sessionId);
        try {
            // Перевіряємо чи існує сесія, якщо ні - створюємо
            if (!stage3CoordinationService.sessionExists(sessionUUID)) {
                // Отримуємо orderId з контексту (має бути встановлений раніше)
                UUID orderId = extractOrderId(sessionUUID);
                if (orderId != null) {
                    stage3CoordinationService.createSession(orderId);
                    logger.info("✅ Stage3 сесія створена для orderId: {}", orderId);
                } else {
                    logger.warn("⚠️ OrderId не знайдено, використовуємо sessionId як orderId");
                    stage3CoordinationService.createSession(sessionUUID);
                }

                // Ініціалізуємо Stage3 після створення сесії
                stage3CoordinationService.initializeStage3(sessionUUID);
                logger.info("✅ Stage3 ініціалізовано успішно");
            } else {
                logger.info("ℹ️ Stage3 сесія вже існує для sessionId: {}", sessionId);
                // Переініціалізуємо на всякий випадок
                stage3CoordinationService.initializeStage3(sessionUUID);
                logger.info("✅ Stage3 переініціалізовано успішно");
            }
        } catch (Exception e) {
            logger.error("💥 Помилка при ініціалізації Stage3CoordinationService: {}", e.getMessage(), e);
        }
    }

    /**
     * Витягує orderId з контексту або повертає sessionId як orderId
     */
    private UUID extractOrderId(UUID sessionId) {
        try {
            // Спробуємо отримати orderId з ExtendedState або використаємо sessionId
            // В реальному проекті orderId має бути встановлений на початку Order Wizard
            logger.debug("Використовуємо sessionId як orderId: {}", sessionId);
            return sessionId;
        } catch (Exception e) {
            logger.debug("Не вдалося отримати orderId з контексту: {}", e.getMessage());
            return sessionId;
        }
    }
}
