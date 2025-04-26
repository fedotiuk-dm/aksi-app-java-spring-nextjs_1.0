'use client';

import * as React from 'react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';

// Цей компонент використовує нову стратегію стабільної гідрації для MUI з Next.js 15
export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const options = { key: 'mui', prepend: true };

  const [{ cache, flush }] = React.useState(() => {
    // Створюємо новий кеш для відслідковування серверних стилів
    const cache = createCache(options);
    cache.compat = true;
    
    // Функція для збору вставлених стилів
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

  // Вставляємо серверні стилі в HTML
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
    
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  // Рендеримо провайдери з кешем
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
