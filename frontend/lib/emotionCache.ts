'use client';

import createCache from '@emotion/cache';

// Створення клієнтського кешу Emotion
export default function createEmotionCache() {
  return createCache({
    key: 'mui',
    prepend: true,
  });
}

// Створюємо глобальний екземпляр для використання на клієнті
export const clientSideEmotionCache = createEmotionCache();
