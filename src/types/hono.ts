import type { DbClient } from '@/db/create-db-client.js';
import type { RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { Session } from './auth.js';

export type HonoEnv = {
  Variables: {
    session: Session | null;
    dbClient: DbClient;
  };
};

export type AppRouteHandler<TRouteConfig extends RouteConfig> = RouteHandler<TRouteConfig, HonoEnv>;
