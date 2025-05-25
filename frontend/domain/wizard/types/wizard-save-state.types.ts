/**
 * Типи стану збереження wizard - відповідальність за управління збереженням даних
 */

import { SaveStatus } from './wizard-modes.types';

/**
 * Базовий стан збереження
 */
export interface SaveState {
  isDraft: boolean;
  autoSaveEnabled: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

/**
 * Розширений стан збереження
 */
export interface ExtendedSaveState extends SaveState {
  status: SaveStatus;
  saveInProgress: boolean;
  lastSaveAttempt: Date | null;
  saveErrors: string[];
  backupExists: boolean;
  conflictDetected: boolean;
}

/**
 * Конфігурація автозбереження
 */
export interface AutoSaveConfig {
  enabled: boolean;
  intervalMs: number;
  maxRetries: number;
  saveOnBlur: boolean;
  saveOnPageUnload: boolean;
  debounceMs: number;
}

/**
 * Стан синхронізації з сервером
 */
export interface SyncState {
  isOnline: boolean;
  lastSyncTime: Date | null;
  pendingChanges: number;
  syncInProgress: boolean;
  syncErrors: string[];
}

/**
 * Повний стан збереження з синхронізацією
 */
export interface FullSaveState extends ExtendedSaveState {
  autoSaveConfig: AutoSaveConfig;
  syncState: SyncState;
}

/**
 * Метадані збереження
 */
export interface SaveMetadata {
  version: number;
  checksum: string;
  size: number;
  compressed: boolean;
  encrypted: boolean;
}
