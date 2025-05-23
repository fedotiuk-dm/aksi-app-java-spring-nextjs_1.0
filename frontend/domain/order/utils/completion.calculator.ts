/**
 * Калькулятор термінів виконання для Order домену
 * Реалізує бізнес-логіку розрахунку дат та робочих годин
 */

import { ExpediteType, MaterialType } from '../types';

import type {
  OrderItem,
  OrderCompletion,
  BusinessHours,
  CompletionCalculationParams,
} from '../types/order.types';

export class CompletionCalculator {
  /**
   * Стандартні робочі години хімчистки
   */
  private static readonly DEFAULT_BUSINESS_HOURS: BusinessHours = {
    monday: { open: '09:00', close: '18:00', closed: false },
    tuesday: { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday: { open: '09:00', close: '18:00', closed: false },
    friday: { open: '09:00', close: '18:00', closed: false },
    saturday: { open: '10:00', close: '16:00', closed: false },
    sunday: { open: '00:00', close: '00:00', closed: true },
  };

  /**
   * Розраховує термін виконання замовлення
   */
  static calculateCompletion(params: CompletionCalculationParams): OrderCompletion {
    const {
      items,
      expediteType = ExpediteType.STANDARD,
      startDate = new Date(),
      businessHours = this.DEFAULT_BUSINESS_HOURS,
      excludeWeekends = true,
      excludeHolidays = true,
      holidays = [],
    } = params;

    // Визначаємо базовий термін виконання
    const baseDays = this.calculateBaseDays(items);

    // Застосовуємо терміновість
    const adjustedDays = this.applyExpediteType(baseDays, expediteType);

    // Розраховуємо дату з урахуванням робочих днів
    const completionDate = this.calculateWorkingDate(
      startDate,
      adjustedDays,
      businessHours,
      excludeWeekends,
      excludeHolidays,
      holidays
    );

    // Перевіряємо час роботи на дату завершення
    const readyTime = this.calculateReadyTime(completionDate, businessHours);

    return {
      baseDays,
      adjustedDays,
      startDate,
      expectedCompletionDate: readyTime,
      isExpedited: expediteType !== ExpediteType.STANDARD,
      expediteType,
      businessDaysUsed: this.countBusinessDays(startDate, completionDate, businessHours),
      isOverdue: false, // Буде розраховано при перевірці поточної дати
      completionNotes: this.generateCompletionNotes(items, expediteType, adjustedDays),
    };
  }

  /**
   * Розраховує базовий термін виконання на основі предметів
   */
  private static calculateBaseDays(items: OrderItem[]): number {
    if (items.length === 0) return 2; // Стандартний термін

    // Перевіряємо чи є шкіряні вироби
    const hasLeatherItems = items.some((item) => this.isLeatherItem(item));
    if (hasLeatherItems) {
      return 14; // 14 днів для шкіряних виробів
    }

    // Перевіряємо чи є складні послуги
    const hasComplexServices = items.some((item) => this.isComplexService(item));
    if (hasComplexServices) {
      return 5; // 5 днів для складних послуг
    }

    // Перевіряємо кількість предметів
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 10) {
      return 3; // 3 дні для великих замовлень
    }

    return 2; // Стандартний термін 48 годин
  }

  /**
   * Застосовує терміновість до базового терміну
   */
  private static applyExpediteType(baseDays: number, expediteType: ExpediteType): number {
    switch (expediteType) {
      case ExpediteType.EXPRESS_24H:
        return 1; // 24 години
      case ExpediteType.EXPRESS_48H:
        return 2; // 48 годин
      case ExpediteType.STANDARD:
      default:
        return baseDays;
    }
  }

  /**
   * Розраховує робочу дату з урахуванням всіх обмежень
   */
  private static calculateWorkingDate(
    startDate: Date,
    days: number,
    businessHours: BusinessHours,
    excludeWeekends: boolean,
    excludeHolidays: boolean,
    holidays: Date[]
  ): Date {
    let currentDate = new Date(startDate);
    let remainingDays = days;

    while (remainingDays > 0) {
      currentDate.setDate(currentDate.getDate() + 1);

      // Перевіряємо чи це робочий день
      if (
        this.isWorkingDay(currentDate, businessHours, excludeWeekends, excludeHolidays, holidays)
      ) {
        remainingDays--;
      }
    }

    return currentDate;
  }

  /**
   * Розраховує час готовності в робочий день
   */
  private static calculateReadyTime(date: Date, businessHours: BusinessHours): Date {
    const dayOfWeek = this.getDayOfWeek(date);
    const dayHours = businessHours[dayOfWeek];

    if (dayHours.closed) {
      // Якщо день закритий, переносимо на наступний робочий день
      const nextWorkingDay = this.getNextWorkingDay(date, businessHours);
      return this.calculateReadyTime(nextWorkingDay, businessHours);
    }

    // Встановлюємо час готовності після 14:00 згідно з вимогами
    const readyTime = new Date(date);
    readyTime.setHours(14, 0, 0, 0);

    // Перевіряємо чи час готовності потрапляє в робочі години
    const [closeHour, closeMinute] = dayHours.close.split(':').map(Number);
    const closeTime = new Date(date);
    closeTime.setHours(closeHour, closeMinute, 0, 0);

    if (readyTime > closeTime) {
      // Якщо після 14:00 вже закрито, переносимо на наступний день
      const nextWorkingDay = this.getNextWorkingDay(date, businessHours);
      return this.calculateReadyTime(nextWorkingDay, businessHours);
    }

    return readyTime;
  }

  /**
   * Перевіряє чи є день робочим
   */
  private static isWorkingDay(
    date: Date,
    businessHours: BusinessHours,
    excludeWeekends: boolean,
    excludeHolidays: boolean,
    holidays: Date[]
  ): boolean {
    // Перевіряємо святкові дні
    if (excludeHolidays && this.isHoliday(date, holidays)) {
      return false;
    }

    const dayOfWeek = this.getDayOfWeek(date);
    const dayHours = businessHours[dayOfWeek];

    // Перевіряємо чи день закритий в розкладі
    if (dayHours.closed) {
      return false;
    }

    // Перевіряємо вихідні (якщо потрібно виключати)
    if (excludeWeekends && (dayOfWeek === 'sunday' || dayOfWeek === 'saturday')) {
      return !dayHours.closed; // Робочий тільки якщо явно відкрито
    }

    return true;
  }

  /**
   * Перевіряє чи є дата святковою
   */
  private static isHoliday(date: Date, holidays: Date[]): boolean {
    return holidays.some(
      (holiday) =>
        holiday.getFullYear() === date.getFullYear() &&
        holiday.getMonth() === date.getMonth() &&
        holiday.getDate() === date.getDate()
    );
  }

  /**
   * Отримує день тижня як ключ
   */
  private static getDayOfWeek(date: Date): keyof BusinessHours {
    const days: (keyof BusinessHours)[] = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    return days[date.getDay()];
  }

  /**
   * Знаходить наступний робочий день
   */
  private static getNextWorkingDay(date: Date, businessHours: BusinessHours): Date {
    let nextDay = new Date(date);
    do {
      nextDay.setDate(nextDay.getDate() + 1);
    } while (!this.isWorkingDay(nextDay, businessHours, true, false, []));

    return nextDay;
  }

  /**
   * Підраховує кількість робочих днів між датами
   */
  private static countBusinessDays(
    startDate: Date,
    endDate: Date,
    businessHours: BusinessHours
  ): number {
    let count = 0;
    let currentDate = new Date(startDate);

    while (currentDate < endDate) {
      currentDate.setDate(currentDate.getDate() + 1);
      if (this.isWorkingDay(currentDate, businessHours, true, false, [])) {
        count++;
      }
    }

    return count;
  }

  /**
   * Перевіряє чи є предмет шкіряним
   */
  private static isLeatherItem(item: OrderItem): boolean {
    const leatherMaterials: MaterialType[] = [
      MaterialType.LEATHER,
      MaterialType.NUBUCK,
      MaterialType.SUEDE,
      MaterialType.SPLIT_LEATHER,
    ];
    return item.material ? leatherMaterials.includes(item.material as MaterialType) : false;
  }

  /**
   * Перевіряє чи є послуга складною
   */
  private static isComplexService(item: OrderItem): boolean {
    const complexServices = ['фарбування', 'ремонт', 'реставрація', 'перешиття'];
    const itemText =
      `${item.name} ${item.description || ''} ${item.specialInstructions || ''}`.toLowerCase();

    return complexServices.some((service) => itemText.includes(service));
  }

  /**
   * Генерує примітки до терміну виконання
   */
  private static generateCompletionNotes(
    items: OrderItem[],
    expediteType: ExpediteType,
    adjustedDays: number
  ): string {
    const notes: string[] = [];

    // Додаємо інформацію про фактичний термін
    notes.push(`Термін виконання: ${adjustedDays} дн.`);

    if (expediteType === ExpediteType.EXPRESS_24H) {
      notes.push('Терміново 24 години (+100% до вартості)');
    } else if (expediteType === ExpediteType.EXPRESS_48H) {
      notes.push('Терміново 48 годин (+50% до вартості)');
    }

    const hasLeatherItems = items.some((item) => this.isLeatherItem(item));
    if (hasLeatherItems) {
      notes.push('Містить шкіряні вироби (стандартний термін 14 днів)');
    }

    const hasComplexServices = items.some((item) => this.isComplexService(item));
    if (hasComplexServices) {
      notes.push('Містить складні послуги (подовжений термін)');
    }

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 10) {
      notes.push(`Велике замовлення (${totalItems} предметів)`);
    }

    notes.push('Готовність після 14:00 в день видачі');

    return notes.join('. ');
  }

  /**
   * Перевіряє чи замовлення прострочене
   */
  static isOverdue(expectedDate: Date, currentDate: Date = new Date()): boolean {
    return currentDate > expectedDate;
  }

  /**
   * Розраховує кількість днів до/після дедлайну
   */
  static getDaysToDeadline(expectedDate: Date, currentDate: Date = new Date()): number {
    const diffTime = expectedDate.getTime() - currentDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Отримує статус готовності замовлення
   */
  static getReadinessStatus(
    completion: OrderCompletion,
    currentDate: Date = new Date()
  ): {
    status: 'ON_TIME' | 'DUE_TODAY' | 'OVERDUE' | 'READY';
    message: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  } {
    const daysLeft = this.getDaysToDeadline(completion.expectedCompletionDate, currentDate);

    if (daysLeft < 0) {
      return {
        status: 'OVERDUE',
        message: `Прострочено на ${Math.abs(daysLeft)} дн.`,
        priority: 'URGENT',
      };
    } else if (daysLeft === 0) {
      return {
        status: 'DUE_TODAY',
        message: 'До видачі сьогодні',
        priority: 'HIGH',
      };
    } else if (daysLeft === 1) {
      return {
        status: 'ON_TIME',
        message: 'До видачі завтра',
        priority: 'MEDIUM',
      };
    } else {
      return {
        status: 'ON_TIME',
        message: `До видачі ${daysLeft} дн.`,
        priority: 'LOW',
      };
    }
  }

  /**
   * Розраховує пріоритет обробки замовлення
   */
  static calculateProcessingPriority(
    completion: OrderCompletion,
    items: OrderItem[],
    currentDate: Date = new Date()
  ): 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' {
    const readiness = this.getReadinessStatus(completion, currentDate);

    // Терміновість має вищий пріоритет
    if (completion.expediteType === ExpediteType.EXPRESS_24H) {
      return 'URGENT';
    } else if (completion.expediteType === ExpediteType.EXPRESS_48H) {
      return 'HIGH';
    }

    // Статус готовності
    if (readiness.status === 'OVERDUE') {
      return 'URGENT';
    } else if (readiness.status === 'DUE_TODAY') {
      return 'HIGH';
    }

    // Складність предметів
    const hasComplexItems = items.some(
      (item) => item.noGuaranteeReason || this.isComplexService(item) || this.isLeatherItem(item)
    );

    if (hasComplexItems) {
      return 'MEDIUM';
    }

    return 'LOW';
  }
}
