/**
 * @fileoverview Композиційний адаптер ціноутворення (зворотна сумісність)
 * @module domain/wizard/adapters/pricing-adapters
 */

import { PricingCalculationAdapter } from './calculation.adapter';
import { PricingCategoriesAdapter } from './categories.adapter';
import { PricingIssuesAdapter } from './issues.adapter';
import { PricingMappingAdapter } from './mapping.adapter';

// Типи автоматично виводяться TypeScript при делегуванні методів

/**
 * Композиційний адаптер ціноутворення для зворотної сумісності
 *
 * Відповідальність:
 * - Делегування до спеціалізованих адаптерів
 * - Збереження існуючого API
 * - Уніфікований доступ до функціональності
 */
export class PricingAdapter {
  // === ДЕЛЕГУВАННЯ ДО MAPPING ADAPTER ===

  /**
   * Перетворює API категорію послуг у доменний тип
   */
  static serviceCategoryToDomain = PricingMappingAdapter.serviceCategoryToDomain;

  /**
   * Перетворює API елемент прайс-листа у доменний тип
   */
  static priceListItemToDomain = PricingMappingAdapter.priceListItemToDomain;

  /**
   * Перетворює API модифікатор ціни у доменний тип
   */
  static priceModifierToDomain = PricingMappingAdapter.priceModifierToDomain;

  /**
   * Перетворює доменний запит розрахунку у API формат
   */
  static priceCalculationRequestToApi = PricingMappingAdapter.priceCalculationRequestToApi;

  /**
   * Перетворює API відповідь розрахунку у доменний тип
   */
  static priceCalculationResponseToDomain = PricingMappingAdapter.priceCalculationResponseToDomain;

  // === ДЕЛЕГУВАННЯ ДО CALCULATION ADAPTER ===

  /**
   * Розраховує ціну для предмета з модифікаторами
   */
  static calculatePrice = PricingCalculationAdapter.calculatePrice;

  /**
   * Отримує модифікатори для категорії послуг
   */
  static getModifiersForCategory = PricingCalculationAdapter.getModifiersForCategory;

  /**
   * Отримує всі доступні модифікатори
   */
  static getAllModifiers = PricingCalculationAdapter.getAllModifiers;

  /**
   * Отримує рекомендовані модифікатори на основі плям
   */
  static getRecommendedModifiersForStains =
    PricingCalculationAdapter.getRecommendedModifiersForStains;

  // === ДЕЛЕГУВАННЯ ДО CATEGORIES ADAPTER ===

  /**
   * Отримує всі категорії послуг
   */
  static getAllCategories = PricingCategoriesAdapter.getAllCategories;

  /**
   * Отримує активні категорії послуг
   */
  static getActiveCategories = PricingCategoriesAdapter.getActiveCategories;

  /**
   * Отримує категорію за кодом
   */
  static getCategoryByCode = PricingCategoriesAdapter.getCategoryByCode;

  /**
   * Отримує елементи прайс-листа для категорії
   */
  static getPriceListItemsForCategory = PricingCategoriesAdapter.getPriceListItemsForCategory;

  /**
   * Отримує доступні матеріали для категорії
   */
  static getMaterialsForCategory = PricingCategoriesAdapter.getMaterialsForCategory;

  // === ДЕЛЕГУВАННЯ ДО ISSUES ADAPTER ===

  /**
   * Отримує активні типи плям
   */
  static getActiveStainTypes = PricingIssuesAdapter.getActiveStainTypes;

  /**
   * Отримує активні типи дефектів
   */
  static getActiveDefectTypes = PricingIssuesAdapter.getActiveDefectTypes;

  /**
   * Отримує ступені зносу
   */
  static getWearDegrees = PricingIssuesAdapter.getWearDegrees;

  /**
   * Отримує типи матеріалів
   */
  static getMaterialTypes = PricingIssuesAdapter.getMaterialTypes;

  /**
   * Отримує базові кольори
   */
  static getBaseColors = PricingIssuesAdapter.getBaseColors;

  // === УТИЛІТАРНІ МЕТОДИ ===

  /**
   * Валідує запит розрахунку ціни
   */
  static validateCalculationRequest = PricingCalculationAdapter.validateCalculationRequest;

  /**
   * Створює базовий запит розрахунку ціни
   */
  static createBasicCalculationRequest = PricingCalculationAdapter.createBasicCalculationRequest;

  /**
   * Фільтрує активні категорії
   */
  static filterActiveCategories = PricingCategoriesAdapter.filterActiveCategories;

  /**
   * Сортує категорії за порядком сортування
   */
  static sortCategoriesByOrder = PricingCategoriesAdapter.sortCategoriesByOrder;

  /**
   * Перевіряє чи є високоризикові плями
   */
  static hasHighRiskStains = PricingIssuesAdapter.hasHighRiskStains;

  /**
   * Перевіряє чи є високоризикові дефекти
   */
  static hasHighRiskDefects = PricingIssuesAdapter.hasHighRiskDefects;

  /**
   * Створює опис проблем для квитанції
   */
  static createIssuesDescription = PricingIssuesAdapter.createIssuesDescription;
}
