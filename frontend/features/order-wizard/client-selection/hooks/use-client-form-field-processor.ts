import { CreateClientRequest } from '@/lib/api';

import { ClientFormType } from './use-client-form-types';
import { ClientState, ClientFormData } from '../model/types';

/**
 * Хук для обробки полів форми клієнта
 * Відповідає за трансформацію та валідацію даних полів
 */
export const useClientFormFieldProcessor = () => {
  /**
   * Обробка полів комунікаційних каналів
   */
  const processCommunicationChannels = (
    currentRawValue: unknown,
    formType: ClientFormType,
    updateFnNew: (field: keyof ClientState['newClient'], value: ClientState['newClient'][keyof ClientState['newClient']]) => void,
    updateFnEdit: (field: keyof ClientState['editClient'], value: ClientState['editClient'][keyof ClientState['editClient']]) => void
  ): Array<'PHONE' | 'SMS' | 'VIBER'> => {
    const defaultValue: Array<'PHONE' | 'SMS' | 'VIBER'> = [];
    let finalValue: Array<'PHONE' | 'SMS' | 'VIBER'>;

    if (currentRawValue === null || currentRawValue === undefined || currentRawValue === '') {
      finalValue = defaultValue;
    } else if (Array.isArray(currentRawValue)) {
      finalValue = currentRawValue.filter(
        (item: string): item is 'PHONE' | 'SMS' | 'VIBER' =>
          ['PHONE', 'SMS', 'VIBER'].includes(item)
      );
    } else {
      console.warn(
        `processCommunicationChannels: отримав неочікуваний тип: ${typeof currentRawValue}. Встановлено дефолтне значення.`
      );
      finalValue = defaultValue;
    }

    if (formType === 'create') {
      updateFnNew('communicationChannels', finalValue);
    } else if (formType === 'edit') {
      updateFnEdit('communicationChannels', finalValue);
    }
    return finalValue;
  };

  /**
   * Обробка поля джерела клієнта
   */
  const processSource = (
    currentRawValue: unknown,
    formType: ClientFormType,
    updateFnNew: (field: keyof ClientState['newClient'], value: ClientState['newClient'][keyof ClientState['newClient']]) => void,
    updateFnEdit: (field: keyof ClientState['editClient'], value: ClientState['editClient'][keyof ClientState['editClient']]) => void
  ): Array<CreateClientRequest.source> => {
    const defaultValue: Array<CreateClientRequest.source> = [];
    let finalValue: Array<CreateClientRequest.source>;

    if (currentRawValue === null || currentRawValue === undefined || currentRawValue === '') {
      finalValue = defaultValue;
    } else if (Array.isArray(currentRawValue)) {
      finalValue = currentRawValue.filter(
        (item: string): item is CreateClientRequest.source =>
          Object.values(CreateClientRequest.source).includes(
            item as CreateClientRequest.source
          )
      );
    } else {
      console.warn(
        `processSource: отримав неочікуваний тип: ${typeof currentRawValue}. Встановлено дефолтне значення.`
      );
      finalValue = defaultValue;
    }

    if (formType === 'create') {
      updateFnNew('source', finalValue);
    } else if (formType === 'edit') {
      updateFnEdit('source', finalValue);
    }
    return finalValue;
  };

  /**
   * Обробка поля адреси
   */
  const processAddress = (
    currentRawValue: unknown,
    formType: ClientFormType,
    updateFnNew: (field: keyof ClientState['newClient'], value: ClientState['newClient'][keyof ClientState['newClient']]) => void,
    updateFnEdit: (field: keyof ClientState['editClient'], value: ClientState['editClient'][keyof ClientState['editClient']]) => void
  ) => {
    type AddressType = string | null;
    type AddressFormValue = string;

    let finalValueForStore: AddressType;
    let finalValueForForm: AddressFormValue;

    if (currentRawValue === null || currentRawValue === undefined || currentRawValue === '') {
      finalValueForStore = null;
      finalValueForForm = '';
    } else if (typeof currentRawValue === 'string') {
      finalValueForStore = currentRawValue;
      finalValueForForm = currentRawValue;
    } else if (
      currentRawValue !== null &&
      typeof currentRawValue === 'object' &&
      'fullAddress' in currentRawValue &&
      typeof (currentRawValue as { fullAddress?: string }).fullAddress === 'string'
    ) {
      const addressObj = currentRawValue as { fullAddress?: string };
      finalValueForStore = addressObj.fullAddress || null;
      finalValueForForm = addressObj.fullAddress || '';
    } else {
      console.warn(
        `processAddress: отримав неочікуваний тип: ${typeof currentRawValue}. Встановлено null/порожній рядок.`
      );
      finalValueForStore = null;
      finalValueForForm = '';
    }

    if (formType === 'create') {
      updateFnNew('address', finalValueForStore);
    } else if (formType === 'edit') {
      updateFnEdit('address', finalValueForStore);
    }
    return { valueForStore: finalValueForStore, valueForForm: finalValueForForm };
  };

  /**
   * Обробка інших полів форми
   */
  const processGenericField = <
    F extends Exclude<keyof ClientFormData, 'communicationChannels' | 'source' | 'address' | 'id'>
  >(
    fieldKey: F,
    currentRawValue: unknown,
    formType: ClientFormType,
    updateFnNew: (field: keyof ClientState['newClient'], value: ClientState['newClient'][keyof ClientState['newClient']]) => void,
    updateFnEdit: (field: keyof ClientState['editClient'], value: ClientState['editClient'][keyof ClientState['editClient']]) => void,
    currentNewClientState: ClientState['newClient'],
    currentEditClientState: ClientState['editClient']
  ): unknown => {
    let valueToUpdateWith = currentRawValue;
    if (currentRawValue === undefined) {
      valueToUpdateWith = null;
    }

    const valueForForm = currentRawValue === undefined || currentRawValue === null ? '' : currentRawValue;

    if (formType === 'create') {
      if (fieldKey in currentNewClientState) { // Runtime check for safety
        updateFnNew(
          fieldKey as unknown as keyof ClientState['newClient'],
          valueToUpdateWith as ClientState['newClient'][keyof ClientState['newClient']]
        );
      } else {
        console.warn(`processGenericField: Field ${String(fieldKey)} not in newClient schema or unhandled.`);
      }
    } else if (formType === 'edit') {
      if (fieldKey in currentEditClientState) { // Runtime check for safety
        updateFnEdit(
          fieldKey as unknown as keyof ClientState['editClient'],
          valueToUpdateWith as ClientState['editClient'][keyof ClientState['editClient']]
        );
      } else {
        console.warn(`processGenericField: Field ${String(fieldKey)} not in editClient schema or unhandled.`);
      }
    }
    return valueForForm;
  };

  /**
   * Обробка поля id клієнта
   */
  const processIdField = (
    rawValue: unknown,
    formType: ClientFormType,
    updateFnEdit: (field: keyof ClientState['editClient'], value: ClientState['editClient'][keyof ClientState['editClient']]) => void
  ): string => {
    if (formType === 'create') {
      console.warn("processIdField: 'id' field cannot be set for a new client.");
      return '';
    } else { // type === 'edit'
      const idValue = typeof rawValue === 'string' || rawValue === null ? rawValue : null;
      updateFnEdit('id', idValue);
      return idValue === null ? '' : idValue;
    }
  };

  return {
    processCommunicationChannels,
    processSource,
    processAddress,
    processGenericField,
    processIdField,
  };
};
