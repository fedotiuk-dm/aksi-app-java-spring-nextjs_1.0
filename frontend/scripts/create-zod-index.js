#!/usr/bin/env node

/**
 * @fileoverview Скрипт для створення index файлів Zod схем
 *
 * Цей скрипт:
 * - Створює зручні index.ts файли для Zod схем
 * - Експортує всі схеми з логічними іменами
 * - Створює утиліти для валідації
 * - Додає helper функції для роботи з схемами
 */

const fs = require('fs');
const path = require('path');

/**
 * Створює index.ts файл для Zod схем домену
 */
function createZodIndex(domainName) {
  const domainPath = path.join(__dirname, '../shared/api/generated', domainName, 'zod');

  if (!domainName || domainName === 'undefined') {
    console.log('⏭️  Пропускаємо - не вказано домен');
    return;
  }

  if (!fs.existsSync(domainPath)) {
    console.log(`⏭️  Пропускаємо ${domainName} - папка zod не існує`);
    return;
  }

  const indexPath = path.join(domainPath, 'index.ts');
  const aksiApiPath = path.join(domainPath, 'aksiApi.ts');

  if (!fs.existsSync(aksiApiPath)) {
    console.log(`⏭️  Пропускаємо ${domainName} - немає aksiApi.ts у zod папці`);
    return;
  }

  const content = [
    `/**`,
    ` * @fileoverview Zod схеми для домену ${domainName}`,
    ` * `,
    ` * Цей файл автоматично генерується скриптом create-zod-index.js`,
    ` * НЕ РЕДАГУЙТЕ ВРУЧНУ!`,
    ` */`,
    '',
    `// Експорт всіх Zod схем`,
    `export * from './aksiApi';`,
    '',
    `// Re-export zod для зручності`,
    `export { z, type ZodType, type ZodSchema } from 'zod';`,
    '',
    `// Утиліти для валідації`,
    `import { z } from 'zod';`,
    '',
    `/**`,
    ` * Утиліта для безпечної валідації з детальними помилками`,
    ` */`,
    `export function safeValidate<T>(`,
    `  schema: z.ZodType<T>,`,
    `  data: unknown`,
    `): { success: true; data: T } | { success: false; errors: string[] } {`,
    `  const result = schema.safeParse(data);`,
    `  `,
    `  if (result.success) {`,
    `    return { success: true, data: result.data };`,
    `  }`,
    `  `,
    `  return {`,
    `    success: false,`,
    `    errors: result.error.errors.map(err => \`\${err.path.join('.')}: \${err.message}\`)`,
    `  };`,
    `}`,
    '',
    `/**`,
    ` * Утиліта для валідації з викиданням помилки`,
    ` */`,
    `export function validateOrThrow<T>(schema: z.ZodType<T>, data: unknown): T {`,
    `  const result = safeValidate(schema, data);`,
    `  `,
    `  if (!result.success) {`,
    `    throw new Error(\`Validation failed: \${result.errors.join(', ')}\`);`,
    `  }`,
    `  `,
    `  return result.data;`,
    `}`,
    '',
    `/**`,
    ` * Утиліта для створення часткової схеми`,
    ` */`,
    `export function createPartialSchema<T extends z.ZodRawShape>(`,
    `  schema: z.ZodObject<T>`,
    `): z.ZodObject<{ [K in keyof T]: z.ZodOptional<T[K]> }> {`,
    `  return schema.partial();`,
    `}`,
    '',
    `/**`,
    ` * Константи домену для валідації`,
    ` */`,
    `export const ${domainName.toUpperCase().replace(/-/g, '_')}_VALIDATION = {`,
    `  DOMAIN_NAME: '${domainName}',`,
    `  safeValidate,`,
    `  validateOrThrow,`,
    `  createPartialSchema,`,
    `} as const;`,
  ].join('\n');

  fs.writeFileSync(indexPath, content, 'utf8');
  console.log(`✅ Створено Zod index для домену: ${domainName}`);
}

/**
 * Створює загальний index для всіх Zod схем
 */
function createMainZodIndex() {
  const generatedPath = path.join(__dirname, '../shared/api/generated');
  const mainIndexPath = path.join(generatedPath, 'zod-schemas.ts');

  if (!fs.existsSync(generatedPath)) {
    console.log('⏭️  Папка generated не існує');
    return;
  }

  const domains = ['auth', 'branch', 'client', 'order', 'pricing', 'receipt', 'test'];
  let exports = [
    `/**`,
    ` * @fileoverview Загальний index для всіх Zod схем`,
    ` * `,
    ` * Цей файл автоматично генерується скриптом create-zod-index.js`,
    ` * НЕ РЕДАГУЙТЕ ВРУЧНУ!`,
    ` */`,
    '',
    `// Re-export zod`,
    `export { z, type ZodType, type ZodSchema } from 'zod';`,
    '',
  ];

  // Експортуємо схеми по доменах
  domains.forEach((domain) => {
    const zodPath = path.join(generatedPath, domain, 'zod', 'index.ts');
    if (fs.existsSync(zodPath)) {
      exports.push(`// ${domain.charAt(0).toUpperCase() + domain.slice(1)} домен схеми`);
      exports.push(`export * as ${domain}Schemas from './${domain}/zod';`);
      exports.push('');
    }
  });

  // Додаємо full схеми якщо є
  const fullZodPath = path.join(generatedPath, 'full', 'zod', 'aksiApi.ts');
  if (fs.existsSync(fullZodPath)) {
    exports.push(`// Повні схеми`);
    exports.push(`export * as fullSchemas from './full/zod/aksiApi';`);
    exports.push('');
  }

  // Додаємо загальні утиліти
  exports.push(
    [
      `/**`,
      ` * Загальні утиліти для роботи з усіма схемами`,
      ` */`,
      `import { z } from 'zod';`,
      '',
      `export const zodUtils = {`,
      `  /**`,
      `   * Перевіряє чи є значення валідним для будь-якої схеми`,
      `   */`,
      `  isValid<T>(schema: z.ZodType<T>, data: unknown): data is T {`,
      `    return schema.safeParse(data).success;`,
      `  },`,
      '',
      `  /**`,
      `   * Отримує помилки валідації у зручному форматі`,
      `   */`,
      `  getValidationErrors<T>(schema: z.ZodType<T>, data: unknown): string[] {`,
      `    const result = schema.safeParse(data);`,
      `    if (result.success) return [];`,
      `    `,
      `    return result.error.errors.map(err => `,
      `      \`\${err.path.join('.')}: \${err.message}\``,
      `    );`,
      `  },`,
      '',
      `  /**`,
      `   * Створює union схему з кількох схем`,
      `   */`,
      `  createUnion<T extends readonly [z.ZodTypeAny, ...z.ZodTypeAny[]]>(`,
      `    schemas: T`,
      `  ): z.ZodUnion<T> {`,
      `    return z.union(schemas);`,
      `  },`,
      '',
      `  /**`,
      `   * Створює схему з default значенням`,
      `   */`,
      `  withDefault<T>(schema: z.ZodType<T>, defaultValue: T): z.ZodDefault<z.ZodType<T>> {`,
      `    return schema.default(defaultValue);`,
      `  },`,
      `} as const;`,
    ].join('\n')
  );

  const content = exports.join('\n');
  fs.writeFileSync(mainIndexPath, content, 'utf8');
  console.log(`✅ Створено загальний Zod index файл`);
}

/**
 * Основна функція
 */
function main() {
  const domainName = process.argv[2];

  if (domainName && domainName !== 'full') {
    console.log(`🚀 Створення Zod index для домену: ${domainName}`);
    createZodIndex(domainName);
  } else if (domainName === 'full') {
    console.log('🚀 Створення Zod index для full API');
    createZodIndex('full');
    createMainZodIndex();
  } else {
    console.log('🚀 Створення всіх Zod index файлів');
    const domains = [
      'auth',
      'branch',
      'client',
      'order',
      'order-wizard',
      'pricing',
      'receipt',
      'test',
    ];
    domains.forEach(createZodIndex);
    createMainZodIndex();
  }

  console.log('🎉 Завершено створення Zod index файлів!');
}

// Запускаємо якщо це головний модуль
if (require.main === module) {
  main();
}

module.exports = { createZodIndex, createMainZodIndex, main };
