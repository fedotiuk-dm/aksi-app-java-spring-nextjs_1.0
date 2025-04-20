import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Client } from '@/features/clients/types/client.types';
import { 
  OrderWizardState, 
  OrderService, 
  StepStatus,
  WizardStep,
  OrderDetails,
  OrderBasicInfo,
  ReceptionPoint,
  CommunicationChannel
} from '../types/order-wizard.types';
import { DiscountType, PaymentMethod, UrgencyType } from '../types/order-details.types';

// Початкові кроки візарда
const initialSteps: WizardStep[] = [
  {
    id: 'client-selection',
    title: 'Інформація про клієнта',
    status: StepStatus.IN_PROGRESS
  },
  {
    id: 'service-selection',
    title: 'Вибір послуг',
    status: StepStatus.NOT_STARTED
  },
  {
    id: 'order-summary',
    title: 'Підсумок замовлення',
    status: StepStatus.NOT_STARTED
  },
  {
    id: 'order-completion',
    title: 'Завершення замовлення',
    status: StepStatus.NOT_STARTED
  }
];

// Початковий стан візарда
// Модельні дані для пунктів прийому замовлень
const initialReceptionPoints: ReceptionPoint[] = [
  { id: 'main', name: 'Головний офіс', address: 'вул. Центральна, 1' },
  { id: 'north', name: 'Північна філія', address: 'вул. Північна, 10' },
  { id: 'south', name: 'Південна філія', address: 'вул. Південна, 20' }
];

// Початкова базова інформація замовлення
const initialBasicInfo: OrderBasicInfo = {
  receiptNumber: '',
  uniqueTag: '',
  receptionPointId: 'main',
  createdAt: new Date().toISOString()
};

// Початкові деталі замовлення
const initialOrderDetails: OrderDetails = {
  receptionPoint: 'Main Office',
  expectedCompletionDate: '',
  urgencyType: UrgencyType.STANDARD,
  discountType: DiscountType.NONE,
  paymentMethod: PaymentMethod.TERMINAL,
  amountPaid: 0
};

const initialState: OrderWizardState = {
  client: null,
  orderNote: '',
  basicInfo: initialBasicInfo,
  services: [],
  orderDetails: initialOrderDetails,
  subtotal: 0,
  discount: 0,
  total: 0,
  currentStep: 0,
  steps: initialSteps,
  isNewClient: false,
  isCompleted: false,
  isNewClientFormVisible: false,
  communicationChannels: [],
  availableReceptionPoints: initialReceptionPoints
};

// Створення сховища для OrderWizard з використанням Zustand
// Тип стора з діями
type OrderWizardStore = OrderWizardState & {
  // Дії з клієнтом
  setClient: (client: Client | null) => void;
  setOrderNote: (orderNote: string) => void;
  setIsNewClient: (isNewClient: boolean) => void;
  setIsNewClientFormVisible: (isVisible: boolean) => void;
  setCommunicationChannels: (channels: CommunicationChannel[]) => void;
  
  // Дії з базовою інформацією замовлення
  setBasicInfo: (info: Partial<OrderBasicInfo>) => void;
  generateReceiptNumber: () => void;
  
  // Дії з послугами
  addService: (service: OrderService) => void;
  updateService: (index: number, service: OrderService) => void;
  removeService: (index: number) => void;
  clearServices: () => void;

  // Управління кроками візарда
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  
  // Дії з деталями замовлення
  setOrderDetails: (details: OrderDetails) => void;
  
  // Фінансові дії
  updatePrices: () => void;
  getTotalAmount: () => number;
  setDiscount: (discount: number) => void;
  
  // Управління станом візарда
  completeStep: (stepIndex: number) => void;
  resetWizard: () => void;
  completeWizard: (orderId: string) => void;
};

export const useOrderWizardStore = create<OrderWizardStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Дії з клієнтом
      setClient: (client) => set({ client }),
      setOrderNote: (orderNote) => set({ orderNote }),
      setIsNewClient: (isNewClient: boolean) => {
        set({ isNewClient });
      },
  
      setIsNewClientFormVisible: (isVisible: boolean) => {
        set({ isNewClientFormVisible: isVisible });
      },
  
      setCommunicationChannels: (channels: CommunicationChannel[]) => {
        set({ communicationChannels: channels });
      },
  
      // Дії з базовою інформацією замовлення
      setBasicInfo: (info: Partial<OrderBasicInfo>) => {
        set((state) => ({
          basicInfo: { ...state.basicInfo, ...info }
        }));
      },
  
      generateReceiptNumber: () => {
        // Створюємо номер квитанції у форматі AKS-YYYYMMDD-XXXX
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-цифрове число
        const receiptNumber = `AKS-${year}${month}${day}-${randomNum}`;
        
        set((state) => ({
          basicInfo: { ...state.basicInfo, receiptNumber }
        }));
      },
  
      // Дії з послугами
      addService: (service) => {
        set((state) => {
          const newServices = [...state.services, service];
          return {
            services: newServices,
            subtotal: newServices.reduce((sum, s) => sum + s.totalPrice, 0)
          };
        });
        get().updatePrices();
      },

      updateService: (index, service) => {
        set((state) => {
          const services = [...state.services];
          services[index] = service;
          return { services };
        });
        get().updatePrices();
      },

      removeService: (index) => {
        set((state) => {
          const services = state.services.filter((_, i) => i !== index);
          return { services };
        });
        get().updatePrices();
      },

      clearServices: () => {
        set({ services: [] });
        get().updatePrices();
      },

      // Управління кроками візарда
      nextStep: () => {
        const currentStep = get().currentStep;
        const steps = [...get().steps];
        
        // Позначаємо поточний крок як завершений
        if (currentStep < steps.length) {
          steps[currentStep].status = StepStatus.COMPLETED;
        }
        
        // Позначаємо наступний крок як виконується
        if (currentStep + 1 < steps.length) {
          steps[currentStep + 1].status = StepStatus.IN_PROGRESS;
        }
        
        set({ 
          currentStep: Math.min(currentStep + 1, steps.length),
          steps
        });
      },

      prevStep: () => {
        const currentStep = get().currentStep;
        const steps = [...get().steps];
        
        // Позначаємо поточний крок як не розпочатий
        if (currentStep < steps.length) {
          steps[currentStep].status = StepStatus.NOT_STARTED;
        }
        
        // Позначаємо попередній крок як виконується
        if (currentStep - 1 >= 0) {
          steps[currentStep - 1].status = StepStatus.IN_PROGRESS;
        }
        
        set({ 
          currentStep: Math.max(0, currentStep - 1),
          steps
        });
      },

      goToStep: (step) => {
        const steps = [...get().steps];
        
        // Оновлюємо статуси всіх кроків
        steps.forEach((s, index) => {
          if (index < step) {
            s.status = StepStatus.COMPLETED;
          } else if (index === step) {
            s.status = StepStatus.IN_PROGRESS;
          } else {
            s.status = StepStatus.NOT_STARTED;
          }
        });
        
        set({ currentStep: step, steps });
      },

      // Дії з деталями замовлення
      setOrderDetails: (details) => {
        set(() => ({ orderDetails: details }));
      },

      // Фінансові дії
      updatePrices: () => {
        set((state) => {
          const subtotal = state.services.reduce((sum, service) => sum + service.totalPrice, 0);
          const total = subtotal - state.discount;
          return { subtotal, total };
        });
      },
      
      // Отримати загальну суму замовлення (для використання в компонентах)
      getTotalAmount: () => {
        const state = get();
        return state.total;
      },

      setDiscount: (discount) => {
        set({ discount });
        get().updatePrices();
      },

      // Управління станом візарда
      completeStep: (stepIndex) => {
        const steps = [...get().steps];
        if (stepIndex < steps.length) {
          steps[stepIndex].status = StepStatus.COMPLETED;
          set({ steps });
        }
      },

      resetWizard: () => {
    const resetState = {
      ...initialState,
      basicInfo: {
        ...initialBasicInfo,
        createdAt: new Date().toISOString()
      }
    };
    set(resetState);
    
    // Генеруємо номер квитанції після скидання стану
    setTimeout(() => get().generateReceiptNumber(), 0);
  },

      completeWizard: (orderId) => {
        set({ 
          orderId,
          isCompleted: true,
          steps: get().steps.map(step => ({ ...step, status: StepStatus.COMPLETED }))
        });
      }
    }),
    { name: 'order-wizard-store' }
  )
);
