#!/usr/bin/env node

/**
 * @fileoverview 🌍 ГЛОБАЛЬНИЙ BARREL для всіх API модулів
 *
 * Створює основний index.ts файл у shared/api/generated/,
 * який експортує всі модулі для зручного доступу:
 *
 * import {
 *   useStage1SearchClients,    // з stage1
 *   useStage2GetCurrentState,  // з stage2
 *   useAuthLogin,              // з auth
 * } from '@/shared/api/generated';
 */

const fs = require('fs');
const path = require('path');

// 🔧 Конфігурація
const GENERATED_API_DIR = './shared/api/generated';
const GLOBAL_BARREL_PATH = path.join(GENERATED_API_DIR, 'index.ts');

// 🏷️ Описи модулів
const MODULE_DESCRIPTIONS = {
  auth: 'Автентифікація та авторизація',
  stage1: 'Крок 1: Пошук клієнтів, вибір філії, базова інформація',
  stage2: 'Крок 2: Управління предметами та їх характеристиками',
  stage3: 'Крок 3: Знижки, параметри виконання, оплата',
  stage4: 'Крок 4: Підтвердження замовлення та генерація квитанції',
  substep1: 'Підкрок 2.1: Базова інформація предмета',
  substep2: 'Підкрок 2.2: Характеристики предмета',
  substep3: 'Підкрок 2.3: Дефекти та плями',
  substep4: 'Підкрок 2.4: Розрахунок вартості',
  substep5: 'Підкрок 2.5: Завантаження фото',
  main: 'Основні API функції Order Wizard',
};

// 🎨 Створення глобального barrel файлу
const createGlobalBarrel = (modules) => {
  const timestamp = new Date().toISOString();

  return `// 🌍 ГЛОБАЛЬНИЙ BARREL для всіх API модулів
// Згенеровано: ${timestamp}
// Не редагуйте вручну - файл буде перезаписаний при наступній генерації
//
// 💡 Цей файл дозволяє імпортувати з будь-якого модуля API:
// import { useStage1SearchClients, useAuthLogin, ClientResponse } from '@/shared/api/generated';
//
// 🎯 Доступні модулі:
${modules.map((module) => `// - ${module.name}: ${module.description}`).join('\n')}

${modules
  .map((module) => `// 📦 ${module.description}\nexport * from './${module.name}';`)
  .join('\n\n')}

// 🔄 Re-export всіх типів для зручності TypeScript
${modules.map((module) => `export type * from './${module.name}';`).join('\n')}
`;
};

// 🚀 Головна функція
const main = () => {
  console.log('🌍 СТВОРЕННЯ ГЛОБАЛЬНОГО BARREL ФАЙЛУ');
  console.log('=====================================');

  if (!fs.existsSync(GENERATED_API_DIR)) {
    console.error(`❌ Директорія ${GENERATED_API_DIR} не існує!`);
    console.log('💡 Спочатку запустіть: npm run orval');
    process.exit(1);
  }

  // Отримуємо список модулів
  const moduleNames = fs
    .readdirSync(GENERATED_API_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  if (moduleNames.length === 0) {
    console.log('⚠️  Не знайдено модулів API для глобального експорту');
    return;
  }

  // Формуємо інформацію про модулі
  const modules = moduleNames.map((name) => ({
    name,
    description: MODULE_DESCRIPTIONS[name] || `Модуль ${name}`,
  }));

  console.log(`📦 Знайдено ${modules.length} модуль(і):`);
  modules.forEach((module) => {
    console.log(`   - ${module.name}: ${module.description}`);
  });

  // Створюємо глобальний barrel
  const globalBarrelContent = createGlobalBarrel(modules);

  try {
    fs.writeFileSync(GLOBAL_BARREL_PATH, globalBarrelContent, 'utf8');
    console.log(`✅ Створено глобальний barrel: ${GLOBAL_BARREL_PATH}`);
    console.log('');
    console.log('🎉 ЗАВЕРШЕНО! Тепер доступні глобальні імпорти:');
    console.log('   import { useStage1SearchClients } from "@/shared/api/generated";');
    console.log('   import { useAuthLogin } from "@/shared/api/generated";');
    console.log('   import { ClientResponse } from "@/shared/api/generated";');
  } catch (error) {
    console.error('❌ Помилка створення глобального barrel:', error.message);
    process.exit(1);
  }
};

// 🏃‍♂️ Запуск
if (require.main === module) {
  main();
}

module.exports = { main, createGlobalBarrel };
