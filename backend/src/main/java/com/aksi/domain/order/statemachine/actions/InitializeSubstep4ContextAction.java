package com.aksi.domain.order.statemachine.actions;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.substep4.service.PriceDiscountCoordinationService;

/**
 * Action для ініціалізації Substep4 (PriceDiscount) контекстів з sessionId від головного Order Wizard.
 * Виконується при переході в стан ITEM_WIZARD_ACTIVE для substep4.
 *
 * Забезпечує що sessionId від головного Order Wizard буде використаний
 * для ініціалізації PriceDiscount сервісу.
 *
 * Примітка: PriceDiscount потребує дані з попередніх substep для ініціалізації,
 * тому тут ми тільки підготовлюємо базовий контекст.
 */
@Component
public class InitializeSubstep4ContextAction implements Action<OrderState, OrderEvent> {

    private static final Logger logger = LoggerFactory.getLogger(InitializeSubstep4ContextAction.class);

    private final PriceDiscountCoordinationService priceDiscountService;

    public InitializeSubstep4ContextAction(final PriceDiscountCoordinationService priceDiscountService) {
        this.priceDiscountService = priceDiscountService;
    }

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        logger.info("🔥🔥🔥 InitializeSubstep4ContextAction.execute() ВИКЛИКАНО! 🔥🔥🔥");

        try {
            // Отримуємо sessionId з ExtendedState головного StateMachine
            String sessionId = extractSessionId(context);

            if (sessionId == null) {
                logger.error("❌ SessionId відсутній в ExtendedState головного StateMachine!");
                return;
            }

            logger.info("📥 SessionId з головного StateMachine: {}", sessionId);

            // Ініціалізуємо Substep4 сервіс
            initializeSubstep4Services(sessionId);

            logger.info("🎉 InitializeSubstep4ContextAction завершено успішно для sessionId: {}", sessionId);

        } catch (Exception e) {
            logger.error("💥 Загальна помилка в InitializeSubstep4ContextAction: {}", e.getMessage(), e);
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
     * Ініціалізує Substep4 (PriceDiscount) сервіс
     */
    private void initializeSubstep4Services(String sessionId) {
        UUID sessionUUID = UUID.fromString(sessionId);

        // Ініціалізуємо PriceDiscount сервіс
        logger.info("🔧 Ініціалізація PriceDiscount контексту з sessionId: {}", sessionId);
        try {
            // Перевіряємо чи можемо ініціалізувати
            if (priceDiscountService.canInitialize(sessionUUID)) {
                logger.info("✅ PriceDiscount готовий до ініціалізації для sessionId: {}", sessionId);
                logger.info("ℹ️ Повна ініціалізація буде при виклику initializeSubstep з даними з попередніх substep");
            } else {
                logger.warn("⚠️ PriceDiscount вже має контекст для sessionId: {}", sessionId);
            }

        } catch (Exception e) {
            logger.error("💥 Помилка при ініціалізації PriceDiscount контексту: {}", e.getMessage(), e);
        }
    }
}
