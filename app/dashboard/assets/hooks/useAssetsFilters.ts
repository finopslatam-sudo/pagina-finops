'use client';

import { useState, useMemo, useEffect } from 'react';

export type Filters = {
  service:  string;
  region:   string;
  state:    string;
  severity: 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW';
  search:   string;
};

type Resource = {
  resource_id:    string;
  service_name:   string;
  region:         string;
  severity:       'HIGH' | 'MEDIUM' | 'LOW' | null | undefined;
  findings_count: number;
  state?:         { label: string; category: string };
  resource_type:  string;
};

export function useAssetsFilters(resources: Resource[]) {
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [filters, setFilters] = useState<Filters>({
    service: 'ALL', region: 'ALL', state: 'ALL', severity: 'ALL', search: '',
  });

  const uniqueServices = useMemo(
    () => [...new Set(resources.map(r => r.service_name))],
    [resources]
  );
  const uniqueRegions = useMemo(
    () => [...new Set(resources.map(r => r.region))],
    [resources]
  );
  const uniqueStates = useMemo(
    () => [...new Set(resources.map(r => r.state?.label).filter((v): v is string => Boolean(v)))],
    [resources]
  );

  const filteredResources = useMemo(() => resources.filter(r =>
    (filters.service  === 'ALL' || r.service_name  === filters.service)  &&
    (filters.region   === 'ALL' || r.region        === filters.region)   &&
    (filters.state    === 'ALL' || r.state?.label  === filters.state)    &&
    (filters.severity === 'ALL' || r.severity      === filters.severity) &&
    r.resource_id.toLowerCase().includes(filters.search.toLowerCase())
  ), [resources, filters]);

  const totalPages       = Math.max(1, Math.ceil(filteredResources.length / perPage));
  const paginatedResources = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredResources.slice(start, start + perPage);
  }, [filteredResources, page]);

  useEffect(() => { setPage(1); }, [filters]);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  return {
    filters, setFilters,
    filteredResources, paginatedResources,
    page, setPage, totalPages, perPage,
    uniqueServices, uniqueRegions, uniqueStates,
  };
}
