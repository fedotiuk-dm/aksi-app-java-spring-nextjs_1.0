/**
 * @fileoverview Типи для категорій послуг
 * @module domain/wizard/adapters/pricing/types/service-category
 */

/**
 * Категорія послуг для wizard
 */
export interface WizardServiceCategory {
  id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  sortOrder?: number;
  materials?: string[];
  defaultUnit?: string;
}
