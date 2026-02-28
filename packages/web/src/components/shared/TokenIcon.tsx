interface Props {
  token: "USDmore" | "USDmY" | "USDm";
  size?: number;
  className?: string;
}

const colors: Record<string, string> = {
  USDmore: "bg-secondary",
  USDmY: "bg-accent-purple",
  USDm: "bg-accent-gold",
};

export function TokenIcon({ token, size = 24, className }: Props) {
  return (
    <div
      className={`rounded-full flex items-center justify-center text-bg font-bold text-xs ${colors[token]} ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      {token[0]}
    </div>
  );
}
