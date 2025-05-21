import { useState, useEffect, useMemo } from 'react';
import { z } from 'zod';

import { Client } from '@/shared/types/client.types';

type FormErrors = Record<string, string>;

const clientSchema = z.object({
  firstName: z.string().min(1, "Ім'я обов'язкове"),
  lastName: z.string().min(1, "Прізвище обов'язкове"),
  phone: z.string().min(10, 'Номер телефону повинен містити мінімум 10 цифр'),
  email: z.string().email('Невірний формат email').optional().or(z.literal('')),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      postalCode: z.string().optional(),
      additionalInfo: z.string().optional(),
    })
    .optional(),
  communicationChannels: z.array(z.enum(['PHONE', 'SMS', 'EMAIL', 'TELEGRAM'])),
  source: z.object({
    source: z.enum(['RECOMMENDATION', 'WEBSITE', 'SOCIAL_MEDIA', 'OTHER']),
    details: z.string().optional(),
  }),
});

export const useClientForm = (initialData?: Partial<Client>) => {
  const [formData, setFormData] = useState<Partial<Client>>(initialData || {});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  type ClientSchemaKeys = keyof typeof clientSchema.shape;

  const validateField = (field: ClientSchemaKeys, value: unknown) => {
    try {
      const fieldSchema = clientSchema.shape[field];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors((prev) => ({ ...prev, [field]: '' }));
        return true;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.errors[0].message }));
      }
      return false;
    }
    return true;
  };

  const handleChange = (field: keyof Client, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);

    // Перевіряємо, чи поле є в схемі валідації перед викликом validateField
    if (field in clientSchema.shape) {
      validateField(field as ClientSchemaKeys, value);
    }
  };

  const validateForm = () => {
    try {
      clientSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const resetForm = () => {
    setFormData(initialData || {});
    setErrors({});
    setIsDirty(false);
  };

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0 && isDirty;
  }, [errors, isDirty]);

  return {
    formData,
    errors,
    isDirty,
    isValid,
    handleChange,
    validateForm,
    resetForm,
  };
};
