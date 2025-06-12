package com.aksi.domain.order.statemachine.util;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.Message;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.StateMachineEventResult;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.dto.OrderWizardResponseDTO;
import com.aksi.domain.order.statemachine.enums.OrderStateTransitions;

import reactor.core.publisher.Mono;

/**
 * Utility клас для роботи з Spring State Machine.
 * Містить загальні методи для уникнення дублікування коду.
 */
public final class StateMachineUtils {

    private static final Logger logger = LoggerFactory.getLogger(StateMachineUtils.class);

    private StateMachineUtils() {
        // Private constructor для utility класу
    }

    /**
     * Перевіряє валідність сесії.
     *
     * @param stateMachine state machine instance
     * @param sessionId ID сесії для перевірки
     * @return true якщо сесія валідна
     */
    public static boolean validateSession(StateMachine<OrderState, OrderEvent> stateMachine, String sessionId) {
        if (sessionId == null || stateMachine == null) {
            logger.warn("⚠️  Validation failed: sessionId={}, stateMachine={}", sessionId, stateMachine != null);
            return false;
        }

        String currentSessionId = stateMachine.getExtendedState().get("sessionId", String.class);
        boolean isValid = sessionId.equals(currentSessionId);

        if (!isValid) {
            logger.warn("⚠️  Session validation failed: expected={}, actual={}", sessionId, currentSessionId);
        }

        return isValid;
    }

    /**
     * Безпечно відправляє подію до state machine з новим reactive API.
     *
     * @param stateMachine state machine instance
     * @param event подія для відправки
     * @return true якщо подія була успішно оброблена
     */
    public static boolean sendEventSafely(StateMachine<OrderState, OrderEvent> stateMachine, OrderEvent event) {
        logger.info("🔄 sendEventSafely called with event: {}", event);

        if (stateMachine == null || event == null) {
            logger.error("❌ Invalid parameters: stateMachine={}, event={}", stateMachine != null, event);
            return false;
        }

        try {
            // Логируем текущее состояние
            OrderState currentState = stateMachine.getState() != null ? stateMachine.getState().getId() : null;
            logger.info("📊 Current state before event: {}", currentState);

            // Логуємо детальну інформацію про StateMachine
            logger.info("🔍 StateMachine details: id={}, hasState={}",
                stateMachine.getId(), stateMachine.getState() != null);

            // Використовуємо новий reactive API замість deprecated sendEvent()
            Message<OrderEvent> message = org.springframework.messaging.support.MessageBuilder
                .withPayload(event)
                .build();

            logger.info("📬 Sending message with payload: {}", message.getPayload());

            // Відправляємо event через reactive API та блокуємо для отримання результату
            StateMachineEventResult<OrderState, OrderEvent> result = stateMachine.sendEvent(Mono.just(message))
                .blockFirst();  // Отримуємо перший результат

            // Детальне логування результату
            if (result != null) {
                logger.info("📨 Event result received: resultType={}, region={}",
                    result.getResultType(), result.getRegion());

                boolean isAccepted = result.getResultType() == StateMachineEventResult.ResultType.ACCEPTED;
                logger.info("✅ Event processing: {}", isAccepted ? "ACCEPTED" : "REJECTED/DENIED");

                // Логируем новое состояние
                OrderState newState = stateMachine.getState() != null ? stateMachine.getState().getId() : null;
                logger.info("📊 State after event: {} -> {}", currentState, newState);

                // Якщо event REJECTED/DENIED, логуємо додаткову інформацію
                if (!isAccepted) {
                    logger.warn("⚠️ Event {} was rejected/denied! Current state: {}",
                        event, newState);
                }

                return isAccepted;
            } else {
                logger.error("❌ Event result is NULL! This should not happen.");
                return false;
            }
        } catch (Exception e) {
            logger.error("💥 Exception in sendEventSafely: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Отримує поточний стан state machine.
     *
     * @param stateMachine state machine instance
     * @return поточний стан або null
     */
    public static OrderState getCurrentState(StateMachine<OrderState, OrderEvent> stateMachine) {
        if (stateMachine == null || stateMachine.getState() == null) {
            return null;
        }
        return stateMachine.getState().getId();
    }

    /**
     * Генерує новий унікальний ID сесії.
     *
     * @return новий UUID як String
     */
    public static String generateSessionId() {
        return UUID.randomUUID().toString();
    }

    /**
     * Ініціалізує сесію в state machine.
     *
     * @param stateMachine state machine instance
     * @param sessionId ID сесії
     */
    public static void initializeSession(StateMachine<OrderState, OrderEvent> stateMachine, String sessionId) {
        logger.info("🔧 Initializing session: sessionId={}", sessionId);

        if (stateMachine != null && sessionId != null) {
            try {
                // Зберігаємо sessionId як String та як UUID для сумісності
                stateMachine.getExtendedState().getVariables().put("sessionId", sessionId);
                stateMachine.getExtendedState().getVariables().put("sessionIdUUID", java.util.UUID.fromString(sessionId));

                logger.info("✅ Session initialized successfully with both String and UUID formats");

                // Перевіряємо що сесія справді збережена
                String storedSessionId = stateMachine.getExtendedState().get("sessionId", String.class);
                java.util.UUID storedSessionUUID = stateMachine.getExtendedState().get("sessionIdUUID", java.util.UUID.class);
                logger.info("🔍 Stored sessionId verification: String={}, UUID={}", storedSessionId, storedSessionUUID);
            } catch (Exception e) {
                logger.error("💥 Exception during session initialization: {}", e.getMessage(), e);
            }
        } else {
            logger.error("❌ Cannot initialize session: stateMachine={}, sessionId={}",
                stateMachine != null, sessionId);
        }
    }

    /**
     * Загальний метод для обробки переходів стану з валідацією та единою логікою.
     *
     * @param stateMachine state machine instance
     * @param sessionId ID сесії
     * @param event подія для обробки
     * @param successMessage повідомлення при успіху
     * @return ResponseEntity з результатом переходу
     */
    public static ResponseEntity<OrderWizardResponseDTO> processStateTransition(
            StateMachine<OrderState, OrderEvent> stateMachine,
            String sessionId,
            OrderEvent event,
            String successMessage) {

        if (!validateSession(stateMachine, sessionId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new OrderWizardResponseDTO(sessionId, null, false, "Session not found"));
        }

        boolean success = sendEventSafely(stateMachine, event);
        OrderState newState = getCurrentState(stateMachine);

        if (success) {
            return ResponseEntity.ok(new OrderWizardResponseDTO(
                sessionId, newState, true, successMessage
            ));
        } else {
            return ResponseEntity.badRequest()
                .body(new OrderWizardResponseDTO(sessionId, newState, false, "Failed to process transition"));
        }
    }

    /**
     * Покращений метод для обробки переходів стану з попередньою валідацією.
     * Використовує OrderStateTransitions для перевірки дозволених переходів.
     *
     * @param stateMachine state machine instance
     * @param sessionId ID сесії
     * @param event подія для обробки
     * @param successMessage повідомлення при успіху
     * @return ResponseEntity з результатом переходу
     */
    public static ResponseEntity<OrderWizardResponseDTO> processValidatedStateTransition(
            StateMachine<OrderState, OrderEvent> stateMachine,
            String sessionId,
            OrderEvent event,
            String successMessage) {

        if (!validateSession(stateMachine, sessionId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new OrderWizardResponseDTO(sessionId, null, false, "Session not found"));
        }

        OrderState currentState = getCurrentState(stateMachine);

        // Попередня валідація переходу
        if (!isTransitionAllowed(currentState, event)) {
            return ResponseEntity.badRequest()
                .body(new OrderWizardResponseDTO(sessionId, currentState, false,
                    String.format("Transition from %s with event %s is not allowed", currentState, event)));
        }

        boolean success = sendEventSafely(stateMachine, event);
        OrderState newState = getCurrentState(stateMachine);

        if (success) {
            return ResponseEntity.ok(new OrderWizardResponseDTO(
                sessionId, newState, true, successMessage
            ));
        } else {
            return ResponseEntity.badRequest()
                .body(new OrderWizardResponseDTO(sessionId, newState, false, "Failed to process transition"));
        }
    }

    /**
     * Створює ResponseEntity для отримання поточного стану з структурованою відповіддю.
     *
     * @param stateMachine state machine instance
     * @param sessionId ID сесії
     * @return ResponseEntity з поточним станом
     */
    public static ResponseEntity<OrderWizardResponseDTO> getCurrentStateResponse(
            StateMachine<OrderState, OrderEvent> stateMachine,
            String sessionId) {

        if (!validateSession(stateMachine, sessionId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new OrderWizardResponseDTO(sessionId, null, false, "Session not found"));
        }

        OrderState currentState = getCurrentState(stateMachine);
        return ResponseEntity.ok(new OrderWizardResponseDTO(
            sessionId, currentState, true, "Current state retrieved successfully"
        ));
    }

    /**
     * Отримує інформацію про сесію як String.
     *
     * @param stateMachine state machine instance
     * @param sessionId ID сесії
     * @return Optional з інформацією про сесію
     */
    public static Optional<String> getSessionInfo(
            StateMachine<OrderState, OrderEvent> stateMachine,
            String sessionId) {

        if (!validateSession(stateMachine, sessionId)) {
            return Optional.empty();
        }

        OrderState currentState = getCurrentState(stateMachine);
        if (currentState == null) {
            return Optional.empty();
        }

        String info = String.format("Session: %s, Current State: %s", sessionId, currentState);
        return Optional.of(info);
    }

    /**
     * Запускає state machine з початковою подією.
     *
     * @param stateMachine state machine instance
     * @param sessionId ID сесії
     * @param initialEvent початкова подія
     * @return true якщо запуск успішний
     */
    public static boolean startStateMachine(
            StateMachine<OrderState, OrderEvent> stateMachine,
            String sessionId,
            OrderEvent initialEvent) {

        logger.info("🚀 startStateMachine called with sessionId={}, initialEvent={}", sessionId, initialEvent);

        if (stateMachine == null || sessionId == null || initialEvent == null) {
            logger.error("❌ Invalid parameters: stateMachine={}, sessionId={}, initialEvent={}",
                stateMachine != null, sessionId, initialEvent);
            return false;
        }

        try {
            // Скидаємо StateMachine до початкового стану
            logger.info("🔄 Resetting StateMachine to initial state...");
            stateMachine.stopReactively().block();

            // Ініціалізуємо сесію
            logger.info("🔧 Initializing session: {}", sessionId);
            initializeSession(stateMachine, sessionId);

            // Перевіряємо стан перед запуском
            OrderState stateBefore = stateMachine.getState() != null ? stateMachine.getState().getId() : null;
            logger.info("📊 State before starting: {}", stateBefore);

            // Запускаємо state machine з новим reactive API
            logger.info("▶️  Starting StateMachine reactively...");
            stateMachine.startReactively().block();

            // Перевіряємо стан після запуску
            OrderState stateAfterStart = stateMachine.getState() != null ? stateMachine.getState().getId() : null;
            logger.info("📊 State after starting: {}", stateAfterStart);

            // Відправляємо початкову подію
            logger.info("📤 Sending initial event: {}", initialEvent);
            boolean eventResult = sendEventSafely(stateMachine, initialEvent);

            logger.info("✅ startStateMachine result: {}", eventResult);
            return eventResult;
        } catch (Exception e) {
            logger.error("💥 Exception in startStateMachine: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Отримує доступні події для конкретного стану.
     * Використовує покращений підхід замість switch statement.
     *
     * @param state поточний стан
     * @return масив доступних подій
     */
    public static String[] getAvailableEventsForState(OrderState state) {
        return OrderStateTransitions.getAvailableEventsAsStringArray(state);
    }

    /**
     * Отримує доступні події як список для додаткової обробки.
     *
     * @param state поточний стан
     * @return список доступних подій
     */
    public static List<OrderEvent> getAvailableEventsAsList(OrderState state) {
        return OrderStateTransitions.getAvailableEvents(state);
    }

    /**
     * Перевіряє чи дозволений перехід перед його виконанням.
     *
     * @param currentState поточний стан
     * @param event подія для виконання
     * @return true якщо перехід дозволений
     */
    public static boolean isTransitionAllowed(OrderState currentState, OrderEvent event) {
        return OrderStateTransitions.isTransitionAllowed(currentState, event);
    }

    /**
     * Безпечно відправляє подію з попередньою валідацією переходу.
     *
     * @param stateMachine state machine instance
     * @param event подія для відправки
     * @return true якщо подія була успішно оброблена
     */
    public static boolean sendEventSafelyWithValidation(StateMachine<OrderState, OrderEvent> stateMachine, OrderEvent event) {
        if (stateMachine == null || event == null) {
            return false;
        }

        OrderState currentState = getCurrentState(stateMachine);
        if (currentState == null) {
            return false;
        }

        // Перевіряємо чи дозволений цей перехід
        if (!isTransitionAllowed(currentState, event)) {
            return false;
        }

        return sendEventSafely(stateMachine, event);
    }

    /**
     * Створює карту з доступними переходами для поточного стану з додатковою інформацією.
     *
     * @param stateMachine state machine instance
     * @param sessionId ID сесії
     * @return ResponseEntity з розширеною картою переходів
     */
    public static ResponseEntity<Map<String, Object>> getAvailableTransitions(
            StateMachine<OrderState, OrderEvent> stateMachine,
            String sessionId) {

        if (!validateSession(stateMachine, sessionId)) {
            return ResponseEntity.notFound().build();
        }

        OrderState currentState = getCurrentState(stateMachine);
        Map<String, Object> transitions = new HashMap<>();

        transitions.put("currentState", currentState);
        transitions.put("availableEvents", getAvailableEventsForState(currentState));
        transitions.put("availableEventsCount", OrderStateTransitions.getTransitionCount(currentState));
        transitions.put("sessionId", sessionId);
        transitions.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(transitions);
    }

    /**
     * Створює детальну карту інформації про сесію.
     *
     * @param stateMachine state machine instance
     * @param sessionId ID сесії
     * @return ResponseEntity з інформацією про сесію
     */
    public static ResponseEntity<Map<String, Object>> getDetailedSessionInfo(
            StateMachine<OrderState, OrderEvent> stateMachine,
            String sessionId) {

        Optional<String> sessionInfo = getSessionInfo(stateMachine, sessionId);

        if (sessionInfo.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("sessionId", sessionId);
            response.put("info", sessionInfo.get());
            response.put("currentState", getCurrentState(stateMachine));
            response.put("availableEvents", getAvailableEventsForState(getCurrentState(stateMachine)));
            response.put("timestamp", LocalDateTime.now());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Запускає новий Order Wizard з структурованою відповіддю.
     *
     * @param stateMachine state machine instance
     * @return ResponseEntity з результатом запуску
     */
    public static ResponseEntity<OrderWizardResponseDTO> startOrderWizard(
            StateMachine<OrderState, OrderEvent> stateMachine) {

        logger.info("🏁 startOrderWizard called");

        if (stateMachine == null) {
            logger.error("❌ StateMachine is null in startOrderWizard!");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new OrderWizardResponseDTO(null, null, false, "StateMachine not available"));
        }

        try {
            // Генеруємо унікальний ID сесії
            String sessionId = generateSessionId();
            logger.info("🆔 Generated sessionId: {}", sessionId);

            // Перевіряємо початковий стан StateMachine
            OrderState initialState = stateMachine.getState() != null ? stateMachine.getState().getId() : null;
            logger.info("📊 StateMachine initial state: {}", initialState);

            // Запускаємо state machine з початковою подією
            logger.info("🚀 Starting StateMachine with START_ORDER event...");
            logger.info("🔔 Calling startStateMachine(stateMachine, {}, {})", sessionId, OrderEvent.START_ORDER);

            boolean success = startStateMachine(
                stateMachine,
                sessionId,
                OrderEvent.START_ORDER
            );

            logger.info("📊 StateMachine start result: {}", success);

            // Перевіряємо фінальний стан
            OrderState finalState = stateMachine.getState() != null ? stateMachine.getState().getId() : null;
            logger.info("📊 StateMachine final state: {}", finalState);

            if (success) {
                logger.info("✅ Order Wizard started successfully. Final state: {}", finalState);

                OrderWizardResponseDTO responseBody = new OrderWizardResponseDTO(
                    sessionId, finalState, true, "Order wizard started successfully"
                );

                return ResponseEntity.ok(responseBody);
            } else {
                logger.error("❌ Failed to start StateMachine");

                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OrderWizardResponseDTO(sessionId, finalState, false, "Failed to start order wizard"));
            }
        } catch (Exception e) {
            logger.error("💥 Exception in startOrderWizard: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new OrderWizardResponseDTO(null, null, false, "Exception: " + e.getMessage()));
        }
    }
}
