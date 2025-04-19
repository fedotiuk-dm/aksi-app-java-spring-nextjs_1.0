/**
 * Скрипт імпорту прайс-листа для системи Order Wizard
 * 
 * Даний скрипт призначений для:
 * 1. Завантаження прайс-листа з JSON файлу
 * 2. Валідації даних за допомогою JSON Schema
 * 3. Імпорту даних у локальну базу даних або API-сервіс
 * 4. Перевірки успішності імпорту та логування результатів
 */

// Залежності (встановити через npm, якщо використовується Node.js)
// npm install ajv axios localforage

// Імпорт необхідних модулів
import Ajv from 'ajv';
import axios from 'axios';
import localforage from 'localforage';

/**
 * Клас імпортера прайс-листа
 */
class PriceListImporter {
  /**
   * Конструктор класу
   * @param {Object} options - Опції імпортера
   * @param {string} options.apiUrl - URL API для віддаленого імпорту (опціонально)
   * @param {boolean} options.useLocalStorage - Чи використовувати локальне сховище
   * @param {Object} options.schema - JSON Schema для валідації
   */
  constructor(options = {}) {
    this.apiUrl = options.apiUrl || null;
    this.useLocalStorage = options.useLocalStorage || true;
    this.schema = options.schema || null;
    
    // Ініціалізація localforage для локального сховища
    localforage.config({
      name: 'OrderWizardStorage',
      storeName: 'pricelist'
    });
    
    // Ініціалізація валідатора
    this.validator = new Ajv({ allErrors: true });
    if (this.schema) {
      this.validate = this.validator.compile(this.schema);
    }
    
    // Логування
    this.logs = [];
  }
  
  /**
   * Логування повідомлень
   * @param {string} message - Повідомлення для логування
   * @param {string} type - Тип повідомлення (info, warning, error)
   */
  log(message, type = 'info') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message,
      type
    };
    
    this.logs.push(logEntry);
    
    // Виведення в консоль
    if (type === 'error') {
      console.error(`[${logEntry.timestamp}] ERROR: ${message}`);
    } else if (type === 'warning') {
      console.warn(`[${logEntry.timestamp}] WARNING: ${message}`);
    } else {
      console.log(`[${logEntry.timestamp}] INFO: ${message}`);
    }
  }
  
  /**
   * Завантаження файлу прайс-листа
   * @param {File|string} source - Файл або шлях до файлу
   * @returns {Promise<Object>} - Об'єкт прайс-листа
   */
  async loadPriceList(source) {
    try {
      let priceListData;
      
      if (typeof source === 'string') {
        // Завантаження з URL або локального шляху
        if (source.startsWith('http')) {
          const response = await axios.get(source);
          priceListData = response.data;
        } else {
          // В браузері використовуємо fetch для локальних файлів
          const response = await fetch(source);
          priceListData = await response.json();
        }
      } else if (source instanceof File) {
        // Завантаження з об'єкту File (для веб-інтерфейсу)
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const data = JSON.parse(event.target.result);
              resolve(data);
            } catch (e) {
              reject(new Error(`Помилка парсингу JSON: ${e.message}`));
            }
          };
          reader.onerror = (error) => reject(error);
          reader.readAsText(source);
        });
      } else {
        throw new Error('Непідтримуваний тип джерела даних');
      }
      
      this.log(`Прайс-лист успішно завантажено. Версія: ${priceListData.version}`);
      return priceListData;
    } catch (error) {
      this.log(`Помилка завантаження прайс-листа: ${error.message}`, 'error');
      throw error;
    }
  }
  
  /**
   * Валідація прайс-листа
   * @param {Object} priceListData - Дані прайс-листа
   * @returns {boolean} - Результат валідації
   */
  validatePriceList(priceListData) {
    if (!this.validate) {
      this.log('Схема валідації не визначена, пропускаємо перевірку', 'warning');
      return true;
    }
    
    const valid = this.validate(priceListData);
    
    if (!valid) {
      const errors = this.validate.errors;
      this.log(`Помилка валідації прайс-листа: ${JSON.stringify(errors)}`, 'error');
      return false;
    }
    
    this.log('Прайс-лист успішно пройшов валідацію');
    return true;
  }
  
  /**
   * Перевірка даних на логічну цілісність
   * @param {Object} priceListData - Дані прайс-листа
   * @returns {boolean} - Результат перевірки
   */
  checkDataIntegrity(priceListData) {
    try {
      // Перевірка наявності всіх обов'язкових секцій
      const requiredSections = ['services'];
      for (const section of requiredSections) {
        if (!priceListData[section] || !Array.isArray(priceListData[section])) {
          this.log(`Відсутня обов'язкова секція ${section}`, 'error');
          return false;
        }
      }
      
      // Перевірка унікальності ID в категоріях
      const categoryIds = new Set();
      for (const category of priceListData.services) {
        if (categoryIds.has(category.categoryId)) {
          this.log(`Дублікат categoryId: ${category.categoryId}`, 'error');
          return false;
        }
        categoryIds.add(category.categoryId);
      }
      
      // Перевірка унікальності ID товарів
      const itemIds = new Set();
      for (const category of priceListData.services) {
        for (const item of category.items) {
          if (itemIds.has(item.id)) {
            this.log(`Дублікат item.id: ${item.id}`, 'error');
            return false;
          }
          itemIds.add(item.id);
        }
      }
      
      this.log('Перевірка цілісності даних пройшла успішно');
      return true;
    } catch (error) {
      this.log(`Помилка перевірки цілісності даних: ${error.message}`, 'error');
      return false;
    }
  }
  
  /**
   * Зберігання даних в локальне сховище
   * @param {Object} priceListData - Дані прайс-листа
   * @returns {Promise<boolean>} - Результат збереження
   */
  async saveToLocalStorage(priceListData) {
    try {
      // Зберігаємо повний прайс-лист
      await localforage.setItem('priceList', priceListData);
      
      // Зберігаємо кожну категорію окремо для швидшого доступу
      for (const category of priceListData.services) {
        await localforage.setItem(`category_${category.categoryId}`, category);
      }
      
      // Зберігаємо дату останнього оновлення
      await localforage.setItem('lastUpdated', priceListData.lastUpdated);
      
      this.log(`Прайс-лист успішно збережено в локальне сховище. Версія: ${priceListData.version}`);
      return true;
    } catch (error) {
      this.log(`Помилка збереження в локальне сховище: ${error.message}`, 'error');
      return false;
    }
  }
  
  /**
   * Збереження даних через API
   * @param {Object} priceListData - Дані прайс-листа
   * @returns {Promise<boolean>} - Результат збереження
   */
  async saveToAPI(priceListData) {
    if (!this.apiUrl) {
      this.log('URL API не вказано, неможливо зберегти дані', 'error');
      return false;
    }
    
    try {
      const response = await axios.post(`${this.apiUrl}/pricelist/import`, priceListData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        this.log(`Прайс-лист успішно імпортовано через API. Відповідь сервера: ${JSON.stringify(response.data)}`);
        return true;
      } else {
        this.log(`Помилка імпорту через API. Статус: ${response.status}`, 'error');
        return false;
      }
    } catch (error) {
      this.log(`Помилка імпорту через API: ${error.message}`, 'error');
      return false;
    }
  }
  
  /**
   * Отримання основних статистичних даних про прайс-лист
   * @param {Object} priceListData - Дані прайс-листа
   * @returns {Object} - Статистика
   */
  getPriceListStats(priceListData) {
    const stats = {
      version: priceListData.version,
      lastUpdated: priceListData.lastUpdated,
      categoriesCount: priceListData.services.length,
      itemsCount: 0,
      categoriesBreakdown: {}
    };
    
    // Рахуємо товари в кожній категорії
    for (const category of priceListData.services) {
      const itemsCount = category.items.length;
      stats.itemsCount += itemsCount;
      stats.categoriesBreakdown[category.categoryName] = itemsCount;
    }
    
    return stats;
  }
  
  /**
   * Основний метод для імпорту прайс-листа
   * @param {File|string} source - Файл або шлях до файлу
   * @returns {Promise<Object>} - Результат імпорту
   */
  async importPriceList(source) {
    try {
      this.log('Початок імпорту прайс-листа');
      
      // Завантаження даних
      const priceListData = await this.loadPriceList(source);
      
      // Валідація даних
      const isValid = this.validatePriceList(priceListData);
      if (!isValid) {
        return { success: false, logs: this.logs, message: 'Помилка валідації даних' };
      }
      
      // Перевірка цілісності даних
      const isIntegrityOk = this.checkDataIntegrity(priceListData);
      if (!isIntegrityOk) {
        return { success: false, logs: this.logs, message: 'Помилка цілісності даних' };
      }
      
      // Збереження даних
      let saveResult = false;
      
      if (this.useLocalStorage) {
        saveResult = await this.saveToLocalStorage(priceListData);
      }
      
      if (this.apiUrl) {
        const apiSaveResult = await this.saveToAPI(priceListData);
        saveResult = saveResult || apiSaveResult;
      }
      
      if (!saveResult) {
        return { success: false, logs: this.logs, message: 'Помилка збереження даних' };
      }
      
      // Формування статистики
      const stats = this.getPriceListStats(priceListData);
      
      this.log(`Імпорт прайс-листа успішно завершено. Версія: ${priceListData.version}`);
      
      return {
        success: true,
        logs: this.logs,
        message: 'Імпорт успішно завершено',
        stats
      };
    } catch (error) {
      this.log(`Критична помилка імпорту: ${error.message}`, 'error');
      return { success: false, logs: this.logs, message: `Критична помилка: ${error.message}` };
    }
  }
}

/**
 * Приклад використання
 */
async function runImport() {
  // Завантаження JSON schema для валідації
  const schemaResponse = await fetch('/data/price-schema.json');
  const schema = await schemaResponse.json();
  
  // Створення екземпляру імпортера
  const importer = new PriceListImporter({
    apiUrl: 'https://api.yourdomain.com/api/v1',
    useLocalStorage: true,
    schema
  });
  
  // Отримання файлу з форми (для веб-інтерфейсу)
  const fileInput = document.getElementById('priceListFile');
  if (!fileInput.files.length) {
    alert('Будь ласка, виберіть файл прайс-листа');
    return;
  }
  
  // Запуск імпорту
  const result = await importer.importPriceList(fileInput.files[0]);
  
  // Виведення результату
  if (result.success) {
    console.log('Імпорт успішно завершено!');
    console.log('Статистика:', result.stats);
  } else {
    console.error('Помилка імпорту:', result.message);
  }
  
  // Виведення логів у елемент на сторінці
  const logsElement = document.getElementById('importLogs');
  if (logsElement) {
    logsElement.innerHTML = result.logs.map(log => 
      `<div class="log-entry log-${log.type}">
        <span class="log-time">${new Date(log.timestamp).toLocaleTimeString()}</span>
        <span class="log-message">${log.message}</span>
       </div>`
    ).join('');
  }
}

/**
 * Отримання даних прайс-листа з локального сховища
 * @returns {Promise<Object>} - Дані прайс-листа
 */
async function getPriceListFromStorage() {
  try {
    // Ініціалізація localforage
    localforage.config({
      name: 'OrderWizardStorage',
      storeName: 'pricelist'
    });
    
    // Отримання прайс-листа
    const priceList = await localforage.getItem('priceList');
    
    if (!priceList) {
      console.warn('Прайс-лист не знайдено в локальному сховищі');
      return null;
    }
    
    return priceList;
  } catch (error) {
    console.error('Помилка отримання прайс-листа:', error);
    return null;
  }
}

/**
 * Ініціалізація подій для форми імпорту
 */
function initImportForm() {
  const importForm = document.getElementById('importForm');
  if (!importForm) return;
  
  importForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await runImport();
  });
}

// Ініціалізація при завантаженні сторінки
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initImportForm();
  });
}

// Експорт для використання в модульному середовищі
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PriceListImporter, getPriceListFromStorage };
}