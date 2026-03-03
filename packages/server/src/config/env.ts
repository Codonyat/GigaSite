import { z } from "zod";

const envSchema = z.object({
  RPC_URL: z.string().url(),
  RPC_WSS_URL: z.string().refine((s) => s.startsWith("wss://") || s.startsWith("ws://"), {
    message: "RPC_WSS_URL must start with ws:// or wss://",
  }),
  CONTRACT_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  SUBGRAPH_URL: z.string().url().optional(),
  SUBGRAPH_API_TOKEN: z.string().optional(),
  PORT: z.coerce.number().default(8080),
  FRONTEND_URLS: z.string().default("http://localhost:5173"),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("Invalid environment variables:", result.error.format());
    process.exit(1);
  }
  return result.data;
}

export const env = loadEnv();
