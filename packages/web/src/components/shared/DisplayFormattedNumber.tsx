import { formatUSDmore } from "@gigasite/shared";

interface Props {
  value: bigint;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function DisplayFormattedNumber({ value, decimals = 2, prefix, suffix, className }: Props) {
  return (
    <span className={className}>
      {prefix}{formatUSDmore(value, decimals)}{suffix}
    </span>
  );
}
