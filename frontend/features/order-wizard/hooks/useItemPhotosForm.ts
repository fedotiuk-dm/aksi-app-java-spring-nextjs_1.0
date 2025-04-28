import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UUID } from 'node:crypto';
import { useOrderWizardStore, useOrderWizardNavigation } from '../model/store/store';
import { useOrderWizard } from '../model/OrderWizardContext';
import { WizardStep, ItemWizardSubStep, ItemManagerSubStep, ItemPhoto } from '../model/types/types';
import { itemPhotosFormSchema, ItemPhotosFormValues } from '../model/schema/item-photos.schema';

/**
 * Хук для форми завантаження фотографій (підетап 2.5)
 */
export function useItemPhotosForm() {
  const { navigateToStep } = useOrderWizardNavigation();
  const { currentItem, updateItem, setDirty } = useOrderWizardStore();
  const { orderItemPhotosApi } = useOrderWizard();
  
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Форма з валідацією
  const {
    handleSubmit,
    formState: { isValid },
    setValue,
  } = useForm<ItemPhotosFormValues>({
    resolver: zodResolver(itemPhotosFormSchema),
    defaultValues: {
      photos: [],
    },
    mode: 'onChange',
  });
  
  // Ініціалізація форми при зміні поточного предмета
  useEffect(() => {
    if (currentItem?.photos) {
      // Якщо у предмета вже є фотографії, завантажуємо їх у форму
      // У цій спрощеній версії ми не можемо відновити оригінальні File об'єкти,
      // тому просто показуємо наявні фото як превью
      const photoUrls = currentItem.photos.map(photo => photo.url);
      setPreviews(photoUrls);
    }
  }, [currentItem]);
  
  /**
   * Функція для створення превью фотографії
   */
  const createPreview = useCallback((file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }, []);
  
  /**
   * Обробник завантаження фотографій з галереї
   */
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;
    
    // Перевірка на кількість файлів
    if (files.length + fileList.length > 5) {
      setError('Максимальна кількість фото - 5');
      return;
    }
    
    // Додаємо нові файли та створюємо превью
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      // Перевірка розміру файлу (до 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(`Файл ${file.name} перевищує максимальний розмір 5MB`);
        continue;
      }
      
      newFiles.push(file);
      const preview = await createPreview(file);
      newPreviews.push(preview);
    }
    
    setFiles(prev => [...prev, ...newFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
    setValue('photos', [...files, ...newFiles].map(file => ({ file })));
    
    // Очищаємо інпут для можливості повторного завантаження того ж файлу
    event.target.value = '';
    setError(null);
  }, [files, setValue, createPreview]);
  
  /**
   * Обробник зйомки з камери
   * Використовує WebRTC для доступу до камери пристрою
   */
  const handleCameraCapture = useCallback(async () => {
    try {
      // Перевірка на кількість файлів
      if (files.length >= 5) {
        setError('Максимальна кількість фото - 5');
        return;
      }
      
      // Запит на доступ до камери
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Створюємо елементи для зйомки
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // Затримка для підготовки відео
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Створюємо canvas для зйомки кадру
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Отримуємо контекст та малюємо кадр
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      
      // Зупиняємо всі відеотреки
      stream.getTracks().forEach(track => track.stop());
      
      // Конвертуємо у Blob та створюємо File
      const blob = await new Promise<Blob>(resolve => {
        canvas.toBlob(newBlob => {
          if (newBlob) {
            resolve(newBlob);
          }
        }, 'image/jpeg', 0.9);
      });
      
      // Створюємо File об'єкт
      const timestamp = new Date().toISOString();
      const file = new File([blob], `camera_${timestamp}.jpg`, { type: 'image/jpeg' });
      
      // Додаємо файл та превью
      const preview = await createPreview(file);
      setFiles(prev => [...prev, file]);
      setPreviews(prev => [...prev, preview]);
      setValue('photos', [...files, file].map(f => ({ file: f })));
      
    } catch (error) {
      console.error('Помилка при доступі до камери:', error);
      setError('Не вдалося отримати доступ до камери');
    }
  }, [files, setValue, createPreview]);
  
  /**
   * Видалення фотографії
   */
  const handleRemovePhoto = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setValue('photos', files.filter((_, i) => i !== index).map(file => ({ file })));
  }, [files, setValue]);
  
  /**
   * Стиснення зображення перед відправкою
   */
  const compressImage = useCallback(async (file: File): Promise<File> => {
    // У реальній реалізації тут має бути логіка стиснення зображення
    // Наприклад, з використанням browser-image-compression
    // У спрощеній версії повертаємо оригінальний файл
    return file;
  }, []);
  
  /**
   * Відправка фотографій на сервер
   */
  const uploadPhotos = useCallback(async (): Promise<ItemPhoto[]> => {
    if (!currentItem?.id || files.length === 0) {
      return [];
    }
    
    // Отримуємо функцію завантаження фото
    const uploadMutation = orderItemPhotosApi.useUploadPhoto();
    
    const uploadedPhotos: ItemPhoto[] = [];
    setIsLoading(true);
    setUploadProgress(0);
    
    try {
      // Завантажуємо фотографії послідовно
      for (let i = 0; i < files.length; i++) {
        const file = await compressImage(files[i]);
        
        const response = await uploadMutation.mutateAsync({
          itemId: String(currentItem.id),
          file,
        });
        
        // Перетворюємо відповідь API у об'єкт ItemPhoto
        const photo: ItemPhoto = {
          id: String(response.id) as UUID,
          url: response.fileUrl || '',
          thumbnailUrl: response.thumbnailUrl || '',
          filename: file.name,
          size: file.size,
          createdAt: response.createdAt || new Date().toISOString(),
        };
        
        uploadedPhotos.push(photo);
        
        // Оновлюємо прогрес
        setUploadProgress(Math.round((i + 1) / files.length * 100));
      }
      
      return uploadedPhotos;
    } catch (error) {
      console.error('Помилка при завантаженні фотографій:', error);
      setError('Не вдалося завантажити фотографії');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentItem, files, orderItemPhotosApi, compressImage]);
  
  /**
   * Обробник збереження та переходу до наступного кроку
   */
  const onSubmit = handleSubmit(async () => {
    try {
      setError(null);
      setDirty(true);
      
      if (files.length > 0) {
        // Завантажуємо фотографії
        const uploadedPhotos = await uploadPhotos();
        
        // Оновлюємо предмет
        if (currentItem && uploadedPhotos.length > 0) {
          const currentPhotos = currentItem.photos || [];
          const updatedItem = {
            ...currentItem,
            photos: [...currentPhotos, ...uploadedPhotos],
          };
          
          // Перетворюємо id в number через Number()
          const itemId = typeof currentItem.id === 'string' ? Number(currentItem.id) : currentItem.id;
          updateItem(itemId as number, updatedItem);
        }
      }
      
      // Після завершення всіх підетапів повертаємося до головного екрану менеджера предметів
      // Це завершує цикл додавання предмета і дозволяє додати ще один предмет або перейти далі
      navigateToStep(WizardStep.ITEM_MANAGER, ItemManagerSubStep.ITEM_LIST);
    } catch (error) {
      console.error('Помилка при збереженні фотографій:', error);
      setError('Не вдалося зберегти фотографії');
    }
  });
  
  /**
   * Обробник повернення на попередній підетап
   */
  const handleBack = useCallback(() => {
    navigateToStep(WizardStep.ITEM_WIZARD, ItemWizardSubStep.PRICE_CALCULATOR);
  }, [navigateToStep]);
  
  return {
    previews,
    files,
    isLoading,
    uploadProgress,
    error,
    isValid,
    handleFileUpload,
    handleCameraCapture,
    handleRemovePhoto,
    onSubmit,
    handleBack,
  };
}
