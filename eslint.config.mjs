// import js from "@eslint/js";
// import globals from "globals";
// import tseslint from "typescript-eslint";
// import { defineConfig } from "eslint/config";

// export default defineConfig([
//   { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], 
//     plugins: { js }, 
//     extends: ["js/recommended", "eslint-config-prettier"], 
//     languageOptions: { globals: globals.browser } 
//   },
//   { files: ["**/*.js"], 
//     languageOptions: { sourceType: "commonjs" } },
//   tseslint.configs.recommended, 
//   { ignores: ["node_modules/"] },
// ]);


import js from "@eslint/js";
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  { 
    files: ["**/*.{ts}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { globals: globals.node } 
  },
  tseslint.configs.recommended,
  eslintPluginPrettierRecommended
]);
