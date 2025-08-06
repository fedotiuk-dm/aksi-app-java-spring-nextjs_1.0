import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  CustomerInfo,
  CreateCustomerRequest,
} from '@/shared/api/generated/customer';
import type {
  OrderInfo,
  CreateOrderRequest,
} from '@/shared/api/generated/order';
import type {
  CartInfo,
  CartItemInfo,
  AddCartItemRequest,
  CartPricingInfo,
  CartGlobalModifiersUrgencyType,
  CartGlobalModifiersDiscountType,
} from '@/shared/api/generated/cart';
import { 
  addCartItem,
  removeCartItem,
  updateCartItem as updateCartItemAPI,
  calculateCart,
  updateCartModifiers,
  clearCart,
  getCart
} from '@/shared/api/generated/cart';
import type {
  PriceListItemInfo,
  PriceListItemInfoCategoryCode,
} from '@/shared/api/generated/priceList';
import type {
  ItemCharacteristics,
  ItemStain,
  ItemDefect,
  ItemRisk,
  PriceListItemSummary,
} from '@/shared/api/generated/cart';

// Extended item form data for UI
interface ItemFormData extends Omit<AddCartItemRequest, 'modifierCodes'> {
  // Service selection
  serviceCategory: PriceListItemInfoCategoryCode | null;
  selectedService: PriceListItemInfo | null;
  
  // Item details
  stains: ItemStain[];
  defects: ItemDefect[];
  risks: ItemRisk[];
  
  // Selected modifiers
  modifierCodes: string[];
  
  // Photos
  photos: File[];
  photoUrls: string[];
  
  // Notes
  notes?: string;
}

interface OrderWizardStore {
  // Customer Section
  customer: CustomerInfo | null;
  customerSearchQuery: string;
  isCustomerFormOpen: boolean;
  
  // Order Info Section
  orderNumber: string;
  uniqueLabel: string;
  branchId: string;
  
  // Cart Management
  cartId: string | null;
  cartInfo: CartInfo | null;
  
  // Item Form
  itemForm: ItemFormData;
  isItemFormOpen: boolean;
  editingItemId: string | null;
  
  // Calculations
  isCalculating: boolean;
  
  // Summary Section
  deliveryDate: Date;
  urgency: CartGlobalModifiersUrgencyType;
  discountType: CartGlobalModifiersDiscountType;
  customDiscountPercent: number;
  
  // Payment Section
  paidAmount: number;
  paymentMethod: 'TERMINAL' | 'CASH' | 'BANK';
  orderNotes: string;
  termsAccepted: boolean;
  signature: string;
  
  // UI States
  isLoading: boolean;
  isSaving: boolean;
  errors: Record<string, string>;
  
  // Customer Actions
  setCustomer: (customer: CustomerInfo | null) => void;
  setCustomerSearchQuery: (query: string) => void;
  setCustomerFormOpen: (open: boolean) => void;
  
  // Order Info Actions
  setOrderNumber: (number: string) => void;
  setUniqueLabel: (label: string) => void;
  setBranchId: (id: string) => void;
  
  // Cart Actions
  setCartId: (id: string | null) => void;
  setCartInfo: (cart: CartInfo | null) => void;
  
  // Item Form Actions
  updateItemForm: (data: Partial<ItemFormData>) => void;
  setItemFormOpen: (open: boolean) => void;
  setEditingItemId: (id: string | null) => void;
  resetItemForm: () => void;
  
  // Calculation Actions
  setIsCalculating: (calculating: boolean) => void;
  
  // Summary Actions
  setDeliveryDate: (date: Date) => void;
  setUrgency: (urgency: CartGlobalModifiersUrgencyType) => void;
  setDiscountType: (type: CartGlobalModifiersDiscountType) => void;
  setCustomDiscountPercent: (percent: number) => void;
  
  // Payment Actions
  setPaidAmount: (amount: number) => void;
  setPaymentMethod: (method: 'TERMINAL' | 'CASH' | 'BANK') => void;
  setOrderNotes: (notes: string) => void;
  setTermsAccepted: (accepted: boolean) => void;
  setSignature: (signature: string) => void;
  
  // UI Actions
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  
  // Cart Item Actions (local state)
  addItemToCart: (item: ItemFormData) => void;
  updateCartItem: (itemId: string, item: Partial<ItemFormData>) => void;
  removeCartItem: (itemId: string) => void;
  getCartItemsCount: () => number;
  
  // Cart API Actions (backend)
  addItemToCartAPI: (item: ItemFormData) => Promise<void>;
  updateCartItemAPI: (itemId: string, item: Partial<ItemFormData>) => Promise<void>;
  removeCartItemAPI: (itemId: string) => Promise<void>;
  calculateCartAPI: () => Promise<void>;
  updateCartModifiersAPI: () => Promise<void>;
  loadCartFromAPI: () => Promise<void>;
  clearCartAPI: () => Promise<void>;
  
  // Computed values
  getTotalAmount: () => number;
  getDiscountAmount: () => number;
  getUrgencyAmount: () => number;
  getDebtAmount: () => number;
  getFinalAmount: () => number;
  canSubmitOrder: () => boolean;
  
  // Validation
  validateCustomer: () => string[];
  validateCart: () => string[];
  validatePayment: () => string[];
  
  // Utils
  resetWizard: () => void;
}

const initialItemForm: ItemFormData = {
  priceListItemId: '',
  quantity: 1,
  serviceCategory: null,
  selectedService: null,
  characteristics: {
    material: undefined,
    color: undefined,
    filler: undefined,
    fillerCondition: undefined,
    wearLevel: undefined,
  },
  stains: [],
  defects: [],
  risks: [],
  modifierCodes: [],
  photos: [],
  photoUrls: [],
  notes: undefined,
};

const initialState = {
  // Customer
  customer: null,
  customerSearchQuery: '',
  isCustomerFormOpen: false,
  
  // Order Info
  orderNumber: '',
  uniqueLabel: '',
  branchId: '',
  
  // Cart
  cartId: null,
  cartInfo: null,
  
  // Item Form
  itemForm: initialItemForm,
  isItemFormOpen: false,
  editingItemId: null,
  
  // Calculations
  isCalculating: false,
  
  // Summary
  deliveryDate: new Date(), // Will be set to +48 hours in component
  urgency: 'NORMAL' as CartGlobalModifiersUrgencyType,
  discountType: 'NONE' as CartGlobalModifiersDiscountType,
  customDiscountPercent: 0,
  
  // Payment
  paidAmount: 0,
  paymentMethod: 'TERMINAL' as const,
  orderNotes: '',
  termsAccepted: false,
  signature: '',
  
  // UI
  isLoading: false,
  isSaving: false,
  errors: {},
};

export const useOrderWizardStore = create<OrderWizardStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Customer Actions
      setCustomer: (customer) => set({ customer }),
      setCustomerSearchQuery: (query) => set({ customerSearchQuery: query }),
      setCustomerFormOpen: (open) => set({ isCustomerFormOpen: open }),
      
      // Order Info Actions
      setOrderNumber: (number) => set({ orderNumber: number }),
      setUniqueLabel: (label) => set({ uniqueLabel: label }),
      setBranchId: (id) => set({ branchId: id }),
      
      // Cart Actions
      setCartId: (id) => set({ cartId: id }),
      setCartInfo: (cart) => set({ cartInfo: cart }),
      
      // Item Form Actions
      updateItemForm: (data) => set((state) => ({
        itemForm: { ...state.itemForm, ...data }
      })),
      setItemFormOpen: (open) => set({ isItemFormOpen: open }),
      setEditingItemId: (id) => set({ editingItemId: id }),
      resetItemForm: () => set({ 
        itemForm: initialItemForm,
        editingItemId: null,
        isItemFormOpen: false,
      }),
      
      // Calculation Actions
      setIsCalculating: (calculating) => set({ isCalculating: calculating }),
      
      // Summary Actions
      setDeliveryDate: (date) => set({ deliveryDate: date }),
      setUrgency: (urgency) => set({ urgency }),
      setDiscountType: (type) => set({ discountType: type }),
      setCustomDiscountPercent: (percent) => set({ customDiscountPercent: percent }),
      
      // Payment Actions
      setPaidAmount: (amount) => set({ paidAmount: amount }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setOrderNotes: (notes) => set({ orderNotes: notes }),
      setTermsAccepted: (accepted) => set({ termsAccepted: accepted }),
      setSignature: (signature) => set({ signature: signature }),
      
      // UI Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setSaving: (saving) => set({ isSaving: saving }),
      setError: (field, error) => set((state) => ({
        errors: { ...state.errors, [field]: error },
      })),
      clearError: (field) => set((state) => {
        const { [field]: _, ...rest } = state.errors;
        return { errors: rest };
      }),
      clearAllErrors: () => set({ errors: {} }),
      
      // Cart Item Actions
      addItemToCart: (item) => {
        const state = get();
        const newItem: CartItemInfo = {
          id: `temp-${Date.now()}`,
          priceListItemId: item.priceListItemId,
          priceListItem: {
            id: item.priceListItemId,
            name: item.selectedService?.nameUa || item.selectedService?.name || '',
            categoryCode: item.selectedService?.categoryCode || 'CLOTHING',
            unitOfMeasure: 'PIECE' as const,
            basePrice: item.selectedService?.basePrice || 0,
          },
          quantity: item.quantity,
          characteristics: item.characteristics || {},
          modifiers: item.modifierCodes?.map(code => ({
            code,
            name: code, // Will be resolved by API
            type: 'PERCENTAGE' as const,
            value: 0, // Will be calculated by API
          })),
          pricing: {
            basePrice: item.selectedService ? item.selectedService.basePrice * item.quantity : 0,
            modifierDetails: [],
            modifiersTotalAmount: 0,
            subtotal: item.selectedService ? item.selectedService.basePrice * item.quantity : 0,
            urgencyAmount: 0,
            discountAmount: 0,
            total: item.selectedService ? item.selectedService.basePrice * item.quantity : 0,
          },
        };

        const updatedCart: CartInfo = {
          ...state.cartInfo!,
          items: [...(state.cartInfo?.items || []), newItem],
          pricing: {
            itemsSubtotal: (state.cartInfo?.pricing?.itemsSubtotal || 0) + newItem.pricing.subtotal,
            urgencyAmount: state.cartInfo?.pricing?.urgencyAmount || 0,
            discountAmount: state.cartInfo?.pricing?.discountAmount || 0,
            total: (state.cartInfo?.pricing?.itemsSubtotal || 0) + newItem.pricing.subtotal + (state.cartInfo?.pricing?.urgencyAmount || 0) - (state.cartInfo?.pricing?.discountAmount || 0),
          },
        };

        set({ cartInfo: updatedCart });
      },

      updateCartItem: (itemId, updates) => {
        const state = get();
        if (!state.cartInfo?.items) return;

        const updatedItems = state.cartInfo.items.map(item => {
          if (item.id === itemId) {
            return { ...item, ...updates };
          }
          return item;
        });

        const updatedCart: CartInfo = {
          ...state.cartInfo,
          items: updatedItems,
        };

        set({ cartInfo: updatedCart });
      },

      removeCartItem: (itemId) => {
        const state = get();
        if (!state.cartInfo?.items) return;

        const filteredItems = state.cartInfo.items.filter(item => item.id !== itemId);

        const itemsSubtotal = filteredItems.reduce((sum, item) => sum + item.pricing.subtotal, 0);
        const urgencyAmount = state.cartInfo.pricing?.urgencyAmount || 0;
        const discountAmount = state.cartInfo.pricing?.discountAmount || 0;
        
        const updatedCart: CartInfo = {
          ...state.cartInfo,
          items: filteredItems,
          pricing: {
            itemsSubtotal,
            urgencyAmount,
            discountAmount,
            total: itemsSubtotal + urgencyAmount - discountAmount,
          },
        };

        set({ cartInfo: updatedCart });
      },

      getCartItemsCount: () => {
        const state = get();
        return state.cartInfo?.items?.length || 0;
      },
      
      // Computed values
      getTotalAmount: () => {
        const state = get();
        if (!state.cartInfo?.pricing) return 0;
        
        return state.cartInfo.pricing.itemsSubtotal / 100; // Convert from kopiykas to hryvnias
      },
      
      getDiscountAmount: () => {
        const state = get();
        if (!state.cartInfo?.pricing) return 0;
        
        return state.cartInfo.pricing.discountAmount / 100; // Convert from kopiykas to hryvnias
      },
      
      getUrgencyAmount: () => {
        const state = get();
        if (!state.cartInfo?.pricing) return 0;
        
        return state.cartInfo.pricing.urgencyAmount / 100; // Convert from kopiykas to hryvnias
      },
      
      getDebtAmount: () => {
        const state = get();
        return state.getTotalAmount() - state.paidAmount;
      },
      
      getFinalAmount: () => {
        const state = get();
        if (!state.cartInfo?.pricing) return 0;
        
        return state.cartInfo.pricing.total / 100; // Convert from kopiykas to hryvnias  
      },
      
      canSubmitOrder: () => {
        const state = get();
        return !!(
          state.customer &&
          state.cartInfo?.items?.length &&
          state.branchId &&
          state.termsAccepted &&
          state.signature
        );
      },
      
      // Validation methods
      validateCustomer: () => {
        const state = get();
        const errors: string[] = [];
        
        if (!state.customer) {
          errors.push('Клієнт не обраний');
        }
        
        if (!state.branchId) {
          errors.push('Пункт прийому не обраний');
        }
        
        if (!state.orderNumber.trim()) {
          errors.push('Номер замовлення відсутній');
        }
        
        return errors;
      },
      
      validateCart: () => {
        const state = get();
        const errors: string[] = [];
        
        if (!state.cartInfo?.items?.length) {
          errors.push('Кошик порожній');
        }
        
        state.cartInfo?.items?.forEach((item, index) => {
          if (!item.priceListItemId) {
            errors.push(`Предмет ${index + 1}: не обрана послуга`);
          }
          if (item.quantity <= 0) {
            errors.push(`Предмет ${index + 1}: некоректна кількість`);
          }
        });
        
        return errors;
      },
      
      validatePayment: () => {
        const state = get();
        const errors: string[] = [];
        
        if (!state.termsAccepted) {
          errors.push('Умови не прийняті');
        }
        
        if (!state.signature.trim()) {
          errors.push('Підпис відсутній');
        }
        
        if (state.paidAmount < 0) {
          errors.push('Некоректна сума оплати');
        }
        
        return errors;
      },
      
      // Cart API Actions (backend)
      addItemToCartAPI: async (item) => {
        const state = get();
        if (!state.cartId) {
          set({ errors: { ...state.errors, cart: 'Cart ID не знайдено' } });
          return;
        }

        try {
          set({ isLoading: true });
          await addCartItem({
            priceListItemId: item.priceListItemId,
            quantity: item.quantity,
            characteristics: item.characteristics,
            modifierCodes: item.modifierCodes,
          });
          
          // Reload cart from API after adding item
          await get().loadCartFromAPI();
        } catch (error: any) {
          set({ errors: { ...state.errors, cart: error.message || 'Помилка додавання предмета' } });
        } finally {
          set({ isLoading: false });
        }
      },

      updateCartItemAPI: async (itemId, updates) => {
        const state = get();
        try {
          set({ isLoading: true });
          await updateCartItemAPI(itemId, {
            quantity: updates.quantity,
            characteristics: updates.characteristics,
            modifierCodes: updates.modifierCodes,
          });
          
          // Reload cart from API after updating item
          await get().loadCartFromAPI();
        } catch (error: any) {
          set({ errors: { ...state.errors, cart: error.message || 'Помилка оновлення предмета' } });
        } finally {
          set({ isLoading: false });
        }
      },

      removeCartItemAPI: async (itemId) => {
        const state = get();
        try {
          set({ isLoading: true });
          await removeCartItem(itemId);
          
          // Reload cart from API after removing item
          await get().loadCartFromAPI();
        } catch (error: any) {
          set({ errors: { ...state.errors, cart: error.message || 'Помилка видалення предмета' } });
        } finally {
          set({ isLoading: false });
        }
      },

      calculateCartAPI: async () => {
        const state = get();
        try {
          set({ isCalculating: true });
          await calculateCart();
          
          // Reload cart from API after calculation
          await get().loadCartFromAPI();
        } catch (error: any) {
          set({ errors: { ...state.errors, cart: error.message || 'Помилка розрахунку' } });
        } finally {
          set({ isCalculating: false });
        }
      },

      updateCartModifiersAPI: async () => {
        const state = get();
        try {
          set({ isLoading: true });
          await updateCartModifiers({
            urgencyType: state.urgency,
            discountType: state.discountType,
            discountPercentage: state.discountType === 'OTHER' ? state.customDiscountPercent : undefined,
          });
          
          // Reload cart from API after updating modifiers
          await get().loadCartFromAPI();
        } catch (error: any) {
          set({ errors: { ...state.errors, cart: error.message || 'Помилка оновлення модифікаторів' } });
        } finally {
          set({ isLoading: false });
        }
      },

      loadCartFromAPI: async () => {
        try {
          const cartData = await getCart();
          set({ cartInfo: cartData });
        } catch (error: any) {
          set(state => ({ 
            errors: { ...state.errors, cart: error.message || 'Помилка завантаження кошика' } 
          }));
        }
      },

      clearCartAPI: async () => {
        const state = get();
        try {
          set({ isLoading: true });
          await clearCart();
          set({ cartInfo: null, cartId: null });
        } catch (error: any) {
          set({ errors: { ...state.errors, cart: error.message || 'Помилка очищення кошика' } });
        } finally {
          set({ isLoading: false });
        }
      },

      // Utils
      resetWizard: () => set(initialState),
    }),
    {
      name: 'order-wizard-store',
    }
  )
);