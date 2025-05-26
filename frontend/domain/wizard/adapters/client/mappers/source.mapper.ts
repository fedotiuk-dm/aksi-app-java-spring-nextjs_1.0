/**
 * @fileoverview Маппер для джерел залучення клієнтів
 * @module domain/wizard/adapters/client/mappers
 */

import { ClientResponse, CreateClientRequest, UpdateClientRequest } from '@/lib/api';

import { WizardClientSource } from '../types';

/**
 * Перетворює API джерело у WizardClientSource
 */
export function mapClientSourceToDomain(apiSource?: ClientResponse.source): WizardClientSource {
  if (!apiSource) return WizardClientSource.OTHER;

  switch (apiSource) {
    case ClientResponse.source.INSTAGRAM:
      return WizardClientSource.SOCIAL_MEDIA;
    case ClientResponse.source.GOOGLE:
      return WizardClientSource.ADVERTISEMENT;
    case ClientResponse.source.RECOMMENDATION:
      return WizardClientSource.REFERRAL;
    case ClientResponse.source.OTHER:
      return WizardClientSource.OTHER;
    default:
      return WizardClientSource.OTHER;
  }
}

/**
 * Перетворює WizardClientSource у API джерело для створення клієнта
 */
export function mapClientSourceToCreateRequest(
  domainSource?: WizardClientSource
): CreateClientRequest.source | undefined {
  if (!domainSource) return undefined;

  switch (domainSource) {
    case WizardClientSource.SOCIAL_MEDIA:
      return CreateClientRequest.source.INSTAGRAM;
    case WizardClientSource.ADVERTISEMENT:
      return CreateClientRequest.source.GOOGLE;
    case WizardClientSource.REFERRAL:
      return CreateClientRequest.source.RECOMMENDATION;
    case WizardClientSource.DIRECT:
    case WizardClientSource.OTHER:
      return CreateClientRequest.source.OTHER;
    default:
      return CreateClientRequest.source.OTHER;
  }
}

/**
 * Перетворює WizardClientSource у API джерело для оновлення клієнта
 */
export function mapClientSourceToUpdateRequest(
  domainSource?: WizardClientSource
): UpdateClientRequest.source | undefined {
  if (!domainSource) return undefined;

  switch (domainSource) {
    case WizardClientSource.SOCIAL_MEDIA:
      return UpdateClientRequest.source.INSTAGRAM;
    case WizardClientSource.ADVERTISEMENT:
      return UpdateClientRequest.source.GOOGLE;
    case WizardClientSource.REFERRAL:
      return UpdateClientRequest.source.RECOMMENDATION;
    case WizardClientSource.DIRECT:
    case WizardClientSource.OTHER:
      return UpdateClientRequest.source.OTHER;
    default:
      return UpdateClientRequest.source.OTHER;
  }
}
