import type { SelectChangeEvent } from '@mui/material/Select';
import { useListBranches } from '@api/branch';
import { useOrderWizardStore } from '@/features/order-wizard';

export const useOrderBasicInfo = () => {
  const { 
    uniqueLabel, 
    setUniqueLabel, 
    selectedBranch, 
    setSelectedBranch 
  } = useOrderWizardStore();

  const { data: branchesData } = useListBranches();

  const handleBranchChange = (event: SelectChangeEvent) => {
    const branchId = event.target.value;
    const branch = branchesData?.data?.find((b) => b.id === branchId) || null;
    setSelectedBranch(branch);
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
    branches: branchesData?.data || [],
    handleBranchChange,
    getCurrentDateTime,
  };
};