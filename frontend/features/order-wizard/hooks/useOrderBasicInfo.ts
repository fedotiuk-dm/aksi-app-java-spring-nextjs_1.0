import type { SelectChangeEvent } from '@mui/material/Select';
import { useListBranches } from '@api/branch';
import { useOrderWizardStore } from '@/features/order-wizard';
import { useCustomerState } from './useCustomerState';

export const useOrderBasicInfo = () => {
  const { 
    uniqueLabel, 
    setUniqueLabel
  } = useOrderWizardStore();
  
  const { selectedBranch, selectedBranchId, setSelectedBranchId } = useCustomerState();
  const { data: branchesData } = useListBranches();

  const handleBranchChange = (event: SelectChangeEvent) => {
    const branchId = event.target.value;
    setSelectedBranchId(branchId);
  };

  const handleUniqueLabelChange = (value: string) => {
    setUniqueLabel(value);
  };

  const getCurrentDateTime = () => {
    return new Date().toLocaleString('uk-UA');
  };

  return {
    uniqueLabel,
    handleUniqueLabelChange,
    selectedBranch,
    selectedBranchId,
    branches: branchesData?.data || [],
    handleBranchChange,
    getCurrentDateTime,
  };
};