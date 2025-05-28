#!/usr/bin/env node

/**
 * @fileoverview Скрипт для валідації згенерованих Zod схем
 */

const fs = require('fs');
const path = require('path');

const GENERATED_PATH = path.join(__dirname, '../shared/api/generated');
const DOMAINS = ['auth', 'branch', 'client', 'order', 'pricing', 'receipt', 'test'];

function validateDomainSchemas(domain) {
  const domainPath = path.join(GENERATED_PATH, domain);
  const zodPath = path.join(domainPath, 'zod', 'aksiApi.ts');

  if (!fs.existsSync(zodPath)) {
    console.log(`⏭️  ${domain}: Zod схеми не знайдені`);
    return false;
  }

  try {
    // Перевірка синтаксису файлу
    const content = fs.readFileSync(zodPath, 'utf8');

    // Базові перевірки
    if (!content.includes('z as zod') && !content.includes('import { z }')) {
      throw new Error('Відсутній імпорт Zod');
    }

    if (!content.includes('export const')) {
      throw new Error('Відсутні експорти схем');
    }

    // Підрахунок схем (перевіряємо різні паттерни)
    const zodSchemas = (content.match(/export const \w+.*zod\./g) || []).length;
    const zSchemas = (content.match(/export const \w+.*z\./g) || []).length;
    const schemaCount = Math.max(zodSchemas, zSchemas);

    console.log(`✅ ${domain}: ${schemaCount} Zod схем`);
    return true;
  } catch (error) {
    console.error(`❌ ${domain}: Помилка валідації - ${error.message}`);
    return false;
  }
}

function validateMainIndex() {
  const indexPath = path.join(GENERATED_PATH, 'index.ts');

  if (!fs.existsSync(indexPath)) {
    console.error('❌ Відсутній головний index.ts файл');
    return false;
  }

  console.log('✅ Головний index.ts файл існує');
  return true;
}

function main() {
  console.log('🔍 Валідація згенерованих схем...');

  let allValid = true;

  // Перевіряємо кожен домен
  DOMAINS.forEach((domain) => {
    const isValid = validateDomainSchemas(domain);
    allValid = allValid && isValid;
  });

  // Перевіряємо головний index
  const indexValid = validateMainIndex();
  allValid = allValid && indexValid;

  if (allValid) {
    console.log('🎉 Всі схеми валідні!');
  } else {
    console.error('❌ Знайдені помилки в схемах');
  }

  process.exit(allValid ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = { validateDomainSchemas, validateMainIndex };
