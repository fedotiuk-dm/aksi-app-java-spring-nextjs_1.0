package com.aksi.exception.handler;

import java.io.UnsupportedEncodingException;
import java.nio.charset.IllegalCharsetNameException;
import java.nio.charset.UnsupportedCharsetException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.WebUtils;

import com.aksi.application.dto.common.ErrorResponse;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

/**
 * Абстрактний базовий клас для компонентів обробки винятків.
 * Містить спільну логіку для всіх обробників.
 */
@Slf4j
public abstract class AbstractExceptionHandlerComponent implements ExceptionHandlerComponent {

    @Autowired
    protected Environment environment;

    @Autowired
    protected HttpServletRequest request;

    private final Set<Class<? extends Throwable>> supportedExceptions;

    /**
     * Конструктор для ініціалізації підтримуваних винятків.
     *
     * @param supportedExceptions класи винятків, які підтримуються цим обробником
     */
    @SafeVarargs
    protected AbstractExceptionHandlerComponent(Class<? extends Throwable>... supportedExceptions) {
        this.supportedExceptions = new HashSet<>(Arrays.asList(supportedExceptions));
    }

    @Override
    public boolean canHandle(Class<? extends Throwable> exceptionClass) {
        return supportedExceptions.stream()
                .anyMatch(supported -> supported.isAssignableFrom(exceptionClass));
    }

    /**
     * Генерація унікального ідентифікатора помилки.
     */
    protected String generateErrorId() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    /**
     * Встановлює контекст MDC для збору діагностичної інформації.
     */
    protected void setMDC(String errorId, HttpStatus status) {
        MDC.put("errorId", errorId);
        MDC.put("path", request.getRequestURI());
        MDC.put("method", request.getMethod());
        MDC.put("status", String.valueOf(status.value()));
        MDC.put("remoteAddr", request.getRemoteAddr());
        MDC.put("userAgent", request.getHeader("User-Agent"));

        // Додаємо інформацію про користувача, якщо вона доступна
        Object principal = request.getUserPrincipal();
        if (principal != null) {
            MDC.put("user", principal.toString());
        }
    }

    /**
     * Очищає MDC після обробки помилки.
     */
    protected void clearMDC() {
        MDC.clear();
    }

    /**
     * Логування повідомлення про виняток зі стандартною інформацією про запит.
     */
    protected void logException(String message, Exception ex) {
        log.warn("{} для запиту {} {}", message, request.getMethod(), request.getRequestURI(), ex);
    }

    /**
     * Логування деталей запиту для кращої діагностики.
     */
    protected void logRequestDetails() {
        try {
            StringBuilder logMessage = new StringBuilder("\nЗапит, що спричинив помилку:\n");
            logMessage.append("URL: ").append(request.getMethod()).append(" ").append(request.getRequestURI());

            if (request.getQueryString() != null) {
                logMessage.append("?").append(request.getQueryString());
            }

            logMessage.append("\nHeaders:\n");

            request.getHeaderNames().asIterator().forEachRemaining(headerName -> {
                logMessage.append("  ").append(headerName).append(": ");

                // Маскуємо чутливі заголовки
                if (headerName.toLowerCase().contains("authorization")) {
                    logMessage.append("*****");
                } else {
                    logMessage.append(request.getHeader(headerName));
                }

                logMessage.append("\n");
            });

            // Логуємо тіло запиту, якщо доступне
            ContentCachingRequestWrapper wrapper = WebUtils.getNativeRequest(request, ContentCachingRequestWrapper.class);
            if (wrapper != null) {
                byte[] buf = wrapper.getContentAsByteArray();
                if (buf.length > 0) {
                    String payload;
                    try {
                        payload = new String(buf, 0, buf.length, wrapper.getCharacterEncoding());
                    } catch (UnsupportedEncodingException | IllegalCharsetNameException | UnsupportedCharsetException e) {
                        payload = "[Error reading request body]";
                    }

                    // Обмежуємо розмір тіла запиту для логування
                    int maxLength = 1000;
                    if (payload.length() > maxLength) {
                        payload = payload.substring(0, maxLength) + "... [truncated]";
                    }

                    logMessage.append("Body: ").append(payload);
                }
            }

            log.debug(logMessage.toString());
        } catch (Exception e) {
            log.warn("Помилка при логуванні деталей запиту: {}", e.getMessage());
        }
    }

    /**
     * Логування інформації про клас, який викликав помилку.
     */
    protected void logCallerInfo(Exception ex) {
        StackTraceElement[] stackTrace = ex.getStackTrace();
        if (stackTrace.length > 0) {
            StringBuilder sb = new StringBuilder("Стек помилки:\n");

            // Виводимо першу частину стеку (до 5 елементів)
            int depth = Math.min(stackTrace.length, 5);
            for (int i = 0; i < depth; i++) {
                StackTraceElement element = stackTrace[i];
                sb.append(String.format("  %d) %s.%s(%s:%d)\n",
                    i + 1,
                    element.getClassName(),
                    element.getMethodName(),
                    element.getFileName(),
                    element.getLineNumber()));
            }

            log.error(sb.toString());
        }
    }

    /**
     * Логування причини помилки, якщо вона є.
     */
    protected void logCauseIfPresent(Exception ex) {
        Throwable cause = ex.getCause();
        if (cause != null) {
            StringBuilder sb = new StringBuilder("Причина помилки: ").append(cause.getClass().getName());

            if (cause.getMessage() != null) {
                sb.append(" - ").append(cause.getMessage());
            }

            sb.append("\nСтек причини:\n");
            StackTraceElement[] causeStack = cause.getStackTrace();
            int depth = Math.min(causeStack.length, 5);

            for (int i = 0; i < depth; i++) {
                StackTraceElement element = causeStack[i];
                sb.append(String.format("  %d) %s.%s(%s:%d)\n",
                    i + 1,
                    element.getClassName(),
                    element.getMethodName(),
                    element.getFileName(),
                    element.getLineNumber()));
            }

            log.error(sb.toString());
        }
    }

    /**
     * Створення уніфікованої відповіді про помилку.
     */
    protected ErrorResponse createErrorResponse(HttpStatus status, String message, Exception ex, String errorId) {
        return createErrorResponse(status, message, ex, null, errorId);
    }

    /**
     * Створення уніфікованої відповіді про помилку з детальними помилками.
     */
    protected ErrorResponse createErrorResponse(HttpStatus status, String message, Exception ex, Map<String, String> errors, String errorId) {
        ErrorResponse.ErrorResponseBuilder builder = ErrorResponse.builder()
                .status(status.value())
                .message(message)
                .errorType(ex.getClass().getSimpleName())
                .path(request.getRequestURI())
                .method(request.getMethod())
                .errorId(errorId);

        if (errors != null && !errors.isEmpty()) {
            builder.errors(errors);
        }

        return builder.build();
    }

    /**
     * Перевірка, чи це середовище розробки.
     */
    protected boolean isDevelopmentEnvironment() {
        return Arrays.asList(environment.getActiveProfiles()).contains("dev") ||
               Arrays.asList(environment.getActiveProfiles()).contains("development") ||
               Arrays.asList(environment.getActiveProfiles()).contains("local");
    }

    /**
     * Додавання стеку помилки до відповіді (тільки для dev середовища).
     */
    protected void addStackTraceToResponse(Exception ex, ErrorResponse errorResponse) {
        if (!isDevelopmentEnvironment()) {
            return;
        }

        StackTraceElement[] stackTrace = ex.getStackTrace();

        // Додаємо інформацію про виняток
        errorResponse.addStackTraceLine("Exception: " + ex.getClass().getName() + ": " + ex.getMessage());

        // Додаємо стектрейс
        int maxStackTraceLines = Math.min(stackTrace.length, 15);

        for (int i = 0; i < maxStackTraceLines; i++) {
            StackTraceElement element = stackTrace[i];
            String line = String.format("%s.%s(%s:%d)",
                element.getClassName(),
                element.getMethodName(),
                element.getFileName(),
                element.getLineNumber());
            errorResponse.addStackTraceLine(line);
        }

        // Додаємо інформацію про причину помилки
        Throwable cause = ex.getCause();
        int depth = 0;

        while (cause != null && depth < 3) {
            errorResponse.addStackTraceLine("Caused by: " + cause.getClass().getName() + ": " + cause.getMessage());

            // Додаємо стектрейс причини
            StackTraceElement[] causeStack = cause.getStackTrace();
            int causeLines = Math.min(causeStack.length, 5);

            for (int i = 0; i < causeLines; i++) {
                StackTraceElement element = causeStack[i];
                String line = String.format("    at %s.%s(%s:%d)",
                    element.getClassName(),
                    element.getMethodName(),
                    element.getFileName(),
                    element.getLineNumber());
                errorResponse.addStackTraceLine(line);
            }

            cause = cause.getCause();
            depth++;
        }
    }
}
