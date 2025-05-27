/**
 * @fileoverview Експорт всіх сервісів управління клієнтами
 * @module domain/wizard/services/stage-1/client-management/services
 */

// Сервіси пошуку клієнтів
export * from './client-search.service';

// Сервіси створення і оновлення клієнтів
export * from './client-create.service';
export * from './client-update.service';

// Валідація тепер через Zod схеми в types/client-domain.types.ts

// Спеціалізовані сервіси
export * from './contact-methods.service';
export * from './information-source.service';
export * from './client-uniqueness-check.service';
export * from './client-transformation-simple.service';

// Комплексний сервіс управління клієнтами
export * from './client-management.service';
