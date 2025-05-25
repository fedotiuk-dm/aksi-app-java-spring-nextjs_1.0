/**
 * @fileoverview Композиційний адаптер філій (зворотна сумісність)
 * @module domain/wizard/adapters/branch-adapters
 */

import { BranchApiOperationsAdapter } from './api-operations.adapter';
import { BranchMappingAdapter } from './mapping.adapter';

import type { BranchCreateRequest, BranchUpdateRequest } from './mapping.adapter';
import type { Branch } from '../../types/wizard-step-states.types';

/**
 * Композиційний адаптер філій для зворотної сумісності
 *
 * Відповідальність:
 * - Делегування до спеціалізованих адаптерів
 * - Збереження існуючого API
 * - Уніфікований доступ до функціональності
 */
export class BranchAdapter {
  // === ДЕЛЕГУВАННЯ ДО MAPPING ADAPTER ===

  /**
   * Перетворює API філію у доменний тип
   */
  static branchToDomain = BranchMappingAdapter.branchToDomain;

  /**
   * Перетворює API філію у доменний тип (зворотна сумісність)
   */
  static toDomain = BranchMappingAdapter.branchToDomain;

  /**
   * Перетворює доменний запит створення у API формат
   */
  static branchCreateRequestToApi = BranchMappingAdapter.branchCreateRequestToApi;

  /**
   * Перетворює доменний запит оновлення у API формат
   */
  static branchUpdateRequestToApi = BranchMappingAdapter.branchUpdateRequestToApi;

  /**
   * Перетворює масив API філій у доменні типи
   */
  static branchesToDomain = BranchMappingAdapter.branchesToDomain;

  // === ДЕЛЕГУВАННЯ ДО API OPERATIONS ADAPTER ===

  /**
   * Отримує всі філії
   */
  static getAllBranches = BranchApiOperationsAdapter.getAllBranches;

  /**
   * Отримує активні філії
   */
  static getActiveBranches = BranchApiOperationsAdapter.getActiveBranches;

  /**
   * Отримує філію за ID
   */
  static getBranchById = BranchApiOperationsAdapter.getBranchById;

  /**
   * Отримує філію за кодом
   */
  static getBranchByCode = BranchApiOperationsAdapter.getBranchByCode;

  /**
   * Створює нову філію
   */
  static createBranch = BranchApiOperationsAdapter.createBranch;

  /**
   * Оновлює філію
   */
  static updateBranch = BranchApiOperationsAdapter.updateBranch;

  /**
   * Встановлює статус активності філії
   */
  static setActiveStatus = BranchApiOperationsAdapter.setActiveStatus;

  /**
   * Видаляє філію
   */
  static deleteBranch = BranchApiOperationsAdapter.deleteBranch;

  // === УТИЛІТАРНІ МЕТОДИ ===

  /**
   * Нормалізує дані філії перед відправкою
   */
  static normalizeBranchData = BranchApiOperationsAdapter.normalizeBranchData;

  /**
   * Перевіряє чи існує філія з таким кодом
   */
  static checkBranchCodeExists = BranchApiOperationsAdapter.checkBranchCodeExists;

  /**
   * Пошук філій за назвою
   */
  static searchBranchesByName = BranchApiOperationsAdapter.searchBranchesByName;

  /**
   * Нормалізує код філії
   */
  static normalizeBranchCode = BranchMappingAdapter.normalizeBranchCode;

  /**
   * Нормалізує номер телефону філії
   */
  static normalizeBranchPhone = BranchMappingAdapter.normalizeBranchPhone;

  /**
   * Створює відображуване ім'я філії
   */
  static createDisplayName = BranchMappingAdapter.createDisplayName;

  /**
   * Створює короткий опис філії
   */
  static createShortDescription = BranchMappingAdapter.createShortDescription;

  /**
   * Створює повний опис філії
   */
  static createFullDescription = BranchMappingAdapter.createFullDescription;

  /**
   * Фільтрує активні філії
   */
  static filterActiveBranches = BranchMappingAdapter.filterActiveBranches;

  /**
   * Сортує філії за кодом
   */
  static sortBranchesByCode = BranchMappingAdapter.sortBranchesByCode;

  /**
   * Знаходить філію за кодом
   */
  static findBranchByCode = BranchMappingAdapter.findBranchByCode;

  /**
   * Валідує код філії
   */
  static validateBranchCode = BranchMappingAdapter.validateBranchCode;

  /**
   * Валідує номер телефону
   */
  static validateBranchPhone = BranchMappingAdapter.validateBranchPhone;
}
