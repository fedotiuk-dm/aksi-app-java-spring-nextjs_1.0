#!/usr/bin/env node

/**
 * @fileoverview 🌍 ГЛОБАЛЬНИЙ BARREL для всіх DOMAIN API модулів
 *
 * Створює основний index.ts файл у shared/api/generated/,
 * який експортує всі домени для зручного доступу:
 *
 * import {
 *   useClients,        // з client domain
 *   useBranches,       // з branch domain
 *   useCreateOrder,    // з order domain
 *   useServiceCategories, // з item domain
 *   useReceipts,       // з document domain
 * } from '@/shared/api/generated';
 */

const fs = require('fs');
const path = require('path');

// 🔧 Конфігурація
const GENERATED_API_DIR = './shared/api/generated';
const GLOBAL_BARREL_PATH = path.join(GENERATED_API_DIR, 'index.ts');

// 🏷️ Описи доменів (синхронізовано з DDD архітектурою)
const DOMAIN_DESCRIPTIONS = {
  client: '👤 Client Domain - управління клієнтами, пошук, контакти',
  branch: '🏢 Branch Domain - філії, графік роботи, статистика філій',
  order: '📦 Order Domain - замовлення, розрахунки, завершення замовлень',
  item: '🏷️ Item Domain - категорії послуг, прайс-лист, розрахунки вартості',
  document: '📄 Document Domain - квитанції, документи, цифрові підписи',
};

// 🎨 Створення глобального barrel файлу
const createGlobalBarrel = (domains) => {
  const timestamp = new Date().toISOString();

  return `// 🌍 ГЛОБАЛЬНИЙ BARREL для всіх DOMAIN API модулів
// Згенеровано: ${timestamp}
// Не редагуйте вручну - файл буде перезаписаний при наступній генерації
//
// 💡 Цей файл дозволяє імпортувати з будь-якого домену API:
// import { useClients, useBranches, useCreateOrder, ClientResponse } from '@/shared/api/generated';
//
// 🏗️ Архітектура: "DDD inside, FSD outside"
// Кожен домен має власний набір API хуків, типів та Zod схем
//
// 🎯 Доступні домени:
${domains.map((domain) => `// - ${domain.name}: ${domain.description}`).join('\n')}

${domains
  .map((domain) => `// ${domain.description}\nexport * from './${domain.name}';`)
  .join('\n\n')}

// 🔄 Re-export всіх типів для зручності TypeScript
${domains.map((domain) => `export type * from './${domain.name}';`).join('\n')}

// 📚 ПРИКЛАДИ ВИКОРИСТАННЯ:
//
// 👤 Client Domain:
//   import { useClients, useCreateClient, ClientResponse } from '@/shared/api/generated';
//
// 🏢 Branch Domain:
//   import { useBranches, BranchResponse } from '@/shared/api/generated';
//
// 📦 Order Domain:
//   import { useOrders, useCreateOrder, OrderResponse } from '@/shared/api/generated';
//
// 🏷️ Item Domain:
//   import { useServiceCategories, usePriceList, ItemResponse } from '@/shared/api/generated';
//
// 📄 Document Domain:
//   import { useReceipts, useDocuments, DocumentResponse } from '@/shared/api/generated';
`;
};

// 🚀 Головна функція
const main = () => {
  console.log('🌍 СТВОРЕННЯ ГЛОБАЛЬНОГО DOMAIN BARREL ФАЙЛУ');
  console.log('============================================');

  if (!fs.existsSync(GENERATED_API_DIR)) {
    console.error(`❌ Директорія ${GENERATED_API_DIR} не існує!`);
    console.log('💡 Спочатку запустіть: npm run orval');
    process.exit(1);
  }

  // Отримуємо список доменів
  const domainNames = fs
    .readdirSync(GENERATED_API_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  if (domainNames.length === 0) {
    console.log('⚠️  Не знайдено доменів API для глобального експорту');
    return;
  }

  // Формуємо інформацію про домени
  const domains = domainNames.map((name) => ({
    name,
    description: DOMAIN_DESCRIPTIONS[name] || `🔧 Домен ${name}`,
  }));

  console.log(`📦 Знайдено ${domains.length} домен(и):`);
  domains.forEach((domain) => {
    console.log(`   - ${domain.name}: ${domain.description}`);
  });

  // Створюємо глобальний barrel
  const globalBarrelContent = createGlobalBarrel(domains);

  try {
    fs.writeFileSync(GLOBAL_BARREL_PATH, globalBarrelContent, 'utf8');
    console.log('');
    console.log(`✅ Створено глобальний barrel: ${GLOBAL_BARREL_PATH}`);
    console.log('');
    console.log('🎉 ЗАВЕРШЕНО! Тепер доступні глобальні імпорти:');
    console.log('');
    console.log('📝 ПРИКЛАДИ:');
    console.log('   import { useClients } from "@/shared/api/generated";');
    console.log('   import { useBranches } from "@/shared/api/generated";');
    console.log('   import { useCreateOrder } from "@/shared/api/generated";');
    console.log('   import { useServiceCategories } from "@/shared/api/generated";');
    console.log('   import { useReceipts } from "@/shared/api/generated";');
    console.log('');
    console.log('🔧 АБО доменні імпорти:');
    console.log('   import { useClients } from "@/shared/api/generated/client";');
    console.log('   import { useBranches } from "@/shared/api/generated/branch";');
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
