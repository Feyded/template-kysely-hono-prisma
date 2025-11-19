import {
  createUserData,
  getUserData,
  getUsersData,
  updateUserData,
} from "@/data/user.js";
import { type Context } from "hono";
import { StatusCodes } from "http-status-codes";

export async function getUsersController(c: Context) {
  const users = await getUsersData();

  return c.json(users, StatusCodes.OK);
}

export async function getUserController(c: Context) {
  const { id } = c.req.param();

  const user = await getUserData(id);

  return c.json(user, StatusCodes.OK);
}

export async function createUserController(c: Context) {
  const body = await c.req.json();

  const createdUser = await createUserData(body);

  return c.json(createdUser, StatusCodes.CREATED);
}

export async function updateUserController(c: Context) {
  const { id } = c.req.param();

  const body = await c.req.json();

  const updatedUser = await updateUserData(id, body);

  return c.json(updatedUser, StatusCodes.OK);
}

export async function getMeController(c: Context) {
  const authUser = c.get("user");

  const user = await getUserData(authUser.id);
  
  return c.json(user, StatusCodes.OK);
}
