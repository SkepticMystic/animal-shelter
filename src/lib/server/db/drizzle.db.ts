import { DATABASE_URL } from "$env/static/private";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as AnimalModel from "./schema/animal.model";
import * as AnimalEventModel from "./schema/animal_event.model";
import * as AuthModels from "./schema/auth.model";
import * as ImageModel from "./schema/image.model";

if (!DATABASE_URL) throw new Error("DATABASE_URL is not set");

const client = neon(DATABASE_URL);

const {
  AccountTable,
  InvitationTable,
  MemberTable,
  OrganizationTable,
  PasskeyTable,
  SessionTable,
  UserTable,
  VerificationTable,
  ...auth_rest
} = AuthModels;

const { ImageTable, ...image_rest } = ImageModel;
const { AnimalTable, ...animal_rest } = AnimalModel;
const { AnimalEventTable, ...animal_event_rest } = AnimalEventModel;

export const db = drizzle(client, {
  casing: "snake_case",
  schema: {
    // Auth
    user: UserTable,
    account: AccountTable,
    session: SessionTable,
    verification: VerificationTable,
    organization: OrganizationTable,
    member: MemberTable,
    invitation: InvitationTable,
    passkey: PasskeyTable,
    ...auth_rest,

    animal: AnimalTable,
    ...animal_rest,

    image: ImageTable,
    ...image_rest,

    animal_event: AnimalEventTable,
    ...animal_event_rest,
  },
});
