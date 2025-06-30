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

### 🛡️ Автоматичне виправлення (БЕЗПЕЧНЕ)

```bash
python3 scripts/fix-checkstyle-safe.py
```

**Що виправляє безпечно:**

- ✅ Додає крапки в кінці одноряддових Javadoc коментарів
- ✅ Додає @throws теги для IllegalArgumentException

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

### Крок 1: Автоматичне виправлення

```bash
cd backend
mvn spotless:apply
python3 ../scripts/fix-checkstyle-safe.py
```

### Крок 2: Перевірка результатів

```bash
mvn checkstyle:check | head -20
git diff
```

### Крок 3: Ручне виправлення по пріоритетах

1. **Хардкодовані URL** - винести в конфігурацію
2. **@throws теги** - додати в критичних місцях
3. **Довгі рядки** - розбити найпроблемніші
4. **HTML в Javadoc** - замінити на `{@code }`

### Крок 4: Коміт змін

```bash
git add .
git commit -m "Fix checkstyle issues (safe auto + manual fixes)"
```

## ⚠️ Важливо

- **НЕ виправляйте все одразу** - робіть поступово
- **Тестуйте після кожної зміни** - `mvn clean compile`
- **Робіть коміти часто** - легше відкотити помилки
- **false positive warnings** - деякі можна ігнорувати

## 🎯 Цілі якості коду

- **< 50 warnings** - добрий рівень
- **< 20 warnings** - відмінний рівень
- **0 warnings** - ідеал (але не обов'язково)

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
