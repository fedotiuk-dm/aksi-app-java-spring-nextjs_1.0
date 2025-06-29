#!/usr/bin/env node

/**
 * @fileoverview 🔥 АВТОМАТИЧНЕ СТВОРЕННЯ BARREL ФАЙЛІВ для Domain API
 *
 * Цей скрипт автоматично створює index.ts файли у всіх папках згенерованого API,
 * забезпечуючи чисті та зручні імпорти:
 *
 * ✅ Замість: import { useClients } from '@/shared/api/generated/client/aKSIDryCleaningOrderSystemAPI'
 * ✅ Стає:    import { useClients } from '@/shared/api/generated/client'
 *
 * 🎯 Використання:
 * npm run barrel:all
 * або
 * node scripts/create-barrel-exports.js
 */

const fs = require('fs');
const path = require('path');

// 🔧 Конфігурація
const GENERATED_API_DIR = './shared/api/generated';
const BARREL_FILE_NAME = 'index.ts';

// 🏷️ Описи доменів
const DOMAIN_DESCRIPTIONS = {
  client: '👤 Client Domain - управління клієнтами, пошук, контакти',
  branch: '🏢 Branch Domain - філії, графік роботи, статистика',
  order: '📦 Order Domain - замовлення, розрахунки, завершення',
  item: '🏷️ Item Domain - категорії послуг, прайс-лист, фото',
  document: '📄 Document Domain - квитанції, документи, цифрові підписи',
};

// 🎨 Шаблон barrel файлу
const createBarrelContent = (domainName, files) => {
  const timestamp = new Date().toISOString();
  const description = DOMAIN_DESCRIPTIONS[domainName] || `Домен ${domainName}`;

  return `// 🔥 AUTO-GENERATED BARREL EXPORT for ${domainName.toUpperCase()} DOMAIN
// ${description}
// Згенеровано: ${timestamp}
// Не редагуйте вручну - файл буде перезаписаний при наступній генерації
//
// 💡 Це дозволяє використовувати чисті імпорти:
// import { useClients, ClientResponse, clientSchema } from '@/shared/api/generated/${domainName}';
//
// 🎯 Доступні експорти:
${files.map((file) => `// - з ${file.name}: ${file.description}`).join('\n')}

${files.map((file) => file.export).join('\n')}

// 📦 Експорт всіх типів для зручності TypeScript
${files
  .filter((f) => f.name.includes('.schemas.'))
  .map((f) => `export type * from './${f.name.replace('.ts', '')}';`)
  .join('\n')}
`;
};

// 🔍 Аналіз файлів у домені
const analyzeModuleFiles = (modulePath) => {
  const files = [];

  try {
    const dirFiles = fs.readdirSync(modulePath);

    // Основний API файл (може мати різні назви)
    const apiFile = dirFiles.find(
      (file) =>
        file.endsWith('.ts') &&
        !file.includes('.schemas.') &&
        !file.includes('.zod.') &&
        file !== 'index.ts'
    );

    if (apiFile) {
      files.push({
        name: apiFile,
        description: 'React Query хуки (useQuery, useMutation)',
        export: `export * from './${apiFile.replace('.ts', '')}';`,
      });
    }

    // Schemas файл - TypeScript типи
    const schemasFile = dirFiles.find((file) => file.includes('.schemas.ts'));
    if (schemasFile) {
      files.push({
        name: schemasFile,
        description: 'TypeScript типи та інтерфейси',
        export: `export * from './${schemasFile.replace('.ts', '')}';`,
      });
    }

    // Zod схеми для валідації
    const zodFile = dirFiles.find((file) => file.includes('.zod.ts'));
    if (zodFile) {
      files.push({
        name: zodFile,
        description: 'Zod схеми для валідації форм',
        export: `export * from './${zodFile.replace('.ts', '')}';`,
      });
    }
  } catch (error) {
    console.error(`❌ Помилка читання директорії ${modulePath}:`, error.message);
  }

  return files;
};

// 🏗️ Створення barrel файлу для домену
const createBarrelForModule = (domainName, domainPath) => {
  console.log(`🔄 Обробляю домен: ${domainName}`);
  console.log(`   📁 Шлях: ${domainPath}`);

  const files = analyzeModuleFiles(domainPath);

  if (files.length === 0) {
    console.log(`⚠️  Домен ${domainName} не містить файлів для експорту`);
    return;
  }

  const barrelContent = createBarrelContent(domainName, files);
  const barrelPath = path.join(domainPath, BARREL_FILE_NAME);

  try {
    fs.writeFileSync(barrelPath, barrelContent, 'utf8');
    console.log(`✅ Створено barrel: ${barrelPath}`);
    console.log(`   📁 Експортовано ${files.length} файл(и):`);
    files.forEach((file) => {
      console.log(`      - ${file.name}: ${file.description}`);
    });
  } catch (error) {
    console.error(`❌ Помилка створення barrel для ${domainName}:`, error.message);
  }
};

// 🚀 Головна функція
const main = () => {
  console.log('🔥 ПОЧАТОК СТВОРЕННЯ DOMAIN BARREL ФАЙЛІВ');
  console.log('==========================================');

  if (!fs.existsSync(GENERATED_API_DIR)) {
    console.error(`❌ Директорія ${GENERATED_API_DIR} не існує!`);
    console.log('💡 Спочатку запустіть: npm run orval');
    process.exit(1);
  }

  const domains = fs
    .readdirSync(GENERATED_API_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  if (domains.length === 0) {
    console.log('⚠️  Не знайдено доменів API для обробки');
    return;
  }

  console.log(`📦 Знайдено ${domains.length} домен(и):`);
  domains.forEach((domain) => {
    const description = DOMAIN_DESCRIPTIONS[domain] || `Домен ${domain}`;
    console.log(`   - ${domain}: ${description}`);
  });
  console.log('');

  let successCount = 0;

  domains.forEach((domainName) => {
    const domainPath = path.join(GENERATED_API_DIR, domainName);
    try {
      createBarrelForModule(domainName, domainPath);
      successCount++;
      console.log('');
    } catch (error) {
      console.error(`❌ Критична помилка в домені ${domainName}:`, error.message);
    }
  });

  console.log('==========================================');
  console.log(`🎉 ЗАВЕРШЕНО! Створено ${successCount}/${domains.length} barrel файлів`);

  if (successCount > 0) {
    console.log('');
    console.log('💡 Тепер ви можете використовувати чисті імпорти:');
    console.log('   import { useClients } from "@/shared/api/generated/client";');
    console.log('   import { ClientResponse } from "@/shared/api/generated/client";');
    console.log('   import { useBranches } from "@/shared/api/generated/branch";');
    console.log('   import { useCreateOrder } from "@/shared/api/generated/order";');
  }
};

// 🏃‍♂️ Запуск скрипта
if (require.main === module) {
  main();
}

module.exports = { main, createBarrelForModule, analyzeModuleFiles };
