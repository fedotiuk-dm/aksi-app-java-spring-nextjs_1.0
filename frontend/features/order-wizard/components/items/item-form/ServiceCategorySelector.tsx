import React from 'react';
import { SelectorField } from '@shared/ui/molecules';
import { useServiceCategoryOperations } from '@features/order-wizard/hooks';

export const ServiceCategorySelector: React.FC = () => {
  const { 
    categoryOptions, 
    selectedCategory,
    handleCategoryChange,
    isLoading 
  } = useServiceCategoryOperations();

  return (
    <SelectorField
      label="Категорія послуги"
      options={categoryOptions}
      placeholder="Виберіть категорію"
      loading={isLoading}
      value={selectedCategory}
      onChange={handleCategoryChange}
    />
  );
};