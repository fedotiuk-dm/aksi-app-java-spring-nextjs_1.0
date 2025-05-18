package com.aksi.api;

import java.io.UnsupportedEncodingException;
import java.nio.charset.IllegalCharsetNameException;
import java.nio.charset.UnsupportedCharsetException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.WebUtils;

import com.aksi.application.dto.common.ErrorResponse;
import com.aksi.exception.AuthenticationException;
import com.aksi.exception.BadRequestException;
import com.aksi.exception.EntityNotFoundException;
import com.aksi.exception.ResourceNotFoundException;
import com.aksi.exception.UserAlreadyExistsException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Глобальний обробник винятків для API
 * Забезпечує уніфікований формат відповіді на помилки для фронтенду
 */
@RestControllerAdvice
@Slf4j
@RequiredArgsConstructor
public class GlobalExceptionHandler {
    private final Environment environment;
    private final HttpServletRequest request;
    
    @Value("${spring.profiles.active:production}")
    private String activeProfile;
    
    /**
     * Обробка помилок валідації полів
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorId = generateErrorId();
        setMDC(errorId, HttpStatus.BAD_REQUEST);
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        logException("Помилка валідації", ex);
        
        return createErrorResponse(
            HttpStatus.BAD_REQUEST, 
            "Помилка валідації даних", 
            ex,
            errors,
            errorId
        );
    }
    
    /**
     * Обробка помилок порушення обмежень
     */
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleConstraintViolation(ConstraintViolationException ex) {
        String errorId = generateErrorId();
        setMDC(errorId, HttpStatus.BAD_REQUEST);
        
        Map<String, String> errors = ex.getConstraintViolations().stream()
                .collect(Collectors.toMap(
                        this::getPath,
                        ConstraintViolation::getMessage,
                        (error1, error2) -> error1
                ));
        
        logException("Помилка валідації обмежень", ex);
        
        return createErrorResponse(
            HttpStatus.BAD_REQUEST, 
            "Помилка валідації даних", 
            ex,
            errors,
            errorId
        );
    }
    
    private String getPath(ConstraintViolation<?> violation) {
        return violation.getPropertyPath().toString();
    }
    
    /**
     * Обробка помилки відсутності сутності
     */
    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleEntityNotFoundException(EntityNotFoundException ex) {
        String errorId = generateErrorId();
        setMDC(errorId, HttpStatus.NOT_FOUND);
        
        logException("Сутність не знайдено", ex);
        return createErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage(), ex, errorId);
    }
    
    /**
     * Обробка помилки дублікату користувача
     */
    @ExceptionHandler(UserAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        String errorId = generateErrorId();
        setMDC(errorId, HttpStatus.CONFLICT);
        
        logException("Спроба створити дублікат користувача", ex);
        return createErrorResponse(HttpStatus.CONFLICT, ex.getMessage(), ex, errorId);
    }
    
    /**
     * Обробка помилки автентифікації
     */
    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleAuthenticationException(AuthenticationException ex) {
        String errorId = generateErrorId();
        setMDC(errorId, HttpStatus.UNAUTHORIZED);
        
        logException("Помилка автентифікації", ex);
        return createErrorResponse(HttpStatus.UNAUTHORIZED, ex.getMessage(), ex, errorId);
    }
    
    /**
     * Обробка помилки доступу
     */
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleAccessDeniedException(AccessDeniedException ex) {
        String errorId = generateErrorId();
        setMDC(errorId, HttpStatus.FORBIDDEN);
        
        logException("Доступ заборонено", ex);
        return createErrorResponse(HttpStatus.FORBIDDEN, "Доступ заборонено", ex, errorId);
    }
    
    /**
     * Обробка Resource Not Found помилок
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleResourceNotFoundException(ResourceNotFoundException ex) {
        String errorId = generateErrorId();
        setMDC(errorId, HttpStatus.NOT_FOUND);
        
        logException("Ресурс не знайдено", ex);
        return createErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage(), ex, errorId);
    }
    
    /**
     * Обробка Bad Request помилок
     */
    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleBadRequestException(BadRequestException ex) {
        String errorId = generateErrorId();
        setMDC(errorId, HttpStatus.BAD_REQUEST);
        
        logException("Некоректний запит", ex);
        return createErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), ex, errorId);
    }
    
    /**
     * Обробка будь-яких інших помилок
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String errorId = generateErrorId();
        setMDC(errorId, status);
        
        // Розширене логування для діагностики 500 помилок
        log.error("Внутрішня помилка сервера для запиту {} {}", request.getMethod(), request.getRequestURI(), ex);
        
        // Додаткове логування класу, що викликав помилку
        logCallerInfo(ex);
        
        // Логування запиту для діагностики
        logRequestDetails();
        
        // Логування причини помилки, якщо вона є
        logCauseIfPresent(ex);
        
        ErrorResponse errorResponse = createErrorResponse(
            status, 
            "Внутрішня помилка сервера", 
            ex,
            errorId
        );
        
        // Додаємо стек трейс тільки для dev середовища
        if (isDevelopmentEnvironment()) {
            addStackTraceToResponse(ex, errorResponse);
        }
        
        // Очистка MDC
        clearMDC();
        
        return ResponseEntity
                .status(status)
                .body(errorResponse);
    }
    
    /**
     * Обробка помилки некоректних даних
     */
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleIllegalArgumentException(IllegalArgumentException ex) {
        String errorId = generateErrorId();
        setMDC(errorId, HttpStatus.BAD_REQUEST);
        
        logException("Помилка некоректних даних", ex);
        return createErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), ex, errorId);
    }
    
    /**
     * Обробляє помилки перетворення типів аргументів методу, включаючи невалідні UUID
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> handleMethodArgumentTypeMismatch(
            MethodArgumentTypeMismatchException ex) {
        String errorId = generateErrorId();
        setMDC(errorId, HttpStatus.BAD_REQUEST);
        
        String paramName = ex.getName();
        String errorMessage;
        
        // Перевіряємо, чи це помилка перетворення UUID
        Class<?> requiredType = ex.getRequiredType();
        if (requiredType != null && "UUID".equals(requiredType.getSimpleName())) {
            errorMessage = String.format(
                "Параметр '%s' має бути валідним UUID у форматі 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'",
                paramName);
            log.warn("Помилка перетворення UUID для запиту {} {}: параметр={}, значення={}", 
                request.getMethod(), request.getRequestURI(), paramName, ex.getValue(), ex);
        } else {
            errorMessage = String.format(
                "Параметр '%s' має недопустимий формат", 
                paramName);
            log.warn("Загальна помилка перетворення типу для запиту {} {}: параметр={}, значення={}", 
                request.getMethod(), request.getRequestURI(), paramName, ex.getValue(), ex);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "error");
        response.put("code", "INVALID_ARGUMENT");
        response.put("message", errorMessage);
        response.put("path", paramName);
        response.put("errorId", errorId);
        response.put("statusCode", HttpStatus.BAD_REQUEST.value());
        response.put("uri", request.getRequestURI());
        response.put("method", request.getMethod());
        
        // Очистка MDC
        clearMDC();
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    
    /**
     * Логування повідомлення про виняток зі стандартною інформацією про запит
     */
    private void logException(String message, Exception ex) {
        log.warn("{} для запиту {} {}", message, request.getMethod(), request.getRequestURI(), ex);
    }
    
    /**
     * Встановлює контекст MDC для збору діагностичної інформації
     */
    private void setMDC(String errorId, HttpStatus status) {
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
     * Очищає MDC після обробки помилки
     */
    private void clearMDC() {
        MDC.clear();
    }
    
    /**
     * Логування деталей запиту для кращої діагностики
     */
    private void logRequestDetails() {
        StringBuilder sb = new StringBuilder();
        sb.append("Деталі запиту:\n")
          .append("  URI: ").append(request.getRequestURI()).append("\n")
          .append("  Method: ").append(request.getMethod()).append("\n")
          .append("  Query: ").append(request.getQueryString()).append("\n")
          .append("  Remote IP: ").append(request.getRemoteAddr()).append("\n")
          .append("  User-Agent: ").append(request.getHeader("User-Agent")).append("\n");
        
        // Логування параметрів запиту
        Map<String, String[]> params = request.getParameterMap();
        if (!params.isEmpty()) {
            sb.append("  Параметри запиту:\n");
            params.forEach((key, values) -> {
                sb.append("    ").append(key).append(": ");
                if (values != null && values.length > 0) {
                    sb.append(String.join(", ", values));
                }
                sb.append("\n");
            });
        }
        
        // Спроба отримати тіло запиту (якщо можливо)
        ContentCachingRequestWrapper wrapper = WebUtils.getNativeRequest(request, ContentCachingRequestWrapper.class);
        if (wrapper != null) {
            byte[] buf = wrapper.getContentAsByteArray();
            if (buf.length > 0) {
                String payload;
                try {
                    payload = new String(buf, 0, buf.length, wrapper.getCharacterEncoding());
                } catch (UnsupportedEncodingException | IllegalCharsetNameException | UnsupportedCharsetException e) {
                    // Конкретні винятки для кодування символів
                    payload = "[неможливо прочитати тіло запиту: помилка кодування]";
                    log.warn("Помилка при декодуванні тіла запиту", e);
                } catch (RuntimeException e) {
                    // Інші можливі винятки під час обробки тіла
                    payload = "[неможливо прочитати тіло запиту: " + e.getMessage() + "]";
                    log.warn("Помилка при обробці тіла запиту", e);
                }
                sb.append("  Тіло запиту: ").append(payload).append("\n");
            }
        }
        
        log.error(sb.toString());
    }
    
    /**
     * Логування інформації про клас, який викликав помилку
     */
    private void logCallerInfo(Exception ex) {
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
     * Логування причини помилки, якщо вона є
     */
    private void logCauseIfPresent(Exception ex) {
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
     * Створення уніфікованої відповіді про помилку
     */
    private ErrorResponse createErrorResponse(HttpStatus status, String message, Exception ex, String errorId) {
        return createErrorResponse(status, message, ex, null, errorId);
    }
    
    /**
     * Створення уніфікованої відповіді про помилку з детальними помилками
     */
    private ErrorResponse createErrorResponse(HttpStatus status, String message, Exception ex, Map<String, String> errors, String errorId) {
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
     * Перевірка, чи це середовище розробки
     */
    private boolean isDevelopmentEnvironment() {
        return Arrays.asList(environment.getActiveProfiles()).contains("dev") || 
               "dev".equals(activeProfile) ||
               Arrays.asList(environment.getActiveProfiles()).contains("development") ||
               "development".equals(activeProfile) ||
               Arrays.asList(environment.getActiveProfiles()).contains("local") ||
               "local".equals(activeProfile);
    }
    
    /**
     * Генерація унікального ідентифікатора помилки
     */
    private String generateErrorId() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
    
    /**
     * Додавання стеку помилки до відповіді (тільки для dev середовища)
     */
    private void addStackTraceToResponse(Exception ex, ErrorResponse errorResponse) {
        StackTraceElement[] stackTrace = ex.getStackTrace();
        
        // Додаємо інформацію про виняток
        errorResponse.addStackTraceLine("Exception: " + ex.getClass().getName() + ": " + ex.getMessage());
        
        // Додаємо стектрейс
        int maxStackTraceLines = Math.min(stackTrace.length, 15); // Збільшуємо кількість рядків
        
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
        
        while (cause != null && depth < 3) { // Обмежуємо глибину вкладених причин
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
