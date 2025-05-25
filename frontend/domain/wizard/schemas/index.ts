/**
 * @fileoverview Схеми валідації wizard домену
 * @module domain/wizard/schemas
 *
 * Централізований експорт усіх Zod схем для валідації:
 * - Базові схеми
 * - Схеми полів
 * - Схеми файлів
 * - Схеми результатів
 */

// === БАЗОВІ СХЕМИ ===
export {
  wizardStepStateSchema,
  wizardMetadataSchema,
  wizardContextSchema,
  saveStateSchema,
} from './wizard-base.schemas';

// === СХЕМИ КЛІЄНТСЬКИХ ПОЛІВ ===
export {
  nameSchema,
  phoneSchema,
  emailSchema,
  addressSchema,
  clientIdSchema,
} from './wizard-client-fields.schemas';

// === СХЕМИ ЗАМОВЛЕННЯ ===
export {
  receiptNumberSchema,
  uniqueLabelSchema,
  futureDateSchema,
  orderIdSchema,
  idSchema,
} from './wizard-order-fields.schemas';

// === СХЕМИ ЧИСЛОВИХ ПОЛІВ ===
export {
  quantitySchema,
  priceSchema,
  totalSchema,
  discountPercentSchema,
  discountAmountSchema,
} from './wizard-numeric-fields.schemas';

// === СХЕМИ ФАЙЛІВ ===
export {
  fileSchema,
  imageFileSchema,
  pdfFileSchema,
  documentFileSchema,
  multipleFilesSchema,
} from './wizard-file.schemas';

// === СХЕМИ РЕЗУЛЬТАТІВ ===
export {
  operationResultSchema,
  typedOperationResultSchema,
  createResultSchema,
  updateResultSchema,
  deleteResultSchema,
  paginatedResultSchema,
  validationResultSchema,
} from './wizard-result.schemas';
