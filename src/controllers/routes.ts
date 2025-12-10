import serverRoutes from "./server/routes.js";
import usersRoutes from "./users/routes.js";
import authRoutes from "./auth/routes.js";
import orderRoutes from "./orders/routes.js";
import meRoutes from "./me/routes.js";

export const routes = [
  serverRoutes,
  meRoutes,
  usersRoutes,
  authRoutes,
  orderRoutes,
] as const;

export type AppRoutes = (typeof routes)[number];
