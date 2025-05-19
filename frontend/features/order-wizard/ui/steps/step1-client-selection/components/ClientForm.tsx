'use client';

// Внутрішні залежності
import { Client } from '@/shared/types/client.types';

import { ClientForm as BaseClientForm } from '@/features/order-wizard/entities/clients/components/ClientForm';

interface ClientFormProps {
  initialClient?: Partial<Client>;
  onSave: (client: Omit<Client, 'id'>) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
  className?: string;
}

export const ClientForm: React.FC<ClientFormProps> = (props) => {
  return <BaseClientForm {...props} />;
};

export default ClientForm;
