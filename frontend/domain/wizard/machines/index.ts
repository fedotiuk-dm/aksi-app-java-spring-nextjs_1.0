/**
 * @fileoverview XState v5 Машини - мінімальна навігаційна логіка
 * @module domain/wizard/machines
 *
 * Експортує XState v5 специфічні типи та машину:
 * - Основну машину станів
 * - XState специфічні типи (контекст, події)
 * - Helper типи для навігації та прогресу
 *
 * ПРИМІТКА: Доменні enum'и (WizardStep, ItemWizardStep) експортуються з types/
 */

// === ОСНОВНА XSTATE V5 МАШИНА ===
export { wizardMachine, type WizardMachine } from './wizard-machine';

// === XSTATE СПЕЦИФІЧНІ ТИПИ ===
export {
  type WizardMachineContext, // XState контекст машини
  type WizardMachineEvent, // XState події для машини
  type NavigationDirection, // Helper тип 'next' | 'prev'
  type WizardProgress, // Інтерфейс прогресу
} from './machine-types';
