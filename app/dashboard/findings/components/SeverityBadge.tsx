interface Props {
    severity: "HIGH" | "MEDIUM" | "LOW";
  }
  
  export default function SeverityBadge({ severity }: Props) {
    const colors = {
      HIGH: "bg-red-100 text-red-700",
      MEDIUM: "bg-yellow-100 text-yellow-700",
      LOW: "bg-green-100 text-green-700",
    };
  
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded ${colors[severity]}`}
      >
        {severity}
      </span>
    );
  }
  