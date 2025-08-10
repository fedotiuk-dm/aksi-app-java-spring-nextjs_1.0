import { 
  UpdateCartModifiersRequestDiscountType, 
  UpdateCartModifiersRequestUrgencyType 
} from '@api/cart';

export const getDiscountPercentage = (
  discountType: UpdateCartModifiersRequestDiscountType,
  customPercentage?: number
): number | undefined => {
  switch (discountType) {
    case 'EVERCARD':
    case 'MILITARY':
      return 10;
    case 'SOCIAL_MEDIA':
      return 5;
    case 'OTHER':
      return customPercentage;
    case 'NONE':
      return 0;
    default:
      return undefined;
  }
};

export const generateDiscountOptions = (customPercentage = 0) => {
  return Object.keys(UpdateCartModifiersRequestDiscountType).map(discount => {
    const discountType = discount as UpdateCartModifiersRequestDiscountType;
    const percentage = getDiscountPercentage(discountType, customPercentage);
    
    let label: string;
    switch (discountType) {
      case 'NONE':
        label = 'Без знижки';
        break;
      case 'EVERCARD':
        label = `Еверкард (${percentage}%)`;
        break;
      case 'SOCIAL_MEDIA':
        label = `Соцмережі (${percentage}%)`;
        break;
      case 'MILITARY':
        label = `ЗСУ (${percentage}%)`;
        break;
      case 'OTHER':
        label = 'Інше (власний відсоток)';
        break;
      default:
        label = discount.charAt(0) + discount.slice(1).toLowerCase().replace(/_/g, ' ');
    }

    return { value: discount, label };
  });
};

export const generateUrgencyOptions = () => {
  return Object.keys(UpdateCartModifiersRequestUrgencyType).map(urgency => {
    const urgencyType = urgency as UpdateCartModifiersRequestUrgencyType;
    
    let label: string;
    switch (urgencyType) {
      case 'NORMAL':
        label = 'Звичайне (без націнки)';
        break;
      case 'EXPRESS_48H':
        label = 'Експрес 48 год (+50%)';
        break;
      case 'EXPRESS_24H':
        label = 'Експрес 24 год (+100%)';
        break;
      default:
        label = urgency.charAt(0) + urgency.slice(1).toLowerCase().replace(/_/g, ' ');
    }

    return { value: urgency, label };
  });
};