/**
 * @fileoverview Основні доменні типи філій
 * @module domain/wizard/services/branch/types/branch-core
 */

/**
 * Доменна модель філії
 */
export interface BranchDomain {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email?: string;
  workingHours: WorkingHoursDomain;
  isActive: boolean;
  isMainBranch: boolean;
  coordinates?: CoordinatesDomain;
  manager?: BranchManagerDomain;
  services: BranchServiceDomain[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Робочі години філії
 */
export interface WorkingHoursDomain {
  monday: DayScheduleDomain;
  tuesday: DayScheduleDomain;
  wednesday: DayScheduleDomain;
  thursday: DayScheduleDomain;
  friday: DayScheduleDomain;
  saturday: DayScheduleDomain;
  sunday: DayScheduleDomain;
  holidays?: string; // Опис роботи в свята
}

/**
 * Розклад на день
 */
export interface DayScheduleDomain {
  isWorkingDay: boolean;
  openTime?: string; // HH:mm формат
  closeTime?: string; // HH:mm формат
  breakStart?: string; // HH:mm формат
  breakEnd?: string; // HH:mm формат
}

/**
 * Координати філії
 */
export interface CoordinatesDomain {
  latitude: number;
  longitude: number;
}

/**
 * Менеджер філії
 */
export interface BranchManagerDomain {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
}

/**
 * Послуга філії
 */
export interface BranchServiceDomain {
  serviceId: string;
  serviceName: string;
  categoryId: string;
  categoryName: string;
  isAvailable: boolean;
  estimatedDuration: number; // в годинах
  notes?: string;
}
