import { useCountdown } from "../../hooks/useCountdown";
import { formatCountdown } from "@gigasite/shared";

interface Props {
  targetTimestamp: number;
  label?: string;
  className?: string;
}

export function CountdownTimer({ targetTimestamp, label, className }: Props) {
  const secondsLeft = useCountdown(targetTimestamp);

  return (
    <div className={className}>
      {label && <span className="text-text-muted text-xs">{label}</span>}
      <span className="font-heading font-bold text-secondary tabular-nums">
        {formatCountdown(secondsLeft)}
      </span>
    </div>
  );
}
