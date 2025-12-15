import { config } from "dotenv";
import { z } from "zod";
import { STAGES } from "./const/env.js";

config();

export function isTest() {
  return process.env.NODE_ENV === "test";
}

const envSchema = z.object({
  APP_PORT: z.coerce.number().default(1234),
  STAGE: z.enum(STAGES).default(STAGES.Dev),
  DB_URL: z.string(),
  TEST_DB_URL: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
});

export const envConfig = envSchema.parse({
  APP_PORT: process.env.APP_PORT,
  STAGE: process.env.STAGE,
  DB_URL: process.env.DB_URL,
  TEST_DB_URL: process.env.TEST_DB_URL,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
});

export type EnvConfig = z.infer<typeof envSchema>;
