const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type RoleKey = keyof typeof ROLES;
export type ROLE = (typeof ROLES)[RoleKey];
