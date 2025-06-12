package com.aksi.domain.order.statemachine.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.StateMachineContext;
import org.springframework.statemachine.StateMachinePersist;
import org.springframework.statemachine.config.StateMachineFactory;
import org.springframework.statemachine.persist.DefaultStateMachinePersister;
import org.springframework.statemachine.service.DefaultStateMachineService;
import org.springframework.statemachine.service.StateMachineService;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;

/**
 * Конфігурація StateMachineService для правильного управління життєвим циклом State Machine.
 * Базується на документації Spring State Machine Event Service.
 */
@Configuration
public class StateMachineServiceConfig {

        /**
     * Створює StateMachineService для автоматичного управління життєвим циклом.
     * Замінює ручне управління сесіями через ConcurrentHashMap.
     */
    @Bean
    public StateMachineService<OrderState, OrderEvent> stateMachineService(
            StateMachineFactory<OrderState, OrderEvent> stateMachineFactory) {

        return new DefaultStateMachineService<>(stateMachineFactory);
    }

    /**
     * In-memory персистер для розробки (можна замінити на Redis/JPA для продакшену).
     */
    @Bean
    public StateMachinePersist<OrderState, OrderEvent, String> stateMachinePersist() {
        return new StateMachinePersist<OrderState, OrderEvent, String>() {

            private final java.util.Map<String, StateMachineContext<OrderState, OrderEvent>> storage =
                new java.util.concurrent.ConcurrentHashMap<>();

            @Override
            public void write(StateMachineContext<OrderState, OrderEvent> context, String contextObj)
                    throws Exception {
                storage.put(contextObj, context);
            }

            @Override
            public StateMachineContext<OrderState, OrderEvent> read(String contextObj) throws Exception {
                return storage.get(contextObj);
            }
        };
    }

    /**
     * Персистер для збереження та відновлення стану State Machine.
     */
    @Bean
    public DefaultStateMachinePersister<OrderState, OrderEvent, String> stateMachinePersister(
            StateMachinePersist<OrderState, OrderEvent, String> stateMachinePersist) {

        return new DefaultStateMachinePersister<>(stateMachinePersist);
    }
}
