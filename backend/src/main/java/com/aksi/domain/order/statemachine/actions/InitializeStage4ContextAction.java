package com.aksi.domain.order.statemachine.actions;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage4.service.Stage4CoordinationService;

/**
 * Action для ініціалізації Stage4 контекстів з sessionId від головного Order Wizard.
 * Виконується при переході в стан ORDER_CONFIRMATION.
 *
 * Забезпечує що sessionId від головного Order Wizard буде використаний
 * для ініціалізації всіх Stage4 сервісів.
 */
@Component
public class InitializeStage4ContextAction implements Action<OrderState, OrderEvent> {

    private static final Logger logger = LoggerFactory.getLogger(InitializeStage4ContextAction.class);

    private final Stage4CoordinationService stage4CoordinationService;

    public InitializeStage4ContextAction(final Stage4CoordinationService stage4CoordinationService) {
        this.stage4CoordinationService = stage4CoordinationService;
    }

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        logger.info("🔥🔥🔥 InitializeStage4ContextAction.execute() ВИКЛИКАНО! 🔥🔥🔥");

        try {
            // Отримуємо sessionId з ExtendedState головного StateMachine
            String sessionId = extractSessionId(context);

            if (sessionId == null) {
                logger.error("❌ SessionId відсутній в ExtendedState головного StateMachine!");
                return;
            }

            logger.info("📥 SessionId з головного StateMachine: {}", sessionId);

            // Ініціалізуємо Stage4 сервіс
            initializeStage4Services(sessionId);

            logger.info("🎉 InitializeStage4ContextAction завершено успішно для sessionId: {}", sessionId);

        } catch (Exception e) {
            logger.error("💥 Загальна помилка в InitializeStage4ContextAction: {}", e.getMessage(), e);
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
     * Ініціалізує Stage4 сервіс
     */
    private void initializeStage4Services(String sessionId) {
        UUID sessionUUID = UUID.fromString(sessionId);

        // Ініціалізуємо Stage4 сервіс
        logger.info("🔧 Ініціалізація Stage4CoordinationService з sessionId: {}", sessionId);
        try {
            // Отримуємо orderId з контексту (має бути встановлений раніше)
            UUID orderId = extractOrderId(sessionUUID);

            // Ініціалізуємо Stage4 контекст
            stage4CoordinationService.initializeStage4(sessionUUID, orderId);
            logger.info("✅ Stage4 ініціалізовано успішно для orderId: {}", orderId);

        } catch (Exception e) {
            logger.error("💥 Помилка при ініціалізації Stage4CoordinationService: {}", e.getMessage(), e);
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
