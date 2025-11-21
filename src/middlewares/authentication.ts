import { UnauthorizedError } from "@/utils/error.js";
import {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/utils/jwt.js";
import type { Context, Next } from "hono";
import { setCookie, getCookie } from "hono/cookie";

export async function authenticationMiddleware(c: Context, next: Next) {
  let accessToken = getCookie(c, "auth__access_token");

  let verifiedAccessToken = accessToken ? await verifyAccessToken(accessToken) : null;

  if (!verifiedAccessToken) {
    const refreshToken = getCookie(c, "auth__refresh_token");

    if (!refreshToken) {
      throw new UnauthorizedError("refresh token is required");
    }

    const verifiedRefreshToken = await verifyRefreshToken(refreshToken);

    if (!verifiedRefreshToken) {
      throw new UnauthorizedError("Invalid Refresh token");
    }

    accessToken = await generateAccessToken({
      id: verifiedRefreshToken.id as string,
      email: verifiedRefreshToken.email as string,
    });

    setCookie(c, "auth__access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    verifiedAccessToken = await verifyAccessToken(accessToken);
  }

  c.set("user", verifiedAccessToken);

  return next();
}