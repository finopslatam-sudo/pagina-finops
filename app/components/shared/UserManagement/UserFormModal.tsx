'use client';

import type { ReactNode } from 'react';
import type { UserFormField } from './types';

interface Props {
  title: string;
  subtitle?: string;
  fields: UserFormField[];
  extraContent?: ReactNode;
  errorMessage?: string;
  successMessage?: string;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel: string;
  submitting?: boolean;
  submitDisabled?: boolean;
}

export default function UserFormModal({
  title,
  subtitle,
  fields,
  extraContent,
  errorMessage,
  successMessage,
  onClose,
  onSubmit,
  submitLabel,
  submitting = false,
  submitDisabled = false,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 lg:p-8 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {fields
            .filter((field) => field.visible !== false)
            .map((field) => {
              if (field.type === 'checkbox') {
                return (
                  <div key={field.key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      disabled={field.disabled}
                      checked={Boolean(field.value)}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                    <span>{field.label}</span>
                  </div>
                );
              }

              if (field.type === 'select') {
                return (
                  <div key={field.key}>
                    <label className="block text-sm font-medium">{field.label}</label>
                    <select
                      disabled={field.disabled}
                      value={String(field.value)}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
                    >
                      {(field.options ?? []).map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              return (
                <div key={field.key}>
                  <label className="block text-sm font-medium">{field.label}</label>
                  <input
                    type={field.type}
                    disabled={field.disabled}
                    value={String(field.value)}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
                  />
                </div>
              );
            })}

          {extraContent}

          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
          {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting || submitDisabled}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            )}
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
