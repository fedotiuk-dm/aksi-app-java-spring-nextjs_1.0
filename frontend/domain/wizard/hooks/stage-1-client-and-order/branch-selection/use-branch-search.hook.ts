import { useMemo } from 'react';

import { useBranchList } from './use-branch-list.hook';
import { BranchService } from '../../../services/stage-1-client-and-order/branch-selection/branch.service';

const branchService = new BranchService();

/**
 * Хук для пошуку та фільтрації філій
 * Відповідальність: тільки клієнтська фільтрація даних
 */
export const useBranchSearch = (searchTerm: string = '') => {
  const { data: branches = [], isLoading, error } = useBranchList();

  const filteredBranches = useMemo(() => {
    const filtered = branchService.filterBranches(branches, searchTerm);
    return branchService.sortBranches(filtered, 'name');
  }, [branches, searchTerm]);

  return {
    branches: filteredBranches,
    isLoading,
    error,
  };
};
