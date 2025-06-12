// ЕТАП 1: Схеми для wizard management домену
'use client';

import { z } from 'zod';

// ========== СЕСІЯ ВІЗАРДА ==========
export const wizardSessionStateSchema = z.object({
  sessionId: z.string().nullable(),
  currentStage: z.number().min(1).max(4),
  isActive: z.boolean(),
});

export type WizardSessionState = z.infer<typeof wizardSessionStateSchema>;

// ========== СИСТЕМА ==========
export const wizardSystemStateSchema = z.object({
  isHealthy: z.boolean(),
  systemReady: z.boolean(),
  lastHealthCheck: z.date().nullable(),
});

export type WizardSystemState = z.infer<typeof wizardSystemStateSchema>;

// ========== ЛОКАЛЬНІ СХЕМИ ДЛЯ UI ==========
// Orval API типи використовуються напряму в хуках
