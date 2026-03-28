import type { AccountRecord, AppState } from '../types';
import { normalizeAppState } from './state';

export const exportAccountJson = (account: AccountRecord) => JSON.stringify(account, null, 2);
export const exportAppJson = (state: AppState) => JSON.stringify(state, null, 2);

export const importAccountJson = (raw: string): AccountRecord => JSON.parse(raw) as AccountRecord;
export const importAppJson = (raw: string): AppState => normalizeAppState(JSON.parse(raw));
