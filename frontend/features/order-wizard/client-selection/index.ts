/**
 * @fileoverview Публічне API для Client Selection Feature
 *
 * ✅ Всі компоненти оновлені для роботи з DDD архітектурою та Zod валідацією
 * ✅ Інтегровано з доменним хуком useClientApiOperations
 * ✅ Використовуються типи з @/shared/api/generated/client
 * ✅ Виправлені TypeScript типи (видалено any)
 * ✅ Використовуються shared UI компоненти (FormField, MultiSelectCheckboxGroup, StepContainer, ActionButton, InfoCard)
 * ✅ Консистентний дизайн та UX через спільні компоненти
 */

// === ОСНОВНИЙ КОМПОНЕНТ ===
export { ClientSelectionStep } from './ui/ClientSelectionStep';

// === ВКЛАДЕНІ КОМПОНЕНТИ ===
export { ClientSearchPanel } from './ui/components/ClientSearchPanel';
export { ClientSelectedPanel } from './ui/components/ClientSelectedPanel';
export { ClientFormPanel } from './ui/components/ClientFormPanel';

// === ДОДАТКОВІ КОМПОНЕНТИ ===
export {
  ClientCreateForm,
  ClientEditForm,
  ClientFormFields,
  ClientModeSelector,
  SelectedClientInfo,
} from './ui/components';
