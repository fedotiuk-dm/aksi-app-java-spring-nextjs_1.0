package com.aksi.domain.order.statemachine.service;

import java.time.Duration;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.messaging.support.MessageBuilder;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.config.StateMachineFactory;
import org.springframework.statemachine.persist.StateMachinePersister;
import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

/**
 * Основний сервіс для управління Order State Machine.
 * Координує створення, керування та персистенцію машин станів.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderStateMachineService {

    private final StateMachineFactory<OrderState, OrderEvent> stateMachineFactory;
    private final StateMachinePersister<OrderState, OrderEvent, String> persister;
    private final OrderWizardSessionService sessionService;

    private final Map<UUID, StateMachine<OrderState, OrderEvent>> activeStateMachines = new ConcurrentHashMap<>();

    // Timeout для реактивних операцій
    private static final Duration OPERATION_TIMEOUT = Duration.ofSeconds(10);

    /**
     * Створює та запускає нову машину станів для замовлення.
     */
    public StateMachine<OrderState, OrderEvent> createOrderStateMachine(UUID sessionId) {
        log.info("Створення нової State Machine для сесії: {}", sessionId);

        try {
            // Створюємо нову машину станів
            StateMachine<OrderState, OrderEvent> stateMachine = stateMachineFactory.getStateMachine(sessionId.toString());

            // Ініціалізуємо контекст
            stateMachine.getExtendedState().getVariables().put("sessionId", sessionId);
            stateMachine.getExtendedState().getVariables().put("createdAt", System.currentTimeMillis());

            // Запускаємо машину станів з новим API
            try {
                stateMachine.startReactively().block(OPERATION_TIMEOUT);
                log.debug("State Machine успішно запущено для сесії: {}", sessionId);
            } catch (Exception e) {
                log.error("Помилка запуску State Machine для сесії {}: {}", sessionId, e.getMessage(), e);
                throw new RuntimeException("Не вдалося запустити State Machine", e);
            }

            // Зберігаємо в активних машинах
            activeStateMachines.put(sessionId, stateMachine);

            log.info("State Machine успішно створено та запущено для сесії: {}", sessionId);
            return stateMachine;

        } catch (RuntimeException e) {
            log.error("Помилка створення State Machine для сесії {}: {}", sessionId, e.getMessage(), e);
            throw new RuntimeException("Не вдалося створити State Machine", e);
        }
    }

    /**
     * Отримує активну машину станів за ID сесії.
     */
    public StateMachine<OrderState, OrderEvent> getStateMachine(UUID sessionId) {
        StateMachine<OrderState, OrderEvent> stateMachine = activeStateMachines.get(sessionId);

        if (stateMachine == null) {
            log.warn("State Machine не знайдено для сесії: {}", sessionId);
            // Спробуємо відновити з персистенції
            return restoreStateMachine(sessionId);
        }

        return stateMachine;
    }

    /**
     * Відправляє подію до машини станів.
     */
    public boolean sendEvent(UUID sessionId, OrderEvent event) {
        log.debug("Відправка події {} для сесії {}", event, sessionId);

        StateMachine<OrderState, OrderEvent> stateMachine = getStateMachine(sessionId);
        if (stateMachine == null) {
            log.error("Не вдалося знайти State Machine для сесії: {}", sessionId);
            return false;
        }

        try {
            // Використовуємо сучасний API для відправки подій
            var eventResults = stateMachine.sendEventCollect(Mono.just(MessageBuilder.withPayload(event).build())).block();
            boolean result = eventResults != null && !eventResults.isEmpty();

            if (result) {
                log.debug("Подія {} успішно оброблена для сесії {}", event, sessionId);
                // Оновлюємо час останньої активності в сесії
                sessionService.updateSessionState(sessionId, stateMachine.getState().getId());
                // Зберігаємо стан
                saveStateMachine(sessionId, stateMachine);
            } else {
                log.warn("Подія {} не прийнята для сесії {} в стані {}",
                        event, sessionId, stateMachine.getState().getId());
            }

            return result;

        } catch (Exception e) {
            log.error("Помилка обробки події {} для сесії {}: {}", event, sessionId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Отримує поточний стан машини.
     */
    public OrderState getCurrentState(UUID sessionId) {
        StateMachine<OrderState, OrderEvent> stateMachine = getStateMachine(sessionId);
        if (stateMachine != null && stateMachine.getState() != null) {
            return stateMachine.getState().getId();
        }
        return null;
    }

    /**
     * Завершує роботу машини станів.
     */
    public void completeStateMachine(UUID sessionId) {
        log.info("Завершення State Machine для сесії: {}", sessionId);

        StateMachine<OrderState, OrderEvent> stateMachine = activeStateMachines.remove(sessionId);
        if (stateMachine != null) {
            try {
                // Використовуємо reactive API для зупинки
                stateMachine.stopReactively().block(OPERATION_TIMEOUT);
                log.info("State Machine успішно зупинено для сесії: {}", sessionId);
            } catch (Exception e) {
                log.error("Помилка зупинки State Machine для сесії {}: {}", sessionId, e.getMessage(), e);
            }
        }

        // Завершуємо сесію
        sessionService.completeSession(sessionId);
    }

    /**
     * Скасовує роботу машини станів.
     */
    public void cancelStateMachine(UUID sessionId) {
        log.info("Скасування State Machine для сесії: {}", sessionId);

        StateMachine<OrderState, OrderEvent> stateMachine = activeStateMachines.remove(sessionId);
        if (stateMachine != null) {
            try {
                // Спробуємо відправити подію скасування
                stateMachine.sendEventCollect(Mono.just(MessageBuilder.withPayload(OrderEvent.CANCEL_ORDER).build())).block();

                // Використовуємо reactive API для зупинки
                stateMachine.stopReactively().block(OPERATION_TIMEOUT);
                log.info("State Machine успішно скасовано для сесії: {}", sessionId);
            } catch (Exception e) {
                log.error("Помилка скасування State Machine для сесії {}: {}", sessionId, e.getMessage(), e);
            }
        }

        // Скасовуємо сесію
        sessionService.cancelSession(sessionId);
    }

    /**
     * Зберігає стан машини станів.
     */
    private void saveStateMachine(UUID sessionId, StateMachine<OrderState, OrderEvent> stateMachine) {
        try {
            persister.persist(stateMachine, sessionId.toString());
            log.debug("Стан State Machine збережено для сесії: {}", sessionId);
        } catch (Exception e) {
            log.error("Помилка збереження стану State Machine для сесії {}: {}", sessionId, e.getMessage(), e);
        }
    }

    /**
     * Відновлює машину станів з персистенції.
     */
    private StateMachine<OrderState, OrderEvent> restoreStateMachine(UUID sessionId) {
        try {
            log.info("Спроба відновлення State Machine для сесії: {}", sessionId);

            StateMachine<OrderState, OrderEvent> stateMachine = stateMachineFactory.getStateMachine(sessionId.toString());

            // Спробуємо відновити збережений стан
            persister.restore(stateMachine, sessionId.toString());

                        // Переконуємось що машина активна після відновлення
            if (stateMachine.getState() == null) {
                try {
                    stateMachine.startReactively().block(OPERATION_TIMEOUT);
                    log.debug("State Machine перезапущено після відновлення для сесії: {}", sessionId);
                } catch (Exception e) {
                    log.error("Помилка перезапуску State Machine після відновлення для сесії {}: {}",
                             sessionId, e.getMessage(), e);
                    return null;
                }
            }

            // Додаємо до активних машин
            activeStateMachines.put(sessionId, stateMachine);

            log.info("State Machine успішно відновлено для сесії: {}", sessionId);
            return stateMachine;

        } catch (Exception e) {
            log.error("Помилка відновлення State Machine для сесії {}: {}", sessionId, e.getMessage(), e);
            return null;
        }
    }

    /**
     * Очищає неактивні машини станів.
     */
    public void cleanupInactiveStateMachines() {
        log.info("Очищення неактивних State Machine");

        // Спочатку очищуємо неактивні сесії
        sessionService.cleanupInactiveSessions();

        // Потім видаляємо відповідні машини станів
        activeStateMachines.entrySet().removeIf(entry -> {
            UUID sessionId = entry.getKey();
            boolean shouldRemove = !sessionService.isSessionActive(sessionId);

            if (shouldRemove) {
                StateMachine<OrderState, OrderEvent> stateMachine = entry.getValue();
                try {
                    // Використовуємо reactive API для зупинки
                    if (stateMachine.getState() != null) {
                        stateMachine.stopReactively().block(OPERATION_TIMEOUT);
                    }
                    log.info("Видалено неактивну State Machine для сесії: {}", sessionId);
                } catch (Exception e) {
                    log.error("Помилка зупинки неактивної State Machine для сесії {}: {}", sessionId, e.getMessage(), e);
                }
            }

            return shouldRemove;
        });

        log.info("Очищення неактивних State Machine завершено");
    }

    /**
     * Отримує кількість активних машин станів.
     */
    public int getActiveStateMachinesCount() {
        return activeStateMachines.size();
    }

    /**
     * Перевіряє чи активна машина станів.
     */
    public boolean isStateMachineRunning(UUID sessionId) {
        StateMachine<OrderState, OrderEvent> stateMachine = activeStateMachines.get(sessionId);
        return stateMachine != null && stateMachine.getState() != null;
    }

    /**
     * Отримує розширений стан машини станів.
     */
    public Map<Object, Object> getExtendedStateVariables(UUID sessionId) {
        StateMachine<OrderState, OrderEvent> stateMachine = getStateMachine(sessionId);
        if (stateMachine != null) {
            return stateMachine.getExtendedState().getVariables();
        }
        return Map.of();
    }
}
