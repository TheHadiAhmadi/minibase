import adapter from "@sveltejs/adapter-vercel";
import preprocess from "svelte-preprocess";
import path from "path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),
    alias: {
      $services: path.resolve("./src/services"),
      $components: path.resolve("./src/components"),
      $types: path.resolve("./src/types"),
      $stores: path.resolve("./src/stores"),
      $server: path.resolve("./src/server"),
    },
  },
};

export default config;
