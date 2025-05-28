/**
 * @fileoverview Публічне API для Client Management сервісів
 *
 * Експортує всі сервіси та типи для управління клієнтами
 */

// === ОСНОВНІ СЕРВІСИ ===
export { ClientValidationService } from './client-validation.service';
export { ClientMapperService } from './client-mapper.service';
export { ClientSearchService } from './client-search.service';
export { ClientFormatterService } from './client-formatter.service';

// === ZOD СХЕМИ ДЛЯ UI ===
export { clientFormSchema, type ClientFormData } from './client-validation.service';

// === ТИПИ ===
export type { ClientValidationResult } from './client-validation.service';
export type { WizardClient } from './client-mapper.service';
export type { ClientSearchCriteria } from './client-search.service';
