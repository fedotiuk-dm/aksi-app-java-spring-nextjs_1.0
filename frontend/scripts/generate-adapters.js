#!/usr/bin/env node

/**
 * @fileoverview Генератор адаптерів для Order Wizard доменів
 *
 * Спрощений скрипт для створення доменних адаптерів на основі Orval згенерованих типів.
 * Фокус на Order Wizard контролерах та "DDD inside, FSD outside" архітектурі.
 *
 * Процес:
 * 1. Аналізує згенеровані Orval типи
 * 2. Створює адаптери для трансформації API -> Domain типів
 * 3. Генерує утиліти для роботи з Order Wizard доменами
 *
 * Використання:
 * npm run generate-adapters
 */

const fs = require('fs');
const path = require('path');

// 🔧 Конфігурація для Order Wizard
const CONFIG = {
  // Шляхи
  outputDir: path.join(__dirname, '../domains/wizard/shared/adapters'),
  generatedTypesFile: path.join(__dirname, '../shared/api/generated/wizard/aksiApi.schemas.ts'),

  // Order Wizard домени відповідно до контролерів та архітектури
  domains: {
    // Основні етапи (Stage Controllers)
    stage1: {
      name: 'stage1',
      tag: 'Stage 1 API',
      description: 'Етап 1: Клієнт та базова інформація замовлення',
      types: ['Client', 'Branch', 'Order', 'ClientSearch', 'ContactMethod'],
      features: ['client-search', 'client-creation', 'basic-order-info'],
    },
    stage2: {
      name: 'stage2',
      tag: 'Stage 2 Main API',
      description: 'Етап 2: Головний менеджер предметів',
      types: ['Item', 'ItemManager', 'ItemList'],
      features: ['item-manager'],
    },
    stage3: {
      name: 'stage3',
      tag: 'Stage 3 API',
      description: 'Етап 3: Загальні параметри замовлення',
      types: ['Discount', 'Payment', 'Execution', 'OrderParams'],
      features: ['execution-params', 'discounts', 'payment'],
    },
    stage4: {
      name: 'stage4',
      tag: 'Stage 4 API',
      description: 'Етап 4: Підтвердження та формування квитанції',
      types: ['Receipt', 'Legal', 'Review', 'OrderSummary'],
      features: ['order-review', 'legal-aspects', 'receipt-generation'],
    },

    // Підетапи Stage 2 (Substep Controllers)
    substep1: {
      name: 'substep1',
      tag: 'Substep 1 API',
      parent: 'stage2',
      description: 'Підетап 2.1: Основна інформація про предмет',
      types: ['ItemBasicInfo', 'Category', 'ServiceType'],
      features: ['item-basic-info'],
    },
    substep2: {
      name: 'substep2',
      tag: 'Substep 2 API',
      parent: 'stage2',
      description: 'Підетап 2.2: Характеристики предмета',
      types: ['Material', 'Color', 'Filling', 'WearLevel'],
      features: ['item-characteristics'],
    },
    substep3: {
      name: 'substep3',
      tag: 'Substep 3 API',
      parent: 'stage2',
      description: 'Підетап 2.3: Забруднення, дефекти та ризики',
      types: ['Stain', 'Defect', 'Risk', 'Damage'],
      features: ['defects-stains'],
    },
    substep4: {
      name: 'substep4',
      tag: 'Substep 4 API',
      parent: 'stage2',
      description: 'Підетап 2.4: Розрахунок ціни та модифікатори',
      types: ['Price', 'Modifier', 'Coefficient', 'PriceCalculation'],
      features: ['price-calculation'],
    },
    substep5: {
      name: 'substep5',
      tag: 'Substep 5 API',
      parent: 'stage2',
      description: 'Підетап 2.5: Фотодокументація предметів',
      types: ['Photo', 'Image', 'Upload', 'Documentation'],
      features: ['photo-upload'],
    },

    // Головний контролер
    wizardMain: {
      name: 'wizard-main',
      tag: 'Order Wizard Main API',
      description: 'Головний контролер Order Wizard (навігація, стан)',
      types: ['WizardState', 'Navigation', 'Progress', 'OrderWizard'],
      features: ['workflow', 'navigation', 'state-management'],
    },
  },
};

/**
 * Читає згенеровані типи та витягує доступні моделі
 */
function extractAvailableTypes() {
  if (!fs.existsSync(CONFIG.generatedTypesFile)) {
    console.log('❌ Не знайдено згенеровані типи:', CONFIG.generatedTypesFile);
    return [];
  }

  const content = fs.readFileSync(CONFIG.generatedTypesFile, 'utf8');

  // Витягуємо всі експортовані інтерфейси та типи
  const interfaceMatches = content.match(/export\s+interface\s+(\w+)/g) || [];
  const typeMatches = content.match(/export\s+type\s+(\w+)/g) || [];

  const interfaces = interfaceMatches.map((match) => match.replace(/export\s+interface\s+/, ''));
  const types = typeMatches.map((match) => match.replace(/export\s+type\s+/, ''));

  const allTypes = [...interfaces, ...types];

  console.log(`📋 Знайдено ${allTypes.length} типів:`, allTypes.slice(0, 10).join(', '), '...');

  return allTypes;
}

/**
 * Генерує детальний адаптер для домену
 */
function generateDomainAdapter(domainName, domainInfo, availableTypes) {
  const parentInfo = domainInfo.parent ? ` (підетап ${domainInfo.parent})` : '';
  const featuresComment = domainInfo.features
    ? `\n * Features: ${domainInfo.features.join(', ')}`
    : '';

  const adapterContent = `/**
 * @fileoverview Адаптер для ${domainInfo.description}${parentInfo}
 *
 * Цей файл автоматично генерується скриптом generate-adapters.js
 * НЕ РЕДАГУЙТЕ ВРУЧНУ!
 *
 * Controller Tag: "${domainInfo.tag}"${featuresComment}
 *
 * Трансформує API типи в доменні моделі для Order Wizard
 */

import type {
  // Загальні типи з Orval API генерації
  ClientResponse,
  OrderResponse,
  BranchResponse,
  ErrorResponse,
  // Специфічні типи для ${domainName}
  // Додаткові типи будуть додані автоматично при розширенні API
} from '@/shared/api/generated/wizard/aksiApi.schemas';

// 🔄 Адаптери для ${domainInfo.description}

/**
 * Головний адаптер для ${domainName}
 * Трансформує API відповіді в доменні моделі
 */
export class ${capitalize(domainName)}Adapter {
  static readonly DOMAIN_NAME = '${domainName}';
  static readonly DOMAIN_TAG = '${domainInfo.tag}';
  static readonly DESCRIPTION = '${domainInfo.description}';
  ${domainInfo.parent ? `static readonly PARENT_STAGE = '${domainInfo.parent}';` : ''}

  /**
   * Загальний метод для безпечної трансформації з логуванням
   */
  static safeTransform<TInput, TOutput>(
    input: TInput | null | undefined,
    transformer: (input: TInput) => TOutput,
    fallback: TOutput,
    context = 'unknown'
  ): TOutput {
    if (!input) {
      console.debug(\`[${capitalize(domainName)}Adapter] Порожні дані для \${context}\`);
      return fallback;
    }

    try {
      return transformer(input);
    } catch (error) {
      console.warn(\`[${capitalize(domainName)}Adapter] Помилка трансформації у \${context}:\`, error);
      return fallback;
    }
  }

  /**
   * Перевіряє чи є об'єкт валідним API response
   */
  static isValidApiResponse<T extends Record<string, unknown>>(
    response: unknown
  ): response is T {
    return response !== null &&
           response !== undefined &&
           typeof response === 'object' &&
           !Array.isArray(response);
  }

  /**
   * Трансформує масив API об'єктів з фільтрацією невалідних
   */
  static transformArray<TInput, TOutput>(
    input: TInput[] | null | undefined,
    transformer: (item: TInput) => TOutput,
    filterInvalid = true
  ): TOutput[] {
    if (!Array.isArray(input)) return [];

    const results: TOutput[] = [];

    for (const item of input) {
      try {
        const transformed = transformer(item);
        if (!filterInvalid || transformed !== null) {
          results.push(transformed);
        }
      } catch (error) {
        if (!filterInvalid) {
          console.warn(\`[${capitalize(domainName)}Adapter] Помилка трансформації елемента:\`, error);
        }
      }
    }

    return results;
  }
}

// 🛠️ Утиліти для роботи з ${domainName} даними

/**
 * Утиліти для валідації даних ${domainName}
 */
export const ${domainName}ValidationUtils = {
  /**
   * Перевіряє чи є ID валідним
   */
  isValidId(id: unknown): id is string {
    return typeof id === 'string' && id.trim().length > 0;
  },

  /**
   * Перевіряє чи є дата валідною ISO строкою
   */
  isValidDate(date: unknown): date is string {
    if (typeof date !== 'string') return false;
    const parsed = Date.parse(date);
    return !isNaN(parsed) && parsed > 0;
  },

  /**
   * Безпечно парсить дату з fallback
   */
  parseDate(dateString: unknown, fallback: Date | null = null): Date | null {
    if (!this.isValidDate(dateString)) return fallback;

    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? fallback : date;
    } catch {
      return fallback;
    }
  },

  /**
   * Перевіряє чи є об'єкт не порожнім
   */
  isNotEmpty(obj: unknown): boolean {
    if (!obj || typeof obj !== 'object') return false;
    return Object.keys(obj).length > 0;
  },

  /**
   * Безпечно отримує строкове значення
   */
  getString(value: unknown, fallback = ''): string {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    return fallback;
  },

  /**
   * Безпечно отримує числове значення
   */
  getNumber(value: unknown, fallback = 0): number {
    if (typeof value === 'number' && !isNaN(value)) return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? fallback : parsed;
    }
    return fallback;
  },
} as const;

// 🎯 Специфічні утиліти для ${domainInfo.description}

/**
 * Утиліти специфічні для функціональності ${domainName}
 */
export const ${domainName}SpecificUtils = {
  /**
   * Доменна назва для логування та відладки
   */
  domainName: '${domainName}' as const,

  /**
   * Функції для роботи з даними домену
   * Тут будуть додані специфічні утиліти при розширенні
   */
  ${
    domainInfo.features
      ? domainInfo.features.map((feature) => `// TODO: Додати утиліти для ${feature}`).join('\n  ')
      : '// TODO: Додати специфічні утиліти'
  }
} as const;

// 📤 Експорт для використання в доменній архітектурі

/**
 * Головний експорт адаптерів ${domainName}
 */
export const ${domainName}Adapters = {
  // Класи адаптерів
  ${capitalize(domainName)}Adapter,

  // Утиліти
  validationUtils: ${domainName}ValidationUtils,
  specificUtils: ${domainName}SpecificUtils,

  // Константи
  DOMAIN_INFO: {
    name: '${domainName}',
    tag: '${domainInfo.tag}',
    description: '${domainInfo.description}',
    ${domainInfo.parent ? `parent: '${domainInfo.parent}',` : ''}
    ${domainInfo.features ? `features: ${JSON.stringify(domainInfo.features)},` : ''}
  },
} as const;

// 🏷️ Типи для TypeScript

/**
 * Тип адаптера ${domainName}
 */
export type ${capitalize(domainName)}AdapterType = typeof ${capitalize(domainName)}Adapter;

/**
 * Тип утиліт валідації ${domainName}
 */
export type ${capitalize(domainName)}ValidationUtilsType = typeof ${domainName}ValidationUtils;

/**
 * Загальний тип експорту адаптерів ${domainName}
 */
export type ${capitalize(domainName)}AdaptersType = typeof ${domainName}Adapters;
`;

  return adapterContent;
}

/**
 * Генерує індекс файл для всіх адаптерів
 */
function generateAdaptersIndex(domains) {
  const indexContent = `/**
 * @fileoverview Головний індекс для всіх Order Wizard адаптерів
 *
 * Цей файл автоматично генерується скриптом generate-adapters.js
 * НЕ РЕДАГУЙТЕ ВРУЧНУ!
 */

// 🔄 Експорт всіх доменних адаптерів
${Object.keys(domains)
  .map((domain) => `export * from './${domain}.adapter';`)
  .join('\n')}

// 🛠️ Загальні утиліти для всіх адаптерів
export const wizardAdapters = {
${Object.keys(domains)
  .map((domain) => `  ${domain}: () => import('./${domain}.adapter'),`)
  .join('\n')}
} as const;

/**
 * Типи всіх доступних адаптерів
 */
export type WizardAdapterType = keyof typeof wizardAdapters;

/**
 * Загальний тип для всіх адаптерів
 */
export type AdapterFunction<TInput, TOutput> = (input: TInput) => TOutput;

/**
 * Базовий клас для всіх адаптерів
 */
export abstract class BaseAdapter {
  abstract readonly domainName: string;

  /**
   * Логує помилку трансформації
   */
  protected logTransformError(error: unknown, context: string): void {
    console.warn(\`[\${this.domainName}Adapter] \${context}:\`, error);
  }

  /**
   * Безпечна трансформація з логуванням
   */
  protected safeTransform<TInput, TOutput>(
    input: TInput,
    transformer: (input: TInput) => TOutput,
    fallback: TOutput,
    context: string
  ): TOutput {
    try {
      return transformer(input);
    } catch (error) {
      this.logTransformError(error, context);
      return fallback;
    }
  }
}
`;

  return indexContent;
}

/**
 * Створює папку якщо не існує
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Створено папку: ${dirPath}`);
  }
}

/**
 * Капіталізує перший символ рядка
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Основна функція
 */
async function main() {
  console.log('🚀 Генерація адаптерів для Order Wizard доменів...');

  // Перевіряємо доступність згенерованих типів
  const availableTypes = extractAvailableTypes();

  if (availableTypes.length === 0) {
    console.log('❌ Не знайдено згенерованих типів. Запустіть спочатку orval генерацію.');
    process.exit(1);
  }

  // Створюємо вихідну папку
  ensureDirectoryExists(CONFIG.outputDir);

  // Генеруємо адаптери для кожного домену
  Object.entries(CONFIG.domains).forEach(([domainName, domainInfo]) => {
    console.log(`📝 Створення адаптера для ${domainName}...`);

    const adapterContent = generateDomainAdapter(domainName, domainInfo, availableTypes);
    const adapterPath = path.join(CONFIG.outputDir, `${domainName}.adapter.ts`);

    fs.writeFileSync(adapterPath, adapterContent, 'utf8');
    console.log(`✅ Створено адаптер: ${domainName}.adapter.ts`);
  });

  // Генеруємо індекс файл
  console.log('📝 Створення індекс файлу...');
  const indexContent = generateAdaptersIndex(CONFIG.domains);
  const indexPath = path.join(CONFIG.outputDir, 'index.ts');

  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log('✅ Створено індекс файл: index.ts');

  console.log('🎉 Генерація адаптерів завершена успішно!');
  console.log(`📂 Результат в: ${CONFIG.outputDir}`);
}

// Запускаємо якщо це головний модуль
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Помилка при генерації адаптерів:', error);
    process.exit(1);
  });
}

module.exports = { main, generateDomainAdapter, generateAdaptersIndex };
