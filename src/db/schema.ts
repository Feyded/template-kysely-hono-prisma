import type {
  DB,
  OrderPaymentMethod,
  OrderStatus,
  UserRoleType,
  orders,
  users,
} from "./types.js";

/**
 * Utility type to override specific field types from database tables:
 * - DATE fields: converted to `Date | string` if not null else do `Date | string | null`
 * - JSON fields: specific type overrides
 * - w/ DEFAULT fields: any field with a default value
 * @example
 * type SampleTable = {
 *   id: Generated<string>; // w/o DEFAULT
 *   name: string; // w/o DEFAULT
 *   created_at: Generated<Timestamp>; // w/ DEFAULT
 *   updated_at: Generated<Timestamp>; // w/ DEFAULT
 *   deleted_at: Timestamp | null; // w/o DEFAULT
 *   status: Generated<UserStatusType>; // w/ DEFAULT
 *   json: unknown; // w/o DEFAULT
 *   is_active: Generated<boolean>; // w/ DEFAULT
 * };
 *
 * type OverrideSampleTable = Omit<OverrideCommonFields<SampleTable>, 'status'> & {
 *   status: UserStatusType;
 *   json: SomeJsonType;
 *   is_active: boolean;
 * };
 */
type OverrideCommonFields<TTable> = Omit<
  TTable,
  "id" | "created_at" | "updated_at" | "deleted_at"
> & {
  id: string;
  created_at: Date | string;
  updated_at: Date | string;
};

type OverrideUsers = Omit<OverrideCommonFields<users>, "role" | "is_active"> & {
  role: UserRoleType;
  is_active: boolean;
};

type OverrideOrders = Omit<OverrideCommonFields<orders>, "payment_method" | "status"> & {
  payment_method: OrderPaymentMethod;
  status: OrderStatus;
};

export type User = OverrideUsers;
export type Order = OverrideOrders;

export type KyselySchema = DB;
