/**
 * @fileoverview Композиційний адаптер предметів замовлень (зворотна сумісність)
 * @module domain/wizard/adapters/order-item-adapters
 */

import { OrderItemApiOperationsAdapter } from './api-operations.adapter';
import { OrderItemMappingAdapter } from './mapping.adapter';

import type { OrderItem } from '../../types';
import type { OrderItemDTO, OrderItemDetailedDTO } from '@/lib/api';

/**
 * Композиційний адаптер предметів замовлень для зворотної сумісності
 *
 * Відповідальність:
 * - Делегування до спеціалізованих адаптерів
 * - Збереження існуючого API
 * - Уніфікований доступ до функціональності
 */
export class OrderItemAdapter {
  // === ДЕЛЕГУВАННЯ ДО MAPPING ADAPTER ===

  /**
   * Перетворює базовий OrderItemDTO у доменний OrderItem
   */
  static fromBasicDTO(apiItem: OrderItemDTO): OrderItem {
    return OrderItemMappingAdapter.fromBasicDTO(apiItem);
  }

  /**
   * Перетворює детальний OrderItemDetailedDTO у доменний OrderItem
   */
  static fromDetailedDTO(apiItem: OrderItemDetailedDTO): OrderItem {
    return OrderItemMappingAdapter.fromDetailedDTO(apiItem);
  }

  /**
   * Універсальний метод для будь-якого типу OrderItem API
   */
  static toDomain(apiItem: OrderItemDTO | OrderItemDetailedDTO): OrderItem {
    return OrderItemMappingAdapter.toDomain(apiItem);
  }

  /**
   * Перетворює масив API предметів у доменні типи
   */
  static toDomainArray(apiItems: OrderItemDTO[]): OrderItem[] {
    return OrderItemMappingAdapter.toDomainArray(apiItems);
  }

  /**
   * Перетворює доменний тип у OrderItemDTO для API запитів
   */
  static toApiRequest(domainItem: Partial<OrderItem>): Partial<OrderItemDTO> {
    return OrderItemMappingAdapter.toApiRequest(domainItem);
  }

  /**
   * Перетворює доменний тип у повний OrderItemDTO для створення
   */
  static toCreateRequest(domainItem: Partial<OrderItem>): OrderItemDTO {
    return OrderItemMappingAdapter.toCreateRequest(domainItem);
  }

  /**
   * Перетворює доменний тип у OrderItemDTO для оновлення
   */
  static toUpdateRequest(domainItem: Partial<OrderItem>): OrderItemDTO {
    return OrderItemMappingAdapter.toUpdateRequest(domainItem);
  }

  /**
   * Валідує доменний OrderItem
   */
  static validateDomainItem(item: Partial<OrderItem>): string[] {
    return OrderItemMappingAdapter.validateDomainItem(item);
  }

  /**
   * Обчислює загальну ціну предмета
   */
  static calculateTotalPrice(item: Partial<OrderItem>): number {
    return OrderItemMappingAdapter.calculateTotalPrice(item);
  }

  /**
   * Перевіряє чи потребує предмет фото
   */
  static requiresPhotos(item: OrderItem): boolean {
    return OrderItemMappingAdapter.requiresPhotos(item);
  }

  /**
   * Створює короткий опис предмета для відображення
   */
  static createDisplaySummary(item: OrderItem): string {
    return OrderItemMappingAdapter.createDisplaySummary(item);
  }

  // === ДЕЛЕГУВАННЯ ДО API OPERATIONS ADAPTER ===

  /**
   * Отримання всіх предметів замовлення через API
   */
  static async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return OrderItemApiOperationsAdapter.getOrderItems(orderId);
  }

  /**
   * Отримання всіх предметів замовлення через API (Basic Operations)
   */
  static async getOrderItemsBasic(orderId: string): Promise<OrderItem[]> {
    return OrderItemApiOperationsAdapter.getOrderItemsBasic(orderId);
  }

  /**
   * Отримання предмета замовлення за ID через API
   */
  static async getOrderItem(orderId: string, itemId: string): Promise<OrderItem> {
    return OrderItemApiOperationsAdapter.getOrderItem(orderId, itemId);
  }

  /**
   * Додавання нового предмета до замовлення через API
   */
  static async addOrderItem(orderId: string, domainItem: Partial<OrderItem>): Promise<OrderItem> {
    return OrderItemApiOperationsAdapter.addOrderItem(orderId, domainItem);
  }

  /**
   * Оновлення існуючого предмета замовлення через API
   */
  static async updateOrderItem(
    orderId: string,
    itemId: string,
    domainItem: Partial<OrderItem>
  ): Promise<OrderItem> {
    return OrderItemApiOperationsAdapter.updateOrderItem(orderId, itemId, domainItem);
  }

  /**
   * Видалення предмета замовлення через API
   */
  static async deleteOrderItem(orderId: string, itemId: string): Promise<void> {
    return OrderItemApiOperationsAdapter.deleteOrderItem(orderId, itemId);
  }

  /**
   * Перевірка існування предмета в замовленні
   */
  static async itemExists(orderId: string, itemId: string): Promise<boolean> {
    return OrderItemApiOperationsAdapter.itemExists(orderId, itemId);
  }

  /**
   * Отримання кількості предметів у замовленні
   */
  static async getItemCount(orderId: string): Promise<number> {
    return OrderItemApiOperationsAdapter.getItemCount(orderId);
  }

  /**
   * Отримання загальної вартості всіх предметів замовлення
   */
  static async getTotalAmount(orderId: string): Promise<number> {
    return OrderItemApiOperationsAdapter.getTotalAmount(orderId);
  }

  /**
   * Пакетне додавання предметів до замовлення
   */
  static async addMultipleOrderItems(
    orderId: string,
    domainItems: Partial<OrderItem>[]
  ): Promise<OrderItem[]> {
    return OrderItemApiOperationsAdapter.addMultipleOrderItems(orderId, domainItems);
  }

  /**
   * Пакетне оновлення предметів замовлення
   */
  static async updateMultipleOrderItems(
    orderId: string,
    updates: Array<{ itemId: string; data: Partial<OrderItem> }>
  ): Promise<OrderItem[]> {
    return OrderItemApiOperationsAdapter.updateMultipleOrderItems(orderId, updates);
  }

  /**
   * Пакетне видалення предметів замовлення
   */
  static async deleteMultipleOrderItems(orderId: string, itemIds: string[]): Promise<void> {
    return OrderItemApiOperationsAdapter.deleteMultipleOrderItems(orderId, itemIds);
  }

  // === ДОДАТКОВІ УТИЛІТАРНІ МЕТОДИ ===

  /**
   * Створює новий предмет з базовими значеннями
   */
  static createEmptyItem(): Partial<OrderItem> {
    return {
      name: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      unitOfMeasure: 'шт',
      photos: [],
    };
  }

  /**
   * Клонує предмет замовлення
   */
  static cloneItem(item: OrderItem): OrderItem {
    return {
      ...item,
      id: '', // Очищаємо ID для нового предмета
      photos: [...(item.photos || [])],
    };
  }

  /**
   * Порівнює два предмети замовлення
   */
  static compareItems(item1: OrderItem, item2: OrderItem): boolean {
    const fieldsToCompare: (keyof OrderItem)[] = [
      'name',
      'category',
      'material',
      'color',
      'quantity',
      'unitPrice',
    ];

    return fieldsToCompare.every((field) => item1[field] === item2[field]);
  }

  /**
   * Фільтрує предмети за категорією
   */
  static filterByCategory(items: OrderItem[], category: string): OrderItem[] {
    return items.filter((item) => item.category === category);
  }

  /**
   * Сортує предмети за назвою
   */
  static sortByName(items: OrderItem[]): OrderItem[] {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Сортує предмети за ціною
   */
  static sortByPrice(items: OrderItem[], ascending: boolean = true): OrderItem[] {
    return [...items].sort((a, b) => {
      const priceA = a.totalPrice || 0;
      const priceB = b.totalPrice || 0;
      return ascending ? priceA - priceB : priceB - priceA;
    });
  }

  /**
   * Групує предмети за категорією
   */
  static groupByCategory(items: OrderItem[]): Record<string, OrderItem[]> {
    return items.reduce(
      (groups, item) => {
        const category = item.category || 'Без категорії';
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(item);
        return groups;
      },
      {} as Record<string, OrderItem[]>
    );
  }

  /**
   * Обчислює статистику предметів
   */
  static calculateStats(items: OrderItem[]): {
    totalItems: number;
    totalAmount: number;
    averagePrice: number;
    categoriesCount: number;
  } {
    const totalItems = items.length;
    const totalAmount = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const averagePrice = totalItems > 0 ? totalAmount / totalItems : 0;
    const categories = new Set(items.map((item) => item.category).filter(Boolean));

    return {
      totalItems,
      totalAmount,
      averagePrice,
      categoriesCount: categories.size,
    };
  }
}
