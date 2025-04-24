/**
 * Хуки для отримання атрибутів товарів через OpenAPI
 * Дотримуємось правил проекту - використовуємо тільки реальні дані через OpenAPI
 */
import { useCallback, useState, useEffect } from 'react';
import { 
  ColorDto, 
  WearDegreeDto,
  ItemAttributesService,
  MeasurementUnitDto,
  MaterialDto,
  FillingDto
} from '@/lib/api';

/**
 * Хук для отримання кольорів
 */
export const useColors = () => {
  const [colors, setColors] = useState<ColorDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchColors = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Отримуємо кольори через ItemAttributesService
      const response = await ItemAttributesService.getAllColors();
      setColors(response);
      console.log(`Отримано ${response.length} кольорів через API`);
    } catch (err) {
      console.error('Помилка при отриманні кольорів через API:', err);
      setError('Не вдалося завантажити кольори');
      setColors([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Завантажуємо кольори при ініціалізації
  useEffect(() => {
    fetchColors();
  }, [fetchColors]);

  return {
    colors,
    isLoading,
    error,
    fetchColors
  };
};

/**
 * Хук для отримання ступенів зносу
 */
export const useWearDegrees = () => {
  const [wearDegrees, setWearDegrees] = useState<WearDegreeDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWearDegrees = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Отримуємо ступені зносу через ItemAttributesService
      const response = await ItemAttributesService.getAllWearDegrees();
      setWearDegrees(response);
      console.log(`Отримано ${response.length} ступенів зносу через API`);
    } catch (err) {
      console.error('Помилка при отриманні ступенів зносу через API:', err);
      setError('Не вдалося завантажити ступені зносу');
      setWearDegrees([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Завантажуємо ступені зносу при ініціалізації
  useEffect(() => {
    fetchWearDegrees();
  }, [fetchWearDegrees]);

  return {
    wearDegrees,
    isLoading,
    error,
    fetchWearDegrees
  };
};

/**
 * Хук для отримання одиниць вимірювання
 */
export const useMeasurementUnits = () => {
  const [units, setUnits] = useState<MeasurementUnitDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUnits = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Отримуємо одиниці вимірювання через ItemAttributesService
      const response = await ItemAttributesService.getAllMeasurementUnits();
      setUnits(response);
      console.log(`Отримано ${response.length} одиниць вимірювання через API`);
    } catch (err) {
      console.error('Помилка при отриманні одиниць вимірювання через API:', err);
      setError('Не вдалося завантажити одиниці вимірювання');
      setUnits([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Завантажуємо одиниці вимірювання при ініціалізації
  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  return {
    units,
    isLoading,
    error,
    fetchUnits
  };
};

/**
 * Хук для отримання матеріалів за категорією
 */
export const useMaterialsByCategory = (categoryId: string | undefined) => {
  const [materials, setMaterials] = useState<MaterialDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterials = useCallback(async (categoryId: string) => {
    if (!categoryId) {
      setMaterials([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Отримуємо матеріали за категорією через ItemAttributesService
      const response = await ItemAttributesService.getMaterialsByCategory({
        categoryId: categoryId
      });
      // Перевіряємо, чи response є масивом
      if (Array.isArray(response)) {
        setMaterials(response);
        console.log(`Отримано ${response.length} матеріалів для категорії ${categoryId} через API`);
      } else {
        console.error('Отримано неправильний формат відповіді від API:', response);
        setMaterials([]);
      }
    } catch (err) {
      console.error(`Помилка при отриманні матеріалів для категорії ${categoryId} через API:`, err);
      setError('Не вдалося завантажити матеріали для вибраної категорії');
      setMaterials([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Завантажуємо матеріали при зміні категорії
  useEffect(() => {
    if (categoryId) {
      fetchMaterials(categoryId);
    } else {
      setMaterials([]);
    }
  }, [categoryId, fetchMaterials]);

  return {
    materials,
    isLoading,
    error,
    fetchMaterials
  };
};

/**
 * Хук для перевірки, чи потребує категорія наповнювача
 */
export const useCategoryNeedsFilling = (categoryId: string | undefined) => {
  const [needsFilling, setNeedsFilling] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkNeedsFilling = useCallback(async (categoryId: string) => {
    if (!categoryId) {
      setNeedsFilling(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Перевіряємо необхідність наповнювача через ItemAttributesService
      const response = await ItemAttributesService.doesCategoryNeedFilling({
        categoryId: categoryId
      });
      setNeedsFilling(response);
      console.log(`Категорія ${categoryId} ${response ? 'потребує' : 'не потребує'} наповнювача (API)`);
    } catch (err) {
      console.error(`Помилка при перевірці необхідності наповнювача для категорії ${categoryId}:`, err);
      setError('Не вдалося перевірити необхідність наповнювача');
      setNeedsFilling(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Перевіряємо при зміні категорії
  useEffect(() => {
    if (categoryId) {
      checkNeedsFilling(categoryId);
    } else {
      setNeedsFilling(false);
    }
  }, [categoryId, checkNeedsFilling]);

  return {
    needsFilling,
    isLoading,
    error,
    checkNeedsFilling
  };
};

/**
 * Хук для отримання списку наповнювачів
 */
export const useFillings = () => {
  const [fillings, setFillings] = useState<FillingDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFillings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Отримуємо наповнювачі через ItemAttributesService
      const response = await ItemAttributesService.getAllFillings();
      // Перевіряємо, чи response є масивом
      if (Array.isArray(response)) {
        setFillings(response);
        console.log(`Отримано ${response.length} наповнювачів через API`);
      } else {
        console.error('Отримано неправильний формат відповіді від API:', response);
        setFillings([]);
      }
    } catch (err) {
      console.error('Помилка при отриманні наповнювачів через API:', err);
      setError('Не вдалося завантажити наповнювачі');
      setFillings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Завантажуємо наповнювачі при ініціалізації
  useEffect(() => {
    fetchFillings();
  }, [fetchFillings]);

  return {
    fillings,
    isLoading,
    error,
    fetchFillings
  };
};
