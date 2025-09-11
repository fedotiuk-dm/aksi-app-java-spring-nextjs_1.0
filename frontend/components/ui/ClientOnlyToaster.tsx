'use client';

import { useEffect, useState } from 'react';
import { Toaster, ToasterProps } from 'react-hot-toast';

export function ClientOnlyToaster(props: ToasterProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <Toaster {...props} />;
}
