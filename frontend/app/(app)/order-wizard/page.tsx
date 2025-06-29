/**
 * @fileoverview Сторінка Order Wizard для хімчистки
 * Головна сторінка для оформлення замовлень з покроковим інтерфейсом
 */

'use client';

import { WizardContainer as OrderWizardContainer } from '@/features/order-wizard/WizardContainer';

/**
 * 🎯 Головна сторінка Order Wizard
 *
 * Інтегрує всі етапи оформлення замовлення:
 * 1. Клієнт та базова інформація замовлення
 * 2. Менеджер предметів (циклічний процес)
 * 3. Загальні параметри замовлення
 * 4. Підтвердження та завершення з формуванням квитанції
 */
export default function OrderWizardPage() {
  return <OrderWizardContainer />;
}
