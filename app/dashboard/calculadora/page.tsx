'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import { SERVICE_LABELS, SERVICES_BY_PROVIDER, PROVIDER_LABELS, type ServiceType, type Provider } from './types';
import { useCalculator } from './hooks/useCalculator';
import Summary from './components/Summary';
import ItemList from './components/ItemList';
import EC2Form from './components/EC2Form';
import RDSForm from './components/RDSForm';
import LambdaForm from './components/LambdaForm';
import S3Form from './components/S3Form';
import EBSForm from './components/EBSForm';
import DynamoDBForm from './components/DynamoDBForm';
import NATForm from './components/NATForm';
import ECSForm from './components/ECSForm';
import CloudWatchForm from './components/CloudWatchForm';
import AzureVMForm from './components/azure/VMForm';
import AzureDiskForm from './components/azure/DiskForm';
import AzureBlobForm from './components/azure/BlobForm';
import AzureSQLForm from './components/azure/SQLForm';
import AzureFunctionsForm from './components/azure/FunctionsForm';
import GCPComputeForm from './components/gcp/ComputeForm';
import GCPDiskForm from './components/gcp/DiskForm';
import GCPStorageForm from './components/gcp/StorageForm';
import GCPSQLForm from './components/gcp/SQLForm';
import GCPFunctionsForm from './components/gcp/FunctionsForm';

const PROVIDERS: Provider[] = ['aws', 'azure', 'gcp'];

export default function CalculadoraPage() {
  const { user } = useAuth();
  const [provider, setProvider] = useState<Provider>('aws');
  const [activeService, setActiveService] = useState<ServiceType>('ec2');
  const { items, addItem, removeItem, clearAll, totalMonthly, totalAnnual, byService } = useCalculator();

  /* ── Enterprise guard ─── */
  if (user && user.plan_code !== 'FINOPS_ENTERPRISE') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-6">
        <div className="text-6xl">🔒</div>
        <h2 className="text-2xl font-bold text-slate-800">Módulo exclusivo Enterprise</h2>
        <p className="text-slate-500 leading-relaxed">
          La Calculadora de Proyectos está disponible únicamente para el plan FinOps Enterprise.
          Simula costos futuros de AWS, Azure y GCP con precios de referencia antes de desplegar
          cualquier arquitectura.
        </p>
        <Link
          href="/dashboard/ClientAdministration"
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-700 transition"
        >
          Ver planes disponibles →
        </Link>
      </div>
    );
  }

  const handleAdd = (service: ServiceType) => (name: string, data: unknown) => {
    addItem(name, { type: service, data } as Parameters<typeof addItem>[1]);
  };

  const handleProviderChange = (p: Provider) => {
    setProvider(p);
    setActiveService(SERVICES_BY_PROVIDER[p][0]);
  };

  const active = SERVICE_LABELS[activeService];
  const services = SERVICES_BY_PROVIDER[provider];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 space-y-8">

      {/* ── HERO ── */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white rounded-3xl p-6 lg:p-10 shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">🧮 Calculadora de Proyectos Multi-Cloud</h1>
            <p className="text-slate-300 mt-2 max-w-2xl text-sm leading-relaxed">
              Simula el costo real de tu arquitectura en AWS, Azure o GCP antes de desplegarla.
              Precios de referencia (On-Demand/Pay-as-you-go). Agrega servicios y obtén el estimado mensual y anual.
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Recursos en proyecto</p>
            <p className="text-4xl font-bold text-white">{items.length}</p>
          </div>
        </div>

        {/* Provider tabs */}
        <div className="flex gap-2 mt-6">
          {PROVIDERS.map((p) => {
            const info = PROVIDER_LABELS[p];
            return (
              <button
                key={p}
                onClick={() => handleProviderChange(p)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                  provider === p
                    ? 'bg-white text-slate-900 border-white'
                    : 'bg-white/10 text-slate-200 border-white/20 hover:bg-white/20'
                }`}
              >
                <span>{info.icon}</span>
                <span>{info.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* LEFT: selector + form */}
        <div className="lg:col-span-2 space-y-6">

          {/* Service tabs */}
          <div className="flex flex-wrap gap-2">
            {services.map(svc => {
              const info = SERVICE_LABELS[svc];
              return (
                <button
                  key={svc}
                  onClick={() => setActiveService(svc)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition ${
                    activeService === svc
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <span>{info.icon}</span>
                  <span className="hidden sm:inline">{info.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active form card */}
          <div className={`border rounded-2xl p-6 ${active.color}`}>
            <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
              <span className="text-xl">{active.icon}</span>
              {active.label}
            </h2>
            {activeService === 'ec2'        && <EC2Form        onAdd={handleAdd('ec2')}        />}
            {activeService === 'rds'        && <RDSForm        onAdd={handleAdd('rds')}        />}
            {activeService === 'lambda'     && <LambdaForm     onAdd={handleAdd('lambda')}     />}
            {activeService === 's3'         && <S3Form         onAdd={handleAdd('s3')}         />}
            {activeService === 'ebs'        && <EBSForm        onAdd={handleAdd('ebs')}        />}
            {activeService === 'dynamodb'   && <DynamoDBForm   onAdd={handleAdd('dynamodb')}   />}
            {activeService === 'nat'        && <NATForm        onAdd={handleAdd('nat')}        />}
            {activeService === 'ecs'        && <ECSForm        onAdd={handleAdd('ecs')}        />}
            {activeService === 'cloudwatch' && <CloudWatchForm onAdd={handleAdd('cloudwatch')} />}

            {activeService === 'azure_vm'        && <AzureVMForm        onAdd={handleAdd('azure_vm')}        />}
            {activeService === 'azure_disk'      && <AzureDiskForm      onAdd={handleAdd('azure_disk')}      />}
            {activeService === 'azure_blob'      && <AzureBlobForm      onAdd={handleAdd('azure_blob')}      />}
            {activeService === 'azure_sql'       && <AzureSQLForm       onAdd={handleAdd('azure_sql')}       />}
            {activeService === 'azure_functions' && <AzureFunctionsForm onAdd={handleAdd('azure_functions')} />}

            {activeService === 'gcp_compute'   && <GCPComputeForm   onAdd={handleAdd('gcp_compute')}   />}
            {activeService === 'gcp_disk'      && <GCPDiskForm      onAdd={handleAdd('gcp_disk')}      />}
            {activeService === 'gcp_storage'   && <GCPStorageForm   onAdd={handleAdd('gcp_storage')}   />}
            {activeService === 'gcp_sql'       && <GCPSQLForm       onAdd={handleAdd('gcp_sql')}       />}
            {activeService === 'gcp_functions' && <GCPFunctionsForm onAdd={handleAdd('gcp_functions')} />}
          </div>

          {/* Items table */}
          <ItemList items={items} onRemove={removeItem} />
        </div>

        {/* RIGHT: summary */}
        <div>
          <Summary
            items={items}
            totalMonthly={totalMonthly}
            totalAnnual={totalAnnual}
            byService={byService}
            onClear={clearAll}
          />
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Precios de referencia aproximados (no en vivo) para las regiones más comunes de cada proveedor.
        Úsalos para estimar magnitudes, no como cotización exacta — los precios reales varían por región,
        compromisos de capacidad y descuentos negociados.
      </p>

    </div>
  );
}
