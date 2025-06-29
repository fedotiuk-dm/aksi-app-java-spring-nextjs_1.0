# 📚 JSDoc Quick Reference - AKSI Frontend

## 🏷️ Основні теги

### Файловий рівень

```typescript
/**
 * @fileoverview Короткий опис призначення файлу
 * @module domain/client/hooks
 * @author AKSI Team
 * @since 1.0.0
 */
```

### Функції та методи

```typescript
/**
 * @function назваФункції
 * @param {Type} param - опис параметра
 * @returns {Type} опис результату
 * @throws {Error} опис помилок
 * @example
 * // Приклад використання
 * const result = myFunction(param);
 * @since 1.0.0
 */
```

### React компоненти

```tsx
/**
 * @component
 * @param {Props} props - властивості компонента
 * @returns {JSX.Element} React елемент
 * @example
 * <MyComponent prop="value" />
 */
```

### Класи

```typescript
/**
 * @class
 * @description Опис класу
 * @example
 * const instance = new MyClass();
 */
```

### Інтерфейси та типи

```typescript
/**
 * @interface InterfaceName
 * @property {Type} prop - опис властивості
 */

/**
 * @typedef {Object} TypeName
 * @property {Type} prop - опис властивості
 */

/**
 * @enum {string}
 * @readonly
 */
```

---

## 🎯 Спеціальні теги для нашого проекту

### Domain Layer

```typescript
/**
 * @fileoverview Доменний сервіс для...
 * @module domain/[домен]/services
 * @description
 * Бізнес-правила:
 * - Правило 1
 * - Правило 2
 * SOLID принципи:
 * - SRP: ...
 * - OCP: ...
 */
```

### Hooks

```typescript
/**
 * @function useMyHook
 * @description
 * Композиційний хук згідно з архітектурою DDD inside.
 * Інкапсулює бізнес-логіку домену.
 * @see {@link relatedHook} - пов'язаний хук
 */
```

### Stores (Zustand)

```typescript
/**
 * @function useMyStore
 * @description Zustand стор для управління станом [опис]
 * @example
 * // Читання стану
 * const value = useMyStore(state => state.value);
 *
 * @example
 * // Виконання дій
 * const { action } = useMyStore();
 * action(params);
 */
```

---

## 💡 Приклади для різних сценаріїв

### API функції

```typescript
/**
 * @async
 * @function
 * @param {string} id - ідентифікатор ресурсу
 * @returns {Promise<Resource>} промис з ресурсом
 * @throws {ApiError} HTTP помилки (400, 404, 500)
 * @example
 * try {
 *   const client = await getClient('client-123');
 * } catch (error) {
 *   console.error('Помилка завантаження:', error);
 * }
 */
```

### Утилітарні функції

```typescript
/**
 * @function
 * @param {string} phone - номер телефону
 * @param {number} [visibleDigits=4] - кількість видимих цифр
 * @returns {string} замаскований номер
 * @throws {Error} якщо номер некоректний
 * @example
 * maskPhone('+380501234567'); // => "+38050****4567"
 * @since 1.0.0
 */
```

### Validation схеми

```typescript
/**
 * Zod схема для валідації клієнта
 * @constant
 * @type {ZodSchema<Client>}
 * @example
 * const result = clientSchema.safeParse(data);
 * if (result.success) {
 *   console.log('Валідний клієнт:', result.data);
 * }
 */
```

---

## 🔗 Посилання та зв'язки

### Внутрішні посилання

```typescript
/**
 * @see {@link MyClass} - посилання на клас
 * @see {@link MyClass#method} - посилання на метод
 * @see {@link module:domain/client} - посилання на модуль
 */
```

### Зовнішні посилання

```typescript
/**
 * @see {@link https://zustand.docs.pmnd.rs/} - документація Zustand
 * @see {@link https://tanstack.com/query/} - TanStack Query
 */
```

---

## 🎨 Форматування та стиль

### Структура коментаря

```typescript
/**
 * Короткий опис (одне речення)
 *
 * @tag значення
 *
 * @description
 * Детальний опис з:
 * - Бізнес-логікою
 * - Архітектурними рішеннями
 * - SOLID принципами
 *
 * @param {Type} param - опис
 * @returns {Type} опис
 *
 * @example
 * // Приклад 1
 * code();
 *
 * @example
 * // Приклад 2
 * moreCode();
 *
 * @see {@link related} - пов'язані елементи
 * @since 1.0.0
 */
```

### Приклади коду

```typescript
/**
 * @example
 * // Короткий коментар що робить приклад
 * const client: Client = {
 *   id: 'client-123',
 *   firstName: 'Іван',
 *   lastName: 'Петренко',
 *   phone: '+380501234567'
 * };
 *
 * const formatted = formatClientName(client);
 * console.log(formatted); // => "Іван Петренко"
 */
```

---

## ⚡ Швидкі команди

### Генерація документації

```bash
# JSDoc
npm run docs:build

# TypeDoc
npm run docs:typedoc

# Обидва
npm run docs:all

# Розробка з автооновленням
npm run docs:dev
```

### Перевірка покриття

```bash
# Лінтер з перевіркою JSDoc
npm run lint:strict

# TypeScript перевірка
npm run type-check
```

---

## 🚨 Часті помилки

### ❌ Неправильно

```typescript
/**
 * Функція для клієнтів
 */
function doSomething(data) {
  // ...
}
```

### ✅ Правильно

```typescript
/**
 * Форматувати ім'я клієнта для відображення в UI
 *
 * @function formatClientName
 * @param {Client} client - об'єкт клієнта з полями firstName, lastName
 * @returns {string} відформатоване повне ім'я
 *
 * @example
 * const client = { firstName: 'Іван', lastName: 'Петренко' };
 * formatClientName(client); // => "Іван Петренко"
 *
 * @since 1.0.0
 */
function formatClientName(client: Client): string {
  return `${client.firstName} ${client.lastName}`;
}
```

---

## 📋 Чекліст перед commit

- [ ] Всі публічні функції мають JSDoc
- [ ] Є мінімум один @example на функцію
- [ ] Типи правильно вказані в @param та @returns
- [ ] Додано @throws для функцій що можуть кидати помилки
- [ ] Посилання між модулями через @see
- [ ] Українська мова в коментарях
- [ ] Термінологія домену хімчистки
