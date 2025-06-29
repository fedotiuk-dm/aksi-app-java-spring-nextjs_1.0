'use client';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { useServerInsertedHTML } from 'next/navigation';
import * as React from 'react';

import { theme } from './theme';

/**
 * Компонент реєстрації теми MUI для Next.js App Router
 *
 * Цей компонент вирішує проблему гідратації стилів MUI при використанні
 * Next.js App Router та серверних компонентів. Він відслідковує вставлені
 * стилі на сервері та передає їх клієнту, щоб уникнути мерехтіння при гідратації.
 *
 * @see https://mui.com/material-ui/guides/next-js-app-router/
 */
export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  // Налаштування кешу Emotion для MUI
  const options = { key: 'mui', prepend: true };

  const [{ cache, flush }] = React.useState(() => {
    // Створюємо новий кеш для відслідковування серверних стилів
    const cache = createCache(options);
    // Вмикаємо режим сумісності для роботи з різними версіями Emotion
    cache.compat = true;

    // Перевизначаємо метод insert для відстеження вставлених стилів
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };

    // Функція для отримання та очищення зібраних стилів
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };

    return { cache, flush };
  });

  // Використовуємо хук Next.js для вставки стилів у HTML на сервері
  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }

    // Отримуємо всі стилі для вставлених класів
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }

    // Вставляємо стилі з правильними атрибутами для Emotion
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  // Рендеримо провайдери з кешем та темою
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
