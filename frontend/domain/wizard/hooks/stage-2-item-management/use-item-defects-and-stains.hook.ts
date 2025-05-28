/**
 * @fileoverview Хук для дефектів та плям (крок 2.3)
 * @module domain/wizard/hooks/stage-2
 */

import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { WizardRiskLevel } from '../../adapters/pricing/types/risk-warning.types';
import { DefectsStainsService } from '../../services/stage-2-item-management';
import { useWizardStore } from '../../store';

/**
 * Хук для дефектів та плям
 * 🧪 Композиція: TanStack Query + Zustand + DefectsStainsService
 */
export const useItemDefectsAndStains = () => {
  // 🏪 Zustand - глобальний стан
  const { addError, addWarning } = useWizardStore();

  // ⚙️ Сервіс
  const defectsService = useMemo(() => new DefectsStainsService(), []);

  // 📋 Завантаження типів плям
  const {
    data: stainTypes = [],
    isLoading: isLoadingStains,
    error: stainsError,
  } = useQuery({
    queryKey: ['stain-types'],
    queryFn: () => defectsService.getAvailableStains(),
    staleTime: 3600000, // 1 година кеш
    gcTime: 7200000, // 2 години в кеші
  });

  // 📋 Завантаження типів дефектів
  const {
    data: defectTypes = [],
    isLoading: isLoadingDefects,
    error: defectsError,
  } = useQuery({
    queryKey: ['defect-types'],
    queryFn: () => defectsService.getAvailableDefects(),
    staleTime: 3600000, // 1 година кеш
    gcTime: 7200000, // 2 години в кеші
  });

  // 📋 Завантаження факторів ризику (використовуємо high risk defects)
  const {
    data: riskFactors = [],
    isLoading: isLoadingRisks,
    error: risksError,
  } = useQuery({
    queryKey: ['risk-factors'],
    queryFn: () => defectsService.getDefectsByRiskLevel(WizardRiskLevel.HIGH),
    staleTime: 3600000, // 1 година кеш
    gcTime: 7200000, // 2 години в кеші
  });

  // 🔍 Методи пошуку
  const searchStains = useCallback(
    (searchTerm: string) => {
      return stainTypes.filter((stain: any) =>
        stain.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    [stainTypes]
  );

  const searchDefects = useCallback(
    (searchTerm: string) => {
      return defectTypes.filter((defect: any) =>
        defect.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    [defectTypes]
  );

  // 🧪 Аналіз ризиків
  const analyzeRisks = useCallback(
    (selectedStains: string[], selectedDefects: string[], material?: string) => {
      const hasHighRisk = defectsService.requiresNoWarranty(selectedDefects);
      const recommendations = defectsService.getRecommendedTreatment(selectedStains);

      if (hasHighRisk) {
        addWarning('Виявлено фактори високого ризику. Рекомендується обережна обробка.');
      }

      return {
        hasHighRisk,
        recommendations,
        requiresNoWarranty: hasHighRisk,
      };
    },
    [defectsService, addWarning]
  );

  // ✅ Валідація
  const validateStains = useCallback(
    (stains: string[]) => {
      return defectsService.validateStainsSelection({ selectedStains: stains });
    },
    [defectsService]
  );

  const validateDefects = useCallback(
    (defects: string[]) => {
      return defectsService.validateDefectsSelection({ selectedDefects: defects });
    },
    [defectsService]
  );

  // 💡 Рекомендації
  const getRecommendations = useCallback(
    (stains: string[], defects: string[], material?: string) => {
      const treatmentRecommendations = defectsService.getRecommendedTreatment(stains);
      const compatibleTreatments = material
        ? treatmentRecommendations.filter((treatment) =>
            defectsService.isTreatmentCompatible(treatment, material)
          )
        : treatmentRecommendations;

      return {
        treatments: compatibleTreatments,
        requiresNoWarranty: defectsService.requiresNoWarranty(defects),
      };
    },
    [defectsService]
  );

  // 📊 Статус завантаження та помилки
  const loadingStatus = useMemo(
    () => ({
      isLoading: isLoadingStains || isLoadingDefects || isLoadingRisks,
      hasErrors: !!(stainsError || defectsError || risksError),
      errors: [stainsError, defectsError, risksError].filter(Boolean),
    }),
    [isLoadingStains, isLoadingDefects, isLoadingRisks, stainsError, defectsError, risksError]
  );

  return {
    // 📋 Дані
    stainTypes,
    defectTypes,
    riskFactors,

    // 🔄 Стани завантаження
    isLoadingStains,
    isLoadingDefects,
    isLoadingRisks,
    loadingStatus,

    // ❌ Помилки
    stainsError,
    defectsError,
    risksError,

    // 🔍 Методи пошуку
    searchStains,
    searchDefects,

    // 🧪 Аналіз ризиків
    analyzeRisks,

    // ✅ Валідація
    validateStains,
    validateDefects,

    // 💡 Рекомендації
    getRecommendations,
  };
};
