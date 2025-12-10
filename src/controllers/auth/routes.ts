import type { HonoEnv } from "@/types/hono.js";
import { OpenAPIHono } from "@hono/zod-openapi";
import { loginRoute, loginRouteHandler } from "./login.js";

const authRoutes = new OpenAPIHono<HonoEnv>().openapi(
  loginRoute,
  loginRouteHandler
);

export default authRoutes;
