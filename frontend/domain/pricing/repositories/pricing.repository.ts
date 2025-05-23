/**
 * Репозиторій для роботи з Pricing API
 * Інкапсулює всі операції з ціноутворенням та забезпечує єдиний інтерфейс доступу до даних
 */

import { PricingApiService, ModifierRecommendationService } from '@/lib/api';

import {
  PricingApiToDomainAdapter,
  PricingDomainToApiAdapter,
  PricingAdapterFactory,
  AdapterUtils,
} from '../utils/api.adapter';

import type {
  PriceListItem,
  ServiceCategory,
  PriceModifier,
  StainType,
  DefectType,
  PriceCalculationRequest,
  PriceCalculationResponse,
  ServiceCategoryCode,
  ModifierCode,
  ModifierCategory,
  ModifierSearchParams,
  RecommendationParams,
} from '../types/pricing.types';

/**
 * Інтерфейс репозиторію для pricing
 */
export interface IPricingRepository {
  // Прайс-лист
  getPriceListItemById(itemId: string): Promise<PriceListItem>;
  getPriceListItemsByCategory(categoryCode: ServiceCategoryCode): Promise<PriceListItem[]>;
  getBasePrice(
    categoryCode: ServiceCategoryCode,
    itemName: string,
    color?: string
  ): Promise<number>;

  // Категорії послуг
  getAllServiceCategories(): Promise<ServiceCategory[]>;
  getActiveServiceCategories(): Promise<ServiceCategory[]>;
  getServiceCategoryById(id: string): Promise<ServiceCategory>;
  getServiceCategoryByCode(code: ServiceCategoryCode): Promise<ServiceCategory>;
  getMaterialsForCategory(categoryCode: ServiceCategoryCode): Promise<string[]>;

  // Модифікатори
  getModifiersForServiceCategory(categoryCode: ServiceCategoryCode): Promise<PriceModifier[]>;
  getModifierByCode(code: ModifierCode): Promise<PriceModifier>;
  getModifiersByCategory(category: ModifierCategory): Promise<PriceModifier[]>;
  searchModifiers(params: ModifierSearchParams): Promise<PriceModifier[]>;
  getAvailableModifiersForCategory(categoryCode: ServiceCategoryCode): Promise<string[]>;

  // Забруднення та дефекти
  getStainTypes(activeOnly?: boolean, riskLevel?: string): Promise<StainType[]>;
  getStainTypeByCode(code: string): Promise<StainType>;
  getDefectTypes(activeOnly?: boolean, riskLevel?: string): Promise<DefectType[]>;
  getDefectTypeByCode(code: string): Promise<DefectType>;

  // Розрахунки та рекомендації
  calculatePrice(request: PriceCalculationRequest): Promise<PriceCalculationResponse>;
  getRiskWarnings(params: RecommendationParams): Promise<string[]>;
  getRecommendedModifiers(params: RecommendationParams): Promise<PriceModifier[]>;

  // Додаткові методи з ModifierRecommendationService
  getRecommendedModifiersForStains(
    stains: string[],
    categoryCode?: ServiceCategoryCode,
    materialType?: string
  ): Promise<Record<string, unknown>>;
  getRecommendedModifiersForDefects(
    defects: string[],
    categoryCode?: ServiceCategoryCode,
    materialType?: string
  ): Promise<Record<string, unknown>>;
  getRiskWarningsForItem(
    stains?: string[],
    defects?: string[],
    materialType?: string,
    categoryCode?: ServiceCategoryCode
  ): Promise<Record<string, unknown>>;
}

/**
 * Реалізація репозиторію для роботи з Pricing API
 */
export class PricingRepository implements IPricingRepository {
  private readonly apiToDomainAdapter: PricingApiToDomainAdapter;
  private readonly domainToApiAdapter: PricingDomainToApiAdapter;

  constructor() {
    this.apiToDomainAdapter = PricingAdapterFactory.getApiToDomainAdapter();
    this.domainToApiAdapter = PricingAdapterFactory.getDomainToApiAdapter();
  }

  // ============= ПРАЙС-ЛИСТ =============

  /**
   * Отримати елемент прайс-листа за ID
   */
  async getPriceListItemById(itemId: string): Promise<PriceListItem> {
    try {
      const dto = await PricingApiService.getItemById({ itemId });
      return this.apiToDomainAdapter.toPriceListItem(dto);
    } catch (error) {
      throw this.handleApiError(error, `Помилка отримання елемента прайс-листа з ID ${itemId}`);
    }
  }

  /**
   * Отримати елементи прайс-листа за категорією
   */
  async getPriceListItemsByCategory(categoryCode: ServiceCategoryCode): Promise<PriceListItem[]> {
    try {
      const dtos = await PricingApiService.getItemsByCategoryCode({ categoryCode });
      return AdapterUtils.safeMapArray(
        dtos,
        (dto) => this.apiToDomainAdapter.toPriceListItem(dto),
        []
      );
    } catch (error) {
      throw this.handleApiError(
        error,
        `Помилка отримання прайс-листа для категорії ${categoryCode}`
      );
    }
  }

  /**
   * Отримати базову ціну
   */
  async getBasePrice(
    categoryCode: ServiceCategoryCode,
    itemName: string,
    color?: string
  ): Promise<number> {
    try {
      return await PricingApiService.getBasePrice({ categoryCode, itemName, color });
    } catch (error) {
      throw this.handleApiError(error, `Помилка отримання базової ціни для ${itemName}`);
    }
  }

  // ============= КАТЕГОРІЇ ПОСЛУГ =============

  /**
   * Отримати всі категорії послуг
   */
  async getAllServiceCategories(): Promise<ServiceCategory[]> {
    try {
      const dtos = await PricingApiService.getAllCategories();
      return AdapterUtils.safeMapArray(
        dtos,
        (dto) => this.apiToDomainAdapter.toServiceCategory(dto),
        []
      );
    } catch (error) {
      throw this.handleApiError(error, 'Помилка отримання категорій послуг');
    }
  }

  /**
   * Отримати активні категорії послуг
   */
  async getActiveServiceCategories(): Promise<ServiceCategory[]> {
    try {
      const dtos = await PricingApiService.getActiveCategories();
      return AdapterUtils.safeMapArray(
        dtos,
        (dto) => this.apiToDomainAdapter.toServiceCategory(dto),
        []
      );
    } catch (error) {
      throw this.handleApiError(error, 'Помилка отримання активних категорій послуг');
    }
  }

  /**
   * Отримати категорію послуг за ID
   */
  async getServiceCategoryById(id: string): Promise<ServiceCategory> {
    try {
      const dto = await PricingApiService.getCategoryById({ id });
      return this.apiToDomainAdapter.toServiceCategory(dto);
    } catch (error) {
      throw this.handleApiError(error, `Помилка отримання категорії з ID ${id}`);
    }
  }

  /**
   * Отримати категорію послуг за кодом
   */
  async getServiceCategoryByCode(code: ServiceCategoryCode): Promise<ServiceCategory> {
    try {
      const dto = await PricingApiService.getCategoryByCode({ code });
      return this.apiToDomainAdapter.toServiceCategory(dto);
    } catch (error) {
      throw this.handleApiError(error, `Помилка отримання категорії з кодом ${code}`);
    }
  }

  /**
   * Отримати матеріали для категорії
   */
  async getMaterialsForCategory(categoryCode: ServiceCategoryCode): Promise<string[]> {
    try {
      return await PricingApiService.getMaterialsForCategory({ categoryCode });
    } catch (error) {
      throw this.handleApiError(
        error,
        `Помилка отримання матеріалів для категорії ${categoryCode}`
      );
    }
  }

  // ============= МОДИФІКАТОРИ =============

  /**
   * Отримати модифікатори для категорії послуг
   */
  async getModifiersForServiceCategory(
    categoryCode: ServiceCategoryCode
  ): Promise<PriceModifier[]> {
    try {
      const dtos = await PricingApiService.getModifiersForServiceCategory({ categoryCode });
      return AdapterUtils.safeMapArray(
        dtos,
        (dto) => this.apiToDomainAdapter.toPriceModifier(dto),
        []
      );
    } catch (error) {
      throw this.handleApiError(
        error,
        `Помилка отримання модифікаторів для категорії ${categoryCode}`
      );
    }
  }

  /**
   * Отримати модифікатор за кодом
   */
  async getModifierByCode(code: ModifierCode): Promise<PriceModifier> {
    try {
      const dto = await PricingApiService.getModifierByCode({ code });
      return this.apiToDomainAdapter.toPriceModifier(dto);
    } catch (error) {
      throw this.handleApiError(error, `Помилка отримання модифікатора з кодом ${code}`);
    }
  }

  /**
   * Отримати модифікатори за категорією
   */
  async getModifiersByCategory(category: ModifierCategory): Promise<PriceModifier[]> {
    try {
      const categoryParam = category as 'GENERAL' | 'TEXTILE' | 'LEATHER';
      const dtos = await PricingApiService.getModifiersByCategory({ category: categoryParam });
      return AdapterUtils.safeMapArray(
        dtos,
        (dto) => this.apiToDomainAdapter.toPriceModifier(dto),
        []
      );
    } catch (error) {
      throw this.handleApiError(error, `Помилка отримання модифікаторів категорії ${category}`);
    }
  }

  /**
   * Пошук модифікаторів
   */
  async searchModifiers(params: ModifierSearchParams): Promise<PriceModifier[]> {
    try {
      const searchParams = {
        query: params.query,
        category: params.category as 'GENERAL' | 'TEXTILE' | 'LEATHER' | undefined,
        active: params.active,
        page: params.page,
        size: params.size,
        sortBy: params.sortBy,
        sortDirection: params.sortDirection,
      };

      const dtos = await PricingApiService.searchModifiers(searchParams);
      return AdapterUtils.safeMapArray(
        dtos,
        (dto) => this.apiToDomainAdapter.toPriceModifier(dto),
        []
      );
    } catch (error) {
      throw this.handleApiError(error, 'Помилка пошуку модифікаторів');
    }
  }

  /**
   * Отримати доступні модифікатори для категорії
   */
  async getAvailableModifiersForCategory(categoryCode: ServiceCategoryCode): Promise<string[]> {
    try {
      return await PricingApiService.getAvailableModifiersForCategory({ categoryCode });
    } catch (error) {
      throw this.handleApiError(
        error,
        `Помилка отримання доступних модифікаторів для категорії ${categoryCode}`
      );
    }
  }

  // ============= ЗАБРУДНЕННЯ ТА ДЕФЕКТИ =============

  /**
   * Отримати типи забруднень
   */
  async getStainTypes(activeOnly: boolean = true, riskLevel?: string): Promise<StainType[]> {
    try {
      const riskParam = riskLevel as 'LOW' | 'MEDIUM' | 'HIGH' | undefined;
      const dtos = await PricingApiService.getStainTypes({ activeOnly, riskLevel: riskParam });
      return AdapterUtils.safeMapArray(dtos, (dto) => this.apiToDomainAdapter.toStainType(dto), []);
    } catch (error) {
      throw this.handleApiError(error, 'Помилка отримання типів забруднень');
    }
  }

  /**
   * Отримати тип забруднення за кодом
   */
  async getStainTypeByCode(code: string): Promise<StainType> {
    try {
      const dto = await PricingApiService.getStainTypeByCode({ code });
      return this.apiToDomainAdapter.toStainType(dto);
    } catch (error) {
      throw this.handleApiError(error, `Помилка отримання типу забруднення з кодом ${code}`);
    }
  }

  /**
   * Отримати типи дефектів
   */
  async getDefectTypes(activeOnly: boolean = true, riskLevel?: string): Promise<DefectType[]> {
    try {
      const riskParam = riskLevel as 'LOW' | 'MEDIUM' | 'HIGH' | undefined;
      const dtos = await PricingApiService.getDefectTypes({ activeOnly, riskLevel: riskParam });
      return AdapterUtils.safeMapArray(
        dtos,
        (dto) => this.apiToDomainAdapter.toDefectType(dto),
        []
      );
    } catch (error) {
      throw this.handleApiError(error, 'Помилка отримання типів дефектів');
    }
  }

  /**
   * Отримати тип дефекту за кодом
   */
  async getDefectTypeByCode(code: string): Promise<DefectType> {
    try {
      const dto = await PricingApiService.getDefectTypeByCode({ code });
      return this.apiToDomainAdapter.toDefectType(dto);
    } catch (error) {
      throw this.handleApiError(error, `Помилка отримання типу дефекту з кодом ${code}`);
    }
  }

  // ============= РОЗРАХУНКИ ТА РЕКОМЕНДАЦІЇ =============

  /**
   * Розрахувати ціну
   */
  async calculatePrice(request: PriceCalculationRequest): Promise<PriceCalculationResponse> {
    try {
      const requestDto = this.domainToApiAdapter.fromPriceCalculationRequest(request);
      const responseDto = await PricingApiService.calculatePrice({ requestBody: requestDto });
      return this.apiToDomainAdapter.toPriceCalculationResponse(responseDto);
    } catch (error) {
      throw this.handleApiError(error, 'Помилка розрахунку ціни');
    }
  }

  /**
   * Отримати попередження про ризики
   */
  async getRiskWarnings(params: RecommendationParams): Promise<string[]> {
    try {
      return await PricingApiService.getRiskWarnings({
        stains: params.stains,
        defects: params.defects,
        categoryCode: params.categoryCode,
        materialType: params.materialType,
      });
    } catch (error) {
      throw this.handleApiError(error, 'Помилка отримання попереджень про ризики');
    }
  }

  /**
   * Отримати рекомендовані модифікатори
   */
  async getRecommendedModifiers(params: RecommendationParams): Promise<PriceModifier[]> {
    try {
      const dtos = await PricingApiService.getRecommendedModifiers({
        stains: params.stains,
        defects: params.defects,
        categoryCode: params.categoryCode,
        materialType: params.materialType,
      });
      return AdapterUtils.safeMapArray(
        dtos,
        (dto) => this.apiToDomainAdapter.toPriceModifier(dto),
        []
      );
    } catch (error) {
      throw this.handleApiError(error, 'Помилка отримання рекомендованих модифікаторів');
    }
  }

  // ============= ОБРОБКА ПОМИЛОК =============

  /**
   * Обробити помилку API та перетворити в доменну помилку
   */
  private handleApiError(error: unknown, context: string): Error {
    if (error instanceof Error) {
      return new Error(`${context}: ${error.message}`);
    }
    return new Error(`${context}: Невідома помилка`);
  }

  // ============= ДОДАТКОВІ МЕТОДИ З ModifierRecommendationService =============

  /**
   * Отримати рекомендовані модифікатори для забруднень
   */
  async getRecommendedModifiersForStains(
    stains: string[],
    categoryCode?: ServiceCategoryCode,
    materialType?: string
  ): Promise<Record<string, unknown>> {
    try {
      return await ModifierRecommendationService.getRecommendedModifiersForStains({
        stains,
        categoryCode,
        materialType,
      });
    } catch (error) {
      throw this.handleApiError(
        error,
        'Помилка отримання рекомендованих модифікаторів для забруднень'
      );
    }
  }

  /**
   * Отримати рекомендовані модифікатори для дефектів
   */
  async getRecommendedModifiersForDefects(
    defects: string[],
    categoryCode?: ServiceCategoryCode,
    materialType?: string
  ): Promise<Record<string, unknown>> {
    try {
      return await ModifierRecommendationService.getRecommendedModifiersForDefects({
        defects,
        categoryCode,
        materialType,
      });
    } catch (error) {
      throw this.handleApiError(
        error,
        'Помилка отримання рекомендованих модифікаторів для дефектів'
      );
    }
  }

  /**
   * Отримати попередження про ризики для предмета
   */
  async getRiskWarningsForItem(
    stains?: string[],
    defects?: string[],
    materialType?: string,
    categoryCode?: ServiceCategoryCode
  ): Promise<Record<string, unknown>> {
    try {
      return await ModifierRecommendationService.getRiskWarningsForItem({
        stains,
        defects,
        materialType,
        categoryCode,
      });
    } catch (error) {
      throw this.handleApiError(error, 'Помилка отримання попереджень про ризики для предмета');
    }
  }
}

/**
 * Фабрика для створення екземпляра репозиторію
 */
export class PricingRepositoryFactory {
  private static instance: IPricingRepository;

  /**
   * Отримати екземпляр репозиторію (singleton)
   */
  static getInstance(): IPricingRepository {
    if (!this.instance) {
      this.instance = new PricingRepository();
    }
    return this.instance;
  }

  /**
   * Створити новий екземпляр репозиторію
   */
  static createInstance(): IPricingRepository {
    return new PricingRepository();
  }
}
