'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { stage1UpdateClientDataBody, stage1SearchClientsBody } from '@/shared/api/generated/stage1';
import { useOrderWizardStore } from './useOrderWizardStore';

// Спрощена схема для UI з базовими полями
const wizardFormSchema = z.object({
  // Дані клієнта (спрощені для UI)
  clientData: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    communicationChannels: z.array(z.enum(['PHONE', 'SMS', 'VIBER'])).optional(),
    informationSource: z.enum(['INSTAGRAM', 'GOOGLE', 'RECOMMENDATION', 'OTHER']).optional(),
    sourceDetails: z.string().optional(),
    searchTerm: z.string().optional(),
    selectedClientId: z.string().optional(),
  }),

  // Дані замовлення (спрощені для UI)
  orderData: z.object({
    receiptNumber: z.string().optional(),
    uniqueTag: z.string().optional(),
    selectedBranchId: z.string().optional(),
  }),

  // Пошук клієнтів (спрощені для UI)
  searchData: z.object({
    generalSearchTerm: z.string().optional(),
    lastName: z.string().optional(),
    firstName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
  }),
});

export type WizardFormData = z.infer<typeof wizardFormSchema>;

// Значення за замовчуванням
const defaultValues: WizardFormData = {
  clientData: {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    communicationChannels: ['PHONE'],
    informationSource: 'INSTAGRAM',
    sourceDetails: '',
    searchTerm: '',
    selectedClientId: '',
  },
  orderData: {
    receiptNumber: '',
    uniqueTag: '',
    selectedBranchId: '',
  },
  searchData: {
    generalSearchTerm: '',
    lastName: '',
    firstName: '',
    phone: '',
    email: '',
    address: '',
  },
};

// Контекст для доступу до форми
interface WizardContextType {
  form: ReturnType<typeof useForm<WizardFormData>>;
  isFormValid: boolean;
  isDirty: boolean;
}

const WizardContext = createContext<WizardContextType | null>(null);

// Хук для використання контексту
export const useWizardForm = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizardForm must be used within WizardProvider');
  }
  return context;
};

// Provider компонент
interface WizardProviderProps {
  children: React.ReactNode;
}

export const WizardProvider: React.FC<WizardProviderProps> = ({ children }) => {
  const { setDirty } = useOrderWizardStore();

  // Ініціалізація React Hook Form з Orval схемами
  const form = useForm<WizardFormData>({
    resolver: zodResolver(wizardFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    formState: { isValid, isDirty },
  } = form;

  // Синхронізація isDirty з Zustand
  useEffect(() => {
    setDirty(isDirty);
  }, [isDirty, setDirty]);

  const contextValue: WizardContextType = {
    form,
    isFormValid: isValid,
    isDirty,
  };

  return (
    <WizardContext.Provider value={contextValue}>
      <FormProvider {...form}>{children}</FormProvider>
    </WizardContext.Provider>
  );
};

// Експорт схем для використання в компонентах
export { stage1UpdateClientDataBody, stage1SearchClientsBody };
