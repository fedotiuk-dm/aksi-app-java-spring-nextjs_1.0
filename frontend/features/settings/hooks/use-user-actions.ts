/**
 * @fileoverview Hook for user management actions
 */

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  useActivateUser,
  useDeactivateUser,
  useChangePassword,
  useUpdateUserRoles,
  useUpdateUser,
} from '@/shared/api/generated/user';
import { useQueryClient } from '@tanstack/react-query';

export const useUserActions = () => {
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [dialogState, setDialogState] = useState({
    edit: false,
    changePassword: false,
    changeRoles: false,
  });

  // Mutations
  const activateMutation = useActivateUser({
    mutation: {
      onSuccess: () => {
        toast.success('Користувача активовано');
        queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      },
      onError: () => {
        toast.error('Помилка активації користувача');
      },
    },
  });

  const deactivateMutation = useDeactivateUser({
    mutation: {
      onSuccess: () => {
        toast.success('Користувача деактивовано');
        queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      },
      onError: () => {
        toast.error('Помилка деактивації користувача');
      },
    },
  });

  const changePasswordMutation = useChangePassword({
    mutation: {
      onSuccess: () => {
        toast.success('Пароль успішно змінено');
        closeDialog('changePassword');
      },
      onError: () => {
        toast.error('Помилка зміни паролю');
      },
    },
  });

  const updateRolesMutation = useUpdateUserRoles({
    mutation: {
      onSuccess: () => {
        toast.success('Ролі користувача оновлено');
        queryClient.invalidateQueries({ queryKey: ['/api/users'] });
        closeDialog('changeRoles');
      },
      onError: () => {
        toast.error('Помилка оновлення ролей');
      },
    },
  });

  const updateUserMutation = useUpdateUser({
    mutation: {
      onSuccess: () => {
        toast.success('Дані користувача оновлено');
        queryClient.invalidateQueries({ queryKey: ['/api/users'] });
        closeDialog('edit');
      },
      onError: () => {
        toast.error('Помилка оновлення даних');
      },
    },
  });

  // Dialog management
  const openDialog = (type: 'edit' | 'changePassword' | 'changeRoles', userId: string) => {
    setSelectedUserId(userId);
    setDialogState(prev => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type: 'edit' | 'changePassword' | 'changeRoles') => {
    setDialogState(prev => ({ ...prev, [type]: false }));
    setSelectedUserId(null);
  };

  // Actions
  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    if (isActive) {
      await deactivateMutation.mutateAsync({ userId });
    } else {
      await activateMutation.mutateAsync({ userId });
    }
  };

  return {
    // State
    selectedUserId,
    dialogState,
    
    // Mutations
    activateMutation,
    deactivateMutation,
    changePasswordMutation,
    updateRolesMutation,
    updateUserMutation,
    
    // Actions
    openDialog,
    closeDialog,
    toggleUserStatus,
    
    // Loading states
    isToggling: activateMutation.isPending || deactivateMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    isUpdatingRoles: updateRolesMutation.isPending,
  };
};