import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  // Add this configuration for JSX runtime support
  {
    rules: {
      // Merge rules from pluginReact.configs.flat.recommended with this setting
      ...pluginReact.configs.flat["jsx-runtime"].rules,
    },
  },
];
