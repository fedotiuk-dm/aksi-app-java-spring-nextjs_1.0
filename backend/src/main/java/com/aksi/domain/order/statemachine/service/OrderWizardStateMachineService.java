package com.aksi.domain.order.statemachine.service;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.messaging.support.MessageBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import reactor.core.publisher.Mono;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.config.StateMachineFactory;
import org.springframework.statemachine.listener.StateMachineListenerAdapter;
import org.springframework.statemachine.state.State;
import org.springframework.statemachine.transition.Transition;
import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.entity.OrderWizardSessionEntity;
import com.aksi.domain.user.entity.UserEntity;
import com.aksi.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для управління життєвим циклом Order Wizard State Machine
 *
 * Керує створенням, зберіганням та взаємодією з екземплярами State Machine
 * для кожного активного Order Wizard
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderWizardStateMachineService {

    private final StateMachineFactory<OrderState, OrderEvent> stateMachineFactory;
    private final OrderWizardPersistenceService persistenceService;
    private final UserRepository userRepository;

    // Зберігаємо активні State Machine за wizardId (тимчасово в пам'яті)
    private final Map<String, StateMachine<OrderState, OrderEvent>> activeWizards = new ConcurrentHashMap<>();

    /**
     * Створює новий Order Wizard та ініціалізує State Machine
     */
    public String createNewWizard() {
        log.info("Створення нового Order Wizard");

        // Отримуємо поточного користувача
        UserEntity user = getCurrentUser();

        StateMachine<OrderState, OrderEvent> stateMachine = stateMachineFactory.getStateMachine();

        // Додаємо детальний listener для цього wizard
        stateMachine.addStateListener(createWizardListener());

        // Використовуємо новий API для запуску State Machine
        stateMachine.startReactively().block();

        // Надсилаємо початкову подію для ініціалізації
        boolean started = stateMachine
            .sendEvent(Mono.just(MessageBuilder.withPayload(OrderEvent.START_ORDER).build()))
            .blockFirst() != null;

        if (started) {
            // Отримуємо згенерований wizardId з контексту
            String wizardId = (String) stateMachine.getExtendedState()
                .getVariables().get("wizardId");

            if (wizardId != null) {
                // Зберігаємо сесію в БД
                OrderWizardSessionEntity session = persistenceService.createWizardSession(wizardId, user);

                // Зберігаємо початкові дані wizard
                Map<Object, Object> extendedState = stateMachine.getExtendedState().getVariables();
                for (Map.Entry<Object, Object> entry : extendedState.entrySet()) {
                    if (entry.getKey() instanceof String key) {
                        persistenceService.saveWizardData(wizardId, key, entry.getValue(), 1, 1);
                    }
                }

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
     * Створює listener для детального логування переходів wizard
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
     * Отримує поточний стан wizard за ID
     */
    public OrderState getCurrentState(String wizardId) {
        StateMachine<OrderState, OrderEvent> stateMachine = getStateMachine(wizardId);
        return stateMachine.getState().getId();
    }

    /**
     * Отримує всі дані wizard за ID
     */
    public Map<Object, Object> getWizardData(String wizardId) {
        StateMachine<OrderState, OrderEvent> stateMachine = getStateMachine(wizardId);
        return stateMachine.getExtendedState().getVariables();
    }

    /**
     * Надсилає подію до wizard з додатковими даними
     */
    public boolean sendEvent(String wizardId, OrderEvent event, Map<String, Object> eventData) {
        log.info("Надсилання події {} до wizard: {}", event, wizardId);

        StateMachine<OrderState, OrderEvent> stateMachine = getStateMachine(wizardId);

        // Створюємо повідомлення з даними
        MessageBuilder<OrderEvent> messageBuilder = MessageBuilder.withPayload(event);

        if (eventData != null && !eventData.isEmpty()) {
            eventData.forEach(messageBuilder::setHeader);
        }

        boolean result = stateMachine
            .sendEvent(Mono.just(messageBuilder.build()))
            .blockFirst() != null;

        if (result) {
            log.info("Подія {} успішно оброблена для wizard: {}", event, wizardId);
        } else {
            log.warn("Подія {} не прийнята для wizard: {} в стані {}",
                event, wizardId, stateMachine.getState().getId());
        }

        return result;
    }

    /**
     * Надсилає подію без додаткових даних
     */
    public boolean sendEvent(String wizardId, OrderEvent event) {
        return sendEvent(wizardId, event, null);
    }

    /**
     * Закриває wizard та очищає ресурси
     */
    public void closeWizard(String wizardId) {
        log.info("Закриття Order Wizard: {}", wizardId);

        StateMachine<OrderState, OrderEvent> stateMachine = activeWizards.remove(wizardId);

        if (stateMachine != null) {
            stateMachine.stopReactively().block();
            log.info("Order Wizard {} успішно закрито", wizardId);
        } else {
            log.warn("Order Wizard {} не знайдено серед активних", wizardId);
        }
    }

    /**
     * Отримує список всіх активних wizards
     */
    public Map<String, OrderState> getActiveWizards() {
        Map<String, OrderState> result = new ConcurrentHashMap<>();

        activeWizards.forEach((wizardId, stateMachine) -> {
            result.put(wizardId, stateMachine.getState().getId());
        });

        return result;
    }

    /**
     * Перевіряє, чи можна виконати певну подію в поточному стані
     */
    public boolean canSendEvent(String wizardId, OrderEvent event) {
        try {
            StateMachine<OrderState, OrderEvent> stateMachine = getStateMachine(wizardId);
            // Тут можна додати логіку перевірки доступних переходів
            return stateMachine.getState() != null;
        } catch (Exception e) {
            log.warn("Не вдалося перевірити можливість події {} для wizard: {}", event, wizardId);
            return false;
        }
    }

    /**
     * Внутрішній метод для отримання State Machine за wizardId
     */
    private StateMachine<OrderState, OrderEvent> getStateMachine(String wizardId) {
        StateMachine<OrderState, OrderEvent> stateMachine = activeWizards.get(wizardId);

        if (stateMachine == null) {
            throw new IllegalArgumentException("Order Wizard з ID " + wizardId + " не знайдено");
        }

        return stateMachine;
    }

    /**
     * Отримує поточного користувача з Security Context
     */
    private UserEntity getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        log.debug("Поточний користувач з Security Context: {}", username);

        return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Користувач не знайдений: " + username));
    }
}
