import type { ReactNode } from 'react';

export interface UserTableColumn<T> {
  key: string;
  header: string;
  align?: 'left' | 'right';
  render: (row: T) => ReactNode;
}

export interface UserTableAction<T> {
  label: string;
  onClick: (row: T) => void;
  show?: (row: T) => boolean;
  variant?: 'primary' | 'danger' | 'success';
}

export type UserFormFieldType = 'text' | 'email' | 'password' | 'select' | 'checkbox';

export interface UserFormFieldOption {
  value: string;
  label: string;
}

export interface UserFormField {
  key: string;
  label: string;
  type: UserFormFieldType;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  disabled?: boolean;
  options?: UserFormFieldOption[];
  visible?: boolean;
}
