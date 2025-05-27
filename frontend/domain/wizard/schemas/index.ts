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

// === СХЕМИ ФІЛІЙ ===
export {
  wizardBranchIdSchema,
  wizardBranchCodeSchema,
  wizardBranchNameSchema,
  wizardBranchAddressSchema,
  wizardBranchPhoneSchema,
  wizardBranchSchema,
  wizardBranchCreateDataSchema,
  wizardBranchUpdateDataSchema,
  wizardBranchFiltersSchema,
  wizardBranchOperationResultSchema,
  wizardBranchValidationResultSchema,
  type WizardBranch,
  type WizardBranchCreateData,
  type WizardBranchUpdateData,
  type WizardBranchFilters,
  type WizardBranchOperationResult,
  type WizardBranchValidationResult,
} from './wizard-branch-fields.schemas';

// === СХЕМИ ПРЕДМЕТІВ ===
export {
  wizardItemIdSchema,
  wizardItemCategorySchema,
  wizardItemNameSchema,
  wizardItemQuantitySchema,
  wizardItemUnitSchema,
  wizardItemMaterialSchema,
  wizardItemColorSchema,
  wizardItemFillerTypeSchema,
  wizardItemFillerCompressedSchema,
  wizardItemWearDegreeSchema,
  wizardItemStainsSchema,
  wizardItemDefectsSchema,
  wizardItemRisksSchema,
  wizardItemBasePriceSchema,
  wizardItemFinalPriceSchema,
  wizardItemNotesSchema,
  wizardItemPhotosSchema,
  wizardOrderItemSchema,
  wizardOrderItemCreateSchema,
  wizardOrderItemUpdateSchema,
  wizardOrderItemDetailedSchema,
  wizardOrderItemFiltersSchema,
  type WizardOrderItem,
  type WizardOrderItemCreate,
  type WizardOrderItemUpdate,
  type WizardOrderItemDetailed,
  type WizardOrderItemFilters,
  type WizardItemCategory,
  type WizardItemMaterial,
  type WizardItemUnit,
  type WizardItemFillerType,
  type WizardItemWearDegree,
} from './wizard-item-fields.schemas';

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
