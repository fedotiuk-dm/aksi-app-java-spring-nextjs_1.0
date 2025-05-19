package com.aksi.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Виняток для ресурсу або сутності, яку не знайдено.
 *
 * <p>Використовується для всіх випадків, коли запитаний ресурс або сутність не існує.
 * Заміняє собою клас EntityNotFoundException, щоб уніфікувати обробку 404 помилок.</p>
 *
 * <p>Приклади використання:</p>
 * <pre>
 * // Для сутностей з бази даних
 * User user = userRepo.findById(id)
 *     .orElseThrow(() -> new ResourceNotFoundException("Користувача з ID " + id + " не знайдено"));
 *
 * // Для будь-яких інших ресурсів
 * if (resource == null) {
 *     throw new ResourceNotFoundException("Ресурс '" + resourceName + "' не знайдено");
 * }
 * </pre>
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * Створює виняток для типового повідомлення про відсутність сутності за ID.
     *
     * @param entityName назва сутності (напр. "Клієнт", "Замовлення")
     * @param id ідентифікатор сутності
     * @return новий виняток з типовим повідомленням
     */
    public static ResourceNotFoundException forEntity(String entityName, Object id) {
        return new ResourceNotFoundException(entityName + " з ID " + id + " не знайдено");
    }
}
