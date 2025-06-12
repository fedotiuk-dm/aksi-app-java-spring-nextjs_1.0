package com.aksi.domain.order.statemachine.actions;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.service.Stage2CoordinationService;
import com.aksi.domain.order.statemachine.stage2.substep1.service.ItemBasicInfoCoordinationService;

/**
 * Action для ініціалізації Stage2 контекстів з sessionId від головного Order Wizard.
 * Виконується при переході в стан ITEM_MANAGEMENT.
 *
 * Забезпечує що sessionId від головного Order Wizard буде використаний
 * для ініціалізації всіх Stage2 сервісів та substep сервісів.
 *
 * Примітка: Substep2-5 сервіси будуть ініціалізовані при старті wizard для конкретного предмета,
 * тому тут ініціалізуємо тільки Stage2 та Substep1 (ItemBasicInfo).
 */
@Component
public class InitializeStage2ContextAction implements Action<OrderState, OrderEvent> {

    private static final Logger logger = LoggerFactory.getLogger(InitializeStage2ContextAction.class);

    private final Stage2CoordinationService stage2CoordinationService;
    private final ItemBasicInfoCoordinationService itemBasicInfoService;

    public InitializeStage2ContextAction(
            final Stage2CoordinationService stage2CoordinationService,
            final ItemBasicInfoCoordinationService itemBasicInfoService) {
        this.stage2CoordinationService = stage2CoordinationService;
        this.itemBasicInfoService = itemBasicInfoService;
    }

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        logger.info("🔥🔥🔥 InitializeStage2ContextAction.execute() ВИКЛИКАНО! 🔥🔥🔥");

        try {
            // Отримуємо sessionId з ExtendedState головного StateMachine
            String sessionId = extractSessionId(context);

            if (sessionId == null) {
                logger.error("❌ SessionId відсутній в ExtendedState головного StateMachine!");
                return;
            }

            logger.info("📥 SessionId з головного StateMachine: {}", sessionId);

            // Ініціалізуємо всі сервіси Stage2
            initializeStage2Services(sessionId);

            logger.info("🎉 InitializeStage2ContextAction завершено успішно для sessionId: {}", sessionId);

        } catch (Exception e) {
            logger.error("💥 Загальна помилка в InitializeStage2ContextAction: {}", e.getMessage(), e);
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
     * Ініціалізує всі сервіси Stage2 та substeps
     */
    private void initializeStage2Services(String sessionId) {
        UUID sessionUUID = UUID.fromString(sessionId);

        // Ініціалізуємо головний Stage2 сервіс
        logger.info("🔧 Ініціалізація Stage2CoordinationService з sessionId: {}", sessionId);
        try {
            // Перевіряємо чи існує контекст, якщо ні - створюємо
            if (!stage2CoordinationService.hasContext(sessionUUID)) {
                // Отримуємо orderId з контексту (має бути встановлений раніше)
                UUID orderId = extractOrderId(sessionUUID);
                if (orderId != null) {
                    stage2CoordinationService.createContext(orderId);
                    logger.info("✅ Stage2 контекст створено для orderId: {}", orderId);
                } else {
                    logger.warn("⚠️ OrderId не знайдено, використовуємо sessionId як orderId");
                    stage2CoordinationService.createContext(sessionUUID);
                }
            } else {
                logger.info("ℹ️ Stage2 контекст вже існує для sessionId: {}", sessionId);
            }
        } catch (Exception e) {
            logger.error("💥 Помилка при ініціалізації Stage2CoordinationService: {}", e.getMessage(), e);
        }

        // Ініціалізуємо Substep1 - ItemBasicInfo (єдиний substep що ініціалізується на цьому етапі)
        initializeSubstep1Service(sessionUUID);
    }

    /**
     * Ініціалізує Substep1 (ItemBasicInfo) сервіс
     */
    private void initializeSubstep1Service(UUID sessionId) {
        // Substep1 - ItemBasicInfo
        logger.info("🔧 Ініціалізація ItemBasicInfoCoordinationService з sessionId: {}", sessionId);
        try {
            itemBasicInfoService.initializeSubstep(sessionId);
            logger.info("✅ ItemBasicInfo контекст ініціалізовано успішно");
        } catch (Exception e) {
            logger.error("💥 Помилка при ініціалізації ItemBasicInfo: {}", e.getMessage(), e);
        }

        // Substep2-5 будуть ініціалізовані окремими InitializeSubstepXContextAction при старті wizard для предмета
        logger.info("ℹ️ Substep2-5 будуть ініціалізовані при старті wizard для конкретного предмета");
    }

    /**
     * Витягує orderId з контексту або повертає null
     */
    private UUID extractOrderId(UUID sessionId) {
        try {
            // Спробуємо отримати orderId з Stage2 контексту якщо він існує
            if (stage2CoordinationService.hasContext(sessionId)) {
                return stage2CoordinationService.getOrderIdForSession(sessionId);
            }
        } catch (Exception e) {
            logger.debug("Не вдалося отримати orderId з контексту: {}", e.getMessage());
        }
        return null;
    }
}
