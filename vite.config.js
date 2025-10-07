import { sentrySvelteKit } from "@sentry/sveltekit";
import { partytownVite } from "@qwik.dev/partytown/utils";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import devtoolsJson from "vite-plugin-devtools-json";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: "ross-keenan",
        project: "animal-shelter",
      },
    }),
    tailwindcss(),
    sveltekit(),
    devtoolsJson(),
    partytownVite({ debug: false }),
  ],

  define: {
    // SOURCE: https://www.npmjs.com/package/carta-md#flags
    __ENABLE_CARTA_SSR_HIGHLIGHTER__: false,
  },
};

export default config;
