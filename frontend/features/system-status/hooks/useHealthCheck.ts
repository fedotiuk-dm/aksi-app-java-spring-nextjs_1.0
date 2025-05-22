import { useQuery } from '@tanstack/react-query';

import { HealthCheckControllerService } from '@/lib/api';

/**
 * Типи для здоров'я системи
 */
export interface SystemHealthResponse {
  status: 'UP' | 'DOWN' | 'UNKNOWN';
  timestamp: string;
  service: string;
  version?: string;
  database?: {
    status: 'UP' | 'DOWN';
    type: string;
    error?: string;
  };
  memory?: {
    total: string;
    free: string;
    max: string;
    processors: number;
  };
  build?: {
    time: string;
    artifact: string;
    name: string;
    group: string;
  };
  git?: {
    branch: string;
    commit: string;
    time: string;
  };
}

interface UseHealthCheckOptions {
  /**
   * Інтервал оновлення в мілісекундах (за замовчуванням 60000 мс = 1 хвилина)
   */
  refetchInterval?: number;
  /**
   * Автоматично оновлювати дані
   */
  enabled?: boolean;
  /**
   * Кількість спроб при помилці
   */
  retry?: number | boolean;
}

/**
 * Хук для отримання детальної інформації про стан бекенду
 * @param options Параметри запиту
 */
export function useHealthCheck(options: UseHealthCheckOptions = {}) {
  const {
    refetchInterval = 60000, // 1 хвилина
    enabled = true,
    retry = 1,
  } = options;

  return useQuery<SystemHealthResponse, Error>({
    queryKey: ['system-health'],
    queryFn: async () => {
      try {
        // Виконуємо запит до ендпоінту /api/health
        const response = await HealthCheckControllerService.healthCheck();

        return response as SystemHealthResponse;
      } catch (error) {
        console.error('Health check failed:', error);

        // У випадку помилки повертаємо базову інформацію про стан
        return {
          status: 'DOWN',
          timestamp: new Date().toISOString(),
          service: 'AKSI API',
          error: error instanceof Error ? error.message : 'Unknown error',
        } as SystemHealthResponse;
      }
    },
    refetchInterval,
    enabled,
    retry,
    // Вважаємо дані актуальними протягом 30 секунд
    staleTime: 30000,
  });
}

export default useHealthCheck;
