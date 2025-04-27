import { useState, useEffect, useMemo } from 'react';
import { z } from 'zod';
import { 
  Client, 
  CommunicationChannel, 
  ClientSource 
} from '../model/types';
import { clientSchema } from '../model/schema';

// Типи помилок форми
type FormErrors = Record<string, string>;

// Інтерфейс результату хука
interface UseClientFormResult {
  client: Omit<Client, 'id'>;
  errors: FormErrors;
  isSubmitting: boolean;
  showOtherDetails: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChannelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSourceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validateAndSubmit: (onSubmit: (data: Omit<Client, 'id'>) => Promise<void>) => (e: React.FormEvent) => Promise<void>;
}

/**
 * Хук для управління формою клієнта з інтеграцією Zod
 */
export const useClientForm = (initialClient?: Partial<Client>): UseClientFormResult => {
  // Дефолтні значення для нового клієнта - використовуємо useMemo для оптимізації
  const defaultClient = useMemo<Omit<Client, 'id'>>(() => ({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      additionalInfo: '',
    },
    communicationChannels: ['PHONE'], // За замовчуванням телефон
    source: {
      source: 'RECOMMENDATION', // За замовчуванням рекомендації
      details: '',
    },
  }), []);

  // Стан форми
  const [client, setClient] = useState<Omit<Client, 'id'>>(
    initialClient ? { ...defaultClient, ...initialClient } : defaultClient
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtherDetails, setShowOtherDetails] = useState(
    client.source?.source === 'OTHER'
  );

  // Оновлюємо стан при зміні початкового клієнта
  useEffect(() => {
    if (initialClient) {
      setClient({ ...defaultClient, ...initialClient });
      setShowOtherDetails(initialClient.source?.source === 'OTHER');
    }
  }, [initialClient, defaultClient]);

  // Обробка зміни полів форми
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Обробка вкладених полів
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setClient((prev) => {
        const parentObj = prev[parent as keyof typeof prev] || {};
        return {
          ...prev,
          [parent]: {
            ...(parentObj as object),
            [child]: value
          }
        };
      });
    } else {
      setClient((prev) => ({ ...prev, [name]: value }));
    }
    
    // Видаляємо помилку для поля
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Обробка зміни каналів комунікації
  const handleChannelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const channel = value as CommunicationChannel;
    
    setClient((prev) => {
      const currentChannels = [...prev.communicationChannels];
      
      if (checked && !currentChannels.includes(channel)) {
        return {
          ...prev,
          communicationChannels: [...currentChannels, channel],
        };
      } else if (!checked && currentChannels.includes(channel)) {
        return {
          ...prev,
          communicationChannels: currentChannels.filter((c) => c !== channel),
        };
      }
      
      return prev;
    });
  };
  
  // Обробка зміни джерела
  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const source = e.target.value as ClientSource;
    setShowOtherDetails(source === 'OTHER');
    
    setClient((prev) => {
      // Створюємо об'єкт source безпечно без оператора !
      const currentSource = prev.source || { source: 'RECOMMENDATION', details: '' };
      
      return {
        ...prev,
        source: {
          ...currentSource,
          source,
          details: source !== 'OTHER' ? '' : currentSource.details || '',
        },
      };
    });
  };
  
  // Валідація з Zod
  const validate = (): boolean => {
    try {
      clientSchema.parse(client);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: FormErrors = {};
        
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          formattedErrors[path] = err.message;
        });
        
        setErrors(formattedErrors);
      }
      return false;
    }
  };
  
  // Функція відправки форми з валідацією
  const validateAndSubmit = (onSubmit: (data: Omit<Client, 'id'>) => Promise<void>) => {
    return async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validate()) {
        return;
      }
      
      setIsSubmitting(true);
      try {
        await onSubmit(client);
      } finally {
        setIsSubmitting(false);
      }
    };
  };
  
  return {
    client,
    errors,
    isSubmitting,
    showOtherDetails,
    handleChange,
    handleChannelChange,
    handleSourceChange,
    validateAndSubmit
  };
};
