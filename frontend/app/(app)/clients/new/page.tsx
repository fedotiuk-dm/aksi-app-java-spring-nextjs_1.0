import React from 'react';
import ClientForm from '@/features/clients/components/ClientForm';

export const metadata = {
  title: 'Новий клієнт | AKSI Хімчистка',
  description: 'Створення нового клієнта у системі AKSI',
};

export default function NewClientPage() {
  return <ClientForm />;
}
