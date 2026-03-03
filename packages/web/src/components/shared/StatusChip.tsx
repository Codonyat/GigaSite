interface StatusChipProps {
  label: string;
  value: string;
  color?: string;
}

const colorMap: Record<string, string> = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  "text-secondary": "var(--color-text-secondary)",
};

export function StatusChip({ label, value, color = "secondary" }: StatusChipProps) {
  const valueColor = colorMap[color] || "var(--color-text-primary)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.375rem",
        background: "var(--color-background-card)",
        padding: "0.25rem 0.75rem",
        borderRadius: "9999px",
        border: "1px solid var(--color-border)",
        fontSize: "0.75rem",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ color: "var(--color-text-muted)", fontWeight: 500 }}>{label}</span>
      <span style={{ color: valueColor, fontWeight: 600, fontFamily: "'Space Grotesk', monospace" }}>{value}</span>
    </div>
  );
}
