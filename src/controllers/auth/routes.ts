import { Hono } from "hono";
import { loginController, refreshTokenController } from "./index.js";
import { authenticationMiddleware } from "@/middlewares/authentication.js";

const router = new Hono()
  .post("/auth/login", loginController)
  .post("/refresh-token", refreshTokenController);

export default router;
