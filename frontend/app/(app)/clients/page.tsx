import { Metadata } from 'next';
import ClientsPageContent from '@/features/clients/components/ClientsPageContent';

export const metadata: Metadata = {
  title: 'Клієнти | Хімчистка AKSI',
  description: 'Управління клієнтами сервісу хімчистки',
};

export default function ClientsPage() {
  return <ClientsPageContent />;
}
