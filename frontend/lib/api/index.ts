import { OpenAPI } from './generated';
import { SERVER_API_URL } from '@/constants/urls';

// Налаштування базового URL для API клієнтів
OpenAPI.BASE = `${SERVER_API_URL}/api`;

// Автоматичне додавання авторизаційного заголовка
OpenAPI.WITH_CREDENTIALS = true;

export * from './generated';
