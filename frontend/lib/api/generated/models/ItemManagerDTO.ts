/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItemDTO } from './OrderItemDTO';
export type ItemManagerDTO = {
    sessionId?: string;
    orderId?: string;
    addedItems?: Array<OrderItemDTO>;
    totalAmount?: number;
    itemCount?: number;
    canProceedToNextStage?: boolean;
    activeWizardId?: string;
    editingItemId?: string;
    currentStatus?: string;
    wizardActive?: boolean;
    editMode?: boolean;
};

