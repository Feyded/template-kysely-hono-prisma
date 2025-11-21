import { loginService } from "@/services/auth.js";
import { PrismaClient } from "@prisma/client";
import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

export async function loginController(c: Context) {
  const body = await c.req.json();
  const tokens = await loginService(body.email, body.password);

  setCookie(c, "auth__access_token", tokens.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  setCookie(c, "auth__refresh_token", tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return c.json(
    { access_token: tokens.accessToken, refresh_token: tokens.refreshToken },
    StatusCodes.OK
  );
}