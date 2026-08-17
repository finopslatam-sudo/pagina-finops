export type CloudProvider = 'aws' | 'azure';

interface Props {
  provider?: CloudProvider | null;
  className?: string;
}

const PROVIDER_STYLES: Record<CloudProvider, { label: string; cls: string; icon: string }> = {
  aws: {
    label: 'AWS',
    cls: 'bg-orange-100 text-orange-700 border border-orange-200',
    icon: '🟠',
  },
  azure: {
    label: 'Azure',
    cls: 'bg-blue-100 text-blue-700 border border-blue-200',
    icon: '🔷',
  },
};

/**
 * Badge de proveedor cloud (AWS/Azure). `provider` es opcional y por
 * defecto no renderiza nada — así los endpoints que todavía no envían
 * este campo (todo AWS hoy) no cambian visualmente.
 */
export default function ProviderBadge({ provider, className = '' }: Props) {
  if (!provider) return null;

  const style = PROVIDER_STYLES[provider];
  if (!style) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${style.cls} ${className}`}
    >
      <span aria-hidden="true">{style.icon}</span>
      {style.label}
    </span>
  );
}
