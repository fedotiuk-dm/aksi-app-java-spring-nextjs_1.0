// Активні хуки (рекомендовані для використання)
export * from './use-client-creation.hook';
export * from './use-client-editing.hook';
export * from './use-client-search.hook';
export * from './use-client-selection.hook';

// Утилітарні хуки
export * from './use-debounce.hook';

// Композиційний хук для стану домену
export * from './use-client-domain-state.hook';

// Спеціалізовані хуки для Order Wizard integration (SOLID принципи)
export * from './use-client-step-state.hook';
export * from './use-client-step-navigation.hook';
export * from './use-client-step-actions.hook';

// Головний композиційний хук для wizard
export * from './use-client-step.hook';
