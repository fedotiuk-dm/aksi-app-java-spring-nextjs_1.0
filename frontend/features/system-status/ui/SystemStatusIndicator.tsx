'use client';

import { CheckCircle, Warning, Error } from '@mui/icons-material';
import { Chip, Tooltip, Stack, CircularProgress } from '@mui/material';

import useHealthCheck from '../hooks/useHealthCheck';

interface SystemStatusIndicatorProps {
  /**
   * Чи показувати детальну інформацію при наведенні
   */
  showDetails?: boolean;
  /**
   * Інтервал оновлення в мілісекундах
   */
  refreshInterval?: number;
}

/**
 * Компонент для відображення статусу з'єднання з бекендом
 */
export function SystemStatusIndicator({
  showDetails = true,
  refreshInterval = 60000,
}: SystemStatusIndicatorProps) {
  // Отримуємо дані про стан системи
  const { data, isLoading, isError } = useHealthCheck({
    refetchInterval: refreshInterval,
  });

  // Визначаємо колір та іконку індикатора
  const getStatusInfo = () => {
    if (isLoading) {
      return {
        icon: <CircularProgress size={14} />,
        color: 'default' as const,
        label: 'Перевірка...',
      };
    }

    if (isError || !data || data.status === 'DOWN') {
      return {
        icon: <Error />,
        color: 'error' as const,
        label: 'Офлайн',
      };
    }

    // Перевіряємо стан бази даних, якщо доступний
    const dbStatus = data.database?.status;
    if (dbStatus === 'DOWN') {
      return {
        icon: <Warning />,
        color: 'warning' as const,
        label: "Часткове з'єднання",
      };
    }

    return {
      icon: <CheckCircle />,
      color: 'success' as const,
      label: 'Онлайн',
    };
  };

  const { icon, color, label } = getStatusInfo();

  // Форматуємо детальну інформацію для тултіпа
  const getTooltipContent = () => {
    if (!data) return 'Немає даних про стан системи';

    return (
      <Stack spacing={1} sx={{ p: 1, maxWidth: 300 }}>
        <div>Статус: {data.status}</div>
        <div>Сервіс: {data.service}</div>
        {data.version && <div>Версія: {data.version}</div>}

        {data.database && (
          <div>
            База даних: {data.database.status === 'UP' ? 'Активна' : 'Недоступна'}
            {data.database.type && ` (${data.database.type})`}
          </div>
        )}

        {data.memory && (
          <div>
            Пам&apos;ять: {data.memory.free} вільно з {data.memory.total}
          </div>
        )}

        {data.git && (
          <div>
            Git: {data.git.branch} ({data.git.commit})
          </div>
        )}

        <div>Оновлено: {new Date(data.timestamp).toLocaleTimeString()}</div>
      </Stack>
    );
  };

  return (
    <Tooltip title={showDetails ? getTooltipContent() : ''} arrow>
      <Chip
        icon={icon}
        label={label}
        color={color}
        size="small"
        variant="outlined"
        sx={{
          height: 24,
          '& .MuiChip-icon': { fontSize: 16 },
          '& .MuiChip-label': { px: 1, fontSize: '0.75rem' },
        }}
      />
    </Tooltip>
  );
}

export default SystemStatusIndicator;
