# Рефакторинг DTO класів для філій (BranchLocation)

## Проблема

У проекті виявлено дублювання коду в класах DTO для роботи з філіями:

- `BranchLocationCreateRequest.java`
- `BranchLocationUpdateRequest.java`

Ці класи мають майже ідентичну структуру - однакові поля з однаковими валідаційними анотаціями, відрізняючись лише налаштуваннями поля `active` (в CreateRequest воно має значення за замовчуванням, в UpdateRequest - ні).

Дублювання призводить до:

- Ускладнення супроводу коду (при зміні валідації чи додаванні нового поля потрібно вносити зміни в обидва класи)
- Підвищення ризику помилок (легко пропустити зміну в одному з класів)
- Збільшення обсягу кодової бази

## План рефакторингу

Створити базовий абстрактний клас, який міститиме всі спільні поля та валідаційні анотації:

### 1. Створити базовий абстрактний клас

```java
package com.aksi.domain.branch.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Базовий клас для запитів, пов'язаних з пунктами прийому замовлень.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseBranchLocationRequest {

    /**
     * Назва пункту прийому.
     */
    @NotBlank(message = "Назва пункту прийому не може бути порожньою")
    private String name;

    /**
     * Адреса пункту прийому.
     */
    @NotBlank(message = "Адреса пункту прийому не може бути порожньою")
    private String address;

    /**
     * Контактний телефон пункту прийому.
     */
    @Pattern(regexp = "^\\+?[0-9\\s-()]{10,15}$", message = "Неправильний формат телефону")
    private String phone;

    /**
     * Код пункту прийому (для формування номерів замовлень).
     */
    @NotBlank(message = "Код пункту прийому не може бути порожнім")
    @Pattern(regexp = "^[A-Z0-9]{2,5}$", message = "Код повинен містити від 2 до 5 символів (великі літери та цифри)")
    private String code;

    /**
     * Статус активності пункту прийому.
     */
    private Boolean active;
}
```

### 2. Оновити клас для створення філії

```java
package com.aksi.domain.branch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Запит на створення нового пункту прийому замовлень.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class BranchLocationCreateRequest extends BaseBranchLocationRequest {

    /**
     * Конструктор зі значенням за замовчуванням для поля active.
     * Завжди створює активну філію.
     */
    public BranchLocationCreateRequest() {
        super();
        setActive(true); // Значення за замовчуванням
    }
}
```

### 3. Оновити клас для оновлення філії

```java
package com.aksi.domain.branch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Запит на оновлення існуючого пункту прийому замовлень.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class BranchLocationUpdateRequest extends BaseBranchLocationRequest {
    // Наслідує всі поля від базового класу
    // При оновленні філії статус active визначається явно при виклику
}
```

## Важливі зміни в анотаціях Lombok

1. Замінити анотацію `@Builder` на `@SuperBuilder` для коректної роботи паттерну Builder з наслідуванням
2. Додати анотацію `@EqualsAndHashCode(callSuper = true)` для включення полів батьківського класу в методи equals() та hashCode()

## Майбутні переваги

1. Спрощення додавання нових полів до запитів - достатньо додати в базовий клас
2. Єдина точка зміни валідаційних правил
3. Легше розширювати систему додатковими DTO класами для філій, якщо потрібно
4. Зменшення розміру кодової бази
5. Дотримання принципу DRY
