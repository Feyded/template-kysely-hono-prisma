import type { HonoEnv } from "@/types/hono.js";
import { OpenAPIHono } from "@hono/zod-openapi";
import { getOrdersRoute, getOrdersRouteHandler } from "./get-orders.js";
import { createOrderRoute, createOrderRouteHandler } from "./create-order.js";
import { updateOrderRoute, updateOrderRouteHandler } from "./update-order.js";

const ordersRoutes = new OpenAPIHono<HonoEnv>();
ordersRoutes
  .openapi(getOrdersRoute, getOrdersRouteHandler)
  .openapi(createOrderRoute, createOrderRouteHandler)
  .openapi(updateOrderRoute, updateOrderRouteHandler);
  
export default ordersRoutes;
