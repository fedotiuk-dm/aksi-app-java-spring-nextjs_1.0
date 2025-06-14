import { create } from 'zustand';

// Constants
const SUBSTEPS = {
  CLIENT_SEARCH: 'client-search' as const,
  CLIENT_CREATION: 'client-creation' as const,
  BASIC_ORDER_INFO: 'basic-order-info' as const,
} as const;

type SubstepType = (typeof SUBSTEPS)[keyof typeof SUBSTEPS];

interface Stage1WizardState {
  // Session
  sessionId: string | null;

  // Current substep navigation
  currentSubstep: SubstepType;
  completedSubsteps: Set<string>;
  isInitialized: boolean;

  // Client Search state
  searchTerm: string;
  selectedClientId: string | null;

  // Basic Order Info state
  selectedBranchId: string | null;
  receiptNumber: string | null;
  uniqueTag: string;
  isBranchSelected: boolean;
  isUniqueTagScanned: boolean;

  // UI state
  showClientForm: boolean;
  showBasicOrderInfo: boolean;
  validationError: string | null;

  // Actions
  setSessionId: (sessionId: string | null) => void;
  setCurrentSubstep: (substep: SubstepType) => void;
  setIsInitialized: (initialized: boolean) => void;
  markSubstepCompleted: (substep: string) => void;

  // Client Search actions
  setSearchTerm: (term: string) => void;
  setSelectedClientId: (clientId: string | null) => void;

  // Basic Order Info actions
  setSelectedBranchId: (branchId: string | null) => void;
  setReceiptNumber: (receiptNumber: string | null) => void;
  setUniqueTag: (tag: string) => void;
  setIsBranchSelected: (selected: boolean) => void;
  setIsUniqueTagScanned: (scanned: boolean) => void;

  // UI actions
  setShowClientForm: (show: boolean) => void;
  setShowBasicOrderInfo: (show: boolean) => void;
  setValidationError: (error: string | null) => void;

  // Complex actions
  initializeWorkflow: (sessionId: string) => void;
  goToSubstep: (substep: SubstepType) => void;
  selectBranchAndProceed: (branchId: string) => void;
  generateReceiptNumberAndProceed: (receiptNumber: string) => void;
  enterUniqueTagAndComplete: (tag: string) => void;
  completeWorkflow: () => void;

  // Reset
  reset: () => void;
}

export const useStage1WizardStore = create<Stage1WizardState>((set, get) => ({
  // Initial state
  sessionId: null,
  currentSubstep: SUBSTEPS.CLIENT_SEARCH,
  completedSubsteps: new Set(),
  isInitialized: false,

  // Client Search initial state
  searchTerm: '',
  selectedClientId: null,

  // Basic Order Info initial state
  selectedBranchId: null,
  receiptNumber: null,
  uniqueTag: '',
  isBranchSelected: false,
  isUniqueTagScanned: false,

  // UI initial state
  showClientForm: false,
  showBasicOrderInfo: false,
  validationError: null,

  // Basic actions
  setSessionId: (sessionId) => set({ sessionId }),
  setCurrentSubstep: (substep) => set({ currentSubstep: substep }),
  setIsInitialized: (initialized) => set({ isInitialized: initialized }),
  markSubstepCompleted: (substep) => {
    const { completedSubsteps } = get();
    const newCompleted = new Set(completedSubsteps);
    newCompleted.add(substep);
    set({ completedSubsteps: newCompleted });
  },

  // Client Search actions
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedClientId: (clientId) => set({ selectedClientId: clientId }),

  // Basic Order Info actions
  setSelectedBranchId: (branchId) => set({ selectedBranchId: branchId }),
  setReceiptNumber: (receiptNumber) => set({ receiptNumber }),
  setUniqueTag: (tag) => set({ uniqueTag: tag }),
  setIsBranchSelected: (selected) => set({ isBranchSelected: selected }),
  setIsUniqueTagScanned: (scanned) => set({ isUniqueTagScanned: scanned }),

  // UI actions
  setShowClientForm: (show) => set({ showClientForm: show }),
  setShowBasicOrderInfo: (show) => set({ showBasicOrderInfo: show }),
  setValidationError: (error) => set({ validationError: error }),

  // Complex actions
  initializeWorkflow: (sessionId) => {
    set({
      sessionId,
      isInitialized: true,
      currentSubstep: SUBSTEPS.CLIENT_SEARCH,
      completedSubsteps: new Set(),
      validationError: null,
    });
  },

  goToSubstep: (substep) => {
    set({ currentSubstep: substep });
  },

  selectBranchAndProceed: (branchId) => {
    set({
      selectedBranchId: branchId,
      isBranchSelected: true,
    });
  },

  generateReceiptNumberAndProceed: (receiptNumber) => {
    set({
      receiptNumber,
    });
  },

  enterUniqueTagAndComplete: (tag) => {
    set({
      uniqueTag: tag,
      isUniqueTagScanned: true,
    });
  },

  completeWorkflow: () => {
    const { markSubstepCompleted } = get();
    markSubstepCompleted(SUBSTEPS.BASIC_ORDER_INFO);
  },

  // Reset
  reset: () =>
    set({
      sessionId: null,
      currentSubstep: SUBSTEPS.CLIENT_SEARCH,
      completedSubsteps: new Set(),
      isInitialized: false,
      searchTerm: '',
      selectedClientId: null,
      selectedBranchId: null,
      receiptNumber: null,
      uniqueTag: '',
      isBranchSelected: false,
      isUniqueTagScanned: false,
      showClientForm: false,
      showBasicOrderInfo: false,
      validationError: null,
    }),
}));

// Export constants for use in components
export { SUBSTEPS };
