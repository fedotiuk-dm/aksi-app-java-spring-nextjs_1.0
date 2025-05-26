/**
 * @fileoverview Сервіс доступності філій
 * @module domain/wizard/services/branch/services/branch-availability
 */

import { branchRetrievalService } from './branch-retrieval.service';
import { OperationResultFactory } from '../../interfaces';

import type { OperationResult } from '../../interfaces';
import type { BranchAvailabilityDomain, DayScheduleDomain } from '../types';

/**
 * Константи
 */
const CONSTANTS = {
  ERROR_MESSAGES: {
    AVAILABILITY_CHECK_FAILED: 'Помилка перевірки доступності філії',
    BRANCH_NOT_FOUND: 'Філію не знайдено',
    UNKNOWN: 'Невідома помилка',
  },
  DAYS_OF_WEEK: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
} as const;

/**
 * Інтерфейс сервісу доступності філій
 */
export interface IBranchAvailabilityService {
  getBranchAvailability(branchId: string): Promise<OperationResult<BranchAvailabilityDomain>>;
  checkCurrentAvailability(
    schedule: DayScheduleDomain,
    currentTime: string
  ): {
    isOpen: boolean;
    status: 'OPEN' | 'CLOSED' | 'BREAK';
    nextChange?: { status: 'OPEN' | 'CLOSED' | 'BREAK'; time: string };
  };
  getCurrentDayName(date: Date): string;
  formatTime(date: Date): string;
}

/**
 * Сервіс доступності філій
 * Відповідальність: перевірка графіку роботи, розрахунок доступності
 */
export class BranchAvailabilityService implements IBranchAvailabilityService {
  public readonly name = 'BranchAvailabilityService';
  public readonly version = '1.0.0';

  /**
   * Перевірка доступності філії
   */
  async getBranchAvailability(
    branchId: string
  ): Promise<OperationResult<BranchAvailabilityDomain>> {
    try {
      const branchResult = await branchRetrievalService.getBranchById(branchId);
      if (!branchResult.success || !branchResult.data) {
        return OperationResultFactory.error(
          branchResult.error || CONSTANTS.ERROR_MESSAGES.BRANCH_NOT_FOUND
        );
      }

      const branch = branchResult.data;
      const now = new Date();
      const currentDayName = this.getCurrentDayName(now);
      const currentTime = this.formatTime(now);

      const todaySchedule = branch.workingHours[currentDayName as keyof typeof branch.workingHours];

      if (!todaySchedule || typeof todaySchedule === 'string' || !todaySchedule.isWorkingDay) {
        const defaultSchedule: DayScheduleDomain = { isWorkingDay: false };
        return OperationResultFactory.success({
          branchId,
          isOpen: false,
          currentStatus: 'CLOSED',
          todaySchedule:
            typeof todaySchedule === 'string' || !todaySchedule ? defaultSchedule : todaySchedule,
          nextStatusChange: undefined,
        });
      }

      const availability = this.checkCurrentAvailability(todaySchedule, currentTime);

      return OperationResultFactory.success({
        branchId,
        isOpen: availability.isOpen,
        currentStatus: availability.status,
        todaySchedule,
        nextStatusChange: availability.nextChange,
      });
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.AVAILABILITY_CHECK_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Перевірка поточної доступності за розкладом
   */
  checkCurrentAvailability(
    schedule: DayScheduleDomain,
    currentTime: string
  ): {
    isOpen: boolean;
    status: 'OPEN' | 'CLOSED' | 'BREAK';
    nextChange?: { status: 'OPEN' | 'CLOSED' | 'BREAK'; time: string };
  } {
    if (!schedule.isWorkingDay || !schedule.openTime || !schedule.closeTime) {
      return {
        isOpen: false,
        status: 'CLOSED',
        nextChange: undefined,
      };
    }

    const current = this.timeToMinutes(currentTime);
    const open = this.timeToMinutes(schedule.openTime);
    const close = this.timeToMinutes(schedule.closeTime);

    // Перевірка чи зараз робочий час
    if (current < open || current >= close) {
      return {
        isOpen: false,
        status: 'CLOSED',
        nextChange: current < open ? { status: 'OPEN', time: schedule.openTime } : undefined,
      };
    }

    // Перевірка перерви
    if (schedule.breakStart && schedule.breakEnd) {
      const breakStart = this.timeToMinutes(schedule.breakStart);
      const breakEnd = this.timeToMinutes(schedule.breakEnd);

      if (current >= breakStart && current < breakEnd) {
        return {
          isOpen: false,
          status: 'BREAK',
          nextChange: { status: 'OPEN', time: schedule.breakEnd },
        };
      }

      // Знаходження наступної перерви або закриття
      if (breakStart > current) {
        return {
          isOpen: true,
          status: 'OPEN',
          nextChange: { status: 'BREAK', time: schedule.breakStart },
        };
      }
    }

    return {
      isOpen: true,
      status: 'OPEN',
      nextChange: { status: 'CLOSED', time: schedule.closeTime },
    };
  }

  /**
   * Отримання назви поточного дня
   */
  getCurrentDayName(date: Date): string {
    return CONSTANTS.DAYS_OF_WEEK[date.getDay()];
  }

  /**
   * Форматування часу
   */
  formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5); // HH:MM
  }

  /**
   * Конвертація часу в хвилини
   */
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const branchAvailabilityService = new BranchAvailabilityService();
