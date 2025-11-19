import usersRoutes from "./users/routes.js";
import authRoutes from "./auth/routes.js";

export const routes = [usersRoutes, authRoutes] as const;

export type AppRoutes = (typeof routes)[number];
