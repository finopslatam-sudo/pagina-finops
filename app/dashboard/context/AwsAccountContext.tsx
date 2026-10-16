'use client';

import { createContext, useContext } from 'react';
import { CloudProvider, useCloud } from './CloudContext';

interface AwsAccountContextType {
  selectedAccount: number | null;
  setSelectedAccount: (id: number | null) => void;
}

const AwsAccountContext = createContext<AwsAccountContextType>({
  selectedAccount: null,
  setSelectedAccount: () => {},
});

function AwsAccountBridge({ children }: { children: React.ReactNode }) {
  const { selectedAccountId, setSelectedAccountId, selectedProvider } = useCloud();

  // Si selectedAccountId es numérico o de AWS, devolverlo como number | null
  const selectedAccount =
    selectedAccountId !== null && (selectedProvider === 'all' || selectedProvider === 'aws')
      ? (typeof selectedAccountId === 'number' ? selectedAccountId : Number(selectedAccountId) || null)
      : null;

  const setSelectedAccount = (id: number | null) => {
    setSelectedAccountId(id);
  };

  return (
    <AwsAccountContext.Provider
      value={{
        selectedAccount,
        setSelectedAccount,
      }}
    >
      {children}
    </AwsAccountContext.Provider>
  );
}

export function AwsAccountProvider({ children }: { children: React.ReactNode }) {
  return (
    <CloudProvider>
      <AwsAccountBridge>{children}</AwsAccountBridge>
    </CloudProvider>
  );
}

export function useAwsAccount() {
  return useContext(AwsAccountContext);
}
