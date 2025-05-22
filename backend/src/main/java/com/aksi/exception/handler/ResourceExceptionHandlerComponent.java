package com.aksi.exception.handler;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import com.aksi.application.dto.common.ErrorResponse;
import com.aksi.exception.BadRequestException;
import com.aksi.exception.DuplicateResourceException;
import com.aksi.exception.EntityNotFoundException;
import com.aksi.exception.ResourceNotFoundException;
import com.aksi.exception.UserAlreadyExistsException;

import lombok.extern.slf4j.Slf4j;

/**
 * Компонент для обробки помилок пов'язаних з ресурсами.
 */
@Component
@Slf4j
public class ResourceExceptionHandlerComponent extends AbstractExceptionHandlerComponent {

    /**
     * Конструктор з ініціалізацією підтримуваних типів винятків.
     */
    public ResourceExceptionHandlerComponent() {
        super(
            EntityNotFoundException.class,
            ResourceNotFoundException.class,
            BadRequestException.class,
            UserAlreadyExistsException.class,
            DuplicateResourceException.class,
            IllegalArgumentException.class
        );
    }

    @Override
    public int getOrder() {
        return 200;
    }

    /**
     * Обробка помилки відсутності сутності.
     *
     * @param ex виняток відсутності сутності
     * @return відповідь з помилкою
     */
    public ErrorResponse handleEntityNotFoundException(EntityNotFoundException ex) {
        return handleStandardException(ex, HttpStatus.NOT_FOUND, "Сутність не знайдено");
    }

    /**
     * Обробка помилки відсутності ресурсу.
     *
     * @param ex виняток відсутності ресурсу
     * @return відповідь з помилкою
     */
    public ErrorResponse handleResourceNotFoundException(ResourceNotFoundException ex) {
        return handleStandardException(ex, HttpStatus.NOT_FOUND, "Ресурс не знайдено");
    }

    /**
     * Обробка помилки некоректного запиту.
     *
     * @param ex виняток некоректного запиту
     * @return відповідь з помилкою
     */
    public ErrorResponse handleBadRequestException(BadRequestException ex) {
        return handleStandardException(ex, HttpStatus.BAD_REQUEST, "Некоректний запит");
    }

    /**
     * Обробка помилки дублювання користувача.
     *
     * @param ex виняток дублювання користувача
     * @return відповідь з помилкою
     */
    public ErrorResponse handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        return handleStandardException(ex, HttpStatus.CONFLICT, "Користувач вже існує");
    }

    /**
     * Обробка помилки дублювання ресурсу.
     *
     * @param ex виняток дублювання ресурсу
     * @return відповідь з помилкою
     */
    public ErrorResponse handleDuplicateResourceException(DuplicateResourceException ex) {
        return handleStandardException(ex, HttpStatus.CONFLICT, "Ресурс вже існує");
    }

    /**
     * Обробка помилки некоректних аргументів.
     *
     * @param ex виняток некоректних аргументів
     * @return відповідь з помилкою
     */
    public ErrorResponse handleIllegalArgumentException(IllegalArgumentException ex) {
        return handleStandardException(ex, HttpStatus.BAD_REQUEST, "Некоректні дані");
    }

    /**
     * Загальний метод для обробки стандартних винятків.
     *
     * @param ex виняток
     * @param status HTTP статус
     * @param logMessage повідомлення для журналу
     * @return відповідь з помилкою
     */
    private ErrorResponse handleStandardException(Exception ex, HttpStatus status, String logMessage) {
        String errorId = generateErrorId();
        setMDC(errorId, status);

        logException(logMessage, ex);

        ErrorResponse response = createErrorResponse(
            status,
            ex.getMessage(),
            ex,
            errorId
        );

        clearMDC();
        return response;
    }
}
