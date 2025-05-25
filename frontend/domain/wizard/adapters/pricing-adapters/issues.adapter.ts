/**
 * @fileoverview Адаптер операцій з проблемами (плями та дефекти)
 * @module domain/wizard/adapters/pricing-adapters
 */

import { PricingIssuesService, ReferenceDataService } from '@/lib/api';

import { PricingMappingAdapter } from './mapping.adapter';

import type { StainType, DefectType } from './mapping.adapter';

/**
 * Адаптер для операцій з проблемами (плями та дефекти)
 *
 * Відповідальність:
 * - Отримання типів плям
 * - Отримання типів дефектів
 * - Робота з довідковими даними
 * - Фільтрація за рівнем ризику
 */
export class PricingIssuesAdapter {
  /**
   * Отримує всі типи плям
   */
  static async getAllStainTypes(): Promise<StainType[]> {
    try {
      const apiStains = await PricingIssuesService.getStainTypes({
        activeOnly: false,
      });
      return PricingMappingAdapter.stainTypesToDomain(apiStains);
    } catch (error) {
      console.error('Помилка при отриманні типів плям:', error);
      return [];
    }
  }

  /**
   * Отримує активні типи плям
   */
  static async getActiveStainTypes(): Promise<StainType[]> {
    try {
      const apiStains = await PricingIssuesService.getStainTypes({
        activeOnly: true,
      });
      return PricingMappingAdapter.stainTypesToDomain(apiStains);
    } catch (error) {
      console.error('Помилка при отриманні активних типів плям:', error);
      return [];
    }
  }

  /**
   * Отримує типи плям за рівнем ризику
   */
  static async getStainTypesByRiskLevel(
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  ): Promise<StainType[]> {
    try {
      const apiStains = await PricingIssuesService.getStainTypes({
        activeOnly: true,
        riskLevel,
      });
      return PricingMappingAdapter.stainTypesToDomain(apiStains);
    } catch (error) {
      console.error(`Помилка при отриманні типів плям з рівнем ризику ${riskLevel}:`, error);
      return [];
    }
  }

  /**
   * Отримує всі типи дефектів
   */
  static async getAllDefectTypes(): Promise<DefectType[]> {
    try {
      const apiDefects = await PricingIssuesService.getDefectTypes({
        activeOnly: false,
      });
      return PricingMappingAdapter.defectTypesToDomain(apiDefects);
    } catch (error) {
      console.error('Помилка при отриманні типів дефектів:', error);
      return [];
    }
  }

  /**
   * Отримує активні типи дефектів
   */
  static async getActiveDefectTypes(): Promise<DefectType[]> {
    try {
      const apiDefects = await PricingIssuesService.getDefectTypes({
        activeOnly: true,
      });
      return PricingMappingAdapter.defectTypesToDomain(apiDefects);
    } catch (error) {
      console.error('Помилка при отриманні активних типів дефектів:', error);
      return [];
    }
  }

  /**
   * Отримує типи дефектів за рівнем ризику
   */
  static async getDefectTypesByRiskLevel(
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  ): Promise<DefectType[]> {
    try {
      const apiDefects = await PricingIssuesService.getDefectTypes({
        activeOnly: true,
        riskLevel,
      });
      return PricingMappingAdapter.defectTypesToDomain(apiDefects);
    } catch (error) {
      console.error(`Помилка при отриманні типів дефектів з рівнем ризику ${riskLevel}:`, error);
      return [];
    }
  }

  /**
   * Отримує ступені зносу
   */
  static async getWearDegrees(): Promise<string[]> {
    try {
      return await ReferenceDataService.getWearDegrees();
    } catch (error) {
      console.error('Помилка при отриманні ступенів зносу:', error);
      return ['10%', '30%', '50%', '75%']; // Значення за замовчуванням
    }
  }

  /**
   * Отримує типи матеріалів
   */
  static async getMaterialTypes(): Promise<string[]> {
    try {
      const materialsMap = await ReferenceDataService.getMaterials();
      return Object.values(materialsMap);
    } catch (error) {
      console.error('Помилка при отриманні типів матеріалів:', error);
      return ['Бавовна', 'Шерсть', 'Шовк', 'Синтетика', 'Гладка шкіра', 'Нубук', 'Спілок', 'Замша']; // Значення за замовчуванням
    }
  }

  /**
   * Отримує типи наповнювачів
   */
  static async getFillerTypes(): Promise<string[]> {
    try {
      return await ReferenceDataService.getFillerTypes();
    } catch (error) {
      console.error('Помилка при отриманні типів наповнювачів:', error);
      return ['Пух', 'Синтепон', 'Інше']; // Значення за замовчуванням
    }
  }

  /**
   * Отримує базові кольори
   */
  static async getBaseColors(): Promise<string[]> {
    try {
      const colorsMap = await ReferenceDataService.getColors();
      return Object.values(colorsMap);
    } catch (error) {
      console.error('Помилка при отриманні базових кольорів:', error);
      return [
        'Білий',
        'Чорний',
        'Сірий',
        'Коричневий',
        'Синій',
        'Червоний',
        'Зелений',
        'Жовтий',
        'Рожевий',
        'Фіолетовий',
      ]; // Значення за замовчуванням
    }
  }

  /**
   * Отримує типи ризиків
   */
  static async getRiskTypes(): Promise<string[]> {
    try {
      return await ReferenceDataService.getRiskTypes();
    } catch (error) {
      console.error('Помилка при отриманні типів ризиків:', error);
      return [
        'Потертості',
        'Порване',
        'Відсутність фурнітури',
        'Пошкодження фурнітури',
        'Ризики зміни кольору',
        'Ризики деформації',
      ]; // Значення за замовчуванням
    }
  }

  /**
   * Фільтрує плями за рівнем ризику
   */
  static filterStainsByRiskLevel(
    stains: StainType[],
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  ): StainType[] {
    return stains.filter((stain) => stain.riskLevel === riskLevel);
  }

  /**
   * Фільтрує дефекти за рівнем ризику
   */
  static filterDefectsByRiskLevel(
    defects: DefectType[],
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  ): DefectType[] {
    return defects.filter((defect) => defect.riskLevel === riskLevel);
  }

  /**
   * Групує плями за рівнем ризику
   */
  static groupStainsByRiskLevel(
    stains: StainType[]
  ): Record<'LOW' | 'MEDIUM' | 'HIGH', StainType[]> {
    return stains.reduce(
      (groups, stain) => {
        if (!groups[stain.riskLevel]) {
          groups[stain.riskLevel] = [];
        }
        groups[stain.riskLevel].push(stain);
        return groups;
      },
      { LOW: [], MEDIUM: [], HIGH: [] } as Record<'LOW' | 'MEDIUM' | 'HIGH', StainType[]>
    );
  }

  /**
   * Групує дефекти за рівнем ризику
   */
  static groupDefectsByRiskLevel(
    defects: DefectType[]
  ): Record<'LOW' | 'MEDIUM' | 'HIGH', DefectType[]> {
    return defects.reduce(
      (groups, defect) => {
        if (!groups[defect.riskLevel]) {
          groups[defect.riskLevel] = [];
        }
        groups[defect.riskLevel].push(defect);
        return groups;
      },
      { LOW: [], MEDIUM: [], HIGH: [] } as Record<'LOW' | 'MEDIUM' | 'HIGH', DefectType[]>
    );
  }

  /**
   * Перевіряє чи є високоризикові плями
   */
  static hasHighRiskStains(stainIds: string[], allStains: StainType[]): boolean {
    const selectedStains = allStains.filter((stain) => stainIds.includes(stain.id));
    return selectedStains.some((stain) => stain.riskLevel === 'HIGH');
  }

  /**
   * Перевіряє чи є високоризикові дефекти
   */
  static hasHighRiskDefects(defectIds: string[], allDefects: DefectType[]): boolean {
    const selectedDefects = allDefects.filter((defect) => defectIds.includes(defect.id));
    return selectedDefects.some((defect) => defect.riskLevel === 'HIGH');
  }

  /**
   * Отримує найвищий рівень ризику серед вибраних плям
   */
  static getHighestRiskLevelForStains(
    stainIds: string[],
    allStains: StainType[]
  ): 'LOW' | 'MEDIUM' | 'HIGH' {
    const selectedStains = allStains.filter((stain) => stainIds.includes(stain.id));

    if (selectedStains.some((stain) => stain.riskLevel === 'HIGH')) return 'HIGH';
    if (selectedStains.some((stain) => stain.riskLevel === 'MEDIUM')) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Отримує найвищий рівень ризику серед вибраних дефектів
   */
  static getHighestRiskLevelForDefects(
    defectIds: string[],
    allDefects: DefectType[]
  ): 'LOW' | 'MEDIUM' | 'HIGH' {
    const selectedDefects = allDefects.filter((defect) => defectIds.includes(defect.id));

    if (selectedDefects.some((defect) => defect.riskLevel === 'HIGH')) return 'HIGH';
    if (selectedDefects.some((defect) => defect.riskLevel === 'MEDIUM')) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Створює опис проблем для квитанції
   */
  static createIssuesDescription(
    stainIds: string[],
    defectIds: string[],
    allStains: StainType[],
    allDefects: DefectType[]
  ): string {
    const selectedStains = allStains.filter((stain) => stainIds.includes(stain.id));
    const selectedDefects = allDefects.filter((defect) => defectIds.includes(defect.id));

    const parts: string[] = [];

    if (selectedStains.length > 0) {
      parts.push(`Плями: ${selectedStains.map((s) => s.name).join(', ')}`);
    }

    if (selectedDefects.length > 0) {
      parts.push(`Дефекти: ${selectedDefects.map((d) => d.name).join(', ')}`);
    }

    return parts.join('; ');
  }
}
