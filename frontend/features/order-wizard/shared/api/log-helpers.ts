/**
 * Допоміжні функції для логування API запитів та відповідей
 * Працюють з існуючою системою логування через інтерцептори axios
 */

/**
 * Типи для параметрів логування
 */
type LogData = Record<string, unknown> | string | number | boolean | null | undefined;

/**
 * Логування API запиту
 * @param operation Назва операції API
 * @param data Дані запиту
 */
export function logApiRequest(operation: string, data?: LogData): void {
  console.group(`%c [Client API] Request: ${operation}`, 'color: #61affe; font-weight: bold;');
  if (data) {
    console.log('Data:', data);
  }
  console.groupEnd();
}

/**
 * Логування успішної відповіді API
 * @param operation Назва операції API
 * @param data Дані відповіді
 */
export function logApiResponse(operation: string, data: LogData): void {
  console.group(`%c [Client API] Response: ${operation}`, 'color: #49cc90; font-weight: bold;');
  console.log('Data:', data);
  console.groupEnd();
}

/**
 * Логування помилки API
 * @param operation Назва операції API
 * @param error Об'єкт помилки
 */
export function logApiError(operation: string, error: unknown): void {
  console.group(`%c [Client API] Error: ${operation}`, 'color: #f93e3e; font-weight: bold;');
  if (error && typeof error === 'object' && 'response' in error) {
    // @ts-ignore - ігноруємо проблеми з типами для об'єкта помилки
    console.log('Status:', error.response?.status);
    // @ts-ignore
    console.log('Data:', error.response?.data);
  } else if (error instanceof Error) {
    console.log('Error:', error.message);
  } else {
    console.log('Error:', error);
  }
  console.groupEnd();
}
