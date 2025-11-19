import { authenticationMiddleware } from "@/middlewares/authentication.js";
import { Hono } from "hono";
import {
  createUserController,
  getMeController,
  getUserController,
  getUsersController,
  updateUserController,
} from "./index.js";

const router = new Hono()
  .get("/me", authenticationMiddleware, getMeController)
  .get("/users", authenticationMiddleware, getUsersController)
  .post("/users", createUserController)
  .get("/users/public", (c) => c.text("Public User"))
  .get("/users/:id", authenticationMiddleware, getUserController)
  .put("/users/:id", authenticationMiddleware, updateUserController);

export default router;
