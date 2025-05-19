import type { ClientResponse } from '@/lib/api';

export const formatClientName = (
  client: Pick<ClientResponse, 'firstName' | 'lastName'>
): string => {
  if (!client.firstName && !client.lastName) {
    return 'Без імені';
  }
  return `${client.lastName || ''} ${client.firstName || ''}`.trim();
};

export const formatClientPhone = (phone?: string): string => {
  if (!phone) return '';
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '+38 ($1) $2-$3');
};
