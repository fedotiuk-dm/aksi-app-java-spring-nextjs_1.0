package com.aksi.domain.order.statemachine.actions;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.service.BasicOrderInfoCoordinationService;
import com.aksi.domain.order.statemachine.stage1.service.ClientSearchCoordinationService;

/**
 * Action для ініціалізації Stage1 контекстів з sessionId від головного Order Wizard.
 * Виконується при переході в стан CLIENT_SELECTION.
 *
 * Забезпечує що sessionId від головного Order Wizard буде використаний
 * для ініціалізації всіх Stage1 сервісів.
 */
@Component
public class InitializeStage1ContextAction implements Action<OrderState, OrderEvent> {

    private static final Logger logger = LoggerFactory.getLogger(InitializeStage1ContextAction.class);

    private final ClientSearchCoordinationService clientSearchService;
    private final BasicOrderInfoCoordinationService basicOrderInfoService;

    public InitializeStage1ContextAction(
            ClientSearchCoordinationService clientSearchService,
            BasicOrderInfoCoordinationService basicOrderInfoService) {
        this.clientSearchService = clientSearchService;
        this.basicOrderInfoService = basicOrderInfoService;
    }

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        logger.info("🔥🔥🔥 InitializeStage1ContextAction.execute() ВИКЛИКАНО! 🔥🔥🔥");

        try {
            // Отримуємо sessionId з ExtendedState головного StateMachine
            String sessionId = context.getExtendedState().get("sessionId", String.class);
            UUID sessionIdUUID = context.getExtendedState().get("sessionIdUUID", UUID.class);

            logger.info("📥 SessionId з головного StateMachine: String={}, UUID={}", sessionId, sessionIdUUID);

            if (sessionId == null && sessionIdUUID != null) {
                sessionId = sessionIdUUID.toString();
                logger.info("🔄 Converted UUID to String: {}", sessionId);
            }

            if (sessionId == null) {
                logger.error("❌ SessionId відсутній в ExtendedState головного StateMachine!");
                return;
            }

            // Ініціалізуємо ClientSearch контекст
            logger.info("🔧 Ініціалізація ClientSearch контексту з sessionId: {}", sessionId);
            try {
                clientSearchService.initializeClientSearch(sessionId);
                logger.info("✅ ClientSearch контекст ініціалізовано успішно");
            } catch (Exception e) {
                logger.error("💥 Помилка при ініціалізації ClientSearch: {}", e.getMessage(), e);
            }

            // Ініціалізуємо BasicOrderInfo контекст
            logger.info("🔧 Ініціалізація BasicOrderInfo контексту з sessionId: {}", sessionId);
            try {
                basicOrderInfoService.initializeBasicOrderInfo(sessionId);
                logger.info("✅ BasicOrderInfo контекст ініціалізовано успішно");
            } catch (Exception e) {
                logger.error("💥 Помилка при ініціалізації BasicOrderInfo: {}", e.getMessage(), e);
            }

            logger.info("🎉 InitializeStage1ContextAction завершено успішно для sessionId: {}", sessionId);

        } catch (Exception e) {
            logger.error("💥 Загальна помилка в InitializeStage1ContextAction: {}", e.getMessage(), e);
        }
    }
}
