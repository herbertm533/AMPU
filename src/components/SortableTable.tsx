import { useMemo, useState } from 'react';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortValue?: (row: T) => number | string;
  className?: string;
}

interface Props<T> {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  initialSort?: { key: string; dir: 'asc' | 'desc' };
  onRowClick?: (row: T) => void;
  highlightRow?: (row: T) => boolean;
  pageSize?: number;
}

export function SortableTable<T>({ rows, columns, rowKey, initialSort, onRowClick, highlightRow, pageSize = 50 }: Props<T>): JSX.Element {
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av < bv) return sort.dir === 'asc' ? -1 : 1;
      if (av > bv) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [rows, sort, columns]);

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows = sorted.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700/50 border-b border-slate-300 dark:border-slate-700">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => {
                    if (!col.sortValue) return;
                    setSort((prev) => {
                      if (prev?.key === col.key) {
                        return { key: col.key, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
                      }
                      return { key: col.key, dir: 'desc' };
                    });
                  }}
                  className={`th-sort px-2 py-1.5 text-left font-semibold text-xs uppercase tracking-wide ${col.className ?? ''}`}
                >
                  {col.label}
                  {sort?.key === col.key && <span className="ml-1 text-slate-400">{sort.dir === 'asc' ? '▲' : '▼'}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`${onRowClick ? 'cursor-pointer' : ''} ${
                  highlightRow?.(row) ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''
                } hover:bg-slate-50 dark:hover:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700/50`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-2 py-1 ${col.className ?? ''}`}>
                    {col.render ? col.render(row) : (col.sortValue ? String(col.sortValue(row)) : '')}
                  </td>
                ))}
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr><td className="px-2 py-3 text-center text-slate-400" colSpan={columns.length}>No data</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-between p-2 text-xs border-t border-slate-300 dark:border-slate-700">
          <span>{sorted.length} rows</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 disabled:opacity-30">Prev</button>
            <span>Page {page + 1} of {pages}</span>
            <button onClick={() => setPage((p) => Math.min(pages - 1, p + 1))} disabled={page === pages - 1} className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 disabled:opacity-30">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
