'use client';

import React from 'react';

import { Branch } from '@/domain/branch';
import { AutocompleteSelector } from '@/shared/ui';

interface BranchSelectorProps {
  availableBranches: Branch[];
  selectedBranch: Branch | null;
  searchResults?: Branch[] | null;
  onSelectBranch: (branch: Branch) => void;
  onSearch: (keyword: string) => Promise<void>;
  onClearSearch: () => void;
  onRefresh: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  showActiveOnly: boolean;
  onToggleActiveFilter: () => Promise<void>;
}

export const BranchSelector: React.FC<BranchSelectorProps> = ({
  availableBranches,
  selectedBranch,
  searchResults,
  onSelectBranch,
  onSearch,
  onClearSearch,
  onRefresh,
  isLoading,
  error,
  showActiveOnly,
  onToggleActiveFilter,
}) => {
  const mapBranchToOption = (branch: Branch) => ({
    id: branch.id,
    label: branch.name,
    subtitle: branch.address,
    extra: branch.phone ? `Тел: ${branch.phone}` : undefined,
    disabled: !branch.active,
    originalBranch: branch,
  });

  const options = availableBranches.map(mapBranchToOption);
  const searchResultOptions = searchResults?.map(mapBranchToOption);
  const selectedOption = selectedBranch ? mapBranchToOption(selectedBranch) : null;

  const handleSelect = (option: any) => {
    onSelectBranch(option.originalBranch);
  };

  return (
    <AutocompleteSelector
      title="Приймальні пункти"
      label="Пошук приймального пункту"
      placeholder="Введіть назву або адресу..."
      options={options}
      selectedOption={selectedOption}
      searchResults={searchResultOptions}
      onSelect={handleSelect}
      onSearch={onSearch}
      onClearSearch={onClearSearch}
      onRefresh={onRefresh}
      isLoading={isLoading}
      error={error}
      showFilter={true}
      filterLabel="Тільки активні"
      filterValue={showActiveOnly}
      onToggleFilter={onToggleActiveFilter}
      noOptionsText="Філій не знайдено"
      searchResultsText="результати пошуку"
    />
  );
};
