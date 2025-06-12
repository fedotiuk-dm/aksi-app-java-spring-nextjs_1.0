package com.aksi.domain.order.statemachine.actions;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.substep1.service.ItemBasicInfoCoordinationService;

/**
 * Action для ініціалізації Substep1 (ItemBasicInfo) контекстів з sessionId від головного Order Wizard.
 * Виконується при переході в стан ITEM_WIZARD_ACTIVE для substep1.
 *
 * Забезпечує що sessionId від головного Order Wizard буде використаний
 * для ініціалізації ItemBasicInfo сервісу.
 */
@Component
public class InitializeSubstep1ContextAction implements Action<OrderState, OrderEvent> {

    private static final Logger logger = LoggerFactory.getLogger(InitializeSubstep1ContextAction.class);

    private final ItemBasicInfoCoordinationService itemBasicInfoService;

    public InitializeSubstep1ContextAction(final ItemBasicInfoCoordinationService itemBasicInfoService) {
        this.itemBasicInfoService = itemBasicInfoService;
    }

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        logger.info("🔥🔥🔥 InitializeSubstep1ContextAction.execute() ВИКЛИКАНО! 🔥🔥🔥");

        try {
            // Отримуємо sessionId з ExtendedState головного StateMachine
            String sessionId = extractSessionId(context);

            if (sessionId == null) {
                logger.error("❌ SessionId відсутній в ExtendedState головного StateMachine!");
                return;
            }

            logger.info("📥 SessionId з головного StateMachine: {}", sessionId);

            // Ініціалізуємо Substep1 сервіс
            initializeSubstep1Services(sessionId);

            logger.info("🎉 InitializeSubstep1ContextAction завершено успішно для sessionId: {}", sessionId);

        } catch (Exception e) {
            logger.error("💥 Загальна помилка в InitializeSubstep1ContextAction: {}", e.getMessage(), e);
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
     * Ініціалізує Substep1 (ItemBasicInfo) сервіс
     */
    private void initializeSubstep1Services(String sessionId) {
        UUID sessionUUID = UUID.fromString(sessionId);

        // Ініціалізуємо ItemBasicInfo сервіс
        logger.info("🔧 Ініціалізація ItemBasicInfoCoordinationService з sessionId: {}", sessionId);
        try {
            // Ініціалізуємо substep для нового предмета
            itemBasicInfoService.initializeSubstep(sessionUUID);
            logger.info("✅ ItemBasicInfo substep ініціалізовано успішно");

        } catch (Exception e) {
            logger.error("💥 Помилка при ініціалізації ItemBasicInfoCoordinationService: {}", e.getMessage(), e);
        }
    }
}
