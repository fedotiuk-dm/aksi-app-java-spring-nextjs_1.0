'use client';

// Імпортуємо компонент з центрального місця в lib
import { ThemeRegistry as LibThemeRegistry } from '@/lib/theme-registry';

// Цей компонент є просто обгорткою навколо нашого основного ThemeRegistry з lib
// Це дозволяє уникнути дублювання коду та забезпечує єдиний підхід до стилізації
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return <LibThemeRegistry>{children}</LibThemeRegistry>;
}

