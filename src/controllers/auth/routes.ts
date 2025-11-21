import { Hono } from "hono";
import { loginController } from "./index.js";
import { authenticationMiddleware } from "@/middlewares/authentication.js";

const router = new Hono()
  .post("/auth/login", loginController)

export default router;
