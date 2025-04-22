import { ClientCreateRequest } from '@/lib/api';

// Опції для способів комунікації
export const COMMUNICATION_CHANNELS_OPTIONS = [
  { value: 'PHONE', label: 'Номер телефону' },
  { value: 'SMS', label: 'SMS' },
  { value: 'VIBER', label: 'Viber' },
];

// Опції для джерел інформації про хімчистку
export const CLIENT_SOURCE_OPTIONS = [
  { value: ClientCreateRequest.source.INSTAGRAM, label: 'Інстаграм' },
  { value: ClientCreateRequest.source.GOOGLE, label: 'Google' },
  { value: ClientCreateRequest.source.REFERRAL, label: 'Рекомендації' },
  { value: ClientCreateRequest.source.OTHER, label: 'Інше' },
];

// Початкові значення для форми клієнта
export const DEFAULT_CLIENT_FORM_VALUES = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',
  communicationChannels: ['PHONE'] as Array<'PHONE' | 'SMS' | 'VIBER'>,
  source: ClientCreateRequest.source.OTHER,
  otherSourceDetails: '',
};
