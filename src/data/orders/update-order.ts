import type { DbClient } from "@/db/create-db-client.js";
import type { OrderPaymentMethod, OrderStatus } from "@/db/types.js";
import { NotFoundError } from "@/utils/error.js";

type UpdateOrderDataArgs = {
  dbClient: DbClient;
  id: string;
  payload: {
    customer_name: string;
    payment_method: OrderPaymentMethod;
    status: OrderStatus;
    image_path: string | null;
    amount: number;
  };
};

export async function updateOrderData({
  dbClient,
  id,
  payload,
}: UpdateOrderDataArgs) {
  await dbClient
    .selectFrom("orders")
    .where("id", "=", id)
    .executeTakeFirstOrThrow(() => new NotFoundError("Order not found."));

  return await dbClient
    .updateTable("orders")
    .set(payload)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}
