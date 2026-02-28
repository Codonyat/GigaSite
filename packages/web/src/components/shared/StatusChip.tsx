interface StatusChipProps {
  label: string;
  value: string;
  color?: string;
}

export function StatusChip({ label, value, color = "secondary" }: StatusChipProps) {
  const colorClass =
    color === "primary" ? "text-primary" :
    color === "secondary" ? "text-secondary" :
    `text-${color}`;

  return (
    <div className="flex items-center gap-1.5 bg-bg-card px-3 py-1 rounded-full border border-border text-xs">
      <span className="text-text-muted">{label}</span>
      <span className={colorClass}>{value}</span>
    </div>
  );
}
