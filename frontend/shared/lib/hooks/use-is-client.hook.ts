import { useEffect, useState } from 'react';

/**
 * Хук для виявлення клієнтського рендерингу
 * Допомагає уникнути проблем з гідратацією, спричинених браузерними розширеннями
 */
export const useIsClient = (): boolean => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};
