package com.aksi.domain.order.statemachine.actions;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.substep5.service.PhotoDocumentationCoordinationService;

/**
 * Action для ініціалізації Substep5 (PhotoDocumentation) контекстів з sessionId від головного Order Wizard.
 * Виконується при переході в стан ITEM_WIZARD_ACTIVE для substep5.
 *
 * Забезпечує що sessionId від головного Order Wizard буде використаний
 * для ініціалізації PhotoDocumentation сервісу.
 *
 * Примітка: PhotoDocumentation потребує itemId для ініціалізації,
 * тому тут ми тільки підготовлюємо базовий контекст.
 */
@Component
public class InitializeSubstep5ContextAction implements Action<OrderState, OrderEvent> {

    private static final Logger logger = LoggerFactory.getLogger(InitializeSubstep5ContextAction.class);

    private final PhotoDocumentationCoordinationService photoDocumentationService;

    public InitializeSubstep5ContextAction(final PhotoDocumentationCoordinationService photoDocumentationService) {
        this.photoDocumentationService = photoDocumentationService;
    }

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        logger.info("🔥🔥🔥 InitializeSubstep5ContextAction.execute() ВИКЛИКАНО! 🔥🔥🔥");

        try {
            // Отримуємо sessionId з ExtendedState головного StateMachine
            String sessionId = extractSessionId(context);

            if (sessionId == null) {
                logger.error("❌ SessionId відсутній в ExtendedState головного StateMachine!");
                return;
            }

            logger.info("📥 SessionId з головного StateMachine: {}", sessionId);

            // Ініціалізуємо Substep5 сервіс
            initializeSubstep5Services(sessionId);

            logger.info("🎉 InitializeSubstep5ContextAction завершено успішно для sessionId: {}", sessionId);

        } catch (Exception e) {
            logger.error("💥 Загальна помилка в InitializeSubstep5ContextAction: {}", e.getMessage(), e);
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
     * Ініціалізує Substep5 (PhotoDocumentation) сервіс
     */
    private void initializeSubstep5Services(String sessionId) {
        UUID sessionUUID = UUID.fromString(sessionId);

        // Ініціалізуємо PhotoDocumentation сервіс
        logger.info("🔧 Ініціалізація PhotoDocumentation контексту з sessionId: {}", sessionId);
        try {
            // Перевіряємо чи існує контекст
            if (photoDocumentationService.hasContext(sessionUUID)) {
                logger.warn("⚠️ PhotoDocumentation вже має контекст для sessionId: {}", sessionId);
            } else {
                logger.info("✅ PhotoDocumentation готовий до ініціалізації для sessionId: {}", sessionId);
                logger.info("ℹ️ Повна ініціалізація буде при виклику createContext(sessionId, itemId)");
            }

        } catch (Exception e) {
            logger.error("💥 Помилка при ініціалізації PhotoDocumentation контексту: {}", e.getMessage(), e);
        }
    }
}
