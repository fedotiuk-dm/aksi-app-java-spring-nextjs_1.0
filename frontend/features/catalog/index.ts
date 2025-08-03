/**
 * @fileoverview Catalog feature barrel export
 */

// Store
export { useCatalogStore } from './store/catalog-store';

// Constants
export * from './constants/catalog.constants';

// Hooks
export * from './hooks/use-services';
export * from './hooks/use-items';
export * from './hooks/use-service-items';
export * from './hooks/use-catalog';
export * from './hooks/use-service-form';
export * from './hooks/use-item-form';
export * from './hooks/use-service-item-form';

// TODO: Add components exports when created
// export * from './components/ServiceList';
// export * from './components/ItemList';
// export * from './components/ServiceItemForm';