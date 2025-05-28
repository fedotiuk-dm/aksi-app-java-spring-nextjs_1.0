/**
 * @fileoverview Stage 2 - Менеджер предметів (5 підетапів + координатор)
 * @module domain/wizard/services/stage-2-item-management
 */

/**
 * Етап 2: Менеджер предметів (циклічний процес) з orval + zod інтеграцією
 *
 * Правильна структура з 5 підетапів:
 * 2.0 - item-manager (координатор, таблиця, CRUD) ✅ ORVAL READY
 * 2.1 - basic-info (категорії, найменування, одиниці) ✅ ORVAL READY
 * 2.2 - characteristics (матеріал, колір, наповнювач) ✅ ORVAL READY
 * 2.3 - defects-and-stains (плями, дефекти, ризики) ✅ ORVAL READY
 * 2.4 - pricing-calculation (модифікатори, розрахунок)
 * 2.5 - photo-management (фотодокументація) ✅ ORVAL READY
 *
 * ПРИМІТКА: Сервіси використовують orval Zod схеми для валідації та типізації.
 * API виклики здійснюються через хуки з TanStack Query.
 */

// Координатор всього етапу 2 (2.0)
export * from './item-manager';

// Підетап 2.1: Основна інформація про предмет
export * from './basic-info';

// Підетап 2.2: Характеристики предмета
export * from './characteristics';

// Підетап 2.3: Забруднення, дефекти та ризики
export * from './defects-and-stains';

// Підетап 2.4: Знижки та надбавки (калькулятор ціни)
export * from './pricing-calculation';

// Підетап 2.5: Фотодокументація
export * from './photo-management';
