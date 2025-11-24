'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState(null);
  const [auditData, setAuditData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('finops_token');
      if (!token) {
        setDashboardLoading(false);
        return;
      }
      
      // Cargar servicios activos
      const servicesResponse = await fetch('http://api.finopslatam.com/api/protected/services', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setServices(servicesData.data);
      }

      // Cargar auditoría rápida
      const auditResponse = await fetch('http://api.finopslatam.com/api/audit/quick', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (auditResponse.ok) {
        const auditData = await auditResponse.json();
        setAuditData(auditData.results);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setDashboardLoading(false);
    }
  };

  // Función para navegación segura
  const handleNavigation = (path) => {
    router.push(path);
  };

  if (loading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del Dashboard */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Partner Portal
              </h1>
              <p className="text-gray-600 mt-1">
                Bienvenido, {user.contact_name} - {user.company_name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Última actualización: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Métricas Principales */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Tarjeta Servicios Activos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🖥️</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Servicios Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {services?.total_services || '0'}
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta Recursos Totales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Recursos Totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {services?.total_resources || '0'}
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta Ahorro Estimado */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Ahorro Estimado</p>
                <p className="text-2xl font-bold text-gray-900">24%</p>
              </div>
            </div>
          </div>

          {/* Tarjeta Estado */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Estado</p>
                <p className="text-2xl font-bold text-gray-900">Activo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Acciones Rápidas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => handleNavigation('/auditoria')}
              className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <span className="text-2xl mr-3">🔍</span>
              <span>Auditoría Completa</span>
            </button>
            
            <button 
              onClick={() => window.open('http://api.finopslatam.com/api/generate-pdf', '_blank')}
              className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <span className="text-2xl mr-3">📄</span>
              <span>Generar Reporte</span>
            </button>
            
            <button 
              onClick={() => handleNavigation('/costos')}
              className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <span className="text-2xl mr-3">📊</span>
              <span>Análisis Costos</span>
            </button>
            
            <button 
              onClick={() => window.open('http://api.finopslatam.com/api-docs', '_blank')}
              className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">🔧</span>
              <span>API Docs</span>
            </button>
          </div>
        </div>

        {/* Información de Servicios */}
        {services && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Servicios AWS Detectados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(services.breakdown || {}).map(([serviceName, details]) => (
                <div key={serviceName} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900 capitalize">{serviceName}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      details.resource_count > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {details.resource_count} recursos
                    </span>
                  </div>
                  {details.resources && details.resources.length > 0 && (
                    <div className="text-sm text-gray-600">
                      {details.resources.slice(0, 3).map(resource => (
                        <div key={resource.id || resource.name} className="truncate">
                          • {resource.name || resource.id}
                        </div>
                      ))}
                      {details.resources.length > 3 && (
                        <div className="text-gray-500">... y {details.resources.length - 3} más</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}