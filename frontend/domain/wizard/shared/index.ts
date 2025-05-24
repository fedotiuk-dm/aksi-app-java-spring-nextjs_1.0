/**
 * @fileoverview Спільні компоненти Order Wizard Domain - типи, константи, схеми, утиліти
 * @module domain/wizard/shared
 * @author AKSI Team
 * @since 1.0.0
 *
 * @description
 * Shared Infrastructure для всієї функціональності Order Wizard.
 * Містить спільні ресурси які використовуються всіма кроками візарда.
 *
 * Відповідальність Shared модуля:
 * - Загальні типи та інтерфейси для всіх кроків
 * - Константи конфігурації wizard (timeout, limits, тощо)
 * - Утилітарні функції загального використання
 * - Базові схеми валідації (Zod)
 * - Події та стани для XState машини
 *
 * Архітектурні принципи:
 * - DRY: уникнення дублювання коду між кроками
 * - Single Source of Truth: централізовані константи та типи
 * - Type Safety: строга типізація через TypeScript та Zod
 * - Immutability: незмінні структури даних
 *
 * @example
 * // Імпорт типів для використання в кроках
 * import { WizardStep, WizardEvent, BaseWizardState } from '@/domain/wizard/shared';
 *
 * // Використання в step модулі
 * interface ClientStepState extends BaseWizardState {
 *   selectedClientId: string | null;
 * }
 *
 * @example
 * // Імпорт констант
 * import { WIZARD_STEPS, VALIDATION_RULES } from '@/domain/wizard/shared';
 *
 * const isValidStep = Object.values(WIZARD_STEPS).includes(currentStep);
 * const maxFileSize = VALIDATION_RULES.PHOTO.MAX_SIZE;
 *
 * @example
 * // Імпорт утилітарних функцій
 * import { validateWizardData, transformStepData } from '@/domain/wizard/shared';
 *
 * const isDataValid = validateWizardData(wizardState);
 * const transformedData = transformStepData(rawData);
 *
 * @see {@link ./types} - Типи та інтерфейси
 * @see {@link ./constants} - Константи конфігурації
 * @see {@link ./schemas} - Zod схеми валідації
 * @see {@link ./utils} - Утилітарні функції
 */

/**
 * Експорт shared компонентів Order Wizard
 */

// Types
export * from './types/wizard-common.types';
export * from './types/wizard-events.types';
export * from './types/wizard-state.types';

// Constants
export * from './constants/wizard.constants';
export * from './constants/steps.constants';
export * from './constants/validation.constants';

// Schemas
export * from './schemas/wizard-base.schema';

// Utils
export * from './utils/wizard.utils';
