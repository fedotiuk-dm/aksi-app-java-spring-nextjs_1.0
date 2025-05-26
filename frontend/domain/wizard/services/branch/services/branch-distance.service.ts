/**
 * @fileoverview Сервіс розрахунку відстаней до філій
 * @module domain/wizard/services/branch/services/branch-distance
 */

import { branchRetrievalService } from './branch-retrieval.service';
import { OperationResultFactory } from '../../interfaces';

import type { OperationResult } from '../../interfaces';
import type { BranchDomain, BranchDistanceDomain, CoordinatesDomain } from '../types';

/**
 * Константи
 */
const CONSTANTS = {
  ERROR_MESSAGES: {
    DISTANCE_CALCULATION_FAILED: 'Помилка розрахунку відстані',
    INVALID_COORDINATES: 'Некоректні координати',
    UNKNOWN: 'Невідома помилка',
  },
  MAX_DISTANCE_KM: 100,
  EARTH_RADIUS_KM: 6371,
} as const;

/**
 * Інтерфейс сервісу розрахунку відстаней
 */
export interface IBranchDistanceService {
  calculateDistanceToBranches(
    userCoordinates: CoordinatesDomain
  ): Promise<OperationResult<BranchDistanceDomain[]>>;
  getNearestBranch(
    userCoordinates: CoordinatesDomain
  ): Promise<OperationResult<BranchDomain | null>>;
  calculateDistance(coord1: CoordinatesDomain, coord2: CoordinatesDomain): number;
  isValidCoordinates(coordinates: CoordinatesDomain): boolean;
}

/**
 * Сервіс розрахунку відстаней до філій
 * Відповідальність: розрахунок відстаней, пошук найближчої філії
 */
export class BranchDistanceService implements IBranchDistanceService {
  public readonly name = 'BranchDistanceService';
  public readonly version = '1.0.0';

  /**
   * Розрахунок відстаней до всіх філій
   */
  async calculateDistanceToBranches(
    userCoordinates: CoordinatesDomain
  ): Promise<OperationResult<BranchDistanceDomain[]>> {
    try {
      if (!this.isValidCoordinates(userCoordinates)) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.INVALID_COORDINATES);
      }

      const branchesResult = await branchRetrievalService.getActiveBranches();
      if (!branchesResult.success || !branchesResult.data) {
        return OperationResultFactory.error(
          branchesResult.error || CONSTANTS.ERROR_MESSAGES.DISTANCE_CALCULATION_FAILED
        );
      }

      const branchDistances: BranchDistanceDomain[] = branchesResult.data
        .filter((branch) => branch.coordinates && this.isValidCoordinates(branch.coordinates))
        .map((branch) => {
          const distance = this.calculateDistance(
            userCoordinates,
            branch.coordinates as CoordinatesDomain
          );
          return {
            branchId: branch.id,
            distance,
            estimatedTravelTime: this.estimateTravelTime(distance),
          };
        })
        .filter((item) => item.distance <= CONSTANTS.MAX_DISTANCE_KM)
        .sort((a, b) => a.distance - b.distance);

      return OperationResultFactory.success(branchDistances);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.DISTANCE_CALCULATION_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Пошук найближчої філії
   */
  async getNearestBranch(
    userCoordinates: CoordinatesDomain
  ): Promise<OperationResult<BranchDomain | null>> {
    try {
      const distancesResult = await this.calculateDistanceToBranches(userCoordinates);
      if (!distancesResult.success || !distancesResult.data) {
        return OperationResultFactory.error(
          distancesResult.error || CONSTANTS.ERROR_MESSAGES.DISTANCE_CALCULATION_FAILED
        );
      }

      const nearest = distancesResult.data[0];
      if (!nearest) {
        return OperationResultFactory.success(null);
      }

      // Отримуємо повну інформацію про філію за ID
      const branchResult = await branchRetrievalService.getBranchById(nearest.branchId);
      return OperationResultFactory.success(
        branchResult.success && branchResult.data ? branchResult.data : null
      );
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.DISTANCE_CALCULATION_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Розрахунок відстані між двома точками (формула Haversine)
   */
  calculateDistance(coord1: CoordinatesDomain, coord2: CoordinatesDomain): number {
    const lat1Rad = this.toRadians(coord1.latitude);
    const lat2Rad = this.toRadians(coord2.latitude);
    const deltaLatRad = this.toRadians(coord2.latitude - coord1.latitude);
    const deltaLonRad = this.toRadians(coord2.longitude - coord1.longitude);

    const a =
      Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = CONSTANTS.EARTH_RADIUS_KM * c;

    return Math.round(distance * 100) / 100; // Округлення до 2 знаків після коми
  }

  /**
   * Валідація координат
   */
  isValidCoordinates(coordinates: CoordinatesDomain): boolean {
    return (
      coordinates &&
      typeof coordinates.latitude === 'number' &&
      typeof coordinates.longitude === 'number' &&
      coordinates.latitude >= -90 &&
      coordinates.latitude <= 90 &&
      coordinates.longitude >= -180 &&
      coordinates.longitude <= 180
    );
  }

  /**
   * Конвертація градусів в радіани
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Оцінка часу в дорозі (приблизно)
   */
  private estimateTravelTime(distanceKm: number): number {
    // Припускаємо середню швидкість 30 км/год в місті
    const averageSpeedKmh = 30;
    const timeHours = distanceKm / averageSpeedKmh;
    return Math.round(timeHours * 60); // Повертаємо хвилини
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const branchDistanceService = new BranchDistanceService();
