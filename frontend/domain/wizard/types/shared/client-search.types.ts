/**
 * Типи для пошуку клієнтів у wizard
 *
 * Wizard-специфічна логіка пошуку та критерії,
 * які не покриваються orval схемами
 */

/**
 * Критерії пошуку клієнтів (wizard-специфічна логіка)
 */
export interface ClientSearchCriteria {
  searchTerm: string;
  searchBy: Array<'lastName' | 'firstName' | 'phone' | 'email' | 'address'>;
  limit?: number;
  includeRecentOrders?: boolean;
}
