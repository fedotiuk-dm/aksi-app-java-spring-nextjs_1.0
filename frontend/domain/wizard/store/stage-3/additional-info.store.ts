/**
 * @fileoverview Additional Info Slice Store - Zustand store для додаткової інформації замовлення
 * @module domain/wizard/store/stage-3
 * @author AKSI Team
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Типи додаткових послуг
 */
export enum AdditionalServiceType {
  WATERPROOFING = 'WATERPROOFING',
  BUTTON_SEWING = 'BUTTON_SEWING',
  HAND_CLEANING = 'HAND_CLEANING',
  PEARL_COATING = 'PEARL_COATING',
  IRONING = 'IRONING',
  DYEING = 'DYEING',
}

/**
 * Інтерфейс додаткової послуги
 */
interface AdditionalService {
  id: string;
  type: AdditionalServiceType;
  name: string;
  description: string;
  price: number;
  isSelected: boolean;
  applicableCategories?: string[];
}

/**
 * Стан додаткової інформації (Stage 3.4)
 */
interface AdditionalInfoState {
  // Order notes
  orderNotes: string;
  customerRequirements: string;
  internalNotes: string;

  // Special handling
  isFragileItem: boolean;
  requiresSpecialAttention: boolean;
  customInstructions: string;

  // Additional services
  availableServices: AdditionalService[];
  selectedServices: AdditionalService[];
  servicesTotal: number;

  // Customer communication preferences
  communicationMethod: 'PHONE' | 'SMS' | 'VIBER' | 'EMAIL' | null;
  notifyOnReady: boolean;
  notifyOnDelay: boolean;
  preferredCallTime: string;

  // Special markings
  hasSpecialMarkings: boolean;
  specialMarkings: string[];
  markingNotes: string;

  // Quality notes
  acceptanceCondition: string;
  preExistingDamage: string[];
  riskAcknowledgments: string[];

  // Validation
  additionalInfoValidationErrors: string[];
  isAdditionalInfoValid: boolean;
}

/**
 * Дії для додаткової інформації
 */
interface AdditionalInfoActions {
  // Order notes actions
  setOrderNotes: (notes: string) => void;
  setCustomerRequirements: (requirements: string) => void;
  setInternalNotes: (notes: string) => void;

  // Special handling actions
  setFragileItem: (fragile: boolean) => void;
  setRequiresSpecialAttention: (requires: boolean) => void;
  setCustomInstructions: (instructions: string) => void;

  // Additional services actions
  setAvailableServices: (services: AdditionalService[]) => void;
  toggleService: (serviceId: string) => void;
  addSelectedService: (service: AdditionalService) => void;
  removeSelectedService: (serviceId: string) => void;
  clearSelectedServices: () => void;
  calculateServicesTotal: () => void;

  // Customer communication actions
  setCommunicationMethod: (method: 'PHONE' | 'SMS' | 'VIBER' | 'EMAIL' | null) => void;
  setNotifyOnReady: (notify: boolean) => void;
  setNotifyOnDelay: (notify: boolean) => void;
  setPreferredCallTime: (time: string) => void;

  // Special markings actions
  setHasSpecialMarkings: (hasMarkings: boolean) => void;
  addSpecialMarking: (marking: string) => void;
  removeSpecialMarking: (marking: string) => void;
  setMarkingNotes: (notes: string) => void;

  // Quality notes actions
  setAcceptanceCondition: (condition: string) => void;
  addPreExistingDamage: (damage: string) => void;
  removePreExistingDamage: (damage: string) => void;
  addRiskAcknowledgment: (risk: string) => void;
  removeRiskAcknowledgment: (risk: string) => void;

  // Validation actions
  setAdditionalInfoValidationErrors: (errors: string[]) => void;
  clearAdditionalInfoValidationErrors: () => void;
  validateAdditionalInfo: () => void;
  setAdditionalInfoValid: (valid: boolean) => void;

  // Reset actions
  resetAdditionalInfo: () => void;
}

/**
 * Початковий стан додаткової інформації
 */
const initialAdditionalInfoState: AdditionalInfoState = {
  orderNotes: '',
  customerRequirements: '',
  internalNotes: '',
  isFragileItem: false,
  requiresSpecialAttention: false,
  customInstructions: '',
  availableServices: [],
  selectedServices: [],
  servicesTotal: 0,
  communicationMethod: null,
  notifyOnReady: true,
  notifyOnDelay: true,
  preferredCallTime: '',
  hasSpecialMarkings: false,
  specialMarkings: [],
  markingNotes: '',
  acceptanceCondition: '',
  preExistingDamage: [],
  riskAcknowledgments: [],
  additionalInfoValidationErrors: [],
  isAdditionalInfoValid: true,
};

/**
 * Additional Info Slice Store
 *
 * Відповідальність:
 * - Примітки до замовлення (від клієнта та внутрішні)
 * - Додаткові послуги (водовідштовхування, пришивання гудзиків)
 * - Спеціальні вимоги до обробки
 * - Налаштування комунікації з клієнтом
 * - Позначки та маркування
 * - Відображення стану приймання та ризиків
 *
 * Інтеграція:
 * - API додаткових послуг
 * - Сервіси валідації та розрахунків
 * - SMS/Email сервіси для сповіщень
 */
export const useAdditionalInfoStore = create<AdditionalInfoState & AdditionalInfoActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialAdditionalInfoState,

      // Order notes actions
      setOrderNotes: (notes) => {
        set({ orderNotes: notes }, false, 'additionalInfo/setOrderNotes');
        get().validateAdditionalInfo();
      },

      setCustomerRequirements: (requirements) => {
        set(
          { customerRequirements: requirements },
          false,
          'additionalInfo/setCustomerRequirements'
        );
        get().validateAdditionalInfo();
      },

      setInternalNotes: (notes) => {
        set({ internalNotes: notes }, false, 'additionalInfo/setInternalNotes');
      },

      // Special handling actions
      setFragileItem: (fragile) => {
        set({ isFragileItem: fragile }, false, 'additionalInfo/setFragileItem');

        // Автоматично встановлюємо потребу в особливій увазі для крихких предметів
        if (fragile) {
          set(
            { requiresSpecialAttention: true },
            false,
            'additionalInfo/setFragileItem/autoSpecialAttention'
          );
        }

        get().validateAdditionalInfo();
      },

      setRequiresSpecialAttention: (requires) => {
        set(
          { requiresSpecialAttention: requires },
          false,
          'additionalInfo/setRequiresSpecialAttention'
        );
        get().validateAdditionalInfo();
      },

      setCustomInstructions: (instructions) => {
        set({ customInstructions: instructions }, false, 'additionalInfo/setCustomInstructions');
        get().validateAdditionalInfo();
      },

      // Additional services actions
      setAvailableServices: (services) => {
        set({ availableServices: services }, false, 'additionalInfo/setAvailableServices');
      },

      toggleService: (serviceId) => {
        const state = get();
        const service = state.availableServices.find((s) => s.id === serviceId);

        if (!service) return;

        const isSelected = state.selectedServices.find((s) => s.id === serviceId);

        if (isSelected) {
          get().removeSelectedService(serviceId);
        } else {
          get().addSelectedService(service);
        }
      },

      addSelectedService: (service) => {
        set(
          (state) => ({
            selectedServices: state.selectedServices.find((s) => s.id === service.id)
              ? state.selectedServices
              : [...state.selectedServices, { ...service, isSelected: true }],
          }),
          false,
          'additionalInfo/addSelectedService'
        );
        get().calculateServicesTotal();
      },

      removeSelectedService: (serviceId) => {
        set(
          (state) => ({
            selectedServices: state.selectedServices.filter((s) => s.id !== serviceId),
          }),
          false,
          'additionalInfo/removeSelectedService'
        );
        get().calculateServicesTotal();
      },

      clearSelectedServices: () => {
        set(
          { selectedServices: [], servicesTotal: 0 },
          false,
          'additionalInfo/clearSelectedServices'
        );
      },

      calculateServicesTotal: () => {
        const state = get();
        const total = state.selectedServices.reduce((sum, service) => sum + service.price, 0);
        set({ servicesTotal: total }, false, 'additionalInfo/calculateServicesTotal');
      },

      // Customer communication actions
      setCommunicationMethod: (method) => {
        set({ communicationMethod: method }, false, 'additionalInfo/setCommunicationMethod');
        get().validateAdditionalInfo();
      },

      setNotifyOnReady: (notify) => {
        set({ notifyOnReady: notify }, false, 'additionalInfo/setNotifyOnReady');
      },

      setNotifyOnDelay: (notify) => {
        set({ notifyOnDelay: notify }, false, 'additionalInfo/setNotifyOnDelay');
      },

      setPreferredCallTime: (time) => {
        set({ preferredCallTime: time }, false, 'additionalInfo/setPreferredCallTime');
      },

      // Special markings actions
      setHasSpecialMarkings: (hasMarkings) => {
        set({ hasSpecialMarkings: hasMarkings }, false, 'additionalInfo/setHasSpecialMarkings');

        // Очищуємо позначки якщо вказано що їх немає
        if (!hasMarkings) {
          set(
            { specialMarkings: [], markingNotes: '' },
            false,
            'additionalInfo/setHasSpecialMarkings/clear'
          );
        }
      },

      addSpecialMarking: (marking) => {
        set(
          (state) => ({
            specialMarkings: state.specialMarkings.includes(marking)
              ? state.specialMarkings
              : [...state.specialMarkings, marking],
          }),
          false,
          'additionalInfo/addSpecialMarking'
        );
      },

      removeSpecialMarking: (marking) => {
        set(
          (state) => ({
            specialMarkings: state.specialMarkings.filter((m) => m !== marking),
          }),
          false,
          'additionalInfo/removeSpecialMarking'
        );
      },

      setMarkingNotes: (notes) => {
        set({ markingNotes: notes }, false, 'additionalInfo/setMarkingNotes');
      },

      // Quality notes actions
      setAcceptanceCondition: (condition) => {
        set({ acceptanceCondition: condition }, false, 'additionalInfo/setAcceptanceCondition');
      },

      addPreExistingDamage: (damage) => {
        set(
          (state) => ({
            preExistingDamage: state.preExistingDamage.includes(damage)
              ? state.preExistingDamage
              : [...state.preExistingDamage, damage],
          }),
          false,
          'additionalInfo/addPreExistingDamage'
        );
      },

      removePreExistingDamage: (damage) => {
        set(
          (state) => ({
            preExistingDamage: state.preExistingDamage.filter((d) => d !== damage),
          }),
          false,
          'additionalInfo/removePreExistingDamage'
        );
      },

      addRiskAcknowledgment: (risk) => {
        set(
          (state) => ({
            riskAcknowledgments: state.riskAcknowledgments.includes(risk)
              ? state.riskAcknowledgments
              : [...state.riskAcknowledgments, risk],
          }),
          false,
          'additionalInfo/addRiskAcknowledgment'
        );
      },

      removeRiskAcknowledgment: (risk) => {
        set(
          (state) => ({
            riskAcknowledgments: state.riskAcknowledgments.filter((r) => r !== risk),
          }),
          false,
          'additionalInfo/removeRiskAcknowledgment'
        );
      },

      // Validation actions
      setAdditionalInfoValidationErrors: (errors) => {
        set(
          {
            additionalInfoValidationErrors: errors,
            isAdditionalInfoValid: errors.length === 0,
          },
          false,
          'additionalInfo/setAdditionalInfoValidationErrors'
        );
      },

      clearAdditionalInfoValidationErrors: () => {
        set(
          { additionalInfoValidationErrors: [], isAdditionalInfoValid: true },
          false,
          'additionalInfo/clearAdditionalInfoValidationErrors'
        );
      },

      validateAdditionalInfo: () => {
        const state = get();
        const errors: string[] = [];

        // Валідація спеціальних інструкцій
        if (state.requiresSpecialAttention && !state.customInstructions.trim()) {
          errors.push('Для предметів що потребують особливої уваги, вкажіть спеціальні інструкції');
        }

        // Валідація комунікації
        if ((state.notifyOnReady || state.notifyOnDelay) && !state.communicationMethod) {
          errors.push("Виберіть спосіб зв'язку для сповіщень");
        }

        // Валідація позначок
        if (state.hasSpecialMarkings && state.specialMarkings.length === 0) {
          errors.push('Вкажіть спеціальні позначки або зніміть відповідну опцію');
        }

        // Валідація ризиків
        if (state.preExistingDamage.length > 0 && state.riskAcknowledgments.length === 0) {
          errors.push('При наявності пошкоджень необхідно підтвердити ризики');
        }

        get().setAdditionalInfoValidationErrors(errors);
      },

      setAdditionalInfoValid: (valid) => {
        set({ isAdditionalInfoValid: valid }, false, 'additionalInfo/setAdditionalInfoValid');
      },

      // Reset actions
      resetAdditionalInfo: () => {
        set(initialAdditionalInfoState, false, 'additionalInfo/resetAdditionalInfo');
      },
    }),
    {
      name: 'additional-info-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

export type AdditionalInfoStore = ReturnType<typeof useAdditionalInfoStore>;
