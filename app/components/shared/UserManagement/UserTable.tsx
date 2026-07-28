'use client';

import type { UserTableAction, UserTableColumn } from './types';

interface Props<T extends { id: number | string }> {
  rows: T[];
  columns: UserTableColumn<T>[];
  actions?: UserTableAction<T>[];
  emptyMessage?: string;
}

const actionVariantClass: Record<string, string> = {
  primary: 'text-blue-600 hover:underline',
  danger: 'text-red-600 hover:underline',
  success: 'text-emerald-600 hover:underline',
};

export function UserTable<T extends { id: number | string }>({
  rows,
  columns,
  actions = [],
  emptyMessage = 'No hay usuarios',
}: Props<T>) {
  if (!rows.length) {
    return <p className="text-sm text-gray-500">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border rounded-lg text-sm">
        <thead>
          <tr className="bg-gray-50 text-left">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-2 ${col.align === 'right' ? 'text-right' : 'text-left'}`}
              >
                {col.header}
              </th>
            ))}
            {actions.length > 0 && <th className="px-4 py-2 text-right">Acciones</th>}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t">
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-2 ${col.align === 'right' ? 'text-right' : ''}`}>
                  {col.render(row)}
                </td>
              ))}

              {actions.length > 0 && (
                <td className="px-4 py-2 text-right space-x-3">
                  {actions
                    .filter((action) => !action.show || action.show(row))
                    .map((action) => (
                      <button
                        key={action.label}
                        onClick={() => action.onClick(row)}
                        className={actionVariantClass[action.variant ?? 'primary']}
                      >
                        {action.label}
                      </button>
                    ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
