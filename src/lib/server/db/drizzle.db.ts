import { DATABASE_URL } from "$env/static/private";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as AnimalModel from "./schema/animal.model";
import * as AnimalEventModel from "./schema/animal_event.model";
import * as AuthModels from "./schema/auth.model";
import * as ImageModel from "./schema/image.model";
import * as ShelterModel from "./schema/shelter.model";

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
const { ShelterTable, ...shelter_rest } = ShelterModel;

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

    image: ImageTable,
    ...image_rest,

    shelter: ShelterTable,
    ...shelter_rest,

    animal: AnimalTable,
    ...animal_rest,

    animal_event: AnimalEventTable,
    ...animal_event_rest,
  },
});
