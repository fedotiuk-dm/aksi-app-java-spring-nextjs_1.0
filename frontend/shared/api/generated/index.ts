// 🌍 ГЛОБАЛЬНИЙ BARREL для всіх API модулів
// Згенеровано: 2025-06-13T00:14:32.149Z
// Не редагуйте вручну - файл буде перезаписаний при наступній генерації
//
// 💡 Цей файл дозволяє імпортувати з будь-якого модуля API:
// import { useStage1SearchClients, useAuthLogin, ClientResponse } from '@/shared/api/generated';
//
// 🎯 Доступні модулі:
// - auth: Автентифікація та авторизація
// - main: Основні API функції Order Wizard
// - stage1: Крок 1: Пошук клієнтів, вибір філії, базова інформація
// - stage2: Крок 2: Управління предметами та їх характеристиками
// - stage3: Крок 3: Знижки, параметри виконання, оплата
// - stage4: Крок 4: Підтвердження замовлення та генерація квитанції
// - substep1: Підкрок 2.1: Базова інформація предмета
// - substep2: Підкрок 2.2: Характеристики предмета
// - substep3: Підкрок 2.3: Дефекти та плями
// - substep4: Підкрок 2.4: Розрахунок вартості
// - substep5: Підкрок 2.5: Завантаження фото

// 📦 Автентифікація та авторизація
export * from './auth';

// 📦 Основні API функції Order Wizard
export * from './main';

// 📦 Крок 1: Пошук клієнтів, вибір філії, базова інформація
export * from './stage1';

// 📦 Крок 2: Управління предметами та їх характеристиками
export * from './stage2';

// 📦 Крок 3: Знижки, параметри виконання, оплата
export * from './stage3';

// 📦 Крок 4: Підтвердження замовлення та генерація квитанції
export * from './stage4';

// 📦 Підкрок 2.1: Базова інформація предмета
export * from './substep1';

// 📦 Підкрок 2.2: Характеристики предмета
export * from './substep2';

// 📦 Підкрок 2.3: Дефекти та плями
export * from './substep3';

// 📦 Підкрок 2.4: Розрахунок вартості
export * from './substep4';

// 📦 Підкрок 2.5: Завантаження фото
export * from './substep5';

// 🔄 Re-export всіх типів для зручності TypeScript
export type * from './auth';
export type * from './main';
export type * from './stage1';
export type * from './stage2';
export type * from './stage3';
export type * from './stage4';
export type * from './substep1';
export type * from './substep2';
export type * from './substep3';
export type * from './substep4';
export type * from './substep5';
