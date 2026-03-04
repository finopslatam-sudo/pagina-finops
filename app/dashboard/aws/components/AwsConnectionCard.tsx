"use client";

interface Props {
  connected: boolean;
  accountId?: string;
  roleArn?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  onRunAudit: () => void;
  loading?: boolean;
}

export default function AwsConnectionCard({
  connected,
  accountId,
  roleArn,
  onConnect,
  onDisconnect,
  onRunAudit,
  loading
}: Props) {

  return (

    <div className="bg-white shadow rounded-xl p-6 border">

      <h2 className="text-xl font-semibold mb-4">
        AWS Account
      </h2>

      {!connected && (

        <div>

          <p className="text-gray-600 mb-4">
            No AWS account connected.
          </p>

          <button
            onClick={onConnect}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Connect AWS Account
          </button>

        </div>

      )}

      {connected && (

        <div className="space-y-3">

          <div>

            <span className="text-gray-500 text-sm">
              Status
            </span>

            <div className="font-medium text-green-600">
              Connected
            </div>

          </div>

          <div>

            <span className="text-gray-500 text-sm">
              AWS Account
            </span>

            <div className="font-medium">
              {accountId}
            </div>

          </div>

          <div>

            <span className="text-gray-500 text-sm">
              Role ARN
            </span>

            <div className="font-mono text-sm">
              {roleArn}
            </div>

          </div>

          <div className="flex gap-3 pt-3">

            <button
              onClick={onRunAudit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Run Audit
            </button>

            <button
              onClick={onDisconnect}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Disconnect
            </button>

          </div>

        </div>

      )}

    </div>

  );

}