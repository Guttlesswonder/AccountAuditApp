export type TermsAttachmentRecord = {
  id: string;
  accountId: string;
  blob: Blob;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
};

export interface TermsAttachmentStore {
  save(record: TermsAttachmentRecord): Promise<void>;
  get(accountId: string): Promise<TermsAttachmentRecord | null>;
  remove(accountId: string): Promise<void>;
}
