import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { BaseStore } from './baseStore';
import { ItemWizardSubStep, StepValidationStatus } from '../../types/wizard.types';

/**
 * Константа для статусу валідації 'не валідовано'
 */
const NOT_VALIDATED: StepValidationStatus = 'not-validated';

/**
 * Типи дефектів предмета згідно документації
 */
export enum DefectType {
  GENERAL_WEAR = 'general_wear', // Загальна потертість
  FABRIC_DAMAGE = 'fabric_damage', // Пошкодження тканини
  STAIN = 'stain', // Пляма
  MISSING_BUTTON = 'missing_button', // Відсутній ґудзик
  MISSING_ACCESSORY = 'missing_accessory', // Відсутність фурнітури
  DAMAGED_ACCESSORY = 'damaged_accessory', // Пошкодження фурнітури
  OTHER = 'other', // Інше
}

/**
 * Типи ризиків згідно документації
 */
export enum RiskType {
  COLOR_CHANGE = 'color_change', // Ризик зміни кольору
  DEFORMATION = 'deformation', // Ризик деформації
  NO_GUARANTEE = 'no_guarantee', // Без гарантій
}

/**
 * Тип дефекту/плями
 */
export interface ItemDefect {
  id: string;
  type: DefectType;
  description: string;
  location: string;
}

/**
 * Тип ризику
 */
export interface ItemRisk {
  id: string;
  type: RiskType;
  description: string;
}

/**
 * Інтерфейс стану стору деталей предмета
 */
export interface ItemDetailsState extends BaseStore {
  // Основна інформація предмета
  itemId: string | null;
  categoryId: string | null;
  categoryName: string;
  name: string;
  quantity: number;

  // Властивості предмета
  materialType: string;
  color: string;
  pattern: string;
  size: string;
  brand: string;

  // Дефекти та плями
  defects: ItemDefect[];

  // Ризики
  risks: ItemRisk[];

  // Примітки щодо дефектів
  defectsNotes: string;

  // Фотодокументація
  photos: string[];

  // Поточний підетап
  currentSubStep: ItemWizardSubStep;

  // Статуси валідації для підетапів
  validationStatuses: Record<ItemWizardSubStep, StepValidationStatus>;

  // Методи для базової інформації
  setItemId: (itemId: string | null) => void;
  setCategoryId: (categoryId: string | null, categoryName: string) => void;
  setName: (name: string) => void;
  setQuantity: (quantity: number) => void;

  // Методи для властивостей
  setMaterialType: (materialType: string) => void;
  setColor: (color: string) => void;
  setPattern: (pattern: string) => void;
  setSize: (size: string) => void;
  setBrand: (brand: string) => void;

  // Методи для дефектів
  addDefect: (defect: ItemDefect) => void;
  updateDefect: (defectId: string, updatedDefect: Partial<ItemDefect>) => void;
  removeDefect: (defectId: string) => void;

  // Методи для ризиків
  addRisk: (risk: ItemRisk) => void;
  updateRisk: (riskId: string, updatedRisk: Partial<ItemRisk>) => void;
  removeRisk: (riskId: string) => void;

  // Метод для приміток щодо дефектів
  setDefectsNotes: (notes: string) => void;

  // Методи для фотографій
  addPhoto: (photoUrl: string) => void;
  removePhoto: (photoUrl: string) => void;

  // Навігація підетапами
  setCurrentSubStep: (subStep: ItemWizardSubStep) => void;

  // Встановлення статусу валідації підетапу
  setSubStepValidationStatus: (subStep: ItemWizardSubStep, status: StepValidationStatus) => void;
}

/**
 * Початковий стан для стору деталей предмета
 */
const initialState = {
  // Основна інформація
  itemId: null,
  categoryId: null,
  categoryName: '',
  name: '',
  quantity: 1,

  // Властивості
  materialType: '',
  color: '',
  pattern: '',
  size: '',
  brand: '',

  // Дефекти та плями
  defects: [],

  // Ризики
  risks: [],

  // Примітки щодо дефектів
  defectsNotes: '',

  // Фотодокументація
  photos: [],

  // Підетап
  currentSubStep: 'basic-info' as ItemWizardSubStep,

  // Статуси валідації
  validationStatuses: {
    'basic-info': NOT_VALIDATED,
    'item-properties': NOT_VALIDATED,
    'defects-stains': NOT_VALIDATED,
    'price-calculator': NOT_VALIDATED,
    'photo-documentation': NOT_VALIDATED,
  } as Record<ItemWizardSubStep, StepValidationStatus>,

  error: null,
  isSaving: false,
};

/**
 * Стор для управління деталями предмета в Order Wizard
 */
export const useItemDetailsStore = create<ItemDetailsState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Методи для основної інформації
        setItemId: (itemId) =>
          set({
            itemId,
          }),

        setCategoryId: (categoryId, categoryName) =>
          set({
            categoryId,
            categoryName,
          }),

        setName: (name) =>
          set({
            name,
          }),

        setQuantity: (quantity) =>
          set({
            quantity,
          }),

        // Методи для властивостей
        setMaterialType: (materialType) =>
          set({
            materialType,
          }),

        setColor: (color) =>
          set({
            color,
          }),

        setPattern: (pattern) =>
          set({
            pattern,
          }),

        setSize: (size) =>
          set({
            size,
          }),

        setBrand: (brand) =>
          set({
            brand,
          }),

        // Методи для дефектів
        addDefect: (defect) =>
          set((state) => ({
            defects: [...state.defects, defect],
          })),

        updateDefect: (defectId, updatedDefect) =>
          set((state) => ({
            defects: state.defects.map((defect) =>
              defect.id === defectId ? { ...defect, ...updatedDefect } : defect
            ),
          })),

        removeDefect: (defectId) =>
          set((state) => ({
            defects: state.defects.filter((defect) => defect.id !== defectId),
          })),

        // Методи для ризиків
        addRisk: (risk) =>
          set((state) => ({
            risks: [...state.risks, risk],
          })),

        updateRisk: (riskId, updatedRisk) =>
          set((state) => ({
            risks: state.risks.map((risk) =>
              risk.id === riskId ? { ...risk, ...updatedRisk } : risk
            ),
          })),

        removeRisk: (riskId) =>
          set((state) => ({
            risks: state.risks.filter((risk) => risk.id !== riskId),
          })),

        // Метод для приміток щодо дефектів
        setDefectsNotes: (notes) =>
          set({
            defectsNotes: notes,
          }),

        // Методи для фотографій
        addPhoto: (photoUrl) =>
          set((state) => ({
            photos: [...state.photos, photoUrl],
          })),

        removePhoto: (photoUrl) =>
          set((state) => ({
            photos: state.photos.filter((url) => url !== photoUrl),
          })),

        // Навігація підетапами
        setCurrentSubStep: (subStep) =>
          set({
            currentSubStep: subStep,
          }),

        // Статус валідації підетапу
        setSubStepValidationStatus: (subStep, status) =>
          set((state) => ({
            validationStatuses: {
              ...state.validationStatuses,
              [subStep]: status,
            },
          })),

        // Встановлення помилки
        setError: (error) =>
          set({
            error,
          }),

        // Встановлення статусу збереження
        setIsSaving: (isSaving) =>
          set({
            isSaving,
          }),

        // Скидання стану стору
        reset: () => set(initialState),
      }),
      {
        name: 'order-wizard-item-details',
      }
    )
  )
);
