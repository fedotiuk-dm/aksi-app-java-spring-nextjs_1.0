package com.aksi.domain.order.statemachine.actions;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.substep3.service.StainsDefectsCoordinationService;

/**
 * Action для ініціалізації Substep3 (StainsDefects) контекстів з sessionId від головного Order Wizard.
 * Виконується при переході в стан ITEM_WIZARD_ACTIVE для substep3.
 *
 * Забезпечує що sessionId від головного Order Wizard буде використаний
 * для ініціалізації StainsDefects сервісу.
 */
@Component
public class InitializeSubstep3ContextAction implements Action<OrderState, OrderEvent> {

    private static final Logger logger = LoggerFactory.getLogger(InitializeSubstep3ContextAction.class);

    private final StainsDefectsCoordinationService stainsDefectsService;

    public InitializeSubstep3ContextAction(final StainsDefectsCoordinationService stainsDefectsService) {
        this.stainsDefectsService = stainsDefectsService;
    }

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        logger.info("🔥🔥🔥 InitializeSubstep3ContextAction.execute() ВИКЛИКАНО! 🔥🔥🔥");

        try {
            // Отримуємо sessionId з ExtendedState головного StateMachine
            String sessionId = extractSessionId(context);

            if (sessionId == null) {
                logger.error("❌ SessionId відсутній в ExtendedState головного StateMachine!");
                return;
            }

            logger.info("📥 SessionId з головного StateMachine: {}", sessionId);

            // Ініціалізуємо Substep3 сервіс
            initializeSubstep3Services(sessionId);

            logger.info("🎉 InitializeSubstep3ContextAction завершено успішно для sessionId: {}", sessionId);

        } catch (Exception e) {
            logger.error("💥 Загальна помилка в InitializeSubstep3ContextAction: {}", e.getMessage(), e);
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
     * Ініціалізує Substep3 (StainsDefects) сервіс
     */
    private void initializeSubstep3Services(String sessionId) {
        UUID sessionUUID = UUID.fromString(sessionId);

        // Ініціалізуємо StainsDefects сервіс
        logger.info("🔧 Ініціалізація StainsDefects контексту з sessionId: {}", sessionId);
        try {
            // Створюємо контекст для substep3 (itemId буде додано пізніше при старті wizard)
            stainsDefectsService.createContext(sessionUUID);
            logger.info("✅ StainsDefects контекст створено успішно");

        } catch (Exception e) {
            logger.error("💥 Помилка при створенні StainsDefects контексту: {}", e.getMessage(), e);
        }
    }
}
