/**
 * @fileoverview Hook for creating new users
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useCreateUser, createUserBody } from '@/shared/api/generated/user';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

// Use generated schema
type CreateUserFormData = z.infer<typeof createUserBody>;

export const useCreateUserForm = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const createUserMutation = useCreateUser({
    mutation: {
      onSuccess: () => {
        toast.success('Користувача створено успішно');
        queryClient.invalidateQueries({ queryKey: ['/api/users'] });
        handleClose();
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || 'Помилка створення користувача';
        toast.error(message);
      },
    },
  });

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserBody),
    defaultValues: {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      roles: ['OPERATOR'],
      primaryBranchId: undefined,
    },
  });

  const handleOpen = () => setIsOpen(true);
  
  const handleClose = () => {
    setIsOpen(false);
    form.reset();
  };

  const onSubmit = async (data: CreateUserFormData) => {
    await createUserMutation.mutateAsync({ data });
  };

  return {
    // Form
    form,
    onSubmit,
    
    // Dialog state
    isOpen,
    handleOpen,
    handleClose,
    
    // Loading
    isLoading: createUserMutation.isPending,
  };
};