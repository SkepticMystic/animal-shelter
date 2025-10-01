import { AdminClient } from "$lib/clients/admin.client";
import Time from "$lib/components/Time.svelte";
import UserAvatar from "$lib/components/ui/avatar/UserAvatar.svelte";
import { renderComponent } from "$lib/components/ui/data-table";
import SingleSelect from "$lib/components/ui/select/SingleSelect.svelte";
import { ADMIN, type IAdmin } from "$lib/const/admin.const";
import type { User } from "$lib/server/db/schema/auth.model";
import { TanstackTable } from "$lib/utils/tanstack/table.util.svelte";

export const columns = TanstackTable.make_columns<User>(
  ({ display, accessor }) => ({
    columns: [
      display({
        id: "avatar",
        enableHiding: false,
        enableSorting: false,

        cell: ({ row }) => renderComponent(UserAvatar, { user: row.original }),
      }),
      accessor("name", {
        meta: { label: "Name" },
      }),
      accessor("email", {
        meta: { label: "Email" },
      }),
      accessor("role", {
        meta: { label: "Role" },

        cell: ({ getValue, row }) =>
          renderComponent(SingleSelect, {
            value: getValue(),
            options: ADMIN.ROLES.OPTIONS,

            on_value_select: (value) =>
              AdminClient.update_user_role({
                userId: row.original.id,
                role: value as IAdmin.RoleId,
              }),
          }),
      }),

      accessor("createdAt", {
        meta: { label: "Join date" },

        cell: ({ getValue }) => renderComponent(Time, { date: getValue() }),
      }),
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
  }),
);
