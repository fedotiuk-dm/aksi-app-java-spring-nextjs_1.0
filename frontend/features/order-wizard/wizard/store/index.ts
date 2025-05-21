import {
  useClientSelectionStore,
  useBasicInfoStore,
  useItemManagerStore,
  useItemDetailsStore,
  usePriceCalculationStore,
  useNavigationStore,
} from './domains';

/**
 * Тип для композиції всіх сторів Order Wizard
 */
export interface OrderWizardStores {
  clientSelection: ReturnType<typeof useClientSelectionStore>;
  basicInfo: ReturnType<typeof useBasicInfoStore>;
  itemManager: ReturnType<typeof useItemManagerStore>;
  itemDetails: ReturnType<typeof useItemDetailsStore>;
  priceCalculation: ReturnType<typeof usePriceCalculationStore>;
  navigation: ReturnType<typeof useNavigationStore>;
}

/**
 * Хук для доступу до всіх сторів Order Wizard
 * 
 * Використання:
 * const { 
 *   clientSelection, 
 *   basicInfo, 
 *   itemManager, 
 *   itemDetails, 
 *   priceCalculation, 
 *   navigation 
 * } = useOrderWizardStores();
 */
export const useOrderWizardStores = (): OrderWizardStores => {
  return {
    clientSelection: useClientSelectionStore(),
    basicInfo: useBasicInfoStore(),
    itemManager: useItemManagerStore(),
    itemDetails: useItemDetailsStore(),
    priceCalculation: usePriceCalculationStore(),
    navigation: useNavigationStore(),
  };
};

/**
 * Реекспорт всіх доменних сторів для можливості використання як окремо, так і разом
 */
export {
  useClientSelectionStore,
  useBasicInfoStore,
  useItemManagerStore,
  useItemDetailsStore,
  usePriceCalculationStore,
  useNavigationStore,
} from './domains';

/**
 * Реекспорт важливих констант та типів
 */
export {
  ITEM_WIZARD,
  ITEM_MANAGER,
  CLIENT_SELECTION,
  BASIC_INFO_MAIN,
  BASIC_INFO_SUB,
  mainStepsOrder,
  itemSubStepsOrder,
} from './domains/navigationStore';
