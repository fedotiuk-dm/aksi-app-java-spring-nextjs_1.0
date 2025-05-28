/**
 * Композиція всіх станів wizard кроків та фабрика створення
 */

import type { ClientSelectionStepState } from './stage-1/client-selection.types';
import type { OrderBasicInfoStepState } from './stage-1/order-basic-info.types';
import type { ItemBasicInfoStepState } from './stage-2/item-basic-info.types';
import type { ItemCharacteristicsStepState } from './stage-2/item-characteristics.types';
import type { ItemDefectsStepState } from './stage-2/item-defects.types';
import type { ItemPhotoDocumentationStepState } from './stage-2/item-photo-documentation.types';
import type { ItemPriceCalculatorStepState } from './stage-2/item-price-calculator.types';
import type { ItemsManagerMainState } from './stage-2/items-manager-main.types';
import type { AdditionalInfoStepState } from './stage-3/additional-info.types';
import type { ExecutionParametersStepState } from './stage-3/execution-parameters.types';
import type { GlobalDiscountsStepState } from './stage-3/global-discounts.types';
import type { PaymentStepState } from './stage-3/payment.types';
import type { LegalAspectsStepState } from './stage-4/legal-aspects.types';
import type { OrderReviewStepState } from './stage-4/order-review.types';
import type { ProcessCompletionStepState } from './stage-4/process-completion.types';
import type { ReceiptGenerationStepState } from './stage-4/receipt-generation.types';

/**
 * Усі стани кроків wizard (повна композиція всіх етапів)
 */
export interface AllStepsState {
  // Етап 1: Клієнт та базова інформація
  clientSelection: ClientSelectionStepState; // 1.1
  orderBasicInfo: OrderBasicInfoStepState; // 1.2

  // Етап 2: Менеджер предметів
  itemsManagerMain: ItemsManagerMainState; // 2.0
  itemBasicInfo: ItemBasicInfoStepState; // 2.1
  itemCharacteristics: ItemCharacteristicsStepState; // 2.2
  itemDefects: ItemDefectsStepState; // 2.3
  itemPriceCalculator: ItemPriceCalculatorStepState; // 2.4
  itemPhotoDocumentation: ItemPhotoDocumentationStepState; // 2.5

  // Етап 3: Загальні параметри замовлення
  executionParameters: ExecutionParametersStepState; // 3.1
  globalDiscounts: GlobalDiscountsStepState; // 3.2
  payment: PaymentStepState; // 3.3
  additionalInfo: AdditionalInfoStepState; // 3.4

  // Етап 4: Підтвердження та завершення
  orderReview: OrderReviewStepState; // 4.1
  legalAspects: LegalAspectsStepState; // 4.2
  receiptGeneration: ReceiptGenerationStepState; // 4.3
  processCompletion: ProcessCompletionStepState; // 4.4
}

/**
 * Фабрика для створення станів кроків (повна)
 */
export interface StepStateFactory {
  // Етап 1
  createClientSelectionState: () => ClientSelectionStepState;
  createOrderBasicInfoState: () => OrderBasicInfoStepState;

  // Етап 2
  createItemsManagerMainState: () => ItemsManagerMainState;
  createItemBasicInfoState: () => ItemBasicInfoStepState;
  createItemCharacteristicsState: () => ItemCharacteristicsStepState;
  createItemDefectsState: () => ItemDefectsStepState;
  createItemPriceCalculatorState: () => ItemPriceCalculatorStepState;
  createItemPhotoDocumentationState: () => ItemPhotoDocumentationStepState;

  // Етап 3
  createExecutionParametersState: () => ExecutionParametersStepState;
  createGlobalDiscountsState: () => GlobalDiscountsStepState;
  createPaymentState: () => PaymentStepState;
  createAdditionalInfoState: () => AdditionalInfoStepState;

  // Етап 4
  createOrderReviewState: () => OrderReviewStepState;
  createLegalAspectsState: () => LegalAspectsStepState;
  createReceiptGenerationState: () => ReceiptGenerationStepState;
  createProcessCompletionState: () => ProcessCompletionStepState;

  // Композиція
  createAllStepsState: () => AllStepsState;
}
