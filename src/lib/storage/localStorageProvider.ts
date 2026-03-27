import type { AppState } from '../../types';
import { defaultState, normalizeAppState } from '../state';
import type { AppStorageProvider } from './types';

export const STORAGE_KEY = 'strategic-account-audit-v1';

export class LocalStorageProvider implements AppStorageProvider {
  loadState(): AppState {
    if (typeof window === 'undefined') return defaultState();
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    try {
      return normalizeAppState(JSON.parse(raw));
    } catch {
      return defaultState();
    }
  }

  saveState(state: AppState): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}
