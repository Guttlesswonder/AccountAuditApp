import type { AccountRecord } from '../types';

export function HeaderBar({ account, onUpdateMeta, onExportAccount, onExportAll, onImportAccount, onImportAll, onExportExcel, onSnapshot }: {
  account: AccountRecord;
  onUpdateMeta: (patch: Partial<AccountRecord>) => void;
  onExportAccount: () => void;
  onExportAll: () => void;
  onImportAccount: () => void;
  onImportAll: () => void;
  onExportExcel: () => void;
  onSnapshot: () => void;
}) {
  return <header className="space-y-2 rounded border bg-white p-3">
    <div className="grid gap-2 md:grid-cols-4">
      <input className="rounded border p-1" value={account.accountName} onChange={(e) => onUpdateMeta({ accountName: e.target.value })} placeholder="Account Name" />
      <input className="rounded border p-1" value={account.crmRef} onChange={(e) => onUpdateMeta({ crmRef: e.target.value })} placeholder="CRM Ref" />
      <input className="rounded border p-1" value={account.accountManager} onChange={(e) => onUpdateMeta({ accountManager: e.target.value })} placeholder="Account Manager" />
      <input className="rounded border p-1" value={account.segment} onChange={(e) => onUpdateMeta({ segment: e.target.value })} placeholder="Segment" />
    </div>
    <div className="flex flex-wrap gap-2 text-sm">
      <button className="rounded border px-2 py-1" onClick={onExportAccount}>Export account JSON</button>
      <button className="rounded border px-2 py-1" onClick={onExportAll}>Export app JSON</button>
      <button className="rounded border px-2 py-1" onClick={onImportAccount}>Import account JSON</button>
      <button className="rounded border px-2 py-1" onClick={onImportAll}>Import app JSON</button>
      <button className="rounded border px-2 py-1" onClick={onExportExcel}>Export Excel</button>
      <button className="rounded border px-2 py-1" onClick={onSnapshot}>Save Snapshot</button>
    </div>
  </header>;
}
