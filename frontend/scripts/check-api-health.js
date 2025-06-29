#!/usr/bin/env node

/**
 * @fileoverview Скрипт для перевірки здоров'я API перед генерацією
 */

const axios = require('axios');

const API_BASE_URL = process.env.API_URL || 'http://localhost:8080';
const TIMEOUT = 10000; // 10 секунд

async function checkApiHealth() {
  console.log('🔍 Перевірка доступності API...');

  try {
    // Перевірка базового endpoint
    const response = await axios.get(`${API_BASE_URL}/api/v3/api-docs`, {
      timeout: TIMEOUT,
    });

    if (response.status === 200) {
      console.log('✅ API доступний та працює');
      console.log(`📊 Розмір OpenAPI схеми: ${JSON.stringify(response.data).length} байт`);
      return true;
    }
  } catch (error) {
    console.error('❌ API недоступний:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
    });

    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Підказка: Переконайтеся що бекенд запущений на порті 8080');
    }

    return false;
  }
}

async function main() {
  const isHealthy = await checkApiHealth();
  process.exit(isHealthy ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = { checkApiHealth };
