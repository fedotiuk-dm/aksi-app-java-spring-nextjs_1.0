/**
 * Режим роботи з клієнтом
 */
export enum ClientMode {
  CREATE = 'create',
  EDIT = 'edit',
  SELECT = 'select',
  SEARCH = 'search',
  VIEW = 'view',
}

/**
 * Типи каналів комунікації
 */
export enum CommunicationChannel {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  VIBER = 'VIBER',
  TELEGRAM = 'TELEGRAM',
}

/**
 * Джерела залучення клієнтів
 */
export enum ClientSource {
  INSTAGRAM = 'INSTAGRAM',
  FACEBOOK = 'FACEBOOK',
  GOOGLE = 'GOOGLE',
  RECOMMENDATION = 'RECOMMENDATION',
  PASSING_BY = 'PASSING_BY',
  OTHER = 'OTHER',
}
