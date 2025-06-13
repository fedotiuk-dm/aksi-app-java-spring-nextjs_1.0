// 🎯 Константи та маппінг для Stage1 Order Wizard
// Винесено з UI компонентів для повторного використання

// 📋 Константи підетапів Stage1 - СПРОЩЕНА ЛОГІКА
export const STAGE1_SUBSTEPS = {
  CLIENT_SELECTION: 'client-selection', // Пошук або створення клієнта
  BRANCH_SELECTION: 'branch-selection', // Вибір філії та створення ордера
} as const;

export const STAGE1_SUBSTEP_NAMES = {
  'client-selection': 'Вибір або створення клієнта',
  'branch-selection': 'Вибір філії та створення замовлення',
} as const;

// 📋 Режими роботи з клієнтом
export const CLIENT_MODES = {
  SEARCH: 'search',
  CREATE: 'create',
} as const;

export type Stage1Substep = (typeof STAGE1_SUBSTEPS)[keyof typeof STAGE1_SUBSTEPS];
export type ClientMode = (typeof CLIENT_MODES)[keyof typeof CLIENT_MODES];

// 📋 Константи для клієнтського пошуку
export const CLIENT_SEARCH_CRITERIA = {
  PHONE: 'phone',
  NAME: 'name',
  EMAIL: 'email',
  ADDRESS: 'address',
} as const;

export const CLIENT_SEARCH_CRITERIA_NAMES = {
  phone: 'Телефон',
  name: "Ім'я та прізвище",
  email: 'Email',
  address: 'Адреса',
} as const;

// 📋 Константи способів зв'язку
export const CONTACT_METHODS = {
  PHONE: 'PHONE',
  SMS: 'SMS',
  VIBER: 'VIBER',
} as const;

export const CONTACT_METHOD_NAMES = {
  PHONE: 'Телефонний дзвінок',
  SMS: 'SMS повідомлення',
  VIBER: 'Viber',
} as const;

// 📋 Константи джерел інформації
export const INFO_SOURCES = {
  INSTAGRAM: 'INSTAGRAM',
  GOOGLE: 'GOOGLE',
  RECOMMENDATIONS: 'RECOMMENDATIONS',
  OTHER: 'OTHER',
} as const;

export const INFO_SOURCE_NAMES = {
  INSTAGRAM: 'Instagram',
  GOOGLE: 'Google',
  RECOMMENDATIONS: 'Рекомендації',
  OTHER: 'Інше',
} as const;

// 🎨 Допоміжні функції для UI
export const getSubstepProgress = (currentSubstep: Stage1Substep): number => {
  switch (currentSubstep) {
    case STAGE1_SUBSTEPS.CLIENT_SELECTION:
      return 50; // 50% - клієнт обраний/створений
    case STAGE1_SUBSTEPS.BRANCH_SELECTION:
      return 100; // 100% - філія обрана, ордер створений
    default:
      return 0;
  }
};

export const isSubstepCompleted = (
  substep: Stage1Substep,
  currentSubstep: Stage1Substep
): boolean => {
  const substeps = Object.values(STAGE1_SUBSTEPS);
  const substepIndex = substeps.indexOf(substep);
  const currentIndex = substeps.indexOf(currentSubstep);
  return substepIndex < currentIndex;
};

export const isSubstepActive = (substep: Stage1Substep, currentSubstep: Stage1Substep): boolean => {
  return substep === currentSubstep;
};

export const canNavigateToSubstep = (
  targetSubstep: Stage1Substep,
  currentSubstep: Stage1Substep
): boolean => {
  // Завжди можна повернутися до вибору клієнта
  if (targetSubstep === STAGE1_SUBSTEPS.CLIENT_SELECTION) {
    return true;
  }

  // До вибору філії можна перейти тільки після вибору клієнта
  if (targetSubstep === STAGE1_SUBSTEPS.BRANCH_SELECTION) {
    return currentSubstep === STAGE1_SUBSTEPS.CLIENT_SELECTION;
  }

  return false;
};

// 🔄 Маппінг для валідації форм
export const getRequiredFieldsForSubstep = (substep: Stage1Substep): string[] => {
  switch (substep) {
    case STAGE1_SUBSTEPS.CLIENT_SELECTION:
      return ['selectedClientId']; // Потрібен обраний клієнт
    case STAGE1_SUBSTEPS.BRANCH_SELECTION:
      return ['selectedBranchId']; // Потрібна обрана філія
    default:
      return [];
  }
};

// 🎯 Допоміжні функції для валідації
export const validatePhoneNumber = (phone: string): boolean => {
  // Простий regex для українських номерів
  const phoneRegex = /^(\+38)?[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatPhoneNumber = (phone: string): string => {
  // Форматування телефону для відображення
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+38 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8)}`;
  }
  return phone;
};

// 🔍 Функції для роботи з пошуком клієнтів
export const buildSearchCriteria = (searchTerm: string, searchType: string) => {
  return {
    searchTerm: searchTerm.trim(),
    searchType,
    limit: 10, // Обмеження результатів пошуку
  };
};

export const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm.trim()) return text;

  const regex = new RegExp(`(${searchTerm.trim()})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

// 🔍 Додаткові функції для пошуку клієнтів
export const getSearchCriteriaName = (criteria: string): string => {
  return (
    CLIENT_SEARCH_CRITERIA_NAMES[criteria as keyof typeof CLIENT_SEARCH_CRITERIA_NAMES] || criteria
  );
};

export const isValidSearchTerm = (term: string): boolean => {
  return term.trim().length >= 2; // Мінімум 2 символи для пошуку
};

// 🎯 Допоміжні функції для роботи з підетапами
export const getSubstepName = (substep: Stage1Substep): string => {
  return STAGE1_SUBSTEP_NAMES[substep] || substep;
};

export const isValidSubstep = (substep: string): substep is Stage1Substep => {
  return Object.values(STAGE1_SUBSTEPS).includes(substep as Stage1Substep);
};

// 📞 Допоміжні функції для способів зв'язку
export const getContactMethodName = (method: string): string => {
  return CONTACT_METHOD_NAMES[method as keyof typeof CONTACT_METHOD_NAMES] || method;
};

export const isValidContactMethod = (
  method: string
): method is (typeof CONTACT_METHODS)[keyof typeof CONTACT_METHODS] => {
  return (Object.values(CONTACT_METHODS) as string[]).includes(method);
};

// 📢 Допоміжні функції для джерел інформації
export const getInfoSourceName = (source: string): string => {
  return INFO_SOURCE_NAMES[source as keyof typeof INFO_SOURCE_NAMES] || source;
};

export const isValidInfoSource = (
  source: string
): source is (typeof INFO_SOURCES)[keyof typeof INFO_SOURCES] => {
  return (Object.values(INFO_SOURCES) as string[]).includes(source);
};
