'use client';

import { useAwsAccounts } from '@/app/dashboard/hooks/useAwsAccounts';
import { useAwsAccount } from '@/app/dashboard/context/AwsAccountContext';

export default function AwsAccountSelector() {

  const { accounts } = useAwsAccounts();
  const { selectedAccount, setSelectedAccount } = useAwsAccount();

  return (
    <div className="flex items-center gap-3">

      <span className="text-sm text-gray-500">
        AWS Account
      </span>

      <select
        value={selectedAccount ?? ''}
        onChange={(e) =>
          setSelectedAccount(
            e.target.value === ''
              ? null
              : Number(e.target.value)
          )
        }
        className="border rounded-lg px-3 py-2 text-sm"
      >
        <option value="">All Accounts</option>

        {accounts.map((a: any) => (
          <option key={a.id} value={a.id}>
            {a.account_name}
          </option>
        ))}
      </select>

    </div>
  );
}