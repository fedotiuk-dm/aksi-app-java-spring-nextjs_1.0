package com.aksi.config;

import java.util.Map;
import java.util.concurrent.Executor;

import org.slf4j.MDC;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskDecorator;
import org.springframework.lang.NonNull;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

/**
 * Configuration for asynchronous task execution with MDC context propagation.
 * Ensures that MDC context (correlation IDs, trace IDs, etc.) is preserved
 * when executing tasks in separate threads.
 */
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {

    /**
     * Task decorator that propagates MDC context to child threads.
     */
    @Bean
    public TaskDecorator mdcTaskDecorator() {
        return new MdcTaskDecorator();
    }

    /**
     * Custom thread pool executor with MDC support.
     */
    @Bean(name = "taskExecutor")
    public ThreadPoolTaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(20);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("async-");
        executor.setTaskDecorator(mdcTaskDecorator());
        executor.initialize();
        return executor;
    }

    /**
     * Default async executor with MDC support.
     */
    @Override
    public @NonNull Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(3);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("spring-async-");
        executor.setTaskDecorator(mdcTaskDecorator());
        executor.initialize();
        return executor;
    }

    /**
     * Task decorator implementation that copies MDC context.
     */
    public static class MdcTaskDecorator implements TaskDecorator {

        @Override
        public @NonNull Runnable decorate(@NonNull Runnable runnable) {
            // Capture current MDC context
            Map<String, String> contextMap = MDC.getCopyOfContextMap();

            return () -> {
                // Set MDC context in child thread
                if (contextMap != null) {
                    MDC.setContextMap(contextMap);
                }

                try {
                    // Execute the original task
                    runnable.run();
                } finally {
                    // Always clear MDC to prevent memory leaks
                    MDC.clear();
                }
            };
        }
    }
}
