import { useEffect, useState } from 'react';

/**
 * Хук для безпечної гідратації MUI компонентів
 * Особливо корисний для компонентів, які можуть бути змінені браузерними розширеннями
 * Приховує компоненти до завершення гідратації для уникнення помилок невідповідності
 */
export const useSafeMUIHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Невелика затримка дозволяє браузерним розширенням завершити свою роботу
    const timeout = setTimeout(() => {
      setIsHydrated(true);
    }, 10);

    return () => clearTimeout(timeout);
  }, []);

  return {
    isHydrated,
    // Для компонентів, які потребують suppressHydrationWarning
    muiProps: {
      suppressHydrationWarning: true,
      style: isHydrated ? undefined : { opacity: 0 },
    },
  };
};
