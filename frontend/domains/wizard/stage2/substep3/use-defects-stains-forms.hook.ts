/**
 * @fileoverview Форми хук для домену "Дефекти та плями (Substep3)"
 *
 * Відповідальність: тільки управління формами та валідація
 * Принцип: Single Responsibility Principle
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  stainSelectionSchema,
  defectSelectionSchema,
  defectNotesSchema,
  defectsStainsFormSchema,
  riskAssessmentSchema,
  type StainSelectionData,
  type DefectSelectionData,
  type DefectNotesData,
  type DefectsStainsFormData,
  type RiskAssessmentData,
} from './defects-stains.schemas';
import { useDefectsStainsStore } from './defects-stains.store';

/**
 * Хук для управління формами дефектів та плям
 * Інкапсулює всю логіку форм і валідації
 */
export const useDefectsStainsForms = () => {
  const {
    selectedStains,
    customStain,
    selectedDefects,
    customDefect,
    notes,
    hasNoGuarantee,
    noGuaranteeReason,
    hasColorChangeRisk,
    hasDeformationRisk,
    hasDamageRisk,
    riskNotes,
    sessionId,
  } = useDefectsStainsStore();

  // React Hook Form для вибору плям
  const stainForm = useForm<StainSelectionData>({
    resolver: zodResolver(stainSelectionSchema),
    defaultValues: {
      selectedStains: selectedStains || [],
      customStain: customStain || '',
    },
    mode: 'onChange',
  });

  // React Hook Form для вибору дефектів
  const defectForm = useForm<DefectSelectionData>({
    resolver: zodResolver(defectSelectionSchema),
    defaultValues: {
      selectedDefects: selectedDefects || [],
      customDefect: customDefect || '',
    },
    mode: 'onChange',
  });

  // React Hook Form для приміток про дефекти
  const notesForm = useForm<DefectNotesData>({
    resolver: zodResolver(defectNotesSchema),
    defaultValues: {
      notes: notes || '',
      hasNoGuarantee: hasNoGuarantee || false,
      noGuaranteeReason: noGuaranteeReason || '',
    },
    mode: 'onChange',
  });

  // React Hook Form для головної форми
  const mainForm = useForm<DefectsStainsFormData>({
    resolver: zodResolver(defectsStainsFormSchema),
    defaultValues: {
      selectedStains: selectedStains || [],
      customStain: customStain || '',
      selectedDefects: selectedDefects || [],
      customDefect: customDefect || '',
      notes: notes || '',
      hasNoGuarantee: hasNoGuarantee || false,
      noGuaranteeReason: noGuaranteeReason || '',
    },
    mode: 'onChange',
  });

  // React Hook Form для оцінки ризиків
  const riskForm = useForm<RiskAssessmentData>({
    resolver: zodResolver(riskAssessmentSchema),
    defaultValues: {
      hasColorChangeRisk: hasColorChangeRisk || false,
      hasDeformationRisk: hasDeformationRisk || false,
      hasDamageRisk: hasDamageRisk || false,
      riskNotes: riskNotes || '',
    },
    mode: 'onChange',
  });

  // Синхронізація форм з стором
  useEffect(() => {
    stainForm.setValue('selectedStains', selectedStains || []);
    stainForm.setValue('customStain', customStain || '');
    mainForm.setValue('selectedStains', selectedStains || []);
    mainForm.setValue('customStain', customStain || '');
  }, [selectedStains, customStain, stainForm, mainForm]);

  useEffect(() => {
    defectForm.setValue('selectedDefects', selectedDefects || []);
    defectForm.setValue('customDefect', customDefect || '');
    mainForm.setValue('selectedDefects', selectedDefects || []);
    mainForm.setValue('customDefect', customDefect || '');
  }, [selectedDefects, customDefect, defectForm, mainForm]);

  useEffect(() => {
    notesForm.setValue('notes', notes || '');
    notesForm.setValue('hasNoGuarantee', hasNoGuarantee || false);
    notesForm.setValue('noGuaranteeReason', noGuaranteeReason || '');
    mainForm.setValue('notes', notes || '');
    mainForm.setValue('hasNoGuarantee', hasNoGuarantee || false);
    mainForm.setValue('noGuaranteeReason', noGuaranteeReason || '');
  }, [notes, hasNoGuarantee, noGuaranteeReason, notesForm, mainForm]);

  useEffect(() => {
    riskForm.setValue('hasColorChangeRisk', hasColorChangeRisk || false);
    riskForm.setValue('hasDeformationRisk', hasDeformationRisk || false);
    riskForm.setValue('hasDamageRisk', hasDamageRisk || false);
    riskForm.setValue('riskNotes', riskNotes || '');
  }, [hasColorChangeRisk, hasDeformationRisk, hasDamageRisk, riskNotes, riskForm]);

  return {
    // Форма вибору плям
    stains: stainForm,

    // Форма вибору дефектів
    defects: defectForm,

    // Форма приміток
    notes: notesForm,

    // Головна форма
    main: mainForm,

    // Форма оцінки ризиків
    risks: riskForm,
  };
};

export type UseDefectsStainsFormsReturn = ReturnType<typeof useDefectsStainsForms>;
