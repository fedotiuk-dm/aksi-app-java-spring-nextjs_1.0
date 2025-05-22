package com.aksi.exception.handler;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.aksi.application.dto.common.ErrorResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Менеджер компонентів обробки винятків.
 * Відповідає за вибір відповідного компонента та делегування обробки винятку.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ExceptionHandlerComponentsManager {

    private final List<ExceptionHandlerComponent> handlerComponents;

    /**
     * Обробляє виняток, делегуючи його відповідному компоненту.
     *
     * @param ex виняток для обробки
     * @return відповідь з помилкою або null, якщо обробник не знайдено
     */
    public ErrorResponse handleException(Exception ex) {
        Class<? extends Exception> exceptionClass = ex.getClass();

        // Знаходимо відповідний компонент для обробки винятку
        Optional<ExceptionHandlerComponent> handlerOpt = handlerComponents.stream()
                .filter(handler -> handler.canHandle(exceptionClass))
                .min(Comparator.comparing(ExceptionHandlerComponent::getOrder));

        if (handlerOpt.isPresent()) {
            ExceptionHandlerComponent handler = handlerOpt.get();
            try {
                // Шукаємо метод, який може обробити цей виняток
                Method handlerMethod = findHandlerMethod(handler, exceptionClass);

                if (handlerMethod != null) {
                    log.debug("Знайдено обробник {} для винятку {}", handler.getClass().getSimpleName(), exceptionClass.getSimpleName());
                    // Викликаємо метод обробки
                    return (ErrorResponse) handlerMethod.invoke(handler, ex);
                }
            } catch (IllegalAccessException | IllegalArgumentException e) {
                log.error("Помилка доступу або неправильні аргументи при виклику обробника", e);
            } catch (InvocationTargetException e) {
                log.error("Виняток в методі обробника винятків", e.getTargetException());
            } catch (NullPointerException e) {
                log.error("Null reference при виклику обробника винятків", e);
            }
        }

        // Якщо відповідний обробник не знайдено або сталася помилка,
        // шукаємо компонент для обробки загальних винятків
        try {
            Optional<ExceptionHandlerComponent> technicalHandlerOpt = handlerComponents.stream()
                    .filter(handler -> handler.canHandle(Exception.class))
                    .findFirst();

            if (technicalHandlerOpt.isPresent()) {
                TechnicalExceptionHandlerComponent technicalHandler = (TechnicalExceptionHandlerComponent) technicalHandlerOpt.get();
                log.debug("Використовуємо загальний обробник для винятку {}", exceptionClass.getSimpleName());
                return technicalHandler.handleGenericException(ex);
            }
        } catch (Exception e) {
            log.error("Критична помилка при обробці винятків", e);
        }

        return null;
    }

    /**
     * Знаходить метод обробки винятку в компоненті.
     *
     * @param handler компонент обробки
     * @param exceptionClass клас винятку
     * @return метод для обробки винятку або null, якщо не знайдено
     */
    private Method findHandlerMethod(ExceptionHandlerComponent handler, Class<? extends Exception> exceptionClass) {
        Class<?> handlerClass = handler.getClass();
        Class<?> currentExceptionClass = exceptionClass;

        // Спочатку перевіряємо точну відповідність імені методу
        while (currentExceptionClass != null && Exception.class.isAssignableFrom(currentExceptionClass)) {
            try {
                String methodName = "handle" + currentExceptionClass.getSimpleName();
                Method method = handlerClass.getMethod(methodName, currentExceptionClass);
                if (method.getReturnType().isAssignableFrom(ErrorResponse.class)) {
                    return method;
                }
            } catch (NoSuchMethodException e) {
                // Продовжуємо пошук
            }

            // Перевіряємо інтерфейси
            for (Class<?> iface : currentExceptionClass.getInterfaces()) {
                if (Exception.class.isAssignableFrom(iface)) {
                    try {
                        String methodName = "handle" + iface.getSimpleName();
                        Method method = handlerClass.getMethod(methodName, iface);
                        if (method.getReturnType().isAssignableFrom(ErrorResponse.class)) {
                            return method;
                        }
                    } catch (NoSuchMethodException e) {
                        // Продовжуємо пошук
                    }
                }
            }

            // Переходимо до батьківського класу
            currentExceptionClass = currentExceptionClass.getSuperclass();
        }

        // Якщо точного методу не знайдено, шукаємо метод, який може прийняти цей виняток як параметр
        for (Method method : handlerClass.getMethods()) {
            if (method.getName().startsWith("handle") &&
                method.getParameterCount() == 1 &&
                method.getParameterTypes()[0].isAssignableFrom(exceptionClass) &&
                method.getReturnType().isAssignableFrom(ErrorResponse.class)) {
                return method;
            }
        }

        return null;
    }
}
