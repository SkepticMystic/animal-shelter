import type { SelectOption } from "$lib/interfaces";
import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  userAc,
} from "better-auth/plugins/admin/access";

const ROLE_IDS = ["user", "manager", "admin"] as const;
const ROLE_MAP = {
  user: { label: "User" },
  manager: { label: "Manager" },
  admin: { label: "Admin" },
} satisfies Record<IAdmin.RoleId, { label: string }>;

export declare namespace IAdmin {
  type RoleId = (typeof ROLE_IDS)[number];
}

export const ADMIN = {
  ROLES: {
    IDS: ROLE_IDS,
    MAP: ROLE_MAP,
    OPTIONS: ROLE_IDS.map((id) => ({
      value: id,
      label: ROLE_MAP[id].label,
    })) satisfies SelectOption[],
  },
};

const statement = {
  ...defaultStatements,
  organization: ["create", "update", "delete"],
} as const;

const ac = createAccessControl(statement);
export const AdminAccessControl = {
  ac,

  roles: {
    user: ac.newRole({
      ...userAc.statements,
      organization: [],
    }),

    manager: ac.newRole({
      ...userAc.statements,
      organization: ["create", "update", "delete"],
    }),

    admin: ac.newRole({
      ...adminAc.statements,
      organization: ["create", "update", "delete"],
    }),
  } satisfies Record<IAdmin.RoleId, ReturnType<typeof ac.newRole>>,
};
