/**
 * @fileoverview Сервіс філій
 * @module domain/wizard/services/branch/branch
 */

import { OperationResultFactory } from '../interfaces';

import type {
  BranchDomain,
  BranchSearchDomainParams,
  BranchSearchDomainResult,
  BranchAvailabilityDomain,
  BranchDistanceDomain,
  CoordinatesDomain,
  DayScheduleDomain,
} from './branch-domain.types';
import type { OperationResult } from '../interfaces';

/**
 * Константи
 */
const CONSTANTS = {
  ERROR_MESSAGES: {
    FETCH_FAILED: 'Помилка отримання філій',
    BRANCH_NOT_FOUND: 'Філію не знайдено',
    AVAILABILITY_CHECK_FAILED: 'Помилка перевірки доступності філії',
    DISTANCE_CALCULATION_FAILED: 'Помилка розрахунку відстані',
    INVALID_COORDINATES: 'Некоректні координати',
    UNKNOWN: 'Невідома помилка',
  },
  CACHE_TTL: 15 * 60 * 1000, // 15 хвилин
  DEFAULT_PAGE_SIZE: 20,
  MAX_DISTANCE_KM: 100,
} as const;

/**
 * Інтерфейс сервісу філій
 */
export interface IBranchService {
  getAllBranches(): Promise<OperationResult<BranchDomain[]>>;
  getActiveBranches(): Promise<OperationResult<BranchDomain[]>>;
  getBranchById(id: string): Promise<OperationResult<BranchDomain | null>>;
  searchBranches(
    params: BranchSearchDomainParams
  ): Promise<OperationResult<BranchSearchDomainResult>>;
  getBranchAvailability(branchId: string): Promise<OperationResult<BranchAvailabilityDomain>>;
  getBranchesWithService(serviceId: string): Promise<OperationResult<BranchDomain[]>>;
  calculateDistanceToBranches(
    userCoordinates: CoordinatesDomain
  ): Promise<OperationResult<BranchDistanceDomain[]>>;
  getNearestBranch(
    userCoordinates: CoordinatesDomain
  ): Promise<OperationResult<BranchDomain | null>>;
  clearCache(): void;
}

/**
 * Сервіс філій
 * Відповідальність: управління філіями, пошук, перевірка доступності
 */
export class BranchService implements IBranchService {
  public readonly name = 'BranchService';
  public readonly version = '1.0.0';

  private branchesCache: { data: BranchDomain[]; timestamp: number } | null = null;

  /**
   * Отримання всіх філій
   */
  async getAllBranches(): Promise<OperationResult<BranchDomain[]>> {
    try {
      // Перевірка кешу
      if (this.branchesCache && Date.now() - this.branchesCache.timestamp < CONSTANTS.CACHE_TTL) {
        return OperationResultFactory.success(this.branchesCache.data);
      }

      // TODO: Реалізувати адаптер getAllBranches
      // Тимчасова заглушка
      const apiBranches: any[] = [];
      const domainBranches = apiBranches.map(this.convertToDomainBranch);

      // Оновлення кешу
      this.branchesCache = {
        data: domainBranches,
        timestamp: Date.now(),
      };

      return OperationResultFactory.success(domainBranches);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.FETCH_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання активних філій
   */
  async getActiveBranches(): Promise<OperationResult<BranchDomain[]>> {
    try {
      const allBranchesResult = await this.getAllBranches();
      if (!allBranchesResult.success || !allBranchesResult.data) {
        return OperationResultFactory.error(
          allBranchesResult.error || CONSTANTS.ERROR_MESSAGES.FETCH_FAILED
        );
      }

      const activeBranches = allBranchesResult.data.filter((branch) => branch.isActive);
      return OperationResultFactory.success(activeBranches);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.FETCH_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання філії за ID
   */
  async getBranchById(id: string): Promise<OperationResult<BranchDomain | null>> {
    try {
      // TODO: Реалізувати адаптер getBranchById
      // Тимчасова заглушка
      const apiBranch: any = null;

      if (!apiBranch) {
        return OperationResultFactory.success(null);
      }

      const domainBranch = this.convertToDomainBranch(apiBranch);
      return OperationResultFactory.success(domainBranch);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.BRANCH_NOT_FOUND}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Пошук філій
   */
  async searchBranches(
    params: BranchSearchDomainParams
  ): Promise<OperationResult<BranchSearchDomainResult>> {
    try {
      const page = params.page || 0;
      const size = params.size || CONSTANTS.DEFAULT_PAGE_SIZE;

      // Адаптер викликається в хуках домену для отримання даних з API
      // Тимчасова заглушка з демонстраційними даними
      const mockBranches = this.getMockBranches();

      // Фільтрація за параметрами пошуку
      let filteredBranches = mockBranches;

      if (params.query) {
        const query = params.query.toLowerCase();
        filteredBranches = filteredBranches.filter(
          (branch) =>
            branch.name.toLowerCase().includes(query) ||
            branch.address.toLowerCase().includes(query)
        );
      }

      if (params.isActive !== undefined) {
        filteredBranches = filteredBranches.filter((branch) => branch.isActive === params.isActive);
      }

      // Пагінація
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedBranches = filteredBranches.slice(startIndex, endIndex);

      const searchResult: BranchSearchDomainResult = {
        branches: paginatedBranches.map(this.convertToDomainBranch),
        total: filteredBranches.length,
        page,
        size,
        hasMore: endIndex < filteredBranches.length,
      };

      return OperationResultFactory.success(searchResult);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.FETCH_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Перевірка доступності філії
   */
  async getBranchAvailability(
    branchId: string
  ): Promise<OperationResult<BranchAvailabilityDomain>> {
    try {
      const branchResult = await this.getBranchById(branchId);
      if (!branchResult.success || !branchResult.data) {
        return OperationResultFactory.error(
          branchResult.error || CONSTANTS.ERROR_MESSAGES.BRANCH_NOT_FOUND
        );
      }

      const branch = branchResult.data;
      const now = new Date();
      const currentDay = this.getCurrentDayName(now);
      const currentTime = this.formatTime(now);

      const todaySchedule =
        branch.workingHours[currentDay as keyof Omit<typeof branch.workingHours, 'holidays'>];

      // Перевірка що розклад існує
      if (!todaySchedule || typeof todaySchedule === 'string') {
        return OperationResultFactory.error('Розклад для поточного дня не знайдено');
      }

      const availability = this.calculateAvailability(todaySchedule, currentTime);

      const branchAvailability: BranchAvailabilityDomain = {
        branchId,
        isOpen: availability.isOpen,
        currentStatus: availability.status,
        nextStatusChange: availability.nextChange,
        todaySchedule,
      };

      return OperationResultFactory.success(branchAvailability);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.AVAILABILITY_CHECK_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання філій з певною послугою
   */
  async getBranchesWithService(serviceId: string): Promise<OperationResult<BranchDomain[]>> {
    try {
      const allBranchesResult = await this.getActiveBranches();
      if (!allBranchesResult.success || !allBranchesResult.data) {
        return OperationResultFactory.error(
          allBranchesResult.error || CONSTANTS.ERROR_MESSAGES.FETCH_FAILED
        );
      }

      const branchesWithService = allBranchesResult.data.filter((branch) =>
        branch.services.some((service) => service.serviceId === serviceId && service.isAvailable)
      );

      return OperationResultFactory.success(branchesWithService);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.FETCH_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Розрахунок відстані до філій
   */
  async calculateDistanceToBranches(
    userCoordinates: CoordinatesDomain
  ): Promise<OperationResult<BranchDistanceDomain[]>> {
    try {
      if (!this.isValidCoordinates(userCoordinates)) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.INVALID_COORDINATES);
      }

      const branchesResult = await this.getActiveBranches();
      if (!branchesResult.success || !branchesResult.data) {
        return OperationResultFactory.error(
          branchesResult.error || CONSTANTS.ERROR_MESSAGES.FETCH_FAILED
        );
      }

      const distances: BranchDistanceDomain[] = [];

      for (const branch of branchesResult.data) {
        if (branch.coordinates) {
          const distance = this.calculateDistance(userCoordinates, branch.coordinates);
          if (distance <= CONSTANTS.MAX_DISTANCE_KM) {
            distances.push({
              branchId: branch.id,
              distance,
              estimatedTravelTime: Math.round(distance * 2), // Приблизно 2 хвилини на км
            });
          }
        }
      }

      // Сортування за відстанню
      distances.sort((a, b) => a.distance - b.distance);

      return OperationResultFactory.success(distances);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.DISTANCE_CALCULATION_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання найближчої філії
   */
  async getNearestBranch(
    userCoordinates: CoordinatesDomain
  ): Promise<OperationResult<BranchDomain | null>> {
    try {
      const distancesResult = await this.calculateDistanceToBranches(userCoordinates);
      if (!distancesResult.success || !distancesResult.data || distancesResult.data.length === 0) {
        return OperationResultFactory.success(null);
      }

      const nearestBranchId = distancesResult.data[0].branchId;
      return await this.getBranchById(nearestBranchId);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.FETCH_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Очищення кешу
   */
  clearCache(): void {
    this.branchesCache = null;
  }

  /**
   * Конвертація API філії в доменний тип
   */
  private convertToDomainBranch(apiBranch: any): BranchDomain {
    return {
      id: apiBranch.id,
      name: apiBranch.name,
      code: apiBranch.code,
      address: apiBranch.address,
      phone: apiBranch.phone,
      email: apiBranch.email,
      workingHours: apiBranch.workingHours,
      isActive: apiBranch.isActive,
      isMainBranch: apiBranch.isMainBranch,
      coordinates: apiBranch.coordinates,
      manager: apiBranch.manager,
      services: apiBranch.services || [],
      createdAt: new Date(apiBranch.createdAt),
      updatedAt: new Date(apiBranch.updatedAt),
    };
  }

  /**
   * Отримання назви поточного дня
   */
  private getCurrentDayName(date: Date): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  }

  /**
   * Форматування часу
   */
  private formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5); // HH:mm
  }

  /**
   * Розрахунок доступності
   */
  private calculateAvailability(
    schedule: DayScheduleDomain,
    currentTime: string
  ): {
    isOpen: boolean;
    status: 'OPEN' | 'CLOSED' | 'BREAK';
    nextChange?: { status: 'OPEN' | 'CLOSED' | 'BREAK'; time: string };
  } {
    if (!schedule.isWorkingDay) {
      return { isOpen: false, status: 'CLOSED' };
    }

    // TODO: Реалізувати логіку розрахунку доступності
    return { isOpen: true, status: 'OPEN' };
  }

  /**
   * Валідація координат
   */
  private isValidCoordinates(coordinates: CoordinatesDomain): boolean {
    return (
      coordinates.latitude >= -90 &&
      coordinates.latitude <= 90 &&
      coordinates.longitude >= -180 &&
      coordinates.longitude <= 180
    );
  }

  /**
   * Розрахунок відстані між координатами (формула Haversine)
   */
  private calculateDistance(coord1: CoordinatesDomain, coord2: CoordinatesDomain): number {
    const R = 6371; // Радіус Землі в км
    const dLat = this.toRadians(coord2.latitude - coord1.latitude);
    const dLon = this.toRadians(coord2.longitude - coord1.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.latitude)) *
        Math.cos(this.toRadians(coord2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 100) / 100; // Округлення до 2 знаків після коми
  }

  /**
   * Конвертація градусів в радіани
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const branchService = new BranchService();
