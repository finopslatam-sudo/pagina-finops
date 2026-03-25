'use client';

import { useState, useCallback } from 'react';
import type { ProjectItem, ServiceConfig } from '../types';
import { calcCost } from '../pricing';

let _id = 1;

export function useCalculator() {
  const [items, setItems] = useState<ProjectItem[]>([]);

  const addItem = useCallback((name: string, config: ServiceConfig) => {
    const monthlyCost = calcCost(config);
    setItems(prev => [...prev, { id: String(_id++), name, config, monthlyCost }]);
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
