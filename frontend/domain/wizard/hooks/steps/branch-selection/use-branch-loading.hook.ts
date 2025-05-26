import { useState, useEffect, useCallback } from 'react';

import { BranchService } from '../../../services/stage-2-branch-services/branch-service';

import type { Branch } from '../../../types';

interface UseBranchLoadingReturn {
  branches: Branch[];
  isLoading: boolean;
  error: string | null;
  loadBranches: (forceRefresh?: boolean) => Promise<void>;
  refreshBranches: () => Promise<void>;
}

/**
 * Хук для завантаження списку філій
 * Забезпечує кешування, обробку помилок та можливість оновлення
 */
export const useBranchLoading = (): UseBranchLoadingReturn => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const branchService = new BranchService();

  const loadBranches = useCallback(
    async (forceRefresh = false) => {
      setIsLoading(true);
      setError(null);

      try {
        // Якщо потрібно примусове оновлення, очищуємо кеш
        if (forceRefresh) {
          branchService.clearCache();
        }

        const result = await branchService.loadActiveBranches();

        if (result.success && result.data) {
          setBranches(result.data);
        } else {
          setError(result.error || 'Помилка завантаження філій');
          setBranches([]);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
        setError(errorMessage);
        setBranches([]);
      } finally {
        setIsLoading(false);
      }
    },
    [branchService]
  );

  const refreshBranches = useCallback(async () => {
    await loadBranches(true);
  }, [loadBranches]);

  // Автоматичне завантаження при монтуванні компонента
  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  return {
    branches,
    isLoading,
    error,
    loadBranches,
    refreshBranches,
  };
};
