# Завдання 1: Рефакторинг PriceRecommendationServiceImpl

## Опис проблеми

В класі `PriceRecommendationServiceImpl` виявлено 10 рядків дубльованого коду між методами в лініях 56-65 та 78-87. Дублювання стосується обробки рекомендацій модифікаторів.

## Аналіз поточного стану коду

```java
// Дублювання у методі getRecommendedModifiersForItem - перший фрагмент:
stainRecommendations.forEach(rec -> {
    PriceModifierDTO modifier = modifierService.getModifierByCode(rec.getCode());
    if (modifier != null) {
        // Якщо є рекомендоване значення, встановлюємо його
        if (rec.getRecommendedValue() != null) {
            modifier.setValue(BigDecimal.valueOf(rec.getRecommendedValue()));
        }
        recommendedModifiers.add(modifier);
    }
});

// Дублювання у методі getRecommendedModifiersForItem - другий фрагмент:
defectRecommendations.forEach(rec -> {
    // Перевіряємо, чи вже додано цей модифікатор від плям
    boolean alreadyAdded = recommendedModifiers.stream()
            .anyMatch(m -> m.getCode().equals(rec.getCode()));

    if (!alreadyAdded) {
        PriceModifierDTO modifier = modifierService.getModifierByCode(rec.getCode());
        if (modifier != null) {
            // Якщо є рекомендоване значення, встановлюємо його
            if (rec.getRecommendedValue() != null) {
                modifier.setValue(BigDecimal.valueOf(rec.getRecommendedValue()));
            }
            recommendedModifiers.add(modifier);
        }
    }
});
```

## План рефакторингу

1. Створити приватний допоміжний метод, який буде обробляти рекомендації модифікаторів
2. Метод має приймати:
   - Список рекомендацій `List<ModifierRecommendationDTO>`
   - Поточний список рекомендованих модифікаторів `List<PriceModifierDTO>`
   - Прапорець, що вказує на необхідність перевірки дублікатів `boolean checkForDuplicates`
3. Метод повинен:
   - Обробляти кожну рекомендацію
   - За необхідності перевіряти на дублікати
   - Додавати модифікатори до списку
   - Коректно встановлювати рекомендовані значення

## Реалізація

### Крок 1: Створення допоміжного методу

```java
/**
 * Обробляє список рекомендацій та перетворює їх у модифікатори цін
 *
 * @param recommendations список рекомендацій для обробки
 * @param recommendedModifiers існуючий список рекомендованих модифікаторів
 * @param checkForDuplicates чи перевіряти наявність дублікатів
 */
private void processModifierRecommendations(
        List<ModifierRecommendationDTO> recommendations,
        List<PriceModifierDTO> recommendedModifiers,
        boolean checkForDuplicates) {

    recommendations.forEach(rec -> {
        // Перевіряємо, чи вже додано цей модифікатор, якщо потрібно
        boolean shouldAdd = !checkForDuplicates ||
                recommendedModifiers.stream()
                    .noneMatch(m -> m.getCode().equals(rec.getCode()));

        if (shouldAdd) {
            PriceModifierDTO modifier = modifierService.getModifierByCode(rec.getCode());
            if (modifier != null) {
                // Якщо є рекомендоване значення, встановлюємо його
                if (rec.getRecommendedValue() != null) {
                    modifier.setValue(BigDecimal.valueOf(rec.getRecommendedValue()));
                }
                recommendedModifiers.add(modifier);
            }
        }
    });
}
```

### Крок 2: Оновлення основного методу

```java
@Override
public List<PriceModifierDTO> getRecommendedModifiersForItem(
        Set<String> stains,
        Set<String> defects,
        String categoryCode,
        String materialType) {

    List<PriceModifierDTO> recommendedModifiers = new ArrayList<>();

    // Отримуємо рекомендації на основі плям
    if (stains != null && !stains.isEmpty()) {
        List<ModifierRecommendationDTO> stainRecommendations =
                recommendationService.getRecommendedModifiersForStains(stains, categoryCode, materialType);
        processModifierRecommendations(stainRecommendations, recommendedModifiers, false);
    }

    // Отримуємо рекомендації на основі дефектів
    if (defects != null && !defects.isEmpty()) {
        List<ModifierRecommendationDTO> defectRecommendations =
                recommendationService.getRecommendedModifiersForDefects(defects, categoryCode, materialType);
        processModifierRecommendations(defectRecommendations, recommendedModifiers, true);
    }

    return recommendedModifiers;
}
```

## Переваги після рефакторингу

1. **Усунення дубльованого коду** - 10 рядків дубльованого коду замінено викликом методу
2. **Поліпшена читабельність** - метод `getRecommendedModifiersForItem` став більш компактним
3. **Спрощене тестування** - можливість окремо тестувати логіку обробки рекомендацій
4. **Єдина точка змін** - якщо потрібні зміни в логіці обробки рекомендацій, достатньо змінити лише один метод

## Потенційні ризики

1. Необхідно переконатися, що логіка перевірки дублікатів працює коректно
2. Переконатися, що всі тести проходять без помилок після рефакторингу

## План тестування

1. Перевірити сценарій з рекомендаціями тільки для плям
2. Перевірити сценарій з рекомендаціями тільки для дефектів
3. Перевірити сценарій з рекомендаціями і для плям, і для дефектів
4. Перевірити сценарій, коли є дублікати у рекомендаціях

## Подальші можливості для вдосконалення

1. Розглянути можливість введення кешування для запитів модифікаторів за кодом
2. Оптимізувати обробку великих списків рекомендацій
3. Додати логування для відстеження роботи з рекомендаціями
