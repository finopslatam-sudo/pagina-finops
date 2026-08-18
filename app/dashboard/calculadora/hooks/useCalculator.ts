'use client';

import { useState, useCallback } from 'react';
import type { ProjectItem, ServiceConfig } from '../types';
import { providerOf } from '../types';
import { calcCost } from '../pricing';
import { calcAzureCost } from '../azure-pricing';
import { calcGCPCost } from '../gcp-pricing';
import type { AzureServiceConfig } from '../azure-types';
import type { GCPServiceConfig } from '../gcp-types';

let _id = 1;

function resolveCost(config: ServiceConfig): number {
  const provider = providerOf(config.type);
  if (provider === 'azure') return calcAzureCost(config as AzureServiceConfig);
  if (provider === 'gcp') return calcGCPCost(config as GCPServiceConfig);
  return calcCost(config);
}

export function useCalculator() {
  const [items, setItems] = useState<ProjectItem[]>([]);

  const addItem = useCallback((name: string, config: ServiceConfig) => {
    const monthlyCost = resolveCost(config);
    const provider = providerOf(config.type);
    setItems(prev => [...prev, { id: String(_id++), name, provider, config, monthlyCost }]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearAll = useCallback(() => setItems([]), []);

  const totalMonthly = items.reduce((s, i) => s + i.monthlyCost, 0);
  const totalAnnual  = totalMonthly * 12;

  const byService = items.reduce((acc, item) => {
    const t = item.config.type;
    acc[t] = (acc[t] ?? 0) + item.monthlyCost;
    return acc;
  }, {} as Record<string, number>);

  return { items, addItem, removeItem, clearAll, totalMonthly, totalAnnual, byService };
}
