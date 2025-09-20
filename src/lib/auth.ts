import { dev } from "$app/environment";
import { getRequestEvent } from "$app/server";
import {
  BETTER_AUTH_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "$env/static/private";
import { betterAuth, type Session } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, haveIBeenPwned, organization } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { Effect } from "effect";
import { AdminAccessControl, type IAdmin } from "./const/admin.const";
import { APP } from "./const/app";
import { AUTH } from "./const/auth.const";
import { EMAIL } from "./const/email";
import {
  OrganizationAccessControl,
  type IOrganization,
} from "./const/organization.const";
import { db } from "./server/db/drizzle.db";
import { redis } from "./server/db/redis.db";
import {
  AccountTable,
  InvitationTable,
  MemberTable,
  OrganizationTable,
  PasskeyTable,
  SessionTable,
  UserTable,
  VerificationTable,
} from "./server/db/schema/auth.model";
import { ShelterTable } from "./server/db/schema/shelter.model";
import { EmailLive, EmailService, EmailTest } from "./services/email.service";
import { Log } from "./utils/logger.util";

// SECTION: betterAuth init
export const auth = Effect.runSync(
  Effect.gen(function* () {
    const email = yield* EmailService;

    return betterAuth({
      appName: APP.NAME,

      // NOTE: Can't get this working...
      // It seems like the behaviour is different when setting baseURL
      // versus just using the BETTER_AUTH_URL env var
      // baseURL: APP.URL,

      // .env is not explicitly loaded in prod, so we import it
      // Rather than running dotenv, or something
      secret: BETTER_AUTH_SECRET,

      logger: {
        level: "debug",
        log: (level, message, ...args) => {
          Log[level]({ args }, message);
        },
      },

      telemetry: {
        enabled: false,
      },

      databaseHooks: {
        session: {
          create: {
            before: async (session, ctx) => {
              // Log users back in to their org, if they had one
              const org = await get_member_org(session);

              return {
                data: {
                  ...session,
                  member_id: org ? org.member_id : null,
                  member_role: org ? org.member_role : null,
                  activeOrganizationId: org ? org.org_id : null,
                },
              };
            },
          },

          update: {
            // before: async (session, ctx) => {
            //   console.log(ctx);
            //   const ctx_session = ctx?.context.session;
            //   console.log({ session, ctx_session }, "session.update.before");
            //   // If no session (shouldn't happen, otherwise we'd be in the create hook),
            //   // or no active org, just return the session as-is
            //   if (!ctx_session?.session.activeOrganizationId) {
            //     return { data: session as Session };
            //   }
            //   const member = await db.query.member.findFirst({
            //     columns: { id: true, role: true },
            //     where: (member, { eq, and }) =>
            //       and(
            //         eq(member.userId, ctx_session.session.userId),
            //         eq(
            //           member.organizationId,
            //           ctx_session.session.activeOrganizationId,
            //         ),
            //       ),
            //   });
            //   return {
            //     data: {
            //       ...ctx_session?.session,
            //       member_id: member ? member.id : null,
            //       member_role: member ? member.role : null,
            //       activeOrganizationId:
            //         ctx_session?.session.activeOrganizationId,
            //     },
            //   };
            // },
            // after: async (session, ctx) => {
            //   console.log("session.update.after ctx", ctx);
            //   console.log("session.update.after session", session);
            //   //   console.log(ctx);
            //   //   const ctx_session = ctx?.context.session;
            //   //   console.log({ session, ctx_session }, "session.update.before");
            //   // If no session (shouldn't happen, otherwise we'd be in the create hook),
            //   // or no active org, just return the session as-is
            //   if (typeof session.activeOrganizationId !== "string") {
            //     return;
            //   }
            //   const member = await db.query.member.findFirst({
            //     where: (member, { eq, and }) =>
            //       and(
            //         eq(member.userId, session.userId),
            //         eq(
            //           member.organizationId,
            //           session.activeOrganizationId as string,
            //         ),
            //       ),
            //     columns: { id: true, role: true },
            //   });
            //   ctx?.context.session;
            //   // ctx?.context.setNewSession({});
            //   // return {
            //   //   data: {
            //   //     ...session,
            //   //     member_id: member ? member.id : null,
            //   //     member_role: member ? member.role : null,
            //   //     activeOrganizationId: session.activeOrganizationId,
            //   //   },
            //   // };
            // },
          },
        },
      },

      advanced: {
        database: {
          // NOTE: Let drizzle generate IDs, as BetterAuth's nanoid causes issues
          // We want UUIDs everywhere, so that the image table can reference resource_id in a generic way
          generateId: false,
        },
      },

      database: drizzleAdapter(db, {
        provider: "pg",
        debugLogs: false,
        // NOTE: Neon doesn't support transactions
        transaction: false,

        schema: {
          user: UserTable,
          account: AccountTable,
          session: SessionTable,
          verification: VerificationTable,
          organization: OrganizationTable,
          member: MemberTable,
          invitation: InvitationTable,
          passkey: PasskeyTable,
        },
      }),

      session: {
        storeSessionInDatabase: false,
        cookieCache: {
          enabled: true,
          maxAge: 5 * 60, // Cache duration in seconds
        },

        additionalFields: {
          // NOTE: These are set in the session create hook below
          member_id: {
            type: "string",
            input: false,
            returned: true,
            defaultValue: null,
          },
          member_role: {
            type: "string",
            input: false,
            returned: true,
            defaultValue: null,
          },
        },
      },

      user: {
        deleteUser: { enabled: true },
      },

      account: {
        accountLinking: {
          enabled: true,
          updateUserInfoOnLink: true,
          // SOURCE: https://www.better-auth.com/docs/concepts/users-accounts#forced-linking
          // NOTE: Links profile even if email isn't verified on provider side
          trustedProviders: AUTH.PROVIDERS.IDS.filter(
            (id) => AUTH.PROVIDERS.MAP[id].force_email_verified,
          ),
        },
      },

      emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        revokeSessionsOnPasswordReset: true,

        sendResetPassword: ({ user, url }) =>
          Effect.runPromise(
            email.send(EMAIL.TEMPLATES["password-reset"]({ url, user })),
          ),
      },

      emailVerification: {
        sendOnSignUp: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: true,

        sendVerificationEmail: ({ user, url }) =>
          Effect.runPromise(
            email.send(EMAIL.TEMPLATES["email-verification"]({ url, user })),
          ),
      },

      socialProviders: {
        google:
          GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET
            ? {
                // Always prompt the user to select an account
                prompt: "select_account",
                clientId: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
              }
            : undefined,
      },

      plugins: [
        admin({
          ...AdminAccessControl,
        }),

        passkey({
          rpName: APP.NAME,
          rpID: new URL(APP.URL).hostname,
        }),

        haveIBeenPwned({
          customPasswordCompromisedMessage:
            "That password has been compromised in a data breach. Please choose a different one.",
        }),

        organization({
          ...OrganizationAccessControl,

          organizationLimit: 5,
          allowUserToCreateOrganization: (user) => {
            const role = user.role as IAdmin.RoleId;

            return AdminAccessControl.roles[role].authorize({
              organization: ["create"],
            }).success;
          },

          cancelPendingInvitationsOnReInvite: true,
          requireEmailVerificationOnInvitation: true,
          sendInvitationEmail: (data) =>
            Effect.runPromise(email.send(EMAIL.TEMPLATES["org-invite"](data))),

          organizationHooks: {
            afterCreateOrganization: async ({ organization }) => {
              await db
                .insert(ShelterTable)
                .values({
                  name: organization.name,
                  org_id: organization.id,
                })
                .execute();
            },
          },
        }),

        // NOTE: Must be last, as it needs the request event
        // SOURCE: https://www.better-auth.com/docs/integrations/svelte-kit#server-action-cookies
        sveltekitCookies(getRequestEvent),
      ],

      // SOURCE: https://www.better-auth.com/docs/concepts/database#secondary-storage
      secondaryStorage: {
        get: (key) => redis!.get(key),
        set: async (key, value, ttl) => {
          if (ttl) await redis!.set(key, value, "EX", ttl);
          else await redis!.set(key, value);
        },

        delete: async (key) => {
          await redis!.del(key);
        },
      },
    });
  }).pipe(
    Effect.provideService(
      EmailService,
      dev //
        ? EmailTest
        : EmailLive,
    ),
  ),
);

// !SECTION

// SECTION: Helper functions
const get_member_org = async (
  session: Session,
): Promise<{
  org_id: string;
  member_id: string;
  member_role: IOrganization.RoleId;
} | null> => {
  // NOTE: Order is preserved when logging, so show ctx first
  const log = Log.child({
    ctx: "[session.create.before]",
    userId: session.userId,
  });

  const member = await db.query.member.findFirst({
    where: (member, { eq }) => eq(member.userId, session.userId),
    columns: {
      id: true,
      role: true,
      organizationId: true,
    },
  });
  if (!member) {
    return null;
  }

  log.debug(
    { organizationId: member.organizationId },
    "Found existing organization",
  );
  return {
    member_id: member.id,
    member_role: member.role,
    org_id: member.organizationId,
  };
};
