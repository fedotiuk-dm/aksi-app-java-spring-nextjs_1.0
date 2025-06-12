package com.aksi.domain.order.statemachine.actions;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.substep2.service.ItemCharacteristicsCoordinationService;

/**
 * Action для ініціалізації Substep2 (ItemCharacteristics) контекстів з sessionId від головного Order Wizard.
 * Виконується при переході в стан ITEM_WIZARD_ACTIVE для substep2.
 *
 * Забезпечує що sessionId від головного Order Wizard буде використаний
 * для ініціалізації ItemCharacteristics сервісу.
 *
 * Примітка: ItemCharacteristics потребує itemId для повної ініціалізації,
 * тому тут ми тільки підготовлюємо базовий контекст.
 */
@Component
public class InitializeSubstep2ContextAction implements Action<OrderState, OrderEvent> {

    private static final Logger logger = LoggerFactory.getLogger(InitializeSubstep2ContextAction.class);

    private final ItemCharacteristicsCoordinationService itemCharacteristicsService;

    public InitializeSubstep2ContextAction(final ItemCharacteristicsCoordinationService itemCharacteristicsService) {
        this.itemCharacteristicsService = itemCharacteristicsService;
    }

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        logger.info("🔥🔥🔥 InitializeSubstep2ContextAction.execute() ВИКЛИКАНО! 🔥🔥🔥");

        try {
            // Отримуємо sessionId з ExtendedState головного StateMachine
            String sessionId = extractSessionId(context);

            if (sessionId == null) {
                logger.error("❌ SessionId відсутній в ExtendedState головного StateMachine!");
                return;
            }

            logger.info("📥 SessionId з головного StateMachine: {}", sessionId);

            // Ініціалізуємо Substep2 сервіс
            initializeSubstep2Services(sessionId);

            logger.info("🎉 InitializeSubstep2ContextAction завершено успішно для sessionId: {}", sessionId);

        } catch (Exception e) {
            logger.error("💥 Загальна помилка в InitializeSubstep2ContextAction: {}", e.getMessage(), e);
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
     * Ініціалізує Substep2 (ItemCharacteristics) сервіс
     */
    private void initializeSubstep2Services(String sessionId) {
        UUID sessionUUID = UUID.fromString(sessionId);

        // Ініціалізуємо ItemCharacteristics сервіс
        logger.info("🔧 Ініціалізація ItemCharacteristics контексту з sessionId: {}", sessionId);
        try {
            // Створюємо контекст для substep2 (itemId буде додано пізніше при старті wizard)
            itemCharacteristicsService.createContext(sessionUUID);
            logger.info("✅ ItemCharacteristics контекст створено успішно");

        } catch (Exception e) {
            logger.error("💥 Помилка при створенні ItemCharacteristics контексту: {}", e.getMessage(), e);
        }
    }
}
