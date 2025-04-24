/**
 * Константи для характеристик предмета в Order Wizard
 */

// Базові матеріали для різних категорій
export const MATERIALS = {
  // Текстильні вироби
  TEXTILES: [
    { id: 'cotton', name: 'Бавовна' },
    { id: 'wool', name: 'Шерсть' },
    { id: 'silk', name: 'Шовк' },
    { id: 'synthetic', name: 'Синтетика' },
    { id: 'mixed', name: 'Змішана тканина' },
  ],
  
  // Шкіряні вироби
  LEATHER: [
    { id: 'smooth_leather', name: 'Гладка шкіра' },
    { id: 'nubuck', name: 'Нубук' },
    { id: 'split', name: 'Спілок' },
    { id: 'suede', name: 'Замша' },
  ],
  
  // Хутро
  FUR: [
    { id: 'natural_fur', name: 'Натуральне хутро' },
    { id: 'artificial_fur', name: 'Штучне хутро' },
  ],
};

// Карта базових матеріалів за категоріями послуг
export const CATEGORY_MATERIALS_MAP: Record<string, string[]> = {
  // Це будуть заповнені динамічно в компоненті на основі ID категорій
};

// Базова палітра кольорів
export const COLORS = [
  { id: 'white', name: 'Білий', hex: '#FFFFFF' },
  { id: 'black', name: 'Чорний', hex: '#000000' },
  { id: 'gray', name: 'Сірий', hex: '#808080' },
  { id: 'beige', name: 'Бежевий', hex: '#F5F5DC' },
  { id: 'brown', name: 'Коричневий', hex: '#A52A2A' },
  { id: 'red', name: 'Червоний', hex: '#FF0000' },
  { id: 'blue', name: 'Синій', hex: '#0000FF' },
  { id: 'green', name: 'Зелений', hex: '#008000' },
  { id: 'yellow', name: 'Жовтий', hex: '#FFFF00' },
  { id: 'purple', name: 'Фіолетовий', hex: '#800080' },
  { id: 'orange', name: 'Помаранчевий', hex: '#FFA500' },
  { id: 'pink', name: 'Рожевий', hex: '#FFC0CB' },
  { id: 'custom', name: 'Інший (вказати)', hex: '#FFFFFF' },
];

// Типи наповнювачів
export const FILLINGS = [
  { id: 'down', name: 'Пух' },
  { id: 'synthetic', name: 'Синтепон' },
  { id: 'cotton', name: 'Бавовна' },
  { id: 'foam', name: 'Поролон' },
  { id: 'other', name: 'Інше (вказати)' },
];

// Категорії, які потребують вибору наповнювача
export const CATEGORIES_WITH_FILLING = ['coat', 'jacket', 'blanket', 'pillow', 'comforter'];

// Варіанти ступеня зносу
export const WEAR_DEGREE_OPTIONS = [
  { id: 10, name: '10%', description: 'Мінімальний знос' },
  { id: 30, name: '30%', description: 'Середній знос' },
  { id: 50, name: '50%', description: 'Значний знос' },
  { id: 75, name: '75%', description: 'Сильний знос' },
];

// Допоміжна функція для перевірки чи потрібен наповнювач для категорії
export const needsFilling = (categoryId: string | undefined): boolean => {
  if (!categoryId) return false;
  
  // У реальному випадку тут буде перевірка по ID або кеш категорій
  return CATEGORIES_WITH_FILLING.includes(categoryId);
};
