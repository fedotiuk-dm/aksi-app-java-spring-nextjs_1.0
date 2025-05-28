/**
 * @fileoverview Characteristics Slice Store - Zustand store для характеристик предмета
 * @module domain/wizard/store/stage-2
 * @author AKSI Team
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { ServiceCategory } from './basic-info.store';

/**
 * Типи матеріалів
 */
export enum MaterialType {
  COTTON = 'COTTON',
  WOOL = 'WOOL',
  SILK = 'SILK',
  SYNTHETIC = 'SYNTHETIC',
  SMOOTH_LEATHER = 'SMOOTH_LEATHER',
  NUBUCK = 'NUBUCK',
  SPLIT_LEATHER = 'SPLIT_LEATHER',
  SUEDE = 'SUEDE',
  NATURAL_FUR = 'NATURAL_FUR',
  ARTIFICIAL_FUR = 'ARTIFICIAL_FUR',
}

/**
 * Типи наповнювача
 */
export enum FillerType {
  DOWN = 'DOWN',
  SYNTHETIC_FILLER = 'SYNTHETIC_FILLER',
  OTHER = 'OTHER',
}

/**
 * Ступінь зносу
 */
export enum WearLevel {
  LEVEL_10 = 10,
  LEVEL_30 = 30,
  LEVEL_50 = 50,
  LEVEL_75 = 75,
}

/**
 * Стан характеристик предмета (Підетап 2.2)
 */
interface CharacteristicsState {
  // Material
  selectedMaterial: MaterialType | null;
  availableMaterials: MaterialType[];
  materialNote: string;

  // Color
  selectedColor: string;
  isCustomColor: boolean;
  availableColors: string[];
  colorNote: string;

  // Filler (for applicable categories)
  selectedFiller: FillerType | null;
  customFillerName: string;
  isFillerCrushed: boolean;
  fillerNote: string;
  isFillerApplicable: boolean;

  // Wear level
  selectedWearLevel: WearLevel;
  wearLevelNote: string;

  // Additional characteristics
  brand: string;
  size: string;
  additionalNotes: string;

  // Validation
  characteristicsValidationErrors: Record<string, string[]>;
  isCharacteristicsStepValid: boolean;

  // Loading states
  isMaterialsLoading: boolean;
  isColorsLoading: boolean;
  materialsLoadingError: string | null;
}

/**
 * Дії для характеристик предмета
 */
interface CharacteristicsActions {
  // Material management
  setSelectedMaterial: (material: MaterialType | null) => void;
  setAvailableMaterials: (materials: MaterialType[]) => void;
  setMaterialsLoading: (loading: boolean) => void;
  setMaterialsLoadingError: (error: string | null) => void;
  setMaterialNote: (note: string) => void;
  loadMaterialsByCategory: (category: ServiceCategory) => Promise<void>;

  // Color management
  setSelectedColor: (color: string) => void;
  setIsCustomColor: (isCustom: boolean) => void;
  setAvailableColors: (colors: string[]) => void;
  setColorsLoading: (loading: boolean) => void;
  setColorNote: (note: string) => void;
  loadAvailableColors: () => Promise<void>;

  // Filler management
  setSelectedFiller: (filler: FillerType | null) => void;
  setCustomFillerName: (name: string) => void;
  setIsFillerCrushed: (crushed: boolean) => void;
  setFillerNote: (note: string) => void;
  setIsFillerApplicable: (applicable: boolean) => void;
  checkFillerApplicability: (category: ServiceCategory) => void;

  // Wear level
  setSelectedWearLevel: (level: WearLevel) => void;
  setWearLevelNote: (note: string) => void;

  // Additional characteristics
  setBrand: (brand: string) => void;
  setSize: (size: string) => void;
  setAdditionalNotes: (notes: string) => void;

  // Validation
  setCharacteristicsValidationErrors: (field: string, errors: string[]) => void;
  clearCharacteristicsValidationErrors: (field: string) => void;
  validateCharacteristicsStep: () => void;
  setCharacteristicsStepValid: (valid: boolean) => void;

  // Helper methods
  getMaterialDisplayName: (material: MaterialType) => string;
  getWearLevelDisplayName: (level: WearLevel) => string;
  getFillerDisplayName: (filler: FillerType) => string;

  // Reset actions
  resetCharacteristics: () => void;
}

/**
 * Початковий стан характеристик предмета
 */
const initialCharacteristicsState: CharacteristicsState = {
  selectedMaterial: null,
  availableMaterials: [],
  materialNote: '',
  selectedColor: '',
  isCustomColor: false,
  availableColors: [],
  colorNote: '',
  selectedFiller: null,
  customFillerName: '',
  isFillerCrushed: false,
  fillerNote: '',
  isFillerApplicable: false,
  selectedWearLevel: WearLevel.LEVEL_10,
  wearLevelNote: '',
  brand: '',
  size: '',
  additionalNotes: '',
  characteristicsValidationErrors: {},
  isCharacteristicsStepValid: false,
  isMaterialsLoading: false,
  isColorsLoading: false,
  materialsLoadingError: null,
};

/**
 * Characteristics Slice Store
 *
 * Відповідальність:
 * - Управління матеріалами в залежності від категорії
 * - Вибір кольору (базові + власний)
 * - Наповнювач для відповідних категорій
 * - Ступінь зносу виробу
 * - Додаткові характеристики (бренд, розмір)
 * - Валідація характеристик
 *
 * Інтеграція:
 * - API матеріалів по категоріях
 * - API кольорів
 * - Orval типи
 * - Валідація залежно від категорії
 */
export const useCharacteristicsStore = create<CharacteristicsState & CharacteristicsActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialCharacteristicsState,

      // Material management
      setSelectedMaterial: (material) => {
        set({ selectedMaterial: material }, false, 'characteristics/setSelectedMaterial');
        get().validateCharacteristicsStep();
      },

      setAvailableMaterials: (materials) => {
        set({ availableMaterials: materials }, false, 'characteristics/setAvailableMaterials');
      },

      setMaterialsLoading: (loading) => {
        set({ isMaterialsLoading: loading }, false, 'characteristics/setMaterialsLoading');
      },

      setMaterialsLoadingError: (error) => {
        set({ materialsLoadingError: error }, false, 'characteristics/setMaterialsLoadingError');
      },

      setMaterialNote: (note) => {
        set({ materialNote: note }, false, 'characteristics/setMaterialNote');
      },

      loadMaterialsByCategory: async (category) => {
        set(
          { isMaterialsLoading: true, materialsLoadingError: null },
          false,
          'characteristics/loadMaterialsByCategory/start'
        );

        try {
          // API виклик для завантаження матеріалів по категорії
          // const materials = await getMaterialsByCategory(category);
          // get().setAvailableMaterials(materials);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Помилка завантаження матеріалів';
          get().setMaterialsLoadingError(errorMessage);
        } finally {
          set(
            { isMaterialsLoading: false },
            false,
            'characteristics/loadMaterialsByCategory/complete'
          );
        }
      },

      // Color management
      setSelectedColor: (color) => {
        set({ selectedColor: color }, false, 'characteristics/setSelectedColor');
        get().validateCharacteristicsStep();
      },

      setIsCustomColor: (isCustom) => {
        set({ isCustomColor: isCustom }, false, 'characteristics/setIsCustomColor');

        if (!isCustom) {
          set({ selectedColor: '' }, false, 'characteristics/setIsCustomColor/clearColor');
        }

        get().validateCharacteristicsStep();
      },

      setAvailableColors: (colors) => {
        set({ availableColors: colors }, false, 'characteristics/setAvailableColors');
      },

      setColorsLoading: (loading) => {
        set({ isColorsLoading: loading }, false, 'characteristics/setColorsLoading');
      },

      setColorNote: (note) => {
        set({ colorNote: note }, false, 'characteristics/setColorNote');
      },

      loadAvailableColors: async () => {
        set({ isColorsLoading: true }, false, 'characteristics/loadAvailableColors/start');

        try {
          // API виклик для завантаження базових кольорів
          // const colors = await getAvailableColors();
          // get().setAvailableColors(colors);
        } catch (error) {
          console.error('Failed to load colors:', error);
        } finally {
          set({ isColorsLoading: false }, false, 'characteristics/loadAvailableColors/complete');
        }
      },

      // Filler management
      setSelectedFiller: (filler) => {
        set({ selectedFiller: filler }, false, 'characteristics/setSelectedFiller');

        // Очищуємо custom назву якщо вибрано стандартний наповнювач
        if (filler !== FillerType.OTHER) {
          set({ customFillerName: '' }, false, 'characteristics/setSelectedFiller/clearCustomName');
        }

        get().validateCharacteristicsStep();
      },

      setCustomFillerName: (name) => {
        set({ customFillerName: name }, false, 'characteristics/setCustomFillerName');
        get().validateCharacteristicsStep();
      },

      setIsFillerCrushed: (crushed) => {
        set({ isFillerCrushed: crushed }, false, 'characteristics/setIsFillerCrushed');
      },

      setFillerNote: (note) => {
        set({ fillerNote: note }, false, 'characteristics/setFillerNote');
      },

      setIsFillerApplicable: (applicable) => {
        set({ isFillerApplicable: applicable }, false, 'characteristics/setIsFillerApplicable');

        // Очищуємо дані наповнювача якщо не застосовується
        if (!applicable) {
          set(
            {
              selectedFiller: null,
              customFillerName: '',
              isFillerCrushed: false,
              fillerNote: '',
            },
            false,
            'characteristics/setIsFillerApplicable/clearFiller'
          );
        }

        get().validateCharacteristicsStep();
      },

      checkFillerApplicability: (category) => {
        // Наповнювач застосовується для певних категорій
        const fillerApplicableCategories = [
          ServiceCategory.CLOTHING_TEXTILE,
          ServiceCategory.SHEEPSKIN,
        ];

        const applicable = fillerApplicableCategories.includes(category);
        get().setIsFillerApplicable(applicable);
      },

      // Wear level
      setSelectedWearLevel: (level) => {
        set({ selectedWearLevel: level }, false, 'characteristics/setSelectedWearLevel');
        get().validateCharacteristicsStep();
      },

      setWearLevelNote: (note) => {
        set({ wearLevelNote: note }, false, 'characteristics/setWearLevelNote');
      },

      // Additional characteristics
      setBrand: (brand) => {
        set({ brand }, false, 'characteristics/setBrand');
      },

      setSize: (size) => {
        set({ size }, false, 'characteristics/setSize');
      },

      setAdditionalNotes: (notes) => {
        set({ additionalNotes: notes }, false, 'characteristics/setAdditionalNotes');
      },

      // Validation
      setCharacteristicsValidationErrors: (field, errors) => {
        set(
          (state) => ({
            characteristicsValidationErrors: {
              ...state.characteristicsValidationErrors,
              [field]: errors,
            },
          }),
          false,
          'characteristics/setCharacteristicsValidationErrors'
        );
        get().validateCharacteristicsStep();
      },

      clearCharacteristicsValidationErrors: (field) => {
        set(
          (state) => {
            const { [field]: removed, ...rest } = state.characteristicsValidationErrors;
            return { characteristicsValidationErrors: rest };
          },
          false,
          'characteristics/clearCharacteristicsValidationErrors'
        );
        get().validateCharacteristicsStep();
      },

      validateCharacteristicsStep: () => {
        const state = get();
        const errors: Record<string, string[]> = {};

        // Валідація матеріалу
        if (!state.selectedMaterial) {
          errors.material = ['Виберіть матеріал'];
        }

        // Валідація кольору
        if (!state.selectedColor.trim()) {
          errors.color = ['Вкажіть колір'];
        }

        // Валідація наповнювача (якщо застосовується)
        if (state.isFillerApplicable) {
          if (!state.selectedFiller) {
            errors.filler = ['Виберіть тип наповнювача'];
          } else if (state.selectedFiller === FillerType.OTHER && !state.customFillerName.trim()) {
            errors.customFillerName = ['Вкажіть назву наповнювача'];
          }
        }

        const hasErrors = Object.keys(errors).length > 0;
        const hasValidationErrors = Object.values(state.characteristicsValidationErrors).some(
          (fieldErrors) => fieldErrors.length > 0
        );

        set(
          {
            characteristicsValidationErrors: errors,
            isCharacteristicsStepValid: !hasErrors && !hasValidationErrors,
          },
          false,
          'characteristics/validateCharacteristicsStep'
        );
      },

      setCharacteristicsStepValid: (valid) => {
        set(
          { isCharacteristicsStepValid: valid },
          false,
          'characteristics/setCharacteristicsStepValid'
        );
      },

      // Helper methods
      getMaterialDisplayName: (material) => {
        const materialNames: Record<MaterialType, string> = {
          [MaterialType.COTTON]: 'Бавовна',
          [MaterialType.WOOL]: 'Шерсть',
          [MaterialType.SILK]: 'Шовк',
          [MaterialType.SYNTHETIC]: 'Синтетика',
          [MaterialType.SMOOTH_LEATHER]: 'Гладка шкіра',
          [MaterialType.NUBUCK]: 'Нубук',
          [MaterialType.SPLIT_LEATHER]: 'Спілок',
          [MaterialType.SUEDE]: 'Замша',
          [MaterialType.NATURAL_FUR]: 'Натуральне хутро',
          [MaterialType.ARTIFICIAL_FUR]: 'Штучне хутро',
        };
        return materialNames[material] || material;
      },

      getWearLevelDisplayName: (level) => {
        return `${level}%`;
      },

      getFillerDisplayName: (filler) => {
        const fillerNames: Record<FillerType, string> = {
          [FillerType.DOWN]: 'Пух',
          [FillerType.SYNTHETIC_FILLER]: 'Синтепон',
          [FillerType.OTHER]: 'Інше',
        };
        return fillerNames[filler] || filler;
      },

      // Reset actions
      resetCharacteristics: () => {
        set(initialCharacteristicsState, false, 'characteristics/resetCharacteristics');
      },
    }),
    {
      name: 'characteristics-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

export type CharacteristicsStore = ReturnType<typeof useCharacteristicsStore>;
