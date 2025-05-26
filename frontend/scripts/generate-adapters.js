#!/usr/bin/env node

/**
 * Скрипт для автоматичної генерації адаптерів на основі OpenAPI специфікації
 * Аналогічно до openapi-generator-cli, але створює доменні адаптери
 *
 * Процес:
 * 1. Читає OpenAPI специфікацію (JSON)
 * 2. Аналізує теги та операції
 * 3. Генерує адаптери для кожного домену
 * 4. Створює зручні функції з трансформацією даних
 *
 * Використання:
 * npm run generate-adapters
 * npm run generate-adapters:test  # використовує тестові дані
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Конфігурація
const CONFIG = {
  // URL до OpenAPI специфікації
  openApiUrl: process.env.OPENAPI_URL || 'http://localhost:8080/api/v3/api-docs',

  // Шляхи
  outputDir: path.join(__dirname, '../domain/wizard/adapters'),
  generatedServicesDir: path.join(__dirname, '../lib/api/generated/services'),
  testDataFile: path.join(__dirname, 'test-openapi.json'),

  // Режим тестування
  testMode: process.env.TEST_MODE === 'true' || process.argv.includes('--test'),

  // Мапування тегів до доменів Order Wizard
  tagToDomainMapping: {
    Clients: 'client',
    'Order Management - Basic Operations': 'order',
    'Order Management - Items': 'order-item',
    'Order Management - Item Photos': 'order-item',
    'Branch Locations API': 'branch',
    'Pricing API': 'pricing',
    'Pricing - Categories': 'pricing',
    'Pricing - Modifiers': 'pricing',
    'Pricing - Calculation': 'pricing',
    'Reference Data': 'shared',
    Authentication: 'auth',
  },

  // Шаблони для генерації
  templates: {
    adapterFile: 'adapter-file.template',
    adapterFunction: 'adapter-function.template',
    indexFile: 'index.template',
  },
};

/**
 * Створює тестові OpenAPI дані якщо файл не існує
 */
function createTestOpenApiData() {
  const testData = {
    openapi: '3.0.1',
    info: {
      title: 'Test API',
      version: '1.0.0',
    },
    tags: [
      { name: 'Clients', description: 'Client management operations' },
      { name: 'Order Management - Basic Operations', description: 'Basic order operations' },
      { name: 'Pricing API', description: 'Pricing operations' },
    ],
    paths: {
      '/clients': {
        get: {
          tags: ['Clients'],
          operationId: 'getAllClients',
          summary: 'Отримати всіх клієнтів',
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer' },
            },
            {
              name: 'size',
              in: 'query',
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ClientResponse' },
                },
              },
            },
          },
        },
        post: {
          tags: ['Clients'],
          operationId: 'createClient',
          summary: 'Створити нового клієнта',
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateClientRequest' },
              },
            },
          },
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ClientResponse' },
                },
              },
            },
          },
        },
      },
      '/clients/{id}': {
        get: {
          tags: ['Clients'],
          operationId: 'getClientById',
          summary: 'Отримати клієнта за ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ClientResponse' },
                },
              },
            },
          },
        },
      },
      '/orders': {
        get: {
          tags: ['Order Management - Basic Operations'],
          operationId: 'getAllOrders',
          summary: 'Отримати всі замовлення',
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/OrderResponse' },
                },
              },
            },
          },
        },
      },
      '/pricing/calculate': {
        post: {
          tags: ['Pricing API'],
          operationId: 'calculatePrice',
          summary: 'Розрахувати ціну',
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PriceCalculationRequest' },
              },
            },
          },
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PriceCalculationResponse' },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        ClientResponse: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
          },
        },
        CreateClientRequest: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
          },
        },
        OrderResponse: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            clientId: { type: 'string' },
          },
        },
        PriceCalculationRequest: {
          type: 'object',
          properties: {
            itemId: { type: 'string' },
            quantity: { type: 'number' },
          },
        },
        PriceCalculationResponse: {
          type: 'object',
          properties: {
            totalPrice: { type: 'number' },
            currency: { type: 'string' },
          },
        },
      },
    },
  };

  fs.writeFileSync(CONFIG.testDataFile, JSON.stringify(testData, null, 2), 'utf8');
  return testData;
}

/**
 * Завантажує OpenAPI специфікацію
 */
async function fetchOpenApiSpec(url) {
  // Якщо тестовий режим, використовуємо локальні дані
  if (CONFIG.testMode) {
    console.log('🧪 Тестовий режим: використання локальних даних');

    if (!fs.existsSync(CONFIG.testDataFile)) {
      console.log('📝 Створення тестових OpenAPI даних...');
      return createTestOpenApiData();
    }

    const testData = fs.readFileSync(CONFIG.testDataFile, 'utf8');
    return JSON.parse(testData);
  }

  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    client
      .get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const spec = JSON.parse(data);
            resolve(spec);
          } catch (error) {
            reject(new Error(`Помилка парсингу JSON: ${error.message}`));
          }
        });
      })
      .on('error', (error) => {
        reject(new Error(`Помилка завантаження: ${error.message}`));
      });
  });
}

/**
 * Аналізує OpenAPI специфікацію та групує операції за доменами
 */
function analyzeOpenApiSpec(spec) {
  const domains = {};

  // Ініціалізуємо домени
  Object.values(CONFIG.tagToDomainMapping).forEach((domain) => {
    if (!domains[domain]) {
      domains[domain] = {
        name: domain,
        operations: [],
        tags: [],
        models: new Set(),
      };
    }
  });

  // Аналізуємо шляхи та операції
  Object.entries(spec.paths || {}).forEach(([path, pathItem]) => {
    Object.entries(pathItem).forEach(([method, operation]) => {
      if (!operation.tags || operation.tags.length === 0) return;

      const tag = operation.tags[0]; // Беремо перший тег
      const domain = CONFIG.tagToDomainMapping[tag];

      if (domain && domains[domain]) {
        // Додаємо операцію до домену
        domains[domain].operations.push({
          path,
          method: method.toUpperCase(),
          operationId: operation.operationId,
          summary: operation.summary,
          description: operation.description,
          parameters: operation.parameters || [],
          requestBody: operation.requestBody,
          responses: operation.responses,
          tags: operation.tags,
          deprecated: operation.deprecated || false,
        });

        // Додаємо тег до домену
        if (!domains[domain].tags.includes(tag)) {
          domains[domain].tags.push(tag);
        }

        // Збираємо моделі
        extractModelsFromOperation(operation, domains[domain].models);
      }
    });
  });

  return domains;
}

/**
 * Витягує моделі з операції
 */
function extractModelsFromOperation(operation, modelsSet) {
  // Аналізуємо параметри
  (operation.parameters || []).forEach((param) => {
    if (param.schema && param.schema.$ref) {
      const modelName = extractModelName(param.schema.$ref);
      if (modelName) modelsSet.add(modelName);
    }
  });

  // Аналізуємо request body
  if (operation.requestBody && operation.requestBody.content) {
    Object.values(operation.requestBody.content).forEach((content) => {
      if (content.schema && content.schema.$ref) {
        const modelName = extractModelName(content.schema.$ref);
        if (modelName) modelsSet.add(modelName);
      }
    });
  }

  // Аналізуємо responses
  Object.values(operation.responses || {}).forEach((response) => {
    if (response.content) {
      Object.values(response.content).forEach((content) => {
        if (content.schema && content.schema.$ref) {
          const modelName = extractModelName(content.schema.$ref);
          if (modelName) modelsSet.add(modelName);
        }
      });
    }
  });
}

/**
 * Витягує назву моделі з $ref
 */
function extractModelName(ref) {
  const match = ref.match(/#\/components\/schemas\/(.+)$/);
  return match ? match[1] : null;
}

/**
 * Генерує назву сервісу на основі тегу
 */
function generateServiceName(tag) {
  // Мапування тегів до назв сервісів
  const serviceMapping = {
    Clients: 'ClientsService',
    'Order Management - Basic Operations': 'OrderManagementBasicOperationsService',
    'Order Management - Items': 'OrderManagementItemsService',
    'Order Management - Item Photos': 'OrderManagementItemPhotosService',
    'Branch Locations API': 'BranchLocationsApiService',
    'Pricing API': 'PricingApiService',
    'Pricing - Categories': 'PricingCategoriesService',
    'Pricing - Modifiers': 'PricingModifiersService',
    'Pricing - Calculation': 'PricingCalculationService',
    'Reference Data': 'ReferenceDataService',
    Authentication: 'AuthenticationService',
  };

  return serviceMapping[tag] || `${tag.replace(/[^a-zA-Z0-9]/g, '')}Service`;
}

/**
 * Генерує назву функції адаптера
 */
function generateAdapterFunctionName(operation) {
  if (operation.operationId) {
    // Конвертуємо camelCase в більш читабельний формат
    return operation.operationId;
  }

  // Генеруємо назву на основі методу та шляху
  const pathParts = operation.path.split('/').filter((part) => part && !part.startsWith('{'));
  const methodName = operation.method.toLowerCase();

  if (pathParts.length > 0) {
    const resourceName = pathParts[pathParts.length - 1];
    return `${methodName}${capitalize(resourceName)}`;
  }

  return `${methodName}Resource`;
}

/**
 * Капіталізує першу літеру
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Генерує адаптер для домену
 */
function generateDomainAdapter(domain, domainData) {
  const timestamp = new Date().toISOString();

  // Групуємо операції за сервісами
  const serviceGroups = {};
  domainData.operations.forEach((operation) => {
    const tag = operation.tags[0];
    const serviceName = generateServiceName(tag);

    if (!serviceGroups[serviceName]) {
      serviceGroups[serviceName] = {
        serviceName,
        tag,
        operations: [],
      };
    }

    serviceGroups[serviceName].operations.push(operation);
  });

  // Генеруємо імпорти
  const imports = [];
  const serviceNames = Object.keys(serviceGroups);

  // Імпорти сервісів
  serviceNames.forEach((serviceName) => {
    imports.push(`import { ${serviceName} } from '@/lib/api/generated/services/${serviceName}';`);
  });

  // Імпорти моделей
  const models = Array.from(domainData.models);
  if (models.length > 0) {
    imports.push(`import type {`);
    models.forEach((model, index) => {
      imports.push(`  ${model}${index < models.length - 1 ? ',' : ''}`);
    });
    imports.push(`} from '@/lib/api/generated/models';`);
  }

  // Генеруємо функції адаптера
  const adapterFunctions = [];

  Object.values(serviceGroups).forEach((group) => {
    group.operations.forEach((operation) => {
      const functionName = generateAdapterFunctionName(operation);
      const serviceName = group.serviceName;
      const originalMethodName = operation.operationId;

      // Генеруємо JSDoc коментар
      const jsdoc = [
        `/**`,
        ` * ${operation.summary || operation.description || 'API операція'}`,
        operation.description && operation.summary !== operation.description
          ? ` * ${operation.description}`
          : '',
        ` * `,
        ` * @generated Згенеровано з OpenAPI операції: ${originalMethodName}`,
        ` * @service ${serviceName}`,
        operation.deprecated ? ` * @deprecated` : '',
        ` */`,
      ].filter(Boolean);

      // Генеруємо параметри функції
      const hasParams = operation.parameters.length > 0 || operation.requestBody;
      const paramType = hasParams
        ? 'Parameters<typeof ' + serviceName + '.' + originalMethodName + '>[0]'
        : 'void';

      const functionCode = [
        ...jsdoc,
        `export const ${functionName} = async (${hasParams ? 'params: ' + paramType : ''}) => {`,
        `  try {`,
        `    // TODO: Додайте трансформацію вхідних даних якщо потрібно`,
        `    const result = await ${serviceName}.${originalMethodName}(${hasParams ? 'params' : ''});`,
        `    `,
        `    // TODO: Додайте трансформацію вихідних даних якщо потрібно`,
        `    return result;`,
        `  } catch (error) {`,
        `    // TODO: Додайте обробку помилок`,
        `    console.error('Помилка в ${functionName}:', error);`,
        `    throw error;`,
        `  }`,
        `};`,
      ];

      adapterFunctions.push(functionCode.join('\n'));
    });
  });

  // Генеруємо фінальний файл адаптера
  const adapterContent = [
    `/**`,
    ` * @fileoverview Адаптер для домену "${domain}"`,
    ` * @module domain/wizard/adapters/${domain}`,
    ` * `,
    ` * Автоматично згенеровано з OpenAPI специфікації`,
    ` * `,
    ` * @generated ${timestamp}`,
    ` * @generator scripts/generate-adapters.js`,
    ` */`,
    ``,
    ...imports,
    ``,
    `// ===== АДАПТЕРИ ДЛЯ ДОМЕНУ "${domain.toUpperCase()}" =====`,
    ``,
    ...adapterFunctions,
    ``,
    `// ===== КОНФІГУРАЦІЯ ДОМЕНУ =====`,
    ``,
    `export const ${domain.toUpperCase().replace(/-/g, '_')}_ADAPTER_CONFIG = {`,
    `  domain: '${domain}',`,
    `  tags: ${JSON.stringify(domainData.tags, null, 2)},`,
    `  operationsCount: ${domainData.operations.length},`,
    `  modelsCount: ${domainData.models.size},`,
    `  services: [${serviceNames.map((name) => `'${name}'`).join(', ')}],`,
    `  generated: '${timestamp}'`,
    `} as const;`,
  ].join('\n');

  return adapterContent;
}

/**
 * Генерує індексний файл для адаптерів
 */
function generateAdaptersIndex(domains) {
  const timestamp = new Date().toISOString();

  const content = [
    `/**`,
    ` * @fileoverview Головний індекс адаптерів Order Wizard`,
    ` * @module domain/wizard/adapters`,
    ` * `,
    ` * Автоматично згенеровано з OpenAPI специфікації`,
    ` * `,
    ` * @generated ${timestamp}`,
    ` * @generator scripts/generate-adapters.js`,
    ` */`,
    ``,
    `// ===== ЕКСПОРТИ АДАПТЕРІВ ПО ДОМЕНАХ =====`,
    ``,
  ];

  Object.keys(domains).forEach((domain) => {
    content.push(`// ${domain.toUpperCase()} DOMAIN`);
    content.push(`export * from './${domain}';`);
    content.push(``);
  });

  content.push(`// ===== КОНФІГУРАЦІЯ ВСІХ АДАПТЕРІВ =====`);
  content.push(``);
  content.push(`export const ADAPTERS_CONFIG = {`);
  content.push(`  version: '1.0.0',`);
  content.push(`  generated: '${timestamp}',`);
  content.push(
    `  domains: [${Object.keys(domains)
      .map((d) => `'${d}'`)
      .join(', ')}],`
  );
  content.push(
    `  totalOperations: ${Object.values(domains).reduce((sum, d) => sum + d.operations.length, 0)},`
  );
  content.push(`} as const;`);

  return content.join('\n');
}

/**
 * Створює папку якщо вона не існує
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Основна функція
 */
async function main() {
  console.log('🔄 Генерація адаптерів з OpenAPI специфікації...');

  if (CONFIG.testMode) {
    console.log('🧪 Режим тестування активовано');
  }

  try {
    // Завантажуємо OpenAPI специфікацію
    console.log(
      `📡 Завантаження OpenAPI з: ${CONFIG.testMode ? 'локальних тестових даних' : CONFIG.openApiUrl}`
    );
    const openApiSpec = await fetchOpenApiSpec(CONFIG.openApiUrl);

    console.log(`✅ OpenAPI специфікація завантажена`);
    console.log(`📊 Знайдено шляхів: ${Object.keys(openApiSpec.paths || {}).length}`);
    console.log(`📊 Знайдено тегів: ${(openApiSpec.tags || []).length}`);

    // Аналізуємо специфікацію
    console.log(`🔍 Аналіз операцій та групування по доменах...`);
    const domains = analyzeOpenApiSpec(openApiSpec);

    // Виводимо статистику
    Object.entries(domains).forEach(([domain, data]) => {
      if (data.operations.length > 0) {
        console.log(
          `  📁 ${domain}: ${data.operations.length} операцій, ${data.models.size} моделей`
        );
      }
    });

    // Створюємо папку для адаптерів
    ensureDirectoryExists(CONFIG.outputDir);

    // Генеруємо адаптери для кожного домену
    let generatedCount = 0;

    Object.entries(domains).forEach(([domain, domainData]) => {
      if (domainData.operations.length === 0) {
        console.log(`⚠️  Пропускаю домен ${domain} - немає операцій`);
        return;
      }

      console.log(`📝 Генерація адаптера для домену: ${domain}`);

      const adapterContent = generateDomainAdapter(domain, domainData);
      const outputPath = path.join(CONFIG.outputDir, `${domain}.ts`);

      fs.writeFileSync(outputPath, adapterContent, 'utf8');

      console.log(`  ✅ Згенеровано: ${outputPath}`);
      console.log(`  📊 Розмір: ${(adapterContent.length / 1024).toFixed(2)} KB`);

      generatedCount++;
    });

    // Генеруємо головний індексний файл
    console.log(`📝 Генерація головного індексу адаптерів...`);
    const indexContent = generateAdaptersIndex(domains);
    const indexPath = path.join(CONFIG.outputDir, 'index.ts');

    fs.writeFileSync(indexPath, indexContent, 'utf8');

    console.log(`✅ Головний індекс згенеровано: ${indexPath}`);

    // Фінальна статистика
    console.log(`\n🎉 Генерація завершена!`);
    console.log(`📊 Згенеровано адаптерів: ${generatedCount}`);
    console.log(
      `📊 Загальний розмір: ${((indexContent.length + Object.values(domains).reduce((sum, d) => sum + d.operations.length * 500, 0)) / 1024).toFixed(2)} KB`
    );

    if (CONFIG.testMode) {
      console.log(`\n🧪 Тестовий режим: для реальної генерації запустіть без --test флагу`);
    }
  } catch (error) {
    console.error('❌ Помилка при генерації адаптерів:', error.message);

    if (!CONFIG.testMode) {
      console.log('\n💡 Спробуйте тестовий режим: npm run generate-adapters:test');
    }

    process.exit(1);
  }
}

// Запускаємо скрипт
if (require.main === module) {
  main();
}

module.exports = {
  fetchOpenApiSpec,
  analyzeOpenApiSpec,
  generateDomainAdapter,
  CONFIG,
};
