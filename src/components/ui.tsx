import type { ReactNode } from 'react';
import type { JsonMap } from '../types';

export function Card({ children, title, action }: { children: ReactNode; title?: string; action?: ReactNode }) {
  return <section className="card">{(title || action) && <div className="card-head"><h3>{title}</h3><div>{action}</div></div>}{children}</section>;
}

export function Stat({ label, value, note }: { label: string; value: ReactNode; note?: string }) {
  return <div className="stat"><div className="stat-label">{label}</div><div className="stat-value">{value ?? 0}</div>{note && <div className="stat-note">{note}</div>}</div>;
}

export function Badge({ value }: { value: unknown }) {
  const s = String(value ?? 'unknown').toLowerCase().replaceAll(' ', '_');
  return <span className={`badge badge-${s}`}>{String(value ?? 'Unknown').replaceAll('_', ' ')}</span>;
}

export function Empty({ text = 'No records found.' }: { text?: string }) { return <div className="empty">{text}</div>; }
export function Loading() { return <div className="loading">Loading…</div>; }
export function ErrorBox({ message }: { message: string }) { return <div className="error">{message}</div>; }

export function Table({ rows, columns }: { rows: JsonMap[]; columns: Array<{key: string; label: string; render?: (row: JsonMap) => ReactNode}> }) {
  if (!rows.length) return <Empty />;
  return <div className="table-wrap"><table><thead><tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}</tr></thead><tbody>{rows.map((r,i) => <tr key={String(r.id ?? i)}>{columns.map(c => <td key={c.key}>{c.render ? c.render(r) : String(r[c.key] ?? '—')}</td>)}</tr>)}</tbody></table></div>;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={e => e.stopPropagation()}><div className="modal-head"><h3>{title}</h3><button className="icon-btn" onClick={onClose}>×</button></div>{children}</div></div>;
}

export function PageTitle({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return <div className="page-title"><div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div><div className="page-actions">{actions}</div></div>;
}

export const fmtDate = (v: unknown) => v ? new Date(String(v)).toLocaleString() : '—';
