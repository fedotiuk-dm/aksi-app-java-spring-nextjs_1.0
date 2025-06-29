'use client';

import { useEffect, useState } from 'react';
import { Toaster, ToasterProps } from 'react-hot-toast';

export function ClientOnlyToaster(props: ToasterProps) {
  // Відкладений рендеринг для запобігання помилок гідратації
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Рендеримо компонент тільки на клієнті
  if (!isMounted) {
    return null;
  }

  return <Toaster {...props} />;
}
