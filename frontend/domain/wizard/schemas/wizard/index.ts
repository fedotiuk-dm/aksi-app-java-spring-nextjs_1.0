/**
 * Публічне API wizard схем
 * Експортує всі схеми для валідації даних wizard
 */

// Базові схеми wizard
export {
  wizardStepStateSchema,
  wizardMetadataSchema,
  wizardContextSchema,
  saveStateSchema,
} from './wizard-base.schemas';

// Схеми клієнтських полів
export {
  nameSchema,
  phoneSchema,
  emailSchema,
  addressSchema,
  clientIdSchema,
} from './wizard-client-fields.schemas';

// Схеми полів замовлення
export {
  receiptNumberSchema,
  uniqueLabelSchema,
  futureDateSchema,
  orderIdSchema,
  idSchema,
} from './wizard-order-fields.schemas';

// Схеми числових полів
export {
  quantitySchema,
  priceSchema,
  totalSchema,
  discountPercentSchema,
  discountAmountSchema,
} from './wizard-numeric-fields.schemas';

// Схеми файлів
export {
  fileSchema,
  imageFileSchema,
  pdfFileSchema,
  documentFileSchema,
  multipleFilesSchema,
} from './wizard-file.schemas';

// Схеми результатів операцій
export {
  operationResultSchema,
  typedOperationResultSchema,
  createResultSchema,
  updateResultSchema,
  deleteResultSchema,
  paginatedResultSchema,
  validationResultSchema,
} from './wizard-result.schemas';
