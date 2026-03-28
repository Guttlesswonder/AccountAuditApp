import type { AccountRecord } from '../types';

export function HeaderBar({ account, onUpdate, onExportAccount, onExportAll, onImportAccount, onImportAll, onExportExcel, onSnapshot }: {
  account: AccountRecord;
  onUpdate: (patch: Partial<AccountRecord>) => void;
  onExportAccount: () => void;
  onExportAll: () => void;
  onImportAccount: () => void;
  onImportAll: () => void;
  onExportExcel: () => void;
  onSnapshot: () => void;
}) {
  return (
    <header className="rounded border bg-white p-3">
      <div className="grid gap-2 md:grid-cols-4">
        <input className="rounded border p-2" value={account.accountName} onChange={(e) => onUpdate({ accountName: e.target.value })} placeholder="Account Name" />
        <input className="rounded border p-2" value={account.crmRef} onChange={(e) => onUpdate({ crmRef: e.target.value })} placeholder="CRM Ref" />
        <input className="rounded border p-2" value={account.accountManager} onChange={(e) => onUpdate({ accountManager: e.target.value })} placeholder="Account Manager" />
        <input className="rounded border p-2" value={account.segment} onChange={(e) => onUpdate({ segment: e.target.value })} placeholder="Segment" />
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-sm">
        <button className="rounded border px-2 py-1" onClick={onExportAccount}>Export Account JSON</button>
        <button className="rounded border px-2 py-1" onClick={onExportAll}>Export App JSON</button>
        <button className="rounded border px-2 py-1" onClick={onImportAccount}>Import Account JSON</button>
        <button className="rounded border px-2 py-1" onClick={onImportAll}>Import App JSON</button>
        <button className="rounded border px-2 py-1" onClick={onExportExcel}>Export Excel</button>
        <button className="rounded border px-2 py-1" onClick={onSnapshot}>Save Snapshot</button>
      </div>
    </header>
  );
}
