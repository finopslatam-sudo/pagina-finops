'use client';

import { Copy, Check } from "lucide-react";

interface Props {
  cloudformationUrl: string | null;
  externalId: string | null;
  accountId: string;
  copied: boolean;
  loading: boolean;
  templateDownloadUrl: string;
  onAccountIdChange: (value: string) => void;
  onCopy: () => void;
  onConnectAws: () => void;
  onValidate: () => void;
}

function ActionCard({
  title,
  description,
  button,
  onClick,
  loading,
  link,
}: {
  title: string;
  description: string;
  button: string;
  onClick?: () => void;
  loading?: boolean;
  link?: string;
}) {
  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      {link ? (
        <button
          onClick={() => {
            const downloadLink = document.createElement("a");
            downloadLink.href = link;
            downloadLink.download = "finopslatam-cloudformation.yaml";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {button}
        </button>
      ) : (
        <button
          onClick={onClick}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Processing..." : button}
        </button>
      )}
    </div>
  );
}

export default function AccountForm({
  cloudformationUrl,
  externalId,
  accountId,
  copied,
  loading,
  templateDownloadUrl,
  onAccountIdChange,
  onCopy,
  onConnectAws,
  onValidate,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Action cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <ActionCard
          title="Conectar AWS"
          description="Generar stack CloudFormation para integrar tu cuenta."
          button="Create External ID"
          onClick={onConnectAws}
          loading={loading}
        />
        <ActionCard
          title="Descargar Template"
          description="Descarga el archivo YAML de CloudFormation."
          button="Download YAML"
          link={templateDownloadUrl}
        />
      </div>

      {/* CloudFormation link + External ID + Account ID input */}
      {cloudformationUrl && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
          <h3 className="font-semibold text-blue-900">CloudFormation Stack</h3>
          <p className="text-sm mt-2 text-blue-700">
            Abre el siguiente enlace para desplegar el stack en tu cuenta AWS.
          </p>
          <a
            href={cloudformationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline block mt-3"
          >
            Link AWS CloudFormation
          </a>

          {externalId && (
            <div className="mt-5">
              <div className="border-t border-blue-200 my-4" />

              <p className="text-xs font-semibold text-blue-900 tracking-wide">
                EXTERNAL ID:
              </p>

              <div className="flex items-center gap-3 mt-2">
                <p className="text-lg font-mono font-semibold text-blue-700 break-all">
                  {externalId}
                </p>
                <button
                  onClick={onCopy}
                  className="text-gray-500 hover:text-blue-600 transition"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold text-blue-900 tracking-wide">
                  AWS ACCOUNT ID
                </p>
                <input
                  type="text"
                  placeholder="123456789012"
                  value={accountId}
                  onChange={(e) => onAccountIdChange(e.target.value)}
                  className="border rounded px-3 py-2 w-72 mt-2"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Validate button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={onValidate}
          className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700"
        >
          Probar conexión
        </button>
      </div>
    </div>
  );
}
