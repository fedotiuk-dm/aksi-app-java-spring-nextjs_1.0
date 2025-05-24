/**
 * Публічне API всіх схем домену wizard
 * Централізований експорт усіх Zod схем для валідації
 */

// === БАЗОВІ СХЕМИ ===
export {
  wizardStepStateSchema,
  wizardMetadataSchema,
  wizardContextSchema,
  saveStateSchema,
} from './wizard/wizard-base.schemas';

// === СХЕМИ ПОЛІВ ===
export {
  nameSchema,
  phoneSchema,
  emailSchema,
  addressSchema,
  clientIdSchema,
} from './wizard/wizard-client-fields.schemas';

export {
  receiptNumberSchema,
  uniqueLabelSchema,
  futureDateSchema,
  orderIdSchema,
  idSchema,
} from './wizard/wizard-order-fields.schemas';

export {
  quantitySchema,
  priceSchema,
  totalSchema,
  discountPercentSchema,
  discountAmountSchema,
} from './wizard/wizard-numeric-fields.schemas';

// === СХЕМИ ФАЙЛІВ ===
export {
  fileSchema,
  imageFileSchema,
  pdfFileSchema,
  documentFileSchema,
  multipleFilesSchema,
} from './wizard/wizard-file.schemas';

// === СХЕМИ РЕЗУЛЬТАТІВ ===
export {
  operationResultSchema,
  typedOperationResultSchema,
  createResultSchema,
  updateResultSchema,
  deleteResultSchema,
  paginatedResultSchema,
  validationResultSchema,
} from './wizard/wizard-result.schemas';
