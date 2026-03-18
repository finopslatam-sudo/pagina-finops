'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface AwsAccountContextType {
  selectedAccount: number | null;
  setSelectedAccount: (id: number | null) => void;
}

const AwsAccountContext = createContext<AwsAccountContextType>({
  selectedAccount: null,
  setSelectedAccount: () => {}
});

export function AwsAccountProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [selectedAccount, setSelectedAccountState] = useState<number | null>(null);

  useEffect(() => {
    setSelectedAccountState(null);
  }, [pathname]);

  const setSelectedAccount = (id: number | null) => {
    setSelectedAccountState(id);
  };

  return (
    <AwsAccountContext.Provider
      value={{
        selectedAccount,
        setSelectedAccount
      }}
    >
      {children}
    </AwsAccountContext.Provider>
  );
}

export function useAwsAccount() {
  return useContext(AwsAccountContext);
}
