import type { AppStorageProvider } from './types';
import { LocalStorageProvider } from './localStorageProvider';

export const createStorageProvider = (): AppStorageProvider => new LocalStorageProvider();
