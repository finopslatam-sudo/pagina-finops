'use client';

import { useState, useEffect } from "react";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import StepGuide from "./components/StepGuide";
import { Copy, Check } from "lucide-react";


export default function AwsIntegrationPage() {

  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [cloudformationUrl, setCloudformationUrl] = useState<string | null>(null);
  const [externalId, setExternalId] = useState<string | null>(null);
  const [status, setStatus] = useState<"connected" | "pending" | "disconnected">("disconnected");
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [copied, setCopied] = useState(false);


  /* =====================================================
     LOAD STATUS
  ===================================================== */

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {

    try {

      const res = await apiFetch<{
        status: string
      }>("/api/client/aws/status", {
        token
      });

      if (res.status === "connected") {
        setStatus("connected");
      } else {
        setStatus("disconnected");
      }

    } catch {
      setStatus("disconnected");
    }

  };

  /* =====================================================
     LOAD STATUS
  ===================================================== */

  const loadAccountInfo = async () => {

    try {
  
      const res = await apiFetch("/api/client/aws/account", {
        token
      });
  
      if (res.connected) {
        setAccountInfo(res);
      }
  
    } catch (err) {
      console.error(err);
    }
  
  };

  /* =====================================================
     CONNECT AWS
  ===================================================== */

  const handleConnectAws = async () => {

    try {

      setLoading(true);

      const response = await apiFetch<{
        cloudformation_url: string;
        external_id: string;
      }>("/api/client/aws/connect", {
        method: "POST",
        token
      });

      setCloudformationUrl(response.cloudformation_url);
      setExternalId(response.external_id);
      setStatus("pending");

    } catch (error) {

      console.error(error);
      alert("Error generating CloudFormation stack");

    } finally {

      setLoading(false);

    }

  };

  /* =====================================================
     RUN AUDIT
  ===================================================== */

  const runAudit = async () => {

    try {

      setLoading(true);

      await apiFetch("/api/client/audit/run", {
        method: "POST",
        token
      });

      alert("Audit started successfully");

    } catch (error) {

      console.error(error);
      alert("Error running audit");

    } finally {

      setLoading(false);

    }

  };

  /* =====================================================
     STATUS SEMAPHORE
  ===================================================== */

  const statusConfig = {
    connected: {
      label: "Cuenta conectada",
      color: "bg-emerald-100 text-emerald-700",
      dot: "bg-emerald-500"
    },
    pending: {
      label: "Conexión pendiente",
      color: "bg-yellow-100 text-yellow-700",
      dot: "bg-yellow-500"
    },
    disconnected: {
      label: "Cuenta no conectada",
      color: "bg-red-100 text-red-700",
      dot: "bg-red-500"
    }
  };

  const current = statusConfig[status];

  return (

    <div className="max-w-7xl mx-auto px-6 space-y-14">

      {/* ================= HERO ================= */}

      <div className="bg-gradient-to-r from-blue-50 via-white to-white border border-blue-200 rounded-3xl p-10 shadow-sm">

        <h1 className="text-3xl font-bold text-gray-900">
          AWS Integration
        </h1>

        <p className="text-gray-600 mt-4 max-w-4xl leading-relaxed text-lg">
          Conecta tu cuenta de AWS de forma segura mediante un rol de solo lectura.
          Esta integración permite analizar recursos, detectar riesgos FinOps y
          descubrir oportunidades de optimización de costos en tu infraestructura cloud.
        </p>

      </div>

      {/* ================= STATUS CARD ================= */}

      <div className={`p-6 rounded-2xl border ${current.color}`}>

        <div className="flex items-center gap-3">

          <div className={`w-3 h-3 rounded-full ${current.dot}`} />

          <h3 className="text-lg font-semibold">
            {current.label}
          </h3>

        </div>

        <p className="text-sm mt-2 opacity-80">

          {status === "connected" &&
            "FinOpsLatam puede acceder a tu cuenta AWS para auditoría y análisis FinOps."}

          {status === "pending" &&
            "Completa el despliegue de CloudFormation para finalizar la conexión."}

          {status === "disconnected" &&
            "No existe una cuenta AWS conectada a tu organización."}

        </p>

      </div>

      {/* ================= INTEGRATION STEPS ================= */}

      <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">

        <h2 className="text-xl font-semibold">
          Pasos para conectar tu cuenta AWS
        </h2>

        <ol className="space-y-4 text-gray-600 list-decimal ml-6">

          <li>
            Genera el stack de CloudFormation para crear el rol de auditoría seguro.
          </li>

          <li>
          Descargar el archivo YAML.
          </li>

          <li>
            Has click en el hipervinculo "Open AWS CloudFormation".
          </li>

          <li>
            Copia el contenido numeral de "External ID" lo necesitaras mas adelante.
          </li>

          <li>
            Luego sigue los pasos de las imagenes.
          </li>

        </ol>

      </div>


      {/* ================= ACTIONS ================= */}

      <div className="grid md:grid-cols-2 gap-6">

        <ActionCard
        title="Conectar AWS"
        description="Generar stack CloudFormation para integrar tu cuenta."
        button="Connect AWS Account"
        onClick={handleConnectAws}
        loading={loading}
        />

        <ActionCard
        title="Descargar Template"
        description="Descarga el archivo YAML de CloudFormation."
        button="Download YAML"
        link="/api/client/aws/template"
        />

        </div>


      {/* ================= CLOUD FORMATION LINK ================= */}

      {cloudformationUrl && (

        <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">

          <h3 className="font-semibold text-blue-900">
            CloudFormation Stack
          </h3>

          <p className="text-sm mt-2 text-blue-700">
            Abre el siguiente enlace para desplegar el stack en tu cuenta AWS.
          </p>

          <a
            href="https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/create"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline block mt-3"
            >
            Open AWS CloudFormation
            </a>


            {externalId && (

                <div className="flex items-center gap-3">

                <p className="text-lg font-mono font-semibold text-blue-700 break-all">
                {externalId}
                </p>

                <button
                onClick={() => {
                    navigator.clipboard.writeText(externalId ?? "");
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }}
                className="text-gray-500 hover:text-blue-600 transition"
                >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>

                </div>
            
            )}

        </div>

      )}

            {/* ================= STEP GUIDE ================= */}

            <StepGuide />

    </div>

  );

}

/* =====================================================
   ACTION CARD
===================================================== */

function ActionCard({
  title,
  description,
  button,
  onClick,
  loading,
  link
}: any) {

  return (

    <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">

      <h3 className="font-semibold text-lg">
        {title}
      </h3>

      <p className="text-sm text-gray-600">
        {description}
      </p>

      {link ? (

        <button
        onClick={() => {
          const downloadLink = document.createElement("a");
      
          downloadLink.href = "https://api.finopslatam.com/api/client/aws/template";
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