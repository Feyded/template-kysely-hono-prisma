import { verify } from "@node-rs/bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "@/utils/jwt.js";

import { PrismaClient } from "@prisma/client";
import { NotFoundError } from "@/utils/error.js";

const prisma = new PrismaClient();

export const loginService = async (email: string, password: string) => {
  const user = await prisma.users.findFirst({ where: { email } });
  if (!user) throw new NotFoundError("User not found!");

  const valid = await verify(password, user.password);

  if (!valid) throw new Error("Invalid credentials");

  const accessToken = await generateAccessToken({
    id: user.id,
    email: user.email,
  });

  const refreshToken = await generateRefreshToken({
    id: user.id,
    email: user.email,
  });

  return { access_token: accessToken, refresh_token: refreshToken };
};

export const refreshTokenService = async (refreshToken: string) => {
  const payload = await verifyToken(refreshToken);
  if (!payload) throw new Error("Invalid token");

  const accessToken = await generateAccessToken({
    id: payload.id,
    role: payload.role,
  });
  return { accessToken };
};

export const logoutService = async (refreshToken: string) => {
  // await revokeRefreshToken(refreshToken);
  return { message: "Logged out successfully" };
};
