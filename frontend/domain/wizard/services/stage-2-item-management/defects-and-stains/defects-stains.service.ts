import {
  // Правильні функції з pricing адаптерів
  getStainTypes,
  getDefectTypes,
  type WizardStainType,
  type WizardDefectType,
  type WizardRiskLevel,
} from '@/domain/wizard/adapters/pricing';
import {
  // Схеми підетапу 2.3 - тільки для валідації
  defectsStainsSchema,
  stainsSelectionSchema,
  defectsSelectionSchema,
} from '@/domain/wizard/schemas';

import { BaseWizardService } from '../../base.service';

/**
 * Розширений мінімалістський сервіс для дефектів та плям
 * Розмір: ~105 рядків (в межах ліміту)
 *
 * Відповідальність (ТІЛЬКИ):
 * - Композиція pricing адаптерів для плям + дефектів
 * - Валідація через ВСІ централізовані Zod схеми підетапу 2.3
 * - Мінімальна логіка фільтрації та рекомендацій
 *
 * НЕ дублює:
 * - API виклики (роль pricing адаптерів)
 * - Мапінг даних (роль адаптерів)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 * - Схеми валідації (роль централізованих schemas)
 */

export class DefectsStainsService extends BaseWizardService {
  protected readonly serviceName = 'DefectsStainsService';

  // === КОМПОЗИЦІЯ АДАПТЕРІВ ===

  /**
   * Композиція: отримання типів плям через адаптер
   */
  async getAvailableStains(activeOnly: boolean = true): Promise<WizardStainType[]> {
    const result = await getStainTypes(activeOnly);
    return result.success ? result.data || [] : [];
  }

  /**
   * Композиція: отримання типів дефектів через адаптер
   */
  async getAvailableDefects(activeOnly: boolean = true): Promise<WizardDefectType[]> {
    const result = await getDefectTypes(activeOnly);
    return result.success ? result.data || [] : [];
  }

  /**
   * Композиція: отримання плям за рівнем ризику через адаптер
   */
  async getStainsByRiskLevel(riskLevel: WizardRiskLevel): Promise<WizardStainType[]> {
    const result = await getStainTypes(true, riskLevel);
    return result.success ? result.data || [] : [];
  }

  /**
   * Композиція: отримання дефектів за рівнем ризику через адаптер
   */
  async getDefectsByRiskLevel(riskLevel: WizardRiskLevel): Promise<WizardDefectType[]> {
    const result = await getDefectTypes(true, riskLevel);
    return result.success ? result.data || [] : [];
  }

  // === ВАЛІДАЦІЯ СХЕМ 2.3 ===

  /**
   * Валідація дефектів та плям через централізовану схему
   */
  validateDefectsStains(data: unknown) {
    return defectsStainsSchema.safeParse(data);
  }

  /**
   * Валідація вибору плям через централізовану схему
   */
  validateStainsSelection(data: unknown) {
    return stainsSelectionSchema.safeParse(data);
  }

  /**
   * Валідація вибору дефектів через централізовану схему
   */
  validateDefectsSelection(data: unknown) {
    return defectsSelectionSchema.safeParse(data);
  }

  // === БІЗНЕС-ЛОГІКА ===

  /**
   * Перевірка чи потрібна примітка "Без гарантій"
   */
  requiresNoWarranty(defectCodes: string[]): boolean {
    const criticalDefects = ['wear_damage', 'torn_damage', 'color_change_risk', 'deformation_risk'];
    return defectCodes.some((code) => criticalDefects.includes(code));
  }

  /**
   * Отримання рекомендованих методів обробки за типом плям
   */
  getRecommendedTreatment(stainCodes: string[]): string[] {
    const treatments: string[] = [];

    if (stainCodes.includes('grease_stain')) treatments.push('хімчистка');
    if (stainCodes.includes('blood_stain') || stainCodes.includes('protein_stain')) {
      treatments.push('ферментна обробка');
    }
    if (stainCodes.includes('wine_stain') || stainCodes.includes('coffee_stain')) {
      treatments.push('спеціальне виведення');
    }

    return [...new Set(treatments)]; // унікальні значення
  }

  /**
   * Перевірка сумісності методів обробки з матеріалом
   */
  isTreatmentCompatible(treatment: string, materialCode: string): boolean {
    const restrictions: Record<string, string[]> = {
      хімчистка: ['silk', 'wool', 'leather'],
      'ферментна обробка': ['cotton', 'linen'],
      'спеціальне виведення': ['synthetic', 'mixed'],
    };

    const compatibleMaterials = restrictions[treatment] || [];
    return compatibleMaterials.includes(materialCode) || compatibleMaterials.length === 0;
  }

  /**
   * Фільтрація плям за категорією
   */
  filterStainsByCategory(stains: WizardStainType[], category: string): WizardStainType[] {
    return stains.filter((stain) => stain.code.startsWith(category));
  }

  /**
   * Фільтрація дефектів за рівнем критичності
   */
  filterDefectsByCriticality(defects: WizardDefectType[], critical: boolean): WizardDefectType[] {
    const criticalCodes = ['wear_damage', 'torn_damage', 'color_change_risk', 'deformation_risk'];

    return defects.filter((defect) => {
      const isCritical = criticalCodes.includes(defect.code);
      return critical ? isCritical : !isCritical;
    });
  }
}
