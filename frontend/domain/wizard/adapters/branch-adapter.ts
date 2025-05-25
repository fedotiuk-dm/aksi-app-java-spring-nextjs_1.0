/**
 * @fileoverview Адаптер філій API → Domain (SOLID рефакторинг)
 * @module domain/wizard/adapters
 */

// Експорт композиційного адаптера з модульної структури
export { BranchAdapter } from './branch-adapters';

// Експорт спеціалізованих адаптерів для прямого використання
export { BranchMappingAdapter, BranchApiOperationsAdapter } from './branch-adapters';
