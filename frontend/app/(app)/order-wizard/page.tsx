'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderWizardRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/dashboard/order-wizard');
  }, [router]);
  
  return null;
}