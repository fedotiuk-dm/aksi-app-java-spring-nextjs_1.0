/**
 * @fileoverview Маппер для комунікаційних каналів клієнтів
 * @module domain/wizard/adapters/client/mappers
 */

import { WizardCommunicationChannel } from '../types';

/**
 * Перетворює API канали комунікації у WizardCommunicationChannel[]
 */
export function mapCommunicationChannelsToDomain(
  apiChannels?: Array<'PHONE' | 'SMS' | 'VIBER'>
): WizardCommunicationChannel[] {
  if (!apiChannels) return [];

  const result: WizardCommunicationChannel[] = [];

  apiChannels.forEach((channel) => {
    switch (channel) {
      case 'PHONE':
        result.push(WizardCommunicationChannel.PHONE);
        break;
      case 'SMS':
        result.push(WizardCommunicationChannel.SMS);
        break;
      case 'VIBER':
        result.push(WizardCommunicationChannel.VIBER);
        break;
      // EMAIL не підтримується в API, але є в нашій доменній моделі
    }
  });

  return result;
}

/**
 * Перетворює WizardCommunicationChannel[] у API канали
 */
export function mapCommunicationChannelsToAPI(
  domainChannels?: WizardCommunicationChannel[]
): Array<'PHONE' | 'SMS' | 'VIBER'> | undefined {
  if (!domainChannels) return undefined;

  const result: Array<'PHONE' | 'SMS' | 'VIBER'> = [];

  domainChannels.forEach((channel) => {
    switch (channel) {
      case WizardCommunicationChannel.PHONE:
        result.push('PHONE');
        break;
      case WizardCommunicationChannel.SMS:
        result.push('SMS');
        break;
      case WizardCommunicationChannel.VIBER:
        result.push('VIBER');
        break;
      case WizardCommunicationChannel.EMAIL:
        // EMAIL не підтримується в API, пропускаємо
        break;
    }
  });

  return result.length > 0 ? result : undefined;
}
