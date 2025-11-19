import { loginService, refreshTokenService } from "@/services/auth.js";
import { PrismaClient } from "@prisma/client";
import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

export async function loginController(c: Context) {
  const body = await c.req.json();
  const token = await loginService(body.email, body.password);
  return c.json(token, StatusCodes.OK);
}

//double check the this controller and jump to refresh token service
export async function refreshTokenController(c: Context) {
  const refreshToken = await c.req.json();
  const token = await refreshTokenService(refreshToken);
  return c.json(token, StatusCodes.OK);
}
