#!/usr/bin/env node
/**
 * @fileoverview Скрипт для автоматичного створення index.ts файлів у згенерованих API доменах
 *
 * Цей скрипт:
 * - Сканує папки shared/api/generated/
 * - Створює index.ts файли для кожного домену
 * - Експортує всі API функції та типи
 * - Створює загальний index для всіх доменів
 */

const fs = require('fs');
const path = require('path');

const GENERATED_API_PATH = path.join(__dirname, '../shared/api/generated');
const WIZARD_DOMAIN = 'wizard'; // Тільки Order Wizard контролери

/**
 * Створює index.ts файл для конкретного домену
 */
function createDomainIndex(domainName) {
  const domainPath = path.join(GENERATED_API_PATH, domainName);

  if (!fs.existsSync(domainPath)) {
    console.log(`⏭️  Пропускаємо ${domainName} - папка не існує`);
    return;
  }

  const indexPath = path.join(domainPath, 'index.ts');
  const apiFilePath = path.join(domainPath, 'aksiApi.ts');
  const schemasFilePath = path.join(domainPath, 'aksiApi.schemas.ts');
  const zodPath = path.join(domainPath, 'zod');

  let exports = [];

  // Експортуємо API функції якщо є
  if (fs.existsSync(apiFilePath)) {
    exports.push(`// API функції для домену ${domainName}`);
    exports.push(`export * from './aksiApi';`);
    exports.push('');
  }

  // Експортуємо типи якщо є
  if (fs.existsSync(schemasFilePath)) {
    exports.push(`// Типи та схеми для домену ${domainName}`);
    exports.push(`export * from './aksiApi.schemas';`);
    exports.push('');
  }

  // Експортуємо Zod схеми якщо є
  if (fs.existsSync(zodPath)) {
    const zodIndexPath = path.join(zodPath, 'aksiApi.ts');
    if (fs.existsSync(zodIndexPath)) {
      exports.push(`// Zod схеми для валідації`);
      exports.push(`export * as zodSchemas from './zod/aksiApi';`);
      exports.push('');
    }
  }

  if (exports.length > 0) {
    const content = [
      `/**`,
      ` * @fileoverview Auto-generated index для ${domainName} API`,
      ` * `,
      ` * Цей файл автоматично генерується скриптом create-api-index.js`,
      ` * НЕ РЕДАГУЙТЕ ВРУЧНУ!`,
      ` */`,
      '',
      ...exports,
    ].join('\n');

    fs.writeFileSync(indexPath, content, 'utf8');
    console.log(`✅ Створено index для домену: ${domainName}`);
  }
}

/**
 * Створює загальний index.ts файл
 */
function createMainIndex() {
  const mainIndexPath = path.join(GENERATED_API_PATH, 'index.ts');

  let exports = [
    `/**`,
    ` * @fileoverview Головний index для Order Wizard API`,
    ` * `,
    ` * Цей файл автоматично генерується скриптом create-api-index.js`,
    ` * НЕ РЕДАГУЙТЕ ВРУЧНУ!`,
    ` */`,
    '',
  ];

  // Експортуємо тільки wizard API
  const wizardApiPath = path.join(GENERATED_API_PATH, WIZARD_DOMAIN);
  const wizardIndexPath = path.join(wizardApiPath, 'index.ts');

  if (fs.existsSync(wizardIndexPath)) {
    exports.push(`// Order Wizard API (всі Stage та Substep контролери)`);
    exports.push(`export * as wizardApi from './wizard';`);
    exports.push('');
    exports.push(`// Для сумісності з попередніми версіями`);
    exports.push(`export * from './wizard';`);
    exports.push('');
  } else {
    exports.push(`// ⚠️  Wizard API не знайдено - перевірте генерацію`);
    exports.push('');
  }

  const content = exports.join('\n');
  fs.writeFileSync(mainIndexPath, content, 'utf8');
  console.log(`✅ Створено головний index файл для Order Wizard API`);
}

/**
 * Основна функція
 */
function main() {
  console.log('🚀 Створення index файлів для Order Wizard API...');

  // Створюємо папку якщо не існує
  if (!fs.existsSync(GENERATED_API_PATH)) {
    fs.mkdirSync(GENERATED_API_PATH, { recursive: true });
  }

  // Створюємо index тільки для wizard домену
  createDomainIndex(WIZARD_DOMAIN);

  // Створюємо головний index
  createMainIndex();

  console.log('🎉 Завершено створення index файлів для Order Wizard!');
}

// Запускаємо якщо це головний модуль
if (require.main === module) {
  main();
}

module.exports = { createDomainIndex, createMainIndex, main };
