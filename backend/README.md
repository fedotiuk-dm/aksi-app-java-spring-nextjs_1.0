# Бекенд проєкту "Хімчистка AKSI"

## Інструменти аналізу якості коду

У проєкті налаштовано наступні інструменти для забезпечення якості коду:

### 1. Checkstyle

Перевіряє стиль коду згідно з налаштованими правилами в `checkstyle.xml`.

**Версія:** 9.3 (Maven Plugin 3.6.0)

**Запуск:**

```bash
mvn checkstyle:check
```

**Звіт:**

```bash
mvn checkstyle:checkstyle
mvn site
```

Звіт буде доступний у `target/site/checkstyle.html`.

### 2. PMD

Статичний аналізатор коду, що виявляє потенційні проблеми. Налаштування в `pmd-ruleset.xml`.

**Версія:** Maven Plugin 3.21.2

**Запуск:**

```bash
mvn pmd:check
mvn pmd:cpd-check  # Перевірка дублювання коду
```

**Звіт:**

```bash
mvn pmd:pmd
mvn site
```

Звіт буде доступний у `target/site/pmd.html`.

### 3. SpotBugs

Шукає потенційні помилки та вразливості в коді. Налаштування виключень у `spotbugs-exclude.xml`.

**Версія:** Maven Plugin 4.8.4.0

**Запуск:**

```bash
mvn spotbugs:check
```

**Звіт:**

```bash
mvn spotbugs:spotbugs
mvn site
```

Звіт буде доступний у `target/site/spotbugs.html`.

### 4. JaCoCo

Вимірює покриття коду тестами.

**Версія:** Maven Plugin 0.8.11

**Запуск:**

```bash
mvn test jacoco:report
```

**Звіт:**

```bash
mvn jacoco:report
mvn site
```

Звіт буде доступний у `target/site/jacoco/index.html`.

## Автоматичний запуск всіх перевірок

Щоб запустити всі перевірки разом:

```bash
mvn clean verify
```

## Генерація звітів

Щоб згенерувати всі звіти про якість коду:

```bash
mvn clean verify site
```

## Ігнорування помилок

Якщо потрібно тимчасово вимкнути перевірку для певної частини коду:

### Checkstyle

```java
// CHECKSTYLE:OFF
...ваш код, що вимкне перевірку...
// CHECKSTYLE:ON
```

### PMD

```java
@SuppressWarnings("PMD.AvoidDuplicateLiterals")
```

### SpotBugs

```java
@edu.umd.cs.findbugs.annotations.SuppressFBWarnings("ST_WRITE_TO_STATIC_FROM_INSTANCE_METHOD")
```

## Рекомендації щодо стилю коду Java

1. Використовуйте camelCase для методів і змінних
2. Використовуйте PascalCase для класів та інтерфейсів
3. Додавайте JavaDoc коментарі до всіх публічних методів та класів
4. Максимальна довжина рядка - 120 символів
5. Використовуйте відступи в 4 пробіли (не табуляцію)
6. Розміщуйте фігурні дужки в стилі Java (відкриваюча дужка на тому ж рядку)
