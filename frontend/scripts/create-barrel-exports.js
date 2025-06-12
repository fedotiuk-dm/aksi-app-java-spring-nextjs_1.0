#!/usr/bin/env node

/**
 * @fileoverview 🔥 АВТОМАТИЧНЕ СТВОРЕННЯ BARREL ФАЙЛІВ для Orval API
 *
 * Цей скрипт автоматично створює index.ts файли у всіх папках згенерованого API,
 * забезпечуючи чисті та зручні імпорти:
 *
 * ✅ Замість: import { useStage1SearchClients } from '@/shared/api/generated/stage1/aksiApi'
 * ✅ Стає:    import { useStage1SearchClients } from '@/shared/api/generated/stage1'
 *
 * 🎯 Використання:
 * npm run create-barrel-exports
 * або
 * node scripts/create-barrel-exports.js
 */

const fs = require('fs');
const path = require('path');

// 🔧 Конфігурація
const GENERATED_API_DIR = './shared/api/generated';
const BARREL_FILE_NAME = 'index.ts';

// 🎨 Шаблон barrel файлу
const createBarrelContent = (moduleName, files) => {
  const timestamp = new Date().toISOString();

  return `// 🔥 AUTO-GENERATED BARREL EXPORT for ${moduleName}
// Згенеровано: ${timestamp}
// Не редагуйте вручну - файл буде перезаписаний при наступній генерації
//
// 💡 Це дозволяє використовувати чисті імпорти:
// import { useStage1SearchClients, ClientResponse, clientSearchSchema } from '@/shared/api/generated/${moduleName}';
//
// 🎯 Доступні експорти:
${files.map((file) => `// - з ${file.name}: ${file.description}`).join('\n')}

${files.map((file) => file.export).join('\n')}

// 📦 Експорт всіх типів для зручності
export type * from './aksiApi.schemas';
`;
};

// 🔍 Аналіз файлів у модулі
const analyzeModuleFiles = (modulePath) => {
  const files = [];

  // aksiApi.ts - основні API функції та хуки
  const aksiApiPath = path.join(modulePath, 'aksiApi.ts');
  if (fs.existsSync(aksiApiPath)) {
    files.push({
      name: 'aksiApi.ts',
      description: 'API функції, React Query хуки (useQuery, useMutation)',
      export: "export * from './aksiApi';",
    });
  }

  // aksiApi.schemas.ts - TypeScript типи
  const schemasPath = path.join(modulePath, 'aksiApi.schemas.ts');
  if (fs.existsSync(schemasPath)) {
    files.push({
      name: 'aksiApi.schemas.ts',
      description: 'TypeScript типи та інтерфейси',
      export: "export * from './aksiApi.schemas';",
    });
  }

  // schemas.zod.ts - Zod схеми для валідації
  const zodPath = path.join(modulePath, 'schemas.zod.ts');
  if (fs.existsSync(zodPath)) {
    files.push({
      name: 'schemas.zod.ts',
      description: 'Zod схеми для валідації форм',
      export: "export * from './schemas.zod';",
    });
  }

  return files;
};

// 🏗️ Створення barrel файлу для модуля
const createBarrelForModule = (moduleName, modulePath) => {
  console.log(`🔄 Обробляю модуль: ${moduleName}`);

  const files = analyzeModuleFiles(modulePath);

  if (files.length === 0) {
    console.log(`⚠️  Модуль ${moduleName} не містить файлів для експорту`);
    return;
  }

  const barrelContent = createBarrelContent(moduleName, files);
  const barrelPath = path.join(modulePath, BARREL_FILE_NAME);

  try {
    fs.writeFileSync(barrelPath, barrelContent, 'utf8');
    console.log(`✅ Створено barrel: ${barrelPath}`);
    console.log(`   📁 Експортовано ${files.length} файл(и):`);
    files.forEach((file) => {
      console.log(`      - ${file.name}: ${file.description}`);
    });
  } catch (error) {
    console.error(`❌ Помилка створення barrel для ${moduleName}:`, error.message);
  }
};

// 🚀 Головна функція
const main = () => {
  console.log('🔥 ПОЧАТОК СТВОРЕННЯ BARREL ФАЙЛІВ');
  console.log('=====================================');

  if (!fs.existsSync(GENERATED_API_DIR)) {
    console.error(`❌ Директорія ${GENERATED_API_DIR} не існує!`);
    console.log('💡 Спочатку запустіть: npm run orval');
    process.exit(1);
  }

  const modules = fs
    .readdirSync(GENERATED_API_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  if (modules.length === 0) {
    console.log('⚠️  Не знайдено модулів API для обробки');
    return;
  }

  console.log(`📦 Знайдено ${modules.length} модуль(і): ${modules.join(', ')}`);
  console.log('');

  let successCount = 0;

  modules.forEach((moduleName) => {
    const modulePath = path.join(GENERATED_API_DIR, moduleName);
    try {
      createBarrelForModule(moduleName, modulePath);
      successCount++;
      console.log('');
    } catch (error) {
      console.error(`❌ Критична помилка в модулі ${moduleName}:`, error.message);
    }
  });

  console.log('=====================================');
  console.log(`🎉 ЗАВЕРШЕНО! Створено ${successCount}/${modules.length} barrel файлів`);

  if (successCount > 0) {
    console.log('');
    console.log('💡 Тепер ви можете використовувати чисті імпорти:');
    console.log('   import { useStage1SearchClients } from "@/shared/api/generated/stage1";');
    console.log('   import { ClientResponse } from "@/shared/api/generated/stage1";');
    console.log('   import { clientSearchSchema } from "@/shared/api/generated/stage1";');
  }
};

// 🏃‍♂️ Запуск скрипта
if (require.main === module) {
  main();
}

module.exports = { main, createBarrelForModule, analyzeModuleFiles };
