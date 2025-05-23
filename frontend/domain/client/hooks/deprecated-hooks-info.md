# 🔴 Deprecated Hooks - Client Domain

Ці хуки застаріли та **НЕ РЕКОМЕНДУЮТЬСЯ** для використання в новому коді.

## ❌ Deprecated Hooks:

### 1. `use-client-form.hook.ts`

**Замінено на:** `useClientCreation()` + `useClientEditing()`
**Причина:** Порушує Single Responsibility Principle

### 2. `use-client-form-store.hook.ts`

**Замінено на:** Прямий доступ до `useClientCreationStore()` + `useClientEditingStore()`
**Причина:** Використовував старий загальний стор

### 3. `use-mutations.hook.ts`

**Замінено на:** Repository pattern в нових хуках
**Причина:** Дублює CRUD операції

### 4. `use-form-handler.hook.ts`

**Замінено на:** Спеціалізована логіка в нових хуках
**Причина:** Загальний обробник форм

### 5. `use-field-processor.hook.ts`

**Замінено на:** Вбудована обробка полів в нових хуках
**Причина:** Обробка полів форми

### 6. `use-form-initialization.hook.ts`

**Замінено на:** Логіка ініціалізації в спеціалізованих хуках
**Причина:** Ініціалізація форм

### 7. `use-form-validation.hook.ts`

**Замінено на:** Zod схеми + React Hook Form в нових хуках
**Причина:** Валідація форм

## ✅ Рекомендовані хуки (Нова архітектура):

- `useClientCreation()` - Створення клієнтів
- `useClientEditing()` - Редагування клієнтів
- `useClientSearch()` - Пошук клієнтів
- `useClientSelection()` - Вибір клієнтів
- `useDebounce()` - Утилітарний хук

## 🔄 Migration Guide:

### Було:

```typescript
const { form, handleSubmit } = useClientForm({ type: 'create' });
```

### Стало:

```typescript
const { formData, handleSave, handleFieldChange } = useClientCreation();
```

### Було:

```typescript
const { searchClients } = useMutations();
```

### Стало:

```typescript
const { search, results } = useClientSearch();
```
