import { useState, useCallback, useEffect } from 'react';

import { BranchService } from '../../../services/stage-2-branch-services/branch-service';

import type {
  BranchSearchParams,
  BranchSearchResult,
} from '../../../services/stage-2-branch-services/branch-service';
import type { Branch } from '../../../types';

interface UseBranchSearchReturn {
  searchTerm: string;
  searchResults: Branch[];
  isSearching: boolean;
  searchError: string | null;
  hasSearched: boolean;
  setSearchTerm: (term: string) => void;
  performSearch: (params?: Partial<BranchSearchParams>) => Promise<void>;
  clearSearch: () => void;
}

/**
 * Хук для пошуку філій
 * Забезпечує дебаунсинг, фільтрацію та обробку результатів пошуку
 */
export const useBranchSearch = (debounceMs = 300): UseBranchSearchReturn => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Branch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const branchService = new BranchService();

  const performSearch = useCallback(
    async (params: Partial<BranchSearchParams> = {}) => {
      setIsSearching(true);
      setSearchError(null);

      try {
        const searchParams: BranchSearchParams = {
          keyword: searchTerm,
          activeOnly: true,
          includeInactive: false,
          ...params,
        };

        const result = await branchService.searchBranches(searchParams);

        if (result.success && result.data) {
          setSearchResults(result.data.branches);
          setHasSearched(true);
        } else {
          setSearchError(result.error || 'Помилка пошуку філій');
          setSearchResults([]);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
        setSearchError(errorMessage);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [searchTerm, branchService]
  );

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setSearchError(null);
    setHasSearched(false);
  }, []);

  // Дебаунсинг для автоматичного пошуку
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch();
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, debounceMs, performSearch]);

  return {
    searchTerm,
    searchResults,
    isSearching,
    searchError,
    hasSearched,
    setSearchTerm,
    performSearch,
    clearSearch,
  };
};
