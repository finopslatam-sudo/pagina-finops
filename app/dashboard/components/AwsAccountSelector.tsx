'use client';

import CloudFilterBar from './CloudFilterBar';

/**
 * CloudAccountSelector (anteriormente AwsAccountSelector).
 * Proporciona visualización de las nubes configuradas (AWS, Azure, GCP),
 * estado de conexión y filtrado dinámico por cuenta/suscripción/proyecto.
 */
export default function AwsAccountSelector() {
  return <CloudFilterBar />;
}

export { CloudFilterBar as CloudAccountSelector };