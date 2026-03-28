import type { TermsAttachmentRecord, TermsAttachmentStore } from './types';

const DB_NAME = 'strategic-account-audit-attachments-v1';
const STORE_NAME = 'terms_pdf';

const openDb = async () =>
  await new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'accountId' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

export class IndexedDbTermsStore implements TermsAttachmentStore {
  async save(record: TermsAttachmentRecord): Promise<void> {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async get(accountId: string): Promise<TermsAttachmentRecord | null> {
    const db = await openDb();
    return await new Promise<TermsAttachmentRecord | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(accountId);
      req.onsuccess = () => resolve((req.result as TermsAttachmentRecord | undefined) ?? null);
      req.onerror = () => reject(req.error);
    });
  }

  async remove(accountId: string): Promise<void> {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(accountId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}

export const termsStore = new IndexedDbTermsStore();
