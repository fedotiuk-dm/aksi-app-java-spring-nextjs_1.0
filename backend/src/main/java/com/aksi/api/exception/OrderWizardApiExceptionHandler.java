package com.aksi.api.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

/**
 * Централізований обробник помилок для Order Wizard API.
 *
 * Забезпечує структуровану обробку всіх типів помилок з:
 * - Логуванням помилок
 * - Структурованими JSON відповідями
 * - Контекстною інформацією
 * - Безпечними повідомленнями для клієнта
 */
@RestControllerAdvice(basePackages = "com.aksi.api")
public class OrderWizardApiExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(OrderWizardApiExceptionHandler.class);

    /**
     * Обробка базових Order Wizard API exceptions
     */
    @ExceptionHandler(OrderWizardApiException.class)
    public ResponseEntity<ApiErrorResponse> handleOrderWizardApiException(
            OrderWizardApiException ex, WebRequest request) {

        log.error("Order Wizard API Exception: {}", ex.getMessage(), ex);

        ApiErrorResponse errorResponse = ApiErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(ex.getHttpStatus().value())
            .error(ex.getHttpStatus().getReasonPhrase())
            .message(ex.getMessage())
            .errorCode(ex.getErrorCode())
            .stage(ex.getStage())
            .substep(ex.getSubstep())
            .path(extractPath(request))
            .errorDetails(ex.getErrorDetails())
            .build();

        return new ResponseEntity<>(errorResponse, ex.getHttpStatus());
    }

    /**
     * Обробка валідаційних помилок Order Wizard
     */
    @ExceptionHandler(OrderWizardValidationException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationException(
            OrderWizardValidationException ex, WebRequest request) {

        log.warn("Order Wizard Validation Exception: {}", ex.getMessage());

        ValidationErrorResponse errorResponse = ValidationErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error("Validation Error")
            .message(ex.getMessage())
            .errorCode(ex.getErrorCode())
            .stage(ex.getStage())
            .substep(ex.getSubstep())
            .path(extractPath(request))
            .fieldErrors(ex.getFieldErrors())
            .validationErrors(ex.getValidationErrors())
            .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Обробка стандартних Spring валідаційних помилок
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, WebRequest request) {

        log.warn("Method Argument Not Valid: {}", ex.getMessage());

        Map<String, Object> fieldErrors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .collect(Collectors.toMap(
                error -> error.getField(),
                error -> error.getDefaultMessage(),
                (existing, replacement) -> existing,
                LinkedHashMap::new
            ));

        ValidationErrorResponse errorResponse = ValidationErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error("Validation Error")
            .message("Помилки валідації полів")
            .errorCode("VALIDATION_ERROR")
            .path(extractPath(request))
            .fieldErrors(fieldErrors)
            .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Обробка загальних runtime exceptions
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiErrorResponse> handleRuntimeException(
            RuntimeException ex, WebRequest request) {

        log.error("Unexpected Runtime Exception: {}", ex.getMessage(), ex);

        ApiErrorResponse errorResponse = ApiErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .error("Internal Server Error")
            .message("Внутрішня помилка сервера. Спробуйте пізніше.")
            .errorCode("INTERNAL_ERROR")
            .path(extractPath(request))
            .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Обробка загальних exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(
            Exception ex, WebRequest request) {

        log.error("Unexpected Exception: {}", ex.getMessage(), ex);

        ApiErrorResponse errorResponse = ApiErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .error("Internal Server Error")
            .message("Непередбачена помилка сервера")
            .errorCode("UNEXPECTED_ERROR")
            .path(extractPath(request))
            .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Обробка помилок стейт машини Order Wizard
     */
    @ExceptionHandler(OrderWizardStateMachineException.class)
    public ResponseEntity<StateMachineErrorResponse> handleStateMachineException(
            OrderWizardStateMachineException ex, WebRequest request) {

        log.error("Order Wizard State Machine Exception: {}", ex.getMessage());

        StateMachineErrorResponse errorResponse = StateMachineErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(ex.getHttpStatus().value())
            .error("State Machine Error")
            .message(ex.getMessage())
            .errorCode(ex.getErrorCode())
            .stage(ex.getStage())
            .substep(ex.getSubstep())
            .path(extractPath(request))
            .currentState(ex.getCurrentState())
            .targetState(ex.getTargetState())
            .event(ex.getEvent())
            .stateMachineId(ex.getStateMachineId())
            .stateMachineDetails(ex.getStateMachineDetails())
            .build();

        return new ResponseEntity<>(errorResponse, ex.getHttpStatus());
    }

    /**
     * Витягує шлях з WebRequest
     */
    private String extractPath(WebRequest request) {
        return request.getDescription(false).replace("uri=", "");
    }

    /**
     * Базова структура відповіді з помилкою
     */
    public static class ApiErrorResponse {
        protected LocalDateTime timestamp;
        protected int status;
        protected String error;
        protected String message;
        protected String errorCode;
        protected String stage;
        protected String substep;
        protected String path;
        protected Object errorDetails;

        // Builder pattern
        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private final ApiErrorResponse response = new ApiErrorResponse();

            public Builder timestamp(LocalDateTime timestamp) {
                response.timestamp = timestamp;
                return this;
            }

            public Builder status(int status) {
                response.status = status;
                return this;
            }

            public Builder error(String error) {
                response.error = error;
                return this;
            }

            public Builder message(String message) {
                response.message = message;
                return this;
            }

            public Builder errorCode(String errorCode) {
                response.errorCode = errorCode;
                return this;
            }

            public Builder stage(String stage) {
                response.stage = stage;
                return this;
            }

            public Builder substep(String substep) {
                response.substep = substep;
                return this;
            }

            public Builder path(String path) {
                response.path = path;
                return this;
            }

            public Builder errorDetails(Object errorDetails) {
                response.errorDetails = errorDetails;
                return this;
            }

            public ApiErrorResponse build() {
                return response;
            }
        }

        // Getters
        public LocalDateTime getTimestamp() { return timestamp; }
        public int getStatus() { return status; }
        public String getError() { return error; }
        public String getMessage() { return message; }
        public String getErrorCode() { return errorCode; }
        public String getStage() { return stage; }
        public String getSubstep() { return substep; }
        public String getPath() { return path; }
        public Object getErrorDetails() { return errorDetails; }
    }

    /**
     * Розширена структура для валідаційних помилок
     */
    public static class ValidationErrorResponse extends ApiErrorResponse {
        private Map<String, Object> fieldErrors;
        private Object validationErrors;

        public static ValidationBuilder builder() {
            return new ValidationBuilder();
        }

        public static class ValidationBuilder extends ApiErrorResponse.Builder {
            private final ValidationErrorResponse response = new ValidationErrorResponse();

            @Override
            public ValidationBuilder timestamp(LocalDateTime timestamp) {
                response.timestamp = timestamp;
                return this;
            }

            @Override
            public ValidationBuilder status(int status) {
                response.status = status;
                return this;
            }

            @Override
            public ValidationBuilder error(String error) {
                response.error = error;
                return this;
            }

            @Override
            public ValidationBuilder message(String message) {
                response.message = message;
                return this;
            }

            @Override
            public ValidationBuilder errorCode(String errorCode) {
                response.errorCode = errorCode;
                return this;
            }

            @Override
            public ValidationBuilder stage(String stage) {
                response.stage = stage;
                return this;
            }

            @Override
            public ValidationBuilder substep(String substep) {
                response.substep = substep;
                return this;
            }

            @Override
            public ValidationBuilder path(String path) {
                response.path = path;
                return this;
            }

            public ValidationBuilder fieldErrors(Map<String, Object> fieldErrors) {
                response.fieldErrors = fieldErrors;
                return this;
            }

            public ValidationBuilder validationErrors(Object validationErrors) {
                response.validationErrors = validationErrors;
                return this;
            }

            @Override
            public ValidationErrorResponse build() {
                return response;
            }
        }

        // Getters
        public Map<String, Object> getFieldErrors() { return fieldErrors; }
        public Object getValidationErrors() { return validationErrors; }
    }

    /**
     * Розширена структура для помилок стейт машини
     */
    public static class StateMachineErrorResponse extends ApiErrorResponse {
        private String currentState;
        private String targetState;
        private String event;
        private String stateMachineId;
        private Object stateMachineDetails;

        public static StateMachineBuilder builder() {
            return new StateMachineBuilder();
        }

        public static class StateMachineBuilder extends ApiErrorResponse.Builder {
            private final StateMachineErrorResponse response = new StateMachineErrorResponse();

            @Override
            public StateMachineBuilder timestamp(LocalDateTime timestamp) {
                response.timestamp = timestamp;
                return this;
            }

            @Override
            public StateMachineBuilder status(int status) {
                response.status = status;
                return this;
            }

            @Override
            public StateMachineBuilder error(String error) {
                response.error = error;
                return this;
            }

            @Override
            public StateMachineBuilder message(String message) {
                response.message = message;
                return this;
            }

            @Override
            public StateMachineBuilder errorCode(String errorCode) {
                response.errorCode = errorCode;
                return this;
            }

            @Override
            public StateMachineBuilder stage(String stage) {
                response.stage = stage;
                return this;
            }

            @Override
            public StateMachineBuilder substep(String substep) {
                response.substep = substep;
                return this;
            }

            @Override
            public StateMachineBuilder path(String path) {
                response.path = path;
                return this;
            }

            public StateMachineBuilder currentState(String currentState) {
                response.currentState = currentState;
                return this;
            }

            public StateMachineBuilder targetState(String targetState) {
                response.targetState = targetState;
                return this;
            }

            public StateMachineBuilder event(String event) {
                response.event = event;
                return this;
            }

            public StateMachineBuilder stateMachineId(String stateMachineId) {
                response.stateMachineId = stateMachineId;
                return this;
            }

            public StateMachineBuilder stateMachineDetails(Object stateMachineDetails) {
                response.stateMachineDetails = stateMachineDetails;
                return this;
            }

            @Override
            public StateMachineErrorResponse build() {
                return response;
            }
        }

        // Getters
        public String getCurrentState() { return currentState; }
        public String getTargetState() { return targetState; }
        public String getEvent() { return event; }
        public String getStateMachineId() { return stateMachineId; }
        public Object getStateMachineDetails() { return stateMachineDetails; }
    }
}
