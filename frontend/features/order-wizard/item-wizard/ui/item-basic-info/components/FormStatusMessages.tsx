'use client';

import { Alert } from '@mui/material';
import React from 'react';

interface FormStatusMessagesProps {
  hasCategory: boolean;
  hasProducts: boolean;
  isFormValid: boolean;
}

/**
 * Компонент для відображення статусних повідомлень форми
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення повідомлень
 * - Отримує стан через пропси
 * - Не містить бізнес-логіки валідації
 */
export const FormStatusMessages: React.FC<FormStatusMessagesProps> = ({
  hasCategory,
  hasProducts,
  isFormValid,
}) => {
  return (
    <>
      {/* Інформаційне повідомлення про вибір категорії */}
      {!hasCategory && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Оберіть категорію послуги для продовження. Список доступних виробів оновиться автоматично.
        </Alert>
      )}

      {/* Попередження про відсутність продуктів */}
      {hasCategory && !hasProducts && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          Для обраної категорії поки що немає доступних виробів у прайс-листі.
        </Alert>
      )}

      {/* Успішне заповнення форми */}
      {isFormValid && (
        <Alert severity="success" sx={{ mt: 3 }}>
          Основну інформацію заповнено. Можете переходити до наступного кроку.
        </Alert>
      )}
    </>
  );
};

export default FormStatusMessages;
