/**
 * @fileoverview Доменні типи для філій
 * @module domain/wizard/services/branch/types
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

/**
 * Запит на створення філії
 */
export interface CreateBranchDomainRequest {
  name: string;
  code: string;
  address: string;
  phone: string;
  email?: string;
  workingHours: WorkingHoursDomain;
  isActive: boolean;
  isMainBranch: boolean;
  coordinates?: CoordinatesDomain;
  managerId?: string;
  serviceIds: string[];
}

/**
 * Запит на оновлення філії
 */
export interface UpdateBranchDomainRequest {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  workingHours?: WorkingHoursDomain;
  isActive?: boolean;
  coordinates?: CoordinatesDomain;
  managerId?: string;
  serviceIds?: string[];
}

/**
 * Параметри пошуку філій
 */
export interface BranchSearchDomainParams {
  query?: string;
  isActive?: boolean;
  hasService?: string; // serviceId
  city?: string;
  page?: number;
  size?: number;
}

/**
 * Результат пошуку філій
 */
export interface BranchSearchDomainResult {
  branches: BranchDomain[];
  total: number;
  page: number;
  size: number;
  hasMore: boolean;
}

/**
 * Статистика філії
 */
export interface BranchStatsDomain {
  branchId: string;
  branchName: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  topServices: Array<{
    serviceId: string;
    serviceName: string;
    orderCount: number;
    revenue: number;
  }>;
  monthlyStats: Array<{
    month: string;
    ordersCount: number;
    revenue: number;
  }>;
}

/**
 * Доступність філії
 */
export interface BranchAvailabilityDomain {
  branchId: string;
  isOpen: boolean;
  currentStatus: 'OPEN' | 'CLOSED' | 'BREAK';
  nextStatusChange?: {
    status: 'OPEN' | 'CLOSED' | 'BREAK';
    time: string; // HH:mm
  };
  todaySchedule: DayScheduleDomain;
}

/**
 * Відстань до філії
 */
export interface BranchDistanceDomain {
  branchId: string;
  distance: number; // в кілометрах
  estimatedTravelTime: number; // в хвилинах
}
