// Композиційний стор (основний, рекомендований для використання)
export * from './client-store';

// Спеціалізовані сторі (використовуються внутрішньо композиційним стором)
export * from './client-creation.store';
export * from './client-editing.store';
export * from './client-search.store';
export * from './client-selection.store';

// Старий стор (deprecated, залишаємо для сумісності)
export * from './client-form.store';
