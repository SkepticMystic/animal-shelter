import adapter from "@sveltejs/adapter-vercel";
import { sveltePreprocess } from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [sveltePreprocess({ postcss: true })],

  kit: {
    adapter: adapter(),

    experimental: {
      remoteFunctions: true,
    },
  },

  // NOTE: experimental.async breaks GooglePlacesAutocomplete
  compilerOptions: {},
};

export default config;
