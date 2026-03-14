'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface AwsAccountContextType {
  selectedAccount: number | null;
  setSelectedAccount: (id: number | null) => void;
}

const AwsAccountContext = createContext<AwsAccountContextType>({
  selectedAccount: null,
  setSelectedAccount: () => {}
});

export function AwsAccountProvider({ children }: { children: React.ReactNode }) {

  const [selectedAccount, setSelectedAccountState] = useState<number | null>(null);

  /* =====================================================
     LOAD FROM LOCAL STORAGE
  ===================================================== */

  useEffect(() => {

    const saved = localStorage.getItem('selectedAwsAccount');

    if (saved) {
      setSelectedAccountState(Number(saved));
    }

  }, []);

  /* =====================================================
     SAVE TO LOCAL STORAGE
  ===================================================== */

  const setSelectedAccount = (id: number | null) => {

    setSelectedAccountState(id);

    if (id === null) {
      localStorage.removeItem('selectedAwsAccount');
    } else {
      localStorage.setItem('selectedAwsAccount', String(id));
    }

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