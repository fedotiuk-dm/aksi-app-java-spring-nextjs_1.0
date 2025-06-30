# 🔧 Інструменти для покращення якості коду

## 📋 Доступні команди

### 🎨 Автоматичне форматування (Spotless)

```bash
cd backend
mvn spotless:apply          # Застосувати форматування до всіх файлів
mvn spotless:check          # Перевірити чи потрібне форматування
```

### 🔍 Аналіз якості коду (Checkstyle)

```bash
cd backend
mvn checkstyle:check        # Швидка перевірка з логами в консоль
mvn checkstyle:checkstyle   # Детальний звіт в target/site/checkstyle.html
```

### 🐍 Автоматичне виправлення Checkstyle помилок

```bash
python3 scripts/fix-checkstyle-issues.py
```

**Що виправляє:**

- ✅ Додає крапки в кінці Javadoc коментарів
- ✅ Додає відсутні `@throws` теги
- ✅ Додає відсутні `@param` теги для generic типів
- ✅ Виправляє HTML помилки в Javadoc

### 🤖 Git Pre-commit Hook (автоматичний)

```bash
# Автоматично застосовується при кожному git commit
# Запускає Spotless форматування + Checkstyle перевірку
```

## 🎯 Що покращуємо автоматично

### SummaryJavadoc (100+ помилок)

```java
// ❌ ДО
/**
 * Створює нового клієнта
 */

// ✅ ПІСЛЯ
/**
 * Створює нового клієнта.
 */
```

### JavadocMethod (@throws теги)

```java
// ❌ ДО
/**
 * Валідує клієнта.
 */
public void validate() throws ClientValidationException

// ✅ ПІСЛЯ
/**
 * Валідує клієнта.
 * @throws ClientValidationException якщо виникла помилка
 */
public void validate() throws ClientValidationException
```

### HTML помилки в Javadoc

```java
// ❌ ДО
/**
 * Конвертує <CommunicationMethodType> в domain enum
 */

// ✅ ПІСЛЯ
/**
 * Конвертує `CommunicationMethodType` в domain enum
 */
```

## 🚀 Рекомендований workflow

### Для щоденної роботи:

1. Пишіть код як зазвичай
2. `git commit` - автоматично застосується форматування
3. Періодично: `python3 scripts/fix-checkstyle-issues.py`

### Для великих змін:

1. `mvn spotless:apply` - відформатувати код
2. `python3 scripts/fix-checkstyle-issues.py` - виправити Javadoc
3. `mvn checkstyle:check` - перевірити якість
4. `git add . && git commit -m "..."` - закомітити

## 📊 Статистика проекту

**Поточна ситуація** (з логів):

- ✅ Компіляція: без помилок
- ⚠️ Checkstyle: ~150+ warnings (переважно Javadoc)
- 🎯 **Мета**: < 50 warnings

**Типи помилок** (за частотою):

1. 🔴 SummaryJavadoc - відсутні крапки (~100 помилок) → **АВТОМАТИЗОВАНО**
2. 🟡 RegexpSingleline - хардкодовані URL (~6 помилок) → **РУЧНЕ ВИПРАВЛЕННЯ**
3. 🟡 ParameterNumber - > 7 параметрів (~2 помилки) → **РЕФАКТОРИНГ**
4. 🟡 JavadocMethod - відсутні @throws (~3 помилки) → **АВТОМАТИЗОВАНО**

## 💡 IDE налаштування

### IntelliJ IDEA

```
File → Settings → Tools → Actions on Save
☑️ Reformat code
☑️ Optimize imports
☑️ Rearrange code
```

### VS Code

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  }
}
```

## 🔗 Корисні посилання

- [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)
- [Checkstyle документація](https://checkstyle.sourceforge.io/)
- [Spotless Maven Plugin](https://github.com/diffplug/spotless/tree/main/plugin-maven)
