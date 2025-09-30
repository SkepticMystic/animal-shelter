import { AdminClient } from "$lib/clients/admin.client";
import Time from "$lib/components/Time.svelte";
import UserAvatar from "$lib/components/ui/avatar/UserAvatar.svelte";
import { renderComponent } from "$lib/components/ui/data-table";
import SingleSelect from "$lib/components/ui/select/SingleSelect.svelte";
import { ADMIN, type IAdmin } from "$lib/const/admin.const";
import type { User } from "$lib/server/db/schema/auth.model";
import { TanstackTable } from "$lib/utils/tanstack/table.util.svelte";

export const columns = TanstackTable.make_columns<User>({
  columns: [
    {
      id: "avatar",
      enableHiding: false,
      enableSorting: false,

      cell: ({ row }) => renderComponent(UserAvatar, { user: row.original }),
    },
    {
      accessorKey: "name",
      meta: { label: "Name" },
    },
    {
      accessorKey: "email",
      meta: { label: "Email" },
    },
    {
      accessorKey: "role",
      meta: { label: "Role" },

      cell: ({ row }) =>
        renderComponent(SingleSelect, {
          value: row.original.role,
          options: ADMIN.ROLES.OPTIONS,

          on_value_select: (value) =>
            AdminClient.update_user_role({
              userId: row.original.id,
              role: value as IAdmin.RoleId,
            }),
        }),
    },

    {
      accessorKey: "createdAt",
      meta: { label: "Join date" },

      cell: ({ row }) =>
        renderComponent(Time, { date: row.original.createdAt }),
    },
  ],

  actions: [
    {
      kind: "item",
      icon: "lucide/user-circle",
      title: "Impersonate user",

      onselect: (row) => AdminClient.impersonate_user(row.original.id),
    },
    { kind: "separator" },
    {
      kind: "item",

      title: (row) => (row.original.banned ? "Unban user" : "Ban user"),
      icon: (row) =>
        row.original.banned ? "lucide/check-circle-2" : "lucide/ban",

      onselect: (row) =>
        row.original.banned
          ? AdminClient.unban_user(row.original.id)
          : AdminClient.ban_user(row.original.id, {}),
    },
    {
      kind: "item",
      icon: "lucide/x",
      title: "Delete user",

      onselect: (row) => AdminClient.delete_user(row.original.id),
    },
  ],
});
