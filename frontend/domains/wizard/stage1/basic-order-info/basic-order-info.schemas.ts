/**
 * @fileoverview Схеми для домену "Основна інформація про замовлення"
 *
 * Експортує готові Orval схеми та локальні UI форми для роботи з основною інформацією замовлення
 */

import { z } from 'zod';

// Імпорт типів з API
import type { BranchLocationDTO } from '@/shared/api/generated/wizard/aksiApi.schemas';

// Експорт готових Zod схем з Orval
export {
  // Basic Order Data schemas
  stage1GetBasicOrderData200Response as BasicOrderDataSchema,
  stage1UpdateBasicOrderBody as UpdateBasicOrderSchema,

  // Basic Order State schemas
  stage1GetBasicOrderState200Response as BasicOrderStateSchema,

  // Branch Selection schemas
  stage1SelectBranchQueryParams as BranchSelectionParamsSchema,

  // Branch API schemas
  stage1GetBranchesForSession200Response as BranchesApiResponseSchema,
  stage1AreBranchesLoaded200Response as BranchesLoadedStatusSchema,

  // Validation schemas
  stage1ValidateBasicOrder200Response as BasicOrderValidationSchema,

  // Initialization schemas
  stage1InitializeBasicOrder200Response as InitializeBasicOrderSessionSchema,
} from '@/shared/api/generated/wizard/zod/aksiApi';

// Локальні UI схеми для форм
export const basicOrderUIFormSchema = z.object({
  receiptNumber: z
    .string()
    .min(1, "Номер чеку обов'язковий")
    .max(20, 'Номер чеку не може бути довше 20 символів')
    .regex(/^[A-Z0-9-]+$/, 'Тільки великі літери, цифри та дефіси'),
  uniqueTag: z.string().max(50, 'Унікальний тег не може бути довше 50 символів'),
  selectedBranchId: z.string().uuid('Оберіть філію'),
  description: z.string().max(500, 'Опис не може бути довше 500 символів'),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH']),
  notes: z.string().max(1000, 'Примітки не можуть бути довше 1000 символів'),
});

export type BasicOrderUIFormData = z.infer<typeof basicOrderUIFormSchema>;

// Схема для вибору філії
export const branchSelectionUIFormSchema = z.object({
  selectedBranchId: z.string().uuid('Оберіть філію'),
  searchTerm: z.string().max(100, 'Пошуковий запит занадто довгий').optional().or(z.literal('')),
});

export type BranchSelectionUIFormData = z.infer<typeof branchSelectionUIFormSchema>;

// Схема стану workflow
export const workflowStateSchema = z.object({
  isActive: z.boolean(),
  sessionId: z.string().uuid().nullable(),
  isDirty: z.boolean(),
  currentStep: z.enum([
    'init',
    'generating_receipt',
    'receipt_generated',
    'entering_tag',
    'tag_entered',
    'selecting_branch',
    'branch_selected',
    'completed',
  ]),
  canProceed: z.boolean(),
});

export type WorkflowStateData = z.infer<typeof workflowStateSchema>;

// Локальна схема для даних філії (для UI відображення)
export const branchDisplaySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  code: z.string(),
  address: z.string().optional(),
  phone: z.string().optional(),
  workingHours: z.string().optional(),
  isActive: z.boolean(),
});

export type BranchDisplayData = z.infer<typeof branchDisplaySchema>;

// ========== ФУНКЦІЇ ДЛЯ РОБОТИ З ФІЛІЯМИ ==========

/**
 * Перетворює API дані філії в UI формат
 */
export const transformApiBranchToDisplay = (apiBranch: BranchLocationDTO): BranchDisplayData => {
  return branchDisplaySchema.parse({
    id: apiBranch.id || '',
    name: apiBranch.name || '',
    code: apiBranch.code || '',
    address: apiBranch.address,
    phone: apiBranch.phone,
    isActive: apiBranch.active ?? true,
  });
};

/**
 * Перетворює масив API філій в UI формат
 */
export const transformApiBranchesToDisplay = (
  apiBranches: BranchLocationDTO[]
): BranchDisplayData[] => {
  if (!Array.isArray(apiBranches)) return [];

  return apiBranches
    .map((branch) => {
      try {
        return transformApiBranchToDisplay(branch);
      } catch (error) {
        console.warn('Invalid branch data:', branch, error);
        return null;
      }
    })
    .filter((branch): branch is BranchDisplayData => branch !== null);
};

/**
 * Валідує дані філії перед відправкою на сервер
 */
export const validateBranchSelection = (branchId: string): { isValid: boolean; error?: string } => {
  try {
    z.string().uuid().parse(branchId);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Некоректний ID філії' };
  }
};

/**
 * Знаходить філію за ID серед доступних
 */
export const findBranchById = (
  branches: BranchDisplayData[],
  branchId: string
): BranchDisplayData | null => {
  return branches.find((branch) => branch.id === branchId) || null;
};

/**
 * Фільтрує філії за пошуковим запитом
 */
export const filterBranchesBySearch = (
  branches: BranchDisplayData[],
  searchTerm: string
): BranchDisplayData[] => {
  if (!searchTerm.trim()) return branches;

  const term = searchTerm.toLowerCase();
  return branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(term) ||
      (branch.address && branch.address.toLowerCase().includes(term))
  );
};

/**
 * Отримує активні філії
 */
export const getActiveBranches = (branches: BranchDisplayData[]): BranchDisplayData[] => {
  return branches.filter((branch) => branch.isActive);
};
