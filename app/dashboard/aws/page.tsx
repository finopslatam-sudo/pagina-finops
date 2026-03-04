"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

interface AwsStatus {
  connected: boolean;
  account_id?: string;
  role_arn?: string;
  audit_status?: string;
}

export default function AwsIntegrationPage() {

  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);

  const [awsStatus, setAwsStatus] = useState<AwsStatus>({
    connected: false
  });

  const [cloudformationUrl, setCloudformationUrl] = useState<string | null>(null);
  const [externalId, setExternalId] = useState<string | null>(null);

  /* =====================================================
     LOAD AWS STATUS
  ===================================================== */

  const fetchAwsStatus = async () => {

    try {

      const res = await apiFetch<AwsStatus>("/api/client/aws/status", {
        token
      });

      setAwsStatus(res);

    } catch (error) {

      console.error("AWS status error:", error);

    } finally {

      setLoading(false);

    }

  };

  /* =====================================================
     CONNECT AWS
  ===================================================== */

  const handleConnectAws = async () => {

    try {

      setConnecting(true);

      const response = await apiFetch<{
        cloudformation_url: string;
        external_id: string;
      }>("/api/client/aws/connect", {
        method: "POST",
        token
      });

      setCloudformationUrl(response.cloudformation_url);
      setExternalId(response.external_id);

    } catch (error) {

      console.error("Error connecting AWS:", error);
      alert("Error generating CloudFormation link");

    } finally {

      setConnecting(false);

    }

  };

  /* =====================================================
     RUN MANUAL AUDIT
  ===================================================== */

  const runAudit = async () => {

    try {

      setAuditLoading(true);

      await apiFetch("/api/client/audit/run", {
        method: "POST",
        token
      });

      fetchAwsStatus();

    } catch (error) {

      console.error("Audit error:", error);
      alert("Failed to start audit");

    } finally {

      setAuditLoading(false);

    }

  };

  /* =====================================================
     LOAD ON PAGE ENTER
  ===================================================== */

  useEffect(() => {

    if (!token) return;

    fetchAwsStatus();

  }, [token]);

  /* =====================================================
     LOADING STATE
  ===================================================== */

  if (loading) {

    return (

      <div className="p-8">
        Loading AWS integration...
      </div>

    );

  }

  return (

    <div className="p-8 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        AWS Integration
      </h1>

      <div className="bg-white shadow rounded-xl p-6 border">

        {/* =============================================
           AWS CONNECTED
        ============================================= */}

        {awsStatus.connected && (

          <div className="space-y-4">

            <div>

              <span className="text-gray-500 text-sm">
                Status
              </span>

              <div className="text-green-600 font-medium">
                Connected
              </div>

            </div>

            <div>

              <span className="text-gray-500 text-sm">
                AWS Account
              </span>

              <div className="font-medium">
                {awsStatus.account_id}
              </div>

            </div>

            <div>

              <span className="text-gray-500 text-sm">
                Role ARN
              </span>

              <div className="font-mono text-sm">
                {awsStatus.role_arn}
              </div>

            </div>

            <div>

              <span className="text-gray-500 text-sm">
                Last Audit Status
              </span>

              <div className="font-medium">
                {awsStatus.audit_status || "Unknown"}
              </div>

            </div>

            <div className="flex gap-3 pt-4">

              <button
                onClick={runAudit}
                disabled={auditLoading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {auditLoading ? "Running audit..." : "Run Audit"}
              </button>

            </div>

          </div>

        )}

        {/* =============================================
           NOT CONNECTED
        ============================================= */}

        {!awsStatus.connected && (

          <div>

            <p className="text-gray-600 mb-4">
              No AWS account connected.
            </p>

            {!cloudformationUrl && (

              <button
                onClick={handleConnectAws}
                disabled={connecting}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {connecting ? "Generating..." : "Connect AWS Account"}
              </button>

            )}

            {cloudformationUrl && (

              <div className="mt-6">

                <p className="mb-2">
                  Step 1: Open CloudFormation
                </p>

                <a
                  href={cloudformationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Open CloudFormation Stack
                </a>

                <p className="mt-4 text-sm text-gray-600">
                  External ID: {externalId}
                </p>

              </div>

            )}

          </div>

        )}

      </div>

    </div>

  );

}