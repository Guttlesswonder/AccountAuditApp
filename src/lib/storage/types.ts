import type { AppState } from '../../types';

export interface AppStorageProvider {
  loadState(): AppState;
  saveState(state: AppState): void;
}
