import type { DbClient } from "@/db/create-db-client.js";
import type { OrderPaymentMethod, OrderStatus } from "@/db/types.js";

type CreateOrderDataArgs = {
  dbClient: DbClient;
  payload: {
    customer_name: string;
    payment_method: OrderPaymentMethod;
    status: OrderStatus;
    image_path: string | null;
    amount: number;
  };
};

export async function createOrderData({
  dbClient,
  payload,
}: CreateOrderDataArgs) {
  const order = await dbClient
    .insertInto("orders")
    .values(payload)
    .returningAll()
    .executeTakeFirst();

  return order;
}
