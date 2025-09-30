import { EMAIL } from "$lib/const/email";
import { EmailLive } from "$lib/services/email.service";
import { suc } from "$lib/utils/result.util";
import { fail } from "@sveltejs/kit";
import { Effect } from "effect";
import { message, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import z from "zod";
import type { PageServerLoad } from "./$types";

const contact_schema = z.object({
  email: z.email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const load = (async () => {
  return {
    form_input: await superValidate(zod4(contact_schema)),
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod4(contact_schema));
    if (!form.valid) {
      return fail(400, { form });
    }

    await EmailLive.send(EMAIL.TEMPLATES["admin-contact-form"](form.data)).pipe(
      Effect.runPromise,
    );

    return message(
      form,
      suc("Thanks for your message! We'll get back to you soon."),
    );
  },
};
