import type { AccountRecord, AppState } from '../types';
import { normalizeAppState } from './state';

export const exportAccountJson = (account: AccountRecord) => JSON.stringify(account, null, 2);
export const exportAppJson = (state: AppState) => JSON.stringify(state, null, 2);
export const importAccountJson = (payload: string) => JSON.parse(payload) as AccountRecord;
export const importAppJson = (payload: string) => normalizeAppState(JSON.parse(payload));
