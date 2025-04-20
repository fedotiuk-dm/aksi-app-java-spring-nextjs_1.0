import { ClientsList } from '@/features/clients/components/ClientsList';
import { Suspense } from 'react';

export default function ClientsPage() {
  return (
    <Suspense fallback={<div>Завантаження...</div>}>
      <ClientsList />
    </Suspense>
  );
}
