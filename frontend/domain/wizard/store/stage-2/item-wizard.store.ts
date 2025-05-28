/**
 * @fileoverview Item Wizard Slice Store - Zustand store для підвізарда предметів
 * @module domain/wizard/store/stage-2
 * @author AKSI Team
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { OrderItemData } from '../../types';

/**
 * Типи етапів підвізарда предметів
 */
export enum ItemWizardStep {
  BASIC_INFO = 'basic_info', // Підетап 2.1: Основна інформація
  CHARACTERISTICS = 'characteristics', // Підетап 2.2: Характеристики
  DEFECTS_STAINS = 'defects_stains', // Підетап 2.3: Забруднення та дефекти
  PRICE_MODIFIERS = 'price_modifiers', // Підетап 2.4: Знижки та надбавки
  PHOTOS = 'photos', // Підетап 2.5: Фотодокументація
}

/**
 * Інтерфейс даних фотографії
 */
interface ItemPhoto {
  id: string;
  file: File | null;
  url: string | null;
  thumbnailUrl: string | null;
  description: string;
  uploadProgress: number;
  isUploading: boolean;
  uploadError: string | null;
}

/**
 * Стан підвізарда предметів
 */
interface ItemWizardState {
  // Wizard navigation
  currentStep: ItemWizardStep;
  completedSteps: ItemWizardStep[];
  isWizardActive: boolean;

  // Item data stages
  basicInfo: Partial<OrderItemData>;
  characteristics: Partial<OrderItemData>;
  defectsAndStains: Partial<OrderItemData>;
  priceModifiers: Partial<OrderItemData>;
  photos: ItemPhoto[];

  // Step validation
  stepValidationErrors: Record<ItemWizardStep, string[]>;
  stepValidationStatus: Record<ItemWizardStep, boolean>;

  // Navigation locks
  stepLocks: Record<ItemWizardStep, boolean>;
  canProceedToNext: boolean;
  canGoToPrevious: boolean;

  // Auto-save
  isAutoSaving: boolean;
  lastSavedAt: Date | null;
  hasUnsavedChanges: boolean;

  // Photos management
  maxPhotosAllowed: number;
  photoUploadErrors: string[];
  isPhotosUploading: boolean;
}

/**
 * Дії підвізарда предметів
 */
interface ItemWizardActions {
  // Wizard navigation
  setCurrentStep: (step: ItemWizardStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: ItemWizardStep) => void;
  completeStep: (step: ItemWizardStep) => void;
  startWizard: () => void;
  exitWizard: (saveChanges?: boolean) => void;

  // Item data actions
  updateBasicInfo: (data: Partial<OrderItemData>) => void;
  updateCharacteristics: (data: Partial<OrderItemData>) => void;
  updateDefectsAndStains: (data: Partial<OrderItemData>) => void;
  updatePriceModifiers: (data: Partial<OrderItemData>) => void;

  // Step validation
  validateStep: (step: ItemWizardStep) => void;
  setStepValidationErrors: (step: ItemWizardStep, errors: string[]) => void;
  clearStepValidationErrors: (step: ItemWizardStep) => void;
  validateAllSteps: () => void;

  // Navigation control
  setStepLock: (step: ItemWizardStep, locked: boolean) => void;
  updateNavigationStatus: () => void;

  // Auto-save
  setAutoSaving: (saving: boolean) => void;
  markUnsavedChanges: () => void;
  markSaved: () => void;
  autoSave: () => Promise<void>;

  // Photos actions
  addPhoto: (file: File, description?: string) => void;
  removePhoto: (photoId: string) => void;
  updatePhotoDescription: (photoId: string, description: string) => void;
  uploadPhoto: (photoId: string) => Promise<void>;
  setPhotoUploadProgress: (photoId: string, progress: number) => void;
  setPhotoUploadError: (photoId: string, error: string | null) => void;

  // Utility actions
  consolidateItemData: () => OrderItemData;
  resetItemWizard: () => void;
}

/**
 * Початковий стан підвізарда предметів
 */
const initialItemWizardState: ItemWizardState = {
  currentStep: ItemWizardStep.BASIC_INFO,
  completedSteps: [],
  isWizardActive: false,
  basicInfo: {},
  characteristics: {},
  defectsAndStains: {},
  priceModifiers: {},
  photos: [],
  stepValidationErrors: {
    [ItemWizardStep.BASIC_INFO]: [],
    [ItemWizardStep.CHARACTERISTICS]: [],
    [ItemWizardStep.DEFECTS_STAINS]: [],
    [ItemWizardStep.PRICE_MODIFIERS]: [],
    [ItemWizardStep.PHOTOS]: [],
  },
  stepValidationStatus: {
    [ItemWizardStep.BASIC_INFO]: false,
    [ItemWizardStep.CHARACTERISTICS]: false,
    [ItemWizardStep.DEFECTS_STAINS]: false,
    [ItemWizardStep.PRICE_MODIFIERS]: false,
    [ItemWizardStep.PHOTOS]: false,
  },
  stepLocks: {
    [ItemWizardStep.BASIC_INFO]: false,
    [ItemWizardStep.CHARACTERISTICS]: true,
    [ItemWizardStep.DEFECTS_STAINS]: true,
    [ItemWizardStep.PRICE_MODIFIERS]: true,
    [ItemWizardStep.PHOTOS]: true,
  },
  canProceedToNext: false,
  canGoToPrevious: false,
  isAutoSaving: false,
  lastSavedAt: null,
  hasUnsavedChanges: false,
  maxPhotosAllowed: 5,
  photoUploadErrors: [],
  isPhotosUploading: false,
};

/**
 * Item Wizard Slice Store
 *
 * Відповідальність:
 * - Навігація по підетапах підвізарда предметів
 * - Збір даних по кожному підетапу
 * - Валідація кожного кроку
 * - Управління фотографіями предметів
 * - Автозбереження прогресу
 * - Блокування навігації до незавершених кроків
 *
 * Інтеграція:
 * - Orval типи для OrderItemData
 * - API для завантаження фотографій
 * - Сервіси валідації та розрахунку цін
 * - Автозбереження в localStorage
 */
export const useItemWizardStore = create<ItemWizardState & ItemWizardActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialItemWizardState,

      // Wizard navigation
      setCurrentStep: (step) => {
        const state = get();
        if (!state.stepLocks[step]) {
          set({ currentStep: step }, false, 'itemWizard/setCurrentStep');
          get().updateNavigationStatus();
        }
      },

      goToNextStep: () => {
        const state = get();
        const steps = Object.values(ItemWizardStep);
        const currentIndex = steps.indexOf(state.currentStep);

        if (currentIndex < steps.length - 1 && state.canProceedToNext) {
          const nextStep = steps[currentIndex + 1];
          get().setCurrentStep(nextStep);
        }
      },

      goToPreviousStep: () => {
        const state = get();
        const steps = Object.values(ItemWizardStep);
        const currentIndex = steps.indexOf(state.currentStep);

        if (currentIndex > 0 && state.canGoToPrevious) {
          const previousStep = steps[currentIndex - 1];
          get().setCurrentStep(previousStep);
        }
      },

      goToStep: (step) => {
        get().setCurrentStep(step);
      },

      completeStep: (step) => {
        set(
          (state) => ({
            completedSteps: state.completedSteps.includes(step)
              ? state.completedSteps
              : [...state.completedSteps, step],
          }),
          false,
          'itemWizard/completeStep'
        );

        // Розблоковуємо наступний крок
        const steps = Object.values(ItemWizardStep);
        const stepIndex = steps.indexOf(step);
        if (stepIndex < steps.length - 1) {
          const nextStep = steps[stepIndex + 1];
          get().setStepLock(nextStep, false);
        }

        get().updateNavigationStatus();
      },

      startWizard: () => {
        set(
          {
            isWizardActive: true,
            currentStep: ItemWizardStep.BASIC_INFO,
            hasUnsavedChanges: false,
          },
          false,
          'itemWizard/startWizard'
        );
        get().updateNavigationStatus();
      },

      exitWizard: (saveChanges = false) => {
        if (saveChanges) {
          get().autoSave();
        }

        set(
          {
            isWizardActive: false,
            hasUnsavedChanges: false,
          },
          false,
          'itemWizard/exitWizard'
        );
      },

      // Item data actions
      updateBasicInfo: (data) => {
        set(
          (state) => ({ basicInfo: { ...state.basicInfo, ...data } }),
          false,
          'itemWizard/updateBasicInfo'
        );
        get().markUnsavedChanges();
        get().validateStep(ItemWizardStep.BASIC_INFO);
      },

      updateCharacteristics: (data) => {
        set(
          (state) => ({ characteristics: { ...state.characteristics, ...data } }),
          false,
          'itemWizard/updateCharacteristics'
        );
        get().markUnsavedChanges();
        get().validateStep(ItemWizardStep.CHARACTERISTICS);
      },

      updateDefectsAndStains: (data) => {
        set(
          (state) => ({ defectsAndStains: { ...state.defectsAndStains, ...data } }),
          false,
          'itemWizard/updateDefectsAndStains'
        );
        get().markUnsavedChanges();
        get().validateStep(ItemWizardStep.DEFECTS_STAINS);
      },

      updatePriceModifiers: (data) => {
        set(
          (state) => ({ priceModifiers: { ...state.priceModifiers, ...data } }),
          false,
          'itemWizard/updatePriceModifiers'
        );
        get().markUnsavedChanges();
        get().validateStep(ItemWizardStep.PRICE_MODIFIERS);
      },

      // Step validation
      validateStep: (step) => {
        const state = get();
        const errors: string[] = [];

        switch (step) {
          case ItemWizardStep.BASIC_INFO:
            if (!state.basicInfo.name) errors.push("Найменування предмета обов'язкове");
            if (!state.basicInfo.quantity || state.basicInfo.quantity <= 0) {
              errors.push('Кількість повинна бути більше 0');
            }
            break;

          case ItemWizardStep.CHARACTERISTICS:
            if (!state.characteristics.material) errors.push("Матеріал обов'язковий");
            if (!state.characteristics.color) errors.push("Колір обов'язковий");
            break;

          case ItemWizardStep.DEFECTS_STAINS:
            // Тут можуть бути специфічні валідації для дефектів
            break;

          case ItemWizardStep.PRICE_MODIFIERS:
            // Валідація цінових модифікаторів
            break;

          case ItemWizardStep.PHOTOS:
            if (state.photos.length === 0) {
              errors.push('Додайте принаймні одну фотографію');
            }
            break;
        }

        get().setStepValidationErrors(step, errors);
        return errors.length === 0;
      },

      setStepValidationErrors: (step, errors) => {
        set(
          (state) => ({
            stepValidationErrors: {
              ...state.stepValidationErrors,
              [step]: errors,
            },
            stepValidationStatus: {
              ...state.stepValidationStatus,
              [step]: errors.length === 0,
            },
          }),
          false,
          'itemWizard/setStepValidationErrors'
        );
        get().updateNavigationStatus();
      },

      clearStepValidationErrors: (step) => {
        get().setStepValidationErrors(step, []);
      },

      validateAllSteps: () => {
        Object.values(ItemWizardStep).forEach((step) => {
          get().validateStep(step);
        });
      },

      // Navigation control
      setStepLock: (step, locked) => {
        set(
          (state) => ({
            stepLocks: {
              ...state.stepLocks,
              [step]: locked,
            },
          }),
          false,
          'itemWizard/setStepLock'
        );
      },

      updateNavigationStatus: () => {
        const state = get();
        const steps = Object.values(ItemWizardStep);
        const currentIndex = steps.indexOf(state.currentStep);

        const canProceedToNext =
          currentIndex < steps.length - 1 && state.stepValidationStatus[state.currentStep];

        const canGoToPrevious = currentIndex > 0;

        set({ canProceedToNext, canGoToPrevious }, false, 'itemWizard/updateNavigationStatus');
      },

      // Auto-save
      setAutoSaving: (saving) => {
        set({ isAutoSaving: saving }, false, 'itemWizard/setAutoSaving');
      },

      markUnsavedChanges: () => {
        set({ hasUnsavedChanges: true }, false, 'itemWizard/markUnsavedChanges');
      },

      markSaved: () => {
        set({ hasUnsavedChanges: false, lastSavedAt: new Date() }, false, 'itemWizard/markSaved');
      },

      autoSave: async () => {
        const state = get();
        if (!state.hasUnsavedChanges) return;

        set({ isAutoSaving: true }, false, 'itemWizard/autoSave/start');

        try {
          // Тут буде автозбереження в localStorage або API
          await new Promise((resolve) => setTimeout(resolve, 500));
          get().markSaved();
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          set({ isAutoSaving: false }, false, 'itemWizard/autoSave/complete');
        }
      },

      // Photos actions
      addPhoto: (file, description = '') => {
        const state = get();
        if (state.photos.length >= state.maxPhotosAllowed) {
          set(
            { photoUploadErrors: [`Максимум ${state.maxPhotosAllowed} фотографій`] },
            false,
            'itemWizard/addPhoto/error'
          );
          return;
        }

        const newPhoto: ItemPhoto = {
          id: Date.now().toString(),
          file,
          url: null,
          thumbnailUrl: null,
          description,
          uploadProgress: 0,
          isUploading: false,
          uploadError: null,
        };

        set((state) => ({ photos: [...state.photos, newPhoto] }), false, 'itemWizard/addPhoto');
        get().markUnsavedChanges();
      },

      removePhoto: (photoId) => {
        set(
          (state) => ({ photos: state.photos.filter((photo) => photo.id !== photoId) }),
          false,
          'itemWizard/removePhoto'
        );
        get().markUnsavedChanges();
        get().validateStep(ItemWizardStep.PHOTOS);
      },

      updatePhotoDescription: (photoId, description) => {
        set(
          (state) => ({
            photos: state.photos.map((photo) =>
              photo.id === photoId ? { ...photo, description } : photo
            ),
          }),
          false,
          'itemWizard/updatePhotoDescription'
        );
        get().markUnsavedChanges();
      },

      uploadPhoto: async (photoId) => {
        const state = get();
        const photo = state.photos.find((p) => p.id === photoId);
        if (!photo || !photo.file) return;

        set(
          (state) => ({
            photos: state.photos.map((p) =>
              p.id === photoId ? { ...p, isUploading: true, uploadError: null } : p
            ),
            isPhotosUploading: true,
          }),
          false,
          'itemWizard/uploadPhoto/start'
        );

        try {
          // Тут буде API виклик для завантаження фото
          // const uploadResult = await uploadPhotoToServer(photo.file);

          // Мок для демонстрації
          for (let progress = 0; progress <= 100; progress += 10) {
            get().setPhotoUploadProgress(photoId, progress);
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          const mockUrl = URL.createObjectURL(photo.file);

          set(
            (state) => ({
              photos: state.photos.map((p) =>
                p.id === photoId
                  ? { ...p, url: mockUrl, thumbnailUrl: mockUrl, isUploading: false }
                  : p
              ),
            }),
            false,
            'itemWizard/uploadPhoto/success'
          );
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Помилка завантаження';
          get().setPhotoUploadError(photoId, errorMessage);
        } finally {
          set({ isPhotosUploading: false }, false, 'itemWizard/uploadPhoto/complete');
        }
      },

      setPhotoUploadProgress: (photoId, progress) => {
        set(
          (state) => ({
            photos: state.photos.map((p) =>
              p.id === photoId ? { ...p, uploadProgress: progress } : p
            ),
          }),
          false,
          'itemWizard/setPhotoUploadProgress'
        );
      },

      setPhotoUploadError: (photoId, error) => {
        set(
          (state) => ({
            photos: state.photos.map((p) =>
              p.id === photoId ? { ...p, uploadError: error, isUploading: false } : p
            ),
          }),
          false,
          'itemWizard/setPhotoUploadError'
        );
      },

      // Utility actions
      consolidateItemData: (): OrderItemData => {
        const state = get();
        return {
          ...state.basicInfo,
          ...state.characteristics,
          ...state.defectsAndStains,
          ...state.priceModifiers,
          id: state.basicInfo.id || Date.now().toString(),
        } as OrderItemData;
      },

      resetItemWizard: () => {
        set(initialItemWizardState, false, 'itemWizard/resetItemWizard');
      },
    }),
    {
      name: 'item-wizard-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

export type ItemWizardStore = ReturnType<typeof useItemWizardStore>;
