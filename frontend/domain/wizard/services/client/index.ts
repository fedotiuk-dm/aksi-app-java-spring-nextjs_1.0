/**
 * @fileoverview Клієнтські сервіси wizard домену
 * @module domain/wizard/services/client
 */

// === ДОМЕННІ ТИПИ ===
export * from './client-domain.types';

// === ІНТЕРФЕЙСИ ===
export * from './client.interfaces';

// === РЕПОЗИТОРІЙ КЛІЄНТІВ ===
export * from './client.repository';

// === СЕРВІСИ ===
export * from './client-search.service';
export * from './client-creation.service';

// TODO: Додати інші сервіси поступово
// export * from './client-validation.service';
// export * from './client-selection.service';
// export * from './client-autocomplete.service';
