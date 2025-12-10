import { orderSchemaOpenApi } from "./orders/schema.js";
import { userSchemaOpenApi } from "./users/schema.js";

export const schemas = {
  User: userSchemaOpenApi,
  Order: orderSchemaOpenApi,
} as const;
