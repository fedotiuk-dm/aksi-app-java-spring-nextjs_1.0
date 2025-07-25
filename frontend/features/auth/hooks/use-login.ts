/**
 * @fileoverview Хук для форми логіну
 */

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/auth-store';
import { authService } from '../api/auth-service';

// Схема валідації форми
const loginSchema = z.object({
  username: z.string().min(3, 'Мінімум 3 символи').max(50, 'Максимум 50 символів'),
  password: z.string().min(6, 'Мінімум 6 символів'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const response = await authService.login(data);
      
      if (response.success) {
        if (response.user) {
          setUser(response.user);
          toast.success(`Вітаємо, ${response.user.firstName}!`);
        } else {
          // Якщо немає даних користувача, просто показуємо загальне повідомлення
          toast.success('Вхід успішний!');
        }
        
        // Перенаправляємо на dashboard або збережену сторінку
        const params = new URLSearchParams(window.location.search);
        const callbackUrl = params.get('callbackUrl') || '/dashboard';
        
        // Використовуємо window.location для надійного редіректу
        window.location.href = callbackUrl;
      } else {
        toast.error(response.message || 'Невірний логін або пароль');
        form.setError('root', {
          message: response.message || 'Невірний логін або пароль',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Помилка при вході в систему');
      form.setError('root', {
        message: 'Помилка з\'єднання з сервером',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    isLoading,
  };
};