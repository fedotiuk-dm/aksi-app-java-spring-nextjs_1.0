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
const DOMAINS = ['auth', 'branch', 'client', 'order', 'order-wizard', 'pricing', 'receipt', 'test'];

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
    ` * @fileoverview Головний index для всіх згенерованих API`,
    ` * `,
    ` * Цей файл автоматично генерується скриптом create-api-index.js`,
    ` * НЕ РЕДАГУЙТЕ ВРУЧНУ!`,
    ` */`,
    '',
  ];

  DOMAINS.forEach((domain) => {
    const domainPath = path.join(GENERATED_API_PATH, domain);
    const domainIndexPath = path.join(domainPath, 'index.ts');

    if (fs.existsSync(domainIndexPath)) {
      // Конвертуємо назву домену для валідного експорту (видаляємо дефіси)
      const exportName = domain.replace(/-/g, '');
      const displayName = domain.charAt(0).toUpperCase() + domain.slice(1).replace(/-/g, ' ');

      exports.push(`// ${displayName} домен`);
      exports.push(`export * as ${exportName}Api from './${domain}';`);
      exports.push('');
    }
  });

  // Додаємо експорт full API якщо є
  const fullApiPath = path.join(GENERATED_API_PATH, 'full');
  if (fs.existsSync(fullApiPath)) {
    exports.push(`// Повний API без розбивки по доменах`);
    exports.push(`export * as fullApi from './full';`);
    exports.push('');
  }

  const content = exports.join('\n');
  fs.writeFileSync(mainIndexPath, content, 'utf8');
  console.log(`✅ Створено головний index файл`);
}

/**
 * Основна функція
 */
function main() {
  console.log('🚀 Створення index файлів для API...');

  // Створюємо папку якщо не існує
  if (!fs.existsSync(GENERATED_API_PATH)) {
    fs.mkdirSync(GENERATED_API_PATH, { recursive: true });
  }

  // Створюємо index для кожного домену
  DOMAINS.forEach(createDomainIndex);

  // Створюємо index для full API окремо
  createDomainIndex('full');

  // Створюємо головний index
  createMainIndex();

  console.log('🎉 Завершено створення index файлів!');
}

// Запускаємо якщо це головний модуль
if (require.main === module) {
  main();
}

module.exports = { createDomainIndex, createMainIndex, main };
