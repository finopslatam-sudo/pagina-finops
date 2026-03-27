import { useState } from 'react';

type Filters = {
  severity: string;
  status: string;
  search: string;
  service: string;
  account: number | '';
  region: string;
};

export function useFindingsFilters(initial?: Partial<Filters>) {
  const [severity, setSeverity] = useState(initial?.severity ?? '');
  const [status, setStatus]     = useState(initial?.status ?? '');
  const [search, setSearch]     = useState(initial?.search ?? '');
  const [service, setService]   = useState(initial?.service ?? '');
  const [account, setAccount]   = useState<number | ''>(initial?.account ?? '');
  const [region, setRegion]     = useState(initial?.region ?? '');

  const handleFiltersChange = (next: Partial<Filters>) => {
    if (next.severity !== undefined) setSeverity(next.severity);
    if (next.status   !== undefined) setStatus(next.status);
    if (next.search   !== undefined) setSearch(next.search);
    if (next.service  !== undefined) setService(next.service);
    if (next.account  !== undefined) setAccount(next.account);
    if (next.region   !== undefined) setRegion(next.region);
  };

  return { severity, status, search, service, account, region, handleFiltersChange };
}
