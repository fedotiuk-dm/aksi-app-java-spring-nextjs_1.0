# Система обробки винятків

## Архітектура

Система обробки винятків базується на компонентному підході, що відповідає принципам DDD. Вона розділена на наступні частини:

1. **GlobalExceptionHandler** - глобальний обробник, який перехоплює всі винятки в додатку
2. **ExceptionHandlerComponent** - базовий інтерфейс для всіх компонентів обробки винятків
3. **AbstractExceptionHandlerComponent** - абстрактний базовий клас з загальною логікою обробки
4. **Спеціалізовані компоненти** - компоненти для обробки конкретних груп винятків
5. **ExceptionHandlerComponentsManager** - менеджер, який координує роботу компонентів

## Переваги компонентного підходу

1. **Розділення відповідальності** - кожен компонент відповідає за свою групу винятків
2. **Повторне використання коду** - спільна логіка винесена в абстрактний базовий клас
3. **Гнучкість** - можна легко додавати нові компоненти для обробки нових типів винятків
4. **Тестованість** - кожен компонент можна тестувати окремо
5. **Підтримуваність** - легко вносити зміни в обробку окремих типів винятків

## Компоненти

### ValidationExceptionHandlerComponent

Обробляє помилки валідації:

- MethodArgumentNotValidException
- ConstraintViolationException

### SecurityExceptionHandlerComponent

Обробляє помилки безпеки:

- AccessDeniedException
- AuthenticationException

### ResourceExceptionHandlerComponent

Обробляє помилки пов'язані з ресурсами:

- EntityNotFoundException
- ResourceNotFoundException
- BadRequestException
- UserAlreadyExistsException
- DuplicateResourceException
- IllegalArgumentException

### TechnicalExceptionHandlerComponent

Обробляє технічні помилки:

- MethodArgumentTypeMismatchException
- Exception (загальний обробник)

## Як додати новий тип винятку

1. Визначте, до якого компоненту він відноситься (валідація, безпека, ресурси, технічні)
2. Додайте клас винятку до конструктора відповідного компоненту
3. Створіть метод для обробки винятку в компоненті
4. Якщо це принципово новий тип винятку, можна створити новий компонент

## Приклад використання

```java
// Перехоплення винятку
@ExceptionHandler(EntityNotFoundException.class)
@ResponseStatus(HttpStatus.NOT_FOUND)
public ErrorResponse handleEntityNotFoundException(EntityNotFoundException ex) {
    return componentsManager.handleException(ex);
}

// Обробка винятку в компоненті
public ErrorResponse handleEntityNotFoundException(EntityNotFoundException ex) {
    String errorId = generateErrorId();
    setMDC(errorId, HttpStatus.NOT_FOUND);
    logException("Сутність не знайдено", ex);
    return createErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage(), ex, errorId);
}
```
