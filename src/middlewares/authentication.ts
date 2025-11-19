import { UnauthorizedError } from "@/utils/error.js";
import { verifyToken } from "@/utils/jwt.js";
import type { Context, Next } from "hono";

export async function authenticationMiddleware(c: Context, next: Next) {
  const accessToken = c.req.header("Authorization")?.split("Bearer ")[1];

  if (!accessToken) {
    throw new UnauthorizedError("token is required");
  }

  const verify = await verifyToken(accessToken);

  if (!verify) {
    throw new UnauthorizedError("Invalid token");
  }

  c.set("user", verify);

  await next();
}
