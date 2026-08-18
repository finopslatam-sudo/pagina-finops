import { Fragment } from 'react';

const Dash = () => <span className="block text-center text-gray-300 font-bold">—</span>;

type Chip = { text: string; provider: 'aws' | 'azure' | 'gcp' } | null;

const CHIP_STYLES: Record<'aws' | 'azure' | 'gcp', string> = {
  aws: 'bg-orange-50 text-orange-700 border border-orange-200',
  azure: 'bg-blue-50 text-blue-700 border border-blue-200',
  gcp: 'bg-red-50 text-red-700 border border-red-200',
};

const ServiceChip = ({ chip }: { chip: Chip }) => {
  if (!chip) return <Dash />;
  return (
    <span
      className={`inline-block whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-semibold ${CHIP_STYLES[chip.provider]}`}
    >
      {chip.text}
    </span>
  );
};

const aws = (text: string): Chip => ({ text, provider: 'aws' });
const azure = (text: string): Chip => ({ text, provider: 'azure' });
const gcp = (text: string): Chip => ({ text, provider: 'gcp' });

type CoverageRow = { name: string; aws: Chip; azure: Chip; gcp: Chip };
type CoverageGroup = { category: string; items: CoverageRow[] };

const COVERAGE_GROUPS: CoverageGroup[] = [
  {
    category: 'Cómputo',
    items: [
      { name: 'Máquinas virtuales', aws: aws('EC2'), azure: azure('Virtual Machines'), gcp: gcp('Compute Engine') },
    ],
  },
  {
    category: 'Almacenamiento',
    items: [
      { name: 'Bloque (discos)', aws: aws('EBS'), azure: azure('Managed Disks'), gcp: gcp('Persistent Disks') },
      { name: 'Objetos', aws: aws('S3'), azure: azure('Storage Accounts'), gcp: gcp('Cloud Storage') },
      { name: 'Archivos (NFS)', aws: null, azure: null, gcp: gcp('Filestore') },
    ],
  },
  {
    category: 'Bases de Datos',
    items: [
      { name: 'Relacional', aws: aws('RDS · Aurora'), azure: azure('SQL · PostgreSQL · MySQL'), gcp: gcp('Cloud SQL') },
      { name: 'NoSQL / documental', aws: aws('DynamoDB'), azure: azure('Cosmos DB'), gcp: gcp('Firestore') },
      { name: 'Data warehouse', aws: aws('Redshift'), azure: null, gcp: gcp('BigQuery') },
      { name: 'Caché en memoria', aws: aws('ElastiCache'), azure: null, gcp: gcp('Memorystore') },
    ],
  },
  {
    category: 'Contenedores y Serverless',
    items: [
      { name: 'Orquestación', aws: aws('ECS · EKS'), azure: azure('AKS'), gcp: gcp('GKE') },
      { name: 'Contenedores serverless', aws: null, azure: azure('Container Instances'), gcp: gcp('Cloud Run') },
      { name: 'Registro de imágenes', aws: null, azure: azure('Container Registry'), gcp: gcp('Artifact Registry') },
      { name: 'Funciones (FaaS)', aws: aws('Lambda'), azure: azure('Functions'), gcp: gcp('Cloud Functions') },
      { name: 'App hosting administrado', aws: null, azure: azure('App Service'), gcp: null },
    ],
  },
  {
    category: 'Redes',
    items: [
      { name: 'IP pública / estática', aws: aws('Elastic IP'), azure: azure('Public IP'), gcp: gcp('Static IP') },
      { name: 'Balanceo de carga', aws: aws('ALB · NLB · CLB'), azure: azure('Load Balancer · App GW'), gcp: gcp('Load Balancing') },
      { name: 'NAT saliente', aws: aws('NAT Gateway'), azure: azure('NAT Gateway'), gcp: gcp('Cloud NAT') },
      { name: 'Red virtual (VPC)', aws: null, azure: azure('Virtual Network'), gcp: gcp('VPC Networks') },
      { name: 'Firewall / grupos de seguridad', aws: null, azure: azure('Firewall'), gcp: gcp('Firewall Rules') },
      { name: 'CDN', aws: aws('CloudFront'), azure: azure('CDN / Front Door'), gcp: gcp('Cloud CDN') },
      { name: 'DNS administrado', aws: aws('Route53'), azure: azure('Azure DNS'), gcp: gcp('Cloud DNS') },
    ],
  },
  {
    category: 'Mensajería y Datos',
    items: [
      { name: 'Colas / pub-sub', aws: aws('SNS · SQS'), azure: azure('Service Bus'), gcp: gcp('Pub/Sub') },
      { name: 'Streaming', aws: aws('Kinesis'), azure: null, gcp: null },
      { name: 'Búsqueda / analítica de logs', aws: aws('OpenSearch'), azure: null, gcp: null },
      { name: 'Machine Learning', aws: aws('SageMaker'), azure: null, gcp: null },
    ],
  },
  {
    category: 'Seguridad y Gobernanza',
    items: [
      { name: 'Gestión de claves / secretos', aws: null, azure: azure('Key Vault'), gcp: gcp('Cloud KMS') },
      { name: 'Observabilidad / logs', aws: aws('CloudWatch Logs'), azure: azure('Monitor'), gcp: gcp('Cloud Logging') },
    ],
  },
  {
    category: 'Optimización de Costos',
    items: [
      { name: 'Compromisos de capacidad', aws: aws('Reserved Instances · Savings Plans'), azure: null, gcp: null },
    ],
  },
];

export default function CloudCoverageTable() {
  return (
    <div>
      <h4 className="text-xl lg:text-2xl font-bold text-center text-gray-900 mb-2">
        Cobertura por nube: AWS, Azure y GCP
      </h4>
      <p className="text-center text-gray-500 text-sm mb-8 max-w-2xl mx-auto">
        Qué recurso escanea FinOps Latam en cada proveedor, con el nombre real que usa su consola.
        AWS opera de punta a punta; Azure y GCP ya validan cuentas reales y escanean por API,
        con la pantalla de conexión en el dashboard en camino.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr>
              <th className="text-left px-4 sm:px-6 py-4 font-semibold w-2/5 bg-gray-900 text-white rounded-tl-2xl">
                Capacidad
              </th>
              <th className="px-4 py-4 font-semibold text-center bg-orange-600 text-white">
                AWS
              </th>
              <th className="px-4 py-4 font-semibold text-center bg-blue-600 text-white">
                Azure
              </th>
              <th className="px-4 py-4 font-semibold text-center bg-red-600 text-white rounded-tr-2xl">
                GCP
              </th>
            </tr>
          </thead>
          <tbody>
            {COVERAGE_GROUPS.map((group) => (
              <Fragment key={group.category}>
                <tr className="bg-gray-100">
                  <td colSpan={4} className="px-4 sm:px-6 py-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                    {group.category}
                  </td>
                </tr>
                {group.items.map((row) => (
                  <tr key={row.name} className="bg-white odd:bg-gray-50">
                    <td className="px-4 sm:px-6 py-3 text-gray-700 font-medium">{row.name}</td>
                    <td className="px-4 py-3 text-center"><ServiceChip chip={row.aws} /></td>
                    <td className="px-4 py-3 text-center"><ServiceChip chip={row.azure} /></td>
                    <td className="px-4 py-3 text-center"><ServiceChip chip={row.gcp} /></td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-center text-gray-400 text-xs mt-4">
        Un guion significa que el recurso existe en ese proveedor pero todavía no lo escaneamos —
        no es una limitación técnica, es alcance priorizado.
      </p>
    </div>
  );
}
