import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface OrderListFilters {
  page: number;
  size: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  status?: string;
  search?: string;
}

interface OrderStore {
  filters: OrderListFilters;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setSort: (sortBy: string, sortOrder: 'ASC' | 'DESC') => void;
  setStatus: (status: string | undefined) => void;
  setSearch: (search: string) => void;
  reset: () => void;
  getListParams: () => OrderListFilters;
}

const initialFilters: OrderListFilters = {
  page: 0,
  size: 20,
  sortBy: 'createdAt',
  sortOrder: 'DESC',
  status: undefined,
  search: '',
};

export const useOrderStore = create<OrderStore>()(
  devtools(
    (set, get) => ({
      filters: initialFilters,
      setPage: (page) => set((s) => ({ filters: { ...s.filters, page } })),
      setSize: (size) => set((s) => ({ filters: { ...s.filters, size } })),
      setSort: (sortBy, sortOrder) =>
        set((s) => ({ filters: { ...s.filters, sortBy, sortOrder } })),
      setStatus: (status) => set((s) => ({ filters: { ...s.filters, status } })),
      setSearch: (search) => set((s) => ({ filters: { ...s.filters, search } })),
      reset: () => set({ filters: initialFilters }),
      getListParams: () => get().filters,
    }),
    { name: 'order-store' }
  )
);
