# Order Wizard Step 1 - Повна компонентна архітектура

## Огляд

Етап 1 Order Wizard повністю рефакторовано згідно з принципами DDD та SOLID. Кожна функціональність винесена в окремі компоненти для кращої підтримки, тестування та повторного використання.

## Структура компонентів

### UI Компоненти

#### ClientAndOrderInfoView.java

**Головний координатор** для етапу 1. Відповідає за:

- Координацію взаємодії між UI та service компонентами
- Управління станом етапу
- Валідацію форми
- Інтеграцію з OrderWizardData через mappers

#### ClientSelectionComponent.java

**Компонент пошуку та вибору клієнта**. Відповідає за:

- Пошук існуючих клієнтів за різними критеріями
- Відображення результатів пошуку
- Вибір клієнта зі списку
- Кнопка "Новий клієнт"

#### ClientCreationFormComponent.java

**Компонент створення нового клієнта**. Використовує:

- `ClientCreationFormValidator` для валідації
- `ClientRequestBuilder` для побудови запитів
- UI енуми для конвертації даних
- Автоматична валідація через ValidationResult

#### OrderBasicInfoComponent.java

**Компонент базової інформації замовлення**. Відповідає за:

- Номер квитанції (автогенерація)
- Унікальна мітка замовлення
- Вибір пункту прийому (філії)

### Енуми для UI

#### CommunicationChannelUIEnum.java

**UI енум для каналів зв'язку**. Функції:

- Конвертація між UI strings та доменними енумами
- Методи `convertToDomainEnums()` та `convertToUIDisplayNames()`
- Список доступних значень для UI компонентів

#### InformationSourceUIEnum.java

**UI енум для джерел інформації**. Функції:

- Конвертація між UI strings та `ClientSource` енумами
- Метод `requiresCustomDetails()` для перевірки потреби в додаткових полях
- Безпечна конвертація з null handling

### Валідація

#### ClientCreationFormValidator.java

**Валідатор для форми створення клієнта**. Методи:

- `validateRequiredFields()` - перевірка обов'язкових полів
- `validatePhoneFormat()` - валідація формату телефону
- `validateEmailFormat()` - валідація email
- `validateCompleteForm()` - комплексна валідація з ValidationResult

#### ValidationResult.java

**Контейнер результатів валідації**. Функції:

- Зберігання списку помилок
- Методи `isValid()`, `getErrorsAsText()`
- Лічильники помилок

### Побудова запитів

#### ClientRequestBuilder.java

**Builder для CreateClientRequest**. Методи:

- `buildCreateClientRequest()` - побудова запиту з UI даних
- `getDefaultCommunicationChannels()` - значення за замовчуванням
- `requiresCustomSourceDetails()` - перевірка потреби в додаткових полях
- Конвертація UI даних через енуми

### Mappers та конвертація

#### OrderWizardDataMapper.java

**Mapper між DTO та Entity**. Методи:

- `mapClientResponseToEntity()` - конвертація ClientResponse → ClientEntity
- `mapClientEntityToResponse()` - конвертація ClientEntity → ClientResponse
- `mapBranchLocationDTOToEntity()` - конвертація філії DTO → Entity
- Правильна обробка AddressEntity (fullAddress поле)

### Сервіси

#### WizardDataRestoreService.java

**Сервіс відновлення даних wizard**. Методи:

- `restoreClientResponse()` - відновлення даних клієнта для UI
- `restoreReceiptNumber()` та `restoreTagNumber()` - відновлення номерів
- `hasDataToRestore()` - перевірка наявності даних
- `logRestoredData()` - логування процесу відновлення

## Принципи архітектури

### Single Responsibility Principle (SRP)

Кожен компонент має одну чітко визначену відповідальність:

- UI компоненти - тільки відображення та взаємодія
- Валідатори - тільки валідація
- Builders - тільки побудова об'єктів
- Mappers - тільки конвертація між типами
- Services - тільки бізнес-логіка

### Dependency Injection

Всі компоненти використовують Spring DI:

```java
public ClientCreationFormComponent(ClientService clientService,
                                 ClientCreationFormValidator validator,
                                 ClientRequestBuilder requestBuilder) {
    // Constructor injection
}
```

### Observer Pattern

Компоненти взаємодіють через callbacks:

```java
clientSelectionComponent.setOnClientSelected(this::handleClientSelected);
clientCreationFormComponent.setOnClientCreated(this::handleClientCreated);
```

### Enum-based Conversion

Безпечна конвертація між UI та доменом:

```java
Set<CommunicationChannelEntity> channels =
    CommunicationChannelUIEnum.convertToDomainEnums(uiStrings);
```

## Переваги нової архітектури

### 1. Тестування

- Кожен компонент можна тестувати незалежно
- Валідатори та builders легко unit-тестувати
- Mappers мають чітко визначені контракти

### 2. Підтримка

- Зміни в одному компоненті не впливають на інші
- Логіка конвертації централізована в енумах
- Валідація винесена в окремі класи

### 3. Повторне використання

- Енуми можна використовувати в інших частинах системи
- Validators та builders можна застосувати для інших форм
- Mappers універсальні для всього wizard

### 4. Читабельність

- Код стає більш структурованим
- Чітке розділення обов'язків
- Зменшення дублювання коду

## Приклад використання

```java
// В OrderWizardView
private Component createStep1View() {
    return new ClientAndOrderInfoView(wizardData, this::onStep1Completed, applicationContext);
}
```

Головний view автоматично отримує та налаштовує всі компоненти через Spring ApplicationContext, включаючи validators, builders, mappers та services.

## TODO виконано

✅ Конвертація ClientResponse ↔ ClientEntity через OrderWizardDataMapper
✅ Конвертація BranchLocationDTO ↔ BranchLocationEntity через OrderWizardDataMapper
✅ Винесення валідації в ClientCreationFormValidator
✅ Винесення конвертації енумів в CommunicationChannelUIEnum та InformationSourceUIEnum
✅ Винесення побудови запитів в ClientRequestBuilder
✅ Відновлення даних через WizardDataRestoreService
