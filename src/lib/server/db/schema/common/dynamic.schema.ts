import { uuid } from "drizzle-orm/pg-core";
import { AnimalTable } from "../animal.model";
import { MemberTable, OrganizationTable } from "../auth.model";

const animal_id = () => ({
  animal_id: uuid()
    .notNull()
    .references(() => AnimalTable.id, { onDelete: "cascade" }),
});

const member_id = () => ({
  member_id: uuid()
    .notNull()
    .references(() => MemberTable.id, { onDelete: "cascade" }),
});

const org_id = () => ({
  org_id: uuid()
    .notNull()
    .references(() => OrganizationTable.id, { onDelete: "cascade" }),
});

export const DynamicSchema = {
  org_id,
  member_id,
  animal_id,
};
