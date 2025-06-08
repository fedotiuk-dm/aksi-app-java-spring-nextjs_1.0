package com.aksi.domain.order.statemachine.service.lifecycle;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.messaging.support.MessageBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.config.StateMachineFactory;
import org.springframework.statemachine.listener.StateMachineListenerAdapter;
import org.springframework.statemachine.state.State;
import org.springframework.statemachine.transition.Transition;
import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.entity.OrderWizardSessionEntity;
import com.aksi.domain.order.statemachine.service.OrderWizardPersistenceService;
import com.aksi.domain.order.statemachine.service.OrderWizardCleanupService;
import com.aksi.domain.user.entity.UserEntity;
import com.aksi.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

/**
 * Сервіс для управління життєвим циклом State Machine.
 *
 * Відповідальності (SRP):
 * - Створення нових wizard
 * - Ініціалізація State Machine
 * - Збереження екземплярів
 * - Закриття та cleanup
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class StateMachineLifecycleService {

    private final StateMachineFactory<OrderState, OrderEvent> stateMachineFactory;
    private final OrderWizardPersistenceService persistenceService;
    private final OrderWizardCleanupService cleanupService;
    private final UserRepository userRepository;

    // Реєстр активних State Machine
    private final Map<String, StateMachine<OrderState, OrderEvent>> activeWizards = new ConcurrentHashMap<>();

    /**
     * Створює новий wizard та ініціалізує State Machine.
     */
    public String createWizard() {
        log.info("Створення нового Order Wizard");

        UserEntity user = getCurrentUser();
        StateMachine<OrderState, OrderEvent> stateMachine = stateMachineFactory.getStateMachine();

        // Додаємо listener для логування
        stateMachine.addStateListener(createWizardListener());

        // Запускаємо State Machine
        stateMachine.startReactively().block();

        // Надсилаємо початкову подію
        boolean started = stateMachine
            .sendEvent(Mono.just(MessageBuilder.withPayload(OrderEvent.START_ORDER).build()))
            .blockFirst() != null;

        if (started) {
            String wizardId = (String) stateMachine.getExtendedState()
                .getVariables().get("wizardId");

            if (wizardId != null) {
                // Зберігаємо сесію в БД
                OrderWizardSessionEntity session = persistenceService.createWizardSession(wizardId, user);

                // Ініціалізуємо базові дані
                initializeWizardContext(wizardId, stateMachine);

                // Зберігаємо початкові дані
                saveInitialWizardData(wizardId, stateMachine);

                // Реєструємо активний wizard
                activeWizards.put(wizardId, stateMachine);

                log.info("Order Wizard створено з ID: {} для користувача: {} (сесія ID: {})",
                    wizardId, user.getUsername(), session.getId());
                return wizardId;
            } else {
                log.error("Не вдалося отримати wizardId після ініціалізації");
                stateMachine.stopReactively().block();
                throw new RuntimeException("Помилка ініціалізації Order Wizard");
            }
        } else {
            log.error("Не вдалося запустити Order Wizard");
            stateMachine.stopReactively().block();
            throw new RuntimeException("Помилка запуску Order Wizard");
        }
    }

    /**
     * Закриває wizard та очищає ресурси.
     */
    public void closeWizard(String wizardId) {
        log.info("Закриття Order Wizard: {}", wizardId);

        StateMachine<OrderState, OrderEvent> stateMachine = activeWizards.remove(wizardId);
        if (stateMachine != null) {
            try {
                // Зберігаємо фінальний стан
                Map<Object, Object> extendedState = stateMachine.getExtendedState().getVariables();
                for (Map.Entry<Object, Object> entry : extendedState.entrySet()) {
                    if (entry.getKey() instanceof String key) {
                        persistenceService.saveWizardData(wizardId, key, entry.getValue(),
                            getCurrentStageNumber(stateMachine), getCurrentStepNumber(stateMachine));
                    }
                }

                // Зупиняємо State Machine
                stateMachine.stopReactively().block();
                log.info("Order Wizard {} успішно закрито", wizardId);

            } catch (Exception e) {
                log.error("Помилка закриття wizard {}: {}", wizardId, e.getMessage(), e);
            }
        } else {
            log.warn("Спроба закрити неіснуючий wizard: {}", wizardId);
        }
    }

    /**
     * Очищає неактивні wizard.
     */
    public void cleanupInactiveWizards() {
        cleanupService.cleanupExpiredSessions();
    }

    /**
     * Отримує State Machine за wizardId.
     */
    public StateMachine<OrderState, OrderEvent> getStateMachine(String wizardId) {
        StateMachine<OrderState, OrderEvent> stateMachine = activeWizards.get(wizardId);
        if (stateMachine == null) {
            throw new IllegalArgumentException("Order Wizard з ID " + wizardId + " не знайдено");
        }
        return stateMachine;
    }

    /**
     * Перевіряє чи існує wizard.
     */
    public boolean wizardExists(String wizardId) {
        return activeWizards.containsKey(wizardId);
    }

    /**
     * Отримує список всіх активних wizard.
     */
    public Map<String, StateMachine<OrderState, OrderEvent>> getActiveWizards() {
        return Map.copyOf(activeWizards);
    }

    // === ПРИВАТНІ МЕТОДИ ===

    /**
     * Ініціалізує контекст wizard.
     */
    private void initializeWizardContext(String wizardId, StateMachine<OrderState, OrderEvent> stateMachine) {
        stateMachine.getExtendedState().getVariables().put("wizardId", wizardId);
        log.debug("Контекст wizard ініціалізовано: {}", wizardId);
    }

    /**
     * Зберігає початкові дані wizard.
     */
    private void saveInitialWizardData(String wizardId, StateMachine<OrderState, OrderEvent> stateMachine) {
        Map<Object, Object> extendedState = stateMachine.getExtendedState().getVariables();
        for (Map.Entry<Object, Object> entry : extendedState.entrySet()) {
            if (entry.getKey() instanceof String key) {
                persistenceService.saveWizardData(wizardId, key, entry.getValue(), 1, 1);
            }
        }
    }

    /**
     * Створює listener для State Machine.
     */
    private StateMachineListenerAdapter<OrderState, OrderEvent> createWizardListener() {
        return new StateMachineListenerAdapter<OrderState, OrderEvent>() {
            @Override
            public void stateChanged(State<OrderState, OrderEvent> from, State<OrderState, OrderEvent> to) {
                if (from != null) {
                    log.info("Wizard перехід стану: {} -> {}", from.getId(), to.getId());
                } else {
                    log.info("Wizard початковий стан: {}", to.getId());
                }
            }

            @Override
            public void transition(Transition<OrderState, OrderEvent> transition) {
                log.debug("Виконано перехід: {} -> {} на події {} з дією {}",
                    transition.getSource().getId(),
                    transition.getTarget().getId(),
                    transition.getTrigger().getEvent(),
                    transition.getActions().isEmpty() ? "немає" :
                        transition.getActions().iterator().next().getClass().getSimpleName()
                );
            }

            @Override
            public void eventNotAccepted(org.springframework.messaging.Message<OrderEvent> event) {
                log.warn("Wizard подія відхилена: {}", event.getPayload());
            }
        };
    }

    /**
     * Отримує поточного користувача.
     */
    private UserEntity getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Користувач не автентифікований");
        }

        return userRepository.findByUsername(authentication.getName())
            .orElseThrow(() -> new RuntimeException("Користувач не знайдений: " + authentication.getName()));
    }

    /**
     * Отримує номер поточного етапу.
     */
    private int getCurrentStageNumber(StateMachine<OrderState, OrderEvent> stateMachine) {
        OrderState currentState = stateMachine.getState().getId();
        return switch (currentState) {
            case ORDER_INITIALIZATION, CLIENT_SELECTION -> 1;
            case ITEM_MANAGEMENT, ITEM_WIZARD_ACTIVE, ITEM_BASIC_INFO, ITEM_CHARACTERISTICS,
                 ITEM_DEFECTS_STAINS, ITEM_PRICING, ITEM_PHOTOS, ITEM_COMPLETED -> 2;
            case EXECUTION_PARAMS, GLOBAL_DISCOUNTS, PAYMENT_PROCESSING, ADDITIONAL_INFO -> 3;
            case ORDER_CONFIRMATION, ORDER_REVIEW, LEGAL_ASPECTS, RECEIPT_GENERATION -> 4;
            default -> 1;
        };
    }

    /**
     * Отримує номер поточного кроку.
     */
    private int getCurrentStepNumber(StateMachine<OrderState, OrderEvent> stateMachine) {
        OrderState currentState = stateMachine.getState().getId();

        // Логіка визначення номеру кроку на основі стану
        return switch (currentState) {
            case ORDER_INITIALIZATION -> 1;
            case CLIENT_SELECTION -> 2;
            case ITEM_MANAGEMENT -> 1;
            case ITEM_WIZARD_ACTIVE, ITEM_BASIC_INFO -> 2;
            case ITEM_CHARACTERISTICS -> 3;
            case ITEM_DEFECTS_STAINS -> 4;
            case ITEM_PRICING -> 5;
            case ITEM_PHOTOS -> 6;
            case ITEM_COMPLETED -> 7;
            case EXECUTION_PARAMS -> 1;
            case GLOBAL_DISCOUNTS -> 2;
            case PAYMENT_PROCESSING -> 3;
            case ADDITIONAL_INFO -> 4;
            case ORDER_CONFIRMATION -> 1;
            case ORDER_REVIEW -> 2;
            case LEGAL_ASPECTS -> 3;
            case RECEIPT_GENERATION -> 4;
            default -> 1;
        };
    }
}
