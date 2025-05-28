#!/usr/bin/env node
/**
 * @fileoverview Скрипт для автоматичного створення index.ts файлів для згенерованих API доменів
 */

const fs = require('fs');
const path = require('path');

// Мапа доменів та їх описів
const DOMAIN_DESCRIPTIONS = {
  auth: 'автентифікації та авторизації',
  branch: 'роботи з пунктами прийому',
  client: 'роботи з клієнтами та підписами',
  order: "роботи з замовленнями та пов'язаними операціями",
  pricing: 'ціноутворення та прайс-листів',
  user: 'роботи з користувачами системи',
  receipt: 'роботи з квитанціями',
  test: 'тестування API',
  full: 'повного API (всі endpoints)',
};

/**
 * Створює index.ts файл для домену
 */
function createIndexFile(domainPath, domainName) {
  const domainDescription = DOMAIN_DESCRIPTIONS[domainName] || `роботи з ${domainName}`;
  const capitalizedDomain = domainName.charAt(0).toUpperCase() + domainName.slice(1);

  const indexContent = `/**
 * @fileoverview Публічне API домену ${capitalizedDomain}
 *
 * Експортує всі функції, типи та хуки для ${domainDescription}
 */

// Експорт всіх функцій та хуків
export * from './aksiApi';

// Експорт типів та схем
export * from './aksiApi.schemas';
`;

  const indexPath = path.join(domainPath, 'index.ts');

  try {
    fs.writeFileSync(indexPath, indexContent, 'utf8');
    console.log(`✅ Створено ${indexPath}`);
  } catch (error) {
    console.error(`❌ Помилка створення ${indexPath}:`, error.message);
  }
}

/**
 * Головна функція
 */
function main() {
  const generatedApiPath = path.join(__dirname, '..', 'shared', 'api', 'generated');

  if (!fs.existsSync(generatedApiPath)) {
    console.log('📁 Папка generated API не знайдена');
    return;
  }

  const domains = fs
    .readdirSync(generatedApiPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  console.log(`🔄 Знайдено доменів: ${domains.join(', ')}`);

  domains.forEach((domain) => {
    const domainPath = path.join(generatedApiPath, domain);
    const aksiApiPath = path.join(domainPath, 'aksiApi.ts');

    // Перевіряємо, чи існує згенерований aksiApi.ts
    if (fs.existsSync(aksiApiPath)) {
      createIndexFile(domainPath, domain);
    } else {
      console.log(`⚠️  Пропущено ${domain} - немає aksiApi.ts`);
    }
  });

  console.log('🎉 Завершено створення index.ts файлів!');
}

// Запускаємо якщо скрипт викликається напряму
if (require.main === module) {
  main();
}

module.exports = { main, createIndexFile };
