import { Metadata } from 'next';
import ClientDetailPageContent from '@/features/clients/components/ClientDetailPageContent';

export const metadata: Metadata = {
  title: 'Деталі клієнта | Хімчистка AKSI',
  description: 'Перегляд та редагування даних клієнта',
};

export default function ClientDetailsPage({
  params,
}: {
  params: { clientId: string };
}) {
  return <ClientDetailPageContent clientId={params.clientId} />;
}
