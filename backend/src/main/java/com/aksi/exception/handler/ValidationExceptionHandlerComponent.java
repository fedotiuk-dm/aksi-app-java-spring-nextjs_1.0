package com.aksi.exception.handler;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import com.aksi.application.dto.common.ErrorResponse;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;

/**
 * Компонент для обробки помилок валідації.
 */
@Component
@Slf4j
public class ValidationExceptionHandlerComponent extends AbstractExceptionHandlerComponent {

    /**
     * Конструктор з ініціалізацією підтримуваних типів винятків.
     */
    public ValidationExceptionHandlerComponent() {
        super(
            MethodArgumentNotValidException.class,
            ConstraintViolationException.class
        );
    }

    @Override
    public int getOrder() {
        return 100; // Високий пріоритет для помилок валідації
    }

    /**
     * Обробка помилок валідації полів.
     *
     * @param ex виняток валідації
     * @return відповідь з помилками валідації
     */
    public ErrorResponse handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
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
     * Обробка помилок порушення обмежень.
     *
     * @param ex виняток порушення обмежень
     * @return відповідь з помилками валідації
     */
    public ErrorResponse handleConstraintViolationException(ConstraintViolationException ex) {
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
}
