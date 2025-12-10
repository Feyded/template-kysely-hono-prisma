import type { HonoEnv } from "@/types/hono.js";
import { OpenAPIHono } from "@hono/zod-openapi";
import { getMyProfileRoute, getMyProfileRouteHandler } from "./get-my-profile.js";
import { updateMyProfileRoute, updateMyProfileRouteHandler } from "./update-my-profile.js";

const meRoutes = new OpenAPIHono<HonoEnv>();
meRoutes
  .openapi(getMyProfileRoute, getMyProfileRouteHandler)
  .openapi(updateMyProfileRoute, updateMyProfileRouteHandler);

export default meRoutes;
